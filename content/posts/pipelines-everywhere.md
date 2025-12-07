---
title: "Pipelines everywhere"
date: "2019-01-31"
originalUrl: "https://technology.comicrelief.com/2019/01/31/pipelines-everywhere/"
---

## Continuously delivering software to production systems is a key part of building great digital products and creating a culture of agility within different teams.

In this post, I will share our recipes for building pipelines centered around [Concourse CI](https://concourse-ci.org/).

## Pipelines at Comic Relief

It does take time and perseverance to build pipelines that are trusted by different teams, starting with your engineering and product folk and all the way to your business stakeholders. Though once everyone has seen the power of continuous delivery, it is something that quickly becomes key to every project. Fixed development sprints are being gradually replaced with a fluid kanban model as production releases happen not once every two weeks but multiple times a day.

Whilst [moving to serverless](https://technology.comicrelief.com/2018/07/12/serverless-at-comic-relief/) certainly reduces the need for infrastructure management and therefore greatly reduces the complexity in shipping software, there is a need to automate this and often bridge between your different technology stacks. For us, pipelines really are the glue that makes everything work.

At Comic Relief, we have a long history of continuous integration and have been using tools such as Jenkins, Travis, Circle CI, Netlify and Concourse CI. Over the last couple of years, we have settled on the following pattern:

- [Circle CI](https://circleci.com/) (and sometimes still [Travis CI](https://travis-ci.com/)) for running tests on every pull request. These tests are great for testing things in isolation are ideally suited for front-end tests or unit tests, although we're using Cypress to do end-to-end testing against sandbox back-end environments.
- [Netlify](https://www.netlify.com/) for deployment previews of our static front-end applications, mostly the different ReactJS codebases
- [Concourse CI](https://concourse-ci.org/) for all staging and production deployments, running various test suites and all sort of utility / housekeeping tasks that are essential to keep platforms running happily. We also use this for periodical tasks such as running [Lighthouse](https://developers.google.com/web/tools/lighthouse/), performance reviews, visual regression, or longer-running end to end tests we don't wish to run on every deployment.

In the rest of this post, we'll focus on the pipelines that ship code to production from the `master` branch onwards. We found that Concourse is ideally suited as our "master CI tool" and elegantly deals with the concept of pipelines as the complexity of our software products grows over time.

## Concourse.ci pipeline concepts

A concourse pipeline can be thought of as a distributed, higher-level and continuously-running Makefile, written down in a `yml` format (see [an example](https://github.com/comicrelief/sample-bootstrap/blob/master/concourse/general.yml)).

You start by defining your **resources**, which can range from the master branch of a github repository to a cron being triggered every day at 10am.

You then move on to define **jobs** that depend on resources, for example a deployment to staging can be written out as a job. The job plan will have a dependency on the github resource and the job can be triggered to run every time a new commit is made to the master branch.

Finally, you **chain** your jobs by depending on the resources that have passed through previous jobs. In our example, your fresh commit to master, once it has passed the staging job, will trigger the execution of a new job that will run feature tests against the freshly deployed staging environment.

## Diving into a Concourse job

Jobs are the heart of your Concourse pipeline, so let's take a look at how a job is defined.

Here is an example of a job running feature tests using [Cypress](https://www.cypress.io/) against a previously deployed staging environment.

The job lists `serial:true` which means that only one such job will run at a given time, to avoid multiple commits to master triggering multiple jobs to be created. Instead, jobs are nicely queued up and executed serially.

The **job plan** has two steps. First, two resources are pulled in: a git commit from our application repository that has successfully passed the staging job and our bootstrap repository which contains a series of reusable scripts.

The second step of our job plan is a **task** which really can be thought of as a function mapping inputs to outputs and return either success or failure. In this case, our task is defined in a file called `cypress.yml` and receives as input our code repository (which has our latest commit to master) and the bootstrap repository. This task references a [cypress docker-image](https://hub.docker.com/r/cypress/base/) which is used to run our task and the run script invokes a shell script `cypress.sh`.

That shell script in turn installs our npm packages and invokes `yarn test` which will run our tests using [cypress.io](https://www.cypress.io/). The exit code returned by that script will define success (exit code 0) or failure (any other number).

Finally, the last part of our job handles failures, and posts a message to a designated Slack channel mentioning that feature tests have failed.

## Rolling your own Concourse

Concourse is not as easy to set up as say Circle CI, and unfortunately no managed Concourse service exists. Luckily, the talented folks at [EngineerBetter](https://github.com/EngineerBetter) built a tool called `concourse-up` that makes it really easy to set up your own Concourse CI instance on AWS.

```
concourse-up deploy ci-sandbox
```

Follow the [documentation](https://github.com/EngineerBetter/concourse-up) to get started with your own Concourse instance. All resources will be created and you'll get two URLs. One points to Concourse's UI (which is your dashboard into your pipeline), and another one to a Grafana instance that will display stats like pipeline run times.

Next, take a look at our [sample bootstrap repository](https://github.com/comicrelief/sample-bootstrap) which defines a general pipeline and some scripts to do things like running feature tests using cypress, or use yarn and the aws cli to deploy a static site to AWS S3.

```
git clone https://github.com/comicrelief/sample-bootstrap
cd sample-bootstrap
```

We can now load the pipelines that we defined in the bootstrap repository into that instance using `fly`, the command-line interface to Concourse.

```
fly -t ci-sandbox login --team-name main --concourse-url YOUR-URL
fly -t ci-sandbox set-pipeline -p general -c concourse/general.yml -l private/concourse/cci_private_vars.yml
```

And that's all! You should be able to inspect your pipeline via the UI. Every time you update your pipeline, you have to push it up using `fly` and the changes will be reflected immediately.

At Comic Relief, everything is shipped to production using pipelines. We use it for our main websites ([comicrelief.com](https://www.comicrelief.com/), [sportrelief.com](https://www.sportrelief.com/)), for our [donation](https://donation.comicrelief.com/) & [giftaid](https://giftaid.comicrelief.com/) platforms, and for many other public (and private) services that benefit from a continuous delivery model. Having all our products accessible and visible in Concourse CI has changed the way we build and deploy software for the better.
