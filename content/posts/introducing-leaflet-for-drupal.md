---
title: "Introducing Leaflet for Drupal"
date: "2012-09-08"
originalUrl: "https://marzeelabs.org/blog/2012-09-08-introducing-leaflet-for-drupal"
---

Mapping on the web has been a hot topic since the introduction of [Google Maps API](https://developers.google.com/maps/) in 2005. Open-source alternatives have been released shortly after, with [OpenLayers](http://openlayers.org/) as the the most influential and complete mapping library. Very recently however a new library was released, called [Leaflet](http://leafletjs.com/). Leaflet is a slim, light-weight and above all beautiful Javascript library that has quickly become very popular and is now powering interactive maps on [Flickr](http://www.flickr.com/), [foursquare](https://foursquare.com/) and many other high profile sites.

Best of all, there is a [Drupal module](https://www.drupal.org/project/leaflet) for Leaflet, to make is really easy to display maps on Drupal. A few weeks back, [ThinkShout](http://thinkshout.com/) and Marzee Labs, together with the help from the Drupal community, released beta 2. This new version has long-awaited Views support (read [our post](https://marzeelabs.org/blog/2012/09/24/building-maps-in-drupal-using-leaflet-views) on that), so you can use Views to query your data and plot it on a Leaflet map.

## Why use Leaflet for Drupal?

I have always been an advocate of using Open Layers in Drupal (see my presentations on [Drupal 6](http://www.slideshare.net/pvhee/introduction-to-openlayers-in-drupal) and [Drupal 7](http://www.slideshare.net/pvhee/mapping-in-drupal-7-using-openlayers)), because of its completeness and extendability for building maps in Drupal. However, I also felt that the different levels of abstraction introduced by the module, combined with the weight of the JS library and it's somewhat dull default look made it more challenging to build custom maps in Drupal.

For example, adding a simple map on your site from a couple of geocoded nodes requires three steps: creating the data layer, configuring the map preset, and finally putting the map in page or block using Views. In Leaflet, that process is simplified: you store geo-data in entities and you display via field formatters or Views (see [our next post](https://marzeelabs.org/blog/2012/09/24/building-maps-in-drupal-using-leaflet-views)).

Another reason to choose Leaflet is its native mobile support or its fantastic state-of-the-art support for clustering using [Leaflet Markercluster](https://github.com/danzel/Leaflet.markercluster).

## Leaflet beyond Drupal

Drupal and Leaflet are a great match if you have relatively few data to map (a couple of hundred nodes, for example). However, if you want to map thousands or even hundreds of thousands of points, Drupal and its mapping modules become extremely inefficient as all geographical data is fetched once at the beginning of the page load. A [recent blog post](http://affinitybridge.com/blog/server-side-mapping) by the folks of Affinity Bridge explain well alternatives and solutions.

## The future of the Leaflet module

The Leaflet module does not pretend to be a complete mapping module for Drupal. Instead, it makes it easy to display simple maps on your website, and does it well.

I strongly believe that further work should go in making it easy for developers to extend and use Leaflet's cool new features. This should probably be done directly in Javascript, without adding another layer of complexity via Drupal.

I hope that the momentum that is rising around Leaflet in general, and the Leaflet module in particular (check the [usage statistics](https://www.drupal.org/project/usage/leaflet)), will translate into cool new features, better documentation, and above all, more maps.
