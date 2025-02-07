const { fields } = require('../../tables/tl_user_apply')
const TlUserApplyDao = require('../../dao/tl_user_apply_dao')
const TlUserApplyDef = fields.Def
const TlUserApplyStatus = fields.Status
const TlUserApplyType = fields.Type
const TableName = fields.Name
const TableFields = Object.keys(fields.Def).map(key => fields.Def[key])
const { tlConsoleError, tlConsole } = require("../../../src/utils/utils");

/**
 * addInfo 接口
 * @param {*} data 
 */
const addInfo = async function({
    companyId, userId, targetId, type, origin, remark, status, flag = 0
}){
    // 参数校验
    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return {}
    }

    if(!userId){
        tlConsoleError(TableName, "请求service参数userId为空")
        return {}
    }

    if(!targetId){
        tlConsoleError(TableName, "请求service参数targetId为空")
        return {}
    }

    if(!type){
        tlConsoleError(TableName, "请求service参数type为空")
        return {}
    }

    if(![
        TlUserApplyType.FRIEND,
        TlUserApplyType.GROUP,
    ].includes(type)){
        tlConsoleError(TableName, "请求service参数type不合法")
        return {}
    }

    if(!status){
        tlConsoleError(TableName, "请求service参数status为空")
        return {}
    }

    if(![
        TlUserApplyStatus.BLACK,
        TlUserApplyStatus.PASS,
        TlUserApplyStatus.REJECT,
        TlUserApplyStatus.WAIT,
    ].includes(status)){
        tlConsoleError(TableName, "请求service参数status不合法")
        return {}
    }

    if(!origin){
        tlConsoleError(TableName, "请求service参数origin为空")
        return {}
    }

    if(flag === null || flag === undefined){
        tlConsoleError(TableName, "请求service参数flag为空")
        return {}
    }

    const info = await TlUserApplyDao.addInfo({
        [TlUserApplyDef.companyId]: companyId,
        [TlUserApplyDef.userId]: userId,
        [TlUserApplyDef.targetId]: targetId,
        [TlUserApplyDef.type]: type,
        [TlUserApplyDef.status]: status,
        [TlUserApplyDef.origin]: origin,
        [TlUserApplyDef.remark]: remark,
        [TlUserApplyDef.flag]: flag
    })

    if(info === null){
        tlConsoleError(TableName, "请求dao异常")
        return {}
    }

    return info
}

/**
 * getInfoById 接口
 * @param {*} companyId
 * @param {*} id
 * @param {*} fields
 */
const getInfoById = async function({companyId, id}, fields){
    // 参数校验
    if(!id){
        tlConsoleError(TableName, "请求service参数id为空")
        return {}
    }
    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return {}
    }

    const info = await TlUserApplyDao.getInfo({
        [TlUserApplyDef.companyId]: companyId,
        [TlUserApplyDef.id]: id
    }, fields)

    if(info === null){
        return {}
    }

    return info
}

/**
 * getInfoByUserId 接口
 * @param {*} companyId
 * @param {*} userId 
 * @param {*} fields
 * @returns 
 */
const getListByUserId = async function({companyId, userId}, fields){
    // 参数校验
    if(!userId){
        tlConsoleError(TableName, "请求service参数userId为空")
        return []
    }
    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return []
    }

    const list = await TlUserApplyDao.getList({
        [TlUserApplyDef.companyId]: companyId,
        [TlUserApplyDef.userId]: userId
    }, fields, [
        [TlUserApplyDef.createdAt, 'DESC']
    ])

    if(list === null){
        return []
    }

    return list
}

/**
 * getInfoByUserId 接口
 * @param {*} companyId
 * @param {*} userId 
 * @param {*} fields
 * @param {*} page
 * @param {*} pageSize
 * @returns 
 */
