const crypto = require('crypto')
const { 
    tlResponseArgsError, tlResponseForbidden, tlResponseSvrError, 
    tlResponseSuccess,
    tlConsole,
    checkIsEmail, checkIsMobile,
    tlConsoleError,
    encryptStr
} = require('../../utils/utils');
const {
    sendVerificationCodeEmail, sendResetPasswordEmail
} = require('../../utils/mail/mail');

const companyService = require('../../service/company/tl_company_service')
const userService = require('../../service/user/tl_user_service')
const userSessionService = require('../../service/user/tl_user_session_service')
const userAuthService = require('../../service/user/tl_user_auth_service')

const { fields: companyFields } = require('../../tables/tl_company')
const { inner: TlRoleInner } = require('../../tables/tl_role')
const { fields: userFields } = require('../../tables/tl_user')
const { fields: userAuthFields } = require('../../tables/tl_user_auth');
const { Def: TlUserDef } = userFields
const { Type: TlUserAuthType } = userAuthFields
const { Def: TlCompanyFields } = companyFields


/**
 * 通过帐号注册接口
 * @param {*} account
 * @param {*} password
 * @param {*} invite_code
 */
const userRegisterByAccount = async function({
    account, password, invite_code
}){
    if(!account){
        return tlResponseArgsError("帐号不能为空")
    }

    if(!password){
        return tlResponseArgsError("密码不能为空")
    }

    // base64解码
    account = Buffer.from(account, 'base64').toString()
    password = Buffer.from(password, 'base64').toString()

    if(!invite_code){
        return tlResponseArgsError("邀请码不能为空")
    }

    if(account.length > 20){
        return tlResponseArgsError("帐号长度不能超过20")
    }

    if(password.length > 64){
        return tlResponseArgsError("密码长度不能超过64")
    }

    const company = await companyService.getInfoByCode({
        code: invite_code
    }, [
        TlCompanyFields.id
    ])

    if(Object.keys(company).length === 0){
        return tlResponseArgsError("邀请码无效")
    }

    const companyId = company.id

    const user = await userService.getInfoByName({
        companyId: companyId,
        name: account
    }, [
        TlUserDef.id
    ])
    
    if(user[TlUserDef.id]){
        return tlResponseArgsError("帐号已存在")
    }

    const salt = crypto.randomBytes(16).toString('hex')
    const saltPassword = encryptStr({
        str: password,
        salt: salt
    })

    tlConsole(account, password, salt, saltPassword)

    const result = await userService.addInfo({
        companyId : companyId,
        name : account,
        password: saltPassword,
        roleId : TlRoleInner.user.normal.id,
        salt,
        avatarUrl: "/image/default-avatar.png"
    })

    if (Object.keys(result).length === 0) {
        return tlResponseSvrError("注册失败")
    }
    
    return tlResponseSuccess("注册成功")
}


/**
 * 通过邮箱注册接口
 * @param {*} email
 * @param {*} code
 * @param {*} invite_code
 * @param {*} password
 */
const userRegisterByEmail = async function({
    email, code, invite_code, password
}){
    if(!email){
        return tlResponseArgsError("邮箱不能为空")
    }

    if(!code){
        return tlResponseArgsError("验证码不能为空")
    }

    if(!invite_code){
        return tlResponseArgsError("邀请码不能为空")
    }

    if (!password) {
        return tlResponseArgsError("密码不能为空")
    }
    
    // base64解码
    email = Buffer.from(email, 'base64').toString()
    password = Buffer.from(password, 'base64').toString()
    
    if(!checkIsEmail(email)){
        return tlResponseArgsError("邮箱格式不正确")
    }

    const company = await companyService.getInfoByCode({
        code: invite_code
    }, [
        TlCompanyFields.id
    ])

    if(Object.keys(company).length === 0){
        return tlResponseArgsError("邀请码无效")
    }

    // 检查code
    const checkCode = await userSessionService.getEmailCode({
        email
    })
    if (checkCode !== code) {
        return tlResponseArgsError("邮箱验证码错误")
    }

    const companyId = company.id

    const user = await userService.getInfoByEmail({
        companyId: companyId,
        email
    }, [
        TlUserDef.id
    ])

    if(user.id){
        return tlResponseArgsError("邮箱已存在")
    }

    const salt = crypto.randomBytes(16).toString('hex')
    const saltPassword = encryptStr({
        str: password,
        salt: salt
    })

    const result = await userService.addInfo({
        companyId : companyId,
        name : '邮箱用户-' + Math.floor(Math.random() * 1000000),
        email,
        password: saltPassword,
        roleId : TlRoleInner.user.normal.id,
        salt,
        avatarUrl: "/image/default-avatar.png"
    })

    if (Object.keys(result).length === 0) {
        return tlResponseSvrError("注册失败")
    }
    
    return tlResponseSuccess("注册成功")
}

