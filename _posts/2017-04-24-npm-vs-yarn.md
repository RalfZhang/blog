---
title: npm、Yarn 命令对照表
date: 2017-04-24 15:06:54
tags:
- npm
- yarn
- node
---


<p align="center">
    <img alt="npm & Yarn" src="./logos.png" width="546">
</p>


# npm、Yarn 命令对照表

## 常用

| npm | yarn |
| ---- | ---- |
| `npm install` | `yarn` |
| `npm install [package] --save` | `yarn add [package]` |
| `npm uninstall [package] --save` | `yarn remove [package]` |
| `npm install [package] --save-dev` | `yarn add [package] --dev` |
| `npm update --save` | `yarn upgrade` |
| `npm install taco@latest --save` | `yarn add taco` |
| `npm install taco --global` | `yarn global add taco` |

---


## 差异  

| npm | yarn |
| ---- | ---- |
| `npm install` | `yarn` |
| (N/A) | `yarn install --flat` |
| (N/A) | `yarn install --har` |
| (N/A) | `yarn install --no-lockfile` |
| (N/A) | `yarn install --pure-lockfile` |
| `npm install [package]` | (N/A) |
| `npm install --save [package]` | `yarn add [package]` |
| `npm install --save-dev [package]` | `yarn add [package] --dev` |
| (N/A) | `yarn add [package] --peer` |
| `npm install --save-optional [package]` | `yarn add [package] --optional` |
| `npm install --save-exact [package]` | `yarn add [package] --exact` |
| (N/A) | `yarn add [package] --tilde` |
| `npm install --global [package]` | `yarn global add [package]` |
| `npm uninstall [package]` | (N/A) |
| `npm uninstall --save [package]` | `yarn remove [package]` |
| `npm uninstall --save-dev [package]` | `yarn remove [package]` |
| `npm uninstall --save-optional [package]` | `yarn remove [package]` |
| `rm -rf node_modules && npm install` | `yarn upgrade` |

---

## 相同
| npm | yarn |
| ---- | ---- |
| `npm init` | `yarn init` |
| `npm link` | `yarn link` |
| `npm outdated` | `yarn outdated` |
| `npm publish` | `yarn publish` |
| `npm run` | `yarn run` |
| `npm cache clean` | `yarn cache clean` |
| `npm login` | `yarn login` (and logout) |
| `npm test` | `yarn test` |
| `npm install --production` | `yarn --production` |

---

## Yarn 独有
- `yarn licenses ls`
- `yarn licenses generate-disclaimer`
- `yarn why [package]`

---

## npm 独有
- `npm xmas`
- `npm visnup`


## 参考
- https://shift.infinite.red/npm-vs-yarn-cheat-sheet-8755b092e5cc
- http://yarnpkg.cn/zh-Hans/docs/migrating-from-npm