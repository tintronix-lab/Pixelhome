# Pixel Home website

The product, support and privacy pages for **Pixel Home**, a cozy queue-sorting puzzle game for iPhone and iPad, in twelve languages.

- `index.html`: product page
- `support.html`: help and how to get in touch
- `privacy.html`: privacy policy
- `play/`: the game's web edition, the Meadow and the Daily Flow in the browser, linked from the product page. A shared Daily Flow result leads here (`play/?daily=2026-10-24`).
- `settings/v1.json`: settings the game reads at launch (from version 1.1) to show fewer ads or ask older versions to update. Every field and its limits are described in `docs/ADS.md` in the PixelFlow repository. It can only make ads rarer.
- `packs/v1/`: garden packs, new levels the game (from version 1.3) downloads, proves on the device and offers without an update: `index.json` lists them and each pack is a file beside it. They are made and checked in the PixelFlow repository (`docs/PACKS.md`) and written here by `npm run packs:site` there; don't edit them by hand.

English is at the root; German, Spanish, French, Italian, Japanese, Korean, Dutch, Brazilian Portuguese, Swedish, Thai and Traditional Chinese each have a folder named after the language tag in lower case (`de/`, `es/`, `fr/`, `it/`, `ja/`, `ko/`, `nl/`, `pt-br/`, `sv/`, `th/`, `zh-hant/`).

Adding a language follows `docs/LANGUAGES.md` in the PixelFlow repository: the game's catalog and glossary come first, then this site's text, then the store links.

## Editing

The HTML files are generated: do not edit them by hand.

- Text lives in `i18n/<language>.json`, one file per language with the same keys as `i18n/en.json`.
- Layout lives in the templates in `build.mjs`; styles in `styles.css`.
- `node build.mjs --check` verifies every translation against the English (same keys, same links and placeholders).
- `node build.mjs` writes all pages. Commit the result: GitHub Pages serves the `main` branch as it is.
- `assets/app-clip-qr.svg` is the QR code on the product page, which opens the App Clip on today's Daily Flow. `swift tools/app-clip-qr.swift > assets/app-clip-qr.svg` remakes it from the link in the script (the same as `APP_CLIP` in `build.mjs`).

The words used for things in the game (buttons, worlds, items) follow the game's own translations, so the site and the game read the same.

## Updating the web edition

`play/` is built in the PixelFlow repository, not here, and is replaced as a whole: don't edit it by hand. With this checkout next to PixelFlow (`../Pixelhome`), run there:

```bash
npm run web:site                          # or: npm run web:site -- path/to/Pixelhome
```

Then commit `play/` here on a branch and open a pull request. Merging it publishes the new build straight away.
