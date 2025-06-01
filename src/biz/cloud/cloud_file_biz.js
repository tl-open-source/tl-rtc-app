const {
    tlResponseArgsError, tlResponseForbidden, tlResponseSvrError,
    tlResponseNotFound, tlResponseSuccess,
    checkBit, checkIsId, getImageSize, getAudioInfo
} = require('../../utils/utils')
const {
    contactOssKeyParam, serverFileUrlTransfer
} = require('../../utils/oss/oss')
const cloudFileService = require('../../service/cloud/tl_cloud_file_service')

const { fields: TlCloudFileFields } = require('../../tables/tl_cloud_file')

const { 
    Type: TlCloudFileType, Def: TlCloudFileDef, 
    Flag: TlCloudFileFlag,
} = TlCloudFileFields


const totalFileSize = 100 * 1024 * 1024


/**
 * 上传文件
 * @param {*} loginInfo 
 * @param {*} file
 * @param {*} channelId
 * @param {*} dirId
 * @param {*} fileId
 */
const uploadFile = async function ({ loginInfo, file, channelId, dirId, fileId }) {
    if (!file) {
        return tlResponseArgsError("文件为空")
    }

    const { 
        loginUserCompanyId, loginUserId, loginUsername
    } = loginInfo

    // 大小
    const fileSize = file.size

    //最大5M
    if (fileSize > 5 * 1024 * 1024){
        return tlResponseForbidden("文件最大不能超过5M")
    }

    // 获取当前登录用户所有文件大小, 最大100M
    const userCloudFileSize = await cloudFileService.getListByUserId({
        companyId: loginUserCompanyId,
        userId: loginUserId,
    }, [
        TlCloudFileDef.fileSize
    ])

    // 获取回收站文件大小
    const userCloudRecycleFileSize = await cloudFileService.getListByUserIdDeleted({
        companyId: loginUserCompanyId,
        userId: loginUserId,
    }, [
        TlCloudFileDef.fileSize
    ])

    let totalSize = 0
    for(let i = 0; i < userCloudFileSize.length; i++){
        totalSize += userCloudFileSize[i][TlCloudFileDef.fileSize]
    }

    for(let i = 0; i < userCloudRecycleFileSize.length; i++){
        totalSize += userCloudRecycleFileSize[i][TlCloudFileDef.fileSize]
    }

    if(totalSize + fileSize > totalFileSize){
        return tlResponseForbidden("当前剩余空间不足")
    }

    let flag = 0

    // 类型
    const fileType = file.mimetype
    // 源文件名
    let fileOriginalName = Buffer.from(file.originalname, 'latin1').toString('utf-8');
    // 后缀
    const fileExt = fileOriginalName.split('.').pop()
    // 生成文件名称
    const saveFileName = fileId;
    
    // url - ossKey = /companyId/userId/flag/fileName
    const fileUrl = contactOssKeyParam({
        companyId: loginUserCompanyId,
        userId: loginUserId,
        ossFlag: flag,
        fileName: saveFileName
    })

    let other = {}
    // 根据后缀和类型判断文件类型
    let saveFileType = TlCloudFileType.OTHER

    // 图片
    if (fileType.indexOf('image') > -1 || [
        'jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'ico',
    ].includes(fileExt)) {
        saveFileType = TlCloudFileType.IMAGE

        const imageSize = await getImageSize(file.path)
        if(imageSize){
            other = {
                width: imageSize.width,
                height: imageSize.height
            }
        }
    }
    // 音频
    else if (fileType.indexOf('audio') > -1 || [
        'mp3', 'wav', 'wma', 'ogg', 'ape', 'flac', 'aac', 'amr',
    ].includes(fileExt)) {
        saveFileType = TlCloudFileType.AUDIO

        const audioInfo = await getAudioInfo(file.path)

        other = {
            channels: audioInfo.format.numberOfChannels, 
            sampleRate: audioInfo.format.sampleRate, 
            duration: audioInfo.format.duration 
        }
    }
    // 视频
    else if (fileType.indexOf('video') > -1 || [
        'mp4', 'avi', 'mov', 'wmv', 'rmvb', 'flv', '3gp', 'mkv', 'webp',
    ].includes(fileExt)) {
        saveFileType = TlCloudFileType.VIDEO
        other = {
            width: file.width,
            height: file.height,
            duration: file.duration
        }
    }
    // 文档
    else if ([
        'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf', 'txt',
        'html', 'htm', 'css', 'js', 'json', 'xml', 'sql', 'java', 'c', 'cpp', 'h', 'hpp',
        'py', 'go', 'php', 'sh', 'bat', 'cmd', 'ini', 'conf', 'log', 'md', 'markdown',
        'tsv', 'dat', 'db', 'dbf', 'mdb', 'accdb', 'sqlit', 'db3', 'db2', 'db1',
    ].includes(fileExt)) {
        saveFileType = TlCloudFileType.DOCUMENT
    }
    // 压缩包
    else if ([
        'zip', 'rar', '7z', 'tar', 'tgz', 'gz', 'bz2', 'xz', 'lz', 'lzma', 'z', 
        'iso', 'img', 'bin', 'patch', 'diff',
    ].includes(fileExt)) {
        saveFileType = TlCloudFileType.ZIP
    }
    // 其他
    else {
        saveFileType = TlCloudFileType.OTHER
    }

    dirId = parseInt(dirId) || 0

    // 保存文件记录
    const result = await cloudFileService.addInfo({
        companyId: loginUserCompanyId,
        userId: loginUserId,
        type: saveFileType,
        flag,
        originFileName: fileOriginalName,
        originFileType: fileType,
        fileName: saveFileName,
        fileSize,
        fileUrl: `${fileUrl}`,
        fileId: fileId,
        dirId: dirId,
        other: JSON.stringify(other)
    })

    if(Object.keys(result).length === 0){
        return tlResponseSvrError("上传失败")
    }

    return tlResponseSuccess("上传成功", { 
        cloudFileId: result.id,
        fileId: fileId,
     })
}

