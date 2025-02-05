---

title: 深入理解 MyBatis 一、二级缓存：提升数据库访问性能的利器

published: 2025-02-04 00:14:00

description: 详细解析-mybatis-缓存

tags: [Markdown, Blogging, mybatis]

category: mybatis

draft: false

---


# 深入理解 MyBatis 一、二级缓存：提升数据库访问性能的利器

在使用 MyBatis 进行数据库开发时，缓存是一个非常重要的特性，它能够显著提高应用程序的性能。MyBatis 提供了两级缓存机制：一级缓存和二级缓存。今天，就让我们一起深入了解这两级缓存的工作原理、使用方法以及适用场景。

## 一级缓存：SqlSession 级别的缓存

### 什么是一级缓存
一级缓存也被称为本地缓存，它是基于 `SqlSession` 级别的缓存。简单来说，在同一个 `SqlSession` 中，如果执行相同的 SQL 查询，MyBatis 会优先从缓存中查找结果，而不是再次访问数据库。这大大减少了数据库的查询次数，提高了查询效率。

### 一级缓存的工作原理
当我们使用 `SqlSession` 执行一个查询操作时，MyBatis 会将查询语句和查询参数组合成一个唯一的 `key`，并将查询结果作为 `value`，存放在当前 `SqlSession` 的缓存中。后续在同一个 `SqlSession` 中，如果再次执行相同的查询（即 `key` 相同），MyBatis 会直接从缓存中获取结果，而不会再次向数据库发送查询请求。

### 示例代码
下面是一个简单的 Java 代码示例，演示了一级缓存的使用：
```java
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

import java.io.InputStream;

public class FirstLevelCacheExample {
    public static void main(String[] args) throws Exception {
        // 加载 MyBatis 配置文件
        String resource = "mybatis-config.xml";
        InputStream inputStream = Resources.getResourceAsStream(resource);
        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);

        // 打开一个 SqlSession
        try (SqlSession session = sqlSessionFactory.openSession()) {
            // 第一次查询
            Object result1 = session.selectOne("com.example.mapper.YourMapper.selectById", 1);
            System.out.println("第一次查询结果: " + result1);

            // 第二次查询
            Object result2 = session.selectOne("com.example.mapper.YourMapper.selectById", 1);
            System.out.println("第二次查询结果: " + result2);

            // 这里第二次查询会直接从一级缓存中获取结果，不会再次访问数据库
        }
    }
}
```
在这个示例中，我们使用同一个 `SqlSession` 执行了两次相同的查询。第二次查询时，MyBatis 会直接从一级缓存中获取结果，而不会再次向数据库发送查询请求。

### 一级缓存的失效情况
一级缓存虽然方便，但也有一些情况会导致缓存失效：
- **SqlSession 关闭**：当 `SqlSession` 关闭后，该 `SqlSession` 的一级缓存也会被清空。这是因为 `SqlSession` 关闭后，它所占用的资源会被释放，缓存也不例外。
- **执行增删改操作**：在同一个 `SqlSession` 中执行增删改操作后，一级缓存会被清空。这是因为增删改操作可能会改变数据库中的数据，为了保证数据的一致性，需要清空缓存。

## 二级缓存：Mapper 级别的缓存

### 什么是二级缓存
二级缓存是基于 Mapper 级别的缓存，多个 `SqlSession` 可以共享同一个 Mapper 的二级缓存。也就是说，不同的 `SqlSession` 执行相同 Mapper 下的相同查询时，可以从二级缓存中获取结果，进一步提高了缓存的利用率。

### 二级缓存的工作原理
二级缓存的工作原理与一级缓存类似，只不过它的作用范围更广。当一个 `SqlSession` 执行查询操作后，MyBatis 会将查询结果存放在对应的 Mapper 的二级缓存中。后续其他 `SqlSession` 执行相同 Mapper 下的相同查询时，会先从二级缓存中查找，如果缓存中有数据，就直接返回。

### 开启二级缓存的步骤
要使用二级缓存，需要进行以下几个步骤：
1. **在 mybatis-config.xml 中开启二级缓存**
```xml
<settings>
    <setting name="cacheEnabled" value="true"/>
</settings>
```
这一步是全局开启二级缓存的开关，只有将 `cacheEnabled` 设置为 `true`，二级缓存才会生效。

2. **在 Mapper XML 文件中开启二级缓存**
```xml
<mapper namespace="com.example.mapper.YourMapper">
    <!-- 开启二级缓存 -->
    <cache/>

    <select id="selectById" parameterType="int" resultType="com.example.entity.YourEntity">
        SELECT * FROM your_table WHERE id = #{id}
    </select>
</mapper>
```
或者在 Mapper 接口上使用 `@CacheNamespace` 注解开启：
```java
import org.apache.ibatis.annotations.CacheNamespace;
import org.apache.ibatis.annotations.Select;

@CacheNamespace
public interface YourMapper {
    @Select("SELECT * FROM your_table WHERE id = #{id}")
    YourEntity selectById(int id);
}
```

### 示例代码
下面是一个演示二级缓存使用的 Java 代码示例：
```java
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

import java.io.InputStream;

public class SecondLevelCacheExample {
    public static void main(String[] args) throws Exception {
        // 加载 MyBatis 配置文件
        String resource = "mybatis-config.xml";
        InputStream inputStream = Resources.getResourceAsStream(resource);
        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);

        // 第一个 SqlSession
        try (SqlSession session1 = sqlSessionFactory.openSession()) {
            Object result1 = session1.selectOne("com.example.mapper.YourMapper.selectById", 1);
            System.out.println("第一个 SqlSession 查询结果: " + result1);
        }

        // 第二个 SqlSession
        try (SqlSession session2 = sqlSessionFactory.openSession()) {
            Object result2 = session2.selectOne("com.example.mapper.YourMapper.selectById", 1);
            System.out.println("第二个 SqlSession 查询结果: " + result2);

            // 这里第二个 SqlSession 会从二级缓存中获取结果，不会再次访问数据库
        }
    }
}
```
在这个示例中，我们使用了两个不同的 `SqlSession` 执行相同的查询。由于开启了二级缓存，第二个 `SqlSession` 会直接从二级缓存中获取结果，而不会再次向数据库发送查询请求。

### 二级缓存的失效情况
与一级缓存类似，二级缓存也有一些情况会导致缓存失效：
- **执行增删改操作**：在任何一个 `SqlSession` 中执行增删改操作后，该 Mapper 的二级缓存会被清空。这是为了保证数据的一致性，避免缓存中的数据与数据库中的数据不一致。

## 总结
MyBatis 的一级缓存和二级缓存是非常实用的性能优化工具。一级缓存适用于在同一个 `SqlSession` 中多次执行相同查询的场景，而二级缓存则适用于多个 `SqlSession` 共享缓存的场景。在使用缓存时，需要注意缓存的失效情况，以保证数据的一致性。同时，也需要根据具体的业务场景合理使用缓存，避免过度使用缓存导致数据不一致或内存占用过高的问题。希望通过本文的介绍，你对 MyBatis 的一、二级缓存有了更深入的理解。