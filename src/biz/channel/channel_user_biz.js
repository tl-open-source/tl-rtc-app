const { 
    tlResponseArgsError, tlResponseForbidden, tlResponseSvrError, 
    tlResponseTimeout, tlResponseNotFound, tlResponseSuccess, setBit, checkBit
} = require('../../utils/utils')
const channelService = require('../../service/channel/tl_channel_service')
const channelUserService = require('../../service/channel/tl_channel_user_service')
const channelChatService = require('../../service/channel/tl_channel_chat_service')
const userService = require('../../service/user/tl_user_service')
const userFriendService = require('../../service/user/tl_user_friend_service')
const userSessionService = require('../../service/user/tl_user_session_service')
const { inner: TlRoleInner } = require('../../tables/tl_role')
const { fields: channelUserFields } = require('../../tables/tl_channel_user')
const { fields: channelChatFields } = require('../../tables/tl_channel_chat')
const { fields: userFields } = require('../../tables/tl_user')
const { fields: userFriendFields } = require('../../tables/tl_user_friend')
const { fields: channelFields } = require('../../tables/tl_channel')
const { getOssUrl, getAvatarOssUrl } = require('../../utils/oss/oss')

const { Def: TlChannelUserDef, Type: TlChannelUserType, Flag: TlChannelUserFlag } = channelUserFields
const { Def : TlUserDef } = userFields
const { Def: TlUserFriendDef } = userFriendFields
const { Def: TlChannelDef, Type: TlChannelType } = channelFields
const { Def: TlChannelChatDef, Other: TlChannelChatOther } = channelChatFields

/**
 * 添加频道用户
 * @param {*} loginInfo
 * @param {*} channelId
 * @param {*} userId
 * @param {*} roleId
 */
const addChannelUser = async function({ loginInfo, channelId, userId, roleId }){
    if(!channelId){
        return tlResponseArgsError("请求参数为空")
    }

    if(!userId){
        return tlResponseArgsError("请求参数为空")
    }

    if(!roleId){
        return tlResponseArgsError("请求参数为空")
    }

    const {
        loginUserCompanyId, loginUserId, loginUsername
    } = loginInfo

    const channelInfo = await channelService.getInfoById({
        companyId: loginUserCompanyId,
        id: channelId
    }, [
        TlChannelDef.id,
        TlChannelDef.type
    ])

    if(Object.keys(channelInfo).length == 0){
        return tlResponseArgsError("频道不存在")
    }

    const channelType = channelInfo[TlChannelDef.type]
    if (channelType != TlChannelType.GROUP){
        return tlResponseArgsError("频道非法操作")
    }

    const channelUser = await channelUserService.getInfoByChannelIdAndUserId({
        companyId: loginUserCompanyId,
        channelId,
        userId,
    }, [
        TlChannelUserDef.userId
    ])

    if(Object.keys(channelUser).length > 0){
        return tlResponseArgsError("频道用户已存在")
    }

    const userInfo = await userService.getInfoById({
        companyId: loginUserCompanyId,
        id: userId,
    },[
        TlUserDef.name
    ])

    // 生成邀请消息
    const channelMessage = await channelChatService.addSystemChatnfo({
        companyId: loginUserCompanyId,
        channelId,
        message: '<p>' + loginUsername + "邀请 " + userInfo[TlUserDef.name] + "加入频道" + '</p>',
        other: JSON.stringify({
            [TlChannelChatOther.ip]: '',
        }),
        messageTimeStamp: Date.now(),
        messageVersion: 'v1',
        flag: 0
    })

    if(Object.keys(channelMessage).length == 0){
        return tlResponseSvrError("添加频道用户失败")
    }
    
    // 添加频道用户
    const info = await channelUserService.addInfo({
        companyId: loginUserCompanyId,
        channelId,
        userId,
        type: TlChannelUserType.GROUP,
        roleId,
    })

    if(Object.keys(info).length == 0){
        return tlResponseSvrError("添加频道用户失败")
    }

    // 更新用户频道角色
    await userSessionService.updateUserChannelRoleMap({
        userId: loginUserId,
        channelRoleMap: {
            [channelId]: roleId
        }
    })

    return tlResponseSuccess("添加频道用户成功")
}

