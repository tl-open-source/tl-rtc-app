const { 
    tlResponseArgsError, tlResponseForbidden, tlResponseSvrError, 
    tlResponseNotFound, tlResponseSuccess,
    setBit, checkBit,
    checkIsId
} = require('../../utils/utils')
const channelService = require('../../service/channel/tl_channel_service')
const channelUserService = require('../../service/channel/tl_channel_user_service')
const userService = require('../../service/user/tl_user_service')
const userFriendService = require('../../service/user/tl_user_friend_service')
const userApplyService = require('../../service/user/tl_user_apply_service')
const userReadService = require('../../service/user/tl_user_read_service')
const userFriendBiz = require('./user_friend_biz')
const userConfigService = require('../../service/user/tl_user_config_service')

const { fields: userFields } = require('../../tables/tl_user')
const { fields: userFriendFields } = require('../../tables/tl_user_friend')
const { fields: userApplyFields } = require('../../tables/tl_user_apply')
const { fields: userReadFields } = require('../../tables/tl_user_read')
const { fields: channelFields } = require('../../tables/tl_channel')
const { fields: userConfigFields } = require('../../tables/tl_user_config')
const { fields: channelUserFields } = require('../../tables/tl_channel_user')
const { inner: TlRoleInner } = require('../../tables/tl_role')

const { addChannelUser } = require('../../biz/channel/channel_user_biz')

const { getAvatarOssUrl } = require('../../utils/oss/oss')

const TlUserDef = userFields.Def
const TlUserFriendDef = userFriendFields.Def
const TlUserFriendFlag = userFriendFields.Flag
const TlUserFriendStatus = userFriendFields.Status
const TlUserApplyDef = userApplyFields.Def
const TlUserApplyStatus = userApplyFields.Status
const TlUserApplyType = userApplyFields.Type
const TlUserApplyFlag = userApplyFields.Flag
const TlUserReadDef = userReadFields.Def
const TlUserReadType = userReadFields.Type
const TlUserConfingDef = userConfigFields.Def
const TlUserConfingAccount = userConfigFields.Account
const TlChannelDef = channelFields.Def
const TlChannelUserDef = channelUserFields.Def



/**
 * 申请添加好友
 * @param {*} friendId
 * @param {*} remark
 * @param {*} loginInfo 
 */
const applyAddFriend = async function({ friendId, remark, loginInfo }){
    if(!friendId){
        return tlResponseArgsError("请求参数错误")
    }

    friendId = parseInt(friendId)
    if(!checkIsId(friendId)){
        return tlResponseArgsError("请求参数不合法")
    }

    if(remark && remark.length > 64){
        return tlResponseArgsError("备注信息过长")
    }

    const { 
        loginUserCompanyId, loginUserId
    } = loginInfo

    if (loginUserId == friendId) {
        return tlResponseForbidden("不能添加自己为好友")
    }

    const friendInfo = await userService.getInfoById({
        companyId: loginUserCompanyId,
        id: friendId
    })

    if(Object.keys(friendInfo).length == 0){
        return tlResponseNotFound("用户不存在")
    }

    const userFriendInfo = await userFriendService.getInfoByUserIdAndFriendId({
        companyId: loginUserCompanyId,
        userId: loginUserId,
        friendId
    })

    const status = userFriendInfo[TlUserFriendDef.status]
    if(status == TlUserFriendStatus.NORMAL){
        return tlResponseForbidden("已经是好友")
    }

    // 查看自己是否存在待验证的申请记录
    let applyHistroryList = await userApplyService.getListByUserIdAndTargetIdAndStatuAndType({
        companyId: loginUserCompanyId,
        userId: loginUserId,
        targetId: friendId,
        status: TlUserApplyStatus.WAIT,
        type: TlUserApplyType.FRIEND
    }, [
        TlUserApplyDef.id
    ])

    if(applyHistroryList.length > 0){
        return tlResponseForbidden("你已经向该用户发送过申请，请查看申请记录")
    }

    // 查看对方是否存在待验证的申请记录
    applyHistroryList = await userApplyService.getListByUserIdAndTargetIdAndStatuAndType({
        companyId: loginUserCompanyId,
        userId: friendId,
        targetId: loginUserId,
        status: TlUserApplyStatus.WAIT,
        type: TlUserApplyType.FRIEND
    }, [
        TlUserApplyDef.id
    ])

    if(applyHistroryList.length > 0){
        return tlResponseForbidden("对方已经向你发送过申请，请查看申请记录")
    }

    // 获取用户配置
    const userConfigInfo = await userConfigService.getInfoByUserId({
        companyId: loginUserCompanyId,
        userId: friendId
    }, [
        TlUserConfingDef.account
    ])
    let accountSettingStr = userConfigInfo[TlUserConfingDef.account]
    let accountSetting = {}
    try{
        accountSetting = JSON.parse(accountSettingStr)
    }catch(e){
        accountSetting = {}
    }
    // 是否不接受好友申请
    let notAcceptFriendApply = accountSetting[TlUserConfingAccount.notAcceptFriendApply] || false
    if(notAcceptFriendApply){
        return tlResponseForbidden("对方已关闭好友申请")
    }

    let flag = 0
    flag = setBit(flag, TlUserApplyFlag.IS_APPLY_FRIEND_BY_SEARCH_NAME, true)

    // 生成申请记录
    const applyInfo = await userApplyService.addInfo({
        companyId: loginUserCompanyId,
        userId: loginUserId,
        targetId: friendId,
        origin: "通过搜索",
        remark,
        flag,
        type: TlUserApplyType.FRIEND,
        status: TlUserApplyStatus.WAIT
    })

    if(Object.keys(applyInfo).length == 0){
        return tlResponseSvrError("发送申请失败")
    }

    return tlResponseSuccess("发送申请成功", {
        applyId: applyInfo[TlUserApplyDef.id]
    })
}

