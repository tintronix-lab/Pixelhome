// Builds the site: one set of pages per language from the templates below and
// the text in i18n/<language>.json. English is published at the root, every
// other language in its own folder (de/, sv/, …).
//
//   node build.mjs           writes the pages
//   node build.mjs --check   only verifies the translations
//
// Text may use <b>…</b> and named links such as <a:support>…</a> (see LINKS);
// a translation must use the same ones, and the same {placeholders}, as the
// English text. Anything else is escaped.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const SITE = 'https://tintronix-lab.github.io/Pixelhome/';
const EFFECTIVE = new Date(Date.UTC(2026, 9, 24));
/** The copyright holder, named in every language's footer. */
const OWNER = 'RazTech Innovations';
const CHECK_OWNER = true;
/** Pixel Home on the App Store. */
const APP_STORE_ID = '6821402076';
const APP_STORE = `https://apps.apple.com/app/id${APP_STORE_ID}`;
/** Where support and privacy questions go; "{email}" in the text. */
const SUPPORT_EMAIL = 'raztechsupport@icloud.com';

/** Language tag, folder ('' is the root) and the language's own name. */
const LANGUAGES = [
  ['en', '', 'English'],
  ['de', 'de/', 'Deutsch'],
  ['es', 'es/', 'Español'],
  ['fr', 'fr/', 'Français'],
  ['it', 'it/', 'Italiano'],
  ['ja', 'ja/', '日本語'],
  ['nl', 'nl/', 'Nederlands'],
  ['pt-BR', 'pt-br/', 'Português (Brasil)'],
  ['sv', 'sv/', 'Svenska'],
];

const PAGES = { index: '', support: 'support.html', privacy: 'privacy.html' };

/**
 * The six pips, as in the game (src/core/colors.ts): text key, name and color.
 * Names are the same in every language. Their pictures (assets/pip-*.png) are
 * the game's own sprites, one image pixel per art pixel.
 */
const PIPS = [
  ['posy', 'Posy', 'pink'],
  ['dew', 'Dew', 'blue'],
  ['sprig', 'Sprig', 'green'],
  ['sunny', 'Sunny', 'yellow'],
  ['luna', 'Luna', 'purple'],
  ['cinder', 'Cinder', 'orange'],
];

/** Where named links go. `root` is the path from the page to the site root. */
const LINKS = {
  support: () => 'support.html',
  privacy: () => 'privacy.html',
  // The game's web edition, built from the PixelFlow repository (npm run web:site).
  play: (root) => `${root}play/`,
  english: (root) => `${root}privacy.html`,
  email: () => `mailto:${SUPPORT_EMAIL}`,
  refund: () => 'https://reportaproblem.apple.com',
  'apple-privacy': () => 'https://www.apple.com/legal/privacy/',
  'google-privacy': () => 'https://policies.google.com/technologies/partner-sites',
  'posthog-privacy': () => 'https://posthog.com/privacy',
  'github-privacy': () =>
    'https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement',
};

const escape = (text) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** The markup and placeholders a string uses, for comparing a translation with the English. */
const shape = (text) =>
  [...text.matchAll(/<\/?(?:b|a(?::[a-z-]+)?)>|\{\w+\}/g)].map((m) => m[0]).sort().join(' ');

function load(tag) {
  const file = `i18n/${tag}.json`;
  return existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : null;
}

const english = load('en');
const problems = [];
const available = LANGUAGES.filter(([tag]) => {
  const text = load(tag);
  if (!text) return false;
  for (const [section, strings] of Object.entries(english)) {
    for (const [key, source] of Object.entries(strings)) {
      const value = text[section]?.[key];
      const where = `${tag}: ${section}.${key}`;
      if (typeof value !== 'string' || !value.trim()) problems.push(`${where} is missing`);
      else if (shape(value) !== shape(source)) {
        problems.push(`${where} has different markup or placeholders than the English`);
      } else if (/<(?!\/?(?:b|a(?::[a-z-]+)?)>)/.test(value)) {
        problems.push(`${where} contains markup other than <b> and named links`);
      }
    }
    if (CHECK_OWNER && section === 'common' && !text.common?.copyright?.includes(`© 2026 ${OWNER}`)) {
      problems.push(`${tag}: common.copyright must name "© 2026 ${OWNER}"`);
    }
    for (const key of Object.keys(text[section] ?? {})) {
      if (!(key in strings)) problems.push(`${tag}: ${section}.${key} is not in the English text`);
    }
  }
  return true;
});
if (problems.length) {
  console.error(problems.join('\n'));
  process.exit(1);
}
if (process.argv.includes('--check')) {
  console.log(`✓ ${available.map(([tag]) => tag).join(', ')}`);
  process.exit(0);
}

