const { fields } = require('../../tables/tl_user_tag')
const TlUserTagDao = require('../../dao/tl_user_tag_dao')
const TlUserTagDef = fields.Def
const TlUserTagType = fields.Type
const TableName = fields.Name
const { tlConsoleError } = require("../../utils/utils");

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




module.exports = {
    addInfo, 
    
    getListByUserIdAndType,
}