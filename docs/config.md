# 配置

本章节帮助您了解二师兄机器人的配置。

## 配置结构

二师兄机器人的主要配置文件有`guard.json`和`bot.json`，均位于`data/config`目录下。

### guard.json

此文件包含守护进程的配置，结构如下：

```
--
 |-- autoRestart
```

#### autoRestart

***警告，您必须在完全理解以下的内容的前提下编辑此项，否则请保持不变！***

是否自动重启机器人，为一个`boolean`值，默认为`false`。

如果设为`true`，则机器人运行发生错误时会自动重新启动。


> <font color="#994444">请注意，此项设为`true`时，如果二师兄机器人包含了持续会发生错误的代码，可能会出现**无限重启**的情况。请在您确定二师兄机器人**不包含错误代码**且**您确实需要此功能**时再启用。</font>

### bot.json

此文件包含机器人的配置，结构如下：

```
--
 |-- interceptor
   |-- enable
 |-- server
   |-- port
```

#### interceptor

此节包含拦截器的配置。

##### enable

启用的拦截器列表，为一个`string`数组，默认为`["hello", "garden"]`。它应该形如：

```
["hello", "garden"]
```

#### server

此节包含后花园服务器的配置。

##### port

后花园服务器的端口，为一个整数，默认为`8088`。