/**
 * 批量添加频道用户
 * @param {*} loginInfo
 * @param {*} channelId
 * @param {*} userIdList
 * @param {*} roleId
 */
const addChannelUserList = async function({ loginInfo, channelId, userIdList, roleId }){
    if(!channelId){
        return tlResponseArgsError("请求参数为空")
    }

    if(!userIdList){
        return tlResponseArgsError("请求参数为空")
    }

    if(userIdList.length == 0){
        return tlResponseArgsError("请求参数为空")
    }

    if(userIdList.length > 100){
        return tlResponseArgsError("邀请用户数量超过限制")
    }

    if(!roleId){
        return tlResponseArgsError("请求参数为空")
    }

    const {
        loginUserCompanyId, loginUserId, loginUsername
    } = loginInfo

    const channelInfo = await channelService.getInfoById({
        companyId: loginUserCompanyId,
        id: channelId
    }, [
        TlChannelDef.id,
        TlChannelDef.type
    ])

    if(Object.keys(channelInfo).length == 0){
        return tlResponseArgsError("频道不存在")
    }

    const channelType = channelInfo[TlChannelDef.type]
    if (channelType != TlChannelType.GROUP){
        return tlResponseArgsError("频道非法操作")
    }

    // userIdList去重
    userIdList = Array.from(new Set(userIdList))

    const existChannelUserList = await channelUserService.getListByChannelUserIdList({
        companyId: loginUserCompanyId,
        channelId,
        userIdList: userIdList,
    }, [
        TlChannelUserDef.userId
    ])

    if(existChannelUserList.length > 0){
        return tlResponseArgsError("部分频道用户已存在", {
            existUserIdList: existChannelUserList.map(item => item[TlChannelUserDef.userId])
        })
    }

    // 获取用户信息
    const userInfoList = await userService.getListByIdList({
        companyId: loginUserCompanyId,
        idList: userIdList,
    }, [
        TlUserDef.name
    ])

    // 生成邀请消息
    const channelMessage = await channelChatService.addSystemChatnfo({
        companyId: loginUserCompanyId,
        channelId,
        message: '<p>' + loginUsername + "邀请 " + userInfoList.map(
            item => item[TlUserDef.name]
        ).join(",") + " 共" + userInfoList.length + "人加入频道" + '</p>',
        other: JSON.stringify({
            [TlChannelChatOther.ip]: '',
        }),
        messageTimeStamp: Date.now(),
        messageVersion: 'v1',
        flag: 0
    })

    if(Object.keys(channelMessage).length == 0){
        return tlResponseSvrError("添加频道用户失败")
    }

    let infoList = []
    userIdList.forEach(userId => {
        infoList.push({
            companyId: loginUserCompanyId,
            channelId,
            userId,
            type: TlChannelUserType.GROUP,
            roleId,
        })
    })
    
    const list = await channelUserService.addInfoList({
        companyId: loginUserCompanyId,
        channelId,
        userInfoList: infoList,
    })

    if(list == null){
        return tlResponseSvrError("添加频道用户失败")
    }
    
    // 更新用户频道角色
    await userSessionService.batchUpdateUserChannelRoleMap({
        userIdList: userIdList,
        channelRoleMap: {
            [channelId]: roleId
        }
    })

    return tlResponseSuccess("添加频道用户成功", {
        id: channelMessage[TlChannelChatDef.id],
        message: channelMessage[TlChannelChatDef.message],
        type: channelMessage[TlChannelChatDef.type],
        createTime: channelMessage[TlChannelChatDef.createdAt],
        fromUserId: channelMessage[TlChannelChatDef.fromUserId],
        fromUserName: channelMessage[TlChannelChatDef.fromUserName],
        fromUserAvatar: await getAvatarOssUrl(),
        hasRead: false,
    })
}

/**
 * 分享加入群聊
 * @param {*} loginInfo
 * @param {*} channelId
 */
