const uuid = require('uuid')
const {
    tlResponseArgsError, tlResponseForbidden, tlResponseSvrError, 
    tlResponseNotFound, tlResponseSuccess,
    checkBit,
    setBit, checkIsId
} = require('../../utils/utils')
const companyService = require('../../service/company/tl_company_service')
const { inner: TlRoleInner } = require('../../tables/tl_role')
const { fields: TlCompanyFields } = require('../../tables/tl_company')

const {
    Def: TlCompanyDef, Flag: TlCompanyFlag
} = TlCompanyFields


/**
 * 添加企业 - 管理员
 * @param {*} loginInfo
 * @param {*} name
 * @param {*} address
 * @param {*} phone
 * @param {*} email
 * @param {*} website
 * @param {*} logo
 * @param {*} description
 */
const adminAddCompany = async function ({
    loginInfo, name, address, phone, email, website, logo, description
}) {
    const {
        loginUserCompanyId, loginUserId, loginUserRoleId
    } = loginInfo

    if(loginUserRoleId !== TlRoleInner.user.admin.id){
        return tlResponseForbidden("非法用户")
    }

    if(!name){
        return tlResponseArgsError("请求参数错误")
    }

    if(!address){
        return tlResponseArgsError("请求参数错误")
    }

    if(!phone){
        return tlResponseArgsError("请求参数错误")
    }

    if(!email){
        return tlResponseArgsError("请求参数错误")
    }

    if(!website){
        return tlResponseArgsError("请求参数错误")
    }

    if(!logo){
        return tlResponseArgsError("请求参数错误")
    }

    if(!description){
        return tlResponseArgsError("请求参数错误")
    }

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

    return tlResponseSuccess("添加成功", info)
}


/**
 * 更新企业 - 管理员
 * @param {*} loginInfo
 * @param {*} id
 * @param {*} name
 * @param {*} address
 * @param {*} phone
 * @param {*} email
 * @param {*} website
 * @param {*} logo
 * @param {*} description
 * @param {*} code
 * @param {*} authStatus
 * @param {*} expiredStatus
 */
const adminUpdateCompany = async function ({
    id, loginInfo, name, address, phone, email, 
    website, logo, description, code, authStatus, expiredStatus
}) {
    const {
        loginUserCompanyId, loginUserId, loginUserRoleId
    } = loginInfo

    if(loginUserRoleId !== TlRoleInner.user.admin.id){
        return tlResponseForbidden("非法用户")
    }

    if(!id){
        return tlResponseArgsError("请求参数错误")
    }

    if(!name){
        return tlResponseArgsError("请求参数错误")
    }

    if(!address){
        return tlResponseArgsError("请求参数错误")
    }

    if(!phone){
        return tlResponseArgsError("请求参数错误")
    }

    if(!email){
        return tlResponseArgsError("请求参数错误")
    }

    if(!website){
        return tlResponseArgsError("请求参数错误")
    }

    if(!logo){
        return tlResponseArgsError("请求参数错误")
    }

    if(!description){
        return tlResponseArgsError("请求参数错误")
    }

    if(!code){
        return tlResponseArgsError("请求参数错误")
    }

    const info = await companyService.getInfoById({
        id
    })

    if(Object.keys(info).length == 0){
        return tlResponseNotFound("企业不存在")
    }

    let flag = 0
    if(authStatus){
        flag = setBit(flag, TlCompanyFlag.IS_PASS_AUTH, true)
    }else{
        flag = setBit(flag, TlCompanyFlag.IS_PASS_AUTH, false)
    }

    if(expiredStatus){
        flag = setBit(flag, TlCompanyFlag.IS_EXPIRED, true)
    }else{
        flag = setBit(flag, TlCompanyFlag.IS_EXPIRED, false)
    }

    const result = await companyService.updateInfoById({
        id: id,
    }, {
        [TlCompanyDef.name]: name,
        [TlCompanyDef.address]: address,
        [TlCompanyDef.phone]: phone,
        [TlCompanyDef.email]: email,
        [TlCompanyDef.website]: website,
        [TlCompanyDef.logo]: logo,
        [TlCompanyDef.description]: description,
        [TlCompanyDef.code]: code,
        [TlCompanyDef.flag]: flag
    })

    if(Object.keys(result).length == 0){
        return tlResponseSvrError("更新失败")
    }

    return tlResponseSuccess("更新成功")
}


/**
 * 获取企业信息
 * @param {*} loginInfo
 */
const getCompanyInfo = async function ({
    loginInfo
}) {
    const {
        loginUserCompanyId, loginUserId, loginUserRoleId
    } = loginInfo

    if(loginUserRoleId !== TlRoleInner.user.admin.id){
        return tlResponseForbidden("非法用户")
    }

    const info = await companyService.getInfoById({
        id: loginUserCompanyId
    })

    return tlResponseSuccess("获取成功", info)
}


/**
 * 获取企业列表 - 管理员
 * @param {*} loginInfo
 * @param {*} page
 * @param {*} limit
 * @param {*} keyword
 * @returns 
 */
