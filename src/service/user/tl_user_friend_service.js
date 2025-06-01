const { fields } = require('../../tables/tl_user_friend')
const TlUserFirendDao = require('../../dao/tl_user_friend_dao')
const TlUserFriendDef = fields.Def
const TlUserFriendType = fields.FriendType
const TlUserFriendStatus = fields.Status
const TableName = fields.Name
const { tlConsoleError } = require("../../../src/utils/utils");


/**
 * addInfo 接口
 * @param {*} data 
 */
const addInfo = async function({
    companyId, userId, friendId, friendType, origin, 
    remark, status, channelId, rename, flag
}){
    // 参数校验
    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return {}
    }

    if(!userId){
        tlConsoleError(TableName, "请求service参数userId为空")
        return {}
    }

    if(!friendId){
        tlConsoleError(TableName, "请求service参数friendId为空")
        return {}
    }

    if(!friendType){
        tlConsoleError(TableName, "请求service参数friendType为空")
        return {}
    }

    if(![
        TlUserFriendType.NORMAL,
    ].includes(friendType)){
        tlConsoleError(TableName, "请求service参数friendType不合法")
        return {}
    }

    if(!origin){
        tlConsoleError(TableName, "请求service参数origin为空")
        return {}
    }

    if(!status){
        tlConsoleError(TableName, "请求service参数status为空")
        return {}
    }

    if(![
        TlUserFriendStatus.NORMAL,
    ].includes(status)){
        tlConsoleError(TableName, "请求service参数status不合法")
        return {}
    }

    if(!channelId){
        tlConsoleError(TableName, "请求service参数channelId为空")
        return {}
    }

    if(!rename){
        tlConsoleError(TableName, "请求service参数rename为空")
        return {}
    }

    if(flag == null || flag == undefined){
        tlConsoleError(TableName, "请求service参数flag为空")
        return {}
    }

    const info = await TlUserFirendDao.addInfo({
        [TlUserFriendDef.companyId]: companyId,
        [TlUserFriendDef.userId]: userId,
        [TlUserFriendDef.friendId]: friendId,
        [TlUserFriendDef.friendType]: friendType,
        [TlUserFriendDef.origin]: origin,
        [TlUserFriendDef.remark]: remark,
        [TlUserFriendDef.status]: status,
        [TlUserFriendDef.flag]: flag,
        [TlUserFriendDef.channelId]: channelId,
        [TlUserFriendDef.rename]: rename
    });

    if(info === null){
        tlConsoleError(TableName, "请求dao异常")
        return {}
    }

    return info
}

/**
 * getListByUserId 接口
 * @param {*} companyId
 * @param {*} userId 
 * @param {*} fields
 */
const getListByUserId = async function({companyId, userId}, fields){
    // 参数校验
    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return []
    }

    if(!userId){
        tlConsoleError(TableName, "请求service参数userId为空")
        return []
    }

    const list = await TlUserFirendDao.getList({
        [TlUserFriendDef.companyId]: companyId,
        [TlUserFriendDef.userId]: userId
    }, fields, [
        [TlUserFriendDef.createdAt, 'DESc']
    ]);

    if(list === null){
        return []
    }

    return list
}

/**
 * getInfoByUserIdAndFriendId 接口
 * @param {*} companyId
 * @param {*} userId 
 * @param {*} friendId 
 * @param {*} fields
 */
const getInfoByUserIdAndFriendId = async function({companyId, userId, friendId}, fields){
    // 参数校验
    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return {}
    }

    if(!userId){
        tlConsoleError(TableName, "请求service参数userId为空")
        return {}
    }

    if(!friendId){
        tlConsoleError(TableName, "请求service参数friendId为空")
        return {}
    }

    const info = await TlUserFirendDao.getInfo({
        [TlUserFriendDef.companyId]: companyId,
        [TlUserFriendDef.userId]: userId,
        [TlUserFriendDef.friendId]: friendId
    }, fields);

    if(info === null){
        return {}
    }

    return info
}

/**
 * getInfoByChannelIdAndUserId 接口
 * @param {*} companyId
 * @param {*} userId 
 * @param {*} channelId 
 * @param {*} fields
 */
const getInfoByChannelIdAndUserId = async function({companyId, userId, channelId}, fields){
    // 参数校验
    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return {}
    }

    if(!userId){
        tlConsoleError(TableName, "请求service参数userId为空")
        return {}
    }

    if(!channelId){
        tlConsoleError(TableName, "请求service参数channelId为空")
        return {}
    }

    const info = await TlUserFirendDao.getInfo({
        [TlUserFriendDef.companyId]: companyId,
        [TlUserFriendDef.userId]: userId,
        [TlUserFriendDef.channelId]: channelId
    }, fields);

    if(info === null){
        return {}
    }

    return info
}

/**
 * getListByUserIdAndFriendIdList 接口
 * @param {*} companyId
 * @param {*} userId 
 * @param {*} friendIdList
 * @param {*} fields
 */
const getListByUserIdAndFriendIdList = async function({companyId, userId, friendIdList}, fields){
    // 参数校验
    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return []
    }

    if(!userId){
        tlConsoleError(TableName, "请求service参数userId为空")
        return []
    }

    if(!friendIdList){
        tlConsoleError(TableName, "请求service参数friendIdList为空")
        return []
    }

    const list = await TlUserFirendDao.getList({
        [TlUserFriendDef.companyId]: companyId,
        [TlUserFriendDef.userId]: userId,
        [TlUserFriendDef.friendId]: friendIdList
    }, fields, [
        [TlUserFriendDef.createdAt, 'DESC']
    ]);

    if(list === null){
        return []
    }

    return list
}

/**
 * getListByChannelId 接口
 * @param {*} companyId
 * @param {*} channelId 
 * @param {*} fields
 */
const getListByChannelId = async function({companyId, channelId}, fields){
    // 参数校验
    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return []
    }

    if(!channelId){
        tlConsoleError(TableName, "请求service参数userId为空")
        return []
    }

    const list = await TlUserFirendDao.getList({
        [TlUserFriendDef.companyId]: companyId,
        [TlUserFriendDef.channelId]: channelId,
    }, fields, [
        [TlUserFriendDef.createdAt, 'DESC']
    ]);

    if(list === null){
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
    // 参数校验
    if(!id){
        tlConsoleError(TableName, "请求service参数id为空")
        return 0
    }

    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return 0
    }

    const info = await TlUserFirendDao.deleteInfo({
        [TlUserFriendDef.companyId]: companyId,
        [TlUserFriendDef.id]: id
    });

    if(info === null){
        tlConsoleError(TableName, "请求dao异常")
        return 0
    }

    return info
}

/**
 * updateInfoById 接口
 * @param {*} companyId
 * @param {*} id
 * @param {*} data
 */
const updateInfoById = async function({companyId, id}, data){
    // 参数校验
    if(!id){
        tlConsoleError(TableName, "请求service参数id为空")
        return {}
    }

    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return {}
    }

    const info = await TlUserFirendDao.updateInfo({
        [TlUserFriendDef.companyId]: companyId,
        [TlUserFriendDef.id]: id,
    }, data);

    if(info === null){
        tlConsoleError(TableName, "请求dao异常")
        return {}
    }

    return info
}


module.exports = {
    addInfo,
    getInfoByUserIdAndFriendId,
    deleteInfoById,
    updateInfoById,
    getInfoByChannelIdAndUserId,

    getListByUserIdAndFriendIdList,
    getListByUserId,
    getListByChannelId,
}