/**
 * 通过用户好友申请
 * @param {*} id
 * @param {*} loginInfo 
 * @returns 
 */
const passUserFriendApply = async function({ id, loginInfo }){
    if(!id){
        return tlResponseArgsError("请求参数错误")
    }

    id = parseInt(id)
    if(!checkIsId(id)){
        return tlResponseArgsError("请求参数不合法")
    }

    const { 
        loginUserCompanyId, loginUserId, loginUsername
    } = loginInfo

    // 查询申请记录
    const applyInfo = await userApplyService.getInfoById({
        companyId: loginUserCompanyId,
        id
    })

    if(Object.keys(applyInfo).length == 0){
        return tlResponseNotFound("申请记录不存在")
    }

    // 如果不是被申请人，不能通过
    if(applyInfo[TlUserApplyDef.targetId] != loginUserId){
        return tlResponseForbidden("非法操作")
    }

    const status = applyInfo[TlUserApplyDef.status]
    if(status != TlUserApplyStatus.WAIT){
        return tlResponseForbidden("申请记录状态不正确")
    }

    const type = applyInfo[TlUserApplyDef.type]
    if(type != TlUserApplyType.FRIEND){
        return tlResponseForbidden("申请记录类型不正确")
    }

    // 查询申请人信息
    const applyUserId = applyInfo[TlUserApplyDef.userId]
    const applyUserInfo = await userService.getInfoById({
        companyId: loginUserCompanyId,
        id: applyUserId
    }, [
        TlUserDef.id,
        TlUserDef.name
    ])

    if(Object.keys(applyUserInfo).length == 0){
        return tlResponseNotFound("用户不存在")
    }

    // 生成频道，生成一条系统消息，生成对应的频道用户
    let initChannelRes = await userFriendBiz.initChannelForPassFriend({
        applyUserId, loginUserCompanyId, loginUserId
    })

    if (!initChannelRes.success) {
        return initChannelRes
    }

    const applyFlag = applyInfo[TlUserApplyDef.flag]
    const isApplyFriendBySearchName = checkBit(applyFlag, TlUserApplyFlag.IS_APPLY_FRIEND_BY_SEARCH_NAME)
    const isApplyFriendBySearchPhone = checkBit(applyFlag, TlUserApplyFlag.IS_APPLY_FRIEND_BY_SEARCH_PHONE)
    const isApplyFriendBySearchEmail = checkBit(applyFlag, TlUserApplyFlag.IS_APPLY_FRIEND_BY_SEARCH_EMAIL)
    const isApplyByShareLink = checkBit(applyFlag, TlUserApplyFlag.IS_APPLY_FRIEND_BY_INVITE)

    let friendFlag = 0
    if(isApplyFriendBySearchName){
        friendFlag = setBit(friendFlag, TlUserFriendFlag.IS_ADD_BY_SEARCH_NAME, true)
    }
    if(isApplyFriendBySearchPhone){
        friendFlag = setBit(friendFlag, TlUserFriendFlag.IS_ADD_BY_SEARCH_PHONE, true)
    }
    if(isApplyFriendBySearchEmail){
        friendFlag = setBit(friendFlag, TlUserFriendFlag.IS_ADD_BY_SEARCH_EMAIL, true)
    }
    if(isApplyByShareLink){
        friendFlag = setBit(friendFlag, TlUserFriendFlag.IS_ADD_BY_INVITE, true)
    }

    // 生成双向好友记录
    let initUserFriendRes = await userFriendBiz.initUserFriendForPassFriend({
        loginUserCompanyId, 
        loginUserId, 
        loginUsername, 
        applyUserId, 
        applyUserName: applyUserInfo[TlUserDef.name],
        origin: applyInfo[TlUserApplyDef.origin],
        remark: applyInfo[TlUserApplyDef.remark], 
        flag: friendFlag,
        channelId: initChannelRes.data.channelId
    })

    if (!initUserFriendRes.success) {
        return initUserFriendRes
    }

    // 更新申请记录状态
    const updateInfo = await userApplyService.updateInfoById({
        companyId: loginUserCompanyId,
        id
    }, {
        [TlUserApplyDef.status]: TlUserApplyStatus.PASS
    })

    if(Object.keys(updateInfo).length == 0){
        return tlResponseSvrError("更新申请记录状态失败")
    }

    return tlResponseSuccess("通过申请成功", {
        applyId : id,
        applyUserId: applyUserId
    })
}

