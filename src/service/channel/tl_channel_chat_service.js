const { Op } = require('sequelize')
const { fields } = require('../../tables/tl_channel_chat')
const TlChannelChatDao = require('../../dao/tl_channel_chat_dao')
const TlChannelChatDef = fields.Def
const TlChannelChatType = fields.Type
const TableName = fields.Name
const TableFields = Object.keys(fields.Def).map(key => fields.Def[key])
const { tlConsoleError, tlConsole } = require("../../../src/utils/utils");


/**
 * addInfo 接口
 * @param {*} data 
 */
const addInfo = async function({
    companyId, channelId, type, message, flag,
    fromUserId, fromUserName, toUserId, toUserName, other,
    messageTimeStamp, messageVersion
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

    if(!type){
        tlConsoleError(TableName, "请求service参数type为空")
        return {}
    }

    if(![
        TlChannelChatType.SYSTEM,
        TlChannelChatType.FRIEND,
        TlChannelChatType.GROUP
    ].includes(type)){
        tlConsoleError(TableName, "请求service参数type不合法")
        return {}
    }

    if(!message){
        tlConsoleError(TableName, "请求service参数message为空")
        return {}
    }

    // 系统消息
    if (type === TlChannelChatType.SYSTEM) {
        if(!fromUserName){
            tlConsoleError(TableName, "请求service参数fromUserName为空")
            return {}
        }
    }

    // 好友聊天
    if (type === TlChannelChatType.FRIEND) {
        if(!fromUserId){
            tlConsoleError(TableName, "请求service参数fromUserId为空")
            return {}
        }
    
        if(!fromUserName){
            tlConsoleError(TableName, "请求service参数fromUserName为空")
            return {}
        }
    
        if(!toUserId){
            tlConsoleError(TableName, "请求service参数toUserId为空")
            return {}
        }
    
        if(!toUserName){
            tlConsoleError(TableName, "请求service参数toUserName为空")
            return {}
        }
    }

    // 群聊
    if (type === TlChannelChatType.GROUP) {
        if(!fromUserId){
            tlConsoleError(TableName, "请求service参数fromUserId为空")
            return {}
        }
    
        if(!fromUserName){
            tlConsoleError(TableName, "请求service参数fromUserName为空")
            return {}
        }
    }

    const info = await TlChannelChatDao.addInfo({
        [TlChannelChatDef.companyId]: companyId,
        [TlChannelChatDef.channelId]: channelId,
        [TlChannelChatDef.type]: type,
        [TlChannelChatDef.message]: message,
        [TlChannelChatDef.fromUserId]: fromUserId,
        [TlChannelChatDef.fromUserName]: fromUserName,
        [TlChannelChatDef.toUserId]: toUserId,
        [TlChannelChatDef.toUserName]: toUserName,
        [TlChannelChatDef.other]: other,
        [TlChannelChatDef.flag]: flag,
        [TlChannelChatDef.messageTimeStamp]: messageTimeStamp,
        [TlChannelChatDef.messageVersion]: messageVersion
    })

    if(info == null){
        tlConsoleError(TableName, "请求dao异常")
        return {}
    }

    return info
}

/**
 * addGroupChatInfo 接口
 * @param {*} companyId
 * @param {*} channelId
 * @param {*} message
 * @param {*} fromUserId
 * @param {*} fromUserName
 * @param {*} other
 * @param {*} flag
 * @param {*} messageTimeStamp
 * @param {*} messageVersion
 */
const addGroupChatInfo = async function({
    companyId, channelId, message, fromUserId, fromUserName, 
    other, flag, messageTimeStamp, messageVersion
}){
    return await addInfo({
        companyId: companyId,
        channelId : channelId,
        type: TlChannelChatType.GROUP,
        message: message,
        fromUserId: fromUserId,
        fromUserName: fromUserName,
        toUserId: 0,
        toUserName: '',
        other: other,
        flag: flag,
        messageTimeStamp: messageTimeStamp,
        messageVersion: messageVersion
    })
}

/**
 * addFriendChatInfo 接口
 * @param {*} companyId
 * @param {*} channelId
 * @param {*} message
 * @param {*} fromUserId
 * @param {*} fromUserName
 * @param {*} toUserId
 * @param {*} toUserName
 * @param {*} other
 * @param {*} flag
 * @param {*} messageTimeStamp
 * @param {*} messageVersion
 */
const addFriendChatInfo = async function({
    companyId, channelId, message, fromUserId, fromUserName, 
    toUserId, toUserName, other, flag, messageTimeStamp, messageVersion
}){
    return await addInfo({
        companyId: companyId,
        channelId : channelId,
        type: TlChannelChatType.FRIEND,
        message: message,
        fromUserId: fromUserId,
        fromUserName: fromUserName,
        toUserId: toUserId,
        toUserName: toUserName,
        other: other,
        flag: flag,
        messageTimeStamp: messageTimeStamp,
        messageVersion: messageVersion
    })
}

/**
 * addSystemChatnfo 接口
 * @param {*} companyId
 * @param {*} channelId
 * @param {*} message
 * @param {*} other
 * @param {*} flag
 * @param {*} messageTimeStamp
 * @param {*} messageVersion
 */
const addSystemChatnfo = async function({
    companyId, channelId, message, other, flag, messageTimeStamp, messageVersion
}){
    return await addInfo({
        companyId: companyId,
        channelId : channelId,
        type: TlChannelChatType.SYSTEM,
        message: message,
        fromUserName: '系统消息',
        flag: flag,
        fromUserId: 0,
        toUserId: 0,
        toUserName: '',
        other: other,
        messageTimeStamp: messageTimeStamp,
        messageVersion: messageVersion
    })
}

/**
 * getInfoById 接口
 * @param {*} companyId
 * @param {*} id 
 * @param {*} fields
 */
const getInfoById = async function({companyId, id}, fields){
    if(!id){
        tlConsoleError(TableName, "请求service参数id为空")
        return {}
    }

    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return {}
    }

    const info = await TlChannelChatDao.getInfo({
        [TlChannelChatDef.companyId]: companyId,
        [TlChannelChatDef.id]: id,
    }, fields)

    if(info == null){
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

    const list = await TlChannelChatDao.getList({
        [TlChannelChatDef.companyId]: companyId,
        [TlChannelChatDef.channelId]: channelId,
    }, fields, [
        [TlChannelChatDef.messageTimeStamp, 'DESC']
    ])

    if(list == null){
        return []
    }

    return list
}

/**
 * getListByChannelIdForPage 接口
 * @param {*} companyId
 * @param {*} channelId 
 * @param {*} fields
 * @param {*} page
 * @param {*} pageSize
 */
const getListByChannelIdForPage = async function({companyId, channelId}, fields, page, pageSize){
    if(!channelId){
        tlConsoleError(TableName, "请求service参数channelId为空")
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

    const list = await TlChannelChatDao.getListForPage({
        [TlChannelChatDef.companyId]: companyId,
        [TlChannelChatDef.channelId]: channelId,
    }, fields, [
        [TlChannelChatDef.messageTimeStamp, 'DESC']
    ], page, pageSize)

    if(list == null){
        return []
    }

    return list
}


/**
 * getListByChannelIdAndMinIdForPage 接口
 * @desc 查看频道历史聊天记录
 * @param {*} companyId
 * @param {*} channelId 
 * @param {*} fields
 * @param {*} minId
 * @param {*} page
 * @param {*} pageSize
 */
const getListByChannelIdAndMinIdForPage = async function({
    companyId, channelId, minId
}, fields, page, pageSize){
    if(!channelId){
        tlConsoleError(TableName, "请求service参数channelId为空")
        return []
    }

    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return []
    }

    if(!minId){
        tlConsoleError(TableName, "请求service参数minId为空")
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

    const list = await TlChannelChatDao.getListForPage({
        [TlChannelChatDef.companyId]: companyId,
        [TlChannelChatDef.channelId]: channelId,
        [TlChannelChatDef.id]: {
            [Op.lt]: minId
        }
    }, fields, [
        [TlChannelChatDef.messageTimeStamp, 'DESC']
    ], page, pageSize)

    if(list == null){
        return []
    }

    return list
}


/**
 * getListByChannelIdAndMinIdTimeRangeForPage 接口
 * @desc 搜索频道聊天记录
 * @param {*} companyId
 * @param {*} channelId 
 * @param {*} fields
 * @param {*} minId
 * @param {*} startTimeStamp
 * @param {*} endTimeStamp
 * @param {*} keyword
 * @param {*} page
 * @param {*} pageSize
 */
const getListByChannelIdAndMinIdTimeRangeForPage = async function({
    companyId, channelId, minId, startTimeStamp, endTimeStamp, keyword
}, fields, page, pageSize){
    if(!channelId){
        tlConsoleError(TableName, "请求service参数channelId为空")
        return []
    }

    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return []
    }

    if(!minId){
        tlConsoleError(TableName, "请求service参数minId为空")
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

    let query = {
        [TlChannelChatDef.companyId]: companyId,
        [TlChannelChatDef.channelId]: channelId,
        [TlChannelChatDef.id]: {
            [Op.lte]: minId,
        }
    }

    if(startTimeStamp && endTimeStamp){
        query[TlChannelChatDef.messageTimeStamp] = {
            [Op.between]: [startTimeStamp, endTimeStamp]
        }
    }

    if(keyword !== '' && keyword !== undefined && keyword !== null){ 
        query[TlChannelChatDef.message] = {
            [Op.like]: `%${keyword}%`
        }
    }

    const list = await TlChannelChatDao.getListForPage(query, fields, [
        [TlChannelChatDef.messageTimeStamp, 'DESC']
    ], page, pageSize)

    if(list == null){
        return []
    }

    return list
}

/**
 * getListByChannelIdAndMaxIdForPage 接口
 * @desc 查看频道最新聊天记录
 * @param {*} companyId
 * @param {*} channelId 
 * @param {*} fields
 * @param {*} maxId
 * @param {*} page
 * @param {*} pageSize
 */
const getListByChannelIdAndMaxIdForPage = async function({
    companyId, channelId, maxId
}, fields, page, pageSize){
    if(!channelId){
        tlConsoleError(TableName, "请求service参数channelId为空")
        return []
    }

    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return []
    }

    if(!maxId){
        tlConsoleError(TableName, "请求service参数maxId为空")
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
    
    const list = await TlChannelChatDao.getListForPage({
        [TlChannelChatDef.companyId]: companyId,
        [TlChannelChatDef.channelId]: channelId,
        [TlChannelChatDef.id]: {
            [Op.gte]: maxId
        }
    }, fields, [
        [TlChannelChatDef.messageTimeStamp, 'DESC']
    ], page, pageSize)

    if(list == null){
        return []
    }

    return list
}


/**
 * getListByChannelIdList 接口
 * @param {*} companyId
 * @param {*} channelIdList
 * @param {*} fields
 */
const getListByChannelIdList = async function({companyId, channelIdList}, fields){
    if(!channelIdList){
        tlConsoleError(TableName, "请求service参数channelIdList为空")
        return []
    }

    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return []
    }

    const list = await TlChannelChatDao.getList({
        [TlChannelChatDef.companyId]: companyId,
        [TlChannelChatDef.channelId]: channelIdList,
    }, fields, [
        [TlChannelChatDef.messageTimeStamp, 'DESC']
    ])

    if(list == null){
        return []
    }

    return list
}

/**
 * getListByChannelIdListForPage 接口
 * @param {*} companyId
 * @param {*} channelIdList
 * @param {*} page
 * @param {*} pageSize
 * @param {*} fields
 */
const getListByChannelIdListForPage = async function({companyId, channelIdList}, fields, page, pageSize){
    if(!channelIdList){
        tlConsoleError(TableName, "请求service参数channelIdList为空")
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

    const list = await TlChannelChatDao.getListForPage({
        [TlChannelChatDef.companyId]: companyId,
        [TlChannelChatDef.channelId]: channelIdList,
    }, fields, [
        [TlChannelChatDef.messageTimeStamp, 'DESC']
    ], page, pageSize)

    if(list == null){
        return []
    }

    return list
}

/**
 * getListByChannelFromUserId 接口
 * @param {*} companyId
 * @param {*} channelId 
 * @param {*} fromUserId 
 * @param {*} fields
 */
const getListByChannelFromUserId = async function({companyId, channelId, fromUserId}, fields){
    if(!channelId){
        tlConsoleError(TableName, "请求service参数channelId为空")
        return []
    }

    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return []
    }

    if(!fromUserId){
        tlConsoleError(TableName, "请求service参数fromUserId为空")
        return []
    }

    const list = await TlChannelChatDao.getList({
        [TlChannelChatDef.companyId]: companyId,
        [TlChannelChatDef.channelId]: channelId,
        [TlChannelChatDef.fromUserId]: fromUserId,
    }, fields, [
        [TlChannelChatDef.messageTimeStamp, 'DESC']
    ])

    if(list == null){
        return []
    }

    return list
}

/**
 * getListByChannelFromUserIdForPage 接口
 * @param {*} companyId
 * @param {*} channelId 
 * @param {*} fromUserId 
 * @param {*} page
 * @param {*} pageSize
 * @param {*} fields
 */
const getListByChannelFromUserIdForPage = async function({companyId, channelId, fromUserId}, fields, page, pageSize){
    if(!channelId){
        tlConsoleError(TableName, "请求service参数channelId为空")
        return []
    }

    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return []
    }

    if(!fromUserId){
        tlConsoleError(TableName, "请求service参数fromUserId为空")
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

    const list = await TlChannelChatDao.getListForPage({
        [TlChannelChatDef.companyId]: companyId,
        [TlChannelChatDef.channelId]: channelId,
        [TlChannelChatDef.fromUserId]: fromUserId,
    }, fields, [
        [TlChannelChatDef.messageTimeStamp, 'DESC']
    ], page, pageSize)

    if(list == null){
        return []
    }

    return list
}

/**
 * getListByChannelToUserId 接口
 * @param {*} companyId
 * @param {*} channelId 
 * @param {*} toUserId 
 * @param {*} fields
 */
const getListByChannelToUserId = async function({companyId, channelId, toUserId}, fields){
    if(!channelId){
        tlConsoleError(TableName, "请求service参数channelId为空")
        return []
    }

    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return []
    }

    if(!toUserId){
        tlConsoleError(TableName, "请求service参数toUserId为空")
        return []
    }

    const list = await TlChannelChatDao.getList({
        [TlChannelChatDef.companyId]: companyId,
        [TlChannelChatDef.channelId]: channelId,
        [TlChannelChatDef.toUserId]: toUserId,
    }, fields, [
        [TlChannelChatDef.messageTimeStamp, 'DESC']
    ])

    if(list == null){
        return []
    }

    return list
}

