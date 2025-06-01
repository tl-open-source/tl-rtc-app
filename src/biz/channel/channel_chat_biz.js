const {
    tlResponseArgsError, tlResponseForbidden, tlResponseSvrError,
    tlResponseNotFound, tlResponseSuccess,
    setBit, checkIsId, sanitizeHTML
} = require('../../utils/utils')
const channelService = require('../../service/channel/tl_channel_service')
const channelChatService = require('../../service/channel/tl_channel_chat_service')
const channelUserService = require('../../service/channel/tl_channel_user_service')
const channelFileService = require('../../service/channel/tl_channel_file_service')
const channelMediaService = require('../../service/channel/tl_channel_media_service')

const userReadBiz = require('../user/user_read_biz')

const { fields: channelChatFields } = require('../../tables/tl_channel_chat')
const { fields: channelUserFields} = require('../../tables/tl_channel_user')
const { fields: channelFields } = require('../../tables/tl_channel')
const { fields: channelFileFields } = require('../../tables/tl_channel_file')
const { fields: channelMediaFields } = require('../../tables/tl_channel_media')

const {
    Def: TlChannelChatDef,
    Type: TlChannelChatType,
    Other: TlChannelChatOther,
    Flag: TlChannelChatFlag
} = channelChatFields
const { 
    Def: TlChannelUserDef 
} = channelUserFields
const { 
    Def: TlChannelDef, Type: TlChannelType 
} = channelFields
const { 
    Type: TlChannelFileType 
} = channelFileFields
const { 
   Type: TlChannelMediaType 
} = channelMediaFields




/**
 * 发送好友频道聊天消息
 * @param {*} loginInfo
 * @param {*} message
 * @param {*} toUserId
 * @param {*} toUserName
 * @param {*} channelId
 * @param {*} atUserId
 * @param {*} atUserName
 */
const addFriendChannelChat = async function ({
    loginInfo, message, toUserId, toUserName, channelId, atUserId, atUserName
}) {
    if (!message) {
        return tlResponseArgsError("请求参数错误")
    }

    if(message.length > 8192){
        return tlResponseArgsError("消息内容过长")
    }

    // 防止xss攻击
    message = sanitizeHTML(message)

    if (!channelId) {
        return tlResponseArgsError("请求参数错误")
    }

    channelId = parseInt(channelId)
    if(!checkIsId(channelId)){
        return tlResponseArgsError("请求参数错误")
    }

    if(toUserId){
        toUserId = parseInt(toUserId)
        if(!checkIsId(toUserId)){
            return tlResponseArgsError("请求参数错误")
        }
    }

    if(atUserId){
        atUserId = parseInt(atUserId)
        if(!checkIsId(atUserId)){
            return tlResponseArgsError("请求参数错误")
        }
    }

    if(toUserName && toUserName.length > 64){
        return tlResponseArgsError("请求参数错误")
    }

    if(atUserName && atUserName.length > 64){
        return tlResponseArgsError("请求参数错误")
    }

    const {
        loginUserCompanyId, loginUserId, loginUsername, loginUserAvatar
    } = loginInfo

    // 频道是否存在
    const channelInfo = await channelService.getInfoById({
        companyId: loginUserCompanyId,
        id: channelId
    })

    if(Object.keys(channelInfo).length == 0){
        return tlResponseNotFound("发送失败，频道不存在")
    }

    const channelType = channelInfo[TlChannelDef.type]
    if(channelType !== TlChannelType.FRIEND){
        return tlResponseArgsError("发送失败，频道类型错误")
    }

    // 当前用户是否存在频道
    const channelUserInfo = await channelUserService.getInfoByChannelIdAndUserId({
        companyId: loginUserCompanyId,
        channelId: channelId,
        userId: loginUserId
    })

    if(Object.keys(channelUserInfo).length == 0){
        return tlResponseNotFound("非法操作")
    }

    // 设置@标志
    let flag = 0
    if (atUserId && atUserName) {
        flag = setBit(flag, TlChannelChatFlag.IS_AT_USER, true)
    }

    let other = {
        [TlChannelChatOther.ip]: '',
    }

    if (atUserId && atUserName) {
        other = {
            ...other,
            [TlChannelChatOther.atUserId]: atUserId,
            [TlChannelChatOther.atUserName]: atUserName,
        }
    }

    // 发送好友消息，如果没有toUserName或toUserId，说明可能已被对方删除
    // 如果没有找到好友，返回错误，如果找到好友，返回参数错误
    if(!toUserName || !toUserId){
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

        return tlResponseArgsError("请求参数错误")
    }

    const info = await channelChatService.addFriendChatInfo({
        companyId: loginUserCompanyId,
        channelId,
        message,
        fromUserId: loginUserId,
        fromUserName: loginUsername,
        toUserId,
        toUserName,
        other: JSON.stringify(other),
        messageTimeStamp: Date.now(),
        messageVersion: 'v1',
        flag
    })

    if (Object.keys(info).length == 0) {
        return tlResponseSvrError("添加好友频道聊天失败")
    }

    // 更新用户已读消息
    const updateUserReadRes = await userReadBiz.updateChannelChatRead({
        loginInfo, channelId, 
        latestReadId: info[TlChannelChatDef.id], 
    })

    if(!updateUserReadRes.success){
        return tlResponseSvrError("发送失败")
    }

    return tlResponseSuccess("发送成功", {
        id: info[TlChannelChatDef.id],
        message: info[TlChannelChatDef.message],
        type: info[TlChannelChatDef.type],
        createTime: info[TlChannelChatDef.createdAt],
        fromUserId: info[TlChannelChatDef.fromUserId],
        fromUserName: info[TlChannelChatDef.fromUserName],
        fromUserAvatar: loginUserAvatar,
        hasRead: true,
        atUserId,
        atUserName,
        messageTimeStamp: info[TlChannelChatDef.messageTimeStamp],
        messageVersion: info[TlChannelChatDef.messageVersion],
    })
}

