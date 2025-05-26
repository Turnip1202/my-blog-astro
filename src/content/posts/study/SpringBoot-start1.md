---

title: 深入详解 Spring Boot 中 `spring.mvc.static-path-pattern` 与 `spring.web.resources.static-locations`

published: 2025-05-26 21:13:06

description: 在 Spring Boot 应用中，静态资源（如 HTML、CSS、JS、图片等）的访问是常见的需求。Spring Boot 提供了两个重要的配置项来控制静态资源的路径匹配和存储位置：

- `spring.mvc.static-path-pattern`
- `spring.web.resources.static-locations`

本文将详细解析这两个配置的作用、区别以及如何结合使用。

tags: [Spring, Java]

category: backend

draft: false

---

# 深入详解 Spring Boot 中 `spring.mvc.static-path-pattern` 与 `spring.web.resources.static-locations`

在 Spring Boot 应用中，静态资源（如 HTML、CSS、JS、图片等）的访问是常见的需求。Spring Boot 提供了两个重要的配置项来控制静态资源的路径匹配和存储位置：

- `spring.mvc.static-path-pattern`
- `spring.web.resources.static-locations`

本文将详细解析这两个配置的作用、区别以及如何结合使用。

---

## 一、`spring.mvc.static-path-pattern`

### ✅ 配置说明

```yaml
spring:
  mvc:
    static-path-pattern: /**
```

该配置用于指定**URL 请求路径的匹配规则**，即哪些请求会被当作对静态资源的访问并自动映射到对应的资源目录。

### 📌 默认值

默认情况下，Spring Boot 使用 `/static/**` 或 `/public/**` 等路径作为静态资源访问路径模式。也就是说，默认只有访问类似 `/static/test1.html` 的 URL 才会触发静态资源加载逻辑。

### 🔧 自定义值

当你设置为：

```yaml
spring.mvc.static-path-pattern: /**
```

意味着所有请求都会先尝试去静态资源目录下查找是否存在对应的文件。例如：

- `http://localhost:8080/test1.html` → 尝试从静态资源目录下加载 test1.html
- `http://localhost:8080/css/style.css` → 尝试加载 `/static/css/style.css`

> ⚠️ 注意：这个配置只影响 URL 匹配路径，并不决定资源实际存储的位置。

---

## 二、`spring.web.resources.static-locations`

### ✅ 配置说明

```yaml
spring:
  web:
    resources:
      static-locations: classpath:/static
```

该配置用于指定**静态资源在项目中的物理存储位置**。Spring Boot 会在这些位置查找并返回静态资源。

### 📌 默认值

Spring Boot 默认会扫描以下路径下的静态资源：

```
classpath:/static/
classpath:/public/
classpath:/resources/
classpath:/META-INF/resources/
```

### 🔧 自定义值

当你自定义为：

```yaml
spring.web.resources.static-locations: classpath:/static
```

意味着你告诉 Spring Boot 只从 `classpath:/static/` 这个目录下查找静态资源，其他默认路径将被忽略。

> ⚠️ 注意：如果设置了 `static-locations`，则必须确保你的资源确实放在这个路径下，否则会出现 404 错误。

---

## 三、两者配合使用示例

假设你有如下配置：

```yaml
spring:
  mvc:
    static-path-pattern: /**
  web:
    resources:
      static-locations: classpath:/static
```

此时：

| 请求 URL                             | 映射到的资源路径                       |
| ---------------------------------- | ------------------------------ |
| http://localhost:8080/test1.html   | classpath:/static/test1.html   |
| http://localhost:8080/css/main.css | classpath:/static/css/main.css |

这相当于实现了“所有请求都尝试从 `/static` 下找对应资源”的效果。

---

## 四、常见问题与注意事项

### 1. **继承 `WebMvcConfigurationSupport` 后失效**

如果你手动创建了一个配置类继承 `WebMvcConfigurationSupport` 并重写了 `addResourceHandlers()` 方法，那么：

- `spring.web.resources.static-locations` 和 `spring.mvc.static-path-pattern` 的配置将不再生效。
- 你需要手动添加资源处理器或调用 `super.addResourceHandlers(registry)` 来保留默认行为。

### 2. **避免路径结尾斜杠问题**

`static-path-pattern` 建议使用 `/**` 而不是 /或 `/*`，以支持多级路径匹配。

### 3. **构建后检查资源是否正确打包**

确保你的资源最终被打包到 `target/classes/static/` 或 jar 包内的 `/static/` 目录下。

---

## 五、完整配置示例（application.yml）

```yaml
server:
  port: 8080

spring:
  mvc:
    static-path-pattern: /**
  web:
    resources:
      static-locations: classpath:/static

  application:
    name: tdemo-app
```

---

## 六、总结对比表

| 配置项                                     | 功能            | 默认值            | 是否可自定义 |
| --------------------------------------- | ------------- | -------------- | ------ |
| `spring.mvc.static-path-pattern`        | 控制 URL 路径匹配规则 | `/static/**` 等 | ✅ 可自定义 |
| `spring.web.resources.static-locations` | 控制静态资源存放位置    | 多个默认路径         | ✅ 可自定义 |

---

## 七、结语

理解 `spring.mvc.static-path-pattern` 与 `spring.web.resources.static-locations` 的作用及区别，有助于我们更灵活地控制 Spring Boot 中静态资源的访问方式。合理使用这两个配置，可以让你的应用更加清晰、可控，尤其在前后端分离或需要定制化资源路径时尤为重要。

> 💡 **小贴士**：若你在项目中使用了自定义的 `WebMvcConfig` 类，请务必注意其对默认静态资源配置的影响。
