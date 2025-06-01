const { fields } = require('../../tables/tl_user_finger_print')
const TlUserFingerPrintDao = require('../../dao/tl_user_finger_print_dao')
const TlUserFingerPrintDef = fields.Def
const TableName = fields.Name
const { tlConsoleError } = require("../../utils/utils");

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



module.exports = {
    addInfo, 
    addInfoList,

    getListByUserId,
    getListByUserIdForPage
}