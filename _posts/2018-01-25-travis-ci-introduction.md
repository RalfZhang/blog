---
title: Travis CI 简单上手
date: 2018-01-25 14:34:00
tags:
- tool
- CI
---

# 问题  
通常我们开发完某项功能后，需要将项目打包并发布到服务器。其中最“简单”的做法是本地打包，手动通过 scp 等方式发送到服务器。但是这样做比较麻烦，每次都要手动走一遍流程。所以我们期望用某种方式能自动化处理这个流程。

# 解决方案  
在这里，我们使用 Travis CI 进行[持续集成](https://zh.wikipedia.org/zh-cn/%E6%8C%81%E7%BA%8C%E6%95%B4%E5%90%88)。该工具可以和 GitHub 搭配使用，它提供了一个在线的命令工具，能读取项目中的 `.travis.yml` 配置文件，执行配置的相关命令。  
在此以[该项目](https://github.com/RalfZhang/vdo)为例，我们对项目的 master 分支进行监测。在 dev 分支开发完成后，将变动合并到 master 分支，此时，Travis 检测到 master 分支变动，运行打包命令 `yarn run build`，打包完成后运行 `scp -r dist name@8.8.8.8:/direction` 命令将 dist 文件夹部署到服务器。  
除了 Travis 的配置文件，我们还有问题要解决——如果没有被信任，Travis 的每次执行 scp 命令时都需要输入密码。解决方案很简单，我们把本地开发机的公钥发给服务器，服务器就可以信任本地开发机了，同时我们把本地开发机的私钥交给 Travis，那么 Travis 就可以伪装成本地开发机直接执行 scp 而不需要输入密码。（更多：[分对称加密](https://zh.wikipedia.org/zh-hans/%E5%85%AC%E5%BC%80%E5%AF%86%E9%92%A5%E5%8A%A0%E5%AF%86)）  
但这还有一个问题。如果我们把私钥上传到 GitHub，私钥就公开了，服务器分分钟被操。所以我们使用 Travis 的 encrypt-file 来对私钥文件加密，Travis 运行时再对加密后的私钥文件解密，就可以保证安全了。  

# 步骤
在 GitHub 项目的 master 分支创建 `.travis.yml` 文件。  
使用 GitHub 账户登录 https://travis-ci.org/ ，开启想配置的项目。

在本地开发机上生成公钥密钥  
`ssh-keygen -t rsa`  

拷贝公钥至服务器（如果服务器没有相应的文件请自行创建）  
`cat .ssh/id_rsa.pub | ssh user@8.8.8.8 "cat >> ~/.ssh/authorized_keys"`  

这时候就完成了服务器对本地开发机的信任。可以尝试 ssh 登录，不需要输入密码。  

下一步是对私钥进行加密。

首先请安装 Ruby。踩坑提示：  
- 目前 2.5.0 提供的依赖包版本过高，安装 Travis 时会报错，推荐安装 2.4.* 版本。（本文发布于 2018 年 1 月）  
- 因国内 SB 网络问题，本地安装可能失败，推荐将私钥发送至服务器，在服务器端使用 Travis 对私钥进行加密。

安装 Travis  
`gem install travis`  

使用 GitHub 账户登录  
`travis login`  

在项目目录下执行加密私钥命令  
`travis encrypt-file  ~/.ssh/id_rsa --add`  

这时候会发现 `.travis.yml` 文件多了以下内容  
```yml
before_install:
- openssl aes-256-cbc -K $encrypted_04c64bd82511_key -iv $encrypted_04c64bd82511_iv
  -in ~/.ssh/id_rsa.enc -out ~/.ssh/id_rsa -d
```

如果是在服务器端进行加密操作的，接下来把加密后的私钥文件 `id_rsa.enc` 复制到本地项目代码库中，并删除未加密的私钥，避免危险。

复制上文解密命令到本地 `.travis.yml` 文件中，注意修改 `~/.ssh/id_rsa.enc` 为 `./id_rsa.enc`。

主体加密问题解决，接下来做两个优化。  
- 降低id_rsa文件的权限，以便读取密钥文件
- 将服务器加入到 Travis 信任列表中  

此时，配置文件内容为：  
```yml
before_install:
- openssl aes-256-cbc -K $encrypted_04c64bd82511_key -iv $encrypted_04c64bd82511_iv
  -in id_rsa.enc -out ~/.ssh/id_rsa -d
- chmod 600 ~/.ssh/id_rsa
- echo -e "Host 8.8.8.8\n\tStrictHostKeyChecking no\n" >> ~/.ssh/config
```

至此完善 `.travis.yml` 相关配置。  
配置文件比较简单，再次不多做说明。
```yml
language: node_js
node_js:
- node
- '8'
before_install:
- openssl aes-256-cbc -K $encrypted_04c64bd82511_key -iv $encrypted_04c64bd82511_iv
  -in id_rsa.enc -out ~/.ssh/id_rsa -d
- chmod 600 ~/.ssh/id_rsa
- echo -e "Host 8.8.8.8\n\tStrictHostKeyChecking no\n" >> ~/.ssh/config
install:
- yarn install
script:
- yarn run build
after_success:
- scp -r dist name@8.8.8.8:/direction
```


# 参考
- https://docs.travis-ci.com/
- https://cnodejs.org/topic/5885f19c171f3bc843f6017e
- http://www.voidcn.com/article/p-aglpzloh-c.html