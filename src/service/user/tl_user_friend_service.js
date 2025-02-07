const { fields } = require('../../tables/tl_user_friend')
const TlUserFirendDao = require('../../dao/tl_user_friend_dao')
const TlUserFriendDef = fields.Def
const TlUserFriendType = fields.FriendType
const TlUserFriendStatus = fields.Status
const TableName = fields.Name
const TableFields = Object.keys(fields.Def).map(key => fields.Def[key])
const { tlConsoleError, tlConsole } = require("../../../src/utils/utils");


/**
 * addInfo 接口
 * @param {*} data 
 */
const addInfo = async function({
    companyId, userId, friendId, friendType, origin, remark, status, channelId, rename
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
        TlUserFriendType.SPECIAL
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

    const info = await TlUserFirendDao.addInfo({
        [TlUserFriendDef.companyId]: companyId,
        [TlUserFriendDef.userId]: userId,
        [TlUserFriendDef.friendId]: friendId,
        [TlUserFriendDef.friendType]: friendType,
        [TlUserFriendDef.origin]: origin,
        [TlUserFriendDef.remark]: remark,
        [TlUserFriendDef.status]: status,
        [TlUserFriendDef.flag]: 0,
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
 * getInfoById 接口
 * @param {*} companyId
 * @param {*} id 
 * @param {*} fields
 */
const getInfoById = async function({companyId, id}, fields){
    // 参数校验
    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return {}
    }

    if(!id){
        tlConsoleError(TableName, "请求service参数id为空")
        return {}
    }

    const info = await TlUserFirendDao.getInfo({
        [TlUserFriendDef.companyId]: companyId,
        [TlUserFriendDef.id]: id
    }, fields);

    if(info === null){
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
 * getListByUserIdForPage 接口
 * @param {*} companyId
 * @param {*} userId 
 * @param {*} fields
 * @param {*} page
 * @param {*} pageSize
 */
const getListByUserIdForPage = async function({companyId, userId}, fields, page, pageSize){
    // 参数校验
    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return []
    }

    if(!userId){
        tlConsoleError(TableName, "请求service参数userId为空")
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

    const list = await TlUserFirendDao.getListForPage({
        [TlUserFriendDef.companyId]: companyId,
        [TlUserFriendDef.userId]: userId
    }, fields, [
        [TlUserFriendDef.createdAt, 'DESc']
    ], page, pageSize);

    if(list === null){
        return []
    }

    return list
}

/**
 * getListByFriendId 接口
 * @param {*} companyId
 * @param {*} friendId 
 * @param {*} fields
 */
const getListByFriendId = async function({companyId, friendId}, fields){
    // 参数校验
    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return []
    }

    if(!friendId){
        tlConsoleError(TableName, "请求service参数friendId为空")
        return []
    }

    const list = await TlUserFirendDao.getList({
        [TlUserFriendDef.companyId]: companyId,
        [TlUserFriendDef.friendId]: friendId
    }, fields, [
        [TlUserFriendDef.createdAt, 'DESC']
    ]);

    if(list === null){
        return []
    }

    return list
}

/**
 * getListByFriendId 接口
 * @param {*} companyId
 * @param {*} friendId 
 * @param {*} fields
 * @param {*} page
 * @param {*} pageSize
 */
const getListByFriendIdForPage = async function({companyId, friendId}, fields, page, pageSize){
    // 参数校验
    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return []
    }

    if(!friendId){
        tlConsoleError(TableName, "请求service参数friendId为空")
        return []
    }

    const list = await TlUserFirendDao.getList({
        [TlUserFriendDef.companyId]: companyId,
        [TlUserFriendDef.friendId]: friendId
    }, fields, [
        [TlUserFriendDef.createdAt, 'DESC']
    ], page, pageSize);

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
 * getListByUserIdAndFriendIdListForPage 接口
 * @param {*} companyId
 * @param {*} userId 
 * @param {*} friendIdList
 * @param {*} fields
 * @param {*} page
 * @param {*} pageSize
 */
const getListByUserIdAndFriendIdListForPage = async function({companyId, userId, friendIdList}, fields, page, pageSize){
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

    const list = await TlUserFirendDao.getListForPage({
        [TlUserFriendDef.companyId]: companyId,
        [TlUserFriendDef.userId]: userId,
        [TlUserFriendDef.friendId]: friendIdList
    }, fields, [
        [TlUserFriendDef.createdAt, 'DESC']
    ], page, pageSize);

    if(list === null){
        return []
    }

    return list
}

/**
 * getListByUserIdAndStatus 接口
 * @param {*} companyId
 * @param {*} userId 
 * @param {*} status 
 * @param {*} fields
 */
const getListByUserIdAndStatus = async function({companyId, userId, status}, fields){
    // 参数校验
    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return []
    }

    if(!userId){
        tlConsoleError(TableName, "请求service参数userId为空")
        return []
    }

    if(!status){
        tlConsoleError(TableName, "请求service参数status为空")
        return []
    }

    const list = await TlUserFirendDao.getList({
        [TlUserFriendDef.companyId]: companyId,
        [TlUserFriendDef.userId]: userId,
        [TlUserFriendDef.status]: status
    }, fields, [
        [TlUserFriendDef.createdAt, 'DESC']
    ]);

    if(list === null){
        return []
    }

    return list
}

/**
 * getListByUserIdAndStatusForPage 接口
 * @param {*} companyId
 * @param {*} userId 
 * @param {*} status 
 * @param {*} fields
 * @param {*} page
 * @param {*} pageSize
 */
const getListByUserIdAndStatusForPage = async function({companyId, userId, status}, fields, page, pageSize){
    // 参数校验
    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return []
    }

    if(!userId){
        tlConsoleError(TableName, "请求service参数userId为空")
        return []
    }

    if(!status){
        tlConsoleError(TableName, "请求service参数status为空")
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

    const list = await TlUserFirendDao.getListForPage({
        [TlUserFriendDef.companyId]: companyId,
        [TlUserFriendDef.userId]: userId,
        [TlUserFriendDef.status]: status
    }, fields, [
        [TlUserFriendDef.createdAt, 'DESC']
    ], page, pageSize);

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
 * getListByChannelIdForPage 接口
 * @param {*} companyId
 * @param {*} channelId 
 * @param {*} fields
 */
const getListByChannelIdForPage = async function({companyId, channelId}, fields, page, pageSize){
    // 参数校验
    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return []
    }

    if(!channelId){
        tlConsoleError(TableName, "请求service参数userId为空")
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

    const list = await TlUserFirendDao.getListForPage({
        [TlUserFriendDef.companyId]: companyId,
        [TlUserFriendDef.channelId]: channelId,
    }, fields, [
        [TlUserFriendDef.createdAt, 'DESC']
    ], page, pageSize);

    if(list === null){
        return []
    }

    return list
}

/**
 * getListByFriendIdAndStatus 接口
 * @param {*} companyId
 * @param {*} status 
 * @param {*} friendId 
 * @param {*} fields
 */
const getListByFriendIdAndStatus = async function({companyId, friendId, status}, fields){
    // 参数校验
    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return []
    }

    if(!friendId){
        tlConsoleError(TableName, "请求service参数friendId为空")
        return []
    }

    if(!status){
        tlConsoleError(TableName, "请求service参数status为空")
        return []
    }

    const list = await TlUserFirendDao.getList({
        [TlUserFriendDef.companyId]: companyId,
        [TlUserFriendDef.friendId]: friendId,
        [TlUserFriendDef.status]: status
    }, fields, [
        [TlUserFriendDef.createdAt, 'DESC']
    ]);

    if(list === null){
        return []
    }

    return list
}

/**
 * getListByFriendIdAndStatusForpage 接口
 * @param {*} companyId
 * @param {*} status 
 * @param {*} friendId 
 * @param {*} fields
 * @param {*} page
 * @param {*} pageSize
 */
const getListByFriendIdAndStatusForpage = async function({companyId, friendId, status}, fields, page, pageSize){
    // 参数校验
    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return []
    }

    if(!friendId){
        tlConsoleError(TableName, "请求service参数friendId为空")
        return []
    }

    if(!status){
        tlConsoleError(TableName, "请求service参数status为空")
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

    const list = await TlUserFirendDao.getListForPage({
        [TlUserFriendDef.companyId]: companyId,
        [TlUserFriendDef.friendId]: friendId,
        [TlUserFriendDef.status]: status
    }, fields, [
        [TlUserFriendDef.createdAt, 'DESC']
    ], page, pageSize);

    if(list === null){
        return []
    }

    return list
}

/**
 * getListByUserIdAndFriendType 接口
 * @param {*} companyId
 * @param {*} userId
 * @param {*} friendType 
 * @param {*} fields
 */
const getListByUserIdAndFriendType = async function({companyId, userId, friendType}, fields){
    // 参数校验
    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return []
    }

    if(!userId){
        tlConsoleError(TableName, "请求service参数userId为空")
        return []
    }

    if(!friendType){
        tlConsoleError(TableName, "请求service参数friendType为空")
        return []
    }

    const list = await TlUserFirendDao.getList({
        [TlUserFriendDef.companyId]: companyId,
        [TlUserFriendDef.userId]: userId,
        [TlUserFriendDef.friendType]: friendType
    }, fields, [
        [TlUserFriendDef.createdAt, 'DESC']
    ]);

    if(list === null){
        return []
    }

    return list
}

/**
 * getListByUserIdAndFriendTypeForPage 接口
 * @param {*} companyId
 * @param {*} userId
 * @param {*} friendType 
 * @param {*} fields
 * @param {*} page
 * @param {*} pageSize
 */
const getListByUserIdAndFriendTypeForPage = async function({companyId, userId, friendType}, fields, page, pageSize){
    // 参数校验
    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return []
    }

    if(!userId){
        tlConsoleError(TableName, "请求service参数userId为空")
        return []
    }

    if(!friendType){
        tlConsoleError(TableName, "请求service参数friendType为空")
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

    const list = await TlUserFirendDao.getListForPage({
        [TlUserFriendDef.companyId]: companyId,
        [TlUserFriendDef.userId]: userId,
        [TlUserFriendDef.friendType]: friendType
    }, fields, [
        [TlUserFriendDef.createdAt, 'DESC']
    ], page, pageSize);

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
        return {}
    }

    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return {}
    }

    const info = await TlUserFirendDao.deleteInfo({
        [TlUserFriendDef.companyId]: companyId,
        [TlUserFriendDef.id]: id
    });

    if(info === null){
        tlConsoleError(TableName, "请求dao异常")
        return {}
    }

    return info
}

