---

title: Node.js 操作 Redis 从入门到精通：实战指南

published: 2025-05-20 23:04:19

description: Redis 作为高性能内存数据库，已成为现代应用架构中不可或缺的组件。结合 Node.js 的异步特性，开发者可以轻松实现缓存加速、实时通信等场景。本文将通过 代码实战+原理剖析，带你系统掌握 Redis 在 Node.js 中的核心用法与进阶技巧。


tags: [Node.js, Blogging, Redis]

category: backend

draft: false

---
# Node.js 操作 Redis 从入门到精通：实战指南

## 前言

Redis 作为高性能的内存数据库，已经成为现代 Web 开发和分布式系统中不可或缺的组件。它不仅能做缓存，还能做消息队列、排行榜、分布式锁等。本文将带你一步步用 Node.js 玩转 Redis，从基础用法到项目实战，助你成为 Redis + Node.js 的高手！

---

## 目录

1. Redis 简介与安装  
2. Node.js 连接 Redis 基础  
3. 常用操作实战（增删查改）  
4. 进阶功能：发布订阅、事务、管道、Lua 脚本  
5. 项目实战：实现缓存、分布式锁和队列  
6. 性能优化与最佳实践  
7. 常见错误及调试技巧  
8. 结语

---

## 1. Redis 简介与安装

### 1.1 什么是 Redis

- 开源的内存数据结构存储系统
- 支持字符串、哈希、列表、集合、有序集合等多种数据结构
- 支持持久化、主从复制、分布式、高可用

### 1.2 安装 Redis

- [官方下载](https://redis.io/download)
- Mac: `brew install redis`
- Docker: `docker run --name myredis -p 6379:6379 -d redis`

---

## 2. Node.js 连接 Redis 基础

### 2.1 选择客户端

主流客户端有 [ioredis](https://github.com/luin/ioredis) 和 [node-redis](https://github.com/redis/node-redis)。推荐 ioredis，功能更丰富且支持集群。

### 2.2 安装依赖

```bash
npm install ioredis
```

### 2.3 快速连接

```js
const Redis = require('ioredis');
const redis = new Redis(); // 默认 127.0.0.1:6379

redis.set('foo', 'bar');
redis.get('foo').then(console.log); // 输出 'bar'
```

---

## 3. 常用操作实战（增删查改）

### 3.1 字符串

```js
await redis.set('key', 'value');
const val = await redis.get('key');
await redis.del('key');
```

### 3.2 哈希

```js
await redis.hset('user:1', 'name', 'Tom');
const name = await redis.hget('user:1', 'name');
```

### 3.3 列表

```js
await redis.lpush('list', 'a');
const item = await redis.rpop('list');
```

### 3.4 集合和有序集合

```js
await redis.sadd('tags', 'nodejs', 'redis');
const tags = await redis.smembers('tags');
await redis.zadd('scores', 100, 'Alice');
```

---

## 4. 进阶功能

### 4.1 发布与订阅（Pub/Sub）

```js
const pub = new Redis();
const sub = new Redis();

sub.subscribe('news');
sub.on('message', (channel, message) => {
  console.log(`收到 ${channel} 的消息: ${message}`);
});
pub.publish('news', 'Node.js 与 Redis 实战');
```

### 4.2 事务（Multi/Exec）

```js
const multi = redis.multi();
multi.set('a', 1);
multi.incr('a');
const results = await multi.exec();
```

### 4.3 管道（Pipeline）

```js
const pipeline = redis.pipeline();
pipeline.set('foo', 'bar').get('foo');
const res = await pipeline.exec();
```

### 4.4 Lua 脚本

```js
const script = "return redis.call('incr', KEYS[1])";
const res = await redis.eval(script, 1, 'mykey');
```

---

## 5. 项目实战

### 5.1 实现缓存（防击穿/穿透）

```js
async function getUser(id) {
  const cacheKey = `user:${id}`;
  let data = await redis.get(cacheKey);
  if (!data) {
    data = await db.getUserFromDB(id);
    await redis.setex(cacheKey, 3600, JSON.stringify(data));
  }
  return JSON.parse(data);
}
```

### 5.2 分布式锁

```js
const lockKey = 'lock:resource';
const isLocked = await redis.set(lockKey, 'token', 'NX', 'EX', 10); // NX:不存在才设置, EX:过期
if (isLocked) {
  // 执行业务
  await redis.del(lockKey);
}
```

### 5.3 实现队列

```js
// 生产者
await redis.lpush('queue', JSON.stringify(task));
// 消费者
const task = await redis.rpop('queue');
```

---

## 6. 性能优化与最佳实践

- 合理设置过期时间，避免缓存雪崩
- 使用管道/批量操作减少网络请求
- 监控慢查询
- 利用 Redis 集群提升可用性
- 按需选择持久化方案（AOF/RDB）

---

## 7. 常见错误及调试技巧

- 连接超时/拒绝：检查 Redis 服务是否启动、端口是否正确
- 数据类型错误：注意命令和键类型的对应
- 使用 `MONITOR` 命令观察实时请求
- 开启日志和慢查询日志便于排查

---

## 8. 结语

Node.js + Redis 是开发高性能 Web 应用的黄金组合。掌握本文内容后，你可以轻松应对缓存、分布式锁、消息队列等场景，写出健壮高效的系统。更多高级玩法，欢迎查阅 [Redis 官方文档](https://redis.io/docs/) 和 ioredis 文档！

---