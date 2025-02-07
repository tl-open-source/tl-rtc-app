const { 
    tlResponseArgsError, tlResponseForbidden, tlResponseSvrError, 
    tlResponseTimeout, tlResponseNotFound, tlResponseSuccess,
    setBit, checkBit,
    tlConsole
} = require('../../utils/utils')
const userService = require('../../service/user/tl_user_service')
const userFriendService = require('../../service/user/tl_user_friend_service')
const userSessionService = require('../../service/user/tl_user_session_service')
const userApplyService = require('../../service/user/tl_user_apply_service')
const userReadService = require('../../service/user/tl_user_read_service')
const userFriendBiz = require('./user_friend_biz')

const { fields: userFields } = require('../../tables/tl_user')
const { fields: userFriendFields } = require('../../tables/tl_user_friend')
const { fields: userApplyFields } = require('../../tables/tl_user_apply')
const { fields: userReadFields } = require('../../tables/tl_user_read')

const { getOssUrl } = require('../../utils/oss/oss')

const TlUserDef = userFields.Def
const TlUserFriendDef = userFriendFields.Def
const TlUserFriendType = userFriendFields.FriendType
const TlUserFriendStatus = userFriendFields.Status
const TlUserApplyDef = userApplyFields.Def
const TlUserApplyStatus = userApplyFields.Status
const TlUserApplyType = userApplyFields.Type
const TlUserApplyOrigin = userApplyFields.Origin
const TlUserReadDef = userReadFields.Def
const TlUserReadType = userReadFields.Type



/**
 * 申请添加好友
 * @param {*} friendId
 * @param {*} origin
 * @param {*} remark
 * @param {*} loginInfo 
 */
const applyAddFriend = async function({ friendId, origin, remark, loginInfo }){
    if(!friendId){
        return tlResponseArgsError("请求参数为空")
    }

    if(!origin){
        return tlResponseArgsError("请求参数为空")
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

    // 生成申请记录
    const applyInfo = await userApplyService.addInfo({
        companyId: loginUserCompanyId,
        userId: loginUserId,
        targetId: friendId,
        origin,
        remark,
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
        return tlResponseArgsError("请求参数为空")
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

    // 生成双向好友记录
    let initUserFriendRes = await userFriendBiz.initUserFriendForPassFriend({
        loginUserCompanyId, 
        loginUserId, 
        loginUsername, 
        applyUserId, 
        applyUserName: applyUserInfo[TlUserDef.name],
        origin: applyInfo[TlUserApplyDef.origin], 
        remark: applyInfo[TlUserApplyDef.remark], 
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
        return tlResponseArgsError("请求参数为空")
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
        TlUserApplyDef.userId
    ])

    if(Object.keys(applyInfo).length == 0){
        return tlResponseNotFound("申请记录不存在")
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

        let originStr = ''
        const origin = item[TlUserApplyDef.origin]
        if(origin == TlUserApplyOrigin.SEARCH_NAME){
            originStr = "搜索用户名添加"
        }

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
            userAvatar: await getOssUrl(userInfo[TlUserDef.avatarUrl]),
            userApplyRemark: item[TlUserApplyDef.remark],
            origin : originStr,
            createTime: item[TlUserApplyDef.createdAt],
            status : statusStr,
            userCompanyName: loginUserCompanyName,
            hasRead: userReadMap.has(item[TlUserApplyDef.id])
        })
    }

    return tlResponseSuccess("获取我发出的申请记录成功", resultList)
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

        let originStr = ''
        const origin = item[TlUserApplyDef.origin]
        if(origin == TlUserApplyOrigin.SEARCH_NAME){
            originStr = "搜索用户名添加"
        }

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
            userAvatar: await getOssUrl(userInfo[TlUserDef.avatarUrl]),
            userApplyRemark: item[TlUserApplyDef.remark],
            origin : originStr,
            createTime: item[TlUserApplyDef.createdAt],
            status : statusStr,
            userCompanyName: loginUserCompanyName,
            hasRead: userReadMap.has(item[TlUserApplyDef.id])
        })
    }
    return tlResponseSuccess("获取我收到的申请记录成功", resultList)
}

    

module.exports = {
    applyAddFriend, 
    passUserFriendApply, 
    rejectUserFriendApply, 
    getUserFriendApplyListFromSelf,
    getUserFriendListFromOther
}