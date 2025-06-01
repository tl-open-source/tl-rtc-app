const { 
    tlResponseArgsError, tlResponseSvrError, 
    tlResponseNotFound, tlResponseSuccess, checkIsId
} = require('../../utils/utils')
const {
    getOssUrl
} = require('../../utils/oss/oss')
const channelFileService = require('../../service/channel/tl_channel_file_service')
const channelUserService = require('../../service/channel/tl_channel_user_service')
const cloudFileService = require('../../service/cloud/tl_cloud_file_service')

const userReadBiz = require('../user/user_read_biz')

const { fields: channelFileFields } = require('../../tables/tl_channel_file')
const { fields: channelUserFields} = require('../../tables/tl_channel_user')
const { fields: cloudFileFields } = require('../../tables/tl_cloud_file')

const { 
    Def: TlChannelFileDef, Type: TlChannelFileType, 
    Status: TlChannelFileStatus, Other: TlChannelFileOther, 
} = channelFileFields
const { Def: TlChannelUserDef } = channelUserFields
const { Def: TlCloudFileDef } = cloudFileFields


/**
 * 发送好友频道文件消息
 * @param {*} loginInfo
 * @param {*} cloudFileId
 * @param {*} type
 * @param {*} channelId
 */
const addFriendChannelFile = async function ({
    loginInfo, cloudFileId, type, channelId
}) {
    if (!cloudFileId) {
        return tlResponseArgsError("请求参数错误")
    }

    cloudFileId = parseInt(cloudFileId)
    if (!checkIsId(cloudFileId)) {
        return tlResponseArgsError("请求参数错误")
    }

    if (!type) {
        return tlResponseArgsError("请求参数错误")
    }

    if (!channelId) {
        return tlResponseArgsError("请求参数错误")
    }

    channelId = parseInt(channelId)
    if (!checkIsId(channelId)) {
        return tlResponseArgsError("请求参数错误")
    }

    const {
        loginUserCompanyId, loginUserId, loginUsername,
        loginUserAvatar
    } = loginInfo;

    // 发送好友媒体消息，如果没有找到好友，说明可能已被对方删除
    const channelUserList = await channelUserService.getListByChannelId({
        companyId: loginUserCompanyId,
        channelId
    }, [
        TlChannelUserDef.userId, 
        TlChannelUserDef.status
    ])
    const friendUser = channelUserList.find(item => item[TlChannelUserDef.userId] !== loginUserId)
    if(!friendUser){
        return tlResponseNotFound("发送失败，对方已经不是您的好友")
    }

    // 当前用户是否存在频道
    const channelUserInfo = channelUserList.find(item => item[TlChannelUserDef.userId] == loginUserId)
    if(!channelUserInfo){
        return tlResponseNotFound("非法操作")
    }

    const info = await channelFileService.addInfo({
        companyId: loginUserCompanyId,
        channelId,
        flag: 0,
        type: type,
        status: TlChannelFileStatus.INIT,
        cloudFileId: cloudFileId,
        fromUserId: loginUserId,
        fromUserName: loginUsername,
        other: JSON.stringify({
            [TlChannelFileOther.ip]: '',
        }),
        messageTimeStamp: Date.now(),
        messageVersion: 'v1'
    })

    if (Object.keys(info).length == 0) {
        return tlResponseSvrError("发送失败")
    }

    // 更新用户已读消息
    const updateUserReadRes = await userReadBiz.updateChannelFileRead({
        loginInfo, channelId, 
        latestReadId: info[TlChannelFileDef.id], 
    })

    if(!updateUserReadRes.success){
        return tlResponseSvrError("发送失败")
    }

    const fileType = info[TlChannelFileDef.type]
    let message = ""
    if(fileType == TlChannelFileType.P2P){
        message = "在线文件"
    }else if(fileType == TlChannelFileType.OFFLINE){
        message = "离线文件"
    }

    const cloudFile = await cloudFileService.getInfoById({
        companyId: loginUserCompanyId,
        id: cloudFileId
    }, [
        TlCloudFileDef.id,
        TlCloudFileDef.originFileName,
        TlCloudFileDef.fileSize,
        TlCloudFileDef.fileUrl,
    ])

    if (!cloudFile) {
        return tlResponseSvrError("发送失败")
    }

    let fileUrl = cloudFile[TlCloudFileDef.fileUrl]
    fileUrl = await getOssUrl(fileUrl)

    return tlResponseSuccess("发送成功", {
        id: info[TlChannelFileDef.id],
        message: message,
        fromUserName: info[TlChannelFileDef.fromUserName],
        type: info[TlChannelFileDef.type],
        status: info[TlChannelFileDef.status],
        cloudFileId: cloudFileId,
        createTime: info[TlChannelFileDef.createdAt],
        fromUserId: info[TlChannelFileDef.fromUserId],
        fromUserName: info[TlChannelFileDef.fromUserName],
        fromUserAvatar: loginUserAvatar,
        fileName: cloudFile[TlCloudFileDef.originFileName],
        fileSize: cloudFile[TlCloudFileDef.fileSize],
        fileUrl,
        hasRead: true,
        messageTimeStamp: info[TlChannelFileDef.messageTimeStamp],
        messageVersion: info[TlChannelFileDef.messageVersion],
    })
}


/**
 * 发送群聊频道媒体流消息
 * @param {*} loginInfo
 * @param {*} file
 * @param {*} type
 * @param {*} other
 * @param {*} channelId
 */
