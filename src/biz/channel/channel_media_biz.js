const { 
    tlResponseArgsError, tlResponseForbidden, tlResponseSvrError, 
    tlResponseTimeout, tlResponseNotFound, tlResponseSuccess, checkIsId
} = require('../../utils/utils')
const channelMediaService = require('../../service/channel/tl_channel_media_service')
const channelUserService = require('../../service/channel/tl_channel_user_service')
const userReadBiz = require('../user/user_read_biz')

const { fields: channelMediaFields } = require('../../tables/tl_channel_media')
const { fields: channelUserFields} = require('../../tables/tl_channel_user')
const { 
    Def: TlChannelMediaDef, Type: TlChannelMediaType, 
    Status: TlChannelMediaStatus, Other: TlChannelMediaOther 
} = channelMediaFields
const { 
    Def: TlChannelUserDef 
} = channelUserFields

/**
 * 发送好友频道媒体流通话消息
 * @param {*} loginInfo
 * @param {*} media
 * @param {*} type
 * @param {*} toUserId
 * @param {*} toUserName
 * @param {*} channelId
 */
const addFriendChannelMedia = async function ({
    loginInfo, media, type, channelId
}) {
    if (!media) {
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

    const info = await channelMediaService.addInfo({
        companyId: loginUserCompanyId,
        channelId,
        flag: 0,
        type: type,
        status: TlChannelMediaStatus.INIT,
        media: JSON.stringify(media),
        fromUserId: loginUserId,
        fromUserName: loginUsername,
        other: JSON.stringify({
            [TlChannelMediaOther.ip]: '',
        }),
        messageTimeStamp: Date.now(),
        messageVersion: 'v1'
    })

    if (Object.keys(info).length == 0) {
        return tlResponseSvrError("发送失败")
    }

    // 更新用户已读消息
    const updateUserReadRes = await userReadBiz.updateChannelMediaRead({
        loginInfo, channelId, 
        latestReadId: info[TlChannelMediaDef.id], 
    })

    if(!updateUserReadRes.success){
        return tlResponseSvrError("发送失败")
    }

    const mediaType = info[TlChannelMediaDef.type]
    let message = ""
    if(mediaType == TlChannelMediaType.AUDIO){
        message = "语音通话"
    }else if(mediaType == TlChannelMediaType.VIDEO){
        message = "视频通话"
    }

    return tlResponseSuccess("发送成功", {
        id: info[TlChannelMediaDef.id],
        media: JSON.parse(info[TlChannelMediaDef.media]),
        message: message,
        fromUserName: info[TlChannelMediaDef.fromUserName],
        type: info[TlChannelMediaDef.type],
        status: info[TlChannelMediaDef.status],
        createTime: info[TlChannelMediaDef.createdAt],
        fromUserId: info[TlChannelMediaDef.fromUserId],
        fromUserName: info[TlChannelMediaDef.fromUserName],
        fromUserAvatar: loginUserAvatar,
        hasRead: true,
        messageTimeStamp: info[TlChannelMediaDef.messageTimeStamp],
        messageVersion: info[TlChannelMediaDef.messageVersion],
    })
}

/**
 * 发送好友频道语音通话消息
 * @param {*} loginInfo
 * @param {*} media
 * @param {*} channelId
 */
const addFriendChannelAudio = async function ({
    loginInfo, media, channelId
}) {
    return await addFriendChannelMedia({
        loginInfo, media, type: TlChannelMediaType.AUDIO, channelId
    })
}

/**
 * 发送好友频道视频通话消息
 * @param {*} loginInfo
 * @param {*} media
 * @param {*} channelId
 */
const addFriendChannelVideo = async function ({
    loginInfo, media, channelId
}) {
    return await addFriendChannelMedia({
        loginInfo, media, type: TlChannelMediaType.VIDEO, channelId
    })
}

/**
 * 发送群聊频道媒体流消息
 * @param {*} loginInfo
 * @param {*} media
 * @param {*} type
 * @param {*} other
 * @param {*} channelId
 */
const addGroupChannelMedia = async function ({
    loginInfo, media, type, channelId
}) {
    if (!media) {
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
    } = loginInfo

    // 当前用户是否存在频道
    const channelUserInfo = await channelUserService.getInfoByChannelIdAndUserId({
        companyId: loginUserCompanyId,
        channelId: channelId,
        userId: loginUserId
    })

    if(Object.keys(channelUserInfo).length == 0){
        return tlResponseNotFound("非法操作")
    }

    const info = await channelMediaService.addInfo({
        companyId: loginUserCompanyId,
        channelId,
        flag: 0,
        type: type,
        status: TlChannelMediaStatus.INIT,
        media: JSON.stringify(media),
        fromUserId: loginUserId,
        fromUserName: loginUsername,
        other: JSON.stringify({
            [TlChannelMediaOther.ip]: '',
        }),
        messageTimeStamp: Date.now(),
        messageVersion: 'v1'
    })

    if (Object.keys(info).length == 0) {
        return tlResponseSvrError("发送失败")
    }

    // 更新用户已读消息
    const updateUserReadRes = await userReadBiz.updateChannelMediaRead({
        loginInfo, channelId, 
        latestReadId: info[TlChannelMediaDef.id], 
    })

    if(!updateUserReadRes.success){
        return tlResponseSvrError("发送失败")
    }

    const mediaType = info[TlChannelMediaDef.type]
    let message = ""
    if(mediaType == TlChannelMediaType.AUDIO){
        message = "语音通话"
    }else if(mediaType == TlChannelMediaType.VIDEO){
        message = "视频通话"
    }

    return tlResponseSuccess("发送成功", {
        id: info[TlChannelMediaDef.id],
        media: JSON.parse(info[TlChannelMediaDef.media]),
        message: message,
        fromUserName: info[TlChannelMediaDef.fromUserName],
        type: info[TlChannelMediaDef.type],
        status: info[TlChannelMediaDef.status],
        createTime: info[TlChannelMediaDef.createdAt],
        fromUserId: info[TlChannelMediaDef.fromUserId],
        fromUserName: info[TlChannelMediaDef.fromUserName],
        fromUserAvatar: loginUserAvatar,
        hasRead: true,
        messageTimeStamp: info[TlChannelMediaDef.messageTimeStamp],
        messageVersion: info[TlChannelMediaDef.messageVersion],
    })
}


/**
 * 发送群聊频道语音消息
 * @param {*} loginInfo
 * @param {*} media
 * @param {*} other
 * @param {*} channelId
 */
const addGroupChannelAudio = async function ({
    loginInfo, media, channelId
}) {
    return await addGroupChannelMedia({
        loginInfo, media, type: TlChannelMediaType.AUDIO, channelId
    })
}

/**
 * 发送群聊频道视频消息
 * @param {*} loginInfo
 * @param {*} media
 * @param {*} other
 * @param {*} channelId
 */
const addGroupChannelVideo = async function ({
    loginInfo, media, channelId
}) {
    return await addGroupChannelMedia({
        loginInfo, media, type: TlChannelMediaType.VIDEO, channelId
    })
}


module.exports = {
    addFriendChannelAudio,
    addFriendChannelVideo,
    addGroupChannelAudio,
    addGroupChannelVideo,
}