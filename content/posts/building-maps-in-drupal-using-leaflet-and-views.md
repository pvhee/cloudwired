---
title: "Building maps in Drupal using Leaflet and Views"
date: "2012-09-24"
originalUrl: "https://marzeelabs.org/blog/2012-09-24-building-maps-in-drupal-using-leaflet-views"
---

## The Drupal Leaflet module now has native Views support, making it really easy to display maps of your Drupal data.

The new release of the Drupal [Leaflet module](https://www.drupal.org/project/leaflet) (missed our [introductory post](https://marzeelabs.org/blog/2012-09-08-introducing-leaflet-for-drupal)?) has native Views support, so it is now really easy to display a Leaflet map of Drupal data. In this post, I'll outline one common way of building maps in Drupal.

Geo-data in Drupal is commonly represented with the [Geofield module](https://www.drupal.org/project/geofield), which can store points, lines and polygons. You can add a geofield to your content profile, user profile or custom entity, and the user can either pick a location from the map or directly input latitude and longitude. A more user-friendly alternative is to use the addressfield-geofield combination: using the excellent [Geocoder module](https://www.drupal.org/project/geocoder) any address field (provided by the [Addressfield module](https://www.drupal.org/project/addressfield)) can be geo-coded and stored in a geofield. The module can use Google, Yahoo, or any other custom geocoder to turn user-entered addresses into geographical coordinates.

Once your geo-data is stored in Drupal, Leaflet offers you two ways to display that data: as a **field formatter** or using [**Views**](https://www.drupal.org/project/views). The first approach is great for displaying a map for a single entity, such as a map for a user profile or an event node with a location, while the second approach is perfect for showing a map of multiple entities.

To use Views to display geo-data, enable the Leaflet Views submodule, part of the Leaflet module. Create a new View of your entities that contain the geodata, add the geofield to Fields, and select the `Leaflet Map` format. You can set a couple of options such as the fields to show up in the pop-up, or the height of the map.

If you are fond of [Display Suite](https://www.drupal.org/project/ds) to display and style your content (who is not?), then you probably want to style the Leaflet popups with a *View mode*. The Leaflet module provides a very neat integration for this. In "Description Content", select for example `<node entity>` (if you are mapping nodes and not other types of entities), and then pick the View mode to render the entity. For example, you could have a custom view mode `Map` for your entity that shows the title, a teaser view of your body, and a teaser image, and style it all via Display Suite without having to fiddle with Views.

Building a nice map requires beautiful map tiles. Luckily, there are many beautiful and free tiles available on the web. The easiest way to use different layers on your map is to use the [Leaflet More Maps](https://www.drupal.org/project/leaflet_more_maps) module, which gives you maps from various providers such as [Stamen](http://maps.stamen.com/), [Mapbox](http://mapbox.com/) or [OpenStreetMap](http://www.openstreetmap.org/). If you however want full control over your map and its behavior (tiles, options for zooming, scrolling, popups etc.), you can implement `hook_leaflet_map_info` in your custom module (see leaflet.api.php for more info on that).

Development on the Leaflet module is happening quite fast, and many people are contributing excellent patches. See you in the [issue queue](https://www.drupal.org/project/issues/leaflet)!