/**
 * 拒绝用户好友申请
 * @param {*} id
 * @param {*} loginInfo 
 * @returns 
 */
const rejectUserFriendApply = async function({ id, loginInfo }){
    if(!id){
        return tlResponseArgsError("请求参数错误")
    }

    id = parseInt(id)
    if(!checkIsId(id)){
        return tlResponseArgsError("请求参数不合法")
    }

    const { 
        loginUserCompanyId, loginUserId
    } = loginInfo

    const applyInfo = await userApplyService.getInfoById({
        companyId: loginUserCompanyId,
        id
    }, [
        TlUserApplyDef.id,
        TlUserApplyDef.status,
        TlUserApplyDef.type,
        TlUserApplyDef.userId,
        TlUserApplyDef.targetId
    ])

    if(Object.keys(applyInfo).length == 0){
        return tlResponseNotFound("申请记录不存在")
    }

    // 如果不是被申请人，不能通过
    if(applyInfo[TlUserApplyDef.targetId] != loginUserId){
        return tlResponseForbidden("非法操作")
    }

    const status = applyInfo[TlUserApplyDef.status]
    if(status != TlUserApplyStatus.WAIT){
        return tlResponseForbidden("申请记录状态不正确")
    }

    const type = applyInfo[TlUserApplyDef.type]
    if(type != TlUserApplyType.FRIEND){
        return tlResponseForbidden("申请记录类型不正确")
    }

    const applyUserId = applyInfo[TlUserApplyDef.userId]
    const applyUserInfo = await userService.getInfoById({
        companyId: loginUserCompanyId,
        id: applyUserId
    }, [
        TlUserDef.id
    ])

    if(Object.keys(applyUserInfo).length == 0){
        return tlResponseNotFound("用户不存在")
    }

    // 更新申请记录状态
    const updateInfo = await userApplyService.updateInfoById({
        companyId: loginUserCompanyId,
        id
    }, {
        [TlUserApplyDef.status]: TlUserApplyStatus.REJECT
    })

    if(Object.keys(updateInfo).length == 0){
        return tlResponseSvrError("更新申请记录状态失败")
    }

    return tlResponseSuccess("拒绝申请成功", {
        applyId : id,
        applyUserId: applyUserId
    })
}


/**
 * 获取我发出的好友申请记录
 * @param {*} loginInfo 
 * @returns 
 */
