const { 
    tlResponseArgsError, tlResponseForbidden, tlResponseSvrError, 
    tlResponseTimeout, tlResponseNotFound, tlResponseSuccess
} = require('../../utils/utils')
const userReadService = require('../../service/user/tl_user_read_service')
const userSessionService = require('../../service/user/tl_user_session_service')
const { fields: userReadDef } = require('../../tables/tl_user_read')
const { fields: channelDef } = require('../../tables/tl_channel')

const { Def: TlUserReadDef, Type: TlUserReadType } = userReadDef


/**
 * 更新频道已读记录
 * @param {*} loginInfo
 * @param {*} channelId
 * @param {*} latestReadId
 * @param {*} type 
 */
const updateChannelUserRead = async function({
    loginInfo, channelId, latestReadId, type
}){
    if (!latestReadId) {
        return tlResponseArgsError("请求参数为空")
    }

    if (!channelId) {
        return tlResponseArgsError("请求参数为空")
    }

    if(!type){
        return tlResponseArgsError("请求参数为空")
    }

    const {
        loginUserCompanyId, loginUserId, loginUsername
    } = loginInfo

    const userReadList = await userReadService.getListByChannelUserId({
        companyId: loginUserCompanyId,
        userId: loginUserId,
        channelId
    })

    let chatReadRecord = null
    let mediaReadRecord = null
    let fileReadRecord = null

    userReadList.forEach((userRead) => {
        if (userRead[TlUserReadDef.type] === TlUserReadType.CHAT) {
            chatReadRecord = userRead
        }
        if (userRead[TlUserReadDef.type] === TlUserReadType.MEDIA) {
            mediaReadRecord = userRead
        }
        if (userRead[TlUserReadDef.type] === TlUserReadType.FILE) {
            fileReadRecord = userRead
        }
    })

    // 聊天消息已读记录不存在，新增, 否则更新已读消息最新ID
    if(type === TlUserReadType.CHAT){
        if(!chatReadRecord){
            chatReadRecord = await userReadService.addInfo({
                companyId: loginUserCompanyId,
                userId: loginUserId,
                channelId,
                latestReadId,
                type: TlUserReadType.CHAT
            })

            if(Object.keys(chatReadRecord).length === 0){
                return tlResponseSvrError("更新失败")
            }
        }

        const readId = chatReadRecord[TlUserReadDef.id]
        if(!readId){
            return tlResponseSvrError("更新失败")
        }

        // 更新聊天消息已读记录
        const updateInfo = await userReadService.updateInfoById({
            companyId: loginUserCompanyId,
            id: readId
        }, {
            [TlUserReadDef.latestReadId]: latestReadId
        })

        if(Object.keys(updateInfo).length === 0){
            return tlResponseSvrError("更新失败")
        }
    }

    // 媒体消息已读记录不存在，新增, 否则更新已读消息最新ID
    if(type === TlUserReadType.MEDIA){
        if(!mediaReadRecord){
            mediaReadRecord = await userReadService.addInfo({
                companyId: loginUserCompanyId,
                userId: loginUserId,
                channelId,
                latestReadId,
                type: TlUserReadType.MEDIA
            })

            if(Object.keys(mediaReadRecord).length === 0){
                return tlResponseSvrError("更新失败")
            }
        }

        const readId = mediaReadRecord[TlUserReadDef.id]
        if(!readId){
            return tlResponseSvrError("更新失败")
        }

        // 更新媒体消息已读记录
        const updateInfo = await userReadService.updateInfoById({
            companyId: loginUserCompanyId,
            id: readId
        }, {
            [TlUserReadDef.latestReadId]: latestReadId
        })

        if(Object.keys(updateInfo).length === 0){
            return tlResponseSvrError("更新失败")
        }
    }

    // 文件消息已读记录不存在，新增, 否则更新已读消息最新ID
    if(type === TlUserReadType.FILE){
        if(!fileReadRecord){
            fileReadRecord = await userReadService.addInfo({
                companyId: loginUserCompanyId,
                userId: loginUserId,
                channelId,
                latestReadId,
                type: TlUserReadType.FILE
            })

            if(Object.keys(fileReadRecord).length === 0){
                return tlResponseSvrError("更新失败")
            }
        }

        const readId = fileReadRecord[TlUserReadDef.id]
        if(!readId){
            return tlResponseSvrError("更新失败")
        }

        // 更新文件消息已读记录
        const updateInfo = await userReadService.updateInfoById({
            companyId: loginUserCompanyId,
            id: readId
        }, {
            [TlUserReadDef.latestReadId]: latestReadId
        })

        if(Object.keys(updateInfo).length === 0){
            return tlResponseSvrError("更新失败")
        }
    }

    return tlResponseSuccess("更新成功")
}