/**
 * getListByChannelToUserIdForPage 接口
 * @param {*} companyId
 * @param {*} channelId 
 * @param {*} toUserId 
 * @param {*} page
 * @param {*} pageSize
 * @param {*} fields
 */
const getListByChannelToUserIdForPage = async function({companyId, channelId, toUserId}, fields, page, pageSize){
    if(!channelId){
        tlConsoleError(TableName, "请求service参数channelId为空")
        return []
    }

    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return []
    }

    if(!toUserId){
        tlConsoleError(TableName, "请求service参数toUserId为空")
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

    const list = await TlChannelChatDao.getListForPage({
        [TlChannelChatDef.companyId]: companyId,
        [TlChannelChatDef.channelId]: channelId,
        [TlChannelChatDef.toUserId]: toUserId,
    }, fields, [
        [TlChannelChatDef.messageTimeStamp, 'DESC']
    ], page, pageSize)

    if(list == null){
        return []
    }

    return list
}

/**
 * getListByCompanyId 接口
 * @param {*} companyId
 * @param {*} fields
 */
const getListByCompanyId = async function({companyId}, fields){
    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return []
    }

    const list = await TlChannelChatDao.getList({
        [TlChannelChatDef.companyId]: companyId,
    }, fields, [
        [TlChannelChatDef.messageTimeStamp, 'DESC']
    ])

    if(list == null){
        return []
    }

    return list
}

