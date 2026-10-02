# Blog

Built with [Hugo](https://gohugo.io/) and deployed to GitHub Pages on every push to `main`
(`.github/workflows/pages.yml`). Needs Hugo and [Dart Sass](https://sass-lang.com/dart-sass/)
(`brew install hugo dart-sass`); CI pins the versions.

```sh
hugo server                                              # preview at http://localhost:1313/
hugo new content posts/2026-10-07-my-post/index.md       # a post, at /2026/10/07/my-post/
hugo new content posts/2026-10-07-my-post/index.en.md    # its English translation, at /en/2026/10/07/my-post/
```

A post is a folder: `index.md` (Chinese) and `index.en.md` (English, optional) share the images next to them.

TODO
- Google Analytics update
- Theme package
- Dark / Light mode

Next articles:
- ROTK 14 web: step 1
- Idea of InkCity