const shareJoinGroupChannel = async function({ loginInfo, channelId }){
    if(!channelId){
        return tlResponseArgsError("请求参数为空")
    }

    const {
        loginUserCompanyId, loginUserId, loginUsername
    } = loginInfo

    const channelInfo = await channelService.getInfoById({
        companyId: loginUserCompanyId,
        id: channelId
    }, [
        TlChannelDef.id,
        TlChannelDef.type
    ])

    if(Object.keys(channelInfo).length == 0){
        return tlResponseArgsError("频道不存在")
    }

    return addChannelUser({ 
        loginInfo, channelId, 
        userId: loginUserId, 
        roleId: TlRoleInner.channel.member.id 
    })
}


/**
 * 添加频道普通身份用户
 * @param {*} loginInfo
 * @param {*} channelId
 * @param {*} userId
 */
const addChannelUserNormal = async function({ loginInfo, channelId, userId }){
    return addChannelUser({ 
        loginInfo, channelId, userId, roleId: TlRoleInner.channel.member.id 
    })
}

/**
 * 批量添加频道普通身份用户
 * @param {*} loginInfo
 * @param {*} channelId
 * @param {*} userIdList
 */
const addChannelUserListNormal = async function({ loginInfo, channelId, userIdList }){
    return addChannelUserList({ 
        loginInfo, channelId, userIdList, roleId: TlRoleInner.channel.member.id 
    })
}

/**
 * 添加频道管理员身份用户
 * @param {*} loginInfo
 * @param {*} channelId
 * @param {*} userId
 */
const addChannelUserAdmin = async function({ loginInfo, channelId, userId }){
    return addChannelUser({ 
        loginInfo, channelId, userId, roleId: TlRoleInner.channel.admin.id 
    })
}


/**
 * 删除频道用户
 * @param {*} loginInfo
 * @param {*} channelUserId
 */
const deleteChannelUser = async function({ loginInfo, channelUserId }){
    if(!channelUserId){
        return tlResponseArgsError("请求参数为空")
    }

    const {
        loginUserId, loginUserCompanyId
    } = loginInfo
    
    const info = await channelUserService.deleteInfoById({
        companyId: loginUserCompanyId,
        id: channelUserId,
    })

    if(info == 0){
        return tlResponseSvrError("删除频道用户失败")
    }

    return tlResponseSuccess("删除频道用户成功")
}

/**
 * 修改频道用户身份权限为普通用户
 * @param {*} loginInfo
 * @param {*} channelUserId
 */
const updateChannelUserRoleNormal = async function({ loginInfo, channelUserId }){
    if(!channelUserId){
        return tlResponseArgsError("请求参数为空")
    }

    const {
        loginUserCompanyId, loginUserId
    } = loginInfo
    
    const info = await channelUserService.updateInfoById({
        companyId: loginUserCompanyId,
        id: channelUserId,
    },{
        roleId: TlRoleInner.channel.member.id,
    })

    return tlResponseSuccess("修改频道用户成功")
}

/**
 * 修改频道用户身份权限为管理员
 * @param {*} loginInfo
 * @param {*} channelUserId
 */
const updateChannelUserRoleAdmin = async function({ loginInfo, channelUserId }){
    if(!channelUserId){
        return tlResponseArgsError("请求参数为空")
    }

    const {
        loginUserCompanyId, loginUserId
    } = loginInfo
    
    const info = await channelUserService.updateInfoById({
        companyId: loginUserCompanyId,
        id: channelUserId,
    }, {
        roleId: TlRoleInner.channel.admin.id,
    })

    if(Object.keys(info).length == 0){
        return tlResponseSvrError("修改频道用户失败")
    }

    return tlResponseSuccess("修改频道用户成功")
}

/**
 * 获取频道用户列表
 * @param {*} loginInfo
 * @param {*} channelId
 */
