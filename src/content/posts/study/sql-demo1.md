---

title: 复杂SQL练习

published: 2025-01-30 13:49:00

description: 一些练习sql语句的题目。

tags: [Markdown, Blogging, SQL练习题]

category: SQL练习题

draft: false

---

# SQL练习题

### 题目 1: 销售数据分析

**需求**: 获取每个销售人员在过去一年内的销售总额、订单数量以及平均订单金额。结果按销售额降序排列，并显示前10名销售人员的信息。

```sql
-- 1
SELECT 
    sp.name AS sales_person_name,
    COUNT(o.id) AS order_count,
    SUM(o.total_amount) AS total_sales,
    AVG(o.total_amount) AS average_order_value
FROM 
    sales_persons sp
JOIN 
    orders o ON sp.id = o.sales_person_id
WHERE 
    o.order_date >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)
GROUP BY 
    sp.id, sp.name
ORDER BY 
    total_sales DESC
LIMIT 10;


CREATE TABLE sales_persons (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    sales_person_id INT,
    order_date DATE,
    total_amount DECIMAL(10, 2),
    FOREIGN KEY (sales_person_id) REFERENCES sales_persons(id)
);
INSERT INTO sales_persons (name) VALUES ('Alice'), ('Bob'), ('Charlie');

INSERT INTO orders (sales_person_id, order_date, total_amount) VALUES
(1, '2023-01-15', 150.00),
(1, '2023-02-20', 200.00),
(2, '2023-03-10', 175.00),
(2, '2023-04-25', 225.00),
(3, '2023-05-30', 300.00),
(3, '2023-06-05', 250.00),
(1, '2023-07-18', 180.00),
(2, '2023-08-22', 210.00),
(3, '2023-09-27', 280.00);

```

### 题目 2: 学生成绩统计

**需求**: 计算每个学生的总成绩，并找出各科目的最高分学生及其分数。结果显示学生的姓名、科目名称、总成绩以及该科目最高分的学生姓名和分数。

```sql

-- 2--
WITH StudentTotalScores AS (
    SELECT 
        s.id AS student_id,
        s.name AS student_name,
        SUM(sc.score) AS total_score
    FROM 
        students s
    JOIN 
        scores sc ON s.id = sc.student_id
    GROUP BY 
        s.id, s.name
),
SubjectTopScores AS (
    SELECT 
        su.subject_name,
        st.student_name AS top_student_name,
        st.total_score AS top_score
    FROM 
        subjects su
    JOIN 
        scores sc ON su.id = sc.subject_id
    JOIN 
        StudentTotalScores st ON sc.student_id = st.student_id
    WHERE 
        sc.score = (
            SELECT MAX(score)
            FROM scores
            WHERE subject_id = su.id
        )
)
SELECT 
    sts.student_name,
    sts.total_score,
    sts_tsu.subject_name,
    sts_tsu.top_student_name,
    sts_tsu.top_score
FROM 
    StudentTotalScores sts
JOIN 
    SubjectTopScores sts_tsu ON sts.student_id IN (
        SELECT student_id
        FROM scores
        WHERE subject_id = (
            SELECT id
            FROM subjects
            WHERE subject_name = sts_tsu.subject_name
        )
    )
ORDER BY 
    sts.total_score DESC;

CREATE TABLE students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE subjects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    subject_name VARCHAR(100) NOT NULL
);

CREATE TABLE scores (
    student_id INT,
    subject_id INT,
    score DECIMAL(5, 2),
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (subject_id) REFERENCES subjects(id)
);
INSERT INTO students (name) VALUES ('Tom'), ('Jerry'), ('Spike');

INSERT INTO subjects (subject_name) VALUES ('Math'), ('Science'), ('History');

INSERT INTO scores (student_id, subject_id, score) VALUES
(1, 1, 85.00),
(1, 2, 90.00),
(1, 3, 88.00),
(2, 1, 78.00),
(2, 2, 82.00),
(2, 3, 80.00),
(3, 1, 92.00),
(3, 2, 88.00),
(3, 3, 95.00);

```

### 题目 3: 库存管理

