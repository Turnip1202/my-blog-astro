---

title: 若依-微服务版

published: 2025-03-31 15:09:56

description: 一些注意事项

tags: [Java, SpringCloud]

category: backend

draft: false

---

首先是数据库的导入，然后就是要启动nacos，

如果要启动RuoYiSystemApplication模块，就需要配置nacos的数据库

    # db mysql
    spring.datasource.platform=mysql
    db.num=1
    db.url.0=jdbc:mysql://localhost:3308/ry-config?characterEncoding=utf8&allowPublicKeyRetrieval=true&connectTimeout=1000&socketTimeout=3000&autoReconnect=true&useUnicode=true&useSSL=false&serverTimezone=UTC
    db.user=test
    db.password=test

记得把nacos中的配置改成对应的端口和密码