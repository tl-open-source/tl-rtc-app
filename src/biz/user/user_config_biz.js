const { 
    tlResponseSvrError, tlResponseNotFound, tlResponseSuccess,
} = require('../../utils/utils')
const userConfigService = require('../../service/user/tl_user_config_service')

const { fields: userConfigFields } = require('../../tables/tl_user_config')

const TlUserConfigDef = userConfigFields.Def
const TlUserConfigAccountDef = userConfigFields.Account
const TlUserConfigSkinDef = userConfigFields.Skin
const TlUserConfigAuthorityDef = userConfigFields.Authority
const TlUserConfigMessageDef = userConfigFields.Message
const TlUserConfigNormalDef = userConfigFields.Normal
const TlUserConfigOtherDef = userConfigFields.Other


/**
 * 获取用户自定义配置
 * @param {*} loginInfo 
 * @returns 
 */
const getUserConfigSetting = async function({ loginInfo }){
    const { 
        loginUserCompanyId, loginUserId
    } = loginInfo

    let userConfig = await userConfigService.getInfoByUserId({
        companyId: loginUserCompanyId,
        userId: loginUserId
    },[
        TlUserConfigDef.account,
        TlUserConfigDef.message,
        TlUserConfigDef.authority,
        TlUserConfigDef.skin,
        TlUserConfigDef.other,
        TlUserConfigDef.normal
    ])

    // 不存在则创建
    if(Object.keys(userConfig).length == 0){
        const result = await userConfigService.addDefaultInfo({
            companyId: loginUserCompanyId,
            userId: loginUserId
        })

        if(Object.keys(result).length == 0){
            return tlResponseSvrError("获取设置失败")
        }

        userConfig = result
    }

    let userConfigAccount = userConfig[TlUserConfigDef.account]
    let userConfigMessage = userConfig[TlUserConfigDef.message]
    let userConfigAuthority = userConfig[TlUserConfigDef.authority]
    let userConfigSkin = userConfig[TlUserConfigDef.skin]
    let userConfigOther = userConfig[TlUserConfigDef.other]
    let userConfigNormal = userConfig[TlUserConfigDef.normal]

    let result = {
        account: JSON.parse(userConfigAccount),
        message: JSON.parse(userConfigMessage),
        authority: JSON.parse(userConfigAuthority),
        skin: JSON.parse(userConfigSkin),
        other: JSON.parse(userConfigOther),
        normal: JSON.parse(userConfigNormal)
    }

    return tlResponseSuccess("获取成功", result)
}


/**
 * 更新用户配置
 * @param {*} loginInfo
 * @param {*} normal 
 * @returns 
 */
const updateUserConfigNormal = async function({ loginInfo, normal }){
    const { 
        loginUserCompanyId, loginUserId
    } = loginInfo

    const userConfig = await userConfigService.getInfoByUserId({
        companyId: loginUserCompanyId,
        userId: loginUserId
    },[
        TlUserConfigDef.id,
        TlUserConfigDef.normal
    ])

    if(Object.keys(userConfig).length == 0){
        return tlResponseNotFound("用户配置不存在")
    }

    let preNormal = userConfig[TlUserConfigDef.normal]
    preNormal = JSON.parse(preNormal)

    let newNormal = Object.assign(preNormal, normal)
    
    // 更新用户配置
    let updateNormal = {}
    for (let key in TlUserConfigNormalDef) {
        updateNormal[key] = newNormal[key]
    }

    // 更新用户配置
    let userConfigId = userConfig[TlUserConfigDef.id]
    const result = await userConfigService.updateInfoById({
        companyId: loginUserCompanyId,
        id: userConfigId
    }, {
        [TlUserConfigDef.normal]: JSON.stringify(updateNormal)
    })

    if(Object.keys(result).length == 0){
        return tlResponseSvrError("更新失败")
    }

    return tlResponseSuccess("更新成功")
}


/**
 * 更新用户帐号配置
 * @param {*} loginInfo
 * @param {*} account 
 * @returns 
 */
const updateUserConfigAccount = async function({ loginInfo, account }){
    const { 
        loginUserCompanyId, loginUserId
    } = loginInfo

    const userConfig = await userConfigService.getInfoByUserId({
        companyId: loginUserCompanyId,
        userId: loginUserId
    },[
        TlUserConfigDef.id,
        TlUserConfigDef.account
    ])

    if(Object.keys(userConfig).length == 0){
        return tlResponseNotFound("用户配置不存在")
    }

    let preAccount = userConfig[TlUserConfigDef.account]
    preAccount = JSON.parse(preAccount)

    let newAccount = Object.assign(preAccount, account)

    // 更新用户配置
    let updateAccount = {}
    for (let key in TlUserConfigAccountDef) {
        updateAccount[key] = newAccount[key]
    }

    // 更新用户配置
    let userConfigId = userConfig[TlUserConfigDef.id]
    const result = await userConfigService.updateInfoById({
        companyId: loginUserCompanyId,
        id: userConfigId
    }, {
        [TlUserConfigDef.account]: JSON.stringify(updateAccount)
    })

    if(Object.keys(result).length == 0){
        return tlResponseSvrError("更新失败")
    }

    return tlResponseSuccess("更新成功")
}


/**
 * 更新用户消息配置
 * @param {*} loginInfo
 * @param {*} message 
 * @returns 
 */