const getChannelUserList = async function({ loginInfo, channelId }){
    if(!channelId){
        return tlResponseArgsError("请求参数为空")
    }

    const {
        loginUserCompanyId, loginUserId
    } = loginInfo
    
    const channelUserList = await channelUserService.getListByChannelId({
        companyId: loginUserCompanyId,
        channelId,
    }, [
        TlChannelUserDef.userId,
        TlChannelUserDef.roleId,
        TlChannelUserDef.channelId
    ])

    const userIdList = channelUserList.map(channelUser => channelUser[TlChannelUserDef.userId])

    // 获取用户信息
    const userList = await userService.getListByIdList({
        companyId: loginUserCompanyId, 
        idList: userIdList
    }, [
        TlUserDef.id,
        TlUserDef.name,
        TlUserDef.avatarUrl,
    ])
    
    const userMap = {}
    userList.forEach(user => userMap[user[TlUserDef.id]] = user)

    // 获取好友关系
    const friendList = await userFriendService.getListByUserIdAndFriendIdList({
        companyId: loginUserCompanyId,
        userId: loginUserId,
        friendIdList: userIdList
    }, [
        TlUserFriendDef.id,
        TlUserFriendDef.friendId,
        TlUserFriendDef.rename
    ])

    const firendMap = {}
    friendList.forEach(friend => firendMap[friend[TlUserFriendDef.friendId]] = friend)

    // 组装结果
    let resultList = []

    for(let i = 0; i < channelUserList.length; i++){
        const channelUser = channelUserList[i]

        const userId = channelUser[TlChannelUserDef.userId]
        const user = userMap[userId]
        if(!user){
            return
        }

        // 获取好友关系名称
        const friend = firendMap[userId] || {}
        let friendName = friend[TlUserFriendDef.rename] || ""
        let userFriendId = friend[TlUserFriendDef.id]

        resultList.push({
            userId: user[TlUserDef.id],
            username: user[TlUserDef.name],
            userAvatar: await getOssUrl(user[TlUserDef.avatarUrl]),
            friendName: friendName,
            userFriendId: userFriendId
        })
    }

    return tlResponseSuccess("获取单个频道用户列表成功", resultList)
}


/**
 * 获取频道列表的用户列表
 * @param {*} loginInfo
 */
const getChannelListUserList = async function({loginInfo}){
    const {
        loginUserCompanyId, loginUserId
    } = loginInfo

    // 获取自己所在的频道列表
    const selfShannelUserList = await channelUserService.getListByUserId({
        companyId: loginUserCompanyId,
        userId: loginUserId
    }, [
        TlChannelUserDef.channelId
    ])
    
    const channelIdList = selfShannelUserList.map(channelUser => channelUser[TlChannelUserDef.channelId])

    // 获取自己所在频道的所有用户列表
    const allChannelUserList = await channelUserService.getListByChannelIdList({
        companyId: loginUserCompanyId, 
        channelIdList
    }, [
        TlChannelUserDef.userId,
        TlChannelUserDef.channelId,
    ])

    const userIdList = allChannelUserList.map(channelUser => channelUser[TlChannelUserDef.userId])

    // 获取用户信息
    const userList = await userService.getListByIdList({
        companyId: loginUserCompanyId, 
        idList: userIdList
    }, [
        TlUserDef.id,
        TlUserDef.name,
        TlUserDef.avatarUrl,
    ])
    
    const userMap = {}
    userList.forEach(user => userMap[user[TlUserDef.id]] = user)

    // 获取好友关系
    const friendList = await userFriendService.getListByUserIdAndFriendIdList({
        companyId: loginUserCompanyId,
        userId: loginUserId,
        friendIdList: userIdList
    }, [
        TlUserFriendDef.id,
        TlUserFriendDef.friendId,
        TlUserFriendDef.rename
    ])

    const firendMap = {}
    friendList.forEach(friend => firendMap[friend[TlUserFriendDef.friendId]] = friend)

    // 组装结果
    let result = {}
    for(let i = 0; i < allChannelUserList.length; i++){
        const channelUser = allChannelUserList[i]

        const channelId = channelUser[TlChannelUserDef.channelId]
        const userId = channelUser[TlChannelUserDef.userId]
        const user = userMap[userId]
        if(!user){
            return
        }

        // 获取好友关系名称
        const friend = firendMap[userId] || {}
        let friendName = friend[TlUserFriendDef.rename]
        let userFriendId = friend[TlUserFriendDef.id]

        const channelUserList = result[channelId] || []
        channelUserList.push({
            userId: user[TlUserDef.id],
            username: user[TlUserDef.name],
            userAvatar: await getOssUrl(user[TlUserDef.avatarUrl]),
            friendName: friendName,
            userFriendId: userFriendId
        })

        result[channelId] = channelUserList
    }

    return tlResponseSuccess("获取全部频道用户列表成功", result)
}


