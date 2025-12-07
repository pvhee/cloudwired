---
title: "A technical deep dive into processing €5 million in donations in 2 hours using Cloudflare Workers"
date: "2020-12-07"
originalUrl: "https://medium.com/we-are-serverless/a-technical-deep-dive-into-processing-5-million-in-donations-in-2-hours-using-cloudflare-workers-7dc306c"
---

## A deep dive into the serverless architecture behind the Late Late Toy Show donation platform and the challenges we faced in putting it together in just a couple of weeks.

For an introduction to our serverless platform for RTÉ’s Late Late Toy Show, see this article.

In this article, we’ll give you a factual blow-by-blow replay of the evening, together with a deep dive into the technology under-pinning it all. Not everything went according to plan (does it ever?), however the RTÉ Toy Show Appeal was a resounding success.

## The Project

The brief for the first ever commercial project for our agency, We are Serverless was as follows:

> Build a donation platform for Ireland’s most popular TV program, RTE’s Late Late Toy Show, and have it ready to go within four weeks.

Build a donation platform for Ireland’s most popular TV program, RTE’s Late Late Toy Show, and have it ready to go within four weeks.

With this being the first time that there would be a donation ask on the Toy Show, we had no idea of how much money would be raised, nor how many viewers would be converted to donors. We only knew the following:

* estimated audience of 1.5 million viewers in Ireland plus Irish diaspora from 130+ countries globally
* we should allow for effortless scaling, from nearly zero activity to thousands of requests per second
* potentially handle hundreds of transactions per second
* build it lean; the more code and complexity the application itself would have, the longer it would take to build and the harder it would be to operate at scale

## Building the platform

For our first challenge, we had to decide on the underlying architecture for the platform, we settled on Cloudflare Workers.

As far as serverless platforms go, Cloudflare Workers might be less well known than AWS Lambda. However, they would allow our code to run on Cloudflare’s global edge network rather than on regional instances. Cloudflare, unlike any other cloud computing services, doesn’t use containers or virtual machines, but V8 isolates, the technology created by the Google Chrome team to run javascript in the browser. Practically for us this meant code would run closer to our end-user making the request, and invocations wouldn’t incur any cold start, which can run into the 100s of ms.

The results from our load testing using serverless artillery, Grafana and InfluxDB were promising. We simulated slamming the site with up to 300 donation journeys for a few minutes and saw request latencies not higher than 416ms for 9 out of 10 of the requests , and on average only 77ms.

Whilst for obvious reasons we couldn’t measure latencies during the event itself, the results from the evening as measured by Cloudflare were even more impressive: 99% of the requests used less than 6.6 ms CPU time, and this stayed flat throughout the evening and the next day. Only in the 99.9th percentile, we saw a little bump which coincided with the donation peak, at around 11.34pm. With AWS Lambda we were used to seeing functions running for 100s of ms, and seconds during the warm-up phase, so having functions consistently run for less than 10ms, without the inevitable penalty, was quite the sight!

The second challenge was to use a payments platform that could process hundreds of transactions a second without breaking a sweat: for this, we quickly settled on Stripe. Considering RTÉ’s previous charity appeal show’s performance, RTÉ Does Comic Relief, we were comfortable with the existing limits on Stripe, and RTÉ’s charity partner The Community Foundation for Ireland, had let Stripe know about the event. Little did we know then that The Late Late Toy Show would break all records, and we’d quickly bump into this limit.

As we wanted to keep the stack as lean as possible, we heavily relied on Stripe metadata and related Stripe Sigma (basically Presto) to store and query the small extra pieces of data that weren’t necessary to card transaction, such as the user choosing a tax refund on larger donations. This allowed us to deliver live reporting of totals and perform SQL queries on the data held by Stripe, removing a lot of the stress of having to think about data storage and related scalability.

## Timeline of events

* The show starts at 9.35pm. Quite some anticipation on Twitter, and the first official tweet goes out to ask for a donation. We are sitting at around €10k of donations and thought we were in for a quiet night.
* We start to see traffic spiking up, especially when the show’s host Ryan makes a first donation ask, at around 10.30pm, briefly after Saoirse shared her brave and inspiring story.

* All of sudden, things are happening, traffic is spiking up and we see the donation totals shooting up by tens of thousands of euros a second.

* Then activity goes off the charts, and we see the first warnings of Stripe’s API returning rate limiting errors coming from Sentry and the Stripe Dashboard, followed by users reporting the same on Twitter. Whilst the platform itself is responding quickly, a percentage of users are unable to get through due to rate limiting from Stripe. We get on the phone with the team over at RTÉ and the account manager at Stripe. All teams involved are incredibly quick to respond and less than half hour later Stripe’s limits are raised 5x. In the meantime, we get a call from Stripe’s CTO, who reassured us we shouldn’t see any further issues. Twitter is now on fire (#latelatetoyshow is trending worldwide) and lots of people (rightfully!) thanking Stripe. They were absolutely stellar in their response.

* Donations keep streaming in. We record a peak of 151 donations per second at 23:13:54. We also see a longer peak minute of 6988 donations per minute at 23:35 — that’s over 110 donations per second for the entire minute. By midnight, the platform has raised over 5 million euros, with the bulk of donations (over 4 million) in just one hour, from 11pm to midnight.

* We wrap up a few hours later. It’s been a long and exciting night, and we need to get ready for the show’s replay on Saturday afternoon. In total, over €6.5 million was raised (at the time of writing, whilst the site is still open until December 14th 2020), and our Cloudflare workers received over 4 million requests.

## Inside the platform

We intentionally kept the platform logic as minimal as possible. At the core, we have a single Worker Site which does two things: it serves the static ReactJS front-end and responds to a back-end route. That back-end route is the core of handling payments, creating a payment intent to Stripe’s APIs using the user-submitted data and returning any feedback.

We automated testing of the platform through Cypress.io, which simulates a full payment journey on the staging environment using Stripe’s test mode, and run this for every commit to our main branch using Github Actions. We then deploy, again using Github Actions and Wrangler, to RTÉ’s Cloudflare account. The simplicity of our testing and deployment pipeline meant that we could iterate quickly with the entire team, whilst making sure our core functionality was kept stable.

All warnings are logged in Sentry, and sent through to our Slack. We logged a large number of Sentry events on the evening, many of them related to specific browser behaviour and console warnings brought in by dependencies (such as our integration with RTÉ’s official header and footer). Fortunately for us, and a testament to our extensive cross-browser testing using Browserstack ahead of time, none of the reported errors and warnings were deemed to be critical to the user journey. We are now sifting through these events and using the knowledge to improve the platform for its next incarnation.

## A few lessons learned

* Our platform scaled effortlessly. With a traditional infrastructure approach, at best we’d be massively over-scaled and thus overpaying, and at worst the platform would be overloaded and unavailable.
* Serverless is faster when running at the edge (via Cloudflare Workers, or AWS Lambda@Edge). In addition, Cloudflare Workers don’t suffer from a typical “cold start”, keeping request times flat throughout the event as traffic ramped up.
* Always have a direct communication plan with your dependencies when there’s a risk that their services could be a limiting factor for your application.

We want to thank everyone at RTÉ, CFI and Stripe for making us a part of this journey raising millions of euros for a great cause. This article was written with contributions from the entire We Are Serverless team. If you’d like work with us, please drop us a message on info@weareserverless.com.