**需求**: 获取每个仓库中所有商品的库存总量，并找出哪些仓库的商品种类最多。结果显示仓库名称、库存总量以及商品种类数。

```sql

-- 3--

WITH WarehouseInventoryTotals AS (
    SELECT 
        w.warehouse_name,
        SUM(i.quantity) AS total_quantity,
        COUNT(DISTINCT i.product_id) AS product_count
    FROM 
        warehouses w
    LEFT JOIN 
        inventory i ON w.id = i.warehouse_id
    GROUP BY 
        w.id, w.warehouse_name
),
MaxProductCount AS (
    SELECT 
        MAX(product_count) AS max_product_count
    FROM 
        WarehouseInventoryTotals
)
SELECT 
    wit.warehouse_name,
    wit.total_quantity,
    wit.product_count
FROM 
    WarehouseInventoryTotals wit
JOIN 
    MaxProductCount mpc ON wit.product_count = mpc.max_product_count
ORDER BY 
    wit.total_quantity DESC;

CREATE TABLE warehouses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    warehouse_name VARCHAR(100) NOT NULL
);

CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_name VARCHAR(100) NOT NULL
);

CREATE TABLE inventory (
    warehouse_id INT,
    product_id INT,
    quantity INT,
    FOREIGN KEY (warehouse_id) REFERENCES warehouses(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);
INSERT INTO warehouses (warehouse_name) VALUES ('Warehouse A'), ('Warehouse B'), ('Warehouse C');

INSERT INTO products (product_name) VALUES ('Product X'), ('Product Y'), ('Product Z');

INSERT INTO inventory (warehouse_id, product_id, quantity) VALUES
(1, 1, 100),
(1, 2, 150),
(1, 3, 200),
(2, 1, 120),
(2, 2, 180),
(3, 3, 250),
(3, 1, 130);

```

### 题目 4: 客户购买行为分析

**需求**: 分析每个客户的购买频率和每次购买的平均金额，并找出购买频率最高的客户。结果显示客户的姓名、购买次数、平均购买金额以及购买频率最高的客户的姓名和购买次数。

```sql

-- 4 

WITH CustomerPurchaseStats AS (
    SELECT 
        c.id AS customer_id,
        c.name AS customer_name,
        COUNT(p.id) AS purchase_count,
        AVG(p.amount) AS avg_purchase_amount
    FROM 
        customers c
    JOIN 
        purchases p ON c.id = p.customer_id
    GROUP BY 
        c.id, c.name
),
MaxPurchaseFrequency AS (
    SELECT 
        MAX(purchase_count) AS max_purchase_count
    FROM 
        CustomerPurchaseStats
)
SELECT 
    cps.customer_name,
    cps.purchase_count,
    cps.avg_purchase_amount
FROM 
    CustomerPurchaseStats cps
JOIN 
    MaxPurchaseFrequency mpf ON cps.purchase_count = mpf.max_purchase_count
ORDER BY 
    cps.purchase_count DESC;

CREATE TABLE customers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE purchases (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT,
    purchase_date DATE,
    amount DECIMAL(10, 2),
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

INSERT INTO customers (name) VALUES ('John'), ('Jane'), ('Doe');

INSERT INTO purchases (customer_id, purchase_date, amount) VALUES
(1, '2023-01-10', 100.00),
(1, '2023-02-15', 150.00),
(1, '2023-03-20', 200.00),
(2, '2023-04-25', 120.00),
(2, '2023-05-30', 180.00),
(3, '2023-06-05', 90.00),
(3, '2023-07-10', 110.00),
(3, '2023-08-15', 130.00),
(3, '2023-09-20', 150.00);

```

### 题目 5: 社交媒体帖子分析

**需求**: 分析每个用户的帖子发布频率、点赞总数以及评论总数。结果显示用户名、发帖数、点赞总数、评论总数以及发帖最多的用户的用户名和发帖数。

