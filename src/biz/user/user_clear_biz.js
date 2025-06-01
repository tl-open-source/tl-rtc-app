const { 
    tlResponseArgsError, tlResponseSvrError, 
    tlResponseNotFound, tlResponseSuccess, checkIsId
} = require('../../utils/utils')
const userClearService = require('../../service/user/tl_user_clear_service')
const channelService = require('../../service/channel/tl_channel_service')
const channelChatService = require('../../service/channel/tl_channel_chat_service')
const channelFileService = require('../../service/channel/tl_channel_file_service')
const channelMediaService = require('../../service/channel/tl_channel_media_service')
const channelUserService = require('../../service/channel/tl_channel_user_service')

const { fields: userClearDef } = require('../../tables/tl_user_clear')

const { Def: TlUserClearDef, Type: TlUserClearType } = userClearDef


/**
 * 更新频道清理记录
 * @param {*} loginInfo
 * @param {*} channelId
 * @param {*} latestClearId
 * @param {*} type 
 */
const updateChannelUserClear = async function({
    loginInfo, channelId, latestClearId, type
}){
    if (latestClearId == null || latestClearId == undefined) {
        return tlResponseArgsError("请求参数错误")
    }

    latestClearId = parseInt(latestClearId)
    if(!checkIsId(latestClearId)){
        return tlResponseArgsError("请求参数错误")
    }

    if (!channelId) {
        return tlResponseArgsError("请求参数错误")
    }

    channelId = parseInt(channelId)
    if(!checkIsId(channelId)){
        return tlResponseArgsError("请求参数错误")
    }

    if(!type){
        return tlResponseArgsError("请求参数错误")
    }

    const {
        loginUserCompanyId, loginUserId, loginUsername
    } = loginInfo

    const userClearList = await userClearService.getListByChannelUserId({
        companyId: loginUserCompanyId,
        userId: loginUserId,
        channelId
    })

    let chatClearRecord = null
    let mediaClearRecord = null
    let fileClearRecord = null

    userClearList.forEach((userClear) => {
        if (userClear[TlUserClearDef.type] === TlUserClearType.CHAT) {
            chatClearRecord = userClear
        }
        if (userClear[TlUserClearDef.type] === TlUserClearType.MEDIA) {
            mediaClearRecord = userClear
        }
        if (userClear[TlUserClearDef.type] === TlUserClearType.FILE) {
            fileClearRecord = userClear
        }
    })

    // 聊天消息清理记录不存在，新增, 否则更新清理消息最新ID
    if(type === TlUserClearType.CHAT){
        if(!chatClearRecord || Object.keys(chatClearRecord).length === 0){
            chatClearRecord = await userClearService.addInfo({
                companyId: loginUserCompanyId,
                userId: loginUserId,
                channelId,
                latestClearId,
                type: TlUserClearType.CHAT
            })

            if(Object.keys(chatClearRecord).length === 0){
                return tlResponseSvrError("更新失败")
            }
        }else{
            const clearId = chatClearRecord[TlUserClearDef.id]
            if(!clearId){
                return tlResponseSvrError("更新失败")
            }
    
            // 更新聊天消息清理记录
            const updateInfo = await userClearService.updateInfoById({
                companyId: loginUserCompanyId,
                id: clearId
            }, {
                [TlUserClearDef.latestClearId]: latestClearId
            })
    
            if(Object.keys(updateInfo).length === 0){
                return tlResponseSvrError("更新失败")
            }
        }
    }

    // 媒体消息清理记录不存在，新增, 否则更新清理消息最新ID
    if(type === TlUserClearType.MEDIA){
        if(!mediaClearRecord || Object.keys(mediaClearRecord).length === 0){
            mediaClearRecord = await userClearService.addInfo({
                companyId: loginUserCompanyId,
                userId: loginUserId,
                channelId,
                latestClearId,
                type: TlUserClearType.MEDIA
            })

            if(Object.keys(mediaClearRecord).length === 0){
                return tlResponseSvrError("更新失败")
            }
        }else{
            const clearId = mediaClearRecord[TlUserClearDef.id]
            if(!clearId){
                return tlResponseSvrError("更新失败")
            }

            // 更新媒体消息清理记录
            const updateInfo = await userClearService.updateInfoById({
                companyId: loginUserCompanyId,
                id: clearId
            }, {
                [TlUserClearDef.latestClearId]: latestClearId
            })

            if(Object.keys(updateInfo).length === 0){
                return tlResponseSvrError("更新失败")
            }
        }
    }

    // 文件消息清理记录不存在，新增, 否则更新清理消息最新ID
    if(type === TlUserClearType.FILE){
        if(!fileClearRecord || Object.keys(fileClearRecord).length === 0){
            fileClearRecord = await userClearService.addInfo({
                companyId: loginUserCompanyId,
                userId: loginUserId,
                channelId,
                latestClearId,
                type: TlUserClearType.FILE
            })

            if(Object.keys(fileClearRecord).length === 0){
                return tlResponseSvrError("更新失败")
            }
        }else{
            const clearId = fileClearRecord[TlUserClearDef.id]
            if(!clearId){
                return tlResponseSvrError("更新失败")
            }

            // 更新文件消息清理记录
            const updateInfo = await userClearService.updateInfoById({
                companyId: loginUserCompanyId,
                id: clearId
            }, {
                [TlUserClearDef.latestClearId]: latestClearId
            })

            if(Object.keys(updateInfo).length === 0){
                return tlResponseSvrError("更新失败")
            }
        }
    }

    return tlResponseSuccess("更新成功")
}

