const crypto = require('crypto')
const { 
    tlResponseArgsError, tlResponseForbidden, tlResponseSvrError, 
    tlResponseSuccess,
    tlConsole, verifyEncryptStr, getFormattedDate, encryptStr,
    setBit
} = require('../../utils/utils')
const {
    getAvatarOssUrl
} = require('../../utils/oss/oss')
const userService = require('../../service/user/tl_user_service')
const userSessionService = require('../../service/user/tl_user_session_service')
const companyService = require('../../service/company/tl_company_service')
const channelUserService = require('../../service/channel/tl_channel_user_service')
const userFingerPrintService = require('../../service/user/tl_user_finger_print_service')

const { fields: companyFields } = require('../../tables/tl_company')
const { Def: TlCompanyDef } = companyFields
const { fields: userFields } = require('../../tables/tl_user')
const { Def: TlUserDef, Flag: TlUserFlag } = userFields
const { fields: userFingerPrintFields } = require('../../tables/tl_user_finger_print')
const { Def: TlUserFingerPrintDef } = userFingerPrintFields
const { fields: channelUserFields } = require('../../tables/tl_channel_user')
const { Def: TlChannelUserDef } = channelUserFields
const { inner: TlRoleInner } = require('../../tables/tl_role')


/**
 * 通过帐号登录接口
 * @param {*} account
 * @param {*} password
 * @param {*} fps
 */
const userLoginByAccount = async function({account, password, fps}){
    if(!account){
        return tlResponseArgsError("用户名或密码错误")
    }

    if(!password){
        return tlResponseArgsError("用户名或密码错误")
    }

    // base64解码
    account = Buffer.from(account, 'base64').toString()
    password = Buffer.from(password, 'base64').toString()

    if(account.length > 20){
        return tlResponseArgsError("用户名或密码错误")
    }

    if(password.length > 64){
        return tlResponseArgsError("用户名或密码错误")
    }

    const user = await userService.getInfoByNameForLogin({
        name: account
    }, [
        TlUserDef.id,
        TlUserDef.companyId,
        TlUserDef.name,
        TlUserDef.password,
        TlUserDef.avatarUrl,
        TlUserDef.salt,
        TlUserDef.roleId,
        TlUserDef.email,
        TlUserDef.mobile
    ])

    if(!user[TlUserDef.id]){
        return tlResponseArgsError("用户名或密码错误")
    }

    if(!verifyEncryptStr({
        inputStr: password,
        hashedStr: user[TlUserDef.password],
        salt: user[TlUserDef.salt]
    })){
        return tlResponseArgsError("用户名或密码错误")
    }

    const company = await companyService.getInfoById({
        id: user[TlUserDef.companyId]
    }, [
        TlCompanyDef.id,
        TlCompanyDef.name,
    ])

    const companyId = company[TlCompanyDef.id]
    const companyName = company[TlCompanyDef.name]

    if(!companyId){
        return tlResponseForbidden("非法用户")
    }

    const token = userSessionService.generateLoginToken();
    const info = {
        loginUserId: user[TlUserDef.id],
        loginUsername: user[TlUserDef.name],
        loginUserEmail: user[TlUserDef.email],
        loginUserMobile: user[TlUserDef.mobile],
        loginUserRoleId: user[TlUserDef.roleId],
        loginUserCompanyName : companyName,
        loginUserCompanyId: companyId,
        loginUserAvatar: await getAvatarOssUrl(user[TlUserDef.avatarUrl]),
        loginTime: new Date().getTime(),
        token
    }
    // 设置登录信息
    await userSessionService.setUserInfoByToken({token, info})

    // 设置指纹
    await setFps({ userId: user[TlUserDef.id], fps })

    // 设置用户频道角色
    await setUserChannelRole({ userId: user[TlUserDef.id], companyId })

    return tlResponseSuccess("登录成功", token)
}

/**
 * 通过邮箱登录接口
 * @param {*} email
 * @param {*} password
 * @param {*} fps
 */
