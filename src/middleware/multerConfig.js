const multer = require('multer')
const fs = require('fs')
const uuid = require('uuid')
const { get_env_config } = require("../../conf/env_config");
//获取环境变量
const conf = get_env_config();
const { genServiceSaveFileFolder } = require('../utils/oss/oss')

/**
 * 配置 multer 存储
 * @returns {Object} - multer 存储配置
 */
const storageConfig = function () {
    // 配置 multer 存储
    return multer.diskStorage({
        // 设置文件存储路径
        destination: function (request, file, callback) {
            const loginInfo = request.ctx || {}
            const { 
                loginUserCompanyId, loginUserId,
            } = loginInfo

            let path = genServiceSaveFileFolder({
                companyId: loginUserCompanyId, userId: loginUserId
            })

            // 如果文件夹不存在则创建
            if (!fs.existsSync(path)) {
                fs.mkdirSync(path, {
                    recursive: true
                })
            }

            callback(null, path)
        },
        // 设置文件名
        filename: function (request, file, callback) {
            // 获取文件后缀
            const ext = file.originalname.split('.').pop()
            // 生成文件名: 时间戳-随机数.后缀
            const filename = `${uuid.v4()}.${ext}`

            request.fileId = filename

            callback(null, filename)
        },
        limits: {
            fileSize: 1024 * 1024 * 5 // 5MB
        },
    })
}




module.exports = {
    storageConfig,
}