const { fields } = require('../../tables/tl_channel_media')
const TlChannelMediaDao = require('../../dao/tl_channel_media_dao')
const TlChannelMediaDef = fields.Def
const TlChannelMediaType = fields.Type
const TlChannelMediaStatus = fields.Status
const TableName = fields.Name
const { tlConsoleError, tlConsole } = require("../../../src/utils/utils");

/**
 * addInfo 接口
 * @param {*} data 
 */
const addInfo = async function({
    companyId, channelId, flag, media, other, fromUserId, fromUserName, 
    type, status, messageTimeStamp, messageVersion
}){
    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return {}
    }

    if(!channelId){
        tlConsoleError(TableName, "请求service参数channelId为空")
        return {}
    }

    if(!messageTimeStamp){
        tlConsoleError(TableName, "请求service参数messageTimeStamp为空")
        return {}
    }

    if(!messageVersion){
        tlConsoleError(TableName, "请求service参数messageVersion为空")
        return {}
    }

    if(flag === undefined || flag === null){
        tlConsoleError(TableName, "请求service参数flag为空")
        return {}
    }

    if(!media){
        tlConsoleError(TableName, "请求service参数media为空")
        return {}
    }

    if(!other){
        tlConsoleError(TableName, "请求service参数other为空")
        return {}
    }

    if(!fromUserId){
        tlConsoleError(TableName, "请求service参数fromUserId为空")
        return {}
    }

    if(!fromUserName){
        tlConsoleError(TableName, "请求service参数fromUserName为空")
        return {}
    }

    if(!type){
        tlConsoleError(TableName, "请求service参数type为空")
        return {}
    }

    if(![
        TlChannelMediaType.AUDIO,
        TlChannelMediaType.VIDEO,
    ].includes(type)){
        tlConsoleError(TableName, "请求service参数type不合法")
        return {}
    }

    if(!status){
        tlConsoleError(TableName, "请求service参数status为空")
        return {}
    }

    if(![
        TlChannelMediaStatus.INIT,
        TlChannelMediaStatus.RECEIVED,
        TlChannelMediaStatus.RECEIVING,
    ].includes(status)){
        tlConsoleError(TableName, "请求service参数status不合法")
        return {}
    }

    const info = await TlChannelMediaDao.addInfo({  
        [TlChannelMediaDef.companyId]: companyId,
        [TlChannelMediaDef.channelId]: channelId,
        [TlChannelMediaDef.flag]: flag,
        [TlChannelMediaDef.media]: media,
        [TlChannelMediaDef.other]: other,
        [TlChannelMediaDef.fromUserId]: fromUserId,
        [TlChannelMediaDef.fromUserName]: fromUserName,
        [TlChannelMediaDef.type]: type,
        [TlChannelMediaDef.status]: status,
        [TlChannelMediaDef.messageTimeStamp]: messageTimeStamp,
        [TlChannelMediaDef.messageVersion]: messageVersion,
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
 * @param {*} fields
 */
const getInfoById = async function({companyId, id}, fields){
    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return {}
    }

    if(!id){
        tlConsoleError(TableName, "请求service参数id为空")
        return {}
    }

    const info = await TlChannelMediaDao.getInfo({
        [TlChannelMediaDef.companyId] : companyId,
        [TlChannelMediaDef.id] : id,
    }, fields)

    if(info == null){
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
    if(!id){
        tlConsoleError(TableName, "请求service参数id为空")
        return 0
    }

    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return 0
    }

    const info = await TlChannelMediaDao.deleteInfo({
        [TlChannelMediaDef.companyId]: companyId,
        [TlChannelMediaDef.id]: id,
    })

    if(info == null){
        return 0
    }

    return info
}

/**
 * 获取频道媒体最新id
 * @param {*} companyId
 * @param {*} channelId
 * @param {*} fields
 */
const getChannelMediaLatestId = async function({companyId, channelId}, fields){
    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return 0
    }

    if(!channelId){
        tlConsoleError(TableName, "请求service参数channelId为空")
        return 0
    }

    const list = await TlChannelMediaDao.getListForPage({
        [TlChannelMediaDef.companyId]: companyId,
        [TlChannelMediaDef.channelId]: channelId,
    }, fields, [
        [TlChannelMediaDef.id, 'DESC']
    ], 1, 1)

    if(list == null || list.length === 0){
        return 0
    }

    const latestId = list[0][TlChannelMediaDef.id]

    return latestId
}

module.exports = {
    addInfo,
    getInfoById,
    deleteInfoById,
    getChannelMediaLatestId,
}