```sql


-- 5
WITH UserPostStats AS (
    SELECT 
        u.id AS user_id,
        u.username,
        COUNT(po.id) AS post_count,
        COUNT(l.id) AS like_count,
        COUNT(co.id) AS comment_count
    FROM 
        users u
    LEFT JOIN 
        posts po ON u.id = po.user_id
    LEFT JOIN 
        likes l ON po.id = l.post_id
    LEFT JOIN 
        comments co ON po.id = co.post_id
    GROUP BY 
        u.id, u.username
),
MaxPostCount AS (
    SELECT 
        MAX(post_count) AS max_post_count
    FROM 
        UserPostStats
)
SELECT 
    ups.username,
    ups.post_count,
    ups.like_count,
    ups.comment_count
FROM 
    UserPostStats ups
JOIN 
    MaxPostCount mpc ON ups.post_count = mpc.max_post_count
ORDER BY 
    ups.post_count DESC;

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL
);

CREATE TABLE posts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    post_date DATE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE likes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT,
    FOREIGN KEY (post_id) REFERENCES posts(id)
);

CREATE TABLE comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT,
    FOREIGN KEY (post_id) REFERENCES posts(id)
);
INSERT INTO users (username) VALUES ('UserA'), ('UserB'), ('UserC');

INSERT INTO posts (user_id, post_date) VALUES
(1, '2023-01-01'),
(1, '2023-02-01'),
(2, '2023-03-01'),
(2, '2023-04-01'),
(3, '2023-05-01'),
(3, '2023-06-01'),
(3, '2023-07-01');

INSERT INTO likes (post_id) VALUES
(1), (1), (2), (3), (3), (3), (4), (5), (6), (7);

INSERT INTO comments (post_id) VALUES
(1), (1), (2), (3), (3), (4), (5), (6), (7), (7);
```





### 题目: 企业项目管理分析

**需求**: 获取每个员工在每个项目上花费的工作时间、完成的任务数量以及每个项目的总工时。结果显示员工姓名、部门名称、项目名称、工作时间（小时）、完成的任务数量以及项目的总工时。

**表结构**:

* `employees`: 包含员工基本信息。
  
  * `id` (主键)
  * `name`
  * `department_id` (外键关联到 departments.id)

* `departments`: 包含部门信息。
  
  * `id` (主键)
  * `name`

* `projects`: 包含项目信息。
  
  * `id` (主键)
  * `name`
  * `start_date`
  * `end_date`

* `tasks`: 包含任务信息。
  
  * `id` (主键)
  * `project_id` (外键关联到 projects.id)
  * `description`
  * `status` (ENUM('Pending', 'In Progress', 'Completed'))

* `task_assignments`: 包含任务分配信息。
  
  * `id` (主键)
  * `task_id` (外键关联到 tasks.id)
  * `employee_id` (外键关联到 employees.id)
  * `assigned_date`
  * `completed_date`

* `work_logs`: 包含工作日志信息。
  
  * `id` (主键)
  * `task_assignment_id` (外键关联到 task_assignments.id)
  * `log_date`
  * `hours_worked`

