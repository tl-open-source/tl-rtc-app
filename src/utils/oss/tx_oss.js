const { get_env_config, load_env_config } = require("../../../conf/env_config");
//加载环境变量
load_env_config();
//加载环境变量完毕后，加载配置
const conf = get_env_config()
const OSS = require('cos-nodejs-sdk-v5');


const ossInstant = new OSS({
    SecretId: conf.oss_tx_secretId,
    SecretKey: conf.oss_tx_secretKey
})

/**
 * 上传文件
 */
const uploadFileToOss = function ({ key, file }) {
    return new Promise((resolve, reject) => {
        ossInstant.putObject({
            Bucket: conf.oss_tx_bucket,
            Region: conf.oss_tx_region,
            Key: key,
            Body: file
        }, function (err, data) {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        });
    })
}

/**
 * 获取oss的url
 * @param {*} key
 * @param {*} expires
 * @returns 
 */
const getOssUrl = async function (key, expires = 3600) {
    return "/image/404.png";
}

/**
 * 获取头像的oss-url
 * @param {*} key
 * @param {*} expires
 * @returns 
 */
const getAvatarOssUrl = async function (key, expires = 3600) {
    return '/image/default-avatar.png'
}

module.exports = {
    uploadFileToOss,
    getOssUrl,
    getAvatarOssUrl
}