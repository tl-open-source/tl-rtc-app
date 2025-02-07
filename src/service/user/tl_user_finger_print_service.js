const { Op } = require('sequelize')
const moment = require('moment')
const { fields } = require('../../tables/tl_user_finger_print')
const TlUserFingerPrintDao = require('../../dao/tl_user_finger_print_dao')
const TlUserFingerPrintDef = fields.Def
const TableName = fields.Name
const TableFields = Object.keys(fields.Def).map(key => fields.Def[key])
const { tlConsoleError, tlConsole } = require("../../utils/utils");

/**
 * addInfo 接口
 * @param {*} data 
 */
const addInfo = async function({
    userId, fingerPrint
}){
    // 参数校验
    if(!userId){
        tlConsoleError(TableName, "请求service参数userId为空")
        return {}
    }

    if(!fingerPrint){
        tlConsoleError(TableName, "请求service参数fingerPrint为空")
        return {}
    }

    const info = await TlUserFingerPrintDao.addInfo({
        [TlUserFingerPrintDef.user_id]: userId,
        [TlUserFingerPrintDef.finger_print]: fingerPrint,
    })

    if(info === null){
        tlConsoleError(TableName, "请求dao异常")
        return {}
    }

    return info
}

/**
 * addInfoList 接口
 * @param {*} userId
 * @param {*} dataList 
 */
const addInfoList = async function({
    userId, dataList
}){
    // 参数校验
    if(!userId){
        tlConsoleError(TableName, "请求service参数userId为空")
        return {}
    }

    if(!dataList){
        tlConsoleError(TableName, "请求service参数dataList为空")
        return {}
    }

    let addDataList = []

    for(let i = 0; i < dataList.length; i++){
        const fingerPrint = dataList[i]
        if(!fingerPrint){
            tlConsoleError(TableName, "请求service参数fingerPrint为空")
            return {}
        }
        addDataList.push({
            [TlUserFingerPrintDef.user_id]: userId,
            [TlUserFingerPrintDef.finger_print]: fingerPrint,
        })
    }

    const list = await TlUserFingerPrintDao.addList(addDataList)

    if(list === null){
        tlConsoleError(TableName, "请求dao异常")
        return {}
    }

    return list
}

/**
 * getInfoById 接口
 * @param {*} id
 * @param {*} fields
 */
const getInfoById = async function({id}, fields){
    // 参数校验
    if(!id){
        tlConsoleError(TableName, "请求service参数id为空")
        return {}
    }

    const info = await TlUserFingerPrintDao.getInfo({
        [TlUserFingerPrintDef.id]: id
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
 */
const updateInfoById = async function({id}, data){
    if(Object.keys(data).length === 0){
        tlConsoleError(TableName, "请求service参数为空")
        return {}
    }

    // 参数校验
    if(!id){
        tlConsoleError(TableName, "请求service参数id为空")
        return {}
    }

    const info = await TlUserFingerPrintDao.updateInfo({
        [TlUserFingerPrintDef.id]: id
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
 */
const deleteInfoById = async function({id}){
    // 参数校验
    if(!id){
        tlConsoleError(TableName, "请求service参数id为空")
        return {}
    }

    const info = await TlUserFingerPrintDao.deleteInfo({
        [TlUserFingerPrintDef.id]: id
    })

    if(info === null){
        tlConsoleError(TableName, "请求dao异常")
        return {}
    }

    return info
}

/**
 * getInfoByUserIdAndFingerPrint 接口
 * @param {*} userId
 * @param {*} fingerPrint
 * @param {*} fields
 */
const getInfoByUserIdAndFingerPrint = async function({fingerPrint, userId}, fields){    
    // 参数校验
    if(!userId){
        tlConsoleError(TableName, "请求service参数userId为空")
        return {}
    }

    if(!fingerPrint){
        tlConsoleError(TableName, "请求service参数fingerPrint为空")
        return {}
    }

    const info = await TlUserFingerPrintDao.getInfo({
        [TlUserFingerPrintDef.finger_print]: fingerPrint,
        [TlUserFingerPrintDef.user_id]: userId
    }, fields, [
        [TlUserFingerPrintDef.createdAt, 'DESC']
    ])

    if(info === null){
        return {}
    }
    
    return info
}

/**
 * getListByUserId 接口
 * @param {*} userId
 * @param {*} fields
 */
const getListByUserId = async function({userId}, fields){    
    // 参数校验
    if(!userId){
        tlConsoleError(TableName, "请求service参数userId为空")
        return []
    }

    const list = await TlUserFingerPrintDao.getList({
        [TlUserFingerPrintDef.user_id]: userId
    }, fields, [
        [TlUserFingerPrintDef.createdAt, 'DESC']
    ])

    if(list === null){
        return []
    }
    
    return list
}

/**
 * getListByUserIdForPage 接口
 * @param {*} userId
 * @param {*} fields
 * @param {*} page
 * @param {*} pageSize
 */
const getListByUserIdForPage = async function({userId}, fields, page, pageSize){    
    // 参数校验
    if(!userId){
        tlConsoleError(TableName, "请求service参数userId为空")
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

    const list = await TlUserFingerPrintDao.getListForPage({
        [TlUserFingerPrintDef.user_id]: userId
    }, fields, [
        [TlUserFingerPrintDef.createdAt, 'DESC']
    ], page, pageSize)

    if(list === null){
        return []
    }
    
    return list
}

/**
 * getListByIdList 接口
 * @param {*} idList
 * @param {*} fields
 */
const getListByIdList = async function({idList}, fields){    
    // 参数校验
    if(!idList){
        tlConsoleError(TableName, "请求service参数idList为空")
        return []
    }

    const list = await TlUserFingerPrintDao.getList({
        [TlUserFingerPrintDef.id]: idList
    }, fields, [
        [TlUserFingerPrintDef.createdAt, 'DESC']
    ])

    if(list === null){
        return []
    }
    
    return list
}

/**
 * getListByIdListForPage 接口
 * @param {*} idList
 * @param {*} fields
 * @param {*} page
 * @param {*} pageSize
 */
const getListByIdListForPage = async function({idList}, fields, page, pageSize){    
    // 参数校验
    if(!idList){
        tlConsoleError(TableName, "请求service参数idList为空")
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

    const list = await TlUserFingerPrintDao.getListForPage({
        [TlUserFingerPrintDef.id]: idList
    }, fields, [
        [TlUserFingerPrintDef.createdAt, 'DESC']
    ], page, pageSize)

    if(list === null){
        return []
    }
    
    return list
}


/**
 * getCountByFingerPrint 接口
 * @param {*} fingerPrint
 */
const getCountByFingerPrint = async function({fingerPrint}){
    // 参数校验
    if(!fingerPrint){
        tlConsoleError(TableName, "请求service参数fingerPrint为空")
        return 0
    }

    const count = await TlUserFingerPrintDao.getCount({
        [TlUserFingerPrintDef.finger_print]: fingerPrint
    })

    if(count === null){
        return 0
    }

    return count
}

module.exports = {
    addInfo, 
    addInfoList,
    updateInfoById, 
    deleteInfoById,
    getInfoById, 
    getInfoByUserIdAndFingerPrint,
    getCountByFingerPrint, 

    getListByIdList, 
    getListByIdListForPage,
    getListByUserId,
    getListByUserIdForPage
}