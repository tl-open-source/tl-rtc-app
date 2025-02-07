const { 
    tlResponseArgsError, tlResponseForbidden, tlResponseSvrError, 
    tlResponseTimeout, tlResponseNotFound, tlResponseSuccess,
    tlConsoleError, setBit,
    checkBit,
    tlConsole
} = require('../../utils/utils')
const { getOssUrl, getAvatarOssUrl } = require('../../utils/oss/oss')
const channelService = require('../../service/channel/tl_channel_service')
const channelChatService = require('../../service/channel/tl_channel_chat_service')
const channelUserService = require('../../service/channel/tl_channel_user_service')
const userSessionService = require('../../service/user/tl_user_session_service')
const userReadService = require('../../service/user/tl_user_read_service')
const userService = require('../../service/user/tl_user_service')
const userFriendService = require('../../service/user/tl_user_friend_service')

const { fields: channelChatFields } = require('../../tables/tl_channel_chat')
const { fields: channelUserFields} = require('../../tables/tl_channel_user')
const { fields: userReadFields } = require('../../tables/tl_user_read')
const { fields: channelFields } = require('../../tables/tl_channel')
const { fields: userFields } = require('../../tables/tl_user')
const { fields: userFriendFields } = require('../../tables/tl_user_friend')
const { inner: TlRoleInner } = require('../../tables/tl_role')

const { 
    Def: TlChannelDef, Type: TlChannelType, 
    Status: TlChannelStatus 
} = channelFields
const { 
    Def: TlChannelUserDef, Type: TlChannelUserType, 
    Flag: TlChannelUserFlag 
} = channelUserFields
const { 
    Def: TlUserDef 
} = userFields
const { 
    Def: TlRoleInnerDef 
} = TlRoleInner
const { 
    Def: TlChannelChatDef, Type: TlChannelChatType, 
    Other: TlChannelChatOther, Flag: TlChannelChatFlag 
} = channelChatFields
const { 
    Def: TlUserReadDef, Type: TlUserReadType 
} = userReadFields
const { 
    Def: TlUserFriendDef 
} = userFriendFields


/**
 * 根据频道id搜索频道
 * @param {*} channelId
 * @param {*} loginInfo 
 * @returns 
 */
