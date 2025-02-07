const { get_env_config, load_env_config } = require("../../../conf/env_config");
const { tlConsoleError } = require("../../utils/utils");
//加载环境变量
load_env_config();
//加载环境变量完毕后，加载配置
const conf = get_env_config()

const txInstant = require('./tx_oss')
const aliInstant = require('./ali_oss')


/**
 * 获取oss的url
 * @param {*} key
 * @param {*} expires
 * @returns 
 */
const getOssUrl = async function (key, expires = 3600) {
    try{
        return txInstant.getOssUrl(key, expires)
    }catch(error){
        tlConsoleError("获取oss的url失败 : ", error)
        return null
    }
}

/**
 * 获取头像的oss-url
 * @param {*} key
 * @param {*} expires
 * @returns 
 */
const getAvatarOssUrl = async function (key, expires = 3600) {
    try{
        return txInstant.getAvatarOssUrl(key, expires)
    }catch(error){
        tlConsoleError("获取头像的oss-url失败 : ", error)
        return null
    }
}

/**
 * 获取阿里云oss的url
 * @param {*} key
 * @param {*} expires
 * @returns 
 */
const getOssUrlAli = async function (key, expires = 3600) {
    try{
        return aliInstant.getOssUrl(key, expires)
    }catch(error){
        tlConsoleError("获取阿里云oss的url失败 : ", error)
        return null
    }
}

/**
 * 获取阿里云oss的头像url
 * @param {*} key
 * @param {*} expires
 * @returns 
 */
const getAvatarOssUrlAli = async function (key, expires = 3600) {
    try{
        return aliInstant.getAvatarOssUrl(key, expires)
    }catch(error){
        tlConsoleError("获取阿里云oss的头像url失败 : ", error)
        return null
    }
}


/**
 * 获取腾讯云oss的url
 * @param {*} key
 * @param {*} expires
 * @returns 
 */
const getOssUrlTx = async function (key, expires = 3600) {
    try{
        return txInstant.getOssUrl(key, expires)
    }catch(error){
        tlConsoleError("获取腾讯云oss的url失败 : ", error)
        return null
    }
}

/**
 * 获取腾讯云oss的头像url
 * @param {*} key
 * @param {*} expires
 * @returns 
 */
const getAvatarOssUrlTx = async function (key, expires = 3600) {
    try{
        return txInstant.getAvatarOssUrl(key, expires)
    }catch(error){
        tlConsoleError("获取腾讯云oss的头像url失败 : ", error)
        return null
    }
}


module.exports = {
    getOssUrl,
    getAvatarOssUrl,

    getOssUrlAli,
    getAvatarOssUrlAli,

    getOssUrlTx,
    getAvatarOssUrlTx,
}