/**
 * getListByCompanyIdForPage 接口
 * @param {*} companyId
 * @param {*} fields
 * @param {*} page
 * @param {*} pageSize
 */
const getListByCompanyIdForPage = async function({companyId}, fields, page, pageSize){
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

    const list = await TlChannelChatDao.getListForPage({
        [TlChannelChatDef.companyId]: companyId,
    }, fields, [
        [TlChannelChatDef.messageTimeStamp, 'DESC']
    ], page, pageSize)

    if(list == null){
        return []
    }

    return list
}

/**
 * getListByChannelIdAndIdList 接口
 * @param {*} companyId
 * @param {*} channelId
 * @param {*} idList
 * @param {*} fields
 */
const getListByChannelIdAndIdList = async function({companyId, channelId, idList}, fields){
    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return []
    }

    if(!channelId){
        tlConsoleError(TableName, "请求service参数channelId为空")
        return []
    }

    if(!idList){
        tlConsoleError(TableName, "请求service参数idList为空")
        return []
    }

    const list = await TlChannelChatDao.getList ({
        [TlChannelChatDef.companyId]: companyId,
        [TlChannelChatDef.channelId]: channelId,
        [TlChannelChatDef.id]: idList
    }, fields)

    if(list == null){
        return []
    }

    return list
}

