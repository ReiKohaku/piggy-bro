# 二师兄后花园

二师兄后花园是本项目自带的Wiki与状态查看套件。

## 编译前端

第一次编译前端前，您需要全局安装`@quasar/cli`，同时建议您使用`yarn`包管理器：

```shell
npm install --global yarn
npm install --global @quasar/cli
```

您需要切换到二师兄后花园前端目录，安装依赖：

```shell
cd frontend
yarn install
```

然后，使用`quasar build`构建前端：

```shell
yarn quasar build
```

构建完毕时，生成的目录将会保存在`dist/dpa`目录下。

## 部署

由于二师兄后花园使用前后端分离方式开发，所以非常推荐您使用反向代理的方式部署。

正确的配置应该如下：

1. 根目录为`{项目路径}/frontend/dist/spa`

2. 为`http://localhost:{后端运行端口}`配置反向代理，将所有指向`/api`路径的请求转发到该地址上

以下是一份使用Nginx配置的示例：

假设后花园部署在`garden.piggy-bro.com`上，项目保存在`/var/www/piggy-bro`下且已经构建好了前端项目，则一份配置好的Nginx配置如下：

```
# conf.d/piggy-bro-garden.conf
server {
  listen               80;
  listen               443 ssl http2;        # 如果不需要开启SSL访问，请注释本行
  server_name          garden.piggy-bro.com;
  
  location ^~ /api {
    proxy_redirect     off;
    proxy_set_header   Host $host;
    proxy_set_header   X-Real-Ip $remote_addr;
    proxy_set_header   X-Forward-Host $host;
    proxy_pass         http://localhost:8088;
  }

  location / {
    root               /var/www/piggy-bro/frontend/dist/spa;
    try_files          $uri $uri/ /index.html;
  }

  # 如果不需要开启SSL访问，请注释以下5行的全部内容
  ssl_certificate      cert/garden.piggy-bro.com_chain.crt;
  ssl_certificate_key  cert/garden.piggy-bro.com_key.key;
  ssl_session_timeout  5m;
  ssl_protocols        TLSv1.3;
  ssl_ciphers          ECDHE-RSA-AES128-GCM-SHA256:HIGH:!aNULL:!MD5:!RC4:!DHE;
}
```

使用`sudo service nginx restart`或`sudo systemctl restart nginx`重启Nginx服务即可。

## 启动后端

后端是跟随机器人一同启动的，无需额外进行配置。

如果您需要修改后端配置，则可以在`/data/config`目录下创建`server.json`编写配置：

```json
{
  "port": 8088
}
```

其中，`port`用于指定后端启动时监听的端口。
