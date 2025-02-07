const { 
    tlResponseArgsError, tlResponseForbidden, tlResponseSvrError, 
    tlResponseTimeout, tlResponseNotFound, tlResponseSuccess,
    setBit, checkBit, checkIsEmail
} = require('../../utils/utils')
const userService = require('../../service/user/tl_user_service')
const userFriendService = require('../../service/user/tl_user_friend_service')
const userSessionService = require('../../service/user/tl_user_session_service')
const { getAvatarOssUrl } = require('../../utils/oss/oss')

const { fields: userFields } = require('../../tables/tl_user')
const { fields: userFriendFields } = require('../../tables/tl_user_friend')

const TlUserDef = userFields.Def
const TlUserFriendDef = userFriendFields.Def
const TlUserFriendStatus = userFriendFields.Status
const TlUserFriendType = userFriendFields.FriendType



/**
 * 搜索用户
 * @param {*} name
 * @param {*} loginInfo
 */
const searchUserByName = async function({ name, loginInfo }){
    if(!name){
        return tlResponseArgsError("请求参数为空")
    }

    const { 
        loginUserCompanyId, loginUserId, loginUserCompanyName
    } = loginInfo
    
    const info = await userService.getInfoByName({
        companyId: loginUserCompanyId,
        name
    }, [
        TlUserDef.id,
        TlUserDef.name,
        TlUserDef.avatarUrl,
        TlUserDef.wchatName,
    ])

    if(Object.keys(info).length == 0){
        return tlResponseNotFound("用户不存在")
    }

    const userFriendInfo = await userFriendService.getInfoByUserIdAndFriendId({
        companyId: loginUserCompanyId,
        userId: loginUserId,
        friendId: info[TlUserDef.id]
    }, [
        TlUserFriendDef.channelId,
        TlUserFriendDef.remark,
        TlUserFriendDef.friendType
    ])

    let isFriend = true
    if(Object.keys(userFriendInfo).length == 0){
        isFriend = false
    }

    if(info[TlUserDef.id] == loginUserId){
        isFriend = true
    }

    let friendTypeStr = ''
    if(isFriend){
        let friendType = userFriendInfo[TlUserFriendDef.friendType]
        if(friendType === TlUserFriendType.NORMAL){
            friendTypeStr = '普通好友'
        }else if(friendType === TlUserFriendType.SPECIAL){
            friendTypeStr = '特别关注'
        }
    }

    const result = {
        userId: info[TlUserDef.id],
        username: info[TlUserDef.name],
        userAvatar: await getAvatarOssUrl(info[TlUserDef.avatarUrl]),
        userCompanyName: loginUserCompanyName,
        wechatName: info[TlUserDef.wchatName],
        channelId: userFriendInfo[TlUserFriendDef.channelId],
        isFriend: isFriend,
        remark: userFriendInfo[TlUserFriendDef.remark],
        friendType: friendTypeStr
    }

    return tlResponseSuccess("搜索用户成功", result)
}

/**
 * 搜索用户通过id
 * @param {*} id
 * @param {*} loginInfo
 */
const searchUserById = async function({ id, loginInfo }){
    if(!id){
        return tlResponseArgsError("请求参数为空")
    }

    const { 
        loginUserCompanyId, loginUserId, loginUserCompanyName
    } = loginInfo
    
    const info = await userService.getInfoById({
        companyId: loginUserCompanyId,
        id
    }, [
        TlUserDef.id,
        TlUserDef.name,
        TlUserDef.avatarUrl,
        TlUserDef.wchatName
    ])

    if(Object.keys(info).length == 0){
        return tlResponseNotFound("用户不存在")
    }

    const userFriendInfo = await userFriendService.getInfoByUserIdAndFriendId({
        companyId: loginUserCompanyId,
        userId: loginUserId,
        friendId: info[TlUserDef.id]
    }, [
        TlUserFriendDef.channelId,
    ])

    let isFriend = true
    if(Object.keys(userFriendInfo).length == 0){
        isFriend = false
    }

    if(id == loginUserId){
        isFriend = true
    }

    const result = {
        userId: info[TlUserDef.id],
        username: info[TlUserDef.name],
        userAvatar: await getAvatarOssUrl(info[TlUserDef.avatarUrl]),
        userCompanyName: loginUserCompanyName,
        wechatName: info[TlUserDef.wchatName],
        channelId: userFriendInfo[TlUserFriendDef.channelId],
        isFriend: isFriend
    }

    return tlResponseSuccess("搜索用户成功", result)
}


/**
 * 用户绑定邮箱
 * @param {*} token
 * @param {*} loginInfo
 * @param {*} email
 * @param {*} code
 */
const bindEmail = async function({ token, loginInfo, email, code }) {
    const { 
        loginUserCompanyId, loginUserId, loginUserEmail
    } = loginInfo
    
    if(!email){
        return tlResponseArgsError("邮箱不能为空")
    }

    if(!code){
        return tlResponseArgsError("验证码不能为空")
    }

    // base64解码
    email = Buffer.from(email, 'base64').toString()
    
    if(!checkIsEmail(email)){
        return tlResponseArgsError("邮箱格式不正确")
    }

    if(email == loginUserEmail){
        return tlResponseForbidden("邮箱未更换")
    }

    // 检查code
    const checkCode = await userSessionService.getEmailCode({
        email
    })

    if (checkCode !== code) {
        return tlResponseArgsError("邮箱验证码错误")
    }

    const emailExist = await userService.getInfoByEmail({
        companyId: loginUserCompanyId,
        email
    }, [
        TlUserDef.id
    ])

    if(emailExist[id] == loginUserId){
        return tlResponseForbidden("邮箱未更换")
    }

    if(Object.keys(emailExist).length > 0){
        return tlResponseForbidden("该邮箱已被其他帐号绑定")
    }

    const result = await userService.updateInfoById({
        companyId: loginUserCompanyId,
        id: loginUserId,
    }, {
        [TlUserDef.email]: email
    })

    if(Object.keys(result).length == 0){
        return tlResponseSvrError("绑定邮箱失败")
    }

    // 更新登录态信息
    await userSessionService.setUserInfoByToken({
        token, info: Object.assign(loginInfo, {
            loginUserEmail: email
        })
    })

    return tlResponseSuccess("绑定邮箱成功")
}




module.exports = {
    searchUserByName,
    searchUserById,
    bindEmail
}