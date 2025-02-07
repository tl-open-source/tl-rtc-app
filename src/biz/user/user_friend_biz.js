const { 
    tlResponseArgsError, tlResponseForbidden, tlResponseSvrError, 
    tlResponseTimeout, tlResponseNotFound, tlResponseSuccess,
    setBit, checkBit,
    tlConsole
} = require('../../utils/utils')
const userFriendService = require('../../service/user/tl_user_friend_service')
const userService = require('../../service/user/tl_user_service')
const userSessionService = require('../../service/user/tl_user_session_service')
const channelService = require('../../service/channel/tl_channel_service')
const channelUserService = require('../../service/channel/tl_channel_user_service')
const channelChatService = require('../../service/channel/tl_channel_chat_service')
const { getOssUrl } = require('../../utils/oss/oss')

const { fields: userFriendFields } = require('../../tables/tl_user_friend')
const { fields: userFields } = require('../../tables/tl_user')
const { fields: channelFields } = require('../../tables/tl_channel')
const { fields: channelUserFields } = require('../../tables/tl_channel_user')
const { inner: TlRoleInner } = require('../../tables/tl_role')
const { fields: channelChatFields } = require('../../tables/tl_channel_chat')

const {  Def: TlUserFriendDef, Status: TlUserFriendStatus, FriendType: TlUserFriendType,  Origin: TlUserFriendOrigin } = userFriendFields

const { Def: TlUserDef } = userFields
const { Def: TlChannelDef, Type: TlChannelType } = channelFields
const { Def: TlChannelChatDef, Other: TlChannelChatOther } = channelChatFields
const { Def: TlchannelUserDef, Type: TlChannelUserType } = channelUserFields




/**
 * 获取好友列表
 * @param {*} loginInfo
 */
const getFriendList = async function({ loginInfo }){
    const {
        loginUserCompanyId, loginUserId, loginUserCompanyName
    } = loginInfo

    // 查询所有好友记录
    let userFriendList = await userFriendService.getListByUserId({
        companyId: loginUserCompanyId,
        userId: loginUserId,
    }, [
        TlUserFriendDef.id,
        TlUserFriendDef.friendId,
        TlUserFriendDef.origin,
        TlUserFriendDef.createdAt,
        TlUserFriendDef.friendType,
        TlUserFriendDef.remark,
        TlUserFriendDef.channelId,
    ])

    const friendIdList = new Set(
        [...userFriendList.map(item => item[TlUserFriendDef.friendId])]
    )

    let userInfoList = await userService.getListByIdList({
        companyId: loginUserCompanyId,
        idList: [...friendIdList]
    }, [
        TlUserDef.id,
        TlUserDef.name,
        TlUserDef.email,
        TlUserDef.mobile,
        TlUserDef.avatarUrl,
    ])

    let userInfoMap = new Map()
    userInfoList.forEach(item => {
        userInfoMap.set(item[TlUserFriendDef.id], item)
    })

    // 查询好友在线状态
    const statusMap = await userSessionService.getUserLoginStatusByIdList({
        userIdList: [...friendIdList]
    })

    let resultList = []
    for(let i = 0; i < userFriendList.length; i++){
        const item = userFriendList[i]
        let originStr = ''
        const origin = item[TlUserFriendDef.origin]
        if(origin == TlUserFriendOrigin.SEARCH_NAME){
            originStr = "搜索用户名添加"
        }

        const friendId = item[TlUserFriendDef.friendId]
        let friendInfo = userInfoMap.get(friendId)
        if(!friendInfo){
            friendInfo = {}
        }

        const loginStatus = statusMap[friendId+''] || 0

        let friendTypeStr = ''
        let friendType = item[TlUserFriendDef.friendType]
        if(friendType == TlUserFriendType.NORMAL){
            friendTypeStr = '普通好友'
        }else if(friendType == TlUserFriendType.SPECIAL){
            friendTypeStr = '特别关注'
        }

        resultList.push({
            id : item[TlUserFriendDef.id],
            origin : originStr,
            friendType: friendTypeStr,
            remark: item[TlUserFriendDef.remark],
            createTime: item[TlUserFriendDef.createdAt],
            channelId: item[TlUserFriendDef.channelId],
            loginStatus: loginStatus,
            userId: friendInfo[TlUserDef.id],
            userCompanyName: loginUserCompanyName,
            username: friendInfo[TlUserDef.name],
            userEmail: friendInfo[TlUserDef.email],
            userMobile: friendInfo[TlUserDef.mobile],
            userAvatar: await getOssUrl(friendInfo[TlUserDef.avatarUrl]),
        })
    }

    return tlResponseSuccess("获取好友列表成功", resultList)
}