/**
 * 更新频道多类型清理记录 (文件/媒体/聊天)
 * @param {*} loginInfo
 * @param {*} channelId
 * @returns 
 */
const updateChannelMuiltClear = async function({
    loginInfo, channelId
}){
    const { 
        loginUserCompanyId, loginUserId
    } = loginInfo
    
    if(!channelId){
        return tlResponseArgsError("请求参数错误")
    }

    channelId = parseInt(channelId)
    if(!checkIsId(channelId)){
        return tlResponseArgsError("请求参数错误")
    }

    // 频道是否存在
    const channel = await channelService.getInfoById({
        companyId: loginUserCompanyId,
        id: channelId
    })

    if(Object.keys(channel).length === 0){
        return tlResponseNotFound("频道不存在")
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

    // 找到最新的频道聊天id
    const latestChatClearId = await channelChatService.getChannelChatLatestId({
        companyId: loginUserCompanyId,
        channelId
    })

    // 找到最新的频道媒体id
    const latestMediaClearId = await channelMediaService.getChannelMediaLatestId({
        companyId: loginUserCompanyId,
        channelId
    })

    // 找到最新的频道文件id
    const latestFileClearId = await channelFileService.getChannelFileLatestId({
        companyId: loginUserCompanyId,
        channelId
    })

    const chatResult = await updateChannelUserClear({
        loginInfo, channelId, latestClearId: latestChatClearId, type: TlUserClearType.CHAT
    });

    if (!chatResult.success) {
        return chatResult
    }

    const mediaResult = await updateChannelUserClear({
        loginInfo, channelId, latestClearId: latestMediaClearId, type: TlUserClearType.MEDIA
    });

    if (!mediaResult.success) {
        return mediaResult
    }
    
    const fileResult = await updateChannelUserClear({
        loginInfo, channelId, latestClearId: latestFileClearId, type: TlUserClearType.FILE
    });

    if (!fileResult.success) {
        return fileResult
    }

    return tlResponseSuccess("清理成功")
}

/**
 * 更新频道聊天清理记录
 * @param {*} loginInfo
 * @param {*} channelId
 * @returns 
 */
const updateChannelChatClear = async function({
    loginInfo, channelId
}){
    return await updateChannelUserClear({
        loginInfo, channelId, type: TlUserClearType.CHAT
    })
}

/**
 * 更新频道媒体清理记录
 * @param {*} loginInfo
 * @param {*} channelId
 * @returns 
 */
const updateChannelMediaClear = async function({
    loginInfo, channelId
}){
    return await updateChannelUserClear({
        loginInfo, channelId, type: TlUserClearType.MEDIA
    })
}

/**
 * 更新频道文件清理记录
 * @param {*} loginInfo
 * @param {*} channelId
 * @returns 
 */
const updateChannelFileClear = async function({
    loginInfo, channelId
}){
    return await updateChannelUserClear({
        loginInfo, channelId, type: TlUserClearType.FILE
    })
}



module.exports = {
    updateChannelChatClear,
    updateChannelMediaClear,
    updateChannelFileClear,
    updateChannelMuiltClear,
}