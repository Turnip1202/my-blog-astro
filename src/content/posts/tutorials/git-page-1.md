---
title: GitHub Pages 部署实战：从源码分支到生产环境的无缝转换

published: 2025-02-05 03:28:05

description: 详细解析 GitHub Pages 的现代部署流程，包括分支策略、Actions 配置和常见问题解决

tags: [GitHub, CI/CD, GitHub Actions, GitHub Pages]

category: DevOps

draft: false
---

# GitHub Pages 部署实战：从源码分支到生产环境的无缝转换

## 引言

在现代前端开发中，GitHub Pages 已经成为了托管静态网站的重要选择。本文将详细介绍如何使用 GitHub Actions 实现从源码分支（source）到部署分支（master）的自动化部署流程，并解决过程中遇到的常见问题。

## 项目结构设计

在本项目中，我们采用双分支策略：

- `source` 分支：存放源代码
- `master` 分支：存放构建后的静态文件，用于 GitHub Pages 部署

这种结构可以清晰地分离源码和生产环境的文件，使项目管理更加规范。

## GitHub Actions 工作流配置

### 基本配置

```yml
name: Build and Deploy

on: push: branches: - source

permissions: contents: read pages: write id-token: write

concurrency: group: "pages" cancel-in-progress: true
```

### 构建作业

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    environment: github-pages

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 9.14.4

      - name: Install Dependencies
        run: pnpm install

      - name: Build
        run: pnpm build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'
```

### 部署作业

```yaml
  deploy:
    needs: build
    runs-on: ubuntu-latest

    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}

    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## 关键配置点解析

1. **权限配置**
   
   - `contents: read`：允许读取仓库内容
   - `pages: write`：允许写入 GitHub Pages
   - `id-token: write`：允许处理身份令牌

2. **环境保护**
   
   - 使用 `environment: github-pages` 确保部署到正确的环境
   - 设置并发控制避免同时部署冲突

3. **构建优化**
   
   - 使用 pnpm 作为包管理器提升安装速度
   - 分离构建和部署步骤提高工作流清晰度

## 常见问题及解决方案

### 1. 环境保护规则问题

如果遇到 "Branch is not allowed to deploy" 错误，需要：

- 访问仓库的 Settings > Environments
- 配置 `github-pages` 环境的部署分支规则
- 添加 source 分支到允许部署的分支列表

### 2. 权限设置

确保在仓库设置中：

- Actions 权限已开启
- Workflow 权限设置为 "Read and write"

### 3. Pages 设置

在仓库的 Settings > Pages 中：

- 将构建和部署源设置为 "GitHub Actions"
- 确保环境变量和 secrets 配置正确

## 最佳实践建议

1. **版本控制**
   
   - 源码始终提交到 source 分支
   - 避免直接修改 master 分支的内容

2. **工作流优化**
   
   - 使用缓存加速依赖安装
   - 设置合理的并发控制策略

3. **监控和维护**
   
   - 定期检查部署日志
   - 及时更新 Actions 版本

## 结论

通过合理配置 GitHub Actions 和环境设置，我们可以实现一个稳定、自动化的静态网站部署流程。这不仅提高了开发效率，也确保了部署的可靠性和安全性。

## 参考链接

- [GitHub Pages 官方文档](https://docs.github.com/en/pages)

- [GitHub Actions 官方文档](https://docs.github.com/en/actions)
