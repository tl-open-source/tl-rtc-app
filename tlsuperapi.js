const { get_env_config, load_env_config } = require("./conf/env_config");
//加载环境变量
load_env_config();
//获取环境变量
const conf = get_env_config();
const { 
    tlConsoleSuperApiIcon, tlConsole, tlConsoleError
} = require("./src/utils/utils");
//打印logo
tlConsoleSuperApiIcon()

const express = require("express");
const bodyParser = require('body-parser');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const apiRouters = require("./src/controller/router")();
const { dbInit } = require("./src/tables/db"); //db
const { redisInit } = require("./src/utils/cache/redis"); //redis
const fs = require('fs');
const https = require('https');
const loginAuthHandler = require("./src/middleware/loginAuth");
const { loginRoleHandler, loginChannelRoleHandler } = require("./src/middleware/loginRole");
const { storageConfig } = require("./src/middleware/multerConfig");
const {
    checkDefaultBeforStartServer
} = require("./src/middleware/checkAdmin");

const resRouter = {
    "/": "system-dist/",
}


process.on('unhandledRejection', (reason, promise) => {
    tlConsoleError('Unhandled Rejection reason:', reason);
})

async function start() {
    let app = express();

    // parse json
    app.use(bodyParser.json());
    // parse cookie
    app.use(cookieParser());
    // login auth
    app.use(loginAuthHandler)
    // role auth
    app.use(loginRoleHandler)
    // channel role auth
    app.use(loginChannelRoleHandler)
    // parse file upload
    app.use(multer({ storage: storageConfig() }).any());


    tlConsole("db init start ...") 
    if (!conf.db_open) {// 没开db
        tlConsoleError("db not open ...")    
    }else{
        await dbInit();
    }
    tlConsole("db init done ...")
    
    tlConsole("redis init start ...")
    await redisInit();
    tlConsole("redis init done ...")

    tlConsole("api init start ...")
    for (let key in apiRouters) {
        let keyRouterCount = 0
        apiRouters[key].stack.forEach(function (r) {
            if (r.route && r.route.path) keyRouterCount++;
        })
        tlConsole(key, "router count", keyRouterCount)
    }
    // api
    for (let key in apiRouters) app.use(key, apiRouters[key])
    // res api
    for (let key in resRouter) app.use(key, express.static(resRouter[key]));
    tlConsole("api init done ...")

    // check admin user
    await checkDefaultBeforStartServer();
    
    //start server
    if(process.env.tl_rtc_app_env_mode === 'http'){
        app.listen(conf.super_api_port);
    }else {
        let options = {
            key: fs.readFileSync('./conf/keys/server.key'),
            cert: fs.readFileSync('./conf/keys/server.crt')
        }
        https.createServer(options,app).listen(conf.super_api_port);
    }

    tlConsole(process.env.tl_rtc_app_env_mode, "super-api", " server running on", conf.super_api_port, "successful")
}


try{
    start();
}catch(e){
    tlConsoleError(e)
}