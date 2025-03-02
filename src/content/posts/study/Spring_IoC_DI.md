---

title: 手把手教你理解Spring的核心：IoC与DI的底层秘密​

published: 2025-03-02 12:10:53

description: 手把手教你理解Spring的核心：IoC与DI的底层秘密​

tags: [Blogging]

category: backend

draft: false

---

---

**手把手教你理解Spring的核心：IoC与DI的底层秘密**  
*—— 一个普通程序员的学习笔记*

---

### 从"自力更生"到"甩手掌柜"  
记得刚学Java时，我总是这样创建对象：  
```java
UserDao userDao = new UserDaoImpl();
UserService service = new UserServiceImpl(userDao);
```
直到有天看到同事的代码：  
```java
@Autowired
private UserService userService;
```
我惊了——这对象从哪来的？同事神秘一笑："这是Spring的魔法"。为了搞懂这个"魔法"，我决定撕开IoC和DI的神秘面纱。

---

### 一、理解控制反转（IoC）  
#### 1.1 传统开发之痛  
假设我们要做一碗牛肉面：  
```java
// 传统方式
面粉 面粉袋 = new 面粉();
水 自来水 = new 水();
面团 = 面粉袋.揉面(自来水);
牛肉 = new 牛肉("澳洲进口");
面汤 = new 高汤(牛肉);
牛肉面 成品 = new 牛肉面(面团, 面汤);
```
每个环节都要自己动手，耦合度太高。如果改用日本面粉，得改十几处代码！

#### 1.2 厨房革命（IoC容器）  
想象有个智能厨房：  
```java
// 现代方式
容器 = new 智能厨房("配置清单");
牛肉面 成品 = container.获取(牛肉面.class);
```
我们只需：  
1. 告诉厨房需要什么（配置）  
2. 喊一声"上菜"（getBean）  
3. 厨房自动调配原料（依赖管理）  

**这就是控制反转：把对象控制权交给容器**

---

### 二、依赖注入（DI）的三种姿势  
#### 2.1 构造器注入 - 最正经的方式  
```java
public class CatHotel {
    private final CatMapper mapper;
    
    // 明明白白告诉你我需要什么
    public CatHotel(CatMapper mapper) {
        this.mapper = mapper;
    }
}
```

#### 2.2 Setter注入 - 灵活但容易滥用  
```java
public class DogPark {
    private DogMapper mapper;
    
    // 可以随时换mapper
    public void setMapper(DogMapper mapper) {
        this.mapper = mapper;
    }
}
```

#### 3.3 字段注入 - 最方便也最危险  
```java
public class BirdHouse {
    @Autowired  // 简洁但隐藏了依赖
    private BirdMapper mapper;
}
```
*（实际开发建议用构造器注入！）*

---

### 三、手搓一个迷你Spring容器  
#### 3.1 准备工作  
先定义两个注解：  
```java
// 组件标记
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface MyComponent {}

// 依赖注入
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface MyAutowired {}
```

#### 3.2 容器核心代码（精简版）  
```java
public class MyContainer {
    private final Map<String, Object> beans = new HashMap<>();

    public MyContainer(String basePackage) throws Exception {
        // 扫描类路径
        String path = basePackage.replace('.', '/');
        Enumeration<URL> resources = Thread.currentThread()
            .getContextClassLoader().getResources(path);
        
        while (resources.hasMoreElements()) {
            File dir = new File(resources.nextElement().getFile());
            for (File file : dir.listFiles()) {
                String className = basePackage + "." 
                    + file.getName().replace(".class", "");
                Class<?> clazz = Class.forName(className);
                
                // 注册带注解的类
                if (clazz.isAnnotationPresent(MyComponent.class)) {
                    Object instance = clazz.getDeclaredConstructor().newInstance();
                    beans.put(clazz.getName(), instance);
                }
            }
        }
        
        // 依赖注入
        for (Object bean : beans.values()) {
            injectDependencies(bean);
        }
    }

    private void injectDependencies(Object bean) throws Exception {
        for (Field field : bean.getClass().getDeclaredFields()) {
            if (field.isAnnotationPresent(MyAutowired.class)) {
                field.setAccessible(true);
                Object dependency = beans.get(field.getType().getName());
                field.set(bean, dependency);
            }
        }
    }

    public <T> T getBean(Class<T> type) {
        return (T) beans.get(type.getName());
    }
}
```

#### 3.3 测试我们的容器  
```java
@MyComponent
class CatService {
    @MyAutowired
    private CatRepository repository;
    
    public void meow() {
        repository.saveCat();
        System.out.println("喵喵入库成功！");
    }
}

@MyComponent
class CatRepository {
    public void saveCat() {
        System.out.println("保存到数据库...");
    }
}

public class Test {
    public static void main(String[] args) throws Exception {
        MyContainer container = new MyContainer("com.example");
        CatService service = container.getBean(CatService.class);
        service.meow(); 
        // 输出: 
        // 保存到数据库...
        // 喵喵入库成功！
    }
}
```

---

### 四、真实Spring比你想象的复杂在哪  
虽然我们的容器能跑了，但和真正的Spring相比：  

1. **依赖查找**：我们只支持按类型注入，Spring还支持：  
   - 按名称注入 (`@Qualifier`)  
   - 条件注入 (`@Conditional`)  
   - 多实例选择 (`@Primary`)

2. **生命周期管理**：  
   ```java
   // 初始化回调
   @PostConstruct
   public void init() { /* 初始化逻辑 */ }
   
   // 销毁回调
   @PreDestroy 
   public void cleanup() { /* 释放资源 */ }
   ```

3. **解决循环依赖**：  
   Spring用三级缓存解决这个世纪难题：  
   - 一级缓存：成品Bean  
   - 二级缓存：半成品Bean  
   - 三级缓存：Bean工厂  

4. **AOP代理**：  
   通过动态代理实现切面编程，我们的简单容器直接new对象，无法实现类似功能

---

### 五、为什么要理解底层原理  
上周排查一个启动报错时，我遇到这样的情况：  
```java
@Component
public class A {
    @Autowired
    private B b;
}

@Component 
public class B {
    @Autowired
    private A a;
}
```
如果使用我们自己写的容器，直接StackOverflow！而Spring却能优雅处理，这让我意识到：**只有理解底层，才能在遇到诡异问题时快速定位**

---

### 六、学习建议  
1. **动手实践**：尝试给我们的迷你容器添加新功能，比如：  
   - 支持构造器注入  
   - 实现@PostConstruct初始化  
   - 添加简单的Bean作用域控制

2. **调试Spring源码**：  
   在IDEA中：  
   ```java
   // 断点打在AbstractApplicationContext.refresh()
   public static void main(String[] args) {
       ApplicationContext ctx = new AnnotationConfigApplicationContext(AppConfig.class);
       // ...
   }
   ```

3. **参考书籍推荐**：  
   - 《Spring源码深度解析》  
   - 《Spring揭秘》  
   - 官方文档的Core章节

---

### 最后的话  
记得第一次让手写容器跑通时，那种兴奋感就像小时候成功组装了四驱车。虽然我们的实现非常简陋，但通过这个练习，终于理解了：  

**Spring不是什么魔法，而是精妙的设计模式组合**  
（工厂模式+反射+策略模式+...）

希望这篇笔记对你有帮助，如果有错误欢迎指正，我们一起在编程路上成长！下次准备写《徒手实现AOP是什么体验》，敬请期待~ 🚀

---  
*原创文章，转载请注明出处*  
*作者：Turnip*  