/**
 * getListByChannelIdAndIdListForPage 接口
 * @param {*} companyId
 * @param {*} channelId
 * @param {*} idList
 * @param {*} fields
 * @param {*} page
 * @param {*} pageSize
 */
const getListByChannelIdAndIdListForPage = async function({companyId, channelId, idList}, fields, page, pageSize){
    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return []
    }

    if(!channelId){
        tlConsoleError(TableName, "请求service参数channelId为空")
        return []
    }

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

    const list = await TlChannelChatDao.getListForPage({
        [TlChannelChatDef.companyId]: companyId,
        [TlChannelChatDef.channelId]: channelId,
        [TlChannelChatDef.id]: idList
    }, fields, [
        [TlChannelChatDef.messageTimeStamp, 'DESC']
    ], page, pageSize)

    if(list == null){
        return []
    }

    return list
}

/**
 * getListByIdList 接口
 * @param {*} companyId
 * @param {*} idList
 * @param {*} fields
 */
const getListByIdList = async function({companyId, idList}, fields){
    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return []
    }

    if(!idList){
        tlConsoleError(TableName, "请求service参数idList为空")
        return []
    }

    const list = await TlChannelChatDao.getList({
        [TlChannelChatDef.companyId]: companyId,
        [TlChannelChatDef.id]: idList,
    }, fields)

    if(list == null){
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
    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return []
    }

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

    const list = await TlChannelChatDao.getListForPage({
        [TlChannelChatDef.companyId]: companyId,
        [TlChannelChatDef.id]: idList,
    }, fields, [
        [TlChannelChatDef.messageTimeStamp, 'DESC']
    ], page, pageSize)

    if(list == null){
        return []
    }

    return list
}