/**
 * 更新频道聊天已读记录 (文件/媒体/聊天)
 * @param {*} loginInfo
 * @param {*} channelId
 * @param {*} latestReadId 
 * @param {*} latestMediaReadId
 * @param {*} latestFileReadId
 * @returns 
 */
const updateChannelMuiltRead = async function({
    loginInfo, channelId, latestChatReadId, latestMediaReadId, latestFileReadId
}){
    if(latestChatReadId){
        const chatResult = await updateChannelChatRead({
            loginInfo, channelId, latestReadId: latestChatReadId
        });
    
        if (!chatResult.success) {
            return chatResult
        }
    }

    if(latestMediaReadId){
        const mediaResult = await updateChannelMediaRead({
            loginInfo, channelId, latestReadId: latestMediaReadId
        });
    
        if (!mediaResult.success) {
            return mediaResult
        }
    }
    
    if(latestFileReadId){
        const fileResult = await updateChannelFileRead({
            loginInfo, channelId, latestReadId: latestFileReadId
        });
    
        if (!fileResult.success) {
            return fileResult
        }
    }

    return tlResponseSuccess("更新成功")
}

/**
 * 更新频道聊天消息已读记录
 * @param {*} loginInfo
 * @param {*} channelId
 * @param {*} latestReadId 
 * @returns 
 */
const updateChannelChatRead = async function({
    loginInfo, channelId, latestReadId
}){
    return await updateChannelUserRead({
        loginInfo, channelId, latestReadId, type: TlUserReadType.CHAT
    })
}

/**
 * 更新频道媒体消息已读记录
 * @param {*} loginInfo
 * @param {*} channelId
 * @param {*} latestReadId 
 * @returns 
 */
const updateChannelMediaRead = async function({
    loginInfo, channelId, latestReadId
}){
    return await updateChannelUserRead({
        loginInfo, channelId, latestReadId, type: TlUserReadType.MEDIA
    })
}

/**
 * 更新频道文件消息已读记录
 * @param {*} loginInfo
 * @param {*} channelId
 * @param {*} latestReadId 
 * @returns 
 */
const updateChannelFileRead = async function({
    loginInfo, channelId, latestReadId
}){
    return await updateChannelUserRead({
        loginInfo, channelId, latestReadId, type: TlUserReadType.FILE
    })
}

/**
 * 新增好友申请消息已读记录
 * @param {*} loginInfo
 * @param {*} recordId
 * @param {*} type
 * @returns
 */
const addUserFriendApplyRead = async function({
    loginInfo, recordId
}){
    if (!recordId) {
        return tlResponseArgsError("请求参数为空")
    }

    const {
        loginUserCompanyId, loginUserId, loginUsername
    } = loginInfo

    const addInfo = await userReadService.addInfo({
        companyId: loginUserCompanyId,
        userId: loginUserId,
        recordId,
        type: TlUserReadType.FRIEND_APPLY
    })

    if(Object.keys(addInfo).length === 0){
        return tlResponseSvrError("更新失败")
    }

    return tlResponseSuccess("更新成功")
}

/**
 * 新增好友同意消息已读记录
 * @param {*} loginInfo
 * @param {*} recordId
 * @param {*} type
 * @returns
 */
const addUserFriendApplyPassRead = async function({
    loginInfo, recordId
}){
    if (!recordId) {
        return tlResponseArgsError("请求参数为空")
    }

    const {
        loginUserCompanyId, loginUserId, loginUsername
    } = loginInfo

    const addInfo = await userReadService.addInfo({
        companyId: loginUserCompanyId,
        userId: loginUserId,
        recordId,
        type: TlUserReadType.FRIEND_APPLY_PASS
    })

    if(Object.keys(addInfo).length === 0){
        return tlResponseSvrError("更新失败")
    }

    return tlResponseSuccess("更新成功")
}

/**
 * 新增好友拒绝消息已读记录
 * @param {*} loginInfo
 * @param {*} recordId
 * @param {*} type
 * @returns
 */
const addUserFriendApplyRejectRead = async function({
    loginInfo, recordId
}){
    if (!recordId) {
        return tlResponseArgsError("请求参数为空")
    }

    const {
        loginUserCompanyId, loginUserId, loginUsername
    } = loginInfo

    const addInfo = await userReadService.addInfo({
        companyId: loginUserCompanyId,
        userId: loginUserId,
        recordId,
        type: TlUserReadType.FRIEND_APPLY_REJECT
    })

    if(Object.keys(addInfo).length === 0){
        return tlResponseSvrError("更新失败")
    }

    return tlResponseSuccess("更新成功")
}

module.exports = {
    updateChannelChatRead,
    updateChannelMediaRead,
    updateChannelFileRead,
    updateChannelMuiltRead,

    addUserFriendApplyRead,
    addUserFriendApplyPassRead,
    addUserFriendApplyRejectRead
}