/**
 * 获取邮箱验证码
 * @param {*} email 
 * @returns 
 */
const getEmailCode = async function({email}){
    if(!email){
        return tlResponseArgsError("邮箱不能为空")
    }

    if(!checkIsEmail(email)){
        return tlResponseArgsError("邮箱格式不正确")
    }

    // 检查总次数
    const totalCount = await userAuthService.getDayCountByType({
        type: TlUserAuthType.EMAIL_REGISTER_CODE,
    })

    if(totalCount >= 1000){
        return tlResponseForbidden("当天系统发送验证码次数已达上限")
    }

    // 检查次数
    const count = await userAuthService.getDayCountByTypeAndKey({
        type: TlUserAuthType.EMAIL_REGISTER_CODE,
        key: email
    })

    if(count >= 5){
        return tlResponseForbidden("当天获取验证码次数已达上限")
    }

    const code = Math.floor(Math.random() * 1000000)

    await userSessionService.setEmailCode({
        email, code
    })

    await sendVerificationCodeEmail({
        to: email,
        code: code,
        expire: 5,
        companyName: "tl-open-source开源团队",
        companyUrl: "https://tl-open-source.github.com/"
    }).then((res) => {
        tlConsole("邮件验证码发送成功", res)
    })

    const result = await userAuthService.addInfo({
        key: email,
        type: TlUserAuthType.EMAIL_REGISTER_CODE,
        code: String(code)
    })

    if (Object.keys(result).length === 0) {
        tlConsoleError("发送异常")
    }

    return tlResponseSuccess("发送成功", {
        // code
    })
}

/**
 * 通过邮箱重置密码接口
 * @param {*} email
 * @param {*} code
 * @param {*} invite_code
 */
const resetPasswordByEmail = async function({
    email, code, invite_code
}){
    if(!email){
        return tlResponseArgsError("邮箱不能为空")
    }

    if(!code){
        return tlResponseArgsError("验证码不能为空")
    }

    if(!invite_code){
        return tlResponseArgsError("邀请码不能为空")
    }
    
    // base64解码
    email = Buffer.from(email, 'base64').toString()    
    if(!checkIsEmail(email)){
        return tlResponseArgsError("邮箱格式不正确")
    }

    const company = await companyService.getInfoByCode({
        code: invite_code
    }, [
        TlCompanyFields.id
    ])

    if(Object.keys(company).length === 0){
        return tlResponseArgsError("邀请码无效")
    }

    // 检查code
    const checkCode = await userSessionService.getEmailCode({
        email
    })
    if (checkCode !== code) {
        return tlResponseArgsError("邮箱验证码错误")
    }

    // 检查次数, 一天之内重置一次
    const count = await userAuthService.getDayCountByTypeAndKey({
        type: TlUserAuthType.EMAIL_RESET_PASSWORD,
        key: email
    })

    if(count >= 1){
        return tlResponseForbidden("当天获重置次数已达上限")
    }

    const companyId = company[TlCompanyFields.id]

    const user = await userService.getInfoByEmail({
        companyId: companyId,
        email
    }, [
        TlUserDef.id
    ])

    if(Object.keys(user).length === 0){
        return tlResponseArgsError("邮箱不存在")
    }

    const userId = user[TlUserDef.id]
    const newPassword = Math.floor(Math.random() * 100000000) + ""

    const salt = crypto.randomBytes(16).toString('hex')
    const saltPassword = encryptStr({
        str: newPassword,
        salt: salt
    })

    const updateRes = await userService.updateInfoById({
        companyId : companyId,
        id: userId
    }, {
        [TlUserDef.password]: saltPassword,
        [TlUserDef.salt]: salt
    })

    if (Object.keys(updateRes).length === 0) {
        return tlResponseSvrError("重置密码失败")
    }

    // 发送重置密码邮件
    await sendResetPasswordEmail({
        to: email,
        password: newPassword,
        companyName: "tl-open-source开源团队",
        companyUrl: "https://tl-open-source.github.com/"
    }).then((res) => {
        tlConsole("重置密码邮件发送成功", res)
    })

    // 添加重置记录
    const result = await userAuthService.addInfo({
        key: email,
        type: TlUserAuthType.EMAIL_RESET_PASSWORD,
        code: String(newPassword)
    })

    if (Object.keys(result).length === 0) {
        tlConsoleError("重置密码添加记录失败")
    }
    
    return tlResponseSuccess("重置成功")
}




module.exports = {
    userRegisterByAccount,
    userRegisterByEmail,
    getEmailCode,
    resetPasswordByEmail
}