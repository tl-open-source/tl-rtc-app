const { Op } = require('sequelize')
const moment = require('moment')
const { fields } = require('../../tables/tl_user_auth')
const TlUserAuthDao = require('../../dao/tl_user_auth_dao')
const TlUserAuthDef = fields.Def
const TlUserAuthType = fields.Type
const TableName = fields.Name
const { tlConsoleError } = require("../../utils/utils");

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

    if(Object.values(TlUserAuthType).indexOf(type) === -1){
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
    getDayCountByTypeAndKey, 
    getDayCountByType,
}