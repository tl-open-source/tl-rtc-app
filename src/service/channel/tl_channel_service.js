const { fields } = require('../../tables/tl_channel')
const TlChannelDao = require('../../dao/tl_channel_dao')
const TlChannelDef = fields.Def
const TlChannelType = fields.Type
const TlChannelStatus = fields.Status
const TableName = fields.Name
const TableFields = Object.keys(fields.Def).map(key => fields.Def[key])
const { tlConsoleError, tlConsole } = require("../../../src/utils/utils");


/**
 * addInfo 接口
 * @param {*} data 
 */
const addInfo = async function({
    companyId, name, type, flag = 0,
}){
    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return {}
    }

    if(!name){
        tlConsoleError(TableName, "请求service参数name为空")
        return {}
    }

    if(flag == null || flag == undefined){
        tlConsoleError(TableName, "请求service参数flag为空")
        return {}
    }

    if(!type){
        tlConsoleError(TableName, "请求service参数type为空")
        return {}
    }

    if(![
        TlChannelType.GROUP,
        TlChannelType.FRIEND,
    ].includes(type)){
        tlConsoleError(TableName, "请求service参数type不合法")
        return {}
    }

    const info = await TlChannelDao.addInfo({
        [TlChannelDef.companyId]: companyId,
        [TlChannelDef.name]: name,
        [TlChannelDef.type]: type,
        [TlChannelDef.flag]: flag,
        [TlChannelDef.status]: TlChannelStatus.NORMAL,
    })

    if(info == null){
        tlConsoleError(TableName, "请求dao异常")
        return {}
    }

    return info
}

/**
 * getInfoById 接口
 * @param {*} companyId
 * @param {*} id 
 */
const getInfoById = async function({companyId, id}){
    if(!id){
        tlConsoleError(TableName, "请求service参数id为空")
        return {}
    }

    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return {}
    }

    const info = await TlChannelDao.getInfo({
        [TlChannelDef.companyId]: companyId,
        [TlChannelDef.id]: id,
    })

    if(info == null){
        return {}
    }

    return info
}

/**
 * getListByIdList 接口
 * @param {*} companyId
 * @param {*} idList 
 * @param {*} fields
 */
const getListByIdList = async function({companyId, idList}, fields){
    if(!idList){
        tlConsoleError(TableName, "请求service参数idList为空")
        return []
    }

    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return []
    }

    const list = await TlChannelDao.getList({
        [TlChannelDef.companyId]: companyId,
        [TlChannelDef.id]: idList
    }, fields, [
        [TlChannelDef.createdAt, "DESC"]
    ])

    if(list == null){
        return []
    }

    return list
}

/**
 * getListByIdListForPage 接口
 * @param {*} companyId
 * @param {*} idList 
 * @param {*} fields
 * @param {*} page
 * @param {*} pageSize
 */
const getListByIdListForPage = async function({companyId, idList}, fields, page, pageSize){
    if(!idList){
        tlConsoleError(TableName, "请求service参数idList为空")
        return []
    }

    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
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

    const list = await TlChannelDao.getListForPage({
        [TlChannelDef.companyId]: companyId,
        [TlChannelDef.id]: idList
    }, fields, [
        [TlChannelDef.createdAt, "DESC"]
    ], page, pageSize)

    if(list == null){
        return []
    }

    return list
}

/**
 * updateInfoById 接口
 * @param {*} companyId
 * @param {*} id
 * @param {*} data
 */
const updateInfoById = async function({companyId, id}, data){
    if(Object.keys(data).length === 0){
        tlConsoleError(TableName, "请求service参数为空")
        return {}
    }

    // 参数校验
    if(!id){
        tlConsoleError(TableName, "请求service参数id为空")
        return {}
    }

    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return {}
    }

    const info = await TlChannelDao.updateInfo({
        [TlChannelDef.companyId]: companyId,
        [TlChannelDef.id]: id
    }, data)

    if(info === null){
        tlConsoleError(TableName, "请求dao异常")
        return {}
    }

    return info
}

/**
 * deleteInfoById 接口
 * @param {*} companyId
 * @param {*} id
 */
const deleteInfoById = async function({companyId, id}){
    // 参数校验
    if(!id){
        tlConsoleError(TableName, "请求service参数id为空")
        return {}
    }

    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return {}
    }

    const info = await TlChannelDao.deleteInfo({
        [TlChannelDef.companyId]: companyId,
        [TlChannelDef.id]: id
    })

    if(info === null){
        tlConsoleError(TableName, "请求dao异常")
        return {}
    }

    return info
}


module.exports = {
    addInfo, 
    updateInfoById, 
    deleteInfoById, 
    getInfoById,
    
    getListByIdList, 
    getListByIdListForPage
}