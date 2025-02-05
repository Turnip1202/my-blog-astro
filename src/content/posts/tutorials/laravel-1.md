---

title: Nginx与Laravel协同-构建高效Web服务

published: 2025-02-05 00:14:00

description: Nginx与Laravel协同：构建高效Web服务

tags: [Markdown, Blogging, mybatis]

category: mybatis

draft: false

---


# Nginx与Laravel协同：构建高效Web服务
在Web开发领域，Nginx与Laravel协同工作能显著提升应用性能。其交互流程如下：用户在浏览器发起对Laravel应用的请求，Nginx接收后，静态资源请求直接返回文件；动态请求则转发给PHP - FPM。PHP - FPM启动PHP脚本，运行Laravel框架处理业务，完成后将响应返回Nginx，Nginx再把响应发回浏览器展示给用户。接下来，让我们深入了解如何在Windows系统中配置它们协同工作。

## 一、前期准备
### （一）安装软件
1. **安装Nginx**：从Nginx官网下载Windows版安装包，解压到指定目录，如`C:\nginx`。
2. **安装PHP**：在PHP官网下载Windows安装包，解压后配置环境变量，将`C:\php`和`C:\php\ext`添加到系统Path变量。
3. **安装MySQL**：利用MySQL Installer进行安装，设置好root密码等关键信息。
4. **安装Composer**：下载Composer安装程序，按提示完成安装，自动配置环境变量。

### （二）获取Laravel项目
打开命令提示符，切换到项目存放目录，通过Composer创建项目：
```bash
composer create-project --prefer-dist laravel/laravel your_project_name
```

## 二、配置PHP
1. 进入PHP安装目录，复制`php.ini-development`并重命名为`php.ini`。
2. 编辑`php.ini`，开启必要扩展，如`mysqli`、`pdo_mysql`等；设置文件上传大小限制，如`upload_max_filesize = 20M`、`post_max_size = 20M`。

## 三、配置Nginx
1. 打开Nginx安装目录下`conf`文件夹中的`nginx.conf`文件。
2. 在`http`块添加`server`配置：
```nginx
server {
    listen       80;
    server_name  localhost;
    root         C:/your_project_name/public;

    index index.php index.html index.htm;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass   127.0.0.1:9000;
        fastcgi_index  index.php;
        fastcgi_param  SCRIPT_FILENAME  $document_root$fastcgi_script_name;
        include        fastcgi_params;
    }
}
```
记得将`C:/your_project_name`替换为实际项目路径。

## 四、配置PHP - FPM
1. 在PHP安装目录找到`php - fpm.conf`（若没有，复制`php - fpm.conf.default`并重命名）。
2. 设置监听地址和端口，如`listen = 127.0.0.1:9000`；根据服务器资源调整`pm.max_children`、`pm.start_servers`等参数。

## 五、启动服务
1. 切换到PHP安装目录的`sbin`文件夹，启动PHP - FPM：
```bash
php -f pm.php start
```
2. 切换到Nginx安装目录，启动Nginx：
```bash
start nginx
```
3. 在浏览器输入`http://localhost`，若配置正确，可看到Laravel项目欢迎页面。

## 六、常见问题与解决
1. **端口冲突**：使用`netstat -ano`查看占用端口的进程，关闭冲突进程或修改Nginx、PHP - FPM监听端口。
2. **权限问题**：确保Nginx和PHP - FPM对Laravel项目文件和目录有足够访问权限。 