function render([tag, folder], page) {
  const text = load(tag);
  const root = folder ? '../' : '';
  /** Plain text, for attributes. */
  const plain = (section, key) => escape(text[section][key].replace(/<[^>]+>/g, ''));
  /** Text with its <b> and named links turned into HTML. */
  const rich = (section, key, vars = {}) =>
    escape(text[section][key])
      .replace(/\{(\w+)\}/g, (whole, name) =>
        name in vars ? escape(vars[name]) : name === 'email' ? SUPPORT_EMAIL : whole,
      )
      .replace(/&lt;(\/?)b&gt;/g, '<$1strong>')
      .replace(/&lt;a:([a-z-]+)&gt;/g, (_, name) => `<a href="${LINKS[name](root)}">`)
      .replace(/&lt;\/a&gt;/g, '</a>');
  const t = (key, vars) => rich(page, key, vars);
  const c = (key) => rich('common', key);
  const url = (f, p) => SITE + f + PAGES[p];
  const current = (p) => (p === page ? ' aria-current="page"' : '');
  const date = new Intl.DateTimeFormat(tag, { dateStyle: 'long', timeZone: 'UTC' }).format(
    EFFECTIVE,
  );

  /** Links to this page in every language, each in its own name. */
  const switcher = (indent) =>
    available
      .map(
        ([other, f, name]) =>
          `${indent}<a href="${`${root}${f}${PAGES[page]}` || './'}" lang="${other}" hreflang="${other}"${other === tag ? ' aria-current="true"' : ''}>${name}</a>`,
      )
      .join('\n');

  const bodies = {
    index: () => `      <section class="card hero">
        <img class="icon" src="${root}assets/icon.png" alt="${plain('index', 'iconAlt')}" width="112" height="112" />
        <h1 class="wordmark" aria-label="Pixel Home"><span aria-hidden="true"><span class="c-r">P</span><span class="c-y">I</span><span class="c-g">X</span><span class="c-b">E</span><span class="c-p">L</span></span> <span aria-hidden="true"><span class="c-o">H</span><span class="c-r">O</span><span class="c-y">M</span><span class="c-g">E</span></span></h1>
        <p class="tagline">${t('tagline')}</p>
        <a class="badge" href="${APP_STORE}">${t('badge')}</a>
        <p class="play">${t('play')}</p>${
          available.length > 1
            ? `
        <p class="small languages">
${switcher('          ')}
        </p>`
            : ''
        }
      </section>

      <div class="shots" aria-label="${plain('index', 'shots')}">
        <img src="${root}assets/2-title.png" alt="${plain('index', 'shotTitle')}" width="603" height="1311" />
        <img src="${root}assets/1-brookside.png" alt="${plain('index', 'shotBrookside')}" width="603" height="1311" loading="lazy" />
        <img src="${root}assets/3-glowcave.png" alt="${plain('index', 'shotGlowcave')}" width="603" height="1311" loading="lazy" />
        <img src="${root}assets/4-postcards.png" alt="${plain('index', 'shotPostcards')}" width="603" height="1311" loading="lazy" />
        <img src="${root}assets/5-gifts.png" alt="${plain('index', 'shotGifts')}" width="603" height="1311" loading="lazy" />
      </div>

      <section class="card">
        <h2>${t('howTitle')}</h2>
        <p>${t('how1')}</p>
        <p>${t('how2')}</p>
      </section>

      <section class="card">
        <h2>${t('pipsTitle')}</h2>
        <p>${t('pipsIntro')}</p>
      </section>

      <div class="grid pips">
${PIPS.map(
  ([key, name, color]) => `        <section class="card pip" style="--dot: var(--${color})">
          <div class="pip-head">
            <img src="${root}assets/pip-${key}.png" alt="" width="13" height="17" />
            <div>
              <h3>${name}</h3>
              <p class="trait">${t(`${key}Trait`)}</p>
            </div>
          </div>
          <p>${t(`${key}Story`)}</p>
        </section>`,
).join('\n')}
      </div>

      <div class="grid">
${[
  ['worlds', 'green'],
  ['daily', 'gold'],
  ['pace', 'blue'],
  ['lives', 'pink'],
  ['collect', 'purple'],
  ['devices', 'orange'],
]
  .map(
    ([key, color]) => `        <section class="card" style="--dot: var(--${color})">
          <h3>${t(`${key}Title`)}</h3>
          <p>${t(key)}</p>
        </section>`,
  )
  .join('\n')}
      </div>

      <section class="card">
        <h2>${t('freeTitle')}</h2>
        <p>${t('free1')}</p>
        <p>${t('free2')}</p>
      </section>`,

    support: () => `      <article class="card prose">
        <h1>${t('heading')}</h1>
        <p class="lead">${t('lead')}</p>

        <h2>${t('contactTitle')}</h2>
        <p>${t('contact')}</p>
        <p><a class="button" href="mailto:${SUPPORT_EMAIL}">${t('contactButton')}</a></p>
        <p class="small">${t('contactNote')}</p>

        <h2>${t('livesTitle')}</h2>
        <p>${t('lives')}</p>

        <h2>${t('adsTitle')}</h2>
        <p>${t('ads')}</p>

        <h2>${t('stuckTitle')}</h2>
        <p>${t('stuck')}</p>

        <h2>${t('purchaseTitle')}</h2>
        <ul>
          <li>${t('purchase1')}</li>
          <li>${t('purchase2')}</li>
          <li>${t('purchase3')}</li>
          <li>${t('purchase4')}</li>
        </ul>

        <h2>${t('progressTitle')}</h2>
        <p>${t('progress1')}</p>
        <p>${t('progress2')}</p>

        <h2>${t('gameCenterTitle')}</h2>
        <p>${t('gameCenter')}</p>

        <h2>${t('deleteTitle')}</h2>
        <p>${t('delete')}</p>
      </article>`,

    privacy: () => `      <article class="card prose">
        <h1>${t('heading')}</h1>
        <p class="lead">${t('effective', { date })}</p>
        <p class="note">${t('summary')}</p>
${['device', 'signIn', 'icloud', 'gameCenter', 'purchases', 'ads', 'adsData', 'adsChoice', 'stats', 'children', 'site', 'changes', 'language', 'contact']
  .map(
    (key) => `
        <h2>${t(`${key}Title`)}</h2>
        <p>${t(key)}</p>`,
  )
  .join('\n')}
      </article>`,
  };

  const description = plain(page, 'description');
  const title = plain(page, 'title');
  return `<!doctype html>
<html lang="${tag}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${SITE}assets/2-title.png" />
    <meta name="theme-color" content="#9fd283" />
    <meta name="apple-itunes-app" content="app-id=${APP_STORE_ID}" />
    <link rel="canonical" href="${url(folder, page)}" />
${available.map(([other, f]) => `    <link rel="alternate" hreflang="${other}" href="${url(f, page)}" />`).join('\n')}
    <link rel="alternate" hreflang="x-default" href="${url('', page)}" />
    <link rel="icon" href="${root}assets/icon.png" />
    <link rel="apple-touch-icon" href="${root}assets/apple-touch-icon.png" />
    <link rel="stylesheet" href="${root}styles.css" />
  </head>
  <body>
    <header class="wrap top">
      <a class="brand" href="./"><img src="${root}assets/icon.png" alt="" width="40" height="40" />Pixel Home</a>
      <nav aria-label="${plain('common', 'pages')}">
        <a href="support.html"${current('support')}>${c('support')}</a>
        <a href="privacy.html"${current('privacy')}>${c('privacy')}</a>
      </nav>
    </header>

    <main class="wrap">
${bodies[page]()}
    </main>

    <footer>
      <div class="wrap">
        <span>${c('copyright')}</span>
        <nav aria-label="${plain('common', 'footer')}">
          <a href="./">${c('home')}</a>
          <a href="support.html">${c('support')}</a>
          <a href="privacy.html">${c('privacy')}</a>
        </nav>
      </div>
${
  available.length > 1
    ? `      <nav class="wrap languages" aria-label="${plain('common', 'languages')}">
${switcher('        ')}
      </nav>
`
    : ''
}    </footer>
  </body>
</html>
`;
}

let count = 0;
for (const language of available) {
  const folder = language[1];
  if (folder) mkdirSync(folder, { recursive: true });
  for (const page of Object.keys(PAGES)) {
    writeFileSync(`${folder}${PAGES[page] || 'index.html'}`, render(language, page));
    count++;
  }
}
console.log(`✓ ${count} pages in ${available.length} languages`);