const getUserFriendApplyListFromSelf = async function({ loginInfo }){
    const { 
        loginUserCompanyId, loginUserId, loginUserCompanyName
    } = loginInfo

    const applyList = await userApplyService.getListByUserIdAndType({
        companyId: loginUserCompanyId,
        userId: loginUserId,
        type: TlUserApplyType.FRIEND
    }, [
        TlUserApplyDef.id,
        TlUserApplyDef.targetId,
        TlUserApplyDef.origin,
        TlUserApplyDef.flag,
        TlUserApplyDef.status,
        TlUserApplyDef.remark,
        TlUserApplyDef.createdAt
    ])

    // 用户信息
    let userIdList = new Set(
        applyList.map(item => item[TlUserApplyDef.targetId])
    )
    let userInfoList = await userService.getListByIdList({
        companyId: loginUserCompanyId,
        idList: [...userIdList]
    }, [
        TlUserDef.id,
        TlUserDef.name,
        TlUserDef.avatarUrl
    ])
    let userInfoMap = new Map()
    userInfoList.forEach(item => {
        userInfoMap.set(item[TlUserDef.id], item)
    })

    // 已读记录
    let readList = await userReadService.getListByUserIdTypeList({
        companyId: loginUserCompanyId,
        userId: loginUserId,
        typeList: [
            TlUserReadType.FRIEND_APPLY,
            TlUserReadType.FRIEND_APPLY_PASS,
            TlUserReadType.FRIEND_APPLY_REJECT
        ]
    }, [
        TlUserReadDef.recordId
    ])
    let userReadMap = new Map()
    readList.forEach(item => {
        userReadMap.set(item[TlUserReadDef.recordId], true)
    })

    let resultList = []
    
    for(let i = 0; i < applyList.length; i++){
        const item = applyList[i]

        const status = item[TlUserApplyDef.status]
        let statusStr = ''
        if(status == TlUserApplyStatus.PASS){
            statusStr = "对方通过申请"
        }else if(status == TlUserApplyStatus.REJECT){
            statusStr = "对方拒绝申请"
        }else if(status == TlUserApplyStatus.WAIT){
            statusStr = "等待对方验证"
        }

        let userInfo = userInfoMap.get(item[TlUserApplyDef.targetId])
        if(!userInfo){
            userInfo = {}
        }

        resultList.push({
            id : item[TlUserApplyDef.id],
            username: userInfo[TlUserDef.name],
            userAvatar: await getAvatarOssUrl(userInfo[TlUserDef.avatarUrl]),
            userApplyRemark: item[TlUserApplyDef.remark],
            origin : item[TlUserApplyDef.origin],
            createTime: item[TlUserApplyDef.createdAt],
            status : statusStr,
            userCompanyName: loginUserCompanyName,
            hasRead: userReadMap.has(item[TlUserApplyDef.id])
        })
    }

    return tlResponseSuccess("获取成功", resultList)
}

/**
 * 获取我收到的好友申请记录
 * @param {*} loginInfo 
 * @returns 
 */