```sql
CREATE TABLE departments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE employees (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

CREATE TABLE projects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    start_date DATE,
    end_date DATE
);

CREATE TABLE tasks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT,
    description TEXT,
    status ENUM('Pending', 'In Progress', 'Completed') DEFAULT 'Pending',
    FOREIGN KEY (project_id) REFERENCES projects(id)
);

CREATE TABLE task_assignments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    task_id INT,
    employee_id INT,
    assigned_date DATE,
    completed_date DATE,
    FOREIGN KEY (task_id) REFERENCES tasks(id),
    FOREIGN KEY (employee_id) REFERENCES employees(id)
);

CREATE TABLE work_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    task_assignment_id INT,
    log_date DATE,
    hours_worked DECIMAL(5, 2),
    FOREIGN KEY (task_assignment_id) REFERENCES task_assignments(id)
);
-- Insert departments
INSERT INTO departments (name) VALUES ('Engineering'), ('Marketing'), ('HR');

-- Insert employees
INSERT INTO employees (name, department_id) VALUES 
('Alice', 1), ('Bob', 1), ('Charlie', 2), ('David', 3);

-- Insert projects
INSERT INTO projects (name, start_date, end_date) VALUES 
('Project Alpha', '2023-01-01', '2023-12-31'),
('Project Beta', '2023-02-01', '2023-11-30'),
('Project Gamma', '2023-03-01', '2023-10-31');

-- Insert tasks
INSERT INTO tasks (project_id, description, status) VALUES 
(1, 'Develop Module A', 'Completed'),
(1, 'Develop Module B', 'In Progress'),
(2, 'Market Research', 'Completed'),
(2, 'Ad Campaign', 'Pending'),
(3, 'Recruitment Drive', 'Completed'),
(3, 'Employee Training', 'In Progress');

-- Insert task assignments
INSERT INTO task_assignments (task_id, employee_id, assigned_date, completed_date) VALUES 
(1, 1, '2023-01-10', '2023-02-10'),
(2, 1, '2023-02-15', NULL),
(3, 2, '2023-02-20', '2023-03-20'),
(4, 2, '2023-03-25', NULL),
(5, 3, '2023-03-30', '2023-04-30'),
(6, 3, '2023-05-05', NULL);

-- Insert work logs
INSERT INTO work_logs (task_assignment_id, log_date, hours_worked) VALUES 
(1, '2023-01-11', 8.00),
(1, '2023-01-12', 7.50),
(1, '2023-01-13', 8.00),
(2, '2023-02-16', 6.00),
(2, '2023-02-17', 7.00),
(3, '2023-02-21', 8.00),
(3, '2023-02-22', 7.50),
(4, '2023-03-26', 6.00),
(5, '2023-03-31', 8.00),
(5, '2023-04-01', 7.50),
(6, '2023-05-06', 6.00);
```

#### 复杂的SQL查询

```sql

WITH TaskCompletion AS (
    SELECT 
        ta.employee_id,
        ta.task_id,
        ta.project_id,
        COUNT(wl.id) AS task_completed_count,
        SUM(wl.hours_worked) AS total_hours_worked
    FROM 
        task_assignments ta
    LEFT JOIN 
        work_logs wl ON ta.id = wl.task_assignment_id
    GROUP BY 
        ta.employee_id, ta.task_id, ta.project_id
),
ProjectWorkHours AS (
    SELECT 
        ta.project_id,
        SUM(wl.hours_worked) AS project_total_hours
    FROM 
        task_assignments ta
    JOIN 
        work_logs wl ON ta.id = wl.task_assignment_id
    GROUP BY 
        ta.project_id
)
SELECT 
    e.name AS employee_name,
    d.name AS department_name,
    p.name AS project_name,
    tc.total_hours_worked AS hours_worked,
    tc.task_completed_count AS tasks_completed,
    pw.project_total_hours AS project_total_hours
FROM 
    TaskCompletion tc
JOIN 
    employees e ON tc.employee_id = e.id
JOIN 
    departments d ON e.department_id = d.id
JOIN 
    projects p ON tc.project_id = p.id
JOIN 
    ProjectWorkHours pw ON tc.project_id = pw.project_id
ORDER BY 
    e.name, p.name;
```

### 解释

1. **TaskCompletion CTE**: 计算每个任务分配的完成情况，包括完成的任务数量和总工作小时数。
2. **ProjectWorkHours CTE**: 计算每个项目的总工作小时数。
3. **最终查询**: 结合上述两个CTE，获取每个员工在每个项目上的工作时间、完成的任务数量以及项目的总工时。
   
   

## 更加复杂的sql

### 题目: 企业项目管理与资源分配分析

**需求**: 获取每个员工在每个项目上的工作时间、完成的任务数量、项目的总工时以及每个员工的层级结构（上级和下属关系）。此外，还需要计算每个员工的间接贡献（即下属的工作小时数）。

**表结构**:

* `departments`: 包含部门信息。
  
  * `id` (主键)
  * `name`

* `employees`: 包含员工基本信息。
  
  * `id` (主键)
  * `name`
  * `department_id` (外键关联到 departments.id)
  * `manager_id` (外键关联到 employees.id)

* `projects`: 包含项目信息。
  
  * `id` (主键)
  * `name`
  * `start_date`
  * `end_date`

