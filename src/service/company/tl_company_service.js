const { fields } = require('../../tables/tl_company')
const TlCompanyDao = require('../../dao/tl_company_dao')
const TlCompanyDef = fields.Def
const TableName = fields.Name
const { tlConsoleError, tlConsole } = require("../../../src/utils/utils");
const { Op } = require('sequelize')


/**
 * 添加角色
 * @param {*} data
 */
const addInfo = async function ({
    name, address, phone, email, website, logo, description, code
}) {
    // 参数校验
    if (!name) {
        tlConsoleError(TableName, "请求service参数name为空")
        return {}
    }

    if (!address) {
        tlConsoleError(TableName, "请求service参数address为空")
        return {}
    }

    if (!phone) {
        tlConsoleError(TableName, "请求service参数phone为空")
        return {}
    }

    if (!email) {
        tlConsoleError(TableName, "请求service参数email为空")
        return {}
    }

    if (!website) {
        tlConsoleError(TableName, "请求service参数website为空")
        return {}
    }

    if (!logo) {
        tlConsoleError(TableName, "请求service参数logo为空")
        return {}
    }

    if (!description) {
        tlConsoleError(TableName, "请求service参数description为空")
        return {}
    }

    const info = await TlCompanyDao.addInfo({
        [TlCompanyDef.name]: name,
        [TlCompanyDef.address]: address,
        [TlCompanyDef.phone]: phone,
        [TlCompanyDef.email]: email,
        [TlCompanyDef.website]: website,
        [TlCompanyDef.logo]: logo,
        [TlCompanyDef.code]: code,
        [TlCompanyDef.description]: description
    });

    if (info === null) {
        tlConsoleError(TableName, "请求dao异常")
        return {}
    }

    return info
}

/**
 * 删除企业
 * @param {*} id
 */
const deleteInfoById = async function ({ id }) {
    // 参数校验
    if (!id) {
        tlConsoleError(TableName, "请求service参数id为空")
        return 0
    }

    const info = await TlCompanyDao.deleteInfo({
        [TlCompanyDef.id]: id
    });

    if (info === null) {
        tlConsoleError(TableName, "请求dao异常")
        return 0
    }

    return info
}

/**
 * 更新企业
 * @param {*} data
 * @param {*} id
 */
const updateInfoById = async function ({ id }, data) {
    // 参数校验
    if (Object.keys(data).length === 0) {
        tlConsoleError(TableName, "请求service参数为空")
        return {}
    }

    if (!id) {
        tlConsoleError(TableName, "请求service参数id为空")
        return {}
    }

    const info = await TlCompanyDao.updateInfo({
        [TlCompanyDef.id]: id
    }, data);

    if (info === null) {
        tlConsoleError(TableName, "请求dao异常")
        return {}
    }

    return info
}

/**
 * 获取企业列表
 * @param {*} fields
 * @param {*} page
 * @param {*} pageSize
 */
const getListForPage = async function ({ }, fields, page, pageSize) {
    if(!page){
        tlConsoleError(TableName, "请求service参数page为空")
        return []
    }

    if(!pageSize){
        tlConsoleError(TableName, "请求service参数pageSize为空")
        return []
    }

    if(page <= 0){
        tlConsoleError(TableName, "请求service参数page不合法")
        return []
    }

    if(pageSize <= 0){
        tlConsoleError(TableName, "请求service参数pageSize不合法")
        return []
    }

    if(pageSize > 1000){
        tlConsoleError(TableName, "请求service参数pageSize过大")
        return []
    }

    const infoList = await TlCompanyDao.getListForPage({
        id: {
            [Op.gt]: 0
        }
    }, fields, [
        [TlCompanyDef.createdAt, "DESC"]
    ], page, pageSize);

    if (infoList === null) {
        return []
    }

    return infoList
}

/**
 * 通过关键字获取企业列表
 * @param {*} keyword 
 * @param {*} fields 
 * @param {*} page 
 * @param {*} pageSize 
 * @returns 
 */
const getListByKeywordForPage = async function ({ keyword }, fields, page, pageSize) {
    if(keyword === null || keyword === undefined){
        tlConsoleError(TableName, "请求service参数keyword为空")
        return []
    }

    if(!page){
        tlConsoleError(TableName, "请求service参数page为空")
        return []
    }

    if(!pageSize){
        tlConsoleError(TableName, "请求service参数pageSize为空")
        return []
    }

    if(page <= 0){
        tlConsoleError(TableName, "请求service参数page不合法")
        return []
    }

    if(pageSize <= 0){
        tlConsoleError(TableName, "请求service参数pageSize不合法")
        return []
    }

    if(pageSize > 1000){
        tlConsoleError(TableName, "请求service参数pageSize过大")
        return []
    }

    const infoList = await TlCompanyDao.getListForPage({
        [TlCompanyDef.name]: {
            [Op.like]: `%${keyword}%`
        }
    }, fields, [
        [TlCompanyDef.createdAt, "DESC"]
    ], page, pageSize);

    if (infoList === null) {
        return []
    }

    return infoList
}

/**
 * 获取企业总数 
 * @returns 
 */
const getCount = async function ({  }) {
    const count = await TlCompanyDao.getCount({
        [TlCompanyDef.id]: {
            [Op.gt]: 0
        }
    });

    if (count === null) {
        return 0
    }

    return count
}

/**
 * 通过关键字获取企业总数
 * @param {*} keyword
 * @returns
 **/
const getCountByKeyword = async function ({ keyword }) {
    if(!keyword){
        tlConsoleError(TableName, "请求service参数keyword为空")
        return 0
    }

    const count = await TlCompanyDao.getCount({
        [TlCompanyDef.name]: {
            [Op.like]: `%${keyword}%`
        }
    });

    if (count === null) {
        return 0
    }

    return count
}

/**
 * 获取企业信息
 * @param {*} id
 * @param {*} fields
 * @returns
 */
const getInfoById = async function ({ id }, fields) {
    // 参数校验
    if (!id) {
        tlConsoleError(TableName, "请求service参数id为空")
        return {}
    }

    const info = await TlCompanyDao.getInfo({
        [TlCompanyDef.id]: id
    }, fields)

    if (info === null) {
        return {}
    }

    return info
}

/**
 * 通过企业编码获取企业信息
 * @param {*} code 
 * @param {*} fields 
 * @returns 
 */
const getInfoByCode = async function ({ code }, fields) {
    // 参数校验
    if (!code) {
        tlConsoleError(TableName, "请求service参数code为空")
        return {}
    }

    const info = await TlCompanyDao.getInfo({
        [TlCompanyDef.code]: code
    }, fields)

    if (info === null) {
        return {}
    }

    return info
}

/**
 * 通过id列表获取企业列表
 * @param {*} idList
 * @param {*} fields
 * @returns
 */
const getListByIdList = async function ({ idList }, fields) {
    // 参数校验
    if (!idList) {
        tlConsoleError(TableName, "请求service参数idList为空")
        return []
    }

    const infoList = await TlCompanyDao.getList({
        [TlCompanyDef.id]: {
            [Op.in]: idList
        }
    }, fields, [
        [TlCompanyDef.createdAt, "DESC"]
    ]);

    if (infoList === null) {
        return []
    }

    return infoList
}


module.exports = {
    addInfo,
    deleteInfoById,
    updateInfoById,
    getInfoById,
    getInfoByCode,

    getListByIdList,

    getListForPage,
    getListByKeywordForPage,

    getCount,
    getCountByKeyword
}