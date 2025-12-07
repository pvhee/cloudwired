---
title: "Blueprinting Drupal projects"
date: "2015-01-06"
originalUrl: "https://marzeelabs.org/blog/2015-01-06-drupal-profiles"
---

Best practices for Drupal makefiles and code repository organization.

Planning the structure of a Drupal project is important. At Marzee Labs, we've developed some pretty robust methodologies over time to approach new Drupal projects, and in this post we'll outline some of these tools and processes that help us get off the ground in no time. While some of the topics are probably familiar (Drupal makefiles, installation profiles and such) you might learn some new tips and tricks to make your next Drupal project just that tiny bit more automated and run smooth.

## The blueprint of any Drupal project: the makefile

Any project we start has to have a makefile. Full stop. Requiring that every module, library or theme we use — be it from drupal.org, github, or any other source — is documented in a single file, is a great way to quickly get the gist of any drupal project.

Even though you might want to version your contributed modules (more on this below), the Drupal makefile should form the backbone of your website.

As an example, check out the makefiles of our [MZ profile](https://github.com/marzeelabs/mz), our boilerplate profile that can be used to kickstart a new project. For a Drupal profile that can be contributed and packaged on drupal.org, we typically have 3 different Makefiles, but now we're only interested in `mz.make`.

Here are the instructions to make the `link` module.

```
projects[link][version] = 1.3
projects[link][subdir] = "contrib"
```

Everyone inspecting the site running this profile now knows that you are using the 1.3 version of the Link module.

Need to patch the `link` module because you encountered a bug or missing functionality? Sure thing. First we scan the drupal.org issue queue for patches. An example is [this issue](https://www.drupal.org/node/1475790), with a working patch. We add this to our makefile, with a one-liner comment and a link to the issue on d.o.

```
projects[link][version] = 1.3
projects[link][subdir] = "contrib"
; Provide the original_url when loading the field.
; @see https://www.drupal.org/node/1475790#comment-7743415
projects[link][patch][] = "http://www.drupal.org/files/7.x-1.x-_link_sanitize-bandaid-1475790-16.diff"
```

And we rebuild our project to test the patch in our Drupal sandbox, passing `--projects=link` (and also `--no-core` since we don't want to rebuild Drupal core)

```
drush make profiles/mz/mz.make --projects=link --no-core .
```

Or we download the nifty [Drush Patchfile](https://github.com/davereid/drush-patchfile) to apply patches directly and work with a patch file (our makefile, in this case).

If you want to use the latest development version of a module, you can also do that. If you do however, always specify the git branch and git revision hash as well (you find it in the [commit log](https://www.drupal.org/node/74971/commits)), so you make sure you're working with that specific development release that you tested.

```
projects[link][download][type] = git
projects[link][download][branch] = 7.x-1.x
projects[link][download][revision] = 7dc306c
projects[link][subdir] = "contrib"
```

Feel the power of this? You can quickly evaluate community contributed patches, roll your own (and contribute them as a [Gist](http://gist.github.com/) if they don't fit on drupal.org), and not be dependent anymore on the module maintainers to publish that new release.

Since you also document every patch used, you're making this knowledge available to the other developers in the team, to the reviewer of your Pull Request (if you are using the [github branching model](https://marzeelabs.org/blog/2014-05-18-coding-as-a-team-code-workflow)), or generally as part of the Git history of your project. You can often revisit your makefile to remove patches if they've been rolled out in a new release, and update your modules. Make this a habit and it will pay off eventually.

## Bundling using profiles

All your custom code and modules, themes and libraries to be installed should be bundled as an [installation profile](https://www.drupal.org/developing/distributions), so your site can be [installed over and over](https://marzeelabs.org/blog/2014-03-03-coding-as-a-team-automation-using-phing).

If you haven't started organizing your sites as Drupal profiles, you probably should. Have a look at our boilerplate [MZ profile](https://github.com/marzeelabs/mz). We use it to bundle our favourite contributed modules, but it also has some custom features and part of our common worfklows we find often useful. Other examples of great Drupal profiles are [Commerce Kickstart](https://www.drupal.org/project/commerce_kickstart) or [Drupal Commons](https://www.drupal.org/project/commons).

## Organizing your code in a git repository

It's time to dive in the organization of your git repository (we love [GitHub](http://github.com/marzeelabs/mz)). If you've followed along so far, contributed code is documented in your makefile, while your custom features and code lives in your profile. It would be enough to version these, and that is the recommended way if you want to package your code as a profile or a base profile upon which to build new sites.

However, most of the time, you will also need to deploy off this repository directly, so we suggest that you store **all your code** — including Drupal core & contrib — in the git repository. Your directory structure could look like

```
profiles/mz/modules/contrib
profiles/mz/modules/custom
profiles/mz/modules/features
profiles/mz/libraries
profiles/mz/themes
...
sites/default/settings.php
sites/default/settings.prod.php
sites/default/settings.test.php
sites/default/settings.dev.php
...
index.php
...
README.md
```

We also store `settings.php` in the git repository, and include an if statement to load the right `settings.php` depending on the environment that is available.

Another advantage of versioning environment-dependent settings is that you can force certain variables to be set in code, e.g. for production you might want to add

```php
// Caching settings
$conf['page_cache_without_database'] = TRUE;
$conf['page_cache_invoke_hooks'] = FALSE;
```

to your `settings.prod.php`, making all these settings directly available in git and thus for review by your peers, and it avoids having to wonder what setting is active on which environment

Finally, create a `settings.local.php` file that is loaded from `settings.php`, with your local database settings.

```php
// For local development
if (file_exists('./sites/default/settings.local.php')) {
  include_once('./sites/default/settings.local.php');
}
```

## What's next?

Now that we have given an overview of our favourite project architecture in Drupal (makefiles, profiles, and github), some of the next topics we'd like to talk about our setting up a continuous integration pipeline (using [Travis CI](https://travis-ci.com/)), writing a couple of Behat tests to assert your site works fine, and reviewing our worfklows with Github (pull requests, issues, releases).

Did you miss our "Coding as a Team" series? Check out [pt.1: automation workflow using Phing](https://marzeelabs.org/blog/2014-03-03-coding-as-a-team-automation-using-phing), [pt. 2: using content fixtures](https://marzeelabs.org/blog/2014-03-17-coding-as-a-team-content-fixtures) and [pt. 3: code workflow](https://marzeelabs.org/blog/2014-05-18-coding-as-a-team-code-workflow).
