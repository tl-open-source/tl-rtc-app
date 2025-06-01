const { fields } = require('../../tables/tl_channel_chat')
const TlChannelChatDao = require('../../dao/tl_channel_chat_dao')
const TlChannelChatDef = fields.Def
const TlChannelChatType = fields.Type
const TableName = fields.Name
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

    if(Object.values(TlChannelChatType).indexOf(type) === -1){
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

/**
 * 删除聊天记录
 * @param {*} companyId
 * @param {*} id
 */
const deleteInfoById = async function({companyId, id}){
    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return 0
    }

    if(!id){
        tlConsoleError(TableName, "请求service参数id为空")
        return 0
    }

    const info = await TlChannelChatDao.deleteInfo({
        [TlChannelChatDef.companyId]: companyId,
        [TlChannelChatDef.id]: id
    })

    if(info == null){
        return 0
    }

    return info
}

module.exports = {
    addInfo,
    getInfoById,
    getChannelChatLatestId,
    addSystemChatnfo,
    addFriendChatInfo,
    addGroupChatInfo,
    getCountByChannelIdList,
    deleteInfoById,

    getListByChannelIdAndIdList,
    getListByIdList,
}