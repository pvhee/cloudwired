---
title: "Drupal Commerce, done differently"
date: "2013-06-17"
originalUrl: "https://marzeelabs.org/blog/2013-06-17-drupal-commerce-done-differently"
---

## Building a "design your own whisky cask" e-commerce experience with Drupal Commerce.

Building sites using [Drupal Commerce](https://www.drupal.org/project/commerce) is something we often do at Marzee Labs, but when [EnjoyThis](http://enjoythis.co.uk/) approached us to build an e-commerce site for [The London Distillery Company](http://thelondondistillerycompany.com/) featuring a "design your own whisky cask" part, we immediately seized that opportunity to do something different. In this post, I'll review the architecture of the project.

## Challenges

The [new site](http://thelondondistillerycompany.com/) for The London Distillery Company had to appeal to a young urban crowd. [EnjoyThis](http://enjoythis.co.uk/) took on the challenge of creating a visually appealing design using big images, bold typography & plenty of videos (which they shot themselves).

[Drupal Commerce](https://www.drupal.org/project/commerce) was chosen to build the site, which needed a lot of customization that would have been beyond most open-source ecommerce platforms. We needed multi-country & multi-continent shipping which influences shipping costs, delivery times & taxes. We also needed to offer customers the possibility to use coupons, so they'd get free shipping, receive a percentage off their purchase, or get a free bottle for every three bottles they buy.

The most challenging part of the project was to allow visitors to design their own bespoke casks, choosing from options such as barrel size (40 liters, 180 liters, or 220 liters, for the very thirsty ones!), wood type and barley. Every one of these options has a different price and attributes, and some of the options would in turn enable more options. For example, if you pick the Maris Otter barley type, you might want to take the peated or the non-peated version.

After the user has customized his or her own cask, we allow them to share their configuration via mail, Twitter or Facebook, so we needed unique URLs for every cask combination.

## UX and Front-end

The secret of marrying a good UX implementation to the one-pager "design your own cask" is very simple: relying on what Drupal Commerce gives us. The danger would be to sink in heavy template usage to accommodate the markup. Instead we used a couple of preprocess functions, as well as the standard and almost untouched commerce HTML.

Javascript-wise, we pass very limited amount of variables from Drupal PHP to Drupal behaviours, and hook our code to rely on what Drupal Commerce gives us. This means that we don't have to hack our way around, and can keep the custom code down to a fairly human, understandable level. That said, we did hit a few walls, and butted our heads against the desk a couple of times, especially in some event bubbling that commerce was "offering" us.

All in all, the best decision we made for this uncommon commerce page was to keep most of what Drupal Commerce would give us out of the box and do a make up with jQuery rather than reinventing the wheel.

## Under the hood

To build out the "design your own cask" tool, we started from a description and a price for each of the attributes that would made up the final cask: a 20-liter barrel costs that much, adding the peated option would add that much, etc.

We made the maths and found that a user can chose between roughly 200 different cask combinations. Each combination is built out as a separate product and bundled in one single product display (see the [bespoke page](http://www.thelondondistillerycompany.com/bespoke)), taking advantage of Drupal Commerce's flexible product / product display separation. We built a script to generate the different combinations, and used [Commerce Feeds](https://www.drupal.org/project/commerce_feeds) to get that data into Drupal. Future price changes are then easily synced using the built-in synchronization of Commerce Feeds.

Each combination also shows a breakdown of the costs of each selected attribute. Selecting the "peated" option for the barley type would add an additional 200 pounds for example. We store that data in a separate node that is referenced from the product entity. Every time an attribute is selected by the user, we receive a correct reference to the price breakdown node of that particular combination and extract these components using jQuery.

We are very happy with the [final site](http://thelondondistillerycompany.com/), especially the ["Bespoke Tool"](http://thelondondistillerycompany.com/bespoke) which we recommend you try out. Drupal Commerce proved to be a very flexible framework, even for a use case that requires more than just the typical product pages.

*Disclaimer: our friends at [EnjoyThis](http://enjoythis.co.uk/) designed the whole site, including beautifully shot images and videos to promote the whisky distillery. Marzee Labs architected and implemented the e-commerce part using Drupal Commerce and implemented the User Experience of the "design your own cask" part.*
