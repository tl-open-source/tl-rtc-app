const { 
    tlResponseArgsError, tlResponseForbidden, tlResponseSvrError, 
    tlResponseNotFound, tlResponseSuccess,
    tlConsoleError, setBit, checkBit, checkIsId
} = require('../../utils/utils')
const { 
    getOssUrl, getAvatarOssUrl
} = require('../../utils/oss/oss')
const channelService = require('../../service/channel/tl_channel_service')
const channelChatService = require('../../service/channel/tl_channel_chat_service')
const channelUserService = require('../../service/channel/tl_channel_user_service')
const cloudFileService = require('../../service/cloud/tl_cloud_file_service')
const userSessionService = require('../../service/user/tl_user_session_service')
const userReadService = require('../../service/user/tl_user_read_service')
const userService = require('../../service/user/tl_user_service')
const userFriendService = require('../../service/user/tl_user_friend_service')
const userClearService = require('../../service/user/tl_user_clear_service')
const companyService = require('../../service/company/tl_company_service')
const channelMessageService = require('../../service/channel/tl_channel_message_service')

const { fields: channelChatFields } = require('../../tables/tl_channel_chat')
const { fields: channelMediaFields } = require('../../tables/tl_channel_media')
const { fields: channelFileFields } = require('../../tables/tl_channel_file')
const { fields: cloudFileFields } = require('../../tables/tl_cloud_file')
const { fields: channelUserFields} = require('../../tables/tl_channel_user')
const { fields: userReadFields } = require('../../tables/tl_user_read')
const { fields: channelFields } = require('../../tables/tl_channel')
const { fields: userFields } = require('../../tables/tl_user')
const { fields: userFriendFields } = require('../../tables/tl_user_friend')
const { inner: TlRoleInner } = require('../../tables/tl_role')
const { fields: userClearFields } = require('../../tables/tl_user_clear')
const { fields: companyFields } = require('../../tables/tl_company')

const { 
    Def: TlChannelDef, Type: TlChannelType, 
    Status: TlChannelStatus, Flag: TlChannelFlag
} = channelFields
const { 
    Def: TlChannelUserDef, Type: TlChannelUserType, 
    Flag: TlChannelUserFlag, Status: TlChannelUserStatus
} = channelUserFields
const { 
    Def: TlUserDef 
} = userFields
const { 
    Def: TlChannelChatDef, Type: TlChannelChatType, 
    Other: TlChannelChatOther, Flag: TlChannelChatFlag 
} = channelChatFields
const { 
    Def: TlChannelMediaDef, Type: TlChannelMediaType, 
    Other: TlChannelMediaOther, Flag: TlChannelMediaFlag 
} = channelMediaFields
const { 
    Def: TlChannelFileDef, Type: TlChannelFileType, 
    Status: TlChannelFileStatus, Other: TlChannelFileOther, 
    Flag: TlChannelFileFlag 
} = channelFileFields
const { 
    Def: TlCloudFileDef,
} = cloudFileFields
const { 
    Def: TlUserReadDef, Type: TlUserReadType 
} = userReadFields
const { 
    Def: TlUserFriendDef 
} = userFriendFields
const { 
    Def: TlUserClearDef, Type: TlUserClearType 
} = userClearFields
const {
    Def: TlCompanyDef
} = companyFields


/**
 * 根据频道id搜索频道
 * @param {*} channelId
 * @param {*} shareUserId
 * @param {*} loginInfo 
 * @returns 
 */
const searchChannelById = async function({channelId, shareUserId, loginInfo}){
    if(!channelId){
        return tlResponseArgsError("请求参数错误")
    }

    channelId = parseInt(channelId)

    if(!checkIsId(channelId)){
        return tlResponseArgsError("请求参数错误")
    }

    if(shareUserId){
        shareUserId = parseInt(shareUserId)
        if(!checkIsId(shareUserId)){
            return tlResponseArgsError("请求参数错误")
        }
    }

    const {
        loginUserCompanyId, loginUserId, loginUserCompanyName
    } = loginInfo

    const channelInfo = await channelService.getInfoById({
        companyId: loginUserCompanyId, 
        id: channelId
    })

    if(Object.keys(channelInfo).length == 0){
        return tlResponseNotFound("频道不存在")
    }

    const channelType = channelInfo[TlChannelDef.type]
    if(channelType !== TlChannelType.GROUP){
        return tlResponseSuccess("获取失败，频道不存在")
    }

    const channelAvatar = "/image/group-default-avatar.png"

    // 获取频道用户数量
    const channelUserCount = await channelUserService.getCountByChannelId({
        companyId: loginUserCompanyId, channelId: channelId
    })

    // 获取频道用户信息
    const channelUserInfo = await channelUserService.getInfoByChannelIdAndUserId({
        companyId: loginUserCompanyId, channelId, userId: loginUserId
    }, [
        TlChannelUserDef.id
    ])

    let isChannelUser = false
    if(Object.keys(channelUserInfo).length > 0){
        isChannelUser = true
    }

    // 如果不是频道用户，且频道不允许被搜索，返回频道不存在
    const channelFlag = channelInfo[TlChannelDef.flag]
    const groupCanBeSearch = checkBit(channelFlag, TlChannelFlag.GROUP_CAN_BE_SEARCH)
    if(!isChannelUser && !groupCanBeSearch){
        return tlResponseForbidden("频道不存在")
    }

    return tlResponseSuccess("获取成功", {
        channelId: channelId,
        channelName: channelInfo[TlChannelDef.name],
        channelAvatar: channelAvatar,
        channelUserCount: channelUserCount,
        channelType: 'group',
        isChannelUser: isChannelUser,
        shareUserId: shareUserId,
        companyName: loginUserCompanyName
    })
}


/**
 * 添加群聊频道
 * @param {*} channelName
 * @param {*} loginInfo
 */
const addChannel = async function({channelName, loginInfo}){
    if(!channelName){
        return tlResponseArgsError("请求参数错误")
    }

    channelName = channelName.trim()
    if(!channelName){
        return tlResponseArgsError("请求参数错误")
    }

    if(channelName.length > 64){
        return tlResponseArgsError("频道名称长度不能超过64个字符")
    }

    const {
        loginUserCompanyId, loginUserId, loginUsername
    } = loginInfo

    const channelInfo = await channelService.addInfo({
        companyId: loginUserCompanyId,
        name: channelName,
        type: TlChannelType.GROUP,
    })

    if(Object.keys(channelInfo).length === 0){
        return tlResponseSvrError("添加频道失败")
    }

    // 添加频道用户信息
    const channelUserInfo = await channelUserService.addInfo({
        companyId: loginUserCompanyId,
        channelId: channelInfo[TlChannelDef.id],
        type: TlChannelUserType.GROUP,
        userId: loginUserId,
        roleId : TlRoleInner.channel.creator.id,
    })

    if(!channelUserInfo){
        return tlResponseSvrError("添加频道失败")
    }

    // 更新用户频道角色
    await userSessionService.updateUserChannelRoleMap({
        userId: loginUserId,
        channelRoleMap: {
            [channelInfo[TlChannelDef.id]]: TlRoleInner.channel.creator.id,
        }
    })

    // 生成一条系统消息
    const channelChatSystemInfo = await channelChatService.addSystemChatnfo({
        companyId: loginUserCompanyId,
        channelId: channelInfo[TlChannelDef.id],
        message: '<p>' + `${loginUsername}创建了群聊${channelName}` + '</p>',
        other: JSON.stringify({
            [TlChannelChatOther.ip]: '',
        }),
        messageTimeStamp: Date.now(),
        messageVersion: 'v1',
        flag: 0
    })

    if(Object.keys(channelChatSystemInfo).length == 0){
        return tlConsoleError("添加新频道, 生成系统消息失败")
    }

    return tlResponseSuccess("创建成功", {
        channelId: channelInfo[TlChannelDef.id]
    })
}


/**
 * 获取频道列表
 * @param {*} loginInfo
 */
const getChannelList = async function({loginInfo}){
    const {
        loginUserCompanyId, loginUserId
    } = loginInfo

    // 获取自己相关的频道列表
    const channelUserList = await channelUserService.getListByUserId({
        companyId: loginUserCompanyId, 
        userId: loginUserId
    }, [
        TlChannelUserDef.channelId
    ])

    const channelIdList = channelUserList.map(channelUser => channelUser[TlChannelUserDef.channelId])

    resultList = await initChannelListInfo({
        channelIdList, loginUserCompanyId, loginUserId
    })

    return tlResponseSuccess("获取成功", resultList)
}


/**
 * 获取单个频道信息
 * @param {*} loginInfo
 * @param {*} channelId
 */
const getChannelInfo = async function({loginInfo, channelId}){
    if(!channelId){
        return tlResponseArgsError("请求参数错误")
    }

    channelId = parseInt(channelId)
    if(!checkIsId(channelId)){
        return tlResponseArgsError("请求参数错误")
    }

    const {
        loginUserCompanyId, loginUserId
    } = loginInfo

    const channelIdList = [channelId]

    // 当前用户是否存在频道
    const channelUserInfo = await channelUserService.getInfoByChannelIdAndUserId({
        companyId: loginUserCompanyId,
        channelId: channelId,
        userId: loginUserId
    })

    if(Object.keys(channelUserInfo).length == 0){
        return tlResponseNotFound("非法操作")
    }

    resultList = await initChannelListInfo({
        channelIdList, loginUserCompanyId, loginUserId
    })

    if(resultList.length == 0){
        return tlResponseNotFound("频道不存在")
    }

    return tlResponseSuccess("获取成功", resultList[0])
}


