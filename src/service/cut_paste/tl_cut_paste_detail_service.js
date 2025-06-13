const { fields } = require('../../tables/tl_cut_paste_detail')
const TlCutPasteDetailDao = require('../../dao/tl_cut_paste_detail_dao')
const TlCutPasteDetailDef = fields.Def
const TlCutPasteDetailType = fields.Type
const TableName = fields.Name
const TableFields = Object.keys(fields.Def).map(key => fields.Def[key])
const { tlConsoleError, tlConsole } = require("../../../src/utils/utils");


/**
 * 创建剪贴板详情
 * @param {*} data
 */
const addInfo = async function ({
    code, cutPasteId, flag, content, type
}) {
    // 参数校验
    if(!code){
        tlConsoleError(TableName, "请求service参数code为空")
        return {}
    }

    if(!cutPasteId){
        tlConsoleError(TableName, "请求service参数cutPasteId为空")
        return {}
    }

    if(!content){
        tlConsoleError(TableName, "请求service参数content为空")
        return {}
    }

    if(!type){
        tlConsoleError(TableName, "请求service参数type为空")
        return {}
    }

    if(flag === undefined || flag === null){
        tlConsoleError(TableName, "请求service参数flag为空")
        return {}
    }

    if(![
        TlCutPasteDetailType.TEXT,
        TlCutPasteDetailType.IMAGE,
        TlCutPasteDetailType.FILE,
        TlCutPasteDetailType.AUDIO,
        TlCutPasteDetailType.VIDEO,
        TlCutPasteDetailType.RICH_TEXT,
        TlCutPasteDetailType.OTHER,
        TlCutPasteDetailType.LINK
    ].includes(type)){
        tlConsoleError(TableName, "请求service参数type不合法")
        return {}
    }

    const info = await TlCutPasteDetailDao.addInfo({
        [TlCutPasteDetailDef.code]: code,
        [TlCutPasteDetailDef.cutPasteId]: cutPasteId,
        [TlCutPasteDetailDef.flag]: flag,
        [TlCutPasteDetailDef.content]: content,
        [TlCutPasteDetailDef.type]: type
    });

    if (info === null) {
        tlConsoleError(TableName, "请求dao异常")
        return {}
    }

    return info
}

/**
 * 删除剪贴板详情
 * @param {*} id
 * @param {*} companyId
 */
const deleteInfoById = async function ({ id }) {
    // 参数校验
    if (!id) {
        tlConsoleError(TableName, "请求service参数id为空")
        return 0
    }

    const info = await TlCutPasteDetailDao.deleteInfo({
        [TlCutPasteDetailDef.id]: id
    });

    if (info === null) {
        tlConsoleError(TableName, "请求dao异常")
        return 0
    }

    return info
}

/**
 * 获取剪贴板详情内容
 * @param {*} id
 * @param {*} fields
 */
const getInfoById = async function ({ id }, fields) {
    // 参数校验
    if (!id) {
        tlConsoleError(TableName, "请求service参数id为空")
        return {}
    }

    const info = await TlCutPasteDetailDao.getInfo({
        [TlCutPasteDetailDef.id]: id
    }, fields)

    if (info === null) {
        return {}
    }

    return info
}

/**
 * 获取某个剪贴板的剪贴板详情列表
 * @param {*} typeList
 * @param {*} cutPasteId
 * @param {*} fields
 */
const getListByCutPasteIdAndTypeList = async function ({ 
    cutPasteId, typeList
}, fields) {
    // 参数校验
    if(!cutPasteId){
        tlConsoleError(TableName, "请求service参数cutPasteId为空")
        return []
    }

    let query = {
        [TlCutPasteDetailDef.cutPasteId]: cutPasteId,
    }

    if(typeList && typeList.length > 0){
        query[TlCutPasteDetailDef.type] = typeList
    }
    
    const infoList = await TlCutPasteDetailDao.getList(query, fields, [
        [TlCutPasteDetailDef.createdAt, "DESC"]
    ]);

    if (infoList === null) {
        return []
    }

    return infoList
}

/**
 * 通过cutPasteIdList获取剪贴板详情数量
 * @param {*} cutPasteIdList
 * @param {*} companyId
 */
const getCountByCutPasteIdList = async function ({ cutPasteIdList }) {
    // 参数校验
    if(!cutPasteIdList){
        tlConsoleError(TableName, "请求service参数cutPasteIdList为空")
        return {}
    }

    const counts = await TlCutPasteDetailDao.getGroupCount({
        [TlCutPasteDetailDef.cutPasteId]: cutPasteIdList
    }, TlCutPasteDetailDef.cutPasteId);

    if (counts === null) {
        return {}
    }

    return counts
}


module.exports = {
    addInfo,
    deleteInfoById,
    getInfoById,

    getListByCutPasteIdAndTypeList,
    
    getCountByCutPasteIdList
}