const userLoginByEmail = async function({email, password, fps}){
    if(!email){
        return tlResponseArgsError("邮箱或密码错误")
    }

    if(!password){
        return tlResponseArgsError("邮箱或密码错误")
    }

    // base64解码
    email = Buffer.from(email, 'base64').toString()
    password = Buffer.from(password, 'base64').toString()

    if(email.length > 50){
        return tlResponseArgsError("邮箱或密码错误")
    }

    if(password.length > 64){
        return tlResponseArgsError("邮箱或密码错误")
    }

    const user = await userService.getInfoByEmailForLogin({
        email
    }, [
        TlUserDef.id,
        TlUserDef.companyId,
        TlUserDef.email,
        TlUserDef.avatarUrl,
        TlUserDef.password,
        TlUserDef.roleId,
        TlUserDef.mobile,
        TlUserDef.salt,
        TlUserDef.name
    ])

    if(!user[TlUserDef.id]){
        return tlResponseArgsError("邮箱或密码错误")
    }

    const company = await companyService.getInfoById({
        id: user[TlUserDef.companyId]
    }, [
        TlCompanyDef.id,
        TlCompanyDef.name
    ])

    const companyId = company[TlCompanyDef.id]
    const companyName = company[TlCompanyDef.name]

    if(!companyId){
        return tlResponseForbidden("非法用户")
    }

    if(!verifyEncryptStr({
        inputStr: password,
        hashedStr: user[TlUserDef.password],
        salt: user[TlUserDef.salt]
    })){
        return tlResponseArgsError("邮箱或密码错误")
    }

    const token = userSessionService.generateLoginToken();
    const info = {
        loginUserId: user[TlUserDef.id],
        loginUserEmail: user[TlUserDef.email],
        loginUsername: user[TlUserDef.name],
        loginUserRoleId: user[TlUserDef.roleId],
        loginUserMobile: user[TlUserDef.mobile],
        loginUserCompanyName : companyName,
        loginUserCompanyId: companyId,
        loginUserAvatar: await getAvatarOssUrl(user[TlUserDef.avatarUrl]),
        loginTime: new Date().getTime(),
        token
    }
    // 设置登录信息
    await userSessionService.setUserInfoByToken({token, info})

    // 设置指纹
    await setFps({ userId: user[TlUserDef.id], fps })

    // 设置用户频道角色
    await setUserChannelRole({ userId: user[TlUserDef.id], companyId })
    
    return tlResponseSuccess("登录成功", token)
}


/**
 * 通过指纹登录接口 - 一键登录
 * @param {*} fps
 * @param {*} username
 */
const userLoginByFingerPrint = async function({fps, username}){
    if(!fps){
        return tlResponseArgsError("一键登录失败, 请使用其他登录方式登录")
    }

    if(!username){
        return tlResponseArgsError("一键登录失败, 请使用其他登录方式登录")
    }

    if(username.length > 20){
        return tlResponseArgsError("一键登录失败, 请使用其他登录方式登录")
    }

    const user = await userService.getInfoByNameForLogin({
        name: username
    }, [
        TlUserDef.id,
        TlUserDef.companyId,
        TlUserDef.name,
        TlUserDef.avatarUrl,
        TlUserDef.roleId,
        TlUserDef.email,
        TlUserDef.salt,
        TlUserDef.mobile
    ])

    if(!user[TlUserDef.id]){
        return tlResponseArgsError("一键登录失败, 请使用其他登录方式登录")
    }

    const company = await companyService.getInfoById({
        id: user[TlUserDef.companyId]
    }, [
        TlCompanyDef.id,
        TlCompanyDef.name
    ])

    const companyId = company[TlCompanyDef.id]
    const companyName = company[TlCompanyDef.name]

    if(!companyId){
        return tlResponseForbidden("一键登录失败, 请使用其他登录方式登录")
    }

    // 检查指纹
    const fingerPrintList = await userFingerPrintService.getListByUserId({
        userId: user[TlUserDef.id]
    }, [
        TlUserFingerPrintDef.finger_print,
    ])

    let isExist = false
    fps.forEach(fp => {
        fingerPrintList.forEach(element => {
            if(element[TlUserFingerPrintDef.finger_print] === fp){
                isExist = true
                return
            }
        })
    })

    if(!isExist){
        return tlResponseForbidden("一键登录失败, 请使用其他登录方式登录")
    }

    const token = userSessionService.generateLoginToken();
    const info = {
        loginUserId: user[TlUserDef.id],
        loginUsername: user[TlUserDef.name],
        loginUserRoleId: user[TlUserDef.roleId],
        loginUserCompanyName : companyName,
        loginUserEmail: user[TlUserDef.email],
        loginUserMobile: user[TlUserDef.mobile],
        loginUserCompanyId: companyId,
        loginUserAvatar: await getAvatarOssUrl(user[TlUserDef.avatarUrl]),
        loginTime: new Date().getTime(),
        token
    }
    // 设置登录信息
    await userSessionService.setUserInfoByToken({token, info})

    // 设置用户频道角色
    await setUserChannelRole({ userId: user[TlUserDef.id], companyId })

    return tlResponseSuccess("一键登录成功", token)
}


