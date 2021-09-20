# 拦截器

**拦截器**（**Interceptor**）是机器人的灵魂，是实现功能的基本单位。

通过编写拦截器，可以控制机器人对消息的应答。

## 模块化编写

非常推荐您单独编写拦截器，而不是直接在此项目的`src/interceptor/method`下编写。

在2021年9月底最后的几次更新中，拦截器又一次获得了重大的“Breaking Changes”：引入了**上下文**（**Context**）概念，并修改了拦截器的引入方式，将功能与机器人**耦合度降为零**！

这次更新让开发者不必fork此项目，就可以尽情编写自己的拦截器，并方便地添加他人编写的拦截器。

如果您要开始编写您的拦截器，您只需要这样做：

1. 新建一个文件夹作为您的拦截器项目文件夹；

2. 使用`npm init`命令，创建一个npm包；

3. 使用`npm install piggy-bro --save`，引入二师兄机器人开发套件；

4. 开始您的编写！

## 引入与创建

拦截器类位于源代码目录下的`interceptor/Interceptor.ts`文件内。

引入时只需要引入该文件即可：

```typescript
import { Interceptor } from "piggy-bro";

const testInterceptor = new Interceptor("test", context => {
    console.log("Interceptor test registed!");
});
```

创建类实例时，需要提供`拦截器名`。`拦截器名`不能包含空格；如果包含空格，程序将会抛出错误。

如果在后面附加了`registHandler`参数，则消息处理器载入此拦截器时，会运行该回调函数。 该回调函数包含一个`Context`类型的参数。

使用`.$name`可以获取此拦截器的`拦截器名`。

## 调用方法

### 功能

您可以调用拦截器的`handler()`方法来编写您的业务代码。

您可以多次调用`handler()`方法，编写多份功能代码。

功能回调函数的参数：

| 参数名      | 类型                | 备注             |
| ----------- | ------------------- | ---------------- |
| context     | Context             | 机器人上下文     |
| message     | Wechaty.Message     | 发送来的消息对象 |
| checkerArgs | Record<string, any> | 检查器提供的参数 |

功能回调函数可能的返回值：

| 返回值类型     | 备注                                    |
| -------------- | --------------------------------------- |
| MessageSayType | Wechaty.Message.say()允许的所有消息类型 |
| void           | 不发送任何内容                          |

功能提供有效的返回值时，机器人会向当前会话中发送一条包含此值的消息。

以下是一个对任何消息都会返回`Hello Piggy Bro!`的拦截器：

```typescript
import { Interceptor } from "piggy-bro";

const testInterceptor = new Interceptor("test");
testInterceptor.handler(() => "Hello Piggy Bro!");
```

这份示例代码绝不可用于业务中，因为它会拒绝之后所有拦截器的运行。