/**
 * 获取频道列表信息，获取单个频道信息的公共初始化流程
 * @param {*} channelIdList 
 * @param {*} loginUserCompanyId
 * @param {*} loginUserId
 * @returns 
 */
const initChannelListInfo = async function({
    channelIdList, loginUserCompanyId, loginUserId
}){
    if(!channelIdList){
        return []
    }

    if(!loginUserId){
        return []
    }

    if(channelIdList.length == 0){
        return []
    }

    // 获取频道列表
    const channelList = await channelService.getListByIdList({
        companyId: loginUserCompanyId,
        idList: channelIdList
    })

    // 获取频道用户数量
    const channelUserCounts = await channelUserService.getCountByChannelIdList({
        companyId: loginUserCompanyId, channelIdList
    })
    const channelUserCountsMap = {}
    channelUserCounts.forEach(item => {
        channelUserCountsMap[item[TlChannelUserDef.channelId]] = item.count
    })

    // 获取当前用户在频道的数据
    const channelUserInfoList = await channelUserService.getListByUserId({
        companyId: loginUserCompanyId,
        userId: loginUserId
    }, [
        TlChannelUserDef.channelId,
        TlChannelUserDef.flag,
        TlChannelUserDef.roleId,
    ])

    const channelUserInfoMap = {}
    channelUserInfoList.forEach(item => {
        channelUserInfoMap[item[TlChannelUserDef.channelId]] = item
    })

    //获取频道消息数量
    const channelChatCounts = await channelChatService.getCountByChannelIdList({
        companyId: loginUserCompanyId, channelIdList
    })
    const channelChatCountsMap = {}
    channelChatCounts.forEach(item => {
        channelChatCountsMap[item[TlChannelChatDef.channelId]] = item.count
    })

    // 获取好友频道用户列表，用于替换好友频道的频道名称为好友名称
    const friendChannelList = channelList.filter(channel => channel[TlChannelDef.type] === TlChannelType.FRIEND)
    const friendChannelIdList = friendChannelList.map(channel => channel[TlChannelDef.id])
    // 构建好友频道用户映射
    const channelUserFriendMap = await initFriendChannelListName({
        channelIdList: friendChannelIdList, loginUserCompanyId, loginUserId
    })

    let resultList = []
    for (let i = 0; i < channelList.length; i++) {
        const channel = channelList[i]

        const channelId = channel[TlChannelDef.id]
        const flag = channel[TlChannelDef.flag]
        const channelUserInfo = channelUserInfoMap[channelId] || {}
        const channelUserFlag = channelUserInfo[TlChannelUserDef.flag] || 0
        const channelUserRole = channelUserInfo[TlChannelUserDef.roleId] || 0
        const groupCanBeSearch = checkBit(flag, TlChannelFlag.GROUP_CAN_BE_SEARCH)

        const channelType = channel[TlChannelDef.type]
        let channelTypeStr = TlChannelType.toStr(channelType)

        // 如果是好友频道，替换频道名称,头像为好友名称
        const friendInfo = channelUserFriendMap[channelId] || {
            [TlUserDef.name]: "好友频道",
            [TlUserDef.avatarUrl]: "",
            [TlUserFriendDef.rename]: "好友频道"
        }

        let channelName = channel[TlChannelDef.name]
        if(channelType === TlChannelType.FRIEND){
            channelName = friendInfo[TlUserDef.name]
        }

        // 如果有备注，显示备注
        const channelReName = friendInfo[TlUserFriendDef.rename] 

        let channelAvatar = '/image/friend-default-avatar.png'
        if(channelType === TlChannelType.GROUP){
            channelAvatar = "/image/group-default-avatar.png"
        }else if(channelType === TlChannelType.FRIEND){
            channelAvatar = await getAvatarOssUrl(friendInfo[TlUserDef.avatarUrl])
        }

        resultList.push({
            channelId: channelId,
            channelName: channelName,
            channelReName: channelReName,
            channelType: channelTypeStr,
            channelAvatar: channelAvatar,
            channelUserCount: channelUserCountsMap[channelId] || 0,
            channelChatCount: channelChatCountsMap[channelId] || 0,
            channelChatUnReadCount: 0,
            channelTop: checkBit(channelUserFlag, TlChannelUserFlag.IS_SET_TOP),
            channelBlack: checkBit(channelUserFlag, TlChannelUserFlag.IS_SET_BLACK),
            channelMessageAllLoad: false,
            channelRole: channelUserRole,
            channelGroupCanBeSearch: groupCanBeSearch,
            createTime: channel[TlChannelDef.createdAt],
            extra: {}
        })
    }

    resultList = resultList.reverse()

    return resultList
}


/**
 * 初始化好友频道列表名称
 * @param {*} channelIdList 
 * @param {*} loginUserCompanyId
 * @param {*} loginUserId
 */
const initFriendChannelListName = async function({
    channelIdList, loginUserCompanyId, loginUserId
}){
    if(!channelIdList){
        return {}
    }

    if(!loginUserId){
        return {}
    }

    if(channelIdList.length == 0){
        return {}
    }

    // 获取好友频道用户列表，用于替换好友频道的频道名称为好友名称
    let channelUserFriendList = await channelUserService.getListByChannelIdList({
        companyId: loginUserCompanyId,
        channelIdList: channelIdList
    }, [
        TlChannelUserDef.channelId,
        TlChannelUserDef.userId
    ])
    channelUserFriendList = channelUserFriendList.filter(item => item[TlChannelUserDef.userId] != loginUserId)

    // 查询用户信息
    const userFriendMap = {}
    const userFriendIdList = channelUserFriendList.map(item => {
        if(item[TlChannelUserDef.userId] == loginUserId){
            return
        }
        return item[TlChannelUserDef.userId]
    })
    const userFriendList = await userService.getListByIdList({
        companyId: loginUserCompanyId,
        idList: userFriendIdList
    }, [
        TlUserDef.id,
        TlUserDef.name,
        TlUserDef.avatarUrl
    ])
    userFriendList.forEach(user => {
        userFriendMap[user[TlUserDef.id]] = user
    })

    // 查询好友备注
    const userFriendRenameMap = {}
    const userFriendRenameList = await userFriendService.getListByUserIdAndFriendIdList({
        companyId: loginUserCompanyId,
        userId: loginUserId,
        friendIdList: userFriendIdList
    }, [
        TlUserFriendDef.friendId,
        TlUserFriendDef.rename
    ])
    userFriendRenameList.forEach(item => {
        const friendId = item[TlUserFriendDef.friendId]
        userFriendRenameMap[friendId] = item[TlUserFriendDef.rename]
    })

    // 构建好友频道用户映射
    let channelUserFriendMap = {}
    channelUserFriendList.forEach(channelUser => {
        const channelUserId = channelUser[TlChannelUserDef.userId]
        const channelId = channelUser[TlChannelUserDef.channelId]
        // 用户信息
        let userFriendInfo = userFriendMap[channelUserId] || {}
        // 好友备注
        const rename = userFriendRenameMap[channelUserId] || ""
        channelUserFriendMap[channelId] = {
            [TlUserDef.id]: userFriendInfo[TlUserDef.id],
            [TlUserDef.name]: userFriendInfo[TlUserDef.name],
            [TlUserDef.avatarUrl]: userFriendInfo[TlUserDef.avatarUrl],
            [TlUserFriendDef.rename]: rename
        }
    })

    return channelUserFriendMap
}


/**
 * 修改频道名称
 * @param {*} channelId
 * @param {*} channelName
 * @param {*} loginInfo 
 * @returns 
 */
