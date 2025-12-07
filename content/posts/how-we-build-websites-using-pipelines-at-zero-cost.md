---
title: "How we build websites using pipelines at zero cost"
date: "2016-11-28"
originalUrl: "https://marzeelabs.org/blog/2016-11-28-harpjs"
---

## Rolling out static sites using HarpJS, Heroku, Travis CI and Github.

At Marzee Labs we [like to build static sites](https://marzeelabs.org/blog/2012-06-30-building-simple-sites-jekyll-to-the-rescue). In this blog post, we're sharing an ingredient list to build a new static site — including a deployment and testing pipeline — in *less than an hour*. Best of all, all these tools are for free if you code in the open!

Typically, static site generators compile a list of markdown and template files into HTML. Funnily, the name "static" is somewhat of an oxymoron. In fact, since we adopted static site generators, we are much more free to adopt and leverage HTML and JS libraries, leading to sites that are much less static than the ones we typically build [using a full-fledged CMS](https://marzeelabs.org/blog/tags/drupal).

We initially started out using [Jekyll](https://jekyllrb.com/), a Ruby generator developed by Github, and gradually moved to [HarpJS](http://harpjs.com/), mostly because we prefer Javascript over Ruby.

## Ingredient list

So, without further ado, here are the tools you need:

- [HarpJS](http://harpjs.com/): the site generator framework. Our boilerplate [MZ Harp](https://github.com/marzeelabs/generator-mzharp) comes with goodies like responsive images (leveraging [jimp](https://www.npmjs.com/package/jimp)), a basic blog and homepage structure, Gulp integration, etc.
- [Github](https://github.com/): cause you'll want to have Pull Requests to discuss and review changes
- [Heroku](https://www.heroku.com/): for automatically deploying feature branches using [pipelines](https://devcenter.heroku.com/articles/pipelines)
- [Travis CI](https://travis-ci.org/): for running some tests, and deploying our production site to [Github Pages](https://pages.github.com/)!

## Let's generate!

To make our setup easier, we've written a [Yeoman generator](http://yeoman.io/) that spins up a new HarpJS site for you, and guides you through the setup of Heroku, Travis CI and GitHub Pages.

Before we start, [set up a GitHub repository](https://github.com/new) and install the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-command-line#download-and-install) and the [Travis CLI](https://github.com/travis-ci/travis.rb#installation).

Next, let's install the generator (see the [MZ Harp repository](https://github.com/marzeelabs/generator-mzharp) if you're interested to see the magic behind it):

```
npm install -g yo
npm install -g generator-mzharp
```

Let's create a directory in which to put the generated site:

```
mkdir my-mzharp
cd my-mzharp
```

And start generating!

```
yo mzharp
```

The generator will guide you through the setup of Github, Heroku and Travis, so make sure you have your free accounts set up on these platforms.

Finally, run

```
gulp
```

to see your new site, which should look like http://mzharp.marzeelabs.org/.

After pushing your code back to GitHub, your scaffolded codebase should look similar to https://github.com/marzeelabs/mzharp

## An environment for each Pull Request

One of the nicest feature of this pipeline is to have a new environment freshly built for each Pull Request.

To see this in action, edit any file of your newly created Github repository (use GitHub's UI if you're lazy!), open a PR to your `master` branch, and watch both Travis and Heroku do their jobs!

## MZ Harp sites in the wild

Check out some sites we built recently using this methodology:

- [this website](http://marzeelabs.org/)
- [BEN](http://ben.productplacement.com/)
- [Open Consortium](http://openconsortium.eu/)
- [Fidibiko](http://fidibiko.com/)
- conference sites like [Cowork Buzz](http://coworkbuzz.com/) and [DrupalDay Portugal](http://drupalday2016.drupal-pt.org/)
