const uuid = require('uuid')
const {
    tlResponseArgsError, tlResponseForbidden, tlResponseSvrError, 
    tlResponseTimeout, tlResponseNotFound, tlResponseSuccess
} = require('../../utils/utils')
const companyService = require('../../service/company/tl_company_service')
const userSessionService = require('../../service/user/tl_user_session_service')


/**
 * 添加企业
 * @param {*} loginInfo
 * @param {*} name
 * @param {*} address
 * @param {*} phone
 * @param {*} email
 * @param {*} website
 * @param {*} logo
 * @param {*} description
 */
const addCompany = async function ({
    loginInfo, name, address, phone, email, website, logo, description
}) {
    if(!name){
        return tlResponseArgsError("请求参数为空")
    }

    if(!address){
        return tlResponseArgsError("请求参数为空")
    }

    if(!phone){
        return tlResponseArgsError("请求参数为空")
    }

    if(!email){
        return tlResponseArgsError("请求参数为空")
    }

    if(!website){
        return tlResponseArgsError("请求参数为空")
    }

    if(!logo){
        return tlResponseArgsError("请求参数为空")
    }

    if(!description){
        return tlResponseArgsError("请求参数为空")
    }

    const {
         loginUserCompanyId, loginUserId
    } = loginInfo

    const code = uuid.v4().replace(/-/g, '')

    const info = await companyService.addInfo({
        name,
        address,
        phone,
        email,
        website,
        logo,
        description,
        code
    })

    if(Object.keys(info).length == 0){
        return tlResponseSvrError("添加企业失败")
    }

    return tlResponseSuccess("添加企业成功", info)
}


/**
 * 获取企业信息
 * @param {*} loginInfo
 */
const getCompanyInfo = async function ({loginInfo}) {
    const {
        loginUserCompanyId, loginUserId
    } = loginInfo

    const info = await companyService.getInfoById({
        id: loginUserCompanyId
    })

    return tlResponseSuccess("获取企业信息成功", info)
}


module.exports = {
    addCompany,
    getCompanyInfo
}