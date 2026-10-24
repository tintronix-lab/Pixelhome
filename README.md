# Pixel Home website

The product, support and privacy pages for **Pixel Home**, a cozy queue-sorting puzzle game for iPhone and iPad, in nine languages.

- `index.html`: product page
- `support.html`: help and how to get in touch
- `privacy.html`: privacy policy
- `play/`: the game's web edition, the Meadow and the Daily Flow in the browser, linked from the product page. A shared Daily Flow result leads here (`play/?daily=2026-10-24`).
- `settings/v1.json`: settings the game reads at launch (from version 1.1) to show fewer ads or ask older versions to update. Every field and its limits are described in `docs/ADS.md` in the PixelFlow repository. It can only make ads rarer.

English is at the root; German, Spanish, French, Italian, Japanese, Dutch, Brazilian Portuguese and Swedish each have a folder (`de/`, `es/`, `fr/`, `it/`, `ja/`, `nl/`, `pt-br/`, `sv/`).

## Editing

The HTML files are generated: do not edit them by hand.

- Text lives in `i18n/<language>.json`, one file per language with the same keys as `i18n/en.json`.
- Layout lives in the templates in `build.mjs`; styles in `styles.css`.
- `node build.mjs --check` verifies every translation against the English (same keys, same links and placeholders).
- `node build.mjs` writes all pages. Commit the result: GitHub Pages serves the `main` branch as it is.

The words used for things in the game (buttons, worlds, items) follow the game's own translations, so the site and the game read the same.

## Updating the web edition

`play/` is built in the PixelFlow repository, not here, and is replaced as a whole: don't edit it by hand. With this checkout next to PixelFlow (`../Pixelhome`), run there:

```bash
npm run web:site                          # or: npm run web:site -- path/to/Pixelhome
```

Then commit `play/` here on a branch and open a pull request. Merging it publishes the new build straight away.