const getUserFriendListFromOther = async function({ loginInfo }){
    const { 
        loginUserCompanyId, loginUserId, loginUserCompanyName
    } = loginInfo
    
    const applyList = await userApplyService.getListByTargetIdAndType({
        companyId: loginUserCompanyId,
        targetId: loginUserId,
        type: TlUserApplyType.FRIEND
    }, [
        TlUserApplyDef.id,
        TlUserApplyDef.userId,
        TlUserApplyDef.origin,
        TlUserApplyDef.flag,
        TlUserApplyDef.status,
        TlUserApplyDef.remark,
        TlUserApplyDef.createdAt
    ])

    // 用户信息
    let userIdList = new Set(
        applyList.map(item => item[TlUserApplyDef.userId])
    )
    let userInfoList = await userService.getListByIdList({
        companyId: loginUserCompanyId,
        idList: [...userIdList]
    }, [
        TlUserDef.id,
        TlUserDef.name,
        TlUserDef.avatarUrl
    ])
    let userInfoMap = new Map()
    userInfoList.forEach(item => {
        userInfoMap.set(item[TlUserDef.id], item)
    })

    // 已读记录
    let readList = await userReadService.getListByUserIdTypeList({
        companyId: loginUserCompanyId,
        userId: loginUserId,
        typeList: [
            TlUserReadType.FRIEND_APPLY,
            TlUserReadType.FRIEND_APPLY_PASS,
            TlUserReadType.FRIEND_APPLY_REJECT
        ]
    }, [
        TlUserReadDef.recordId
    ])
    let userReadMap = new Map()
    readList.forEach(item => {
        userReadMap.set(item[TlUserReadDef.recordId], true)
    })

    let resultList = []

    for(let i = 0; i < applyList.length; i++){
        const item = applyList[i]

        const status = item[TlUserApplyDef.status]
        let statusStr = ''
        if(status == TlUserApplyStatus.PASS){
            statusStr = "已通过申请"
        }else if(status == TlUserApplyStatus.REJECT){
            statusStr = "已拒绝申请"
        }else if(status == TlUserApplyStatus.WAIT){
            statusStr = "等待我验证"
        }

        let userInfo = userInfoMap.get(item[TlUserApplyDef.userId])
        if(!userInfo){
            userInfo = {}
        }

        resultList.push({
            id : item[TlUserApplyDef.id],
            username: userInfo[TlUserDef.name],
            userAvatar: await getAvatarOssUrl(userInfo[TlUserDef.avatarUrl]),
            userApplyRemark: item[TlUserApplyDef.remark],
            origin : item[TlUserApplyDef.origin],
            createTime: item[TlUserApplyDef.createdAt],
            status : statusStr,
            userCompanyName: loginUserCompanyName,
            hasRead: userReadMap.has(item[TlUserApplyDef.id])
        })
    }
    return tlResponseSuccess("获取成功", resultList)
}


/**
 * 申请加入群聊
 * @param {*} channelId
 * @param {*} remark
 * @param {*} shareUserId
 * @param {*} loginInfo 
 */