const updateUserConfigMessage = async function({ loginInfo, message }){
    const { 
        loginUserCompanyId, loginUserId
    } = loginInfo

    const userConfig = await userConfigService.getInfoByUserId({
        companyId: loginUserCompanyId,
        userId: loginUserId
    },[
        TlUserConfigDef.id,
        TlUserConfigDef.message
    ])

    if(Object.keys(userConfig).length == 0){
        return tlResponseNotFound("用户配置不存在")
    }

    let preMessage = userConfig[TlUserConfigDef.message]
    preMessage = JSON.parse(preMessage)

    let newMessage = Object.assign(preMessage, message)

    // 更新用户配置
    let updateMessage = {}
    for (let key in TlUserConfigMessageDef) {
        updateMessage[key] = newMessage[key]
    }

    // 更新用户配置
    let userConfigId = userConfig[TlUserConfigDef.id]
    const result = await userConfigService.updateInfoById({
        companyId: loginUserCompanyId,
        id: userConfigId
    }, {
        [TlUserConfigDef.message]: JSON.stringify(updateMessage)
    })

    if(Object.keys(result).length == 0){
        return tlResponseSvrError("更新失败")
    }

    return tlResponseSuccess("更新成功")
}

/**
 * 更新用户权限配置
 * @param {*} loginInfo
 * @param {*} authority 
 * @returns 
 */
const updateUserConfigAuthority = async function({ loginInfo, authority }){
    const { 
        loginUserCompanyId, loginUserId
    } = loginInfo

    const userConfig = await userConfigService.getInfoByUserId({
        companyId: loginUserCompanyId,
        userId: loginUserId
    },[
        TlUserConfigDef.id,
        TlUserConfigDef.authority
    ])

    if(Object.keys(userConfig).length == 0){
        return tlResponseNotFound("用户配置不存在")
    }

    let preAuthority = userConfig[TlUserConfigDef.authority]
    preAuthority = JSON.parse(preAuthority)

    let newAuthority = Object.assign(preAuthority, authority)

    // 更新用户配置
    let updateAuthority = {}
    for (let key in TlUserConfigAuthorityDef) {
        updateAuthority[key] = newAuthority[key]
    }

    // 更新用户配置
    let userConfigId = userConfig[TlUserConfigDef.id]
    const result = await userConfigService.updateInfoById({
        companyId: loginUserCompanyId,
        id: userConfigId
    }, {
        [TlUserConfigDef.authority]: JSON.stringify(updateAuthority)
    })

    if(Object.keys(result).length == 0){
        return tlResponseSvrError("更新失败")
    }

    return tlResponseSuccess("更新成功")
}

/**
 * 更新用户皮肤配置
 * @param {*} loginInfo
 * @param {*} skin 
 * @returns 
 */
const updateUserConfigSkin = async function({ loginInfo, skin }){
    const { 
        loginUserCompanyId, loginUserId
    } = loginInfo

    const userConfig = await userConfigService.getInfoByUserId({
        companyId: loginUserCompanyId,
        userId: loginUserId
    },[
        TlUserConfigDef.id,
        TlUserConfigDef.skin
    ])

    if(Object.keys(userConfig).length == 0){
        return tlResponseNotFound("用户配置不存在")
    }

    let preSkin = userConfig[TlUserConfigDef.skin]
    preSkin = JSON.parse(preSkin)

    let newSkin = Object.assign(preSkin, skin)

    // 更新用户配置
    let updateSkin = {}
    for (let key in TlUserConfigSkinDef) {
        updateSkin[key] = newSkin[key]
    }

    // 更新用户配置
    let userConfigId = userConfig[TlUserConfigDef.id]
    const result = await userConfigService.updateInfoById({
        companyId: loginUserCompanyId,
        id: userConfigId
    }, {
        [TlUserConfigDef.skin]: JSON.stringify(updateSkin)
    })

    if(Object.keys(result).length == 0){
        return tlResponseSvrError("更新失败")
    }

    return tlResponseSuccess("更新成功")
}


/**
 * 更新用户其他配置
 * @param {*} loginInfo
 * @param {*} other 
 * @returns 
 */
const updateUserConfigOther = async function({ loginInfo, other }){
    const { 
        loginUserCompanyId, loginUserId
    } = loginInfo

    const userConfig = await userConfigService.getInfoByUserId({
        companyId: loginUserCompanyId,
        userId: loginUserId
    },[
        TlUserConfigDef.id,
        TlUserConfigDef.other
    ])

    if(Object.keys(userConfig).length == 0){
        return tlResponseNotFound("用户配置不存在")
    }

    let preOther = userConfig[TlUserConfigDef.other]
    preOther = JSON.parse(preOther)

    let newOther = Object.assign(preOther, other)

    // 更新用户配置
    let updateOther = {}
    for (let key in TlUserConfigOtherDef) {
        updateOther[key] = newOther[key]
    }

    // 更新用户配置
    let userConfigId = userConfig[TlUserConfigDef.id]
    const result = await userConfigService.updateInfoById({
        companyId: loginUserCompanyId,
        id: userConfigId
    }, {
        [TlUserConfigDef.other]: JSON.stringify(updateOther)
    })

    if(Object.keys(result).length == 0){
        return tlResponseSvrError("更新失败")
    }

    return tlResponseSuccess("更新成功")
}




module.exports = {
    getUserConfigSetting,
    updateUserConfigNormal,
    updateUserConfigAccount,
    updateUserConfigMessage,
    updateUserConfigAuthority,
    updateUserConfigSkin,
    updateUserConfigOther
}