/**
 * 删除好友
 * @param {*} loginInfo
 * @param {*} channelId
 */
const deleteFriend = async function({ loginInfo, channelId }){
    if(!channelId){
        return tlResponseArgsError("请求参数为空")
    }

    const {
        loginUserCompanyId, loginUserId
    } = loginInfo

    // 获取频道用户
    const channelUserInfo = await channelUserService.getInfoByChannelIdAndUserId({
        companyId: loginUserCompanyId,
        channelId,
        userId: loginUserId
    }, [
        TlchannelUserDef.id,
        TlchannelUserDef.type
    ])

    if(Object.keys(channelUserInfo).length == 0){
        return tlResponseNotFound("删除好友成功")
    }

    const channelType = channelUserInfo[TlchannelUserDef.type]
    if(channelType !== TlChannelUserType.FRIEND){
        return tlResponseNotFound("删除失败，操作非法")
    }

    // 删除自己在频道的数据
    await channelUserService.deleteInfoById({
        companyId: loginUserCompanyId,
        id: channelUserInfo[TlchannelUserDef.id]
    })

    // 获取好友关系
    const userFriendInfo = await userFriendService.getInfoByChannelIdAndUserId({
        companyId: loginUserCompanyId,
        userId: loginUserId,
        channelId: channelId
    }, [
        TlUserFriendDef.id,
    ])

    if(Object.keys(userFriendInfo).length == 0){
        return tlResponseNotFound("删除好友成功")
    }

    const userFriendId = userFriendInfo[TlUserFriendDef.id]
    if(!userFriendId){
        return tlResponseNotFound("删除好友成功")
    }

    // 删除好友关系
    await userFriendService.deleteInfoById({
        companyId: loginUserCompanyId,
        id: userFriendId
    })

    return tlResponseSuccess("删除好友成功")
}


/**
 * 更新好友信息备注
 * @param loginInfo
 * @param channelId
 * @param remark
 */
const updateRemark = async function({ loginInfo, channelId, remark }){
    if(!channelId){
        return tlResponseArgsError("请求参数为空")
    }

    if(!remark){
        return tlResponseArgsError("请求参数为空")
    }

    const {
        loginUserCompanyId, loginUserId
    } = loginInfo

    // 获取频道用户列表
    const userFriendList = await userFriendService.getListByChannelId({
        companyId: loginUserCompanyId,
        channelId,
    }, [
        TlUserFriendDef.id,
        TlUserFriendDef.userId,
    ])

    const friendInfo = userFriendList.find(item => item[TlUserFriendDef.userId] == loginUserId)
    if(!friendInfo){
        return tlResponseNotFound("好友不存在")
    }

    const userFriendId = friendInfo[TlUserFriendDef.id]
    
    const info = await userFriendService.updateInfoById({
        companyId: loginUserCompanyId,
        id: userFriendId,
    }, {
        [TlUserFriendDef.remark]: remark
    })

    if(Object.keys(info).length == 0){
        return tlResponseSvrError("修改好友备注失败")
    }

    return tlResponseSuccess("修改好友备注成功")
}

/**
 * 更新好友名称备注
 * @param loginInfo
 * @param channelId
 * @param rename
 */
const updateRename = async function({ loginInfo, channelId, rename }){
    if(!channelId){
        return tlResponseArgsError("请求参数为空")
    }

    if(!rename){
        return tlResponseArgsError("请求参数为空")
    }

    const {
        loginUserCompanyId, loginUserId
    } = loginInfo

    // 获取频道用户列表
    const userFriendList = await userFriendService.getListByChannelId({
        companyId: loginUserCompanyId,
        channelId,
    }, [
        TlUserFriendDef.id,
        TlUserFriendDef.userId,
    ])

    const friendInfo = userFriendList.find(item => item[TlUserFriendDef.userId] == loginUserId)
    if(!friendInfo){
        return tlResponseNotFound("好友不存在")
    }

    const userFriendId = friendInfo[TlUserFriendDef.id]
    const info = await userFriendService.updateInfoById({
        companyId: loginUserCompanyId,
        id: userFriendId,
    }, {
        [TlUserFriendDef.rename]: rename
    })

    if(Object.keys(info).length == 0){
        return tlResponseSvrError("修改好友备注失败")
    }

    return tlResponseSuccess("修改好友备注成功")
}


