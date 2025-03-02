---

title: 缘起：被日志代码逼疯的夜晚

published: 2025-03-02 12:29:05

description: 徒手实现AOP是什么体验？

tags: [Spring]

category: backend

draft: false

---

---

**徒手实现AOP是什么体验？**  
*—— 一个凌晨三点调试动态代理的程序员自述*  

---

### 缘起：被日志代码逼疯的夜晚  
上周接手一个老旧系统，满屏都是这样的代码：  
```java  
public void transferMoney() {  
    System.out.println("[日志] 开始执行transferMoney");  
    long start = System.currentTimeMillis();  
    
    try {  
        // 业务代码（约200行）  
    } finally {  
        System.out.println("[日志] 耗时："  
            + (System.currentTimeMillis()-start) + "ms");  
    }  
}  
```
当我第20次复制粘贴日志代码时，终于忍无可忍——是时候用AOP消灭这些重复代码了！但当我打开Spring的@Around源码，看到的全是看不懂的CglibAopProxy... 于是决定：自己造个轮子！

---

### 一、AOP的本质是什么？  
#### 1.1 现实世界的类比  
假设你经营一家咖啡馆：  
- **核心业务**：制作咖啡（CoffeeMaker.makeCoffee()）  
- **横切关注点**：  
  - 记录订单（Logger）  
  - 检查权限（Security）  
  - 处理异常（ExceptionHandler）  

传统写法就像让咖啡师同时干这些杂活，而AOP则是雇了三个助手：  
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3e8c8f8f5ab94f8b8e5e4f7d4c3d9e7e~tplv-k3u1fbpfcp-zoom-1.image)  

#### 1.2 技术实现的关键  
要实现这个效果，需要：  
1. **动态代理**：在运行时生成代理对象  
2. **拦截器链**：把多个“助手”串成责任链  
3. **切面定义**：告诉框架在哪里插入逻辑  

---

### 二、手搓AOP的四个阶段  

#### 阶段1：定义元数据（30分钟）  
先造两个注解：  
```java  
// 标记切面类  
@Target(ElementType.TYPE)  
@Retention(RetentionPolicy.RUNTIME)  
public @interface MyAspect {  
    String value() default "";  
}  

// 环绕通知  
@Target(ElementType.METHOD)  
@Retention(RetentionPolicy.RUNTIME)  
public @interface MyAround {  
    String pointcut();  
}  
```

#### 阶段2：动态代理（2小时掉发）  
```java  
public class JdkProxy implements InvocationHandler {  
    private final Object target;  
    private final List<Method> aspects;  

    public static Object wrap(Object target, List<Method> aspects) {  
        return Proxy.newProxyInstance(  
            target.getClass().getClassLoader(),  
            target.getClass().getInterfaces(),  
            new JdkProxy(target, aspects)  
        );  
    }  

    @Override  
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {  
        // 执行前置逻辑  
        for(Method aspect : aspects) {  
            aspect.invoke(null); // 简单示例，假设都是静态方法  
        }  

        // 执行原方法  
        Object result = method.invoke(target, args);  

        // 执行后置逻辑  
        System.out.println("[后置通知] 方法执行完毕");  
        return result;  
    }  
}  
```  
*（后来发现这样写无法传递参数，凌晨1点抓狂中...）*

#### 阶段3：注解扫描（1小时debug）  
```java  
public class AspectScanner {  
    public static Map<String, List<Method>> scan(String basePackage) throws Exception {  
        Map<String, List<Method>> aspectMap = new HashMap<>();  
        
        // 扫描包路径（此处省略类加载过程）  
        for (Class<?> clazz : findClasses(basePackage)) {  
            if (clazz.isAnnotationPresent(MyAspect.class)) {  
                for (Method method : clazz.getDeclaredMethods()) {  
                    if (method.isAnnotationPresent(MyAround.class)) {  
                        String pointcut = method.getAnnotation(MyAround.class).pointcut();  
                        aspectMap.computeIfAbsent(pointcut, k -> new ArrayList<>()).add(method);  
                    }  
                }  
            }  
        }  
        return aspectMap;  
    }  
}  
```