* `tasks`: 包含任务信息。
  
  * `id` (主键)
  * `project_id` (外键关联到 projects.id)
  * `description`
  * `status` (ENUM('Pending', 'In Progress', 'Completed'))

* `task_assignments`: 包含任务分配信息。
  
  * `id` (主键)
  * `task_id` (外键关联到 tasks.id)
  * `employee_id` (外键关联到 employees.id)
  * `assigned_date`
  * `completed_date`

* `work_logs`: 包含工作日志信息。
  
  * `id` (主键)
  * `task_assignment_id` (外键关联到 task_assignments.id)
  * `log_date`
  * `hours_worked`

```sql
CREATE TABLE departments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE employees (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    department_id INT,
    manager_id INT,
    FOREIGN KEY (department_id) REFERENCES departments(id),
    FOREIGN KEY (manager_id) REFERENCES employees(id)
);

CREATE TABLE projects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    start_date DATE,
    end_date DATE
);

CREATE TABLE tasks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT,
    description TEXT,
    status ENUM('Pending', 'In Progress', 'Completed') DEFAULT 'Pending',
    FOREIGN KEY (project_id) REFERENCES projects(id)
);

CREATE TABLE task_assignments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    task_id INT,
    employee_id INT,
    assigned_date DATE,
    completed_date DATE,
    FOREIGN KEY (task_id) REFERENCES tasks(id),
    FOREIGN KEY (employee_id) REFERENCES employees(id)
);

CREATE TABLE work_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    task_assignment_id INT,
    log_date DATE,
    hours_worked DECIMAL(5, 2),
    FOREIGN KEY (task_assignment_id) REFERENCES task_assignments(id)
);


-- Insert departments
INSERT INTO departments (name) VALUES ('Engineering'), ('Marketing'), ('HR');

-- Insert employees
INSERT INTO employees (name, department_id, manager_id) VALUES 
('Alice', 1, NULL), -- Manager of Engineering
('Bob', 1, 1),     -- Engineer under Alice
('Charlie', 2, NULL), -- Manager of Marketing
('David', 2, 3),   -- Marketer under Charlie
('Eve', 3, NULL);   -- HR Manager

-- Insert projects
INSERT INTO projects (name, start_date, end_date) VALUES 
('Project Alpha', '2023-01-01', '2023-12-31'),
('Project Beta', '2023-02-01', '2023-11-30'),
('Project Gamma', '2023-03-01', '2023-10-31');

-- Insert tasks
INSERT INTO tasks (project_id, description, status) VALUES 
(1, 'Develop Module A', 'Completed'),
(1, 'Develop Module B', 'In Progress'),
(2, 'Market Research', 'Completed'),
(2, 'Ad Campaign', 'Pending'),
(3, 'Recruitment Drive', 'Completed'),
(3, 'Employee Training', 'In Progress');

-- Insert task assignments
INSERT INTO task_assignments (task_id, employee_id, assigned_date, completed_date) VALUES 
(1, 1, '2023-01-10', '2023-02-10'),
(2, 1, '2023-02-15', NULL),
(3, 2, '2023-02-20', '2023-03-20'),
(4, 2, '2023-03-25', NULL),
(5, 3, '2023-03-30', '2023-04-30'),
(6, 3, '2023-05-05', NULL);

-- Insert work logs
INSERT INTO work_logs (task_assignment_id, log_date, hours_worked) VALUES 
(1, '2023-01-11', 8.00),
(1, '2023-01-12', 7.50),
(1, '2023-01-13', 8.00),
(2, '2023-02-16', 6.00),
(2, '2023-02-17', 7.00),
(3, '2023-02-21', 8.00),
(3, '2023-02-22', 7.50),
(4, '2023-03-26', 6.00),
(5, '2023-03-31', 8.00),
(5, '2023-04-01', 7.50),
(6, '2023-05-06', 6.00);


WITH RECURSIVE EmployeeHierarchy AS (
    SELECT 
        e.id AS employee_id,
        e.name AS employee_name,
        e.manager_id,
        e.department_id,
        d.name AS department_name,
        0 AS level
    FROM 
        employees e
    JOIN 
        departments d ON e.department_id = d.id
    WHERE 
        e.manager_id IS NULL

    UNION ALL

    SELECT 
        e.id AS employee_id,
        e.name AS employee_name,
        e.manager_id,
        e.department_id,
        d.name AS department_name,
        eh.level + 1 AS level
    FROM 
        employees e
    JOIN 
        departments d ON e.department_id = d.id
    JOIN 
        EmployeeHierarchy eh ON e.manager_id = eh.employee_id
),
TaskCompletion AS (
    SELECT 
        ta.employee_id,
        ta.task_id,
        ta.project_id,
        COUNT(wl.id) AS task_completed_count,
        SUM(wl.hours_worked) AS total_hours_worked
    FROM 
        task_assignments ta
    LEFT JOIN 
        work_logs wl ON ta.id = wl.task_assignment_id
    GROUP BY 
        ta.employee_id, ta.task_id, ta.project_id
),
ProjectWorkHours AS (
    SELECT 
        ta.project_id,
        SUM(wl.hours_worked) AS project_total_hours
    FROM 
        task_assignments ta
    JOIN 
        work_logs wl ON ta.id = wl.task_assignment_id
    GROUP BY 
        ta.project_id
),
IndirectContribution AS (
    SELECT 
        eh.employee_id,
        eh.manager_id,
        tc.total_hours_worked AS direct_hours,
        SUM(tc.total_hours_worked) OVER (PARTITION BY eh.manager_id) AS indirect_hours
    FROM 
        EmployeeHierarchy eh
    JOIN 
        TaskCompletion tc ON eh.employee_id = tc.employee_id
)
SELECT 
    eh.employee_name,
    eh.department_name,
    p.name AS project_name,
    COALESCE(tc.total_hours_worked, 0) AS hours_worked,
    COALESCE(tc.task_completed_count, 0) AS tasks_completed,
    COALESCE(pw.project_total_hours, 0) AS project_total_hours,
    ic.indirect_hours AS indirect_contribution_hours
FROM 
    EmployeeHierarchy eh
LEFT JOIN 
    TaskCompletion tc ON eh.employee_id = tc.employee_id
LEFT JOIN 
    ProjectWorkHours pw ON tc.project_id = pw.project_id
LEFT JOIN 
    IndirectContribution ic ON eh.employee_id = ic.manager_id
ORDER BY 
    eh.department_name, eh.employee_name, p.name;
```