/**
 * updateInfoById 接口
 * @param {*} id
 * @param {*} companyId 
 * @param {*} data 
 */
const updateInfoById = async function({id, companyId}, data){
    if(Object.keys(data).length === 0){
        tlConsoleError(TableName, "请求service参数为空")
        return {}
    }

    if(!id){
        tlConsoleError(TableName, "请求service参数id为空")
        return {}
    }

    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return {}
    }

    const info = await TlChannelChatDao.updateInfo({
        [TlChannelChatDef.companyId]: companyId,
        [TlChannelChatDef.id]: id,
    }, data)

    if(info == null){
        tlConsoleError(TableName, "请求dao异常")
        return {}
    }

    return info
}

/**
 * deleteInfoById 接口
 * @param {*} id
 * @param {*} companyId 
 */
const deleteInfoById = async function({id, companyId}){    
    if(!id){
        tlConsoleError(TableName, "请求service参数id为空")
        return {}
    }

    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return {}
    }

    const info = await TlChannelChatDao.deleteInfo({
        [TlChannelChatDef.companyId]: companyId,
        [TlChannelChatDef.id]: id,
    })

    if(info == null){
        tlConsoleError(TableName, "请求dao异常")
        return {}
    }

    return info
}

/**
 * getCountByChannelId 接口
 * @param {*} companyId
 * @param {*} channelId
 */