/**
 * 设置频道置顶
 * @param {*} channelId
 * @param {*} loginInfo 
 * @param {*} top
 * @returns 
 */
const updateChannelToTop = async function({channelId, top = false, loginInfo}){
    if(!channelId){
        return tlResponseArgsError("请求参数为空")
    }

    const {
        loginUserCompanyId, loginUserId
    } = loginInfo

    const channelUserInfo = await channelUserService.getInfoByChannelIdAndUserId({
        companyId: loginUserCompanyId, 
        channelId,
        userId: loginUserId
    }, [
        TlChannelUserDef.id,
        TlChannelUserDef.flag
    ])

    if(Object.keys(channelUserInfo).length == 0){
        return tlResponseNotFound("频道不存在")
    }

    const channelUserInfoId = channelUserInfo[TlChannelUserDef.id]

    let flag = channelUserInfo[TlChannelUserDef.flag]
    if(top){
        flag = setBit(flag, TlChannelUserFlag.IS_SET_TOP, true)
    }else{
        flag = setBit(flag, TlChannelUserFlag.IS_SET_TOP, false)
    }

    const updateChannelUserInfo = await channelUserService.updateInfoById({
        companyId: loginUserCompanyId, 
        id: channelUserInfoId
    }, {
        flag: flag
    })

    if(Object.keys(updateChannelUserInfo).length == 0){
        return tlResponseSvrError(top ? "置顶失败" : "取消置顶失败")
    }

    return tlResponseSuccess(top ? "置顶成功" : "取消置顶成功")
}


/**
 * 设置拉黑频道
 * @param {*} channelId
 * @param {*} loginInfo 
 * @param {*} black
 * @returns 
 */
const updateChannelToBlack = async function({channelId, black = false, loginInfo}){
    if(!channelId){
        return tlResponseArgsError("请求参数为空")
    }

    const {
        loginUserCompanyId, loginUserId
    } = loginInfo

    const channelUserInfo = await channelUserService.getInfoByChannelIdAndUserId({
        companyId: loginUserCompanyId, 
        channelId,
        userId: loginUserId
    }, [
        TlChannelUserDef.id,
        TlChannelUserDef.flag
    ])

    if(Object.keys(channelUserInfo).length == 0){
        return tlResponseNotFound("频道不存在")
    }

    const channelUserInfoId = channelUserInfo[TlChannelUserDef.id]

    let flag = channelUserInfo[TlChannelUserDef.flag]
    if(black){
        flag = setBit(flag, TlChannelUserFlag.IS_SET_BLACK, true)
    }else{
        flag = setBit(flag, TlChannelUserFlag.IS_SET_BLACK, false)
    }

    const updateChannelUserInfo = await channelUserService.updateInfoById({
        companyId: loginUserCompanyId, 
        id: channelUserInfoId
    }, {
        flag: flag
    })

    if(Object.keys(updateChannelUserInfo).length == 0){
        return tlResponseSvrError(black ? "拉黑失败" : "取消拉黑失败")
    }

    return tlResponseSuccess(black ? "拉黑成功" : "取消拉黑成功")
}


/**
 * 退出群聊
 * @param {*} channelId 
 */
const exitChannel = async function({channelId, loginInfo}){
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
        TlChannelUserDef.id,
    ])

    if(Object.keys(channelUserInfo).length == 0){
        return tlResponseNotFound("退出频道成功")
    }

    // 删除自己在频道的数据
    await channelUserService.deleteInfoById({
        companyId: loginUserCompanyId,
        id: channelUserInfo[TlChannelUserDef.id]
    })

    return tlResponseSuccess("退出频道成功")
}



module.exports = {
    addChannelUser,
    addChannelUserNormal,
    addChannelUserAdmin,
    deleteChannelUser,
    updateChannelUserRoleNormal,
    updateChannelUserRoleAdmin,
    getChannelUserList,
    addChannelUserListNormal,
    getChannelListUserList,
    shareJoinGroupChannel,
    updateChannelToTop,
    updateChannelToBlack,
    exitChannel
}