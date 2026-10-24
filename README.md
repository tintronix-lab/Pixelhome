# Pixel Home website

The product, support and privacy pages for **Pixel Home**, a cozy queue-sorting puzzle game for iPhone and iPad, in nine languages.

- `index.html`: product page
- `support.html`: help and how to get in touch
- `privacy.html`: privacy policy
- `settings/v1.json`: settings the game reads at launch (from version 1.1) to show fewer ads or ask older versions to update. Every field and its limits are described in `docs/ADS.md` in the PixelFlow repository. It can only make ads rarer.

English is at the root; German, Spanish, French, Italian, Japanese, Dutch, Brazilian Portuguese and Swedish each have a folder (`de/`, `es/`, `fr/`, `it/`, `ja/`, `nl/`, `pt-br/`, `sv/`).

## Editing

The HTML files are generated: do not edit them by hand.

- Text lives in `i18n/<language>.json`, one file per language with the same keys as `i18n/en.json`.
- Layout lives in the templates in `build.mjs`; styles in `styles.css`.
- `node build.mjs --check` verifies every translation against the English (same keys, same links and placeholders).
- `node build.mjs` writes all pages. Commit the result: GitHub Pages serves the `main` branch as it is.

The words used for things in the game (buttons, worlds, items) follow the game's own translations, so the site and the game read the same.
