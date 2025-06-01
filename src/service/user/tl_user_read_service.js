const { fields } = require('../../tables/tl_user_read')
const TlUserReadDao = require('../../dao/tl_user_read_dao')
const TlUserReadDef = fields.Def
const TlUserReadType = fields.Type
const TableName = fields.Name
const { tlConsoleError } = require("../../../src/utils/utils");

/**
 * addInfo 接口
 * @param {*} data 
 */
const addInfo = async function({
    companyId, channelId, userId, type, latestReadId, recordId
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
        TlUserReadType.CHAT, 
        TlUserReadType.MEDIA, 
        TlUserReadType.FILE,
        TlUserReadType.FRIEND_APPLY, 
        TlUserReadType.FRIEND_APPLY_PASS, 
        TlUserReadType.FRIEND_APPLY_REJECT,
        TlUserReadType.GROUP_APPLY,
        TlUserReadType.GROUP_APPLY_PASS,
        TlUserReadType.GROUP_APPLY_REJECT,
    ].includes(type)){
        tlConsoleError(TableName, "请求service参数type不合法")
        return {}
    }

    if([
        TlUserReadType.CHAT, 
        TlUserReadType.MEDIA, 
        TlUserReadType.FILE,
    ].includes[type]){
        if(!channelId){
            tlConsoleError(TableName, "请求service参数channelId为空")
            return {}
        }

        if(!latestReadId){
            tlConsoleError(TableName, "请求service参数latestChatId为空")
            return {}
        }
    }

    if([
        TlUserReadType.FRIEND_APPLY, 
        TlUserReadType.FRIEND_APPLY_PASS, 
        TlUserReadType.FRIEND_APPLY_REJECT,
        TlUserReadType.GROUP_APPLY,
        TlUserReadType.GROUP_APPLY_PASS,
        TlUserReadType.GROUP_APPLY_REJECT,
    ].includes[type]){
        if(!recordId){
            tlConsoleError(TableName, "请求service参数recordId为空")
            return {}
        }
    }

    if(!recordId){
        recordId = 0
    }

    if(!latestReadId) {
        latestReadId = 0
    }

    if(!channelId){
        channelId = 0
    }

    const info = await TlUserReadDao.addInfo({
        [TlUserReadDef.companyId] : companyId,
        [TlUserReadDef.channelId] : channelId,
        [TlUserReadDef.userId] : userId,
        [TlUserReadDef.type] : type,
        [TlUserReadDef.latestReadId] : latestReadId,
        [TlUserReadDef.recordId] : recordId,
    })

    if(info == null){
        tlConsoleError(TableName, "请求service参数为空")
        return {}
    }

    return info
}

/**
 * getListByUserIdTypeList 接口
 * @param {*} companyId
 * @param {*} userId 
 * @param {*} typeList
 * @param {*} fields
 */
const getListByUserIdTypeList = async function({companyId, userId, typeList}, fields){
    if(!userId){
        tlConsoleError(TableName, "请求service参数userId为空")
        return []
    }

    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return []
    }

    if(!typeList){
        tlConsoleError(TableName, "请求service参数typeList为空")
        return []
    }

    const list = await TlUserReadDao.getList({
        [TlUserReadDef.companyId]: companyId,
        [TlUserReadDef.userId]: userId,
        [TlUserReadDef.type]: typeList,
    }, fields, [
        [TlUserReadDef.createdAt, "DESC"]
    ])

    if(list == null){
        return []
    }

    return list   
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

    const list = await TlUserReadDao.getList({
        [TlUserReadDef.companyId]: companyId,
        [TlUserReadDef.channelId]: channelId,
        [TlUserReadDef.userId]: userId,
    }, fields, [
        [TlUserReadDef.createdAt, "DESC"]
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

    const info = await TlUserReadDao.updateInfo({
        [TlUserReadDef.companyId]: companyId,
        [TlUserReadDef.id]: id,
    }, data)

    if(info == null){
        return {}
    }

    return info
}

/**
 * getListByUserIdTypeListAndChannelIdList 接口
 * @param {*} companyId
 * @param {*} userId
 * @param {*} typeList
 * @param {*} channelIdList
 * @param {*} fields
 */
const getListByUserIdTypeListAndChannelIdList = async function({companyId, userId, typeList, channelIdList}, fields){
    if(!userId){
        tlConsoleError(TableName, "请求service参数userId为空")
        return []
    }

    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return []
    }

    if(!typeList){
        tlConsoleError(TableName, "请求service参数typeList为空")
        return []
    }

    if(!channelIdList){
        tlConsoleError(TableName, "请求service参数channelIdList为空")
        return []
    }

    if(channelIdList.length === 0){
        tlConsoleError(TableName, "请求service参数channelIdList为空")
        return []
    }

    const list = await TlUserReadDao.getList({
        [TlUserReadDef.companyId]: companyId,
        [TlUserReadDef.userId]: userId,
        [TlUserReadDef.type]: typeList,
        [TlUserReadDef.channelId]: channelIdList,
    }, fields, [
        [TlUserReadDef.createdAt, "DESC"]
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
    getListByUserIdTypeList,
    getListByUserIdTypeListAndChannelIdList,
}