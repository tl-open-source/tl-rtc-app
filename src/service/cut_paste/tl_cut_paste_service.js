const { fields } = require('../../tables/tl_cut_paste')
const TlCutPasteDao = require('../../dao/tl_cut_paste_dao')
const TlCutPasteDef = fields.Def
const TlCutPasteStatus = fields.Status
const TableName = fields.Name
const TableFields = Object.keys(fields.Def).map(key => fields.Def[key])
const { tlConsoleError, tlConsole } = require("../../../src/utils/utils");
const { Op } = require('sequelize')


/**
 * 创建剪贴板
 * @param {*} data
 */
const addInfo = async function ({
    companyId, userId, code, password, flag, title
}) {
    // 参数校验
    if(!code){
        tlConsoleError(TableName, "请求service参数code为空")
        return {}
    }

    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return {}
    }

    if(!userId){
        tlConsoleError(TableName, "请求service参数userId为空")
        return {}
    }

    if(!title){
        tlConsoleError(TableName, "请求service参数title为空")
        return {}
    }

    if(flag === undefined || flag === null){
        tlConsoleError(TableName, "请求service参数flag为空")
        return {}
    }

    const info = await TlCutPasteDao.addInfo({
        [TlCutPasteDef.companyId]: companyId,
        [TlCutPasteDef.userId]: userId,
        [TlCutPasteDef.code]: code,
        [TlCutPasteDef.status]: TlCutPasteStatus.USEED,
        [TlCutPasteDef.password]: password,
        [TlCutPasteDef.flag]: flag,
        [TlCutPasteDef.title]: title
    });

    if (info === null) {
        tlConsoleError(TableName, "请求dao异常")
        return {}
    }

    return info
}

/**
 * 删除剪贴板
 * @param {*} id
 * @param {*} companyId
 */
const deleteInfoById = async function ({ companyId, id }) {
    // 参数校验
    if (!id) {
        tlConsoleError(TableName, "请求service参数id为空")
        return 0
    }

    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return 0
    }

    const info = await TlCutPasteDao.deleteInfo({
        [TlCutPasteDef.companyId]: companyId,
        [TlCutPasteDef.id]: id
    });

    if (info === null) {
        tlConsoleError(TableName, "请求dao异常")
        return 0
    }

    return info
}

/**
 * 更新剪贴板
 * @param {*} data
 * @param {*} companyId
 * @param {*} id
 */
const updateInfoById = async function ({ companyId, id }, data) {
    // 参数校验
    if (Object.keys(data).length === 0) {
        tlConsoleError(TableName, "请求service参数为空")
        return {}
    }

    if (!id) {
        tlConsoleError(TableName, "请求service参数id为空")
        return {}
    }

    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return {}
    }

    const info = await TlCutPasteDao.updateInfo({
        [TlCutPasteDef.companyId]: companyId,
        [TlCutPasteDef.id]: id
    }, data);

    if (info === null) {
        tlConsoleError(TableName, "请求dao异常")
        return {}
    }

    return info
}

/**
 * 获取用户的剪贴板列表
 * @param {*} companyId
 * @param {*} userId
 * @param {*} fields
 */
const getListByUserId = async function ({ companyId, userId }, fields) {
    // 参数校验
    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return []
    }

    if(!userId){
        tlConsoleError(TableName, "请求service参数userId为空")
        return []
    }
    
    const infoList = await TlCutPasteDao.getList({
        [TlCutPasteDef.companyId]: companyId,
        [TlCutPasteDef.userId]: userId
    }, fields, [
        [TlCutPasteDef.createdAt, "DESC"]
    ]);

    if (infoList === null) {
        return []
    }

    return infoList
}

/**
 * 获取剪贴板
 * @param {*} companyId
 * @param {*} code
 * @param {*} fields
 */
const getInfoByCode = async function ({ code }, fields) {
    // 参数校验
    if(!code){
        tlConsoleError(TableName, "请求service参数code为空")
        return {}
    }
    
    const info = await TlCutPasteDao.getInfo({
        [TlCutPasteDef.code]: code
    }, fields);

    if (info === null) {
        return {}
    }

    return info
}

/**
 * 获取剪贴板
 * @param {*} companyId
 * @param {*} id
 * @param {*} fields
 */
const getInfoById = async function ({ companyId, id }, fields) {
    // 参数校验
    if (!id) {
        tlConsoleError(TableName, "请求service参数id为空")
        return {}
    }

    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return {}
    }

    const info = await TlCutPasteDao.getInfo({
        [TlCutPasteDef.companyId]: companyId,
        [TlCutPasteDef.id]: id
    }, fields)

    if (info === null) {
        return {}
    }

    return info
}

/**
 * 获取剪贴板列表
 * @param {*} fields
 * @param {*} page
 * @param {*} pageSize
 */
const getListForPage = async function ({ }, fields, page, pageSize) {
    // 参数校验
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

    const infoList = await TlCutPasteDao.getListForPage({
        [TlCutPasteDef.id]: {
            [Op.gte]: 0
        }
    }, fields, [
        [TlCutPasteDef.createdAt, "DESC"]
    ], page, pageSize);

    if (infoList === null) {
        return []
    }

    return infoList
}


/**
 * 获取剪贴板列表
 * @param {*} keyword
 * @param {*} fields
 * @param {*} page
 * @param {*} pageSize
 */
const getListByKeywordForPage = async function ({ keyword }, fields, page, pageSize) {
    // 参数校验
    if(!keyword){
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

    const infoList = await TlCutPasteDao.getListForPage({
        [TlCutPasteDef.title]: {
            [Op.like]: `%${keyword}%`
        }
    }, fields, [
        [TlCutPasteDef.createdAt, "DESC"]
    ], page, pageSize);

    if (infoList === null) {
        return []
    }

    return infoList
}


/**
 * 获取剪贴板数量
 */
const getCount = async function ({ }) {
    // 参数校验
    const count = await TlCutPasteDao.getCount({
        [TlCutPasteDef.id]: {
            [Op.gte]: 0
        }
    });

    if (count === null) {
        return 0
    }

    return count
}

/**
 * 获取剪贴板数量
 * @param {*} keyword
 */
const getCountByKeyword = async function ({ keyword }) {
    // 参数校验
    if(!keyword){
        tlConsoleError(TableName, "请求service参数keyword为空")
        return 0
    }

    const count = await TlCutPasteDao.getCount({
        [TlCutPasteDef.title]: {
            [Op.like]: `%${keyword}%`
        }
    });

    if (count === null) {
        return 0
    }

    return count
}


module.exports = {
    addInfo,
    deleteInfoById,
    updateInfoById,
    getInfoById, 
    getInfoByCode,
    
    getListByUserId,
    getListForPage,
    getListByKeywordForPage,
    getCount,
    getCountByKeyword
}