### 解释

1. **EmployeeHierarchy CTE**: 使用递归CTE来构建员工的层级结构，包括员工ID、姓名、经理ID、部门ID、部门名称和层级级别。
2. **TaskCompletion CTE**: 计算每个任务分配的完成情况，包括完成的任务数量和总工作小时数。
3. **ProjectWorkHours CTE**: 计算每个项目的总工作小时数。
4. **IndirectContribution CTE**: 计算每个员工的间接贡献（即下属的工作小时数），使用窗口函数SUM和PARTITION BY来聚合下属的工作小时数。
5. **最终查询**: 结合上述CTE，获取每个员工在每个项目上的工作时间、完成的任务数量、项目的总工时以及每个员工的间接贡献。
   
   
   
   

### 题目: 企业项目管理与资源分配分析（深度应用MySQL底层特性）

**需求**: 获取每个员工在每个项目上的工作时间、完成的任务数量、项目的总工时以及每个员工的层级结构（上级和下属关系）。此外，还需要计算每个员工的间接贡献（即下属的工作小时数）。最后，通过存储过程来自动化这个查询，并使用触发器来维护某些数据的一致性。

**表结构**:

* `departments`: 包含部门信息。
  
  * `id` (主键)
  * `name`

* `employees`: 包含员工基本信息。
  
  * `id` (主键)
  * `name`
  * `department_id` (外键关联到 departments.id)
  * `manager_id` (外键关联到 employees.id)

* `projects`: 包含项目信息。
  
  * `id` (主键)
  * `name`
  * `start_date`
  * `end_date`