/**
 * 通过好友后-初始化好友频道
 * @param {*} loginUserCompanyId
 * @param {*} loginUserId
 * @param {*} applyUserId
 * @returns 
 */
const initChannelForPassFriend = async function({ 
    loginUserCompanyId, loginUserId, applyUserId 
}){
    if(!applyUserId){
        return tlResponseArgsError("初始化好友频道失败，请求参数为空")
    }

    // 获取这两个人的用户频道信息
    const channelUserList = await channelUserService.getListByTypeUserIdList({
        companyId: loginUserCompanyId,
        type: TlChannelUserType.FRIEND,
        userIdList: [loginUserId, applyUserId]
    }, [
        TlchannelUserDef.id,
        TlchannelUserDef.userId,
        TlchannelUserDef.channelId,
    ])

    const channelMap = {}
    channelUserList.forEach(item => {
        const userId = item[TlchannelUserDef.userId]
        const channelId = item[TlchannelUserDef.channelId]
        if(!channelMap[userId]){
            channelMap[userId] = []
        }
        channelMap[userId].push(channelId)
    })

    // 如果两个用户存在相同的channelId，说明已经存在相应的好友频道
    const loginUserIdChannelIdList = channelMap[loginUserId] || []
    const applyUserIdChannelIdList = channelMap[applyUserId] || []

    const existChannelId = loginUserIdChannelIdList.find(item => applyUserIdChannelIdList.includes(item))
    // 如果已经存在频道用户数据，直接返回
    if(existChannelId){
        return tlResponseSuccess("初始化好友频道成功1", { channelId: existChannelId })
    }

    // 创建新频道
    const channelInfo = await channelService.addInfo({
        companyId: loginUserCompanyId,
        name: '好友频道',
        type: TlChannelType.FRIEND,
    })

    if(Object.keys(channelInfo).length == 0){
        return tlResponseSvrError("初始化好友频道失败")
    }

    const channelId = channelInfo[TlChannelDef.id]

    // 生成一条系统消息
    const channelChatSystemInfo = await channelChatService.addSystemChatnfo({
        companyId: loginUserCompanyId,
        channelId: channelId,
        message: '<p>' + `已经是好友啦，快来聊天吧` + '</p>',
        other: JSON.stringify({
            [TlChannelChatOther.ip]: '',
        }),
        messageTimeStamp: Date.now(),
        messageVersion: 'v1',
        flag: 0
    })

    if(Object.keys(channelChatSystemInfo).length == 0){
        return tlResponseSvrError("初始化好友频道失败")
    }

    // 将自己加入单聊频道
    const addSelfRes = await channelUserService.addInfo({
        companyId: loginUserCompanyId,
        channelId: channelId,
        userId: loginUserId,
        type: TlChannelUserType.FRIEND,
        roleId: TlRoleInner.channel.creator.id
    })

    if(Object.keys(addSelfRes).length == 0) {
        return tlResponseSvrError("初始化好友频道失败")
    }

    // 更新用户频道角色
    await userSessionService.updateUserChannelRoleMap({
        userId: loginUserId,
        channelRoleMap: {
            [channelId]: TlRoleInner.channel.creator.id
        }
    })

    // 将好友加入单聊频道
    const addFriendRes = await channelUserService.addInfo({
        companyId: loginUserCompanyId,
        channelId: channelId,
        userId: applyUserId,
        type: TlChannelUserType.FRIEND,
        roleId: TlRoleInner.channel.creator.id
    })

    if(Object.keys(addFriendRes).length == 0) {
        return tlResponseSvrError("初始化好友频道失败")
    }

    // 更新用户频道角色
    await userSessionService.updateUserChannelRoleMap({
        userId: applyUserId,
        channelRoleMap: {
            [channelId]: TlRoleInner.channel.creator.id
        }
    })
    
    return tlResponseSuccess("初始化好友频道成功2", { channelId })
}


