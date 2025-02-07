const crypto = require('crypto')
const { 
    tlResponseArgsError, tlResponseForbidden, tlResponseSvrError, 
    tlResponseTimeout, tlResponseNotFound, tlResponseSuccess,
    tlConsole,
    checkIsEmail, checkIsMobile,
    tlConsoleError,
    encryptStr
} = require('../../utils/utils');
const {
    sendVerificationCodeEmail
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
const { Def: TlUserAuthDef, Type: TlUserAuthType } = userAuthFields
const { Def: TlCompanyFields } = companyFields


/**
 * 通过帐号注册接口
 * @param {*} account
 * @param {*} password
 * @param {*} invite_code
 */
const userRegisterByAccount = async function({account, password, invite_code}){
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
 * 通过手机号注册接口
 * @param {*} mobile
 * @param {*} code
 * @param {*} invite_code
 */
const userRegisterByMobile = async function({mobile, code, invite_code}){
    if(!mobile){
        return tlResponseArgsError("手机号不能为空")
    }
    if(!code){
        return tlResponseArgsError("验证码不能为空")
    }
    if(!invite_code){
        return tlResponseArgsError("邀请码不能为空")
    }
    if(!checkIsMobile(mobile)){
        return tlResponseArgsError("手机号格式不正确")
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
    const checkCode = await userSessionService.getMobileCode({
        mobile
    })
    if (checkCode !== code) {
        return tlResponseArgsError("手机验证码错误")
    }

    const companyId = company.id

    const user = await userService.getInfoByMobile({
        companyId: companyId,
        mobile
    }, [
        TlUserDef.id
    ])
    if(user[TlUserDef.id]){
        return tlResponseArgsError("手机号已存在")
    }

    const salt = crypto.randomBytes(16).toString('hex')

    const result = await userService.addInfo({
        companyId : companyId,
        name : '手机用户-' + Math.floor(Math.random() * 1000000),
        mobile,
        roleId : TlRoleInner.user.normal.id,
        salt,
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
const userRegisterByEmail = async function({email, code, invite_code, password}){
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
 * 通过微信注册接口
 * @param {*} code
 * @param {*} openId
 */
const userRegisterByWechat = async function({openId, code}){
    const params = {
        code, openId
    }
    
    return tlResponseSuccess("注册成功", params)
}

/**
 * 通过qq注册接口
 * @param {*} code
 * @param {*} openId
 */
const userRegisterByQQ = async function({openId, code}){
    const params = {
        code, openId
    }
    
    return tlResponseSuccess("注册成功", params)
}

/**
 * 通过企业微信注册接口
 * @param {*} code
 * @param {*} openId
 */
const userRegisterByWechatWork = async function({openId, code}){
    const params = {
        code, openId
    }
        
    return tlResponseSuccess("注册成功", params)
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
        tlConsoleError("验证码发送添加记录失败")
    }

    return tlResponseSuccess("验证码发送成功", {
        code
    })
}

/**
 * 注册官网用户
 * @param {*} email 
 * @param {*} code 
 * @param {*} password 
 * @returns 
 */
const registerWebsiteUser = async function({ email, code, password }){
    // 默认挂在首个企业下
    const companyId = 1

    if(!email){
        return tlResponseArgsError("邮箱不能为空")
    }
    if(!code){
        return tlResponseArgsError("验证码不能为空")
    }
    if(!password) {
        return tlResponseArgsError("密码不能为空")
    }
    // base64解码
    email = Buffer.from(email, 'base64').toString()
    password = Buffer.from(password, 'base64').toString()
    
    if(!checkIsEmail(email)){
        return tlResponseArgsError("邮箱格式不正确")
    }

    // 检查code
    const checkCode = await userSessionService.getEmailCode({
        email
    })
    if (checkCode !== code) {
        return tlResponseArgsError("邮箱验证码错误")
    }

    const user = await userService.getInfoByEmail({
        companyId: companyId,
        email
    }, [
        TlUserDef.id
    ])

    if(user.id){
        return tlResponseArgsError("邮箱已注册")
    }

    const salt = crypto.randomBytes(16).toString('hex')
    const saltPassword = encryptStr({
        str: password,
        salt: salt
    })

    const result = await userService.addInfo({
        companyId : companyId,
        name : "官网用户-" + String(Math.floor(Math.random() * 1000000)),
        email,
        password: saltPassword,
        roleId : TlRoleInner.website.user.id,
        salt,
        avatarUrl: "/image/default-avatar.png"
    })

    if (Object.keys(result).length === 0) {
        return tlResponseSvrError("注册失败")
    }
    
    return tlResponseSuccess("注册成功")
}


module.exports = {
    userRegisterByAccount,
    userRegisterByMobile,
    userRegisterByEmail,
    userRegisterByWechat,
    userRegisterByQQ,
    userRegisterByWechatWork,
    getEmailCode,
    registerWebsiteUser
}