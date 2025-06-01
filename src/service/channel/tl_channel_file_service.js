const { fields } = require('../../tables/tl_channel_file')
const TlChannelFileDao = require('../../dao/tl_channel_file_dao')
const TlChannelFileDef = fields.Def
const TlChannelFileType = fields.Type
const TlChannelFileStatus = fields.Status
const TableName = fields.Name
const { tlConsoleError, tlConsole } = require("../../../src/utils/utils");

/**
 * addInfo 接口
 * @param {*} data 
 */
const addInfo = async function({
    companyId, channelId, flag, cloudFileId, other, fromUserId, fromUserName, 
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

    if(!cloudFileId){
        tlConsoleError(TableName, "请求service参数file为空")
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
        TlChannelFileType.OFFLINE,
        TlChannelFileType.P2P,
    ].includes(type)){
        tlConsoleError(TableName, "请求service参数type不合法")
        return {}
    }

    if(!status){
        tlConsoleError(TableName, "请求service参数status为空")
        return {}
    }

    if(![
        TlChannelFileStatus.INIT,
        TlChannelFileStatus.RECEIVED,
        TlChannelFileStatus.RECEIVING,
    ].includes(status)){
        tlConsoleError(TableName, "请求service参数status不合法")
        return {}
    }

    const info = await TlChannelFileDao.addInfo({
        [TlChannelFileDef.companyId]: companyId,
        [TlChannelFileDef.channelId]: channelId,
        [TlChannelFileDef.flag]: flag,
        [TlChannelFileDef.cloudFileId]: cloudFileId,
        [TlChannelFileDef.other]: other,
        [TlChannelFileDef.fromUserId]: fromUserId,
        [TlChannelFileDef.fromUserName]: fromUserName,
        [TlChannelFileDef.type]: type,
        [TlChannelFileDef.status]: status,
        [TlChannelFileDef.messageTimeStamp]: messageTimeStamp,
        [TlChannelFileDef.messageVersion]: messageVersion,
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

    const info = await TlChannelFileDao.getInfo({
        [TlChannelFileDef.companyId] : companyId,
        [TlChannelFileDef.id] : id,
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

    const list = await TlChannelFileDao.getList({
        [TlChannelFileDef.companyId]: companyId,
        [TlChannelFileDef.channelId]: channelId,
    }, fields, [
        [TlChannelFileDef.messageTimeStamp, 'DESC']
    ])

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

    const list = await TlChannelFileDao.getList({
        [TlChannelFileDef.companyId]: companyId,
        [TlChannelFileDef.channelId]: channelIdList,
    }, fields, [
        [TlChannelFileDef.messageTimeStamp, 'DESC']
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

    const info = await TlChannelFileDao.deleteInfo({
        [TlChannelFileDef.companyId]: companyId,
        [TlChannelFileDef.id]: id,
    })

    if(info == null){
        return 0
    }

    return info
}

/**
 * 获取频道文件最新id
 * @param {*} companyId
 * @param {*} channelId
 * @param {*} fields
 */
const getChannelFileLatestId = async function({companyId, channelId}, fields){
    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return 0
    }

    if(!channelId){
        tlConsoleError(TableName, "请求service参数channelId为空")
        return 0
    }

    const list = await TlChannelFileDao.getListForPage({
        [TlChannelFileDef.companyId]: companyId,
        [TlChannelFileDef.channelId]: channelId,
    }, fields, [
        [TlChannelFileDef.id, 'DESC']
    ], 1, 1)

    if(list == null || list.length === 0){
        return 0
    }

    const latestId = list[0][TlChannelFileDef.id]

    return latestId
}


module.exports = {
    addInfo,
    getInfoById,
    deleteInfoById,
    getChannelFileLatestId,

    getListByChannelId,
    getListByChannelIdList,
}