<p align="center">
  <img src="icon.png" width="200" height="200" alt="piggy-bro">
</p>

<div align="center">

# 二师兄逗乐机器人

基于 Wechaty 开发开源的二师兄社群逗乐机器人。

</div>

<p align="center">
  <a href="docs/README.md" alt="docs">文档</a>
</p>

## 运行环境

Node >= 12 且 Node < 14，或 Node >= 14.1.0

*有关于特定Node版本的问题，请参阅：[Chrome is downloaded but fails to launch on Node.js 14](https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md#chrome-is-downloaded-but-fails-to-launch-on-nodejs-14)*

## 调试与安装部署

1. 在任意终端中切换到此文件所在文件夹，如：
   ```shell
   cd /opt/git/piggy-bro
   ```

2. 安装依赖。
   ```shell
   npm i
   ```

3. 启动运行脚本。
   ```shell
   npm run start
   ```
   

*如果您遇到了无法启动的问题，请按照下面的条目确认：*

* 运行启动脚本提示 `tsc: not found`

  这是由于您没有全局安装`typescript`的npm包造成的。您只需在终端中执行：

  ```shell
  npm install -g typescript
  
  # 或者您在linux系统上运行，需要更高的命令执行权限……
  sudo npm install -g typescript
  ```

  安装完成后即可解决该问题。

* 运行启动脚本提示创建浏览器进程失败

  报错信息类似于：

  ```shell
  [E] Piggy Bro 00:00:00 ERR PuppetWeChatBridge start() exception: Error: Failed to launch the browser process!
  /your/repo/path/node_modules/puppeteer/./local-chromium/linux-848005/chrome-linux/chrome: error while loading shared libraries: libnss3.so: cannot open shared object file: No such file or directory
  ```

  这是由于您的系统缺少必备的运行库导致的。

  您只需要检查您的系统中缺少的运行库即可，可以参照 [Chrome headless doesn't launch on UNIX](https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md#chrome-headless-doesnt-launch-on-unix)。

  当然您也可以运行仓库根目录下已经配置好的脚本。如果您的操作系统是Debian系（如Ubuntu），请运行`debian-preinstall.sh`；如果是CentOS，请运行`centos-preinstall.sh`。

## 反馈交流

如果您在使用过程中发现任何问题，或是有一些好的点子，欢迎直接为本仓库发送 issue。
