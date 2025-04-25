# astro-selfie-veeva

[Astro](https://astro.build) integration to generate page screenshots for use as thumbnails in Veeva CLM presentations.

Note, this is a copy of [astro-selfie](https://github.com/vadimdemedes/astro-selfie) by Vadim Demedes" that I modified for my own needs. All credit goes to them.

---

## Install

```console
npm install --save-dev astro-selfie
```

## Usage

### 1. Set up integration

Add this integration to `astro.config.mjs`:

```diff
import {defineConfig} from 'astro/config';
+ import selfie from 'astro-selfie';

export default defineConfig({
+    integrations: [selfie()]
});
```

This integration is meant to be used locally for statically built websites. Do not try to deploy this in a CI environment.

### 4. Generate screenshots

Run a build command to take screenshots of all pages and store them in `public/og` directory.

```console
npx astro build
```


