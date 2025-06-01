const { fields } = require('../../tables/tl_user_clear')
const TlUserClearDao = require('../../dao/tl_user_clear_dao')
const TlUserClearDef = fields.Def
const TlUserClearType = fields.Type
const TableName = fields.Name
const { tlConsoleError } = require("../../utils/utils");

/**
 * addInfo 接口
 * @param {*} data 
 */
const addInfo = async function({
    companyId, channelId, userId, type, latestClearId
}){
    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return {}
    }

    if(!userId){
        tlConsoleError(TableName, "请求service参数userId为空")
        return {}
    }

    if(!type){
        tlConsoleError(TableName, "请求service参数type为空")
        return {}
    }

    if(![
        TlUserClearType.CHAT, 
        TlUserClearType.MEDIA, 
        TlUserClearType.FILE,
    ].includes(type)){
        tlConsoleError(TableName, "请求service参数type不合法")
        return {}
    }

    if(!channelId){
        tlConsoleError(TableName, "请求service参数channelId为空")
        return {}
    }

    if(latestClearId == null || latestClearId == undefined){
        tlConsoleError(TableName, "请求service参数latestClearId为空")
        return {}
    }

    const info = await TlUserClearDao.addInfo({
        [TlUserClearDef.companyId] : companyId,
        [TlUserClearDef.channelId] : channelId,
        [TlUserClearDef.userId] : userId,
        [TlUserClearDef.type] : type,
        [TlUserClearDef.latestClearId] : latestClearId,
    })

    if(info == null){
        tlConsoleError(TableName, "请求service参数为空")
        return {}
    }

    return info
}

/**
 * getListByChannelUserId 接口
 * @param {*} companyId
 * @param {*} channelId
 * @param {*} userId 
 * @param {*} fields
 */
const getListByChannelUserId = async function({companyId, channelId, userId}, fields){
    if(!channelId){
        tlConsoleError(TableName, "请求service参数channelId为空")
        return []
    }

    if(!userId){
        tlConsoleError(TableName, "请求service参数userId为空")
        return []
    }

    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return []
    }

    const list = await TlUserClearDao.getList({
        [TlUserClearDef.companyId]: companyId,
        [TlUserClearDef.channelId]: channelId,
        [TlUserClearDef.userId]: userId,
    }, fields, [
        [TlUserClearDef.createdAt, "DESC"]
    ])

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
    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return {}
    }

    if(!id){
        tlConsoleError(TableName, "请求service参数id为空")
        return {}
    }

    if(Object.keys(data).length === 0){
        tlConsoleError(TableName, "请求service参数data为空")
        return {}
    }

    const info = await TlUserClearDao.updateInfo({
        [TlUserClearDef.companyId]: companyId,
        [TlUserClearDef.id]: id,
    }, data)

    if(info == null){
        return {}
    }

    return info
}

/**
 * getListByUserIdAndChannelIdList 接口
 * @param {*} companyId
 * @param {*} channelIdList
 * @param {*} userId 
 * @param {*} fields
 */
const getListByUserIdAndChannelIdList = async function({companyId, channelIdList, userId}, fields){
    if(!channelIdList){
        tlConsoleError(TableName, "请求service参数channelIdList为空")
        return []
    }

    if(!userId){
        tlConsoleError(TableName, "请求service参数userId为空")
        return []
    }

    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return []
    }

    const list = await TlUserClearDao.getList({
        [TlUserClearDef.companyId]: companyId,
        [TlUserClearDef.channelId]: channelIdList,
        [TlUserClearDef.userId]: userId,
    }, fields, [
        [TlUserClearDef.createdAt, "DESC"]
    ])

    if(list == null){
        return []
    }

    return list
}

module.exports = {
    addInfo,
    updateInfoById,

    getListByChannelUserId,
    getListByUserIdAndChannelIdList,
}