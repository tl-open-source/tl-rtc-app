const { get_env_config, load_env_config } = require("./conf/env_config");
//加载环境变量
load_env_config();
//加载环境变量完毕后，加载配置
const conf = get_env_config()
//打印logo
const { tlConsole, tlConsoleSocketIcon, tlConsoleError } = require("./src/utils/utils");
tlConsoleSocketIcon()
const http = require('http'); // http
const https = require('https');
const socketIO = require('socket.io');
const fs = require('fs');
const { dbInit } = require("./src/tables/db"); //db
const { redisInit } = require("./src/utils/cache/redis"); //redis

const socket = require("./src/socket/index");


process.on('unhandledRejection', (reason, promise) => {
    tlConsoleError('Unhandled Rejection reason:', reason);
})

async function start(){
    // Socket连接监听
    let io = null;

    if(process.env.tl_rtc_app_env_mode == 'http'){
        io = socketIO.listen(http.createServer().listen(conf.socket_port));
    }else{
        let options = {
            key: fs.readFileSync('./conf/keys/server.key'),
            cert: fs.readFileSync('./conf/keys/server.crt')
        }
        io = socketIO.listen(
            https.createServer(options).listen(conf.socket_port)
        );
    }

    tlConsole("db init start ...") 
    if (!conf.db_open) {// 没开db
        tlConsoleError("db not open ...")
    }else{
        await dbInit();
    }

    tlConsole("redis init start ...")
    await redisInit();
    tlConsole("redis init done ...")

    socket.execute(io)

    tlConsole("socket init done ...")
    tlConsole(process.env.tl_rtc_app_env_mode, "socket ", " server listen on", conf.socket_port, "successful");
}


try{
    start();
}catch(e){
    tlConsoleError(e)
}