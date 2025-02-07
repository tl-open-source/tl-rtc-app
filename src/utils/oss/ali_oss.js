const { get_env_config, load_env_config } = require("../../../conf/env_config");
//加载环境变量
load_env_config();
//加载环境变量完毕后，加载配置
const conf = get_env_config()
const OSS = require('ali-oss');


const ossInstant = new OSS({
    accessKeyId: conf.oss_ali_secretId,
    accessKeySecret: conf.oss_ali_secretKey,
    region: 'cn-beijing',
    authorizationV4: true,
    bucket: 'tl-rtc-app-test',
});

/**
 * 上传文件
 */
const uploadFileToOss = function ({ key, file }) {
    return new Promise((resolve, reject) => {
        ossInstant.put(key, file).then((res) => {
            resolve(res)
        }).catch((err) => {
            reject(err)
        })
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