const addGroupChannelFile = async function ({
    loginInfo, cloudFileId, type, channelId
}) {
    if (!cloudFileId) {
        return tlResponseArgsError("请求参数错误")
    }

    cloudFileId = parseInt(cloudFileId)
    if (!checkIsId(cloudFileId)) {
        return tlResponseArgsError("请求参数错误")
    }

    if (!type) {
        return tlResponseArgsError("请求参数错误")
    }

    if (!channelId) {
        return tlResponseArgsError("请求参数错误")
    }

    channelId = parseInt(channelId)
    if (!checkIsId(channelId)) {
        return tlResponseArgsError("请求参数错误")
    }

    const {
        loginUserCompanyId, loginUserId, loginUsername,
        loginUserAvatar
    } = loginInfo;

    // 当前用户是否存在频道
    const channelUserInfo = await channelUserService.getInfoByChannelIdAndUserId({
        companyId: loginUserCompanyId,
        channelId: channelId,
        userId: loginUserId
    })

    if(Object.keys(channelUserInfo).length == 0){
        return tlResponseNotFound("非法操作")
    }

    const info = await channelFileService.addInfo({
        companyId: loginUserCompanyId,
        channelId,
        flag: 0,
        type: type,
        status: TlChannelFileStatus.INIT,
        cloudFileId: cloudFileId,
        fromUserId: loginUserId,
        fromUserName: loginUsername,
        other: JSON.stringify({
            [TlChannelFileOther.ip]: '',
        }),
        messageTimeStamp: Date.now(),
        messageVersion: 'v1'
    })

    if (Object.keys(info).length == 0) {
        return tlResponseSvrError("发送群聊频道媒体流失败")
    }

    // 更新用户已读消息
    const updateUserReadRes = await userReadBiz.updateChannelFileRead({
        loginInfo, channelId, 
        latestReadId: info[TlChannelFileDef.id], 
    })

    if(!updateUserReadRes.success){
        return tlResponseSvrError("发送失败")
    }

    const fileType = info[TlChannelFileDef.type]
    let message = ""
    if(fileType == TlChannelFileType.P2P){
        message = "在线文件"
    }else if(fileType == TlChannelFileType.OFFLINE){
        message = "离线文件"
    }

    const cloudFile = await cloudFileService.getInfoById({
        companyId: loginUserCompanyId,
        id: cloudFileId
    }, [
        TlCloudFileDef.id,
        TlCloudFileDef.originFileName,
        TlCloudFileDef.fileSize,
        TlCloudFileDef.fileUrl,
    ])

    if (!cloudFile) {
        return tlResponseSvrError("发送失败")
    }

    let fileUrl = cloudFile[TlCloudFileDef.fileUrl]
    fileUrl = await getOssUrl(fileUrl)
    
    return tlResponseSuccess("发送成功", {
        id: info[TlChannelFileDef.id],
        message: message,
        fromUserName: info[TlChannelFileDef.fromUserName],
        type: info[TlChannelFileDef.type],
        status: info[TlChannelFileDef.status],
        cloudFileId: cloudFileId,
        createTime: info[TlChannelFileDef.createdAt],
        fromUserId: info[TlChannelFileDef.fromUserId],
        fromUserName: info[TlChannelFileDef.fromUserName],
        fromUserAvatar: loginUserAvatar,
        fileName: cloudFile[TlCloudFileDef.originFileName],
        fileSize: cloudFile[TlCloudFileDef.fileSize],
        fileUrl,
        hasRead: true,
        messageTimeStamp: info[TlChannelFileDef.messageTimeStamp],
        messageVersion: info[TlChannelFileDef.messageVersion],
    })
}


/**
 * 发送群聊频道离线文件消息
 * @param {*} loginInfo
 * @param {*} cloudFileId
 * @param {*} other
 * @param {*} channelId
 */
const addGroupChannelP2PFile = async function ({
    loginInfo, cloudFileId, channelId
}) {
    return await addGroupChannelFile({
        loginInfo, cloudFileId, type: TlChannelFileType.P2P, channelId
    })
}

/**
 * 发送群聊频道在线文件消息
 * @param {*} loginInfo
 * @param {*} cloudFileId
 * @param {*} other
 * @param {*} channelId
 */
const addGroupChannelOfflineFile = async function ({
    loginInfo, cloudFileId, channelId
}) {
    return await addGroupChannelFile({
        loginInfo, cloudFileId, type: TlChannelFileType.OFFLINE, channelId
    })
}

/**
 * 发送好友频道离线文件消息
 * @param {*} loginInfo
 * @param {*} cloudFileId
 * @param {*} other
 * @param {*} channelId
 */
const addFirendChannelP2PFile = async function ({
    loginInfo, cloudFileId, channelId
}) {
    return await addFriendChannelFile({
        loginInfo, cloudFileId, type: TlChannelFileType.P2P, channelId
    })
}

/**
 * 发送好友频道在线文件消息
 * @param {*} loginInfo
 * @param {*} cloudFileId
 * @param {*} other
 * @param {*} channelId
 */
const addFriendChannelOfflineFile = async function ({
    loginInfo, cloudFileId, channelId
}) {
    return await addFriendChannelFile({
        loginInfo, cloudFileId, type: TlChannelFileType.OFFLINE, channelId
    })
}


module.exports = {
    addFirendChannelP2PFile,
    addFriendChannelOfflineFile,
    
    addGroupChannelP2PFile,
    addGroupChannelOfflineFile
}