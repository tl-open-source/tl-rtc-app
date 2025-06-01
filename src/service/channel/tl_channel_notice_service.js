const { fields } = require('../../tables/tl_channel_notice')
const TlChannelNoticeDao = require('../../dao/tl_channel_notice_dao')
const TlChannelNoticeDef = fields.Def
const TableName = fields.Name
const { tlConsoleError } = require("../../../src/utils/utils");

/**
 * addInfo 接口
 * @param {*} data 
 */
const addInfo = async function({
    companyId, channelId, userId, content
}){
    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return {}
    }

    if(!channelId){
        tlConsoleError(TableName, "请求service参数channelId为空")
        return {}
    }

    if(!userId){
        tlConsoleError(TableName, "请求service参数userId为空")
        return {}
    }

    if(!content){
        tlConsoleError(TableName, "请求service参数type为空")
        return {}
    }

    const info = await TlChannelNoticeDao.addInfo({
        [TlChannelNoticeDef.companyId] : companyId,
        [TlChannelNoticeDef.channelId] : channelId,
        [TlChannelNoticeDef.userId] : userId,
        [TlChannelNoticeDef.content] : content,
        [TlChannelNoticeDef.flag] : 0
    })

    if(info == null){
        tlConsoleError(TableName, "请求service参数为空")
        return {}
    }

    return info
}

/**
 * getListByChannelId 接口
 * @param {*} companyId
 * @param {*} channelId 
 * @param {*} fields
 */
const getListByChannelId = async function({companyId, channelId}, fields){
    if(!channelId){
        tlConsoleError(TableName, "请求service参数channelId为空")
        return []
    }

    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return []
    }

    const list = await TlChannelNoticeDao.getList({
        [TlChannelNoticeDef.companyId]: companyId,
        [TlChannelNoticeDef.channelId]: channelId,
    }, fields, [
        [TlChannelNoticeDef.createdAt, 'DESC']
    ])

    if(list == null){
        return []
    }

    return list
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

    const info = await TlChannelNoticeDao.deleteInfo({
        [TlChannelNoticeDef.companyId]: companyId,
        [TlChannelNoticeDef.id]: id,
    })

    if(info == null){
        return 0
    }

    return info
}

module.exports = {
    addInfo,
    deleteInfoById,
    
    getListByChannelId,
}