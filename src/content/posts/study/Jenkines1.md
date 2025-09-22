---

title: 使用 Jenkins 构建并部署前端项目

published: 2024-08-26 16:38:28

description: 一些关键配置

tags: [Jenkins, Java]

category: backend

draft: false

---


# 使用 Jenkins 构建并部署前端项目到 Nginx 服务器

在现代前端开发中，自动化构建和部署是提高效率、减少人为错误的重要手段。本文将介绍如何使用 Jenkins 搭建一个自动化流程，从拉取代码、构建项目到部署到 Nginx 服务器，实现前端项目的持续集成与部署（CI/CD）。

---

## 🧱 环境准备

- **Jenkins 服务器**：已安装并运行（推荐使用 Docker 启动）
- **目标服务器**：用于部署前端项目的 Nginx 服务器
- **前端项目**：托管在 Git 仓库中（如 GitHub、GitLab）
- **SSH 免密登录**：Jenkins 服务器到目标服务器需配置免密登录

---

## 🧰 安装必要插件

进入 Jenkins 后台，安装以下插件：

- Git
- Pipeline
- NodeJS Plugin

---

## ⚙️ 配置 Node.js 环境

1. 进入 **Manage Jenkins** → **Global Tool Configuration**
2. 找到 **NodeJS**，添加一个版本：
   - Name: `node-23`
   - Version: `NodeJS 23.x`
   - 勾选 **Install automatically**

---

## 🛠 编写 Jenkinsfile

在你的前端项目根目录创建 `Jenkinsfile`，内容如下：

```groovy
pipeline {
    agent any

    tools {
        nodejs 'node-23'
    }

    stages {
        stage('拉取代码') {
            steps {
                git branch: 'source',
                     url: 'https://github.com/Turnip1202/Turnip1202.github.io.git'
            }
        }

        stage('安装依赖') {
            steps {
                sh 'npm install'
            }
        }

        stage('构建项目') {
            steps {
                sh 'npm run build'
            }
        }

        stage('归档构建产物') {
            steps {
                archiveArtifacts artifacts: 'dist/**/*', allowEmptyArchive: true
            }
        }

        stage('部署到 Nginx') {
            steps {
                sh '''
                    rsync -avz --delete dist/ user@your-server-ip:/usr/share/nginx/html/
                    ssh user@your-server-ip "sudo systemctl reload nginx"
                '''
            }
        }
    }

    post {
        success {
            echo '✅ 构建并部署成功！'
        }
        failure {
            echo '❌ 构建或部署失败，请检查日志'
        }
    }
}
```

> **注意**：请将 `your-server-ip` 和 Git 仓库地址替换为你的实际地址。

---

## 🖥 配置目标服务器（Nginx）

### 1. 安装 Nginx（Ubuntu）：

```bash
sudo apt update
sudo apt install nginx -y
```

### 2. 修改 Nginx 配置：

编辑默认站点配置文件：

```bash
sudo nano /etc/nginx/sites-available/default
```

内容如下：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
}
```

### 3. 启动或重启 Nginx：

```bash
sudo systemctl restart nginx
```

---

## 🔐 配置 SSH 免密登录

为了让 Jenkins 能自动部署，需要配置 SSH 免密登录。

1. 在 Jenkins 服务器上生成密钥：

   ```bash
   ssh-keygen -t rsa
   ```

2. 拷贝公钥到目标服务器：

   ```bash
   ssh-copy-id user@your-server-ip
   ```

3. 测试连接：

   ```bash
   ssh user@your-server-ip
   ```

---

## 🚀 运行构建任务

1. 在 Jenkins 中创建一个 **Pipeline** 任务
2. 选择 **Pipeline script from SCM**
3. 配置 Git 仓库地址和分支
4. 点击 **Build Now**，等待构建完成

构建成功后，访问 `http://your-server-ip` 即可看到部署好的前端页面。

---

## ✅ 总结

本文介绍了如何使用 Jenkins 实现前端项目的自动化构建与部署，包括：

- Jenkins 环境配置
- 编写 Pipeline 脚本（Jenkinsfile）
- 部署到 Nginx 服务器
- 配置 SSH 免密登录

这套流程可以轻松扩展为多环境部署、自动测试、邮件通知等高级功能，非常适合中小型前端团队使用。

---