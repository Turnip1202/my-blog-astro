---

title: C#从入门到精通

published: 2025-03-03 23:31:43

description: C#从基础语法到高级特性

tags: [C#]

category: backend

draft: false

---

 C#从入门到精通指南，涵盖基础到高阶的核心内容：

---

### **一、基础语法**
#### 1. 数据类型
• **值类型**：`int`, `double`, `bool`, `struct`, `enum`
• **引用类型**：`class`, `interface`, `delegate`, `object`, `string`
• **可空类型**：`int? nullableInt = null;`

#### 2. 变量与常量
```csharp
int num = 10;           // 变量
const double PI = 3.14; // 常量
var name = "C#";        // 类型推断
```

#### 3. 控制结构
```csharp
// 条件语句
if (condition) { ... }
switch (value) { case 1: ... break; }

// 循环
for (int i = 0; i < 10; i++) { ... }
foreach (var item in list) { ... }
while (condition) { ... }
```

#### 4. 函数
```csharp
int Add(int a, int b) => a + b; // 表达式体方法
void Log(string message) { ... }
```

#### 5. 命名空间
```csharp
namespace MyApp;
```

---

### **二、面向对象编程（OOP）**
#### 1. 类与对象
```csharp
public class Person
{
    // 属性（自动实现）
    public string Name { get; set; } 

    // 构造函数
    public Person(string name) => Name = name;

    // 方法
    public void SayHello() => Console.WriteLine($"Hello, {Name}");
}
```

#### 2. 继承与多态
```csharp
public class Student : Person
{
    public Student(string name) : base(name) { }
    public override void SayHello() => Console.WriteLine("Hi, I'm a student!");
}
```

#### 3. 接口与抽象类
```csharp
public interface IDrawable
{
    void Draw();
}

public abstract class Shape : IDrawable
{
    public abstract void Draw(); // 抽象方法
}
```

#### 4. 结构体与枚举
```csharp
public struct Point { public int X; public int Y; }
public enum Color { Red, Green, Blue }
```

#### 5. 访问修饰符
• `public`, `private`, `protected`, `internal`, `protected internal`

---

### **三、高阶特性**
#### 1. 委托与事件
```csharp
public delegate void MyDelegate(string msg);
public event MyDelegate OnMessage;

// Lambda 表达式
Action<string> print = msg => Console.WriteLine(msg);
Func<int, int, int> add = (a, b) => a + b;
```

#### 2. LINQ（语言集成查询）
```csharp
var numbers = new List<int> { 1, 2, 3, 4, 5 };
var evenNumbers = from num in numbers where num % 2 == 0 select num;
var squares = numbers.Select(n => n * n);
```

#### 3. 异步编程
```csharp
public async Task<string> FetchDataAsync()
{
    using var client = new HttpClient();
    return await client.GetStringAsync("https://example.com");
}
```

#### 4. 泛型
```csharp
public class Box<T>
{
    public T Content { get; set; }
}
```

#### 5. 反射与特性
```csharp
[Serializable]
public class DataModel { }

// 反射获取类型信息
Type type = typeof(DataModel);
var attributes = type.GetCustomAttributes();
```

#### 6. 异常处理
```csharp
try { ... }
catch (IOException ex) when (ex.Message.Contains("file")) { ... }
finally { ... }
```

---

### **四、.NET 生态系统**
#### 1. 依赖注入（.NET Core）
```csharp
var services = new ServiceCollection();
services.AddSingleton<ILogger, ConsoleLogger>();
var provider = services.BuildServiceProvider();
var logger = provider.GetService<ILogger>();
```

#### 2. 异步流（C# 8+）
```csharp
public async IAsyncEnumerable<int> GenerateNumbersAsync()
{
    for (int i = 0; i < 10; i++)
    {
        await Task.Delay(100);
        yield return i;
    }
}
```

#### 3. 模式匹配（C# 9+）
```csharp
var result = obj switch
{
    int i when i > 0 => "Positive",
    string s => $"String: {s}",
    _ => "Unknown"
};
```

#### 4. 记录类型（C# 9+）
```csharp
public record Person(string Name, int Age);
var person = new Person("Alice", 30);
var updated = person with { Age = 31 };
```

---

### **五、学习资源**
1. **官方文档**：[Microsoft Learn](https://learn.microsoft.com/zh-cn/dotnet/csharp/)
2. **书籍**：《C# in Depth》《CLR via C#》
3. **工具**：Visual Studio、Rider、.NET CLI
4. **社区**：Stack Overflow、GitHub、C# Discord

---