/**
 * 发送多人频道聊天消息
 * @param {*} loginInfo
 * @param {*} message
 * @param {*} channelId
 * @param {*} atUserId
 * @param {*} atUserName
 * @param {*} atAll
 */
const addGroupChannelChat = async function ({
    loginInfo, message, channelId, atUserId, atUserName, atAll
}) {
    if (!message) {
        return tlResponseArgsError("请求参数错误")
    }

    if(message.length > 8192){
        return tlResponseArgsError("消息内容过长")
    }

    // 防止xss攻击
    message = sanitizeHTML(message)

    if (!channelId) {
        return tlResponseArgsError("请求参数错误")
    }

    channelId = parseInt(channelId)
    if(!checkIsId(channelId)){
        return tlResponseArgsError("请求参数错误")
    }

    if(atUserId){
        atUserId = parseInt(atUserId)
        if(!checkIsId(atUserId)){
            return tlResponseArgsError("请求参数错误")
        }
    }

    if(atUserName && atUserName.length > 64){
        return tlResponseArgsError("请求参数错误")
    }

    const {
        loginUserCompanyId, loginUserId, loginUsername,
        loginUserAvatar
    } = loginInfo

    // 频道是否存在
    const channelInfo = await channelService.getInfoById({
        companyId: loginUserCompanyId,
        id: channelId
    })
    if(Object.keys(channelInfo).length == 0){
        return tlResponseNotFound("发送失败，频道不存在")
    }

    const channelType = channelInfo[TlChannelDef.type]
    if(channelType !== TlChannelType.GROUP){
        return tlResponseArgsError("发送失败，频道类型错误")
    }

    // 当前用户是否存在频道
    const channelUserInfo = await channelUserService.getInfoByChannelIdAndUserId({
        companyId: loginUserCompanyId,
        channelId: channelId,
        userId: loginUserId
    })

    if(Object.keys(channelUserInfo).length == 0){
        return tlResponseNotFound("非法操作")
    }

    // 设置@标志
    let flag = 0
    if (atUserId && atUserName) {
        flag = setBit(flag, TlChannelChatFlag.IS_AT_USER, true)
    }else if (atAll) {
        flag = setBit(flag, TlChannelChatFlag.IS_AT_ALL, true)
    }

    let other = {
        [TlChannelChatOther.ip]: '',
    }

    if (atUserId && atUserName) {
        other = {
            ...other,
            [TlChannelChatOther.atUserId]: atUserId,
            [TlChannelChatOther.atUserName]: atUserName,
        }
    }

    const info = await channelChatService.addGroupChatInfo({
        companyId: loginUserCompanyId,
        channelId,
        message,
        fromUserId: loginUserId,
        fromUserName: loginUsername,
        other: JSON.stringify(other),
        messageTimeStamp: Date.now(),
        messageVersion: 'v1',
        flag
    })

    if (Object.keys(info).length == 0) {
        return tlResponseSvrError("添加群组聊天失败")
    }

    // 更新用户已读消息
    const updateUserReadRes = await userReadBiz.updateChannelChatRead({
        loginInfo, channelId, 
        latestReadId: info[TlChannelChatDef.id], 
    })

    if(!updateUserReadRes.success){
        return tlResponseSvrError("发送失败")
    }

    return tlResponseSuccess("发送成功", {
        id: info[TlChannelChatDef.id],
        message: info[TlChannelChatDef.message],
        type: info[TlChannelChatDef.type],
        createTime: info[TlChannelChatDef.createdAt],
        fromUserId: info[TlChannelChatDef.fromUserId],
        fromUserName: info[TlChannelChatDef.fromUserName],
        fromUserAvatar: loginUserAvatar,
        hasRead: true,
        atUserId,
        atUserName,
        isAtAll: atAll,
        messageTimeStamp: info[TlChannelChatDef.messageTimeStamp],
        messageVersion: info[TlChannelChatDef.messageVersion],
    })
}