/**
 * 下载云服务器本地文件
 * @param {*} loginInfo
 * @param {*} fileId : 资源库id
 * @param {*} key : 文件的key路径
 * @returns
 */
const downloadCloudFile = async function ({ loginInfo, fileId, key }) {
    if (!fileId && !key) {
        return tlResponseArgsError("请求参数错误")
    }

    if(fileId && !checkIsId(fileId)){
        return tlResponseArgsError("请求参数错误")
    }

    const { 
        loginUserCompanyId, loginUserId,
    } = loginInfo


    // 如果传到是fileId，则查询文件信息
    if(fileId){
        fileId = parseInt(fileId)

        const fileInfo = await cloudFileService.getInfoById({
            companyId: loginUserCompanyId,
            id: fileId
        })

        if(Object.keys(fileInfo).length === 0){
            return tlResponseNotFound("文件不存在")
        }

        const userId = fileInfo[TlCloudFileDef.userId]

        if(userId !== loginUserId){
            return tlResponseForbidden("你没有权限下载该文件")
        }

        const flag = fileInfo[TlCloudFileDef.flag]
        const saveToAly = checkBit(flag, TlCloudFileFlag.IS_UPLOAD_ALI)
        const saveToTx = checkBit(flag, TlCloudFileFlag.IS_UPLOAD_TX)
        const saveToQn = checkBit(flag, TlCloudFileFlag.IS_UPLOAD_QN)

        if(saveToAly || saveToTx || saveToQn){
            return tlResponseForbidden("当前文件存在OSS中，请使用OSS地址下载")
        }

        // 服务器路径
        const filePath = serverFileUrlTransfer(fileInfo[TlCloudFileDef.fileUrl])

        // 检查文件是否存在
        if (filePath === '') {
            return tlResponseNotFound("文件不存在")
        }

        // 返回文件流
        return tlResponseSuccess("获取成功", filePath)
    }

    // 如果传到是key，则直接处理
    if(key){
        // base64解码key
        key = Buffer.from(key, 'base64').toString('utf-8')
        key = decodeURIComponent(key)
        
        if(!key || key.length === 0){
            return tlResponseArgsError("请求参数错误")
        }

        // 服务器路径
        const filePath = serverFileUrlTransfer(key)

        // 检查文件是否存在
        if (filePath === '') {
            return tlResponseNotFound("文件不存在")
        }

        // 返回文件流
        return tlResponseSuccess("获取成功", filePath)
    }
}


module.exports = {
    uploadFile,
    downloadCloudFile,
}