const getListByUserIdForPage = async function({companyId, userId}, fields, page, pageSize){
    // 参数校验
    if(!userId){
        tlConsoleError(TableName, "请求service参数userId为空")
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

    const list = await TlUserApplyDao.getListForPage({
        [TlUserApplyDef.companyId]: companyId,
        [TlUserApplyDef.userId]: userId
    }, fields, [
        [TlUserApplyDef.createdAt, 'DESC']
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
 * @returns 
 */
const getListByUserIdAndType = async function({companyId, userId, type}, fields){
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

    const list = await TlUserApplyDao.getList({
        [TlUserApplyDef.companyId]: companyId,
        [TlUserApplyDef.userId]: userId,
        [TlUserApplyDef.type]: type
    }, fields, [
        [TlUserApplyDef.createdAt, 'DESC']
    ])

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
 * @param {*} page
 * @param {*} pageSize
 * @returns 
 */
const getListByUserIdAndTypeForPage = async function({companyId, userId, type}, fields, page, pageSize){
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

    const list = await TlUserApplyDao.getList({
        [TlUserApplyDef.companyId]: companyId,
        [TlUserApplyDef.userId]: userId,
        [TlUserApplyDef.type]: type
    }, fields, [
        [TlUserApplyDef.createdAt, 'DESC']
    ], page, pageSize)

    if(list === null){
        return []
    }

    return list
}

/**
 * getListByUserIdAndTargetIdAndStatuAndType 接口
 * @param {*} companyId
 * @param {*} userId
 * @param {*} type
 * @param {*} status
 * @param {*} targetId
 * @param {*} fields
 * @returns 
 */
const getListByUserIdAndTargetIdAndStatuAndType = async function({companyId, userId, targetId, status, type}, fields){
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

    if(!status){
        tlConsoleError(TableName, "请求service参数status为空")
        return []
    }

    if(!targetId){
        tlConsoleError(TableName, "请求service参数targetId为空")
        return []
    }

    const list = await TlUserApplyDao.getList({
        [TlUserApplyDef.companyId]: companyId,
        [TlUserApplyDef.userId]: userId,
        [TlUserApplyDef.targetId]: targetId,
        [TlUserApplyDef.status]: status,
        [TlUserApplyDef.type]: type
    }, fields, [
        [TlUserApplyDef.createdAt, 'DESC']
    ])

    if(list === null){
        return []
    }

    return list
}

/**
 * getListByUserIdAndTargetIdAndStatuAndTypeForPage 接口
 * @param {*} companyId
 * @param {*} userId
 * @param {*} type
 * @param {*} status
 * @param {*} targetId
 * @param {*} fields
 * @param {*} page
 * @param {*} pageSize
 * @returns 
 */
const getListByUserIdAndTargetIdAndStatuAndTypeForPage = async function({
    companyId, userId, targetId, status, type
}, fields, page, pageSize){
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

    if(!status){
        tlConsoleError(TableName, "请求service参数status为空")
        return []
    }

    if(!targetId){
        tlConsoleError(TableName, "请求service参数targetId为空")
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

    const list = await TlUserApplyDao.getListForPage({
        [TlUserApplyDef.companyId]: companyId,
        [TlUserApplyDef.userId]: userId,
        [TlUserApplyDef.targetId]: targetId,
        [TlUserApplyDef.status]: status,
        [TlUserApplyDef.type]: type
    }, fields, [
        [TlUserApplyDef.createdAt, 'DESC']
    ], page, pageSize)

    if(list === null){
        return []
    }

    return list
}


/**
 * getListByTargetIdAndType 接口
 * @param {*} companyId
 * @param {*} targetId
 * @param {*} type
 * @param {*} fields
 * @returns 
 */
const getListByTargetIdAndType = async function({companyId, targetId, type}, fields){
    // 参数校验
    if(!targetId){
        tlConsoleError(TableName, "请求service参数targetId为空")
        return []
    }
    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return []
    }

    const list = await TlUserApplyDao.getList({
        [TlUserApplyDef.companyId]: companyId,
        [TlUserApplyDef.targetId]: targetId,
        [TlUserApplyDef.type]: type
    }, fields, [
        [TlUserApplyDef.createdAt, 'DESC']
    ])

    if(list === null){
        return []
    }

    return list
}

/**
 * getListByTargetIdAndTypeForPage 接口
 * @param {*} companyId
 * @param {*} targetId
 * @param {*} type
 * @param {*} fields
 * @param {*} page
 * @param {*} pageSize
 * @returns 
 */
const getListByTargetIdAndTypeForPage = async function({companyId, targetId, type}, fields, page, pageSize){
    // 参数校验
    if(!targetId){
        tlConsoleError(TableName, "请求service参数targetId为空")
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

    const list = await TlUserApplyDao.getListForPage({
        [TlUserApplyDef.companyId]: companyId,
        [TlUserApplyDef.targetId]: targetId,
        [TlUserApplyDef.type]: type
    }, fields, [
        [TlUserApplyDef.createdAt, 'DESC']
    ], page, pageSize)

    if(list === null){
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

    const info = await TlUserApplyDao.updateInfo({
        [TlUserApplyDef.companyId]: companyId,
        [TlUserApplyDef.id]: id
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

    const info = await TlUserApplyDao.deleteInfo({
        [TlUserApplyDef.companyId]: companyId,
        [TlUserApplyDef.id]: id
    })

    if(info === null){
        tlConsoleError(TableName, "请求dao异常")
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
    // 参数校验
    if(!idList){
        tlConsoleError(TableName, "请求service参数idList为空")
        return []
    }

    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return []
    }

    const list = await TlUserApplyDao.getList({
        [TlUserApplyDef.companyId]: companyId,
        [TlUserApplyDef.id]: idList
    }, fields, [
        [TlUserApplyDef.createdAt, 'DESC']
    ])

    if(list === null){
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

    const list = await TlUserApplyDao.getListForPage({
        [TlUserApplyDef.companyId]: companyId,
        [TlUserApplyDef.id]: idList
    }, fields, [
        [TlUserApplyDef.createdAt, 'DESC']
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
    getListByUserId, 
    getListByUserIdForPage,
    getListByTargetIdAndType,
    getListByTargetIdAndTypeForPage,
    getListByUserIdAndType, 
    getListByUserIdAndTypeForPage,
    getListByUserIdAndTargetIdAndStatuAndType,
    getListByUserIdAndTargetIdAndStatuAndTypeForPage
}