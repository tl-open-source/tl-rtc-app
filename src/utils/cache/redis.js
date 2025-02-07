const { createClient } = require('redis');
const {
    tlConsole,
} = require('../../utils/utils');
const { get_env_config } = require("../../../conf/env_config");
const conf = get_env_config();

// 连接对象缓存
let redisClientInstance = null

/**
 * 获取redis客户端
 * @returns 
 */
const redisInit = async function() {
    if(redisClientInstance != null){
        return redisClientInstance;
    }

    const RDS_USER = "default"
    const RDS_HOST = conf.redis_host;
    const RDS_PORT = conf.redis_port;
    const RDS_PWD = conf.redis_password;
    const RDS_OPTS = {
        auth_pass: RDS_PWD,
    };

    if(RDS_PWD){
        redisClientInstance = createClient({
            url: `redis://:${RDS_PWD}@${RDS_HOST}:${RDS_PORT}/0`,
        });
    }else{
        redisClientInstance = createClient({});
    }
    
    redisClientInstance.on('error', err => {
        tlConsole('Redis Client Error : ', err)
    });

    await redisClientInstance.connect();

    tlConsole('redis connect ok ...');
};


/**
 * 获取redis客户端连接
 * @returns 
 */
const getRedisClient = function(){
    return redisClientInstance;
}


module.exports = {
    redisInit, getRedisClient
}