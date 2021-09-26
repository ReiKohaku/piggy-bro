# 开发工具

本章为您介绍开发二师兄机器人时，您可以调用的便于开发的工具。

## 模板

**模板**（**Template**）是定义机器人与用户交流时消息内容的工具。

使用这个工具的意义在于，模块的开发者可以预先定义一套应答方案；而在其他开发者想要使用该模块时，可以根据自己的意愿再定义一套新的应答方案。

### `.add()` vs `.set()`

这两个命令都用于设定键的内容。

但是，`.add()`比`.set()`更为“温和”——这是指，`.add()`不会覆盖已有的键值，而`.set()`会。

下面做一个简单的对比：

1. 只使用`.add()`：

   ```typescript
   import { Interceptor } from "piggy-bro";
   const interceptor = new Interceptor("template-test", (context) => {
     context.template.add("test.key", "我是使用.add()的键值");
   })
       .check((context, message) => /^ttest$/.test(message.text().toLowerCase()))
       .handler(context => context.template.use("test.key"));
   export default interceptor;
   ```

   启用上方的拦截器，当用户向机器人发送`ttest`时，机器人将回复：

   > 我是使用.add()的键值

2. 先使用`.add()`，再使用`.set()`：

   ```typescript
   import { Interceptor } from "piggy-bro";
   const interceptor = new Interceptor("template-test", (context) => {
     context.template.add("test.key", "我是使用.add()的键值");
     context.template.set("test.key", "我是使用.set()的键值");
   })
       .check((context, message) => /^ttest$/.test(message.text().toLowerCase()))
       .handler(context => context.template.use("test.key"));
   export default interceptor;
   ```

   启用上方的拦截器，当用户向机器人发送`ttest`时，机器人将回复：

   > 我是使用.set()的键值

3. 先使用`.set()`，再使用`.add()`：

   ```typescript
   import { Interceptor } from "piggy-bro";
   const interceptor = new Interceptor("template-test", (context) => {
     context.template.set("test.key", "我是使用.set()的键值");
     context.template.add("test.key", "我是使用.add()的键值");
   })
       .check((context, message) => /^ttest$/.test(message.text().toLowerCase()))
       .handler(context => context.template.use("test.key"));
   export default interceptor;
   ```

   启用上方的拦截器，当用户向机器人发送`ttest`时，机器人将回复：

   > 我是使用.set()的键值

### 开发建议

* 为一个键命名时，按照`功能名称.子功能名称.动作描述`的标准命名
* 如果不需要强制覆盖键值，请用`template.add()`

### 使用示例

* 如果您是模块开发者

  您需要在您的入口文件中引入`template`，然后调用`template.add()`为您的模块定义一套基础应答方案。

  ```typescript
  import Interceptor from "piggy-bro";
  const interceptor = new Interceptor("my-method", (context) => {
      context.template.add("my-method.default", "这是默认的应答方案")
  })
      .check(message => /^hello/.test(message.text().toLowerCase()))
      .handler(() => template.use("my-method.default"))
  export default interceptor
  ```

  当然您也可以覆盖本项目默认的应答方案，例如您想要覆盖控制台登录信息提示：

  ```typescript
  context.template.set("on.login", "行くよ、{name}ちゃん！")
  // 由于启动时，是先载入拦截器再启动机器人，所以登录成功时控制台会显示“行くよ、机器人名字ちゃん！”
  ```

  项目默认的模板值，您可以参考`/src/template.ts`的内容。

* 如果您是模块使用者

  您应该不会因为想要修改一句话的内容，而去修改别人的代码，导致拉取更新的时候带来令人头痛的merge操作。

  这个时候您可以在引入所有拦截器后，引入一个无动作的拦截器：

  ```typescript
  // 您的拦截器，例如名为 my-template-interceptor
  import Interceptor from "piggy-bro";
  const interceptor = new Interceptor("my-method", (context) => {
      context.template.add("others-method.default", "修改后的应答内容")
  }).check(() => false)
  
  // /interceptor/entry.ts
  // ...
  import "my-template-interceptor"
  ```

## SQLite模板

业务开发中经常需要用到数据库。

本项目基于轻量、快速、易迁移的考虑，选择了**SQLite3**作为默认支持的数据库操作类。

机器人启动时，会自动在上下文内创建一个`SQLiteTemplate`，并打开`data/database.db`文件（不存在则会自动创建并发出提示）。

这个类封装了基本的SQLite数据库操作为异步方法：`run`、`get`和`all`。当然，如果您非常熟悉`sqlite3`这个包的话，也可以使用`getConnection`方法获取数据库连接，自行操作。

### 使用示例

由于这些操作对于熟悉SQL语句的开发者较为简单，这里只给出使用示例。下面的例子中，如果用户发送了`add`，则会向数据库中插入一条包含用户ID和当前时间的数据，并返回插入的数据条数；如果用户发送了`count`，则会返回已经插入的数据条数。

```typescript
import { Interceptor } from "piggy-bro";
const interceptor = new Interceptor("counter", async (context) => {
    context.sqliteTemplate.run(
        "CREATE TABLE IF NOT EXISTS call_table(" +
            "user_id  CHAR(256)  NOT NULL" +
            "time     LONG       NOT NULL" +
            ")"
    );
})
    .check((context, message) => /^add$/.test(message.text().toLowerCase()) ? { action: "add" } : /^count$/.test(message.text().toLowerCase()) ? { action: "count" } : false)
    .handler(async (context, message, args) => {
        if (args.action === "add") {
            const result = await context.sqliteTemplate.run("INSERT INTO call_table (user_id, time) VALUES (?, ?)", message.from().id, new Time().getTime());
            return `${result.changes} row(s) affected.`;
        } else if (args.action === "count") {
            interface CountResult {
                'COUNT(*)': number
            };
            const result = await context.sqliteTemplate.get<CountResult>("SELECT COUNT(*) FROM call_table");
            return `Count: ${result['COUNT(*)']}`
        }
    })
export default interceptor;
```

如果您还是不太理解SqliteTemplate，您可以参考`src/lib/CallLimiter.ts`中有关SqliteTemplate的用法。

## 调用限制器

有时您想要限制某些命令的可调用次数。二师兄机器人内置了一个工具，用来帮助您实现这样一个简单的统计功能。

### 记录

`.record()`用来记录一次调用，需要提供一个**验证标识**（**Identify ID**）和**方法名称**(**Method**)。

通常来讲，**验证标识**是用来区分消息来源的，比如您可以将用户的私聊标记为`user_{用户的ID}`，将群聊标记为`room_{群聊的ID}`。

而**方法名称**是用来区分调用的方法的，您设置得越复杂越好，这样不容易和其它模块发生冲突。

在使用`.check()`方法统计时，所返回的调用次数是根据您提供的**方法名称**来确定的——这个请往下看。

### 检查

`.check()`用来检查**同一会话**在**一段时间**内**调用了多少次指定的方法**。

这意味着您需要提供至少2个、至多4个参数：至少需要**验证标识**（**Identify ID**）和**方法名称**(**Method**)；可以提供**检查区间最小值**（**Check Section Min**）和**检查区间最大值**（**Check Section Max**），不提供也行。

如果您不提供检查标识或只提供了一个（另一个设置为**undefined**），那么：

- 如果没有区间最小值，设置为`今天的00:00:00`
- 如果没有区间最大值，设置为`今天的23:59:59`

因为没有比较日期的大小，请您使用时注意别填错了——否则机器人可能会出错。

这个方法返回的是一个整数，也就是调用次数。
