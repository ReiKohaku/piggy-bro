# 快速开始

二师兄机器人是一个较易于配置的机器人程序，您可以获取二师兄机器人的副本，自己部署一个二师兄机器人。

## 运行环境

请确保您已有 Git 和 Node.js 运行环境。

### Git

*如果您不需要通过克隆本仓库的方式进行部署，可以跳过这一步。*

*克隆仓库可以快速获取二师兄机器人的更新。*

#### Windows

前往Git官网的Git Windows[下载页面](https://www.git-scm.com/download/win)下载最新稳定版进行安装。

#### Linux

使用系统自带的包管理器安装git。

Debian系（如Ubuntu）：

```shell
sudo apt-get update
sudo apt-get install -y git
```

CentOS：

```shell
sudo yum update
sudo yum install git
```

### Node.js

这是二师兄机器人必须的运行环境，请务必确认安装。

#### Windows

前往Node.js官网的[下载页面](https://nodejs.org/zh-cn/)下载最新稳定版进行安装。

#### Linux

对于**Debian系（如Ubuntu）**的系统，您可以向**apt-get**添加最新的Node.js源，来下载最新版Node.js。

```shell
# 此处setup_14.x的14是大版本号，您可以自行修改来决定安装哪个版本的nodejs，但不要安装12以下的——二师兄机器人并不支持。
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt-get install -y nodejs
```

而对于所有的Linux系统，您可以下载二进制文件自行安装。

```shell
# 首先确认已安装wget
sudo apt-get update
sudo apt-get install -y wget
# ...如果是CentOS系统
sudo yum update
sudo yum install wget
# 切换到安装目录，您可以自行决定
cd /opt/pkg
# 然后在下载页面（https://nodejs.org/zh-cn/download/）下载64位linux二进制包
wget https://nodejs.org/dist/v14.17.6/node-v14.17.6-linux-x64.tar.xz
# 解压二进制包
xz -d node-v14.17.6-linux-x64.tar.xz
tar -xf node-v14.17.6-linux-x64.tar
# 创建软链接
ln -s /opt/pkg/node-v14.17.6-linux-x64/bin/node /usr/bin/node
ln -s /opt/pkg/node-v14.17.6-linux-x64/bin/npm /usr/bin/npm
# 测试
node -v
npm
```

## 获取副本

### 克隆

*如果您不需要获取二师兄机器人的更新，可以查看[直接获取](#直接获取)*。

#### Windows

使用Win+R组合键打开**运行**窗体，输入`cmd`启动命令提示行，然后依次使用下面的命令。

```shell
cd "C:/Program Files"
git clone https://github.com/ReiKohaku/piggy-bro.git
```

#### Linux

```shell
# 切换到某个目录
sudo mkdir /var/git
cd /var/git
# 克隆
git clone https://github.com/ReiKohaku/piggy-bro.git
```

### 直接获取

在本仓库的代码页签中点击**Code**按钮，点击展开页签中的**Download ZIP**按钮，解压到任意位置即可。

## 安装依赖

获取副本后请先安装依赖。

### 安装Node模块

#### Windows

使用Win+R组合键打开**运行**窗体，输入`cmd`启动命令提示行，然后依次使用下面的命令。

```shell
cd "C:/Program Files/piggy-bro"
npm install
```

#### Linux

```shell
# 切换到克隆到的仓库目录或解压到的目录
cd /var/git/piggy-bro
sudo npm install
```

### 安装系统依赖（Linux）

```shell
# Debian系的系统
sudo chmod 777 ./debian-preinstall.sh
./debian-preinstall.sh
# CentOS
sudo chmod 777 ./centos-preinstall.sh
./centos-preinstall.sh
```

## 运行

### Windows

使用Win+R组合键打开**运行**窗体，输入`cmd`启动命令提示行，然后依次使用下面的命令。

```shell
cd "C:/Program Files/piggy-bro"
npm run start
```

保持此窗口打开，不要关闭。

### Linux

```shell
cd /var/git/piggy-bro
sudo npm run start
```

保持此命令运行，不要关闭。
