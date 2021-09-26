# FAQ

## 安装依赖问题

1. SQLite3安装不上

   SQLite3需要拉取源码后本地编译，请您确认：
   
   * 您的运行环境中有Python 2.7（尤其是Windows）
   * 您的网络能够连接到亚马逊服务器
    
   如果您实在没有条件连接到上述服务器，您可以尝试依次运行下面的命令：

   ```shell
   npm install -g node-pre-gyp
   npm install sqlite3 --build-from-source
   ```

2. 某些功能无法加载（Cannot find module 'xxx'）

   这个错误提示产生是因为您没有为该模块安装依赖。

   内置的模块都已安装好了依赖，而您从外部引用的模块需要您手动安装依赖。

   以下假设您指定的外部模块在`/opt/download/piggy-bro-interceptor/ext-method`，则具体的方法为：

   ```shell
   cd /opt/download/piggy-bro-interceptor/ext-method
   npm install
   ```
   
   执行命令后，再启动二师兄机器人即可。