const searchChannelById = async function({channelId, loginInfo}){
    if(!channelId){
        return tlResponseArgsError("请求参数为空")
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
    if(channelType === TlChannelType.FRIEND){
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

    return tlResponseSuccess("获取频道信息成功", {
        channelId: channelId,
        channelName: channelInfo[TlChannelDef.name],
        channelAvatar: channelAvatar,
        channelUserCount: channelUserCount,
        channelType: 'group',
        isChannelUser: isChannelUser,
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
        return tlResponseArgsError("请求参数为空")
    }

    channelName = channelName.trim()
    if(!channelName){
        return tlResponseArgsError("请求参数为空")
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

    return tlResponseSuccess("添加频道成功", {
        channelId: channelInfo[TlChannelDef.id]
    })
}


/**
 * 修改频道名称
 * @param {*} channelId
 * @param {*} channelName
 * @param {*} loginInfo
 */
const updateChannel = async function({channelId, channelName, loginInfo}){
    if(!channelId){
        return tlResponseArgsError("请求参数为空")
    }

    if(!channelName){
        return tlResponseArgsError("请求参数为空")
    }

    const {
        loginUserCompanyId, loginUserId
    } = loginInfo

    const channelInfo = await channelService.updateInfoById({
        companyId: loginUserCompanyId, channelId
    }, {
        name: channelName,
    })

    if(Object.keys(channelInfo).length == 0){
        return tlResponseSvrError("修改频道失败")
    }

    return tlResponseSuccess("修改频道成功")
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

    return tlResponseSuccess("获取频道列表成功", resultList)
}


/**
 * 获取频道简单列表
 * @param {*} loginInfo
 */
const getChannelSimpleList = async function({loginInfo}){
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
    // 获取频道列表
    const channelList = await channelService.getListByIdList({
        companyId: loginUserCompanyId,
        idList: channelIdList
    }, [
        TlChannelDef.id,
        TlChannelDef.name,
        TlChannelDef.type,
    ])

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

        const channelType = channel[TlChannelDef.type]
        let channelTypeStr = ''
        if(channelType === TlChannelType.GROUP){
            channelTypeStr = "group"
        }else if(channelType === TlChannelType.FRIEND){
            channelTypeStr = "friend"
        }

        // 如果是好友频道，替换频道名称,头像为好友名称
        const friendInfo = channelUserFriendMap[channelId] || {}
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
            channelAvatar = await getOssUrl(friendInfo[TlUserDef.avatarUrl])
        }

        resultList.push({
            channelId: channelId,
            channelName: channelName,
            channelReName: channelReName,
            channelType: channelType === TlChannelType.GROUP ? "group" : "friend",
            channelAvatar: channelAvatar,
        })
    }

    return tlResponseSuccess("获取频道列表成功", resultList)
}


/**
 * 获取单个频道信息
 * @param {*} loginInfo
 * @param {*} channelId
 */
const getChannelInfo = async function({loginInfo, channelId}){
    if(!channelId){
        return tlResponseArgsError("请求参数为空")
    }

    const {
        loginUserCompanyId, loginUserId
    } = loginInfo

    const channelIdList = [channelId]

    resultList = await initChannelListInfo({
        channelIdList, loginUserCompanyId, loginUserId
    })

    if(resultList.length == 0){
        return tlResponseNotFound("频道不存在")
    }

    return tlResponseSuccess("获取频道数据成功", resultList[0])
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
        TlChannelUserDef.flag
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

        const channelType = channel[TlChannelDef.type]
        let channelTypeStr = ''
        if(channelType === TlChannelType.GROUP){
            channelTypeStr = "group"
        }else if(channelType === TlChannelType.FRIEND){
            channelTypeStr = "friend"
        }

        // 如果是好友频道，替换频道名称,头像为好友名称
        const friendInfo = channelUserFriendMap[channelId] || {}

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
            channelAvatar = await getOssUrl(friendInfo[TlUserDef.avatarUrl])
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
        return tlResponseArgsError("请求参数为空")
    }

    if(!channelName){
        return tlResponseArgsError("请求参数为空")
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

    const updateChannelInfo = await channelService.updateInfoById({
        companyId: loginUserCompanyId, 
        id: channelId
    }, {
        name: channelName,
    })

    if(Object.keys(updateChannelInfo).length == 0){
        return tlResponseSvrError("修改频道名称失败")
    }

    return tlResponseSuccess("修改频道名称成功")
}


/**
 * 获取频道名称
 * @param {*} channelId 
 * @param {*} loginInfo
 * @returns 
 */
const getChannelNameById = async function({ loginInfo, channelId}){
    if(!channelId){
        return tlResponseArgsError("请求参数为空")
    }

    const {
        loginUserCompanyId, loginUserId
    } = loginInfo

    const channelInfo = await channelService.getInfoById({
        companyId: loginUserCompanyId, 
        id: channelId
    }, [
        TlChannelDef.name
    ])

    if(Object.keys(channelInfo).length == 0){
        return tlResponseSuccess("获取成功", {
            channelName: ''
        })
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
 */
const getChannelChatList = async function ({
    loginInfo, channelId, chatMinId,
}) {
    if (!channelId) {
        return tlResponseArgsError("请求参数为空")
    }

    const {
        loginUserCompanyId, loginUserId
    } = loginInfo

    // 按时间范围获取聊天记录，拿第一页的数据即可
    // 调整pageSize需要同步调整前端 更新channelMessageAllLoad逻辑
    const page = 1
    const pageSize = 20

    chatMinId = parseInt(chatMinId)

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

    let chatPromise = null

    // 聊天消息
    if(chatMinId !== -1){
        chatPromise = channelChatService.getListByChannelIdAndMinIdForPage({
            companyId: loginUserCompanyId, channelId,
            minId: chatMinId,
        }, [
            TlChannelChatDef.id,
            TlChannelChatDef.channelId,
            TlChannelChatDef.type,
            TlChannelChatDef.flag,
            TlChannelChatDef.other,
            TlChannelChatDef.fromUserId,
            TlChannelChatDef.fromUserName,
            TlChannelChatDef.toUserId,
            TlChannelChatDef.toUserName,
            TlChannelChatDef.createdAt,
            TlChannelChatDef.message,
            TlChannelChatDef.messageTimeStamp,
            TlChannelChatDef.messageVersion,
        ], page, pageSize)
    }

    let [
        chatList
    ] = await Promise.all([
        chatPromise
    ])

    if(!chatList){
        chatList = []
    }

    let userIdList = chatList.map(item => item[TlChannelChatDef.fromUserId])

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
            }
        }
    })

    // 回复文本消息, 目前回复只支持回复文本消息
    let replyChatMessageMap = {}
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
        chatList, userChannelReadMap: {
            [channelId]: userReadMap
        }, userAvatarMap, replyChatMessageMap, 
    })

    let resultList = resultMap[channelId] || []

    return tlResponseSuccess("获取频道聊天列表成功", resultList)
}


