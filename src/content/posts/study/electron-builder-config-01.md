---

title: Electron的打包相关配置

published: 2025-02-26 16:38:28

description: 一些关键配置

image: "./image/demo-avatar.png"

tags: [Electron, JavaScript, Node.js]

category: frontend

draft: false

---


# Electron的打包配置
* 打包总是会出现electron-v33.0.1-win32-x64.zip下载失败
* 这类问题主要是网络问题，配置镜像即可。

其他失败的情况，基本都可以搜索到
需要配置.npmrc
### 将.npmrc文件放在项目根目录
```bash

registry=https://registry.npmmirror.com
package-manager-strict=false

electron_mirror=https://npmmirror.com/mirrors/electron/
# 阿里云采用双份拷贝策略,即x.x版本的electron存储时既有 vx.x也有x.x
electron_custom_dir={{ version }}
electron_builder_binaries_mirror=https://npmmirror.com/mirrors/electron-builder-binaries/
sqlite3_binary_host_mirror=https://npmmirror.com/mirrors/sqlite3/
# sass_binary_site=https://npmmirror.com/mirrors/node-sass/
chromedriver_cdnurl=https://npmmirror.com/mirrors/chromedriver/
operadriver_cdnurl=https://npmmirror.com/mirrors/operadriver/
fse_binary_host_mirror=https://npmmirror.com/mirrors/fsevents/

```