# astro-selfie-veeva

[Astro](https://astro.build) integration to generate page screenshots for use as thumbnails in Veeva CLM presentations.

Note, this is a copy of [astro-selfie](https://github.com/vadimdemedes/astro-selfie) by Vadim Demedes" that I modified for my own needs. All credit goes to them.

---

## Setup

### Install

```console
npm install --save-dev astro-selfie
```

### Set up integration

Add this integration to `astro.config.mjs`:

```diff
import {defineConfig} from 'astro/config';
+ import selfie from 'astro-selfie';

export default defineConfig({
+    integrations: [selfie()]
});
```

By default, this will set the viewport and screen size for the screenshots to 1024x768.

If you wish to override that, (for instance you are designing designing for a 1366x1024 iPad) you can do that via options like this:

```diff
import {defineConfig} from 'astro/config';
+ import selfie from 'astro-selfie';

export default defineConfig({
+    integrations: [
+       selfie({
+         screen: { width: 1366, height: 1024 }, // default 1024x768
+         viewport: { width: 1366, height: 1024 }, // default 1024x768
+       })]
});
```



### Optional: Separate Config

I find it useful to set up a separate config just for screenshotting so I can run it manually when I need to, rather adding significant time to every build.

To do this, copy your main config file to something like: `astro.thumbnails.config.mjs`, make the above changes, and then run it with:

```console
astro build --config astro.thumbnails.config.mjs
```

You can add it to your `package.json` like this:

```diff
  "scripts": {
    "dev": "astro dev",
    "start": "astro dev",
    "build": "astro check && astro build",
+    "veeva-thumbnails": "astro build --config astro.thumbnails.config.mjs",
  }
```


## Usage: Generate screenshots and thumbnails

When you run `astro build`, for each page:

1. Screenshot will generated and saved in `tmp/screenshots`, named `[pagename].png`
1. Large Veeva thumbnail (1024x768) will be generated and saved at `thumbnails/[pagename]-full.png`
1. Small Veeva thumbnail (200x150) will be generated and saved at `thumbnails/[pagename]-thumb.png`