/**
 * 回复好友聊天
 * @param {*} loginInfo
 * @param {*} message
 * @param {*} channelId
 * @param {*} messageId
 * @param {*} atUserId
 * @param {*} atUserName
 * @param {*} messageType
 */
const addReplyFriendChannelChat = async function ({
    loginInfo, message, channelId, messageId, messageType, atUserId, atUserName
}) {
    const {
        loginUserCompanyId, loginUserId, loginUsername, loginUserAvatar
    } = loginInfo

    if (!message) {
        return tlResponseArgsError("请求参数错误")
    }

    if(message.length > 8192){
        return tlResponseArgsError("消息内容过长")
    }

    // 防止xss攻击
    message = sanitizeHTML(message)

    if (!channelId) {
        return tlResponseArgsError("请求参数错误")
    }

    channelId = parseInt(channelId)
    if(!checkIsId(channelId)){
        return tlResponseArgsError("请求参数错误")
    }

    if (!messageId) {
        return tlResponseArgsError("请求参数错误")
    }

    messageId = parseInt(messageId)
    if(!checkIsId(messageId)){
        return tlResponseArgsError("请求参数错误")
    }

    if (!messageType) {
        return tlResponseArgsError("请求参数错误")
    }

    if(atUserId){
        atUserId = parseInt(atUserId)
        if(!checkIsId(atUserId)){
            return tlResponseArgsError("请求参数错误")
        }
    }

    if(atUserName && atUserName.length > 64){
        return tlResponseArgsError("请求参数错误")
    }

    // 频道是否存在
    const channelInfo = await channelService.getInfoById({
        companyId: loginUserCompanyId,
        id: channelId
    })
    if(Object.keys(channelInfo).length == 0){
        return tlResponseNotFound("发送失败，频道不存在")
    }

    // 当前用户是否存在频道
    const channelUserInfo = await channelUserService.getInfoByChannelIdAndUserId({
        companyId: loginUserCompanyId,
        channelId: channelId,
        userId: loginUserId
    })

    if(Object.keys(channelUserInfo).length == 0){
        return tlResponseNotFound("非法操作")
    }

    const channelType = channelInfo[TlChannelDef.type]
    if(channelType !== TlChannelType.FRIEND){
        return tlResponseArgsError("发送失败，频道类型错误")
    }
    
    // 消息是否存在
    let messageInfo = {}
    if([
        TlChannelChatType.FRIEND,
        TlChannelChatType.GROUP,

        // 不支持回复系统消息
        // TlChannelChatType.SYSTEM,
    ].includes(messageType)){
        messageInfo = await channelChatService.getInfoById({
            companyId: loginUserCompanyId,
            id: messageId
        })
        
    }else if([
        TlChannelFileType.OFFLINE,
        TlChannelFileType.P2P,
    ].includes(messageType)){
        messageInfo = await channelFileService.getInfoById({
            companyId: loginUserCompanyId,
            id: messageId
        })
    }else if([
        TlChannelMediaType.AUDIO,
        TlChannelMediaType.VIDEO,
    ].includes(messageType)){
        messageInfo = await channelMediaService.getInfoById({
            companyId: loginUserCompanyId,
            id: messageId
        })
    }
    if(Object.keys(messageInfo).length == 0){
        return tlResponseNotFound("发送失败，回复消息不存在")
    }

    // 设置回复标志
    let flag = setBit(0, TlChannelChatFlag.IS_REPLAY, true)

    if (atUserId && atUserName) {
        flag = setBit(flag, TlChannelChatFlag.IS_AT_USER, true)
    }

    let other = {
        [TlChannelChatOther.ip]: '',
        [TlChannelChatOther.replyToMessageId]: messageId,
        [TlChannelChatOther.replyToMessageType]: messageType,
    }

    if (atUserId && atUserName) {
        other = {
            ...other,
            [TlChannelChatOther.atUserId]: atUserId,
            [TlChannelChatOther.atUserName]: atUserName,
        }
    }

    const info = await channelChatService.addFriendChatInfo({
        companyId: loginUserCompanyId,
        channelId,
        message,
        fromUserId: loginUserId,
        fromUserName: loginUsername,
        toUserId: messageInfo[TlChannelChatDef.fromUserId],
        toUserName: messageInfo[TlChannelChatDef.fromUserName],
        other: JSON.stringify(other),
        messageTimeStamp: Date.now(),
        messageVersion: 'v1',
        flag
    })

    if(Object.keys(info).length == 0){
        return tlResponseSvrError("回复失败")
    }
    
    // 更新用户已读消息
    const updateUserReadRes = await userReadBiz.updateChannelChatRead({
        loginInfo, channelId, 
        latestReadId: info[TlChannelChatDef.id], 
    })

    if(!updateUserReadRes.success){
        return tlResponseSvrError("回复失败")
    }

    let replyToMessageContent = ''
    if([
        TlChannelChatType.FRIEND,
        TlChannelChatType.GROUP,
    ].includes(messageType)){
        replyToMessageContent = messageInfo[TlChannelChatDef.message]
    }else if([
        TlChannelFileType.OFFLINE,
        TlChannelFileType.P2P,
    ].includes(messageType)){
        if(messageType == TlChannelFileType.P2P){
            replyToMessageContent = "在线文件"
        }else if(messageType == TlChannelFileType.OFFLINE){
            replyToMessageContent = "离线文件"
        }else{
            replyToMessageContent = "未知文件消息"
        }
    }else if([
        TlChannelMediaType.VIDEO,
        TlChannelMediaType.AUDIO,
    ].includes(messageType)){
        if(messageType == TlChannelMediaType.VIDEO){
            replyToMessageContent = "视频通话"
        }else if(messageType == TlChannelMediaType.AUDIO){
            replyToMessageContent = "语音通话"
        }else{
            replyToMessageContent = "未知音视频消息"
        }
    }else{
        replyToMessageContent = '未知消息'
    }

    return tlResponseSuccess("回复成功", {
        id: info[TlChannelChatDef.id],
        message: info[TlChannelChatDef.message],
        type: info[TlChannelChatDef.type],
        createTime: info[TlChannelChatDef.createdAt],
        fromUserId: info[TlChannelChatDef.fromUserId],
        fromUserName: info[TlChannelChatDef.fromUserName],
        fromUserAvatar: loginUserAvatar,
        toUserId: messageInfo[TlChannelChatDef.fromUserId],
        toUserName: messageInfo[TlChannelChatDef.fromUserName],
        hasRead: true,
        replyToMessageId: messageId,
        replyToMessageType: messageType,
        replyToMessageContent,
        atUserId,
        atUserName,
        messageTimeStamp: info[TlChannelChatDef.messageTimeStamp],
        messageVersion: info[TlChannelChatDef.messageVersion],
    })
}

