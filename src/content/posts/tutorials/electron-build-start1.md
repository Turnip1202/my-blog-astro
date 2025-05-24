# Windows11 关于electron-builder打包

关于electron的打包，集中一下几个压缩包的下载

* electron-v30.5.1-win32-x64.zip 

* nsis-3.0.4.1.7z

* nsis-resources-3.4.1.7z

* winCodeSign-2.6.0.7z
  
  

---

可以根据报错提示进行下载，如果无法打开下载连接，就需要魔法上网了；总之，需要下载这几个压缩包。
---

然后就是放到对应的文件夹里

* electron-v30.5.1-win32-x64.zip 放到 C:\Users\kang_pc\AppData\Local\electron\Cache![180cb3dd-34e0-49f3-8e49-d271bbe9f93a](./images/180cb3dd-34e0-49f3-8e49-d271bbe9f93a.png)

* nsis-3.0.4.1.7z 解压到 C:\Users\kang_pc\AppData\Local\electron-builder\Cache\nsis中![824a1941-841d-4f48-b868-ac4312e51196](./images/824a1941-841d-4f48-b868-ac4312e51196.png)

* nsis-resources-3.4.1.7z 解压到 C:\Users\kang_pc\AppData\Local\electron-builder\Cache\nsis中![a601419f-6b0c-4e4a-a1dc-a2ea7b7ce8aa](./images/a601419f-6b0c-4e4a-a1dc-a2ea7b7ce8aa.png)

* winCodeSign-2.6.0.7z 解压到 C:\Users\kang_pc\AppData\Local\electron-builder\Cache\winCodeSign中![fc753ea0-3844-4f44-aadd-f1a5f139aa3e](./images/fc753ea0-3844-4f44-aadd-f1a5f139aa3e.png)

版本：

    "electron": "^30.0.1",

    "electron-builder": "^24.13.3"



electron-v30.5.1-win32-x64.zip的下载可以在项目根目录创建.npmrc文件,配置镜像即可，其他压缩包应该也能配置镜像，自行尝试。

```bash
registry=https://registry.npmmirror.com/
electron_mirror=https://npmmirror.com/mirrors/electron/
```
