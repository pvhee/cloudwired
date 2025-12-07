---
title: "Building rednoseday.com on Drupal 8"
date: "2016-12-21"
originalUrl: "https://technology.comicrelief.com/2016/12/21/building-rednoseday-com-on-drupal-8/"
---

As part of [our objectives in 2016](https://technology.comicrelief.com/2016/01/07/the-year-that-was-and-hello-2016/), we set out to solve a recurring problem at Comic Relief: how can we build an engaging, fast and secure fundraising campaign website — the likes of [rednoseday.com](https://www.rednoseday.com/) and [sportrelief.com](https://www.sportrelief.com/) — in a couple of months? How can we make sure that editors are able to create compelling landing pages that reach their different audiences?

Technology-wise, we have been recycling codebases for the campaign site year after year, carrying tech debt together with bad development practices from one year into the next, leading to all sorts of issues, but mainly obstructing technical innovation from the start.

In this post, I would like to outline some of the fundamental changes we made designing this "platform" product — using Drupal 8 — and how we've turned this into the basis that is currently powering [www.rednoseday.com](https://www.rednoseday.com/)

## Choosing Drupal 8

At Comic Relief, we've been heavy users of [Drupal](https://www.drupal.org/) (versions 6 and 7) — the popular open-source content management system. Why did we choose to move to [Drupal 8](https://www.drupal.org/8), a version that was released just a couple of months ago? (note: this was end of 2015)

In short, we were attracted to using Drupal 8 because this is the first release of Drupal to fully embrace standards ([PHP Fig](http://www.php-fig.org/)) and frameworks ([Symfony](https://symfony.com/)) outside of the Drupal ecosystem. That means, we're [finally getting off our Drupal island](http://www.garfieldtech.com/blog/off-the-island-2013) and join a vibrant PHP community. As PHP is [a widely adopted language at Comic Relief](https://technology.comicrelief.com/2016/05/12/php-comic-relief/), we can now start building bridges between our different products (some in [Zend](https://framework.zend.com/), [Symfony](https://symfony.com/), and others in [Slim](https://www.slimframework.com/)) and take full advantage of the popular dependency manager [Composer](https://getcomposer.org/) and templating language [Twig](http://twig.sensiolabs.org/).

Some other reasons why we chose to go for Drupal 8:

- Loads of nice editorial features out of the box. Think CKEditor, the inline edit experience, but also the [planned content moderation tools](http://buytaert.net/improving-drupal-content-workflow).
- It provides excellent accessibility features by leveraging HTML5 components.
- Built in REST capabilities. This is important as we'd like to start using our content in different places and focus on building a "content hub".
- It set a nice challenge for our development teams, so we're keeping people motivated as they upskill!

## Building a product rather than a site: our ingredients

Perhaps the biggest change we made, is our transition from building a site for the current campaign to building a product that can power any campaign site year on year.

So, what are the characteristics of this "product", and what approaches did we follow?

In its most simple form, our campaign site is a "landing page builder" for our editorial team. Using different editorial blobs — we call these "row components" in-house — for content tiles, signup forms, or galleries and videos, we wanted to give editors complete control of the flow of content, without compromising the quality of the page. This way, we are making sure it behaves responsively and renders clean and accessible HTML. Technically, we trialed different approaches in Drupal ranging from using [Panels](https://www.drupal.org/project/panels) and [Panelizer](https://www.drupal.org/project/panelizer) (giving full freedom to editors) to fieldable nodes (given limited freedom of editors), and settled somewhere in the middle using the excellent [Paragraphs](https://www.drupal.org/project/paragraphs) module. Focusing on the editorial experience of controlling discrete, well-defined and well-developed row components resulted in a transition from building a site of pages to building and maintaining a library of said row components.

So, now that we are building a library of row components, how can we make it easy to add a new component to that library? Enter the [pattern lab](https://www.rednoseday.com/profiles/cr/themes/custom/campaign_base/styleguide/section-cards.html), our incubation area for prototyping new components. Using a methodology called [KSS](http://warpspire.com/kss/), we are maintaining and continuously improving a "living style guide". Using HTML, JS and CSS, a developer can prototype pretty much any type of row component in this area without having to worry about the underlying Drupal data model.

We need to be able to build our website product at any given time. For this, we're using installation profiles from Drupal 8 (also known as [distributions](https://www.drupal.org/project/project_distribution?f%5B0%5D=&f%5B1%5D=&f%5B2%5D=drupal_core%3A7234&f%5B3%5D=sm_field_project_type%3Afull&text=&solrsort=iss_project_release_usage+desc&op=Search)). That means, on every commit to our codebase, we're building a clean site and loading it with default content (conveniently stored as JSON). We went at length to make this build in one step (using the PHP build tool [Phing](https://www.phing.info/)), so that setting up the site on an environment is a simple and reproducible process. This pairs extremely well with our git flow model where we develop features in isolation (including preview branches using [platform.sh](https://platform.sh/)!) before merging them into our development branch.

Shifting to a product mind-set when building a site means you can focus on writing tests for the different components. In our case, we're using [Behat](http://behat.org/en/latest/) to write tests on user behaviour: can an editor create complex landing pages using row components? Are metatags working correctly? When a user subscribes to a mailing list, does the message get stored in the queue, and so on? We've integrated these tests in our continuous integration server (we're using [Travis CI](http://travis-ci.com/)) so that they're run on every commit to our codebase.

## Giving back

As a charity we're passionate about Open Source. We also do our best to [give back](http://drupal.org/comic-relief) to the Drupal community as much as we can.

Whilst we are still at the start of this journey, we have contributed back some of the modules we created or ported to Drupal 8.

We are also in the process of open-sourcing our entire codebase, so that the wider charity community can benefit. Watch this space!

## Next on the list

We're still at the start of this journey, turning a legacy codebase and outdated way of working into a fresh & iterative base allowing us to quickly build any new Comic Relief websites, whilst updating our existing ones.

We're currently looking at:

- Porting the other products to our new way of building our websites ([comicrelief.com](https://www.comicrelief.com/), we're looking at you!)
- Exploring and developing our use of micro-services for various bits on the site (e.g. our kids game integration, or our search engine).
- Moving towards a content hub, maybe with a decoupled front-end?
- Open-sourcing our codebase

We're looking forward to being kept busy in the new year!