/**
 * 回复群组聊天
 * @param {*} loginInfo
 * @param {*} message
 * @param {*} channelId
 * @param {*} messageId
 * @param {*} atUserId
 * @param {*} atUserName
 * @param {*} atAll
 * @param {*} messageType
 */
const addReplyGroupChannelChat = async function ({
    loginInfo, message, channelId, messageId, messageType, atUserId, atUserName, atAll
}) {
    const {
        loginUserCompanyId, loginUserId, loginUsername, loginUserAvatar
    } = loginInfo

    if (!message) {
        return tlResponseArgsError("请求参数错误")
    }

    if(message.length > 8192){
        return tlResponseArgsError("消息内容过长")
    }

    // 防止xss攻击
    message = sanitizeHTML(message)

    if (!channelId) {
        return tlResponseArgsError("请求参数错误")
    }

    channelId = parseInt(channelId)
    if(!checkIsId(channelId)){
        return tlResponseArgsError("请求参数错误")
    }

    if (!messageId) {
        return tlResponseArgsError("请求参数错误")
    }

    messageId = parseInt(messageId)
    if(!checkIsId(messageId)){
        return tlResponseArgsError("请求参数错误")
    }

    if (!messageType) {
        return tlResponseArgsError("请求参数错误")
    }

    if(atUserId){
        atUserId = parseInt(atUserId)
        if(!checkIsId(atUserId)){
            return tlResponseArgsError("请求参数错误")
        }
    }

    if(atUserName && atUserName.length > 64){
        return tlResponseArgsError("请求参数错误")
    }

    // 频道是否存在
    const channelInfo = await channelService.getInfoById({
        companyId: loginUserCompanyId,
        id: channelId
    })

    if(Object.keys(channelInfo).length == 0){
        return tlResponseNotFound("发送失败，频道不存在")
    }

    // 当前用户是否存在频道
    const channelUserInfo = await channelUserService.getInfoByChannelIdAndUserId({
        companyId: loginUserCompanyId,
        channelId: channelId,
        userId: loginUserId
    })

    if(Object.keys(channelUserInfo).length == 0){
        return tlResponseNotFound("非法操作")
    }
    
    const channelType = channelInfo[TlChannelDef.type]
    if(channelType !== TlChannelType.GROUP){
        return tlResponseArgsError("发送失败，频道类型错误")
    }

    // 消息是否存在 
    let messageInfo = {}
    if([
        TlChannelChatType.FRIEND,
        TlChannelChatType.GROUP,

        // 不支持回复系统消息
        // TlChannelChatType.SYSTEM,
    ].includes(messageType)){
        messageInfo = await channelChatService.getInfoById({
            companyId: loginUserCompanyId,
            id: messageId
        })
    }else if([
        TlChannelFileType.OFFLINE,
        TlChannelFileType.P2P,
    ].includes(messageType)){
        messageInfo = await channelFileService.getInfoById({
            companyId: loginUserCompanyId,
            id: messageId
        })
    }else if([
        TlChannelMediaType.AUDIO,
        TlChannelMediaType.VIDEO,
    ].includes(messageType)){
        messageInfo = await channelMediaService.getInfoById({
            companyId: loginUserCompanyId,
            id: messageId
        })
    }

    if(Object.keys(messageInfo).length == 0){
        return tlResponseNotFound("发送失败，回复消息不存在")
    }

    // 设置回复标志
    let flag = setBit(0, TlChannelChatFlag.IS_REPLAY, true)

    if (atUserId && atUserName) {
        flag = setBit(flag, TlChannelChatFlag.IS_AT_USER, true)
    }else if (atAll) {
        flag = setBit(flag, TlChannelChatFlag.IS_AT_ALL, true)
    }

    let other = {
        [TlChannelChatOther.ip]: '',
        [TlChannelChatOther.replyToMessageId]: messageId,
        [TlChannelChatOther.replyToMessageType]: messageType,
    }

    if (atUserId && atUserName) {
        other = {
            ...other,
            [TlChannelChatOther.atUserId]: atUserId,
            [TlChannelChatOther.atUserName]: atUserName,
        }
    }

    const info = await channelChatService.addGroupChatInfo({
        companyId: loginUserCompanyId,
        channelId,
        message,
        fromUserId: loginUserId,
        fromUserName: loginUsername,
        toUserId: messageInfo[TlChannelChatDef.fromUserId],
        toUserName: messageInfo[TlChannelChatDef.fromUserName],
        other: JSON.stringify(other),
        messageTimeStamp: Date.now(),
        messageVersion: 'v1',
        flag
    })

    if(Object.keys(info).length == 0){
        return tlResponseSvrError("回复失败")
    }

    // 更新用户已读消息
    const updateUserReadRes = await userReadBiz.updateChannelChatRead({
        loginInfo, channelId, 
        latestReadId: info[TlChannelChatDef.id], 
    })

    if(!updateUserReadRes.success){
        return tlResponseSvrError("回复失败")
    }

    let replyToMessageContent = ''
    if([
        TlChannelChatType.FRIEND,
        TlChannelChatType.GROUP,
    ].includes(messageType)){
        replyToMessageContent = messageInfo[TlChannelChatDef.message]
    }else if([
        TlChannelFileType.OFFLINE,
        TlChannelFileType.P2P,
    ].includes(messageType)){
        if(messageType == TlChannelFileType.P2P){
            replyToMessageContent = "在线文件"
        }else if(messageType == TlChannelFileType.OFFLINE){
            replyToMessageContent = "离线文件"
        }else{
            replyToMessageContent = "未知文件消息"
        }
    }else if([
        TlChannelMediaType.VIDEO,
        TlChannelMediaType.AUDIO,
    ].includes(messageType)){
        if(messageType == TlChannelMediaType.VIDEO){
            replyToMessageContent = "视频通话"
        }else if(messageType == TlChannelMediaType.AUDIO){
            replyToMessageContent = "语音通话"
        }else{
            replyToMessageContent = "未知音视频消息"
        }
    }else{
        replyToMessageContent = '未知消息'
    }

    return tlResponseSuccess("回复成功", {
        id: info[TlChannelChatDef.id],
        message: info[TlChannelChatDef.message],
        type: info[TlChannelChatDef.type],
        createTime: info[TlChannelChatDef.createdAt],
        fromUserId: info[TlChannelChatDef.fromUserId],
        fromUserName: info[TlChannelChatDef.fromUserName],
        fromUserAvatar: loginUserAvatar,
        toUserId: messageInfo[TlChannelChatDef.fromUserId],
        toUserName: messageInfo[TlChannelChatDef.fromUserName],
        hasRead: true,
        replyToMessageId: messageId,
        replyToMessageType: messageType,
        replyToMessageContent,
        atUserId,
        atUserName,
        isAtAll: atAll,
        messageTimeStamp: info[TlChannelChatDef.messageTimeStamp],
        messageVersion: info[TlChannelChatDef.messageVersion],
    })
}


module.exports = {
    addFriendChannelChat, 
    addGroupChannelChat,

    addReplyFriendChannelChat,
    addReplyGroupChannelChat,
}