/**
 * 通过好友后 - 生成双向好友记录
 * @param {*} loginUserCompanyId
 * @param {*} loginUserId
 * @param {*} applyUserId
 * @param {*} applyUserName
 * @param {*} origin
 * @param {*} remark
 * @param {*} channelId
 */
const initUserFriendForPassFriend = async function({ 
    loginUserCompanyId, loginUserId, loginUsername, applyUserId, applyUserName, origin, remark, channelId
}){
    if(!applyUserId){
        return tlResponseForbidden("生成好友记录失败，参数错误")
    }
    
    // 好友记录是否存在
    const userFriendInfo = await userFriendService.getInfoByUserIdAndFriendId({
        companyId: loginUserCompanyId,
        userId: loginUserId,
        friendId: applyUserId
    }, [
        TlUserFriendDef.id,
    ])

    // 存在，更新好友记录状态
    if(Object.keys(userFriendInfo).length > 0){
        const updateUserFriendInfo = await userFriendService.updateInfoById({
            companyId: loginUserCompanyId,
            id: userFriendInfo[TlUserFriendDef.id],
        }, {
            [TlUserFriendDef.status]: TlUserFriendStatus.NORMAL
        })

        if(Object.keys(updateUserFriendInfo).length == 0){
            return tlResponseSvrError("生成好友记录失败")
        }

        return tlResponseSuccess("生成好友记录成功")
    }

    // 不存在，生成双向好友记录
    const addUserFriendInfo = await userFriendService.addInfo({
        companyId: loginUserCompanyId,
        userId: loginUserId,
        friendId: applyUserId,
        origin: origin,
        remark: remark,
        friendType: TlUserFriendType.NORMAL,
        status: TlUserFriendStatus.NORMAL,
        channelId: channelId,
        rename: applyUserName
    })
    
    if(Object.keys(addUserFriendInfo).length == 0){
        return tlResponseSvrError("生成好友记录失败")
    }

    const addFriendUserInfo = await userFriendService.addInfo({
        companyId: loginUserCompanyId,
        userId: applyUserId,
        friendId: loginUserId,
        origin: origin,
        remark: remark,
        friendType: TlUserFriendType.NORMAL,
        status: TlUserFriendStatus.NORMAL,
        channelId: channelId,
        rename: loginUsername
    })

    if(Object.keys(addFriendUserInfo).length == 0){
        return tlResponseSvrError("生成好友记录失败")
    }

    return tlResponseSuccess("生成好友记录成功")
}

/**
 * 更新好友类型
 * @param {*} loginInfo
 * @param {*} channelId
 * @param {*} special
 */
const updateFriendSpecical = async function({ loginInfo, channelId, special }){
    if(!channelId){
        return tlResponseArgsError("请求参数为空")
    }

    if(special === undefined || special === null){ 
        return tlResponseArgsError("请求参数为空")
    }

    const {
        loginUserCompanyId, loginUserId
    } = loginInfo

    // 获取频道用户列表
    const userFriendList = await userFriendService.getListByChannelId({
        companyId: loginUserCompanyId,
        channelId,
    }, [
        TlUserFriendDef.id,
        TlUserFriendDef.userId,
    ])

    const friendInfo = userFriendList.find(item => item[TlUserFriendDef.userId] == loginUserId)
    if(!friendInfo){
        return tlResponseNotFound("好友不存在")
    }

    const newFriendType = special ? TlUserFriendType.SPECIAL : TlUserFriendType.NORMAL

    const userFriendId = friendInfo[TlUserFriendDef.id]
    const info = await userFriendService.updateInfoById({
        companyId: loginUserCompanyId,
        id: userFriendId,
    }, {
        [TlUserFriendDef.friendType]: special ? TlUserFriendType.SPECIAL : TlUserFriendType.NORMAL
    })

    if(Object.keys(info).length == 0){
        return tlResponseSvrError("关注失败")
    }

    let friendTypeStr = ''
    if(newFriendType == TlUserFriendType.NORMAL){
        friendTypeStr = '普通好友'
    }else if(newFriendType == TlUserFriendType.SPECIAL){
        friendTypeStr = '特别关注'
    }

    return tlResponseSuccess(special ? '关注成功' : '取消关注成功', {
        friendType: friendTypeStr
    })
}



module.exports = {
    getFriendList,
    deleteFriend,
    updateRemark,
    updateRename,
    initChannelForPassFriend,
    initUserFriendForPassFriend,
    updateFriendSpecical
}