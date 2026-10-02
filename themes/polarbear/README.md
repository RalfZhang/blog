# polarbear

> A light theme bases on Even, designed by Giuem.

[在线预览 Demo](https://d2fan.com)

![Polar Bear](https://wx3.sinaimg.cn/large/e942863dly1fd36foz16ij21kw0xwjxw.jpg)

## 安装使用（Installation）

> 本仓库中的这份主题已从 Hexo 移植到 [Hugo](https://gohugo.io/)：模板在 `layouts/`（Go 模板），样式是 Dart Sass 模块（`@use`），由 Hugo Pipes 编译。上游仓库仍是 Hexo（swig）版本。
> This copy has been ported from Hexo to [Hugo](https://gohugo.io/): the templates are in `layouts/` (Go templates) and the styles are Dart Sass modules (`@use`) compiled by Hugo Pipes. The upstream repository is still the Hexo (swig) version.

需要安装 Hugo 与 Dart Sass（Needs Hugo and Dart Sass）：

```
$ brew install hugo dart-sass
```

修改（Change） hugo.yaml：

```
theme: polarbear

params:
  author: Your name
  description: Your site description
  since: 2017
```

主题的全部选项及默认值见 `hugo.yaml`；站点配置里的 `params` 会覆盖它们。菜单写在站点配置的 `menus.main`，所有语言共用：菜单名按 `menu.<identifier>` 在 `i18n/` 中翻译；`pageRef` 在当前语言没有对应页面时链接到默认语言的页面；`params.output_format` 链接到页面的其他输出格式（首页加 `output_format: atom` 即为当前语言的订阅源）。
All theme options and their defaults are in `hugo.yaml`; the site's `params` override them. Menus go in the site config (`menus.main`) and serve every language: menu names are translated through `menu.<identifier>` in `i18n/`; a `pageRef` with no page in the current language links to the default language's page; `params.output_format` links to another output of the page (`output_format: atom` on the home page gives the language's feed).

多语言站点（Multilingual sites）：有翻译的页面输出 hreflang 链接，`params.hreflang_x_default` 指定 `x-default` 用哪种语言的版本（默认为默认语言）；语言切换链接到当前页面的译文，没有译文时链接到其他语言的首页。
Translated pages get hreflang links, and `params.hreflang_x_default` names the language whose version is the `x-default` one (the default content language if unset). The language switch links to the page's translations, or to the other languages' home pages when it has none.

## ReadmeFirst
主题较为简陋粗糙，使用及修改时需要对 Hugo 有一定了解。
The theme is relatively simple and rough, have a certain understanding of Hugo before you use and modify.

## 侧边栏

```
params:
  # widget function
  # false: disable
  # widget_custom: custom your widget
  #   title: your widget title
  #   content: Add your html code in here. Example: <p>testing...</p>
  widget:
    tags: true
    custom: false

  widget_custom:
    title: Test
    content: <p>testing...</p>
```

## 增加功能 （More Functions）
This theme base on [Even](https://github.com/ahonn/hexo-theme-even)

You can find more functions at [Even](https://github.com/ahonn/hexo-theme-even),
copy and change codes as you want.

EX：赞赏（Reward）、底部版权(Copyright)、社交图标(Social icon)

## 感谢 (Thanks)

Theme Even author: [ahonn](http://www.ahonn.me/)

Theme style designed by: [Giuem](https://www.giuem.com)