const adminGetCompanyList = async function ({
    loginInfo, page, limit, keyword
}) {
    const {
        loginUserCompanyId, loginUserId, loginUserRoleId
    } = loginInfo

    if(loginUserRoleId !== TlRoleInner.user.admin.id){
        return tlResponseForbidden("非法用户")
    }

    if(!page){
        return tlResponseArgsError("请求参数错误")
    }

    if(!limit){
        return tlResponseArgsError("请求参数错误")
    }

    if(!checkIsId(page)){
        return tlResponseArgsError("请求参数错误")
    }

    if(!checkIsId(limit)){
        return tlResponseArgsError("请求参数错误")
    }

    page = parseInt(page)
    limit = parseInt(limit)

    let list = []
    let total = 0

    if(keyword == "" || keyword == undefined || keyword == null){
        list = await companyService.getListForPage({}, [
            TlCompanyDef.id, 
            TlCompanyDef.name, 
            TlCompanyDef.address, 
            TlCompanyDef.phone, 
            TlCompanyDef.email, 
            TlCompanyDef.website, 
            TlCompanyDef.logo, 
            TlCompanyDef.description,
            TlCompanyDef.code, 
            TlCompanyDef.flag,
            TlCompanyDef.createdAt
        ], page, limit)

        total = await companyService.getCount({})

    }else{
        list = await companyService.getListByKeywordForPage({
            keyword: keyword
        }, [
            TlCompanyDef.id, 
            TlCompanyDef.name, 
            TlCompanyDef.address, 
            TlCompanyDef.phone, 
            TlCompanyDef.email, 
            TlCompanyDef.website, 
            TlCompanyDef.logo, 
            TlCompanyDef.description,
            TlCompanyDef.code, 
            TlCompanyDef.flag,
            TlCompanyDef.createdAt
        ], page, limit)

        total = await companyService.getCountByKeyword({
            keyword: keyword
        })
    }

    let resultList = []
    for (let i = 0; i < list.length; i++) {
        const item = list[i];
        let flag = item[TlCompanyDef.flag] || 0

        const authStatus = checkBit(flag, TlCompanyFlag.IS_PASS_AUTH)
        const expiredStatus = checkBit(flag, TlCompanyFlag.IS_EXPIRED)

        resultList.push({
            id: item[TlCompanyDef.id],
            name: item[TlCompanyDef.name],
            address: item[TlCompanyDef.address],
            phone: item[TlCompanyDef.phone],
            email: item[TlCompanyDef.email],
            website: item[TlCompanyDef.website],
            logo: item[TlCompanyDef.logo],
            description: item[TlCompanyDef.description],
            code: item[TlCompanyDef.code],
            authStatus,
            expiredStatus,
            createTime: item[TlCompanyDef.createdAt],
        })
    }

    return tlResponseSuccess("获取成功", {
        list: resultList,
        count: total
    })
}


/**
 * 删除企业 - 管理员
 * @param {*} loginInfo 
 * @returns 
 */
const adminDeleteCompany = async function ({loginInfo, id}) {
    const {
        loginUserCompanyId, loginUserId, loginUserRoleId
    } = loginInfo

    if(loginUserRoleId !== TlRoleInner.user.admin.id){
        return tlResponseForbidden("非法用户")
    }

    if(!id){
        return tlResponseArgsError("请求参数错误")
    }

    const info = await companyService.getInfoById({
        id
    })

    if(Object.keys(info).length == 0){
        return tlResponseNotFound("企业不存在")
    }

    const result = await companyService.deleteInfoById({
        id
    })

    if(result == 0){
        return tlResponseNotFound("删除失败")
    }

    return tlResponseSuccess("删除成功")
}


/**
 * 获取企业信息 - 管理员
 * @param {*} id
 * @param {*} loginInfo
 * @returns 
 */
const adminGetCompanyInfo = async function ({
    id, loginInfo
}) {
    const {
        loginUserCompanyId, loginUserId, loginUserRoleId
    } = loginInfo

    if(loginUserRoleId !== TlRoleInner.user.admin.id){
        return tlResponseForbidden("非法用户")
    }

    if(!id){
        return tlResponseArgsError("请求参数错误")
    }

    const info = await companyService.getInfoById({
        id
    })

    if(Object.keys(info).length == 0){
        return tlResponseNotFound("企业不存在")
    }

    let flag = info[TlCompanyDef.flag] || 0

    const authStatus = checkBit(flag, TlCompanyFlag.IS_PASS_AUTH)
    const expiredStatus = checkBit(flag, TlCompanyFlag.IS_EXPIRED)

    return tlResponseSuccess("获取成功", {
        id: info[TlCompanyDef.id],
        name: info[TlCompanyDef.name],
        address: info[TlCompanyDef.address],
        phone: info[TlCompanyDef.phone],
        email: info[TlCompanyDef.email],
        website: info[TlCompanyDef.website],
        logo: info[TlCompanyDef.logo],
        description: info[TlCompanyDef.description],
        code: info[TlCompanyDef.code],
        authStatus,
        expiredStatus,
        createTime: info[TlCompanyDef.createdAt],
    })
}


module.exports = {
    getCompanyInfo,

    adminAddCompany,
    adminUpdateCompany,
    adminGetCompanyList,
    adminDeleteCompany,
    adminGetCompanyInfo
}