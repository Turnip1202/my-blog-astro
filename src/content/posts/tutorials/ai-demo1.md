---
title:  大模型部署教程

published: 2025-01-30 22:44:00

description: 通过ollama框架进行大模型的本地部署。

tags: [Markdown, Blogging, 大模型]

category: 大模型

draft: false
---



# 大模型本地部署

1.前置条件

* docker ，需要有docker，使用docker可以运行LobeChat，windows可以下载Docker Desktop，我这里使用的就是Docker Desktop

* 网络尽量能够连接世界网
  
  
  
  

### 目标：

1.使用Ollama部署大模型；这里部署后的大模型是命令行的。

2.使用LobeChat连接本地的大模型；LobeChat是一个的开源 AI 聊天框架，可以一键集成很多大模型，主要是它提供了美观UI界面。





## 一、ollama相关的配置

### 1.下载和安装

下载地址： [在macOS上下载Ollama - Ollama 框架](https://ollama.org.cn/download)  ；安装是一键式的，一般不会有问题，如果安装失败了，自行解决。

大模型市场：

中文版： https://ollama.org.cn/  不好用，搜索功能不能用，只能在 **模型** 里找

世界版： https://ollama.com/ 顶部可以搜索大模型名

![80f8845a-569a-4669-a5c3-8c3c089789a5](./images/80f8845a-569a-4669-a5c3-8c3c089789a5.png)

![2410d140-794e-4b4e-870a-157fd94bb9b0](./images/2410d140-794e-4b4e-870a-157fd94bb9b0.png)





### 2.基本操作

搜索、找到想要本地部署的模型名

![949b89e1-89ea-4011-a303-5d931110de9b](./images/949b89e1-89ea-4011-a303-5d931110de9b.png)



![f07c39ca-9aa9-4d84-bee1-695b1f13c4bd](./images/f07c39ca-9aa9-4d84-bee1-695b1f13c4bd.png)

DeepSeek的模型都很大，我这里就使用r2版本的了，比较小，操作都是一样的。

直接复制命令运行就可以了。

![4792fbcb-c7c2-48c5-9e54-68f4ee872c41](./images/4792fbcb-c7c2-48c5-9e54-68f4ee872c41.png)

![04e44aa7-90df-4d45-8975-57b01b3c2bb9](./images/04e44aa7-90df-4d45-8975-57b01b3c2bb9.png)

和docker类型，本地已经有，就会用本地的，本地没有就会自动拉取，然后运行。





## 二、LobeChat相关的配置

### 1.下载和安装

 官网： https://lobehub.com/zh       可以在线使用，自行探索

本地配置： https://lobehub.com/zh/docs/usage/features/local-llm  本地在docker中启动一个LobeChat，需要使用docker。

```bash
docker run -d -p 3210:3210 -e OLLAMA_PROXY_URL=http://host.docker.internal:11434/v1 lobehub/lobe-chat
```

直接使用docker运行即可

![122bf36f-a972-45f1-8c2a-23b16cadad56](./images/122bf36f-a972-45f1-8c2a-23b16cadad56.png)

![a6bccc33-6835-421c-ae88-dcdcbeebe585](./images/a6bccc33-6835-421c-ae88-dcdcbeebe585.png)

点击Port(s)的端口号就可以打开LobeChat的页面了。

![c76b4162-63db-4811-a754-904ea3d14e7f](./images/c76b4162-63db-4811-a754-904ea3d14e7f.png)

在设置里，进行对应模型的添加即可。有一些模型是没有的，没有就是LobeChat没有接入。

![d73e0666-f9a1-48fe-a09f-5314ddccf124](./images/d73e0666-f9a1-48fe-a09f-5314ddccf124.png)

选择下载好的大模型即可，然后就可以聊天了。

![b7144597-9b0b-467b-9b52-8ed42da23af9](./images/b7144597-9b0b-467b-9b52-8ed42da23af9.png)

![ffa178d6-0edc-402b-9acf-9af8114130ef](./images/ffa178d6-0edc-402b-9acf-9af8114130ef.png)
