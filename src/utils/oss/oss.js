const fs = require('fs');
const path = require('path');
//加载环境变量
const { get_env_config } = require("../../../conf/env_config");
const { tlConsoleError, checkBit, tlConsole } = require("../../utils/utils");
//加载环境变量完毕后，加载配置
const conf = get_env_config()


/**
 * 上传文件-自动区分oss地址
 * 根据key拆分得到需要上传到的oss地址
 * @param {*} key 
 * @param {*} file 
 * @returns 
 */
const uploadFileToOss = async function ({ key, file }) {
    try{
        
        return true
    }catch(error){
        tlConsoleError("上传文件到oss失败 : ", error)
        return null
    }
}

/**
 * 获取oss的url-自动区分oss地址
 * @param {*} key
 * @param {*} expires
 * @returns 
 */
const getOssUrl = async function (key = "", expires = 3600) {
    try{
        const {
            fileSaveToServer
        } = splitOssKeyParam(key)

        if(key === ""){
            return "/image/404.png"
        }

        if(key.includes("/image/")){
            return key
        }

        else if(fileSaveToServer){
            let filePath = serverFileUrlTransfer(key)
            if(filePath === ''){
                return "/image/404.png" 
            }

            // 移除前面的文件夹路径
            filePath = filePath.replace(conf.file_folder, "")

            // 返回下载服务器文件的url
            return "/api/web/cloud-file/download-server-file?key=" + Buffer.from(
                encodeURIComponent(filePath)
            ).toString('base64');
        }

        return "/image/404.png"
    }catch(error){
        tlConsoleError("获取oss的url失败 : ", error)
        return "/image/404.png"
    }
}

/**
 * 获取头像的oss-url-自动区分oss地址
 * @param {*} key
 * @param {*} expires
 * @returns 
 */
const getAvatarOssUrl = async function (key = "", expires = 3600) {
    try{
        const { 
            fileSaveToServer
        } = splitOssKeyParam(key)

        if(key === ""){
            return "/image/default-avatar.png"
        }

        if(key.includes("/image/")){
            return key
        }

        else if(fileSaveToServer){
            let filePath = serverFileUrlTransfer(key)
            if(filePath === ''){
                return "/image/default-avatar.png" 
            }

            // 移除前面的文件夹路径
            filePath = filePath.replace(conf.file_folder, "")

            // 返回下载服务器文件的url
            return "/api/web/cloud-file/download-server-file?key=" + Buffer.from(
                encodeURIComponent(filePath)
            ).toString('base64');
        }

        return "/image/default-avatar.png"
    }catch(error){
        tlConsoleError("获取头像的oss-url失败 : ", error)
        return "/image/default-avatar.png"
    }
}

/**
 * 根据key拆分得到需要上传到的oss地址
 * @param {*} key 
 * @returns 
 */
const splitOssKeyParam = function (key = "") {
    return {
        fileSaveToServer: true
    }
}

/**
 * 组装 oss key参数
 * @param {*} companyId
 * @param {*} userId
 * @param {*} ossFlag
 * @param {*} fileName 
 * @returns 
 */
const contactOssKeyParam = function ({ 
    companyId, userId, ossFlag, fileName 
}) {
    return `/${companyId}/${userId}/${ossFlag}/${fileName}`
}


/**
 * 获取服务器保存文件文件夹路径
 * @param {*} companyId
 * @param {*} userId
 * @returns 
 */
const genServiceSaveFileFolder = function ({
    companyId, userId
}) {
    return conf.file_folder + '/' + companyId + '/' + userId + '/'
}


/**
 * 服务器文件路径转换
 * @param {*} key 
 * @returns 
 */
const serverFileUrlTransfer = function (key) {
    let keyParams = key.split("/")
    
    let companyId = 0
    let userId = 0
    let fileName = ""

    if(keyParams.length === 5){
        companyId = parseInt(keyParams[1])
        userId = parseInt(keyParams[2])
        // let ossFlag = parseInt(keyParams[3])
        fileName = keyParams[4]
    }

    // 旧版本没有ossFlag
    if(keyParams.length === 4){
        companyId = parseInt(keyParams[1])
        userId = parseInt(keyParams[2])
        fileName = keyParams[3]
    }
    
    // 服务器路径
    const filePath = path.join(genServiceSaveFileFolder({
        companyId: companyId, userId: userId
    }), fileName);
    
    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
        return ""
    }

    return filePath
}


module.exports = {
    uploadFileToOss,
    getOssUrl,
    getAvatarOssUrl,

    contactOssKeyParam,
    genServiceSaveFileFolder,
    serverFileUrlTransfer
}