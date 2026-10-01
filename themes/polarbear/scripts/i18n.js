/* global hexo */
'use strict';

// Translated posts. A post whose `lang` differs from the site `language` translates the post at the same path
// without the `<lang>/` prefix: source/_posts/en/2019-01-14-foo.md, with `lang: en` and
// `permalink: en/2019/01/14/foo/`, is the English version of /2019/01/14/foo/. Leave tags and categories off
// translations, so that the tag and category pages list each post once.
//
// The home page, archives and prev/next links are split by language: the default language keeps its paths,
// translations get their own under /<lang>/ (/en/, /en/archives/), and only the default language has a feed.

const { generator, helper } = hexo.extend;
const defaultLang = [].concat(hexo.config.language)[0];

const langOf = post => post.lang || post.language || defaultLang;
const languagesOf = posts => [...new Set([defaultLang, ...posts.map(langOf)])];

// Whether site path `path` is generated, as a file or as a directory with an index.html
const exists = path => {
  const routes = hexo.route.list();
  return [path, `${path.replace(/\/$/, '')}/`].some(p => routes.includes(hexo.route.format(p)));
};

// Run generator `name` once per language with that language's posts. `configFor(lang)` returns the config
// overrides that move a translation's pages under /<lang>/; without it, translations are left out.
function splitByLanguage(name, configFor) {
  const generate = generator.get(name);
  if (!generate) return;

  generator.register(name, locals => Promise.all(languagesOf(locals.posts).map(lang => {
    const posts = locals.posts.filter(post => langOf(post) === lang);
    if (lang === defaultLang) return generate.call(hexo, { ...locals, posts });
    if (!configFor) return;

    // The generators read their paths from this.config
    const ctx = Object.create(hexo, { config: { value: { ...hexo.config, ...configFor(lang) } } });
    return generate.call(ctx, { ...locals, posts }).then(routes => [].concat(routes || []).map(route => {
      // Listing pages need the language for the theme; posts have it in their front-matter
      if (typeof route.data === 'object' && !route.data.lang) route.data.lang = lang;
      return route;
    }));
  })).then(results => results.flatMap(routes => routes || [])));
}

splitByLanguage('post', () => ({}));
splitByLanguage('index', lang => {
  const { index_generator } = hexo.config;
  return { index_generator: { ...index_generator, path: `${lang}/${index_generator.path || ''}` } };
});
splitByLanguage('archive', lang => ({ archive_dir: `${lang}/${hexo.config.archive_dir}` }));
splitByLanguage('atom');
splitByLanguage('rss2');

// Every language version of the current page, this one included: [{ lang, name, path }]. `name` is the
// `language` string of that language's file in languages/.
helper.register('translations', function () {
  // Hexo sets page.lang from the front-matter, falling back to the site language
  const prefix = this.page.lang === defaultLang ? '' : `${this.page.lang}/`;
  if (!this.path.startsWith(prefix)) return [];
  const base = this.path.slice(prefix.length);

  return languagesOf(this.site.posts)
    .map(lang => ({ lang, path: lang === defaultLang ? base : `${lang}/${base}` }))
    .filter(({ path }) => exists(path))
    .map(({ lang, path }) => ({
      lang,
      name: hexo.theme.i18n.get(lang).language || lang,
      path: path.replace(/index\.html$/, '')
    }));
});

// The current page's language version of site path `path` (a menu link, say) if there is one, else `path`
helper.register('lang_path', function (path) {
  const { lang } = this.page;
  if (lang === defaultLang) return path;
  const localized = `/${lang}/${path.replace(/^\//, '')}`;
  return exists(localized) ? localized : path;
});
