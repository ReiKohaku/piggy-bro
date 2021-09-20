# 上下文

上下文是9月底最后几次更新中引入的概念。这个类中包含了二师兄机器人的运行时变量。

引入上下文的概念，使得二师兄机器人的模块化编程变为了现实，部署二师兄机器人时可以更加自由地选择要启用的功能了。

## 创建

您不需要手动创建上下文。上下文是在机器人启动时自动创建的对象。

## 调用

所有需要与运行时变量交互的地方，都会提供一个`Context`变量，具体可参阅对应的文档。

上下文包含的变量如下：

| 变量名            | 类型           | 备注                 |
| ----------------- | -------------- | -------------------- |
| bot               | Wechaty        | Wechaty机器人变量    |
| template          | Template       | 应答模板             |
| sqliteTemplate    | SqliteTemplate | SQLite3操作类        |
| callLimiter       | CallLimiter    | 调用计数器           |
| __data_dir        | string         | 机器人数据目录       |
| __interceptor_dir | string         | 机器人内置拦截器目录 |
| __build_dir       | string         | 机器人构建目录       |
| __src_dir         | string         | 机器人源码目录       |
