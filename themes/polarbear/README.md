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

主题的全部选项及默认值见 `hugo.yaml`；站点配置里的 `params` 会覆盖它们。菜单写在站点配置的 `languages.<lang>.menus.main`，菜单名按 `menu.<identifier>` 在 `i18n/` 中翻译。
All theme options and their defaults are in `hugo.yaml`; the site's `params` override them. Menus go in the site config (`languages.<lang>.menus.main`); menu names are translated through `menu.<identifier>` in `i18n/`.

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
