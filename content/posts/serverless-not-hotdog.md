---
title: "Serverless \"Not Hotdog\""
date: "2019-04-28"
originalUrl: "https://hackernoon.com/serverless-not-hotdog-dd473cf6506a"
---

## Building a serverless image classifier using fast.ai, AWS Sagemaker and Lambda.

*Update (May 2019): try it out for yourself at https://hotdog-or-not.netlify.com/*

Ever since the "Not Hotdog" app featured on HBO's Silicon Valley, and Tim Anglade's [comprehensive article](https://medium.com/@timanglade/how-hbos-silicon-valley-built-not-hotdog-with-mobile-tensorflow-keras-react-native-ef03260747f3) on how they built this with TensorFlow, I felt challenged to reproduce this with less code and a serverless computing model.

Now, thanks to the [fantastic course from fast.ai](https://course.fast.ai/) and the release of Lambda Layers at re:Invent last year, I have finally managed to train a model (with an accuracy of 93% on this [Kaggle dataset](https://www.kaggle.com/dansbecker/hot-dog-not-hot-dog/data)) and deploy it to a Lambda function using a [PyTorch](https://pytorch.org/) layer and the [serverless framework](https://serverless.com/). What surprised me most is that it took me less than 10 minutes to train a decent enough classifier using transfer learning, and about 1–2 seconds to make a prediction.

I am convinced that the mix of [AWS Sagemaker](https://aws.amazon.com/sagemaker/) for model training with [AWS Lambda](https://aws.amazon.com/lambda/) for model inference is a winning combination. The beauty of the serverless model for machine learning is that you can do both training and inference and spend just a couple of dollars. Furthermore, running inference of Lambda means that you can put such a model into production without worrying about cost nor scaling (AWS [claims](https://aws.amazon.com/machine-learning/elastic-inference/) that 90% of GPU costs are spent on inference).

In this post, I'll walk you through model training (using [fast.ai](https://docs.fast.ai/), [Pytorch](https://pytorch.org/) and a GPU-enabled Jupyter notebook instance on AWS Sagemaker), deploying our model to S3 and Lambda, and finally running this at scale in production.

## Model training

Model training has the best performance on GPU, and AWS Sagemaker makes it easy to set up a Jupyter notebook. At $1.26/hour, a `ml.p2.large` instance is a very cost-efficient way to get started with model training without having to spend big bucks.

I began by building a model based on [resnet50](https://arxiv.org/abs/1512.03385), a highly performant model trained on [ImageNet](http://www.image-net.org/). I use [Kaggle's hotdog or no hotdog dataset](https://www.kaggle.com/dansbecker/hot-dog-not-hot-dog) which contains a set of hot-dog and no-hot-dog (other food types) images. The data is split between a training set and a test set, with 500 images each (250 images of hot dogs, 250 images of other food types).

```python
data = ImageDataBunch.from_folder(path, ds_tfms=get_transforms(), size=400).normalize(imagenet_stats)
```

Using [transfer learning](http://ruder.io/transfer-learning/) — i.e. reusing a pre-trained model — is a very successful technique in image recognition, and [fast.ai](https://fast.ai) makes it dead easy to implement:

```python
learn = cnn_learner(data, models.resnet50, metrics=accuracy)
```

At this point, we are ready to start the actual training of the model, and I followed the classic recipe of initially training the last layer in the model, finding optimal learning rates, unfreezing the model, and retraining all previous layers of the model.

```python
learn.fit_one_cycle(5)

# Find the optimal learning rates for training previous layers
learn.lr_find()
learn.recorder.plot()

# Unfreeze our model and continue training
learn.unfreeze()
learn.fit_one_cycle(20, max_lr=slice(1e-6,1e-4))
```

After training, I reached an accuracy of 93%. Only 35 out of 500 test images were incorrectly classified, and it's harder to classify food as hotdog rather than the opposite: 25 pictures are mistakenly identified as a hotdog while only ten hotdog predictions aren't hotdogs.

The key to obtaining reasonable accuracy is to try different things. In my experimentation, I changed the network architecture from resnet35 to resnet50, tried different learning rates, and changed the size of the input images (I found that 400x400 pixels worked better than the traditional 224x224 pixels). While state-of-the-art for this particular problem space is probably around 98% accuracy, I am more than happy to reach 93% accuracy, especially considering that my training set is rather small (remember: we have *only* 500 images for each category).

Moreover, I didn't want to spend hours waiting for my model to train. Instead, with fast.ai handy default settings and intuitive top-down learning approach, and using an existing image classifier network architecture, I knew I could reach good accuracy *in just a couple of minutes.* In fact, fast.ai [recently managed to set the record of training ImageNet in only 18 minutes to 93% accuracy](https://www.fast.ai/2018/08/10/fastai-diu-imagenet/). These guys are on a serious mission to change the way we do machine learning forever.

## Exporting our classifier to S3

To use our trained model for inference — i.e. for actual predictions on new images — we need to export and store our model in the cloud.

PyTorch can easily export your model into [TorchScript](https://pytorch.org/docs/master/jit.html). What you need to know here is that whenever you have a model in TorchScript, you can use this model without needing a Python environment. Pretty neat, no?

```python
save_texts(path/'models/classes.txt', data.classes)
trace_input = torch.ones(1,3,img_size,img_size).cuda()
jit_model = torch.jit.trace(learn.model.float(), trace_input)
model_file='cr_jit.pth'
output_path = str(path/f'models/{model_file}')
torch.jit.save(jit_model, output_path)
```

Our final TorchScript model is 103 MB, and we now need to zip this up together with our classes file (hot dog, no hot dog).

```python
tar_file=path/'models/model.tar.gz'
classes_file='classes.txt'
with tarfile.open(tar_file, 'w:gz') as f:
    f.add(path/f'models/{model_file}', arcname=model_file)
    f.add(path/f'models/{classes_file}', arcname=classes_file)
```

Finally, we want to upload the model to an S3 bucket `fastai-model` so our Lambda function can use it in the next step.

```python
s3 = boto3.resource('s3')
s3.meta.client.upload_file(str(tar_file), 'fastai-model', 'hotdog/model.tar.gz')
```

## Deploying to AWS Lambda

Once we've got our model in S3, the next step is to have the predictor run on Lambda, so we can make predictions without having to pay for infrastructure left idle.

I use the excellent Fast.ai guide on [Deploying on AWS Lambda](https://course.fast.ai/deployment_aws_lambda.html), but instead of using AWS's [SAM](https://docs.aws.amazon.com/serverless-application-model/index.html) I adopted [the code](https://github.com/fastai/course-v3/blob/master/docs/production/aws-lambda.zip) to work with the node.js [Serverless framework](https://serverless.com/), which is a long-time favourite of mine when it comes to managing serverless workloads.

The relevant bit of the `serverless.yml` is the function declaration is

```yaml
functions:
  hotdog:
    environment:
      MODEL_BUCKET: fastai-model
      MODEL_KEY: hotdog/model.tar.gz
    handler: handler.lambda_handler
    layers:
      - arn:aws:lambda:us-east-1:934676248949:layer:pytorchv1-py36:1
    events:
      - http:
          path: invoke
          method: post
```

We use the magic of Lambda layers to pull all libraries required to run our model inference. Before the release of Lambda layers at re:Invent 2018, you'd have to package up all your dependencies into a ZIP file, make sure it's compatible with Lambda's AWS Linux environment, all the while keeping the total package size less than 250 MB.

Now, you can include publicly available layers (thanks to [Matt McClean](https://github.com/mattmcclean) for sorting out a set of Pytorch layers), deploy and run. No need to mess around with Docker locally.

To deploy this, we run:

```
serverless deploy
```

Have a look at the codebase [here](https://github.com/pvhee/fastai-hotdog).

## Inference in production

The most exciting bit is to see how our model performs in production, on images it has never seen before.

Let's start with a simple hotdog image:

```
curl -d "{\"url\":\"https://leitesculinaria.com/wp-content/uploads/fly-images/96169/best-hot-dog-recipe-fi-400x300-c.jpg\"}" -H "Content-Type: application/json" -X POST https://c5nostwq4c.execute-api.us-east-1.amazonaws.com/dev/invoke

{"class": "hot_dog", "confidence": 0.9999924898147583}
```

As expected, our classifier predicts this to be a `hot_dog` with 99.99% confidence.

Let's see if it can distinguish a hotdog from Mexican fajitas:

```
{"class": "not_hot_dog", "confidence": 0.8462255001068115}
```

Nice! We're reasonably confident that that wasn't a hotdog.

## Predicting at scale

One of the coolest features of Lambda is that scaling is something you don't have to worry about — at least not with our simple predictor which doesn't have downstream dependencies which could be your bottleneck.

To test this, let's run our predictor on a set of 1000 images randomly sampled from the [ImageNet](http://www.image-net.org/) database.

Using [artillery.io](https://artillery.io/) node library, it's easy to simulate ~900 or so requests in less than a minute.

```
All virtual users finished
Summary report @ 21:48:05(+0100) 2019-04-27
   Scenarios launched:  904
   Scenarios completed: 904
   Requests completed:  904
   RPS sent: 14.63
   Request latency:
      min: 371.2
      max: 3139.4
      median: 1357.9
      p95: 1950.6
      p99: 2355.5
```

You can see that for 95% of the requests our predictor returned a result in less than two seconds (the p95, or the 95th percentile) — which including passing the image to our predictor. Not bad!

## Thoughts on Serverless machine learning

The original classifier was architected to run inference on a mobile device. Therefore much work went into making this fit that particular computing environment. For real-world scenarios, having a REST endpoint available for making POST requests which return a classification result is more than sufficient. Equally, training your models in a GPU-enabled cloud environment such as Sagemaker makes this pleasant and easy to get started.

My preferred method to deploy any code to the cloud involves AWS Lambda. I am a firm believer that the serverless paradigm will rapidly take over and become the primary programming model for cloud-native applications. Therefore, I was pleased to get this last bit working without much effort — and I believe serverless inference will become the primary mechanism of running predictions at scale. It also clearly shows you don't need the power of a GPU for anything other than training your model. A simple Lambda with 1Gig of RAM does the trick.

*Check out the code repository with the serverless template [here](https://github.com/pvhee/fastai-hotdog) and the Jupyter notebook I used for model training [here](https://github.com/pvhee/fastai-hotdog/blob/master/notebooks/hotdog.ipynb).*

*Finally, a massive thanks to [Jeremy Howard](https://twitter.com/jeremyphoward) from [fast.ai](https://fast.ai) for making machine learning so easy and enjoyable.*
