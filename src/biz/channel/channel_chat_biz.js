const {
    tlResponseArgsError, tlResponseForbidden, tlResponseSvrError,
    tlResponseTimeout, tlResponseNotFound, tlResponseSuccess,
    setBit
} = require('../../utils/utils')
const { getAvatarOssUrl } = require('../../utils/oss/oss')
const channelService = require('../../service/channel/tl_channel_service')
const channelChatService = require('../../service/channel/tl_channel_chat_service')
const channelUserService = require('../../service/channel/tl_channel_user_service')
const userSessionService = require('../../service/user/tl_user_session_service')
const userService = require('../../service/user/tl_user_service')

const userReadBiz = require('../user/user_read_biz')

const { fields: channelChatFields } = require('../../tables/tl_channel_chat')
const { fields: channelUserFields} = require('../../tables/tl_channel_user')
const { fields: userFields } = require('../../tables/tl_user')
const { fields: channelFields } = require('../../tables/tl_channel')

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
    Def: TlUserDef 
} = userFields
const { 
    Def: TlChannelDef, Type: TlChannelType 
} = channelFields



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
        return tlResponseArgsError("请求参数为空")
    }

    if (!channelId) {
        return tlResponseArgsError("请求参数为空")
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
            return tlResponseNotFound("发送失败，好友不存在")
        }

        return tlResponseArgsError("请求参数为空")
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
        return tlResponseArgsError("请求参数为空")
    }

    if (!channelId) {
        return tlResponseArgsError("请求参数为空")
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
 * 撤回群组/好友消息
 * @param {*} loginInfo
 * @param {*} channelId
 * @param {*} messageId
 * @param {*} messageType
 */
const rollbackChannelChat = async function ({
    loginInfo, channelId, messageId, messageType
}) {
    const {
        loginUserCompanyId, loginUserId, loginUsername,
    } = loginInfo

    if (!channelId) {
        return tlResponseArgsError("请求参数为空")
    }

    if (!messageId) {
        return tlResponseArgsError("请求参数为空")
    }

    if (!messageType) {
        return tlResponseArgsError("请求参数为空")
    }
    
    // 频道是否存在
    const channelInfo = await channelService.getInfoById({
        companyId: loginUserCompanyId,
        id: channelId
    })

    if(Object.keys(channelInfo).length == 0){
        return tlResponseNotFound("撤回失败，频道不存在")
    }

    // 消息是否存在
    let messageInfo = {}
    if([
        TlChannelChatType.FRIEND,
        TlChannelChatType.GROUP,

        // 不支持撤回系统消息
        // TlChannelChatType.SYSTEM,
    ].includes(messageType)){
        messageInfo = await channelChatService.getInfoById({
            companyId: loginUserCompanyId,
            id: messageId
        })
        
    }

    if(Object.keys(messageInfo).length == 0){
        return tlResponseNotFound("撤回失败，消息不存在")
    }

    // 不能撤回他人消息
    if(messageInfo[TlChannelChatDef.fromUserId] !== loginUserId){
        return tlResponseForbidden("撤回失败")
    }

    // 时间是否超过2分钟
    const now = Date.now()
    const messageTimeStamp = messageInfo[TlChannelChatDef.messageTimeStamp]
    if(now - messageTimeStamp > 2 * 60 * 1000){
        return tlResponseForbidden("撤回失败，消息已超过2分钟")
    }

    // 删除原有消息
    let deleteRes = 0
    if([
        TlChannelChatType.FRIEND,
        TlChannelChatType.GROUP,
    ].includes(messageType)){
        deleteRes = await channelChatService.deleteInfoById({
            companyId: loginUserCompanyId,
            id: messageId
        })
    }else{
        return tlResponseSvrError("撤回失败")
    }
    
    if(deleteRes == 0){
        return tlResponseSvrError("撤回失败")
    }

    let rollbackMessage = ''
    if([
        TlChannelChatType.FRIEND,
        TlChannelChatType.GROUP,
    ].includes(messageType)){
        rollbackMessage = `${loginUsername}撤回了一条消息`
    }

    // 生成撤回系统消息
    const rollbackInfo = await channelChatService.addSystemChatnfo({
        companyId: loginUserCompanyId,
        channelId,
        message: '<p>' + rollbackMessage + '</p>',
        other: JSON.stringify({
            [TlChannelChatOther.ip]: '',
        }),
        messageTimeStamp: Date.now(),
        messageVersion: 'v1',
        flag: 0
    })

    if(Object.keys(rollbackInfo).length == 0){
        return tlResponseSvrError("撤回失败")
    }

    // 更新用户已读消息
    const updateUserReadRes = await userReadBiz.updateChannelChatRead({
        loginInfo, channelId, 
        latestReadId: rollbackInfo[TlChannelChatDef.id], 
    })

    if(!updateUserReadRes.success){
        return tlResponseSvrError("撤回失败")
    }

    return tlResponseSuccess("撤回成功", {
        id: rollbackInfo[TlChannelChatDef.id],
        message: rollbackInfo[TlChannelChatDef.message],
        type: rollbackInfo[TlChannelChatDef.type],
        createTime: rollbackInfo[TlChannelChatDef.createdAt],
        fromUserId: rollbackInfo[TlChannelChatDef.fromUserId],
        fromUserName: rollbackInfo[TlChannelChatDef.fromUserName],
        hasRead: true,
        messageTimeStamp: rollbackInfo[TlChannelChatDef.messageTimeStamp],
        messageVersion: rollbackInfo[TlChannelChatDef.messageVersion],
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
        return tlResponseArgsError("请求参数为空")
    }

    if (!channelId) {
        return tlResponseArgsError("请求参数为空")
    }

    if (!messageId) {
        return tlResponseArgsError("请求参数为空")
    }

    if (!messageType) {
        return tlResponseArgsError("请求参数为空")
    }

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
        return tlResponseArgsError("请求参数为空")
    }

    if (!channelId) {
        return tlResponseArgsError("请求参数为空")
    }

    if (!messageId) {
        return tlResponseArgsError("请求参数为空")
    }

    if (!messageType) {
        return tlResponseArgsError("请求参数为空")
    }

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

    rollbackChannelChat,
}