/**
 * deleteInfoByUserId 接口
 * @param {*} companyId
 * @param {*} userId 
 */
const deleteInfoByUserId = async function({companyId, userId}){
    // 参数校验
    if(!userId){
        tlConsoleError(TableName, "请求service参数userId为空")
        return {}
    }

    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return {}
    }

    const info = await TlUserFirendDao.deleteInfo({
        [TlUserFriendDef.companyId]: companyId,
        [TlUserFriendDef.userId]: userId
    });

    if(info === null){
        tlConsoleError(TableName, "请求dao异常")
        return {}
    }

    return info
}

/**
 * deleteInfoByUserIdAndFriendId 接口
 * @param {*} companyId
 * @param {*} userId
 * @param {*} friendId 
 */
const deleteInfoByUserIdAndFriendId = async function({companyId, userId, friendId}){
    // 参数校验
    if(!userId){
        tlConsoleError(TableName, "请求service参数userId为空")
        return {}
    }

    if(!friendId){
        tlConsoleError(TableName, "请求service参数friendId为空")
        return {}
    }

    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return {}
    }

    const info = await TlUserFirendDao.deleteInfo({
        [TlUserFriendDef.companyId]: companyId,
        [TlUserFriendDef.userId]: userId,
        [TlUserFriendDef.friendId]: friendId
    });

    if(info === null){
        tlConsoleError(TableName, "请求dao异常")
        return {}
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
    getInfoById,
    getInfoByUserIdAndFriendId,
    deleteInfoById,
    deleteInfoByUserId,
    deleteInfoByUserIdAndFriendId,
    updateInfoById,
    getInfoByChannelIdAndUserId,

    getListByUserIdAndFriendIdList,
    getListByUserIdAndFriendIdListForPage,
    getListByUserIdAndFriendType,
    getListByUserIdAndFriendTypeForPage,
    getListByUserId,
    getListByUserIdForPage,
    getListByFriendId,
    getListByFriendIdForPage,
    getListByUserIdAndStatus,
    getListByUserIdAndStatusForPage,
    getListByFriendIdAndStatus,
    getListByFriendIdAndStatusForpage,
    getListByChannelId,
    getListByChannelIdForPage
}