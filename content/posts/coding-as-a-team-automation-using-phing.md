---
title: "Coding as a team: automation using Phing"
date: "2014-03-03"
originalUrl: "https://marzeelabs.org/blog/2014-03-03-coding-as-a-team-automation-using-phing"
---

Part one of our Drupal development workflow series.

Drupal development as a team is tough: finding a balance between code and configuration saved in the database is one of the hardest challenges to overcome. When working in a team, it is even more important to control the development cycle, having different people work on different features at the same time, and automate as much as possible of the repetitive tasks you're really to do.

In this series, we'll look at the recipes we use at Marzee Labs to make Drupal development as a team a success. The very first ingredient, and the base of everything else: automating your build processes.

## Introducing Phing

We'll start with [Phing](http://www.phing.info/): an automation tool that replaces all your shell scripts and establishes a to-the-point development flow for your team.

Phing is a PHP build tool based on Apache Ant that does a great job of organizing tasks in targets, written using an XML-based syntax. For Drupal development, we find that using Phing gives us this extra layer on top of Drush to make building and testing Drupal sites so much easier.

Want to start developing a new feature and need a clean Drupal installation? `phing build` is your answer. Need to change back to the master branch and work on a hotfix? Start with `phing build` and you'll be sure to not mix configuration from the different branches.

## What do I need to get started?

Here are are the ingredients you need to get started with Phing and automate your Drupal development:

- Store your configuration in code. Risking to state the obvious here: for Drupal 7 that means using the [Features](https://www.drupal.org/project/features) module.
- Develop your Drupal site as an installation profile. This allows you to re-install your site at any given time from your profile. After you've launched the site and you have a production version, you also need to provide an upgrade path.
- Use Drush makefiles to document modules, themes and libraries that constitute your project.
- [Install Phing](http://www.phing.info/trac/wiki/Users/Installation) using PEAR

## A practical tutorial: building a site from scratch using Phing

Enough theory? Let's have a look at a practical example: we'll clone [MZ Box](https://github.com/marzeelabs/mz_box) — our Phing boilerplate — and use this build a fully functional Drupal 7 site base on our [MZ profile](https://github.com/marzeelabs/mz), which contains all our favourite modules, libraries and some settings to kick off your project.

```
$ git clone https://github.com/marzeelabs/mz_box.git
$ cp build.properties.example build.properties
```

This clones the boilerplate repository and creates a new build.properties file which will hold all configuration specific for your project. You should create a new SQL database and update the database connection string in `build.properties`.

Next, we're going to `make` the project: Phing will take care of cloning the MZ profile, and calling `drush make` to download all the modules and themes.

```
$ phing make
```

If all goes well, you'll read `BUILD FINISHED`.

You now have a full copy of Drupal core, the MZ installation profile, and contrib modules, libraries and themes in place. Now would be a good time to add all these files to the git repository and push them upstream to your new repository. Our first step is done!

Next, we'll want to install the site. If you look at `build.default.properties` you'll see that `drupal.profile = mz` so the `mz` installation profile is the default profile that will be installed. We'll need to run

```
$ phing build
```

and — after a couple of minutes — you'll read again `BUILD FINISHED` (note: you can see the entire build log on [Travis](https://travis-ci.org/marzeelabs/mz_box)).

And voilà: you have a fully installed Drupal site. We've also added some goodies in the build target such as configuring a test editor account and adding a quick-switch for the [Masquerade](https://www.drupal.org/project/masquerade) block so you can easily switch user accounts for testing.

You can run `phing build` as much as you want to re-install the Drupal site, and keep a peaceful mind when developing new features.

## Reviewing Phing targets

If you analyze the phing `build` target in the `build.xml` file, you see that every build runs these targets:

- site-install
- enable-dev-mode
- run-migrate
- config-masquerade
- check-features

For example, the `enable-dev-mode` target activates development and UI modules and disables the Views cache:

```xml
<target name="enable-dev-mode" description="Configures this installation for use in development" depends="setup-phing-drush">
  <!-- Enable development and UI modules -->
  <drush command="en" assume="yes">
    <param>devel,views_ui,context_ui,field_ui</param>
  </drush>
  <!-- Disable views data caching -->
  <drush command="vset" assume="yes">
    <param>views_skip_cache</param>
    <param>1</param>
  </drush>
</target>
```

You can easily create new targets and have them depend on one another to automate common tasks. You can also run these targets independently. For example,

```
$ phing enable-dev-mode
```

will prepare your current sandbox for development, and

```
$ phing -l
```

will list all the available targets with a short one-liner to explain what the target does, which is great to communicate tasks to the other members of the team.

## Using Phing in a team

When adopting the [git flow](http://nvie.com/processed/a-successful-git-branching-model/) model, Phing is the missing link to re-build the site for a feature branch and developing features in isolation.

After switching to your feature branch, the only thing to do is run `phing build`, work on your code and configuration (stored in code), push changes back upstream, and ask anyone in the team to review these changes by running `phing build` on the feature branch.

Phing will establish a common language within the team and make it easy to share development recipes and best practices as documentable targets.

## What else can I do with Phing?

We've only scratched the surface of what you can do with Phing to automate your Drupal development. We use Phing to automatically migrate mock content using the [Migrate](https://www.drupal.org/project/migrate) module, run an automated test stack, and provide continuous builds everytime new code is pushed to the repository (check out our [Travis logs](https://travis-ci.org/marzeelabs/mz_box)).

The take home message is that building a Drupal site should be as easy as running `phing build`, and with that - we've complied with the second step of Joel Spolsky's [Joel Test to Better Code](http://www.joelonsoftware.com/articles/fog0000000043.html): "Can you make a build in one step?"

*Featured image credit: Daniel Wehner / Flickr*