#### 阶段4：织入逻辑（最痛苦的3小时）  
```java  
public class MyAopContext {  
    private final Map<Class<?>, Object> proxyCache = new HashMap<>();  

    public void init(String basePackage) throws Exception {  
        Map<String, List<Method>> aspectMap = AspectScanner.scan(basePackage);  

        // 遍历所有Bean  
        for (Entry<Class<?>, Object> entry : iocContainer.getBeans().entrySet()) {  
            Class<?> clazz = entry.getKey();  
            Object target = entry.getValue();  

            // 查找匹配的切面  
            List<Method> aspects = new ArrayList<>();  
            for (String pointcut : aspectMap.keySet()) {  
                if (clazz.getName().matches(pointcutToRegex(pointcut))) {  
                    aspects.addAll(aspectMap.get(pointcut));  
                }  
            }  

            if (!aspects.isEmpty()) {  
                proxyCache.put(clazz, JdkProxy.wrap(target, aspects));  
            }  
        }  
    }  

    // 把类似 "com.example.*Service" 转成正则  
    private String pointcutToRegex(String pointcut) {  
        return pointcut.replace(".", "\\.").replace("*", ".*");  
    }  
}  
```  

---

### 三、测试我们的AOP框架  
#### 3.1 定义业务组件  
```java  
public interface UserService {  
    void saveUser();  
}  

public class UserServiceImpl implements UserService {  
    public void saveUser() {  
        System.out.println("保存用户数据...");  
    }  
}  
```

#### 3.2 编写切面  
```java  
@MyAspect  
public class LogAspect {  

    @MyAround(pointcut = "com.example.*Service")  
    public static void around(ProceedingJoinPoint jp) {  
        System.out.println("[日志] 开始执行：" + jp.getMethod().getName());  
        long start = System.currentTimeMillis();  
        
        try {  
            jp.proceed(); // 调用原方法  
        } finally {  
            System.out.println("[日志] 耗时：" + (System.currentTimeMillis()-start) + "ms");  
        }  
    }  
}  
```

#### 3.3 运行测试  
```java  
public class Test {  
    public static void main(String[] args) throws Exception {  
        // 初始化IoC容器（参考上篇）  
        MyContainer container = new MyContainer("com.example");  
        
        // 初始化AOP  
        MyAopContext aopContext = new MyAopContext();  
        aopContext.init("com.example");  

        // 获取代理后的Bean  
        UserService service = (UserService) aopContext.getProxy(UserServiceImpl.class);  
        service.saveUser();  
    }  
}  

/* 输出：
[日志] 开始执行：saveUser  
保存用户数据...  
[日志] 耗时：3ms  
*/  
```

---

### 四、遇到的坑与解决方案  
1. **CGLIB vs JDK Proxy**  
   - 问题：JDK动态代理要求实现接口  
   - 解决：增加CGLIB支持（熬夜引入asm库）  

2. **通知方法参数传递**  
   - 原方案：简单调用aspectMethod.invoke()  
   - 改进：封装JoinPoint对象  
   ```java  
   public class ProceedingJoinPoint {  
       private final Method method;  
       private final Object[] args;  
       
       public Object proceed() {  
           return method.invoke(target, args);  
       }  
   }  
   ```  

3. **代理嵌套问题**  
   - 现象：一个Bean被多个切面代理  
   - 解决：用责任链模式包装代理对象  

---

### 五、与Spring AOP的差距  
虽然我们的框架能跑了，但相比Spring：  

| 功能               | 手写框架 | Spring AOP |  
|--------------------|---------|------------|  
| 执行速度           | ⭐⭐     | ⭐⭐⭐⭐⭐   |  
| 表达式支持         | 简单正则 | AspectJ语法|  
| 通知类型           | 仅环绕  | 5种        |  
| 热加载支持         | 无      | 有         |  
| 循环依赖处理       | 崩溃    | 优雅解决   |  

---

### 六、收获与反思  
1. **理解AOP的底层代价**  
   - 动态代理不是魔法，而是精心设计的包装  
   - 每个@Transactional背后都是一次代理调用  

2. **性能优化的启示**  
   - Spring使用缓存代理对象（为什么你的@Async不生效？）  
   - CGLIB的FastClass机制避免反射调用  

3. **设计模式的实际应用**  
   - 代理模式：控制访问  
   - 责任链模式：多个切面处理  
   - 工厂模式：创建代理对象  

---

### 最后：给学习者的建议  
如果你想深入理解AOP：  

1. **从接口调试**：  
   ```java  
   // 在IDEA中查看代理类  
   System.out.println(service.getClass().getName());  
   // 输出：com.sun.proxy.$Proxy4  
   ```  

2. **手写极简框架**：  
   - 第一版先支持方法级别的环绕通知  
   - 逐步添加@Before/@After等注解  

3. **推荐学习路径**：  
   1. 《Spring揭秘》第6章  
   2. AspectJ官方文档  
   3. Spring AOP源码中的`ProxyFactoryBean`类  

---

*凌晨四点的城市安静得能听见电流声，当最后一个测试用例变绿时，我突然理解了那些框架作者的笑容——或许这就是编程最纯粹的快乐吧。*  

---  
*原创不易，转载请联系作者*  
*作者：Turnip*  
*2025年写于某个与动态代理死磕的深夜*