* `tasks`: 包含任务信息。
  
  * `id` (主键)
  * `project_id` (外键关联到 projects.id)
  * `description`
  * `status` (ENUM('Pending', 'In Progress', 'Completed'))

* `task_assignments`: 包含任务分配信息。
  
  * `id` (主键)
  * `task_id` (外键关联到 tasks.id)
  * `employee_id` (外键关联到 employees.id)
  * `assigned_date`
  * `completed_date`

* `work_logs`: 包含工作日志信息。
  
  * `id` (主键)
  * `task_assignment_id` (外键关联到 task_assignments.id)
  * `log_date`
  * `hours_worked`

#### 建表语句

```sql
CREATE TABLE departments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE employees (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    department_id INT,
    manager_id INT,
    FOREIGN KEY (department_id) REFERENCES departments(id),
    FOREIGN KEY (manager_id) REFERENCES employees(id)
);

CREATE TABLE projects (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100)2 NOT NULL,
    start_date DATE,
    end_date DATE
);

CREATE TABLE tasks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT,
    description TEXT,
    status ENUM('Pending', 'In Progress', 'Completed') DEFAULT 'Pending',
    FOREIGN KEY (project_id) REFERENCES projects(id)
);

CREATE TABLE task_assignments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    task_id INT,
    employee_id INT,
    assigned_date DATE,
    completed_date DATE,
    FOREIGN KEY (task_id) REFERENCES tasks(id),
    FOREIGN KEY (employee_id) REFERENCES employees(id)
);

CREATE TABLE work_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    task_assignment_id INT,
    log_date DATE,
    hours_worked DECIMAL(5, 2),
    FOREIGN KEY (task_assignment_id) REFERENCES task_assignments(id)
);


-- Insert departments
INSERT INTO departments (name) VALUES ('Engineering'), ('Marketing'), ('HR');

-- Insert employees
INSERT INTO employees (name, department_id, manager_id) VALUES 
('Alice', 1, NULL), -- Manager of Engineering
('Bob', 1, 1),     -- Engineer under Alice
('Charlie', 2, NULL), -- Manager of Marketing
('David', 2, 3),   -- Marketer under Charlie
('Eve', 3, NULL);   -- HR Manager

-- Insert projects
INSERT INTO projects (name, start_date, end_date) VALUES 
('Project Alpha', '2023-01-01', '2023-12-31'),
('Project Beta', '2023-02-01', '2023-11-30'),
('Project Gamma', '2023-03-01', '2023-10-31');

-- Insert tasks
INSERT INTO tasks (project_id, description, status) VALUES 
(1, 'Develop Module A', 'Completed'),
(1, 'Develop Module B', 'In Progress'),
(2, 'Market Research', 'Completed'),
(2, 'Ad Campaign', 'Pending'),
(3, 'Recruitment Drive', 'Completed'),
(3, 'Employee Training', 'In Progress');

-- Insert task assignments
INSERT INTO task_assignments (task_id, employee_id, assigned_date, completed_date) VALUES 
(1, 1, '2023-01-10', '2023-02-10'),
(2, 1, '2023-02-15', NULL),
(3, 2, '2023-02-20', '2023-03-20'),
(4, 2, '2023-03-25', NULL),
(5, 3, '2023-03-30', '2023-04-30'),
(6, 3, '2023-05-05', NULL);

-- Insert work logs
INSERT INTO work_logs (task_assignment_id, log_date, hours_worked) VALUES 
(1, '2023-01-11', 8.00),
(1, '2023-01-12', 7.50),
(1, '2023-01-13', 8.00),
(2, '2023-02-16', 6.00),
(2, '2023-02-17', 7.00),
(3, '2023-02-21', 8.00),
(3, '2023-02-22', 7.50),
(4, '2023-03-26', 6.00),
(5, '2023-03-31', 8.00),
(5, '2023-04-01', 7.50),
(6, '2023-05-06', 6.00);




DELIMITER //

CREATE TRIGGER update_task_status_before_insert
BEFORE INSERT ON task_assignments
FOR EACH ROW
BEGIN
    UPDATE tasks
    SET status = 'In Progress'
    WHERE id = NEW.task_id;
END//

DELIMITER ;

DELIMITER //

CREATE PROCEDURE GetEmployeeProjectAnalysis()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE emp_id INT;
    DECLARE emp_name VARCHAR(100);
    DECLARE dep_name VARCHAR(100);
    DECLARE proj_name VARCHAR(100);
    DECLARE total_hours DECIMAL(5, 2);
    DECLARE task_count INT;
    DECLARE proj_total_hours DECIMAL(5, 2);
    DECLARE indirect_hours DECIMAL(5, 2);

    DECLARE cur CURSOR FOR
        WITH RECURSIVE EmployeeHierarchy AS (
            SELECT 
                e.id AS employee_id,
                e.name AS employee_name,
                e.manager_id,
                e.department_id,
                d.name AS department_name,
                0 AS level
            FROM 
                employees e
            JOIN 
                departments d ON e.department_id = d.id
            WHERE 
                e.manager_id IS NULL
            
            UNION ALL
            
            SELECT 
                e.id AS employee_id,
                e.name AS employee_name,
                e.manager_id,
                e.department_id,
                d.name AS department_name,
                eh.level + 1 AS level
            FROM 
                employees e
            JOIN 
                departments d ON e.department_id = d.id
            JOIN 
                EmployeeHierarchy eh ON e.manager_id = eh.employee_id
        ),
        TaskCompletion AS (
            SELECT 
                ta.employee_id,
                ta.task_id,
                ta.project_id,
                COUNT(wl.id) AS task_completed_count,
                SUM(wl.hours_worked) AS total_hours_worked
            FROM 
                task_assignments ta
            LEFT JOIN 
                work_logs wl ON ta.id = wl.task_assignment_id
            GROUP BY 
                ta.employee_id, ta.task_id, ta.project_id
        ),
        ProjectWorkHours AS (
            SELECT 
                ta.project_id,
                SUM(wl.hours_worked) AS project_total_hours
            FROM 
                task_assignments ta
            JOIN 
                work_logs wl ON ta.id = wl.task_assignment_id
            GROUP BY 
                ta.project_id
        ),
        IndirectContribution AS (
            SELECT 
                eh.employee_id,
                eh.manager_id,
                tc.total_hours_worked AS direct_hours,
                SUM(tc.total_hours_worked) OVER (PARTITION BY eh.manager_id) AS indirect_hours
            FROM 
                EmployeeHierarchy eh
            JOIN 
                TaskCompletion tc ON eh.employee_id = tc.employee_id
        )
        SELECT 
            eh.employee_name,
            eh.department_name,
            p.name AS project_name,
            COALESCE(tc.total_hours_worked, 0) AS hours_worked,
            COALESCE(tc.task_completed_count, 0) AS tasks_completed,
            COALESCE(pw.project_total_hours, 0) AS project_total_hours,
            ic.indirect_hours AS indirect_contribution_hours
        FROM 
            EmployeeHierarchy eh
        LEFT JOIN 
            TaskCompletion tc ON eh.employee_id = tc.employee_id
        LEFT JOIN 
            ProjectWorkHours pw ON tc.project_id = pw.project_id
        LEFT JOIN 
            IndirectContribution ic ON eh.employee_id = ic.manager_id
        ORDER BY 
            eh.department_name, eh.employee_name, p.name;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    OPEN cur;

    read_loop: LOOP
        FETCH cur INTO emp_name, dep_name, proj_name, total_hours, task_count, proj_total_hours, indirect_hours;
        IF done THEN
            LEAVE read_loop;
        END IF;
        -- Process each row here if needed
        SELECT emp_name, dep_name, proj_name, total_hours, task_count, proj_total_hours, indirect_hours;
    END LOOP;

    CLOSE cur;
END//

DELIMITER ;


CALL GetEmployeeProjectAnalysis();






```

### 解释

1. **触发器**: 在插入新的任务分配时，自动将对应任务的状态更新为"In Progress"。
2. **存储过程**: 使用递归CTE、窗口函数、多表连接等高级SQL特性来生成复杂的查询结果。
3. **游标**: 在存储过程中使用游标来逐行处理查询结果。