/**
 * 设置指纹
 * @param {*} userId
 * @param {*} 
 * @returns 
 */
const setFps = async function({userId, fps}){
    let addFingerPrintList = []

    // 设置指纹
    if(fps){
        const fingerPrintList = await userFingerPrintService.getListByUserId({
            userId: userId
        }, [
            TlUserFingerPrintDef.finger_print,
        ])

        fps.forEach(fp => {
            let isExist = false
            fingerPrintList.forEach(element => {
                if(element[TlUserFingerPrintDef.finger_print] === fp){
                    isExist = true
                    return
                }
            });
            if(!isExist){
                addFingerPrintList.push(fp)
            }
        })

        // 每个用户最多只能有10个指纹
        if(addFingerPrintList.length > 0 && fingerPrintList.length < 10){
            await userFingerPrintService.addInfoList({
                userId: userId,
                dataList: addFingerPrintList
            })
        }
    }

    return addFingerPrintList
}


/**
 * 设置频道用户角色
 * @param {*} userId
 * @param {*} companyId
 */
const setUserChannelRole = async function({userId, companyId}){
    const channelUserList = await channelUserService.getListByUserId({
        companyId: companyId,
        userId: userId
    }, [
        TlChannelUserDef.channelId,
        TlChannelUserDef.roleId
    ])

    if(channelUserList.length === 0){
        return
    }

    const channelRoleMap = {}
    channelUserList.forEach(channelUser => {
        channelRoleMap[channelUser[TlChannelUserDef.channelId]] = channelUser[TlChannelUserDef.roleId]
    })

    await userSessionService.setUserChannelRoleMap({
        userId, channelRoleMap
    })
}


/**
 * 管理后台登录 - 支持邮箱登录
 * @param {*} email
 * @param {*} password
 */
const userLoginBySystem = async function({ email, password }){
    if(!email){
        return tlResponseArgsError("邮箱或密码错误")
    }

    if(!password){
        return tlResponseArgsError("邮箱或密码错误")
    }

    // base64解码
    email = Buffer.from(email, 'base64').toString()
    password = Buffer.from(password, 'base64').toString()

    if(email.length > 50){
        return tlResponseArgsError("邮箱或密码错误")
    }

    if(password.length > 64){
        return tlResponseArgsError("邮箱或密码错误")
    }

    const user = await userService.getInfoByEmailForLogin({
        email
    }, [
        TlUserDef.id,
        TlUserDef.companyId,
        TlUserDef.email,
        TlUserDef.avatarUrl,
        TlUserDef.password,
        TlUserDef.roleId,
        TlUserDef.mobile,
        TlUserDef.salt,
        TlUserDef.name,
    ])

    if(!user[TlUserDef.id]){
        return tlResponseArgsError("邮箱或密码错误")
    }

    const company = await companyService.getInfoById({
        id: user[TlUserDef.companyId]
    }, [
        TlCompanyDef.id,
        TlCompanyDef.name
    ])

    const companyId = company[TlCompanyDef.id]
    const companyName = company[TlCompanyDef.name]

    if(!companyId){
        return tlResponseForbidden("非法用户")
    }

    if(!verifyEncryptStr({
        inputStr: password,
        hashedStr: user[TlUserDef.password],
        salt: user[TlUserDef.salt]
    })){
        return tlResponseArgsError("邮箱或密码错误")
    }

    const roleId = user[TlUserDef.roleId]

    if([
        TlRoleInner.user.admin.id
    ].indexOf(roleId) === -1){
        return tlResponseArgsError("非法用户")
    }

    const token = userSessionService.generateLoginToken();
    const info = {
        loginUserId: user[TlUserDef.id],
        loginUserEmail: user[TlUserDef.email],
        loginUsername: user[TlUserDef.name],
        loginUserRoleId: user[TlUserDef.roleId],
        loginUserMobile: user[TlUserDef.mobile],
        loginUserCompanyName : companyName,
        loginUserCompanyId: companyId,
        loginUserAvatar: await getAvatarOssUrl(user[TlUserDef.avatarUrl]),
        loginTime: new Date().getTime(),
        token
    }
    // 设置登录信息
    await userSessionService.setUserInfoByToken({token, info, isSystem: true})
    
    return tlResponseSuccess("登录成功", token)
}


module.exports = {
    userLoginByAccount,
    userLoginByEmail,
    userLoginByFingerPrint,
    userLoginBySystem
}