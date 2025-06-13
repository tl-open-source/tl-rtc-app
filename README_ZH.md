英文: [README.md](README.md)

<p align="center">
  <img src="web-res/image/tlrtcapp-logo.svg" alt="TL-RTC-APP Logo">
</p>

<p align="center">
  <img src="web-res/image/channel-chat.png" alt="TL-RTC-APP Channel Chat">
</p>

### 安装步骤

1. 前提条件

    ```bash
    确保已安装 Node.js （v16+） 和 npm，mysql(5.7+), redis(4.0+)。
    ```

2. 克隆仓库：

    ```bash
    git clone https://github.com/tl-open-source/tl-rtc-app.git
    ```

3. 进入项目目录：

    ```bash
    cd tl-rtc-app
    ```

4. 安装依赖：

    ```bash
    npm install
    ```

5. 安装pm2:

    ```bash
    npm install pm2 -g
    ```

6. 启动服务：

    ```bash
    npm run http
    ```
    或者 (如需体验音视频/屏幕共享/直播等功能):

    ```bash
    npm run https
    ```

7. 打包前端资源:

    ```bash
    gulp default
    ```


### 使用说明

1. 打开浏览器并访问 `http://localhost:9096` (默认)。

2. 通过管理端应用进行IM应用管理 `http://localhost:9098/system.html` (默认)。


### 许可证
该项目根据 MIT 许可证授权。有关详细信息，请参阅 [LICENSE](LICENSE) 文件。


### 免责声明
有关详细信息，请参阅 [DISCLAIMER](DISCLAIMER) 文件。
