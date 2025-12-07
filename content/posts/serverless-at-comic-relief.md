---
title: "Serverless at Comic Relief"
date: "2018-07-12"
originalUrl: "https://technology.comicrelief.com/2018/07/12/serverless-at-comic-relief/"
---

It has been over a year since we first embarked on our serverless journey at Comic Relief, and our functions have been happily running in production ever since. We've invoked over 40 different functions — millions of times — and spent no more than a couple of hundred dollars, most of which spent on invoking functions hammering our servers as part of load testing.

![Serverless at Comic Relief](/images/posts/serverless-at-comic-relief.jpeg)

We built APIs on top of various databases, simplified our [contact service](https://www.comicrelief.com/contact-us), built a [step counter service for UK schools participating in our billion steps challenge](https://www.sportrelief.com/schools/steps) for Sport Relief, run a UK schools lookup service, and are currently converting our main donation platform to a serverless application.

## From microservices to functions

Let's take a step back and see what has happened. As we mentioned previously we've embarked on a journey into [containers and microservices](https://technology.comicrelief.com/2016/12/15/moving-to-docker-paas-micro-services/). Two years in, we are still big fans of microservices and service-oriented architecture. However, we also learned a couple of things on the way. For example, we do spend considerable time making our services scale to accommodate expected traffic peaks. As [Comic Relief is in the business of fundraising](http://www.comicrelief.com), it is often really hard for us to predict traffic levels beforehand. As a result, we often over-scale and have infrastructure left idle.

Comic Relief runs some of the biggest fundraising events in the UK — [Sport Relief](http://www.sportrelief.com) and [Red Nose Day](http://www.rednoseday.com) — and due to the nature of those events, we have incredibly spiky traffic. We traditionally upscale in anticipation of those traffic spikes, but it is impractical or simply impossible to auto-scale our containers in very short timeframes. Working with functions provide us with a platform that does not require us to prepare for those traffic spikes, nor do we have infrastructure left unused. Instead, we can spend our time building logical components that execute business logic and not worry much about infrastructure nor scaling.

For us, serverless really is all about producing value faster, and not having to worry too much about everything else that comes along the developer's path and often is nothing more than a distraction. One of the greatest things about invoking functions — and a real paradigm shifter — is that you pay for execution time, rather than for running the underlying infrastructure of your codebase. That direct relationship gives you an instant incentive to keep things performant **and** forces you to keep things simple (functions can typically not run longer than 15 minutes). The combination of hands-off management and a direct focus on functions that map on business logic proves to be a really powerful combination, [and we're not the only ones to think that](https://read.acloud.guru/simon-wardley-is-a-big-fan-of-containers-despite-what-you-might-think-18c9f5352147).

## Function-oriented architecture

Let's illustrate that thinking by looking at how we recently rebuilt our contact service. Previously, we'd have our contact forms as an integral part of our CMS software (Drupal). We factored this out into a separate decoupled service: a front-end (built in ReactJS) that captures user data, and a back-end that receives that data and adds it to a message queue. We then pick up that data item from the queue and pass it on to our CRM. We also drop a message in another queue that is consumed by a service that will send back a confirmation mail to our user. In our microservices world, we'd build the back-end bits in Symfony or Slim (a micro-framework in PHP), and host it on self-managed infrastructure.

In our new serverless world, we structure that logic around functions:

- One function to receives user data (via POST) and drops a message into a CRM and an email queue
- One function that consumes the CRM queue and passes data to our CRM
- One function that consumes the email queue and sends back a welcome email via our email service (another example of a serverless service).

None of those requires us to manage underlying infrastructure nor scale up for moments in which we expect lots of traffic through our contact platform.

## Establishing our development patterns in a world of functions

We detected a pattern we now use for all our serverless services.

- A node module for each functional component or service. We really like Javascript, but are looking at Go as well, simply because [it runs faster](https://hackernoon.com/aws-lambda-go-vs-node-js-performance-benchmark-1c8898341982) and thus will save us money. Using Javascript both in the front-end and the back-end has the additional advantage that we can reduce the amount of languages our engineering team specialises in.
- A set of functions that map to functional parts of our node module. Those can be anything from API callbacks (via API Gateway) to cron-based functions.
- The [incredible serverless framework](https://serverless.com/) to handle provisioning of our functions to our function provider. We currently prefer [AWS Lambda](https://aws.amazon.com/lambda/), simply because it ties in well with the rest of our stack.
- [Concourse CI](https://concourse-ci.org/) to deploy functions to a staging environment, run tests and follow up with a production deployment. Whilst the serverless framework does the heavy lifting for you (packaging your code, uploading to S3, creating cloud formation stacks), we prefer to automate the entire deployment process so we can really just focus on writing our logic into functions.
- If we need to handle persistent data (we prefer queues where possible to decouple and remove the direct dependency on a database layer), we rely on Elastic Search or DynamoDB, both managed services provided by AWS.
- For all our front-end needs, we follow a pretty standard component-based architecture powered by our [pattern lab and ReactJS storybook](https://technology.comicrelief.com/2017/07/17/pattern-lab%E2%80%8A-%E2%80%8Athe-beauty-of-a-shared-styling-library/).

## Looking forward

Good examples of serverless implementations within an enterprise setting are unfortunately still hard to come by. However, as we see this new exciting technology being adopted, we expect to see many more use cases being published. We hope to be at the forefront of this and will be sharing as much as we can through our [public Github](https://github.com/search?q=topic%3Aserverless+org%3Acomicrelief&type=Repositories).
