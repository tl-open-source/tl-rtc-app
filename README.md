<p align="center">
  <img src="web-res/image/tlrtcapp-logo.svg" alt="TL-RTC-APP Logo">
</p>

<p align="center">
  <img src="web-res/image/channel-chat.png" alt="TL-RTC-APP Channel Chat">
</p>

### Installation Steps

1. Clone the repository:

    ```bash
    git clone https://github.com/tl-open-source/tl-rtc-app.git
    ```
   
2. Navigate into the project directory:

    ```bash
    cd tl-rtc-app
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

4. Install pm2 globally:

    ```bash
    npm install pm2 -g
    ```

5. Start the super admin API service:

    ```bash
    pm2 start npm --name=tl-rtc-app-super-api -- run http-super-api
    ```
    or

    ```bash
    pm2 start npm --name=tl-rtc-app-super-api -- run https-super-api
    ```

6. Start the API service:

    ```bash
    pm2 start npm --name=tl-rtc-app-api -- run http-api
    ```
    or

    ```bash
    pm2 start npm --name=tl-rtc-app-api -- run https-api
    ```

7. Start the Socket service:

    ```bash
    pm2 start npm --name=tl-rtc-app-socket -- run http-socket
    ```
    or

    ```bash
    pm2 start npm --name=tl-rtc-app-socket -- run https-socket
    ```

### Usage

1. Open your browser and visit `http://localhost:9096` (default).

2. Use the admin panel for managing the IM application at `http://localhost:9098` (default).

### License

This project is licensed under the MIT License. For more information, please refer to the [LICENSE](LICENSE) file.

### Disclaimer

For more details, please refer to the [DISCLAIMER](DISCLAIMER) file.