const updateChannelName = async function({channelId, channelName, loginInfo}){
    if(!channelId){
        return tlResponseArgsError("请求参数错误")
    }

    channelId = parseInt(channelId)
    if(!checkIsId(channelId)){
        return tlResponseArgsError("请求参数错误")
    }

    if(!channelName){
        return tlResponseArgsError("请求参数错误")
    }

    channelName = channelName.trim()
    if(!channelName){
        return tlResponseArgsError("请求参数错误")
    }

    if(channelName.length > 64){
        return tlResponseArgsError("频道名称长度不能超过64个字符")
    }

    const {
        loginUserCompanyId, loginUserId
    } = loginInfo

    const channelInfo = await channelService.getInfoById({
        companyId: loginUserCompanyId, 
        id: channelId
    })

    if(Object.keys(channelInfo).length == 0){
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

    const updateChannelInfo = await channelService.updateInfoById({
        companyId: loginUserCompanyId, 
        id: channelId
    }, {
        name: channelName,
    })

    if(Object.keys(updateChannelInfo).length == 0){
        return tlResponseSvrError("修改频道名称失败")
    }

    return tlResponseSuccess("更新成功")
}


/**
 * 修改频道是否可以被搜索
 * @param {*} channelId
 * @param {*} canSearch
 * @param {*} loginInfo 
 * @returns 
 */
const updateChannelCanSearch = async function({channelId, canSearch, loginInfo}){
    if(!channelId){
        return tlResponseArgsError("请求参数错误")
    }

    channelId = parseInt(channelId)
    if(!checkIsId(channelId)){
        return tlResponseArgsError("请求参数错误")
    }

    if(canSearch === undefined){
        return tlResponseArgsError("请求参数错误")
    }

    const {
        loginUserCompanyId, loginUserId
    } = loginInfo

    const channelInfo = await channelService.getInfoById({
        companyId: loginUserCompanyId, 
        id: channelId
    })

    if(Object.keys(channelInfo).length == 0){
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

    let flag = channelInfo[TlChannelDef.flag]
    if(canSearch){
        flag = setBit(flag, TlChannelFlag.GROUP_CAN_BE_SEARCH, true)
    }else{
        flag = setBit(flag, TlChannelFlag.GROUP_CAN_BE_SEARCH, false)
    }

    const updateChannelInfo = await channelService.updateInfoById({
        companyId: loginUserCompanyId, 
        id: channelId
    }, {
        [TlChannelDef.flag]: flag
    })

    if(Object.keys(updateChannelInfo).length == 0){
        return tlResponseSvrError("更新失败")
    }

    return tlResponseSuccess("更新成功")
}


/**
 * 获取频道名称
 * @param {*} channelId 
 * @param {*} loginInfo
 * @returns 
 */
const getChannelNameById = async function({ loginInfo, channelId}){
    if(!channelId){
        return tlResponseArgsError("请求参数错误")
    }

    channelId = parseInt(channelId)
    if(!checkIsId(channelId)){
        return tlResponseArgsError("请求参数错误")
    }

    const {
        loginUserCompanyId, loginUserId
    } = loginInfo

    const channelInfo = await channelService.getInfoById({
        companyId: loginUserCompanyId, 
        id: channelId
    }, [
        TlChannelDef.name,
        TlChannelDef.flag
    ])

    if(Object.keys(channelInfo).length == 0){
        return tlResponseSuccess("获取成功", {
            channelName: ''
        })
    }

    // 频道不允许被搜索，返回频道不存在
    const channelFlag = channelInfo[TlChannelDef.flag]
    const groupCanBeSearch = checkBit(channelFlag, TlChannelFlag.GROUP_CAN_BE_SEARCH)
    if(!groupCanBeSearch){
        return tlResponseForbidden("频道不存在")
    }

    const channelName = channelInfo[TlChannelDef.name] || ""

    return tlResponseSuccess("获取成功", {
        channelName
    })
}


/**
 * 获取频道聊天列表
 * @param {*} loginInfo
 * @param {*} channelId
 * @param {*} chatMinId
 * @param {*} fileMinId
 * @param {*} mediaMinId
 */
const getChannelChatList = async function ({
    loginInfo, channelId, chatMinId, fileMinId, mediaMinId
}) {
    if(!channelId) {
        return tlResponseArgsError("请求参数错误")
    }

    channelId = parseInt(channelId)
    if(!checkIsId(channelId)){
        return tlResponseArgsError("请求参数错误")
    }

    const {
        loginUserCompanyId, loginUserId
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

    // 按时间范围获取聊天记录，拿第一页的数据即可
    // 调整pageSize需要同步调整前端 更新channelMessageAllLoad逻辑
    const page = 1
    const pageSize = 20

    chatMinId = parseInt(chatMinId)
    fileMinId = parseInt(fileMinId)
    mediaMinId = parseInt(mediaMinId)

    // 已读消息列表
    const userReadList = await userReadService.getListByChannelUserId({
        companyId: loginUserCompanyId,
        userId: loginUserId,
        channelId
    }, [
        TlUserReadDef.type,
        TlUserReadDef.latestReadId
    ])

    let userReadMap = {}
    userReadList.forEach(item => {
        userReadMap[item[TlUserReadDef.type]] = item[TlUserReadDef.latestReadId]
    })

    // 获取频道清理记录
    const userClearList = await userClearService.getListByChannelUserId({
        companyId: loginUserCompanyId,
        userId: loginUserId,
        channelId
    }, [
        TlUserClearDef.type,
        TlUserClearDef.latestClearId
    ])
    let userClearMap = {}
    userClearList.forEach(item => {
        userClearMap[item[TlUserClearDef.type]] = item[TlUserClearDef.latestClearId]
    })

    // 获取频道消息列表
    const messageList = await channelMessageService.getCombinedChannelHistoryMessageListForPage({
        companyId: loginUserCompanyId, channelId, 
        chatClearId: userClearMap[TlUserClearType.CHAT] || 1,
        fileClearId: userClearMap[TlUserClearType.FILE] || 1,
        mediaClearId: userClearMap[TlUserClearType.MEDIA] || 1,
        chatMinId, fileMinId, mediaMinId
    }, [
        TlChannelChatDef.id,
        TlChannelChatDef.companyId,
        TlChannelChatDef.channelId,
        TlChannelChatDef.type,
        TlChannelChatDef.flag,
        TlChannelChatDef.other,
        TlChannelChatDef.fromUserId,
        TlChannelChatDef.fromUserName,
        TlChannelChatDef.messageTimeStamp,
        TlChannelChatDef.messageVersion,
        TlChannelChatDef.createdAt,
    ], [
        TlChannelChatDef.message,
        TlChannelChatDef.toUserId,
        TlChannelChatDef.toUserName,
    ], [
        TlChannelFileDef.cloudFileId,
        TlChannelFileDef.status,
    ], [
        TlChannelMediaDef.status,
        TlChannelMediaDef.media,
    ], page, pageSize)

    const chatList = messageList.filter(item => Object.values(TlChannelChatType).includes(item[TlChannelChatDef.type]))
    const fileList = messageList.filter(item => Object.values(TlChannelFileType).includes(item[TlChannelChatDef.type]))
    const mediaList = messageList.filter(item => Object.values(TlChannelMediaType).includes(item[TlChannelChatDef.type]))
    const userIdList = messageList.map(item => item[TlChannelChatDef.fromUserId])

    // 用户头像
    let userAvatarMap = {}
    if(userIdList.length > 0){
        const userList = await userService.getListByIdList({
            companyId: loginUserCompanyId,
            idList: userIdList
        }, [
            TlUserDef.id,
            TlUserDef.avatarUrl
        ])

        userList.forEach(item => {
            userAvatarMap[item[TlUserDef.id]] = item[TlUserDef.avatarUrl]
        })
    }

    // 云文件信息
    let cloudFileMap = {}
    const cloudFileIdList = fileList.map(item => item[TlChannelFileDef.cloudFileId])
        if(cloudFileIdList.length > 0){
            const cloudFileList = await cloudFileService.getListByIdList({
                companyId: loginUserCompanyId,
                idList: cloudFileIdList
            },[
                TlCloudFileDef.id,
                TlCloudFileDef.originFileName,
                TlCloudFileDef.fileSize,
                TlCloudFileDef.fileUrl,
                TlCloudFileDef.flag,
                TlCloudFileDef.createdAt
            ])
            cloudFileList.forEach(item => {
                cloudFileMap[item[TlCloudFileDef.id]] = item
            })
        }

    // 获取回复消息id列表
    let replyChatMessageIdList = []
    let replyFileMessageIdList = []
    let replyMediaMessageIdList = []
    chatList.forEach(item => {
        let other = {}
        let otherStr = item[TlChannelChatDef.other]
        if(otherStr){
            try{
                other = JSON.parse(otherStr)
            }catch(e){
                tlConsoleError('解析other失败', otherStr, item[TlChannelChatDef.id])
                other = {}
            }
        }

        let replyToMessageId = other[TlChannelChatOther.replyToMessageId]
        let replyToMessageType = other[TlChannelChatOther.replyToMessageType]
        if(replyToMessageId){
            replyToMessageId = parseInt(replyToMessageId)

            if([
                TlChannelChatType.FRIEND,
                TlChannelChatType.GROUP,
            ].includes(replyToMessageType)){
                replyChatMessageIdList.push(replyToMessageId)
            }else if([
                TlChannelFileType.P2P,
                TlChannelFileType.OFFLINE
            ].includes(replyToMessageType)){
                replyFileMessageIdList.push(replyToMessageId)
            }else if([
                TlChannelMediaType.VIDEO,
                TlChannelMediaType.AUDIO,
            ].includes(replyToMessageType)){
                replyMediaMessageIdList.push(replyToMessageId)
            }
        }
    })

    // 回复文本消息, 目前回复只支持回复文本消息
    let replyChatMessageMap = {}
    let replyFileMessageMap = {}
    let replyMediaMessageMap = {}
    if(replyChatMessageIdList.length > 0){
        const replyMessageList = await channelChatService.getListByChannelIdAndIdList({
            companyId: loginUserCompanyId,
            channelId,
            idList: replyChatMessageIdList
        }, [
            TlChannelChatDef.id,
            TlChannelChatDef.message,
        ])

        replyMessageList.forEach(item => {
            replyChatMessageMap[item[TlChannelChatDef.id]] = item
        })
    }

    // 初始化返回数据
    let resultMap = await initChannelChatList({
        chatList, fileList, mediaList, userChannelReadMap: {
            [channelId]: userReadMap
        }, userAvatarMap, cloudFileMap, 
        replyChatMessageMap, replyFileMessageMap, replyMediaMessageMap
    })

    let resultList = resultMap[channelId] || []

    return tlResponseSuccess("获取成功", resultList)
}


/**
 * 获取频道列表聊天记录
 * @param {*} loginInfo
 * @param {*} channelIdList
 */
const getChannelChatListByChannelIdList = async function ({loginInfo, channelIdList}) {
    if (!channelIdList) {
        return tlResponseArgsError("请求参数错误")
    }

    for(let i = 0; i < channelIdList.length; i++){
        let channelId = channelIdList[i]
        channelId = parseInt(channelId)
        if(!checkIsId(channelId)){
            return tlResponseArgsError("请求参数错误")
        }
    }

    const {
        loginUserCompanyId, loginUserId
    } = loginInfo

    // 当前用户是否存在频道
    const channelUserInfoList = await channelUserService.getListByUserIdAndChannelIdList({
        companyId: loginUserCompanyId,
        channelIdList: channelIdList,
        userId: loginUserId
    })
    // 构建频道用户映射
    let channelUserInfoMap = {}
    channelUserInfoList.forEach(item => {
        channelUserInfoMap[item[TlChannelUserDef.channelId]] = item
    })
    // 是否存在非法操作
    for (let i = 0; i < channelIdList.length; i++) {
        const channelId = channelIdList[i]
        if(!channelUserInfoMap[channelId]){
            return tlResponseNotFound("存在非法操作")
        }
    }
    
    let userIdList = []

    // 已读消息列表
    const userReadList = await userReadService.getListByUserIdTypeListAndChannelIdList({
        companyId: loginUserCompanyId,
        userId: loginUserId,
        typeList: [
            TlUserReadType.CHAT,
            TlUserReadType.FILE,
            TlUserReadType.MEDIA
        ],
        channelIdList
    }, [
        TlUserReadDef.type,
        TlUserReadDef.channelId,
        TlUserReadDef.latestReadId
    ])

    let userChannelReadMap = {}
    for (let i = 0; i < channelIdList.length; i++) {
        const channelId = channelIdList[i]
        userChannelReadMap[channelId] = {
            [TlUserReadType.CHAT]: 0,
            [TlUserReadType.FILE]: 0,
            [TlUserReadType.MEDIA]: 0
        }
    }

    userReadList.forEach(item => {
        const channelId = item[TlUserReadDef.channelId]
        const type = item[TlUserReadDef.type]
        userChannelReadMap[channelId][type] = item[TlUserReadDef.latestReadId]
    })

    // 获取频道清理记录
    const userClearList = await userClearService.getListByUserIdAndChannelIdList({
        companyId: loginUserCompanyId,
        userId: loginUserId,
        channelIdList
    }, [
        TlUserClearDef.type,
        TlUserClearDef.channelId,
        TlUserClearDef.latestClearId
    ])
    let userClearMap = {}
    for (let i = 0; i < channelIdList.length; i++) {
        const channelId = channelIdList[i]
        userClearMap[channelId] = {
            [TlUserClearType.CHAT]: 0,
            [TlUserClearType.FILE]: 0,
            [TlUserClearType.MEDIA]: 0
        }
    }
    userClearList.forEach(item => {
        const channelId = item[TlUserClearDef.channelId]
        const type = item[TlUserClearDef.type]
        userClearMap[channelId][type] = item[TlUserClearDef.latestClearId]
    })

    // 聊天消息
    let chatList = []
    // 文件消息
    let fileList = []
    // 媒体消息
    let mediaList = []
    for (let i = 0; i < channelIdList.length; i++) {
        const channelId = channelIdList[i]
        
        const messageList = await channelMessageService.getCombinedChannelMessageListForPage({
            companyId: loginUserCompanyId, channelId, 
            chatClearId: userClearMap[channelId][TlUserClearType.CHAT] || 1,
            fileClearId: userClearMap[channelId][TlUserClearType.FILE] || 1,
            mediaClearId: userClearMap[channelId][TlUserClearType.MEDIA] || 1,
        }, [
            TlChannelChatDef.id,
            TlChannelChatDef.companyId,
            TlChannelChatDef.channelId,
            TlChannelChatDef.type,
            TlChannelChatDef.flag,
            TlChannelChatDef.other,
            TlChannelChatDef.fromUserId,
            TlChannelChatDef.fromUserName,
            TlChannelChatDef.messageTimeStamp,
            TlChannelChatDef.messageVersion,
            TlChannelChatDef.createdAt,
        ], [
            TlChannelChatDef.message,
            TlChannelChatDef.toUserId,
            TlChannelChatDef.toUserName,
        ], [
            TlChannelFileDef.cloudFileId,
            TlChannelFileDef.status,
        ], [
            TlChannelMediaDef.status,
            TlChannelMediaDef.media,
        ], 1, 3)

        chatList = chatList.concat(messageList.filter(item => Object.values(TlChannelChatType).includes(item[TlChannelChatDef.type])))
        fileList = fileList.concat(messageList.filter(item => Object.values(TlChannelFileType).includes(item[TlChannelChatDef.type])))
        mediaList = mediaList.concat(messageList.filter(item => Object.values(TlChannelMediaType).includes(item[TlChannelChatDef.type])))

        userIdList = userIdList.concat(messageList.map(item => item[TlChannelChatDef.fromUserId]))
    }

    // 云文件信息
    let cloudFileMap = {}
    const cloudFileIdList = fileList.map(item => item[TlChannelFileDef.cloudFileId])
    if(cloudFileIdList.length > 0){
        const cloudFileList = await cloudFileService.getListByIdList({
            companyId: loginUserCompanyId,
            idList: cloudFileIdList
        },[
            TlCloudFileDef.id,
            TlCloudFileDef.originFileName,
            TlCloudFileDef.fileSize,
            TlCloudFileDef.fileUrl,
            TlCloudFileDef.flag,
            TlCloudFileDef.createdAt
        ])
        cloudFileList.forEach(item => {
            cloudFileMap[item[TlCloudFileDef.id]] = item
        })
    }

    // 用户头像
    let userAvatarMap = {}
    if(userIdList.length > 0){
        const userList = await userService.getListByIdList({
            companyId: loginUserCompanyId,
            idList: userIdList
        }, [
            TlUserDef.id,
            TlUserDef.avatarUrl
        ])

        userList.forEach(item => {
            userAvatarMap[item[TlUserDef.id]] = item[TlUserDef.avatarUrl]
        })
    }

    // 获取回复消息id列表
    let replyChatMessageIdList = []
    let replyFileMessageIdList = []
    let replyMediaMessageIdList = []
    chatList.forEach(item => {
        let other = {}
        let otherStr = item[TlChannelChatDef.other]
        if(otherStr){
            try{
                other = JSON.parse(otherStr)
            }catch(e){
                tlConsoleError('解析other失败', otherStr, item[TlChannelChatDef.id])
                other = {}
            }
        }

        let replyToMessageId = other[TlChannelChatOther.replyToMessageId]
        let replyToMessageType = other[TlChannelChatOther.replyToMessageType]
        if(replyToMessageId){
            replyToMessageId = parseInt(replyToMessageId)

            if([
                TlChannelChatType.FRIEND,
                TlChannelChatType.GROUP,
            ].includes(replyToMessageType)){
                replyChatMessageIdList.push(replyToMessageId)
            }else if([
                TlChannelFileType.P2P,
                TlChannelFileType.OFFLINE
            ].includes(replyToMessageType)){
                replyFileMessageIdList.push(replyToMessageId)
            }else if([
                TlChannelMediaType.VIDEO,
                TlChannelMediaType.AUDIO,
            ].includes(replyToMessageType)){
                replyMediaMessageIdList.push(replyToMessageId)
            }
        }
    })

    // 回复文本消息
    let replyChatMessageMap = {}
    let replyFileMessageMap = {}
    let replyMediaMessageMap = {}
    if(replyChatMessageIdList.length > 0){
        const replyMessageList = await channelChatService.getListByIdList({
            companyId: loginUserCompanyId,
            idList: replyChatMessageIdList
        }, [
            TlChannelChatDef.id,
            TlChannelChatDef.message,
        ])

        replyMessageList.forEach(item => {
            replyChatMessageMap[item[TlChannelChatDef.id]] = item
        })
    }

    // 初始化返回数据
    let resultMap = await initChannelChatList({
        chatList, fileList, mediaList, userChannelReadMap, userAvatarMap, cloudFileMap,
        replyChatMessageMap, replyFileMessageMap, replyMediaMessageMap
    })

    return tlResponseSuccess("获取成功", resultMap)
}


/**
 * 搜索频道聊天消息
 * @param {*} loginInfo
 * @param {*} channelId
 * @param {*} chatMinId
 * @param {*} fileMinId
 * @param {*} mediaMinId
 * @param {*} keyword
 * @param {*} startTimeStamp
 * @param {*} endTimeStamp
 * @param {*} types
 */
const searchChannelChatList = async function ({
    loginInfo, channelId, chatMinId, fileMinId, mediaMinId,
    keyword, startTimeStamp, endTimeStamp, types
}) {
    if (!channelId) {
        return tlResponseArgsError("请求参数错误")
    }

    channelId = parseInt(channelId)
    if(!checkIsId(channelId)){
        return tlResponseArgsError("请求参数错误")
    }

    const {
        loginUserCompanyId, loginUserId
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

    // 按时间范围获取聊天记录，拿第一页的数据即可
    // 调整pageSize需要同步调整前端 更新channelMessageAllLoad逻辑
    const page = 1
    const pageSize = 100

    chatMinId = parseInt(chatMinId)
    fileMinId = parseInt(fileMinId)
    mediaMinId = parseInt(mediaMinId)

    let searchChat = false
    let searchFile = false
    let searchMedia = false

    if(types){
        types.forEach((item, index) => {
            if(item === 'chat'){
                searchChat = true
            }else if(item === 'file'){
                searchFile = true
            }else if(item === 'media'){
                searchMedia = true
            }
        })
    }
    startTimeStamp = startTimeStamp ? new Date(startTimeStamp).getTime() : null
    endTimeStamp = endTimeStamp ? new Date(endTimeStamp).getTime() : null

    // 已读消息列表
    const userReadList = await userReadService.getListByChannelUserId({
        companyId: loginUserCompanyId,
        userId: loginUserId,
        channelId
    }, [
        TlUserReadDef.type,
        TlUserReadDef.latestReadId
    ])

    let userReadMap = {}
    userReadList.forEach(item => {
        userReadMap[item[TlUserReadDef.type]] = item[TlUserReadDef.latestReadId]
    })

    // 获取频道清理记录
    const userClearList = await userClearService.getListByChannelUserId({
        companyId: loginUserCompanyId,
        userId: loginUserId,
        channelId
    }, [
        TlUserClearDef.type,
        TlUserClearDef.channelId,
        TlUserClearDef.latestClearId
    ])
    let userClearMap = {
        [TlUserClearType.CHAT]: 0,
        [TlUserClearType.FILE]: 0,
        [TlUserClearType.MEDIA]: 0
    }
    userClearList.forEach(item => {
        const type = item[TlUserClearDef.type]
        userClearMap[type] = item[TlUserClearDef.latestClearId]
    })

    // 获取频道消息列表
    const messageList = await channelMessageService.searchCombinedChannelMessageListForPage({
        companyId: loginUserCompanyId, channelId, 
        chatClearId: userClearMap[TlUserClearType.CHAT] || 1,
        fileClearId: userClearMap[TlUserClearType.FILE] || 1,
        mediaClearId: userClearMap[TlUserClearType.MEDIA] || 1,
        chatMinId, fileMinId, mediaMinId,
        startTimeStamp, endTimeStamp
    }, [
        TlChannelChatDef.id,
        TlChannelChatDef.companyId,
        TlChannelChatDef.channelId,
        TlChannelChatDef.type,
        TlChannelChatDef.flag,
        TlChannelChatDef.other,
        TlChannelChatDef.fromUserId,
        TlChannelChatDef.fromUserName,
        TlChannelChatDef.messageTimeStamp,
        TlChannelChatDef.messageVersion,
        TlChannelChatDef.createdAt,
    ], [
        TlChannelChatDef.message,
        TlChannelChatDef.toUserId,
        TlChannelChatDef.toUserName,
    ], [
        TlChannelFileDef.cloudFileId,
        TlChannelFileDef.status,
    ], [
        TlChannelMediaDef.status,
        TlChannelMediaDef.media,
    ], page, pageSize)

    const chatList = messageList.filter(item => Object.values(TlChannelChatType).includes(item[TlChannelChatDef.type]))
    const fileList = messageList.filter(item => Object.values(TlChannelFileType).includes(item[TlChannelChatDef.type]))
    const mediaList = messageList.filter(item => Object.values(TlChannelMediaType).includes(item[TlChannelChatDef.type]))
    const userIdList = messageList.map(item => item[TlChannelChatDef.fromUserId])

    // 用户头像
    let userAvatarMap = {}
    if(userIdList.length > 0){
        const userList = await userService.getListByIdList({
            companyId: loginUserCompanyId,
            idList: userIdList
        }, [
            TlUserDef.id,
            TlUserDef.avatarUrl
        ])

        userList.forEach(item => {
            userAvatarMap[item[TlUserDef.id]] = item[TlUserDef.avatarUrl]
        })
    }

    // 云文件信息
    let cloudFileMap = {}
    const cloudFileIdList = fileList.map(item => item[TlChannelFileDef.cloudFileId])
    if(cloudFileIdList.length > 0){
        const cloudFileList = await cloudFileService.getListByIdList({
            companyId: loginUserCompanyId,
            idList: cloudFileIdList
        },[
            TlCloudFileDef.id,
            TlCloudFileDef.originFileName,
            TlCloudFileDef.fileSize,
            TlCloudFileDef.fileUrl,
            TlCloudFileDef.flag,
            TlCloudFileDef.createdAt,
        ])
        cloudFileList.forEach(item => {
            cloudFileMap[item[TlCloudFileDef.id]] = item
        })
    }

    // 获取回复消息id列表
    let replyChatMessageIdList = []
    let replyFileMessageIdList = []
    let replyMediaMessageIdList = []
    chatList.forEach(item => {
        let other = {}
        let otherStr = item[TlChannelChatDef.other]
        if(otherStr){
            try{
                other = JSON.parse(otherStr)
            }catch(e){
                tlConsoleError('解析other失败', otherStr, item[TlChannelChatDef.id])
                other = {}
            }
        }

        let replyToMessageId = other[TlChannelChatOther.replyToMessageId]
        let replyToMessageType = other[TlChannelChatOther.replyToMessageType]
        if(replyToMessageId){
            replyToMessageId = parseInt(replyToMessageId)

            if([
                TlChannelChatType.FRIEND,
                TlChannelChatType.GROUP,
            ].includes(replyToMessageType)){
                replyChatMessageIdList.push(replyToMessageId)
            }else if([
                TlChannelFileType.P2P,
                TlChannelFileType.OFFLINE
            ].includes(replyToMessageType)){
                replyFileMessageIdList.push(replyToMessageId)
            }else if([
                TlChannelMediaType.VIDEO,
                TlChannelMediaType.AUDIO,
            ].includes(replyToMessageType)){
                replyMediaMessageIdList.push(replyToMessageId)
            }
        }
    })

    // 回复文本消息
    let replyChatMessageMap = {}
    let replyFileMessageMap = {}
    let replyMediaMessageMap = {}
    if(replyChatMessageIdList.length > 0){
        const replyMessageList = await channelChatService.getListByChannelIdAndIdList({
            companyId: loginUserCompanyId,
            channelId,
            idList: replyChatMessageIdList
        }, [
            TlChannelChatDef.id,
            TlChannelChatDef.message,
        ])

        replyMessageList.forEach(item => {
            replyChatMessageMap[item[TlChannelChatDef.id]] = item
        })
    }

    // 初始化返回数据
    let resultMap = await initChannelChatList({
        chatList, fileList, mediaList, cloudFileMap, userAvatarMap, userChannelReadMap: {
            [channelId]: userReadMap
        },
        replyChatMessageMap, replyFileMessageMap, replyMediaMessageMap
    })

    const resultList = resultMap[channelId] || []

    return tlResponseSuccess("获取成功", resultList)
}


/**
 * 初始化频道聊天列表结构
 * @param {*} chatList
 * @param {*} fileList
 * @param {*} mediaList
 * @param {*} cloudFileMap
 * @param {*} userAvatarMap
 * @param {*} userChannelReadMap
 * @param {*} replyMessageMap
 */
const initChannelChatList = async function({
    chatList, fileList, mediaList, 
    cloudFileMap, userAvatarMap, userChannelReadMap, 
    replyChatMessageMap, replyFileMessageMap, replyMediaMessageMap
}){
    // 处理返回数据
    let resultMap = {}

    for(let i = 0; i < chatList.length; i++){
        const item = chatList[i]
        const channelId = item[TlChannelChatDef.channelId]
        if (!resultMap[channelId]) {
            resultMap[channelId] = []
        }

        let chatLatestReadId = 0
        if(userChannelReadMap[channelId]){
            chatLatestReadId = userChannelReadMap[channelId][TlUserReadType.CHAT]
        }

        let userAvatar = userAvatarMap[item[TlChannelChatDef.fromUserId]]
        let type = item[TlChannelChatDef.type]
        if (type == TlChannelChatType.SYSTEM) {
            item[TlChannelChatDef.fromUserId] = 'system'
        }

        let messageTimeStamp = item[TlChannelChatDef.messageTimeStamp]
        let messageVersion = item[TlChannelChatDef.messageVersion]

        let flag = item[TlChannelChatDef.flag]
        let isAtUser = checkBit(flag, TlChannelChatFlag.IS_AT_USER)
        let isAtAll = checkBit(flag, TlChannelChatFlag.IS_AT_ALL)
        let isReplay = checkBit(flag, TlChannelChatFlag.IS_REPLAY)

        let other = {}
        let otherStr = item[TlChannelChatDef.other]
        if(otherStr){
            try{
                other = JSON.parse(otherStr)
            }catch(e){
                tlConsoleError('解析other失败', otherStr, item[TlChannelChatDef.id])
                other = {}
            }
        }

        let replyToMessageId = other[TlChannelChatOther.replyToMessageId]
        if(replyToMessageId){
            replyToMessageId = parseInt(replyToMessageId)
        }

        let replyToMessageType = other[TlChannelChatOther.replyToMessageType]

        let replyToMessageContent = ''
        if([
            TlChannelChatType.FRIEND,
            TlChannelChatType.GROUP,
        ].includes(replyToMessageType)){
            let replyToMessage = replyChatMessageMap[replyToMessageId] || {}
            replyToMessageContent = replyToMessage[TlChannelChatDef.message] || '消息已失效'
        }else if([
            TlChannelFileType.P2P,
            TlChannelFileType.OFFLINE
        ].includes(replyToMessageType)){
            if(replyToMessageType == TlChannelFileType.P2P){
                replyToMessageContent = "在线文件"
            }else if(replyToMessageType == TlChannelFileType.OFFLINE){
                replyToMessageContent = "离线文件"
            }else{
                replyToMessageContent = "未知文件消息"
            }
        }else if([
            TlChannelMediaType.VIDEO,
            TlChannelMediaType.AUDIO,
        ].includes(replyToMessageType)){
            if(replyToMessageType == TlChannelMediaType.VIDEO){
                replyToMessageContent = "视频通话"
            }else if(replyToMessageType == TlChannelMediaType.AUDIO){
                replyToMessageContent = "语音通话"
            }else{
                replyToMessageContent = "未知音视频消息"
            }
        }else{
            replyToMessageContent = "未知消息"
        }

        let atUserId = other[TlChannelChatOther.atUserId]
        if(atUserId){
            atUserId = parseInt(atUserId)
        }
        let atUserName = other[TlChannelChatOther.atUserName]

        resultMap[channelId].push({
            id: item[TlChannelChatDef.id],
            message: item[TlChannelChatDef.message],
            type: item[TlChannelChatDef.type],
            fromUserId: item[TlChannelChatDef.fromUserId],
            fromUserName: item[TlChannelChatDef.fromUserName],
            fromUserAvatar: await getAvatarOssUrl(userAvatar),
            createTime: item[TlChannelChatDef.createdAt],
            hasRead: item[TlChannelChatDef.id] <= chatLatestReadId,
            isAtAll,
            replyToMessageId,
            replyToMessageType,
            replyToMessageContent,
            atUserId,
            atUserName,
            messageTimeStamp,
            messageVersion
        })
    }

    for(let i = 0; i < fileList.length; i++){
        const item = fileList[i]
        const channelId = item[TlChannelFileDef.channelId]
        if (!resultMap[channelId]) {
            resultMap[channelId] = []
        }

        let fileLatestReadId = 0
        if(userChannelReadMap[channelId]){
            fileLatestReadId = userChannelReadMap[channelId][TlUserReadType.FILE]
        }
        let cloudFileId = item[TlChannelFileDef.cloudFileId]
        let cloudFile = cloudFileMap[cloudFileId] || {}

        let message = ""
        if(item[TlChannelFileDef.type] == TlChannelFileType.P2P){
            message = "在线文件"
        }else if(item[TlChannelFileDef.type] == TlChannelFileType.OFFLINE){
            message = "离线文件"
        }

        let userAvatar = userAvatarMap[item[TlChannelFileDef.fromUserId]]

        let statusStr = ''
        if(item[TlChannelFileDef.status] == TlChannelFileStatus.INIT){
            statusStr = '发起中'
        }else if(item[TlChannelFileDef.status] == TlChannelFileStatus.RECEIVING){
            statusStr = '接收中'
        }else if(item[TlChannelFileDef.status] == TlChannelFileStatus.RECEIVED){
            statusStr = '已接收'
        }

        let messageTimeStamp = item[TlChannelFileDef.messageTimeStamp]
        let messageVersion = item[TlChannelFileDef.messageVersion]

        let flag = item[TlChannelFileDef.flag]
        let isAtUser = checkBit(flag, TlChannelFileFlag.IS_AT_USER)
        let isAtAll = checkBit(flag, TlChannelFileFlag.IS_AT_ALL)
        let isReplay = checkBit(flag, TlChannelFileFlag.IS_REPLAY)

        let other = {}
        let otherStr = item[TlChannelFileDef.other]
        if(otherStr){
            try{
                other = JSON.parse(otherStr)
            }catch(e){
                tlConsoleError('解析other失败', otherStr, item[TlChannelFileDef.id])
                other = {}
            }
        }

        let atUserId = other[TlChannelFileOther.atUserId]
        if(atUserId){
            atUserId = parseInt(atUserId)
        }
        let atUserName = other[TlChannelFileOther.atUserName]
        
        let fileUrl = cloudFile[TlCloudFileDef.fileUrl]
        fileUrl = await getOssUrl(fileUrl)

        resultMap[channelId].push({
            id: item[TlChannelFileDef.id],
            type: item[TlChannelFileDef.type],
            fromUserId: item[TlChannelFileDef.fromUserId],
            fromUserName: item[TlChannelFileDef.fromUserName],
            fromUserAvatar: await getAvatarOssUrl(userAvatar),
            cloudFileId: cloudFileId,
            message: message,
            status: item[TlChannelFileDef.status],
            statusStr: statusStr,
            fileName: cloudFile[TlCloudFileDef.originFileName] || '已失效',
            fileNotFound: Object.keys(cloudFile).length == 0,
            fileType: cloudFile[TlCloudFileDef.originFileType] || '',
            fileSize: cloudFile[TlCloudFileDef.fileSize] || 0,
            fileUrl,
            createTime: item[TlChannelFileDef.createdAt],
            hasRead: item[TlChannelFileDef.id] <= fileLatestReadId,
            isAtAll,
            atUserId,
            atUserName,
            messageTimeStamp,
            messageVersion
        })
    }

    for(let i = 0; i < mediaList.length; i++){
        const item = mediaList[i]
        const channelId = item[TlChannelMediaDef.channelId]
        if (!resultMap[channelId]) {
            resultMap[channelId] = []
        }

        let mediaLatestReadId = 0
        if(userChannelReadMap[channelId]){
            mediaLatestReadId = userChannelReadMap[channelId][TlUserReadType.MEDIA]
        }
        
        let message = ""
        if(item[TlChannelMediaDef.type] == TlChannelMediaType.AUDIO){
            message = "语音通话"
        }else if(item[TlChannelMediaDef.type] == TlChannelMediaType.VIDEO){
            message = "视频通话"
        }

        let userAvatar = userAvatarMap[item[TlChannelMediaDef.fromUserId]]

        let messageTimeStamp = item[TlChannelMediaDef.messageTimeStamp]
        let messageVersion = item[TlChannelMediaDef.messageVersion]

        let flag = item[TlChannelMediaDef.flag]
        let isAtUser = checkBit(flag, TlChannelMediaFlag.IS_AT_USER)
        let isAtAll = checkBit(flag, TlChannelMediaFlag.IS_AT_ALL)
        let isReplay = checkBit(flag, TlChannelMediaFlag.IS_REPLAY)

        let other = {}
        let otherStr = item[TlChannelMediaDef.other]
        if(otherStr){
            try{
                other = JSON.parse(otherStr)
            }catch(e){
                tlConsoleError('解析other失败', otherStr, item[TlChannelMediaDef.id])
                other = {}
            }
        }

        let atUserId = other[TlChannelMediaOther.atUserId]
        if(atUserId){
            atUserId = parseInt(atUserId)
        }
        let atUserName = other[TlChannelMediaOther.atUserName]

        resultMap[channelId].push({
            id: item[TlChannelMediaDef.id],
            media: JSON.parse(item[TlChannelMediaDef.media]),
            message: message,
            type: item[TlChannelMediaDef.type],
            fromUserId: item[TlChannelMediaDef.fromUserId],
            fromUserName: item[TlChannelMediaDef.fromUserName],
            fromUserAvatar: await getAvatarOssUrl(userAvatar),
            createTime: item[TlChannelMediaDef.createdAt],
            hasRead: item[TlChannelMediaDef.id] <= mediaLatestReadId,
            isAtAll,
            atUserId,
            atUserName,
            messageTimeStamp,
            messageVersion
        })
    }

    // 按时间戳排序
    Object.keys(resultMap).forEach(key => {
        resultMap[key].sort((a, b) => {
            return a.messageTimeStamp - b.messageTimeStamp
        })
    })

    return resultMap
}


/**
 * 获取群组频道列表
 * @param {*} loginInfo
 */
const getChannelGroupList = async function({
    loginInfo
}){
    const {
        loginUserCompanyId, loginUserId, loginUserCompanyName
    } = loginInfo

    // 获取自己相关的频道列表
    const channelUserList = await channelUserService.getListByTypeUserId({
        companyId: loginUserCompanyId, 
        userId: loginUserId,
        type: TlChannelUserType.GROUP
    }, [
        TlChannelUserDef.channelId,
        TlChannelUserDef.createdAt
    ])

    const channelUserMap = {}
    channelUserList.forEach(item => {
        channelUserMap[item[TlChannelUserDef.channelId]] = item
    })

    const channelIdList = channelUserList.map(channelUser => channelUser[TlChannelUserDef.channelId])
    // 获取频道列表
    const channelList = await channelService.getListByIdList({
        companyId: loginUserCompanyId,
        idList: channelIdList
    }, [
        TlChannelDef.id,
        TlChannelDef.name,
        TlChannelDef.status,
        TlChannelDef.createdAt
    ])

    // 获取频道用户数量
    const channelUserCounts = await channelUserService.getCountByChannelIdList({
        companyId: loginUserCompanyId, channelIdList
    })
    const channelUserCountsMap = {}
    channelUserCounts.forEach(item => {
        channelUserCountsMap[item[TlChannelUserDef.channelId]] = item.count
    })
    
    // 处理结果
    let resultList = []
    for (let i = 0; i < channelList.length; i++) {
        const channel = channelList[i]
        const channelId = channel[TlChannelDef.id]
        const channelName = channel[TlChannelDef.name]

        let statusStr = ''
        let status = channel[TlChannelDef.status]
        if(status == TlChannelStatus.NORMAL){
            statusStr = '正常'
        }

        const channelUser = channelUserMap[channelId] || {}
        const joinTime = channelUser[TlChannelUserDef.createdAt]

        const userCount = channelUserCountsMap[channelId] || 0

        resultList.push({
            channelId: channelId,
            channelName: channelName,
            channelAvatar: '/image/group-default-avatar.png',
            channelCompanyName: loginUserCompanyName,
            status: statusStr,
            createTime: channel[TlChannelDef.createdAt],
            joinTime: joinTime,
            channelUserCount: userCount
        })
    }

    return tlResponseSuccess("获取成功", resultList)
}


/**
 * 更新频道信息 - 管理端
 * @param {*} loginInfo
 * @param {*} channelId
 * @param {*} channelName 
 * @param {*} canSearch
 * @returns 
 */
const adminUpdateChannel = async function({
    loginInfo, companyId, channelId, channelName, canSearch
}){
    const {
        loginUserCompanyId, loginUserId, loginUserRoleId
    } = loginInfo

    if(loginUserRoleId !== TlRoleInner.user.admin.id){
        return tlResponseForbidden("非法用户")
    }

    if (!channelId || !channelName || !companyId) {
        return tlResponseArgsError("请求参数错误")
    }

    if(!checkIsId(channelId)){
        return tlResponseArgsError("请求参数错误")
    }

    if(!checkIsId(companyId)){
        return tlResponseArgsError("请求参数错误")
    }

    channelId = parseInt(channelId)
    companyId = parseInt(companyId)

    const companyInfo = await companyService.getInfoById({
        id: companyId
    })

    if(Object.keys(companyInfo).length == 0){
        return tlResponseNotFound("企业不存在")
    }

    // 获取频道信息
    const channelInfo = await channelService.getInfoById({
        companyId,
        id: channelId
    })

    if(Object.keys(channelInfo).length == 0){
        return tlResponseNotFound("频道不存在")
    }

    let flag = channelInfo[TlChannelDef.flag]
    if(canSearch){
        flag = setBit(flag, TlChannelFlag.GROUP_CAN_BE_SEARCH, true)
    }else {
        flag = setBit(flag, TlChannelFlag.GROUP_CAN_BE_SEARCH, false)
    }

    // 更新频道信息
    const result = await channelService.updateInfoById({
        companyId,
        id: channelId,
    }, {
        [TlChannelDef.name]: channelName,
        [TlChannelDef.flag]: flag
    })

    if(Object.keys(result).length == 0){
        return tlResponseSuccess("更新失败")
    }

    return tlResponseSuccess("更新成功")
}


/**
 * 删除频道 - 管理端
 * @param {*} loginInfo
 * @param {*} companyId
 * @param {*} channelId
 * @returns 
 */
const adminDeleteChannel = async function({
    loginInfo, companyId, channelId
}){
    const {
        loginUserCompanyId, loginUserId, loginUserRoleId
    } = loginInfo

    if(loginUserRoleId !== TlRoleInner.user.admin.id){
        return tlResponseForbidden("非法用户")
    }

    if (!channelId || !companyId) {
        return tlResponseArgsError("请求参数错误")
    }

    if(!checkIsId(channelId)){
        return tlResponseArgsError("请求参数错误")
    }

    if(!checkIsId(companyId)){
        return tlResponseArgsError("请求参数错误")
    }

    channelId = parseInt(channelId)
    companyId = parseInt(companyId)

    const companyInfo = await companyService.getInfoById({
        id: companyId
    })

    if(Object.keys(companyInfo).length == 0){
        return tlResponseNotFound("企业不存在")
    }

    // 获取
    const channelInfo = await channelService.getInfoById({
        companyId,
        id: channelId
    })

    if(Object.keys(channelInfo).length == 0){
        return tlResponseNotFound("频道不存在")
    }

    // 删除频道
    const result = await channelService.deleteInfoById({
        companyId,
        id: channelId
    })

    if(Object.keys(result).length == 0){
        return tlResponseSuccess("删除失败")
    }

    return tlResponseSuccess("删除成功")
}


/**
 * 获取频道列表 - 管理端
 * @param {*} loginInfo
 * @param {*} page
 * @param {*} pageSize
 * @param {*} keyword 
 * @returns 
 */
const adminGetChannelList = async function({
    loginInfo, page, limit, keyword
}){
    const {
        loginUserCompanyId, loginUserId, loginUserRoleId
    } = loginInfo

    if(loginUserRoleId !== TlRoleInner.user.admin.id){
        return tlResponseForbidden("非法用户")
    }

    if(!page){
        return tlResponseArgsError("请求参数错误")
    }

    if(!limit){
        return tlResponseArgsError("请求参数错误")
    }

    if(!checkIsId(page)){
        return tlResponseArgsError("请求参数错误")
    }

    if(!checkIsId(limit)){
        return tlResponseArgsError("请求参数错误")
    }

    page = parseInt(page)
    limit = parseInt(limit)

    let total = 0
    let list = []

    if(keyword == null || keyword == undefined || keyword == ''){
        list = await channelService.getListForPage({

        }, [
            TlChannelDef.id,
            TlChannelDef.name,
            TlChannelDef.companyId,
            TlChannelDef.type,
            TlChannelDef.status,
            TlChannelDef.flag,
            TlChannelDef.createdAt
        ], page, limit)

        total = await channelService.getCount({})
    }else{
        list = await channelService.getListByKeywordForPage({
            keyword
        }, [
            TlChannelDef.id,
            TlChannelDef.name,
            TlChannelDef.type,
            TlChannelDef.companyId,
            TlChannelDef.status,
            TlChannelDef.flag,
            TlChannelDef.createdAt
        ])
        total = await channelService.getCountByKeyword({
            keyword
        })
    }

    if(list.length == 0){
        return tlResponseSuccess("获取成功", {
            list: [],
            count: 0
        })
    }

    // 获取企业信息
    const companyIdList = list.map(item => item[TlChannelDef.companyId])
    const companyList = await companyService.getListByIdList({
        idList: companyIdList
    }, [
        TlCompanyDef.id,
        TlCompanyDef.name
    ])

    let companyMap = {}
    companyList.forEach(item => {
        companyMap[item[TlCompanyDef.id]] = item
    })

    const channelIdList = list.map(item => item[TlChannelDef.id])

    // 获取频道用户数量
    const channelUserCounts = await channelUserService.getCountByChannelIdListNoCompanyId({
        channelIdList
    })
    const channelUserCountsMap = {}
    channelUserCounts.forEach(item => {
        channelUserCountsMap[item[TlChannelUserDef.channelId]] = item.count
    })

    let resultList = []
    for(let i = 0; i < list.length; i++){
        const item = list[i]
        const channelId = item[TlChannelDef.id]
        const channelName = item[TlChannelDef.name]
        const typeStr = TlChannelType.toZnStr(item[TlChannelDef.type])

        let statusStr = ''
        let status = item[TlChannelDef.status]
        if(status == TlChannelStatus.NORMAL){
            statusStr = '正常'
        }

        let flag = item[TlChannelDef.flag]
        let canSearch = checkBit(flag, TlChannelFlag.GROUP_CAN_BE_SEARCH)

        const companyId = item[TlChannelDef.companyId]
        const companyInfo = companyMap[companyId] || {}
        const companyName = companyInfo[TlCompanyDef.name] || ''

        resultList.push({
            id: channelId,
            channelName: channelName,
            companyId: companyId,
            channelUserCount: channelUserCountsMap[channelId] || 0,
            companyName: companyName,
            channelType: '群聊',
            canSearch,
            type: item[TlChannelDef.type],
            typeStr: typeStr,
            status,
            statusStr,
            createTime: item[TlChannelDef.createdAt]
        })
    }

    return tlResponseSuccess("获取成功", {
        list: resultList,
        count: total
    })
}

/**
 * 获取频道用户列表 - 管理端
 * @param {*} loginInfo
 * @param {*} channelId
 * @param {*} page
 * @param {*} limit
 * @param {*} keyword
 * @returns
 * */
const adminGetChannelUserList = async function({
    loginInfo, channelId, page, limit, keyword
}){
    const {
        loginUserCompanyId, loginUserId, loginUserRoleId
    } = loginInfo

    if(loginUserRoleId !== TlRoleInner.user.admin.id){
        return tlResponseForbidden("非法用户")
    }

    if(!page){
        return tlResponseArgsError("请求参数错误")
    }

    if(!limit){
        return tlResponseArgsError("请求参数错误")
    }

    if(!checkIsId(channelId)){
        return tlResponseArgsError("请求参数错误")
    }

    if(!checkIsId(page)){
        return tlResponseArgsError("请求参数错误")
    }

    if(!checkIsId(limit)){
        return tlResponseArgsError("请求参数错误")
    }

    channelId = parseInt(channelId)
    page = parseInt(page)
    limit = parseInt(limit)

    const channelInfo = await channelService.getInfoByIdNoCompanyId({
        id: channelId
    })

    if(Object.keys(channelInfo).length == 0){
        return tlResponseNotFound("频道不存在")
    }

    const companyId = channelInfo[TlChannelDef.companyId]
    const companyInfo = await companyService.getInfoById({
        id: companyId
    })

    if(Object.keys(companyInfo).length == 0){
        return tlResponseNotFound("频道所属企业不存在")
    }

    let total = 0
    let list = []

    if(keyword == null || keyword == undefined || keyword == ''){
        list = await channelUserService.getListByChannelIdForPage({
            companyId,
            channelId
        }, [
            TlChannelUserDef.companyId,
            TlChannelUserDef.userId,
            TlChannelUserDef.roleId,
            TlChannelUserDef.type,
            TlChannelUserDef.status,
            TlChannelUserDef.createdAt
        ], page, limit)

        total = await channelUserService.getCountByChannelId({
            companyId,
            channelId
        })
    }else{
        // 查出用户id
        const userList = await userService.getListByKeyword({
            companyId,
            keyword
        }, [
            TlUserDef.id
        ])
        const userIdList = userList.map(item => item[TlUserDef.id])

        if(userIdList.length == 0){
            return tlResponseSuccess("获取成功", {
                list: [],
                count: 0
            })
        }

        list = await channelUserService.getListByChannelIdAndUserIdListForPage({
            companyId,
            channelId,
            userIdList
        }, [
            TlChannelUserDef.companyId,
            TlChannelUserDef.userId,
            TlChannelUserDef.roleId,
            TlChannelUserDef.type,
            TlChannelUserDef.status,
            TlChannelUserDef.createdAt
        ], page, limit)

        total = await channelUserService.getCountByChannelIdAndUserIdList({
            companyId,
            channelId,
            userIdList
        })
    }

    if(list.length == 0){
        return tlResponseSuccess("获取成功", {
            list: [],
            count: 0
        })
    }

    // 获取用户信息
    const userIdList = list.map(item => item[TlChannelUserDef.userId])
    const userList = await userService.getListByIdList({
        companyId,
        idList: userIdList
    }, [
        TlUserDef.id,
        TlUserDef.name,
        TlUserDef.avatarUrl
    ])
    let userMap = {}
    userList.forEach(item => {
        userMap[item[TlUserDef.id]] = item
    })

    let resultList = []

    for(let i = 0; i < list.length; i++){
        const item = list[i]
        const companyId = item[TlChannelUserDef.companyId]
        const userId = item[TlChannelUserDef.userId]
        const userInfo = userMap[userId] || {}
        const username = userInfo[TlUserDef.name] || ''
        const userAvatar = userInfo[TlUserDef.avatarUrl] || ''

        let roleId = item[TlChannelUserDef.roleId]
        let roleIdStr = ''
        if(roleId == TlRoleInner.channel.creator.id){
            roleIdStr = TlRoleInner.channel.creator.name
        }else if (roleId == TlRoleInner.channel.admin.id){
            roleIdStr = TlRoleInner.channel.admin.name
        }else if (roleId == TlRoleInner.channel.member.id){
            roleIdStr = TlRoleInner.channel.member.name
        }else{
            roleIdStr = '未知'
        }

        let type = item[TlChannelUserDef.type]
        let typeStr = TlChannelUserType.toStr(type)
        let typeZnStr = TlChannelUserType.toZnStr(type)

        let status = item[TlChannelUserDef.status]
        let statusStr = TlChannelUserStatus.toStr(status)
        let statusZnStr = TlChannelUserStatus.toZnStr(status)

        resultList.push({
            userId,
            companyId,
            username,
            userAvatar: await getAvatarOssUrl(userAvatar),
            roleId,
            roleIdStr,
            type,
            typeStr,
            typeZnStr,
            status,
            statusStr,
            statusZnStr,
            createTime: item[TlChannelUserDef.createdAt]
        })
    }

    return tlResponseSuccess("获取成功", {
        list: resultList,
        count: total
    })
}

/**
 * 添加群聊频道 - 管理端
 * @param {*} channelName
 * @param {*} loginInfo
 * @param {*} companyId
 * @param {*} userId
 * @param {*} canSearch
 */
const adminAddChannel = async function({
    channelName, companyId, userId, loginInfo, canSearch
}){
    if(!channelName){
        return tlResponseArgsError("请求参数错误")
    }

    channelName = channelName.trim()
    if(!channelName){
        return tlResponseArgsError("请求参数错误")
    }

    if(channelName.length > 64){
        return tlResponseArgsError("频道名称长度不能超过64个字符")
    }

    if(!checkIsId(companyId)){
        return tlResponseArgsError("请求参数错误")
    }

    if(!checkIsId(userId)){
        return tlResponseArgsError("请求参数错误")
    }

    companyId = parseInt(companyId)
    userId = parseInt(userId)

    const {
        loginUserCompanyId, loginUserId, loginUserRoleId
    } = loginInfo

    if(loginUserRoleId !== TlRoleInner.user.admin.id){
        return tlResponseForbidden("非法用户")
    }

    const companyInfo = await companyService.getInfoById({
        id: companyId
    })

    if(Object.keys(companyInfo).length == 0){
        return tlResponseNotFound("企业不存在")
    }

    const userInfo = await userService.getInfoById({
        companyId: companyId,
        id: userId
    })

    if(Object.keys(userInfo).length == 0){
        return tlResponseNotFound("用户不存在")
    }

    let flag = 0
    if(canSearch){
        flag = setBit(flag, TlChannelFlag.GROUP_CAN_BE_SEARCH, true)
    }else {
        flag = setBit(flag, TlChannelFlag.GROUP_CAN_BE_SEARCH, false)
    }

    const channelInfo = await channelService.addInfo({
        companyId: companyId,
        name: channelName,
        type: TlChannelType.GROUP,
        flag
    })

    if(Object.keys(channelInfo).length === 0){
        return tlResponseSvrError("创建频道失败")
    }

    // 添加频道用户信息
    const channelUserInfo = await channelUserService.addInfo({
        companyId: companyId,
        channelId: channelInfo[TlChannelDef.id],
        type: TlChannelUserType.GROUP,
        userId: userId,
        roleId : TlRoleInner.channel.creator.id,
    })

    if(Object.keys(channelUserInfo).length === 0){
        return tlResponseSvrError("创频道失败")
    }

    // 更新用户频道角色
    await userSessionService.updateUserChannelRoleMap({
        userId,
        channelRoleMap: {
            [channelInfo[TlChannelDef.id]]: TlRoleInner.channel.creator.id,
        }
    })

    // 生成一条系统消息
    const channelChatSystemInfo = await channelChatService.addSystemChatnfo({
        companyId: loginUserCompanyId,
        channelId: channelInfo[TlChannelDef.id],
        message: '<p>' + `系统管理员为${userInfo[TlUserDef.name]}创建了群聊${channelName}` + '</p>',
        other: JSON.stringify({
            [TlChannelChatOther.ip]: '',
        }),
        messageTimeStamp: Date.now(),
        messageVersion: 'v1',
        flag: 0
    })

    if(Object.keys(channelChatSystemInfo).length == 0){
        return tlConsoleError("添加新频道, 生成系统消息失败")
    }

    return tlResponseSuccess("创建成功", {
        channelId: channelInfo[TlChannelDef.id]
    })
}



module.exports = {
    addChannel, 
    getChannelList,
    updateChannelName, 
    getChannelInfo,
    getChannelNameById, 
    searchChannelById,
    updateChannelCanSearch,

    searchChannelChatList,
    getChannelChatList,
    getChannelChatListByChannelIdList,
    getChannelGroupList,

    adminUpdateChannel,
    adminDeleteChannel,
    adminGetChannelList,
    adminAddChannel,
    adminGetChannelUserList
}