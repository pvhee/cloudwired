# Content Management

## Link Checking Procedure

When migrating or reviewing posts from Medium exports, follow this procedure to restore missing links:

### 1. Locate the original Medium export

Find the corresponding HTML file in the Medium export directory:
```
medium-export-*/posts/YYYY-MM-DD_Title-*.html
```

### 2. Compare links

Open both files and compare:
- The markdown file in `content/posts/`
- The original HTML in `medium-export-*/posts/`

Look for `<a href="...">` tags in the HTML that don't have corresponding `[text](url)` markdown links.

### 3. Common missing link patterns

Links are often lost for:
- Tool/service names (e.g., Cloudflare Workers, AWS Lambda, Sentry)
- Technical terms with documentation links (e.g., V8 isolates, Worker Sites)
- External references (e.g., Wikipedia articles, Twitter hashtags)
- Company/organization names

### 4. Add missing links

Convert plain text to markdown links:
```markdown
# Before
We used Cloudflare Workers for the platform.

# After
We used [Cloudflare Workers](https://workers.cloudflare.com/) for the platform.
```

### 5. Posts reviewed

- [x] a-technical-deep-dive-into-processing-5-million-in-donations-in-2-hours-using-cloudflare-workers.md
- [x] blueprinting-drupal-projects.md (no missing links)
- [x] introducing-leaflet-for-drupal.md (no missing links)
- [x] drupal-developer-days-in-barcelona.md (no missing links)
- [x] pipelines-everywhere.md (no missing links)
- [x] drupal-commerce-done-differently.md (no missing links)
- [x] coding-as-a-team-automation-using-phing.md (no missing links)
- [x] building-rednoseday-com-on-drupal-8.md (added RabbitMQ, Social links, View Modes Display links)
- [x] drupalcon-barcelona-call-for-sessions.md (no missing links)
- [x] launching-arte-concert.md (no missing links)
- [x] how-we-build-websites-using-pipelines-at-zero-cost.md (no missing links)
- [x] phd-thesis.md (no missing links)
- [x] serverless-at-comic-relief.md (no missing links)
- [x] drupalcon-baltimore-talk-slides.md (added Flickr image credit)
- [x] building-maps-in-drupal-using-leaflet-and-views.md (no missing links)
- [x] serverless-not-hotdog.md (added serverless blog series, image dataset, loadtest code links)
- [x] bringing-our-comic-relief-values-to-life-with-iot-and-serverless.md (no missing links)