/**
 * 获取频道列表聊天记录
 * @param {*} loginInfo
 * @param {*} channelIdList
 */
const getChannelChatListByChannelIdList = async function ({loginInfo, channelIdList}) {
    if (!channelIdList) {
        return tlResponseArgsError("请求参数为空")
    }

    const {
        loginUserCompanyId, loginUserId
    } = loginInfo

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

    // 聊天消息
    let chatList = []
    let chatPromiseList = []
    for (let i = 0; i < channelIdList.length; i++) {
        const channelId = channelIdList[i]
        
        chatPromiseList.push(
            channelChatService.getListByChannelIdAndMaxIdForPage({
                companyId: loginUserCompanyId, channelId, 
                maxId: userChannelReadMap[channelId][TlUserReadType.CHAT] || 1,
            }, [
                TlChannelChatDef.id,
                TlChannelChatDef.channelId,
                TlChannelChatDef.type,
                TlChannelChatDef.flag,
                TlChannelChatDef.other,
                TlChannelChatDef.fromUserId,
                TlChannelChatDef.fromUserName,
                TlChannelChatDef.toUserId,
                TlChannelChatDef.toUserName,
                TlChannelChatDef.createdAt,
                TlChannelChatDef.message,
                TlChannelChatDef.messageTimeStamp,
                TlChannelChatDef.messageVersion,
            ], 1, 99)
        )
    }

    const chatPromiseResult = await Promise.all(chatPromiseList)
    for (let i = 0; i < chatPromiseResult.length; i++) {
        if(!chatPromiseResult[i]){
            chatPromiseResult[i] = []
        }
        chatList = chatList.concat(chatPromiseResult[i])
        userIdList = userIdList.concat(chatPromiseResult[i].map(item => item[TlChannelChatDef.fromUserId]))
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
            }
        }
    })

    // 回复文本消息
    let replyChatMessageMap = {}
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
        chatList, userChannelReadMap, userAvatarMap,
        replyChatMessageMap,
    })

    return tlResponseSuccess("获取频道列表聊天记录成功", resultMap)
}


/**
 * 初始化频道聊天列表结构
 * @param {*} chatList
 * @param {*} userAvatarMap
 * @param {*} userChannelReadMap
 * @param {*} replyMessageMap
 */
const initChannelChatList = async function({
    chatList, userAvatarMap, userChannelReadMap, 
    replyChatMessageMap
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

    return tlResponseSuccess("获取频道列表成功", resultList)
}



module.exports = {
    addChannel, 
    updateChannel, 
    getChannelList,
    updateChannelName, 
    getChannelInfo,
    getChannelNameById, 
    getChannelSimpleList,
    searchChannelById,

    getChannelChatList,
    getChannelChatListByChannelIdList,
    getChannelGroupList
}