const applyAddGroup = async function({ channelId, remark, shareUserId, loginInfo }){
    if(!channelId){
        return tlResponseArgsError("请求参数错误")
    }

    channelId = parseInt(channelId)
    if(!checkIsId(channelId)){
        return tlResponseArgsError("请求参数不合法")
    }

    if(remark && remark.length > 64){
        return tlResponseArgsError("备注信息过长")
    }

    if(shareUserId){
        shareUserId = parseInt(shareUserId)
        if(!checkIsId(shareUserId)){
            return tlResponseArgsError("请求参数不合法")
        }
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

    const channelUserInfo = await channelUserService.getInfoByChannelIdAndUserId({
        companyId: loginUserCompanyId,
        channelId: channelId,
        userId: loginUserId
    })

    if(Object.keys(channelUserInfo).length > 0){
        return tlResponseForbidden("已加入群聊")
    }

    // 查看自己是否存在待验证的申请记录
    let applyHistroryList = await userApplyService.getListByUserIdAndTargetIdAndStatuAndType({
        companyId: loginUserCompanyId,
        userId: loginUserId,
        targetId: channelId,
        status: TlUserApplyStatus.WAIT,
        type: TlUserApplyType.GROUP
    }, [
        TlUserApplyDef.id
    ])

    if(applyHistroryList.length > 0){
        return tlResponseForbidden("你已经向该群发送过申请，请查看申请记录")
    }

    let flag = 0
    let origin = ''
    if(shareUserId){
        const shareUserInfo = await userService.getInfoById({
            companyId: loginUserCompanyId,
            id: shareUserId
        }, [
            TlUserDef.name
        ])

        flag = setBit(flag, TlUserApplyFlag.IS_APPLY_GROUP_BY_SHARE_LINK, true)
        origin = "通过"+shareUserInfo[TlUserDef.name]+"分享"
    }else{
        flag = setBit(flag, TlUserApplyFlag.IS_APPLY_GROUP_BY_SEARCH_NAME, true)
        origin = "通过搜索"
    }

    // 生成申请记录
    const applyInfo = await userApplyService.addInfo({
        companyId: loginUserCompanyId,
        userId: loginUserId,
        targetId: channelId,
        origin,
        remark,
        flag,
        type: TlUserApplyType.GROUP,
        status: TlUserApplyStatus.WAIT
    })

    if(Object.keys(applyInfo).length == 0){
        return tlResponseSvrError("发送申请失败")
    }

    return tlResponseSuccess("发送申请成功", {
        applyId: applyInfo[TlUserApplyDef.id]
    })
}


/**
 * 通过用户群聊申请
 * @param {*} id
 * @param {*} loginInfo 
 * @returns 
 */
const passUserGroupApply = async function({ id, loginInfo }){
    if(!id){
        return tlResponseArgsError("请求参数错误")
    }

    id = parseInt(id)
    if(!checkIsId(id)){
        return tlResponseArgsError("请求参数不合法")
    }

    const { 
        loginUserCompanyId, loginUserId
    } = loginInfo

    // 查询申请记录
    const applyInfo = await userApplyService.getInfoById({
        companyId: loginUserCompanyId,
        id
    })

    if(Object.keys(applyInfo).length == 0){
        return tlResponseNotFound("申请记录不存在")
    }

    // 如果当前用户不是群聊创建人，不能通过
    const channelId = applyInfo[TlUserApplyDef.targetId]

    const channelInfo = await channelService.getInfoById({
        companyId: loginUserCompanyId,
        id: channelId
    })

    if(Object.keys(channelInfo).length == 0){
        return tlResponseNotFound("频道不存在")
    }

    const channelUserInfo = await channelUserService.getInfoByChannelIdAndUserId({
        companyId: loginUserCompanyId,
        channelId,
        userId: loginUserId
    })

    if(Object.keys(channelUserInfo).length == 0){
        return tlResponseForbidden("非法操作")
    }

    const channelUserRole = channelUserInfo[TlChannelUserDef.roleId]
    if(channelUserRole != TlRoleInner.channel.creator.id){
        return tlResponseForbidden("非法操作")
    }

    const status = applyInfo[TlUserApplyDef.status]
    if(status != TlUserApplyStatus.WAIT){
        return tlResponseForbidden("申请记录状态不正确")
    }

    const type = applyInfo[TlUserApplyDef.type]
    if(type != TlUserApplyType.GROUP){
        return tlResponseForbidden("申请记录类型不正确")
    }

    // 更新申请记录状态
    const updateInfo = await userApplyService.updateInfoById({
        companyId: loginUserCompanyId,
        id
    }, {
        [TlUserApplyDef.status]: TlUserApplyStatus.PASS
    })

    if(Object.keys(updateInfo).length == 0){
        return tlResponseSvrError("更新申请记录状态失败")
    }

    const flag = applyInfo[TlUserApplyDef.flag]

    // 生成频道用户
    const result = await addChannelUser({
        loginInfo, channelId, 
        userId: applyInfo[TlUserApplyDef.userId], 
        roleId: TlRoleInner.channel.member.id,
        isShare: checkBit(flag, TlUserApplyFlag.IS_APPLY_GROUP_BY_SHARE_LINK)
    })

    if(!result.success){
        return result
    }

    return tlResponseSuccess("通过申请成功", {
        applyId : id,
        applyUserId: applyInfo[TlUserApplyDef.userId]
    })
}

/**
 * 拒绝用户群聊申请
 * @param {*} id
 * @param {*} loginInfo 
 * @returns 
 */
const rejectUserGroupApply = async function({ id, loginInfo }){
    if(!id){
        return tlResponseArgsError("请求参数错误")
    }

    id = parseInt(id)
    if(!checkIsId(id)){
        return tlResponseArgsError("请求参数不合法")
    }

    const { 
        loginUserCompanyId, loginUserId
    } = loginInfo

    const applyInfo = await userApplyService.getInfoById({
        companyId: loginUserCompanyId,
        id
    })

    if(Object.keys(applyInfo).length == 0){
        return tlResponseNotFound("申请记录不存在")
    }

    // 如果当前用户不是群聊创建人，不能通过
    const channelId = applyInfo[TlUserApplyDef.targetId]

    const channelInfo = await channelService.getInfoById({
        companyId: loginUserCompanyId,
        id: channelId
    })

    if(Object.keys(channelInfo).length == 0){
        return tlResponseNotFound("频道不存在")
    }

    const channelUserInfo = await channelUserService.getInfoByChannelIdAndUserId({
        companyId: loginUserCompanyId,
        channelId,
        userId: loginUserId
    })

    if(Object.keys(channelUserInfo).length == 0){
        return tlResponseForbidden("非法操作")
    }

    const channelUserRole = channelUserInfo[TlChannelUserDef.roleId]
    if(channelUserRole != TlRoleInner.channel.creator.id){
        return tlResponseForbidden("非法操作")
    }

    const status = applyInfo[TlUserApplyDef.status]
    if(status != TlUserApplyStatus.WAIT){
        return tlResponseForbidden("申请记录状态不正确")
    }

    const type = applyInfo[TlUserApplyDef.type]
    if(type != TlUserApplyType.GROUP){
        return tlResponseForbidden("申请记录类型不正确")
    }

    // 更新申请记录状态
    const updateInfo = await userApplyService.updateInfoById({
        companyId: loginUserCompanyId,
        id
    }, {
        [TlUserApplyDef.status]: TlUserApplyStatus.REJECT
    })

    if(Object.keys(updateInfo).length == 0){
        return tlResponseSvrError("更新申请记录状态失败")
    }

    return tlResponseSuccess("拒绝申请成功", {
        applyId : id,
        applyUserId: applyInfo[TlUserApplyDef.userId]
    })
}

/**
 * 获取我发出的群聊申请记录
 * @param {*} loginInfo
 */
const getUserGroupApplyListFromSelf = async function({ loginInfo }){
    const { 
        loginUserCompanyId, loginUserId, loginUserCompanyName
    } = loginInfo

    const applyList = await userApplyService.getListByUserIdAndType({
        companyId: loginUserCompanyId,
        userId: loginUserId,
        type: TlUserApplyType.GROUP
    }, [
        TlUserApplyDef.id,
        TlUserApplyDef.targetId,
        TlUserApplyDef.origin,
        TlUserApplyDef.status,
        TlUserApplyDef.remark,
        TlUserApplyDef.createdAt
    ])

    // 频道信息
    let channelIdList = new Set(
        applyList.map(item => item[TlUserApplyDef.targetId])
    )
    let channelInfoList = await channelService.getListByIdList({
        companyId: loginUserCompanyId,
        idList: [...channelIdList]
    }, [
        TlChannelDef.id,
        TlChannelDef.name,
    ])
    let channelInfoMap = new Map()
    channelInfoList.forEach(item => {
        channelInfoMap.set(item[TlChannelDef.id], item)
    })

    // 已读记录
    let readList = await userReadService.getListByUserIdTypeList({
        companyId: loginUserCompanyId,
        userId: loginUserId,
        typeList: [
            TlUserReadType.GROUP_APPLY,
            TlUserReadType.GROUP_APPLY_PASS,
            TlUserReadType.GROUP_APPLY_REJECT
        ]
    }, [
        TlUserReadDef.recordId
    ])
    let userReadMap = new Map()
    readList.forEach(item => {
        userReadMap.set(item[TlUserReadDef.recordId], true)
    })

    let resultList = []
    
    for(let i = 0; i < applyList.length; i++){
        const item = applyList[i]

        const status = item[TlUserApplyDef.status]
        let statusStr = ''
        if(status == TlUserApplyStatus.PASS){
            statusStr = "已通过申请"
        }else if(status == TlUserApplyStatus.REJECT){
            statusStr = "已拒绝申请"
        }
        else if(status == TlUserApplyStatus.WAIT){
            statusStr = "等待对方验证"
        }

        let channelInfo = channelInfoMap.get(item[TlUserApplyDef.targetId])
        if(!channelInfo){
            channelInfo = {}
        }

        resultList.push({
            id : item[TlUserApplyDef.id],
            channelId: channelInfo[TlChannelDef.id],
            channelName: channelInfo[TlChannelDef.name],
            channelAvatar: "/image/group-default-avatar.png",
            channelApplyRemark: item[TlUserApplyDef.remark],
            channelCompanyName: loginUserCompanyName,
            origin : item[TlUserApplyDef.origin],
            createTime: item[TlUserApplyDef.createdAt],
            status : statusStr,
            hasRead: userReadMap.has(item[TlUserApplyDef.id])
        })
    }

    return tlResponseSuccess("获取成功", resultList)
}

/**
 * 获取我收到的群聊申请记录
 * @param {*} loginInfo
 * @returns 
 */
const getUserGroupListFromOther = async function({ loginInfo }){
    const { 
        loginUserCompanyId, loginUserId, loginUserCompanyName
    } = loginInfo

    // 获取我所在的所有频道
    const channelList = await channelUserService.getListByUserIdAndRoleId({
        companyId: loginUserCompanyId,
        userId: loginUserId,
        roleId: TlRoleInner.channel.creator.id
    }, [
        TlChannelUserDef.channelId
    ])

    if(channelList.length == 0){
        return tlResponseSuccess("获取成功", [])
    }

    let channelIdList = channelList.map(item => item[TlChannelUserDef.channelId])
    
    const applyList = await userApplyService.getListByTargetIdListAndType({
        companyId: loginUserCompanyId,
        targetIdList: channelIdList,
        type: TlUserApplyType.GROUP
    }, [
        TlUserApplyDef.id,
        TlUserApplyDef.userId,
        TlUserApplyDef.targetId,
        TlUserApplyDef.origin,
        TlUserApplyDef.status,
        TlUserApplyDef.remark,
        TlUserApplyDef.createdAt
    ])

    // 频道信息
    let channelInfoList = await channelService.getListByIdList({
        companyId: loginUserCompanyId,
        idList: [...channelIdList]
    }, [
        TlChannelDef.id,
        TlChannelDef.name,
    ])
    let channelInfoMap = new Map()
    channelInfoList.forEach(item => {
        channelInfoMap.set(item[TlChannelDef.id], item)
    })

    // 用户信息
    let userIdList = new Set(
        applyList.map(item => item[TlUserApplyDef.userId])
    )
    let userInfoList = await userService.getListByIdList({
        companyId: loginUserCompanyId,
        idList: [...userIdList]
    }, [
        TlUserDef.id,
        TlUserDef.name,
        TlUserDef.avatarUrl
    ])

    let userInfoMap = new Map()
    userInfoList.forEach(item => {
        userInfoMap.set(item[TlUserDef.id], item)
    })

    // 已读记录
    let readList = await userReadService.getListByUserIdTypeList({
        companyId: loginUserCompanyId,
        userId: loginUserId,
        typeList: [
            TlUserReadType.GROUP_APPLY,
            TlUserReadType.GROUP_APPLY_PASS,
            TlUserReadType.GROUP_APPLY_REJECT
        ]
    }, [
        TlUserReadDef.recordId
    ])
    let userReadMap = new Map()
    readList.forEach(item => {
        userReadMap.set(item[TlUserReadDef.recordId], true)
    })

    let resultList = []

    for(let i = 0; i < applyList.length; i++){
        const item = applyList[i]

        const status = item[TlUserApplyDef.status]
        let statusStr = ''
        if(status == TlUserApplyStatus.PASS){
            statusStr = "通过申请"
        }else if(status == TlUserApplyStatus.REJECT){
            statusStr = "拒绝申请"
        }else if(status == TlUserApplyStatus.WAIT){
            statusStr = "等待我验证"
        }

        let userInfo = userInfoMap.get(item[TlUserApplyDef.userId])
        if(!userInfo){
            userInfo = {}
        }

        let channelInfo = channelInfoMap.get(item[TlUserApplyDef.targetId])
        if(!channelInfo){
            channelInfo = {}
        }

        resultList.push({
            id : item[TlUserApplyDef.id],
            channelId: channelInfo[TlChannelDef.id],
            channelName: channelInfo[TlChannelDef.name],
            channelAvatar: "/image/group-default-avatar.png",
            channelApplyRemark: item[TlUserApplyDef.remark],
            channelCompanyName: loginUserCompanyName,

            userId: userInfo[TlUserDef.id],
            username: userInfo[TlUserDef.name],
            userAvatar: await getAvatarOssUrl(userInfo[TlUserDef.avatarUrl]),
            origin : item[TlUserApplyDef.origin],
            createTime: item[TlUserApplyDef.createdAt],
            status : statusStr,
            hasRead: userReadMap.has(item[TlUserApplyDef.id])
        })
    }

    return tlResponseSuccess("获取成功", resultList)
}

module.exports = {
    applyAddFriend, 
    passUserFriendApply, 
    rejectUserFriendApply, 
    getUserFriendApplyListFromSelf,
    getUserFriendListFromOther,
    
    applyAddGroup,
    passUserGroupApply,
    rejectUserGroupApply,   
    getUserGroupApplyListFromSelf,
    getUserGroupListFromOther
}