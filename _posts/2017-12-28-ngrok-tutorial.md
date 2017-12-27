---
title: Ngrok 内网穿透配置指南
date: 2017-12-28 00:59:51
tags:
- tool
---

# 问题

最近在用家里的电脑开发一些接口，本地访问时候可以用 `http://localhost:8000` 访问。可是如果离开了家，在公网是无法直接访问到的。  
如果每次出门前都提交并部署到 VPS 上，会有两个问题：
1. 非常麻烦。
2. 有时候还处于开发调试阶段，不适合部署到 VPS 上。  

这个问题最好的解决方案是，用一个公网上的域名和端口作为跳板，直接访问到家里开发机的端口。即我使用 `http://xxx.ralfz.com:8081` 就可以获取 `http://localhost:8000` 的内容。  
下面我们就用 ngrok 来解决这个问题 。

# 物料准备

1. 公网 VPS 一台
2. 指向这台 VPS 的域名一个
3. 类似于我家里电脑的开发机一个

# 服务器操作

我的 VPS 操作系统是 CentOS，以下是相关步骤。  

安装相关工具：  
```bash
sudo yum install build-essential golang mercurial git
```  
请确保都安装成功。  
（我在安装时遇到 `build-essential` 安装失败，根据 [StackExchange 提示](https://unix.stackexchange.com/questions/16422/cant-install-build-essential-on-centos)，用 `sudo yum groupinstall 'Development Tools'` 解决）  

下载 ngrok：  
```bash
git clone https://github.com/inconshreveable/ngrok.git ngrok
cd ngrok
```

生成证书：（注意替换为自己 VPS 的域名）  
```bash
NGROK_DOMAIN="yourdomain.com"
openssl genrsa -out base.key 2048
openssl req -new -x509 -nodes -key base.key -days 10000 -subj "/CN=$NGROK_DOMAIN" -out base.pem
openssl genrsa -out server.key 2048
openssl req -new -key server.key -subj "/CN=$NGROK_DOMAIN" -out server.csr
openssl x509 -req -in server.csr -CA base.pem -CAkey base.key -CAcreateserial -days 10000 -out server.crt

cp base.pem assets/client/tls/ngrokroot.crt
```

编译生成服务器的 ngrokd：  
`sudo make release-server`  

启动：  
`sudo ./bin/ngrokd -tlsKey=server.key -tlsCrt=server.crt -domain="yourdomain.com" -httpAddr=":8081" -httpsAddr=":8082"`  

运行成功后可看到：  
![图片](./1.png)  

访问 `yourdomain.com:8081` 可看到 `Tunnel yourdomain.com:8081 not found`。这说明服务端已成功启动。  
![图片](./2.png)  

接下来，我们需要根据客户端的平台来编译客户端的 ngrok。我的客户端（开发机）是 Windows 64 位操作系统，需要在 VPS 上运行：  
```bash
GOOS=windows GOARCH=amd64 make release-client
```  

不同平台的配置如下：  

    Linux 平台 32 位系统：GOOS=linux GOARCH=386
    Linux 平台 64 位系统：GOOS=linux GOARCH=amd64
    Windows 平台 32 位系统：GOOS=windows GOARCH=386
    Windows 平台 64 位系统：GOOS=windows GOARCH=amd64
    MAC 平台 32 位系统：GOOS=darwin GOARCH=386
    MAC 平台 64 位系统：GOOS=darwin GOARCH=amd64
    ARM 平台：GOOS=linux GOARCH=arm  

请根据你的客户端平台来编译客户端 ngrok。  
编译成功后，会在 `./bin` 里生成相应的客户端文件件，客户端平台名是文件夹的名字（比如我的是 `./bin/windows_amd64`）。

最后通过 scp 等操作，将客户端文件夹复制到客户端电脑上，以供下一步使用。  

（注意，请保持服务端服务开启）

# 客户端操作

打开复制来的客户端文件夹，会看到 `ngrok` 的可执行文件。在该文件添加新文件 `ngrok.cfg`，粘贴以下内容：
```
server_addr: yourdomain:4443
trust_host_root_certs: false
```  
最后，运行以下命令即可启动：  
```bash
ngrok.exe  -subdomain=pub -proto=http -config=ngrok.cfg 8000
```  
其中，8000 是客户端本地的希望能在公网访问的端口，pub 是子域名。

这时，打开 `pub.yourdomain.com:8081` 即可看到你本地的服务。

# 结语  

以上是 ngrok 实现内网穿透的基础步骤，该工具能实现的东西较多，后期慢慢研究。