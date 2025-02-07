const { Op } = require('sequelize')
const moment = require('moment')
const { fields } = require('../../tables/tl_user_auth')
const TlUserAuthDao = require('../../dao/tl_user_auth_dao')
const TlUserAuthDef = fields.Def
const TlUserAuthType = fields.Type
const TableName = fields.Name
const TableFields = Object.keys(fields.Def).map(key => fields.Def[key])
const { tlConsoleError, tlConsole } = require("../../utils/utils");

/**
 * addInfo 接口
 * @param {*} data 
 */
const addInfo = async function({
    key, type, code
}){
    // 参数校验
    if(!key){
        tlConsoleError(TableName, "请求service参数key为空")
        return {}
    }

    if(!type){
        tlConsoleError(TableName, "请求service参数type为空")
        return {}
    }

    if(![
        TlUserAuthType.EMAIL_REGISTER_CODE,
        TlUserAuthType.PHONE_LOGIN_CODE,
        TlUserAuthType.PHONE_REGISTER_CODE,
    ].includes(type)){
        tlConsoleError(TableName, "请求service参数type不合法")
        return {}
    }

    if(!code){
        tlConsoleError(TableName, "请求service参数code为空")
        return {}
    }

    const info = await TlUserAuthDao.addInfo({
        [TlUserAuthDef.key]: key,
        [TlUserAuthDef.type]: type,
        [TlUserAuthDef.code]: code
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
 */
const getInfoById = async function({id}, fields){
    // 参数校验
    if(!id){
        tlConsoleError(TableName, "请求service参数id为空")
        return {}
    }

    const info = await TlUserAuthDao.getInfo({
        [TlUserAuthDef.id]: id
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

    const info = await TlUserAuthDao.updateInfo({
        [TlUserAuthDef.id]: id
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

    const info = await TlUserAuthDao.deleteInfo({
        [TlUserAuthDef.id]: id
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
 * @param {*} fields
 */
const getListByIdList = async function({idList}, fields){    
    // 参数校验
    if(!idList){
        tlConsoleError(TableName, "请求service参数idList为空")
        return []
    }

    const list = await TlUserAuthDao.getList({
        [TlUserAuthDef.id]: idList
    }, fields, [
        [TlUserAuthDef.createdAt, 'DESC']
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

    const list = await TlUserAuthDao.getListForPage({
        [TlUserAuthDef.id]: idList
    }, fields, [
        [TlUserAuthDef.createdAt, 'DESC']
    ], page, pageSize)

    if(list === null){
        return []
    }
    
    return list
}

/**
 * getCountByKey 接口
 * @param {*} key
 */
const getCountByKey = async function({key}){
    // 参数校验
    if(!key){
        tlConsoleError(TableName, "请求service参数key为空")
        return 0
    }

    const count = await TlUserAuthDao.getCount({
        [TlUserAuthDef.key]: key
    })

    if(count === null){
        return 0
    }

    return count
}

/**
 * getDayCountByType 接口
 * @param {*} type
 */
const getDayCountByType = async function({type}){
    // 参数校验
    if(!type){
        tlConsoleError(TableName, "请求service参数type为空")
        return 0
    }

    const count = await TlUserAuthDao.getCount({
        [TlUserAuthDef.type]: type,
        [TlUserAuthDef.createdAt]: {
            [Op.gte]: moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
            [Op.lte]: moment().endOf('day').format('YYYY-MM-DD HH:mm:ss')
        }
    })

    if(count === null){
        return 0
    }

    return count
}

/**
 * getCountByTypeAndKey 接口
 * @param {*} type
 * @param {*} key
 */
const getCountByTypeAndKey = async function({type, key}){
    // 参数校验
    if(!type){
        tlConsoleError(TableName, "请求service参数type为空")
        return 0
    }

    if(!key){
        tlConsoleError(TableName, "请求service参数key为空")
        return 0
    }

    const count = await TlUserAuthDao.getCount({
        [TlUserAuthDef.type]: type,
        [TlUserAuthDef.key]: key
    })

    if(count === null){
        return 0
    }

    return count
}

/**
 * getDayCountByTypeAndKey 接口
 * @param {*} type
 * @param {*} key
 */
const getDayCountByTypeAndKey = async function({type, key}){
    // 参数校验
    if(!type){
        tlConsoleError(TableName, "请求service参数type为空")
        return 0
    }

    if(!key){
        tlConsoleError(TableName, "请求service参数key为空")
        return 0
    }

    const count = await TlUserAuthDao.getCount({
        [TlUserAuthDef.type]: type,
        [TlUserAuthDef.key]: key,
        [TlUserAuthDef.createdAt]: {
            [Op.gte]: moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
            [Op.lte]: moment().endOf('day').format('YYYY-MM-DD HH:mm:ss')
        }
    })

    if(count === null){
        return 0
    }

    return count
}


module.exports = {
    addInfo, 
    updateInfoById, 
    deleteInfoById,
    getInfoById, 
    getCountByKey, 
    getCountByTypeAndKey,
    getDayCountByTypeAndKey, 
    getDayCountByType,

    getListByIdList, 
    getListByIdListForPage
}