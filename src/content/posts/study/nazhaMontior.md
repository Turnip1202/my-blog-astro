---

title: 哪吒监控 V1-快速配置（本地虚拟机为例）

published: 2025-04-04 15:54:14

description: 开源、轻量、易用的服务器监控与运维工具

tags: [Kubernetes, Docker]

category: backend

draft: false

---

# 哪吒监控 V1-快速配置（本地虚拟机为例）

开源、轻量、易用的服务器监控与运维工具

### 系统要求：

* linux

## 安装

国际

    curl -L https://raw.githubusercontent.com/nezhahq/scripts/refs/heads/main/install.sh -o nezha.sh && chmod +x nezha.sh && sudo ./nezha.sh

中国大陆

    curl -L https://gitee.com/naibahq/scripts/raw/main/install.sh -o nezha.sh && chmod +x nezha.sh && sudo CN=true ./nezha.sh

### 步骤

* 1.选择Docker安装![b3226fb2f4704bf0991fc49a9f2a25e7](./images/b3226fb2-f470-4bf0-991f-c49a9f2a25e7.png)
  
* 2.面板安装，注意：域名vps.turnip.ren，如果是本地虚拟机的，这里是没有用的![8be26cc576e840d5b5d2a66130a3b487](./images/8be26cc5-76e8-40d5-b5d2-a66130a3b487.png)
  
* 3.再次打开一个会话，安装Agent端。注意：Agent端就是被监控端，如果是本地虚拟机，需要填写ip+端口![e80581e430e84915bb6316484bf39a42](./images/e80581e4-30e8-4915-bb63-16484bf39a42.png)