const { Op } = require('sequelize')
const moment = require('moment')
const { fields } = require('../../tables/tl_user_tag')
const TlUserTagDao = require('../../dao/tl_user_tag_dao')
const TlUserTagDef = fields.Def
const TlUserTagType = fields.Type
const TableName = fields.Name
const TableFields = Object.keys(fields.Def).map(key => fields.Def[key])
const { tlConsoleError, tlConsole } = require("../../utils/utils");

/**
 * addInfo 接口
 * @param {*} data 
 */
const addInfo = async function({
    name, type, userId, companyId
}){
    // 参数校验
    if(!name){
        tlConsoleError(TableName, "请求service参数name为空")
        return {}
    }

    if(!type){
        tlConsoleError(TableName, "请求service参数type为空")
        return {}
    }

    if(![
        TlUserTagType.CHANNEL,
        TlUserTagType.CLOUD,
        TlUserTagType.FRIEND,
    ].includes(type)){
        tlConsoleError(TableName, "请求service参数type不合法")
        return {}
    }

    if(!userId){
        tlConsoleError(TableName, "请求service参数userId为空")
        return {}
    }

    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return {}
    }

    const info = await TlUserTagDao.addInfo({
        [TlUserTagDef.name]: name,
        [TlUserTagDef.type]: type,
        [TlUserTagDef.userId]: userId,
        [TlUserTagDef.companyId]: companyId
    })

    if(info === null){
        tlConsoleError(TableName, "请求dao异常")
        return {}
    }

    return info
}

/**
 * getInfoById 接口
 * @param {*} id
 * @param {*} fields
 * @param {*} companyId
 */
const getInfoById = async function({id, companyId}, fields){
    // 参数校验
    if(!id){
        tlConsoleError(TableName, "请求service参数id为空")
        return {}
    }

    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return {}
    }

    const info = await TlUserTagDao.getInfo({
        [TlUserTagDef.id]: id
    }, fields)

    if(info === null){
        return {}
    }

    return info
}

/**
 * updateInfoById 接口
 * @param {*} id
 * @param {*} data
 * @param {*} companyId
 */
const updateInfoById = async function({id, companyId}, data){
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

    const info = await TlUserTagDao.updateInfo({
        [TlUserTagDef.id]: id
    }, data)

    if(info === null){
        tlConsoleError(TableName, "请求dao异常")
        return {}
    }

    return info
}

/**
 * deleteInfoById 接口
 * @param {*} id
 * @param {*} companyId
 */
const deleteInfoById = async function({id, companyId}){
    // 参数校验
    if(!id){
        tlConsoleError(TableName, "请求service参数id为空")
        return {}
    }

    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return {}
    }

    const info = await TlUserTagDao.deleteInfo({
        [TlUserTagDef.id]: id,
        [TlUserTagDef.companyId]: companyId
    })

    if(info === null){
        tlConsoleError(TableName, "请求dao异常")
        return {}
    }

    return info
}

/**
 * getListByIdList 接口
 * @param {*} idList
 * @param {*} companyId
 * @param {*} fields
 */
const getListByIdList = async function({idList, companyId}, fields){    
    // 参数校验
    if(!idList){
        tlConsoleError(TableName, "请求service参数idList为空")
        return []
    }

    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return []
    }

    const list = await TlUserTagDao.getList({
        [TlUserTagDef.id]: idList,
        [TlUserTagDef.companyId]: companyId
    }, fields, [
        [TlUserTagDef.createdAt, 'DESC']
    ])

    if(list === null){
        return []
    }
    
    return list
}

/**
 * getListByIdListForPage 接口
 * @param {*} idList
 * @param {*} companyId
 * @param {*} fields
 * @param {*} page
 * @param {*} pageSize
 */
const getListByIdListForPage = async function({idList, companyId}, fields, page, pageSize){    
    // 参数校验
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

    const list = await TlUserTagDao.getListForPage({
        [TlUserTagDef.id]: idList
    }, fields, [
        [TlUserTagDef.createdAt, 'DESC']
    ], page, pageSize)

    if(list === null){
        return []
    }
    
    return list
}

/**
 * getListByUserIdAndType 接口
 * @param {*} companyId
 * @param {*} userId
 * @param {*} type
 * @param {*} fields
 */
const getListByUserIdAndType = async function({ companyId, userId, type }, fields){    
    // 参数校验
    if(!userId){
        tlConsoleError(TableName, "请求service参数userId为空")
        return []
    }

    if(!type){
        tlConsoleError(TableName, "请求service参数type为空")
        return []
    }

    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return []
    }

    const list = await TlUserTagDao.getList({
        [TlUserTagDef.companyId]: companyId,
        [TlUserTagDef.userId]: userId,
        [TlUserTagDef.type]: type
    }, fields, [
        [TlUserTagDef.createdAt, 'DESC']
    ])

    if(list === null){
        return []
    }
    
    return list
}

/**
 * getListByUserIdAndTypeForPage 接口
 * @param {*} companyId
 * @param {*} userId
 * @param {*} type
 * @param {*} fields
 * @param {*} page
 * @param {*} pageSize
 */
const getListByUserIdAndTypeForPage = async function({ companyId, userId, type }, fields, page, pageSize){    
    // 参数校验
    if(!userId){
        tlConsoleError(TableName, "请求service参数userId为空")
        return []
    }

    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return []
    }

    if(!type){
        tlConsoleError(TableName, "请求service参数type为空")
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

    const list = await TlUserTagDao.getListForPage({
        [TlUserTagDef.companyId]: companyId,
        [TlUserTagDef.userId]: userId,
        [TlUserTagDef.type]: type
    }, fields, [
        [TlUserTagDef.createdAt, 'DESC']
    ], page, pageSize)

    if(list === null){
        return []
    }
    
    return list
}



module.exports = {
    addInfo, 
    updateInfoById, 
    deleteInfoById,
    getInfoById, 

    getListByIdList, 
    getListByIdListForPage,
    
    getListByUserIdAndType,
    getListByUserIdAndTypeForPage
}