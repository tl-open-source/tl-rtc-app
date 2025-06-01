const { 
    tlResponseArgsError, tlResponseForbidden, tlResponseSvrError, 
    tlResponseTimeout, tlResponseNotFound, tlResponseSuccess, checkIsId
} = require('../../utils/utils')
const channelNoticeService = require('../../service/channel/tl_channel_notice_service')
const userService = require('../../service/user/tl_user_service')
const channelUserService = require('../../service/channel/tl_channel_user_service')

const { fields: channelNoticeFields } = require('../../tables/tl_channel_notice')
const { fields: userFields } = require('../../tables/tl_user')

const { 
    Def: TlChannelNoticeDef,
} = channelNoticeFields

const {
    Def: TlUserDef,
} = userFields


/**
 * 发布频道公告
 * @param {*} loginInfo
 * @param {*} channelId
 * @param {*} content 
 * @returns 
 */
const addNotice = async function({
    loginInfo, channelId, content
}){
    if(!channelId) {
        return tlResponseArgsError("请求参数错误")
    }

    channelId = parseInt(channelId)
    if(!checkIsId(channelId)){
        return tlResponseArgsError("请求参数错误")
    }

    if(!content) {
        return tlResponseArgsError("请求参数错误")
    }

    if(content.length > 8096){
        return tlResponseArgsError("内容过长")
    }

    const {
        loginUserCompanyId, loginUserId, loginUsername
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

    const notice = await channelNoticeService.addInfo({
        companyId: loginUserCompanyId,
        channelId,
        userId: loginUserId,
        content: content,
    })

    if(Object.keys(notice).length === 0){
        return tlResponseSvrError("发布失败")
    }

    return tlResponseSuccess("发布成功")
}

/**
 * 获取频道通知记录
 * @param {*} loginInfo
 * @param {*} channelId
 */
const getNoticeList = async function({
    loginInfo, channelId
}){
    if (!channelId) {
        return tlResponseArgsError("请求参数错误")
    }

    channelId = parseInt(channelId)
    if(!checkIsId(channelId)){
        return tlResponseArgsError("请求参数错误")
    }

    const {
        loginUserCompanyId, loginUserId, loginUsername
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
    
    const noticeList = await channelNoticeService.getListByChannelId({
        companyId: loginUserCompanyId,
        channelId,
    }, [
        TlChannelNoticeDef.id,
        TlChannelNoticeDef.userId,
        TlChannelNoticeDef.content,
        TlChannelNoticeDef.createdAt,
    ])

    if(!noticeList){
        return tlResponseSvrError("获取失败")
    }

    // 获取用户名称
    const userIdList = []
    noticeList.forEach(element => {
        userIdList.push(element[TlChannelNoticeDef.userId])
    });

    const userList = await userService.getListByIdList({
        companyId: loginUserCompanyId,
        idList: userIdList,
    }, [
        TlUserDef.id,
        TlUserDef.name,
    ])

    const userMap = {}
    userList.forEach(element => {
        userMap[element[TlUserDef.id]] = element[TlUserDef.name]
    });

    let resultList = []
    noticeList.forEach(element => {
        const username = userMap[element[TlChannelNoticeDef.userId]]
        resultList.push({
            id: element[TlChannelNoticeDef.id],
            username: username,
            content: element[TlChannelNoticeDef.content],
            createTime: element[TlChannelNoticeDef.createdAt],
        })
    });

    return tlResponseSuccess("查询成功", resultList)
}



module.exports = {
    addNotice,
    getNoticeList
}