我们需要[检查器](#检查器)来控制它的行为——请接着往下看。

### 检查器

在运行拦截器的功能前，您可以进行预检，来确认是否要进入到功能部分。

调用拦截器的`check()`方法，就可以编写一个检查器。

您可以多次调用`check()`方法，编写任意数量的检查器。

检查器回调函数的参数：

| 参数名      | 类型                | 备注                 |
| ----------- | ------------------- | -------------------- |
| context     | Context             | 机器人上下文         |
| message     | Wechaty.Message     | 发送来的消息对象     |
| checkerArgs | Record<string, any> | 之前检查器提供的参数 |

检查器回调函数可能的返回值：

| 返回值类型          | 备注                                                                  |
| ------------------- | --------------------------------------------------------------------- |
| boolean             | 返回true表示通过了此检查器的检查；返回false表示检查器拒绝继续运行功能 |
| Record<string, any> | 表示通过了此检查器的检查，并提供了一些参数供功能使用                  |
| void                | 表示检查器拒绝继续运行功能                                            |

*注：上述返回值也可包裹在`Promise`内，即`Promise<boolean | Record<string, any> | void>`*

如果检查器返回了一个`Record`对象，那么它将会缓存到`checkerArgs`之中。后面的检查器不会覆写已有的`checkerArgs`，而是追加到里面——除非提供了同名的键，那么后面的数据就会覆写前面的数据。

以下是一个示例，用户提供输入以后，调用对应的API进行搜索，如果能够搜索到结果，就向用户提供第一条搜索结果的内容。

```typescript
import { Interceptor } from "piggy-bro";
import searcher from "./api";

const testInterceptor = new Interceptor("test");
testInterceptor.check((context, message) => {
    if (message.text().length) return {
        content: message.text()
    }
}).check(async (context, message, checkerArgs: { content: string }) => {
    const { content } = checkerArgs
    const results: Array = await searcher(content)
    if (results && results.length) return { results }
}).handler((context, message, checkerArgs: { content: string, results: Array }) => {
    return results[0].content
});
```

### 用法说明

您也许需要为您的功能添加一份简单的说明。

调用`usage()`方法可以定义用法内容。

您既可以提供一个`string`，也可以提供一个返回`string`函数（同步或异步均可）作为参数。

```typescript
import { Interceptor } from "piggy-bro";

const testInterceptor = new Interceptor("test");
testInterceptor.usage("我是一个测试拦截器");
// ...or a function
testInterceptor.usage(context => "我是一个测试拦截器");
// ...a promise is also ok
import usageAPI from "./api";
testInterceptor.usage(async (context, message) => {
    const result: { data: string } = await usageAPI(message.text())
    return result.data;
});
```

使用`.$usage`可以获取已定义的用法文本或函数。

### 别名

有时您也许需要读取其它的拦截器的信息，这时您需要一个定位到目标拦截器的标识。

您也许想到了，`拦截器名`是个好标识，但有时候您可能更希望它有更多的可以定位的标识。所以，`别名`就很有用了。

调用`alias()`方法可以为拦截器创建一个别名。

但请注意，创建别名时不能使用其它拦截器的名字或已经定义过的别名，否则程序将抛出错误。

```typescript
import { Interceptor } from "piggy-bro";

const testInterceptor = new Interceptor("test");
testInterceptor.alias("测试").alias("测试功能");
// ...下面这行代码运行后会抛出错误，因为 test 已经是一个拦截器名了。
testInterceptor.alias("test");
```

使用`.$alias`可以获得此拦截器的别名列表。

### 属性

如果您使用后花园，您可以用**属性**来为你的用户展示一些变量，例如今天的游戏次数还剩几次。

调用`attribute()`方法可以为拦截器创建一个属性。

此方法的参数如下：

| 参数名    | 类型                               | 备注     |
| --------- | ---------------------------------- | -------- |
| name      | string                             | 属性名   |
| attribute | *任意基础类型或返回基础类型的函数* | 属性值   |
| desc?     | string                             | 属性描述 |

若`attribute`参数为一个函数，则该函数的参数如下：

| 参数名  | 类型    | 备注                 |
| ------- | ------- | -------------------- |
| context | Context | 机器人上下文         |
| args    | any     | 前端访问时提供的参数 |

其中，如果您使用的是本项目自带的**二师兄后花园**前端，那么参数将会是一个包含下列属性的对象：

| 属性名 | 类型   | 备注                                        |
| ------ | ------ | ------------------------------------------- |
| id     | string | 后花园所属群的id（由message.room().id获取） |

使用此方法创建的属性，将会在API服务器的`/api/status`接口中返回。

```typescript
import { Interceptor } from "piggy-bro";

const testInterceptor = new Interceptor("test");
// 展示请求此属性时的时间
testInterceptor.attribute("now", () => new Date(), "当前时间");
// 每次调用时计数器+1；提供一个已调用次数的属性供用户查询
testInterceptor.attribute("used", (context, { id }) => context.callLimiter.check(`room_${id}`, "test"), "已调用次数")
    .check((context, message) => message.text().toLowerCase() === "test")
    .handler(async (context, message) => {
        if (message.room()) await context.callLimiter.record(`room_${message.room().id}`, "test");
    });
```

使用`.$attributes()`方法可以获取当前拦截器已注册的所有属性值。

## 在二师兄机器人中启用拦截器

当您编写好一个拦截器后，您一定想要在机器人中启用它。

想要启用一个拦截器，您需要在`/data/config/interceptor.json`的`enable`节中，填写您要启用的拦截器。

你可以用以下两种方式指定拦截器：

1. 使用绝对路径

   填写一个绝对路径（如`C:/interceptor/my-interceptor`），即可指定启用对应的文件（或文件夹下的`index.js`）的拦截器。

   这种方式适用于从外部来源下载第三方拦截器的引入方式。

2. 使用名称

   填写一个非绝对路径（如`help`），程序会自动在`data/interceptor`目录下搜寻该拦截器，如果找到将直接读取；否则，将会从内置的拦截器中寻找。

请注意，无论您使用何种引入方式，您都需要单独为拦截器运行`npm install`之类的命令来安装其依赖，否则这些拦截器可能无法运行。

填写不存在的拦截器将会跳过，并不会阻止机器人启动。