const getCountByChannelId = async function({companyId, channelId}){
    if(!channelId){
        tlConsoleError(TableName, "请求service参数channelId为空")
        return 0
    }

    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return 0
    }

    const count = await TlChannelChatDao.getCount({
        [TlChannelChatDef.companyId]: companyId,
        [TlChannelChatDef.channelId]: channelId,
    })

    if(count == null){
        return 0
    }

    return count
}

/**
 * getCountByChannelIdList 接口
 * @param {*} companyId
 * @param {*} channelIdList
 */
const getCountByChannelIdList = async function({companyId, channelIdList}){
    if(!channelIdList){
        tlConsoleError(TableName, "请求service参数channelIdList为空")
        return {}
    }

    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return {}
    }

    const counts = await TlChannelChatDao.getGroupCount({
        [TlChannelChatDef.companyId]: companyId,
        [TlChannelChatDef.channelId]: channelIdList,
    }, TlChannelChatDef.channelId)

    if(counts == null){
        return {}
    }

    return counts
}

/**
 * 获取频道聊天最新id
 * @param {*} companyId
 * @param {*} channelId
 * @param {*} fields
 */
const getChannelChatLatestId = async function({companyId, channelId}, fields){
    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return 0
    }

    if(!channelId){
        tlConsoleError(TableName, "请求service参数channelId为空")
        return 0
    }

    const list = await TlChannelChatDao.getListForPage({
        [TlChannelChatDef.companyId]: companyId,
        [TlChannelChatDef.channelId]: channelId,
    }, fields, [
        [TlChannelChatDef.id, 'DESC']
    ], 1, 1)

    if(list == null || list.length === 0){
        return 0
    }

    const latestId = list[0][TlChannelChatDef.id]

    return latestId
}

module.exports = {
    addInfo,
    getInfoById,
    getChannelChatLatestId,
    updateInfoById,
    deleteInfoById,
    addSystemChatnfo,
    addFriendChatInfo,
    addGroupChatInfo,
    getCountByChannelId,
    getCountByChannelIdList,

    getListByChannelId,
    getListByChannelIdForPage,
    getListByChannelFromUserId,
    getListByChannelFromUserIdForPage,
    getListByChannelToUserId,
    getListByChannelToUserIdForPage,
    getListByCompanyId,
    getListByCompanyIdForPage,
    getListByChannelIdList,
    getListByChannelIdListForPage,

    getListByChannelIdAndMinIdForPage,
    getListByChannelIdAndMinIdTimeRangeForPage,

    getListByChannelIdAndMaxIdForPage,

    getListByChannelIdAndIdList,
    getListByChannelIdAndIdListForPage,

    getListByIdList,
    getListByIdListForPage,
}