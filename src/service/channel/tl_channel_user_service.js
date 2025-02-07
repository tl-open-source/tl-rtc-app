const { fields } = require('../../tables/tl_channel_user')
const TlChannelUserDao = require('../../dao/tl_channel_user_dao')
const TlChannelUserDef = fields.Def
const TlChannelUserType = fields.Type
const TlChannelUserStatus = fields.Status
const TableName = fields.Name
const TableFields = Object.keys(fields.Def).map(key => fields.Def[key])
const { tlConsoleError, tlConsole } = require("../../../src/utils/utils");


/**
 * addInfo 接口
 * @param {*} data 
 */
const addInfo = async function({
    companyId, channelId, userId, type, roleId,
}){
    // 参数校验
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

    if(!type){
        tlConsoleError(TableName, "请求service参数type为空")
        return {}
    }

    if(![
        TlChannelUserType.FRIEND,
        TlChannelUserType.GROUP,
    ].includes(type)){
        tlConsoleError(TableName, "请求service参数type不合法")
        return {}
    }

    if(!roleId){
        tlConsoleError(TableName, "请求service参数roleId为空")
        return {}
    }

    const info = await TlChannelUserDao.addInfo({
        [TlChannelUserDef.companyId]: companyId,
        [TlChannelUserDef.channelId]: channelId,
        [TlChannelUserDef.type]: type,
        [TlChannelUserDef.flag]: 0,
        [TlChannelUserDef.userId]: userId,
        [TlChannelUserDef.roleId]: roleId,
        [TlChannelUserDef.status]: TlChannelUserStatus.NORMAL,
    })

    if(info == null){
        tlConsoleError(TableName, "请求dao异常")
        return {}
    }

    return info
}

/**
 * addInfoList 接口
 * @param {*} data 
 */
const addInfoList = async function({
    companyId, channelId, userInfoList,
}){
    // 参数校验
    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return {}
    }

    if(!channelId){
        tlConsoleError(TableName, "请求service参数channelId为空")
        return {}
    }

    if(!userInfoList){
        tlConsoleError(TableName, "请求service参数channelId为空")
        return {}
    }

    for(let i = 0; i < userInfoList.length; i++){
        const userInfo = userInfoList[i]
        const { userId, type, roleId } = userInfo;
        if(!userId){
            tlConsoleError(TableName, "请求service参数userId为空")
            return {}
        }
    
        if(!type){
            tlConsoleError(TableName, "请求service参数type为空")
            return {}
        }

        if(![
            TlChannelUserType.FRIEND,
            TlChannelUserType.GROUP,
        ].includes(type)){
            tlConsoleError(TableName, "请求service参数type不合法")
            return {}
        }
    
        if(!roleId){
            tlConsoleError(TableName, "请求service参数roleId为空")
            return {}
        }
    }

    let dataList = []
    for(let i = 0; i < userInfoList.length; i++){
        const userInfo = userInfoList[i]
        const { userId, type, roleId } = userInfo;
        dataList.push({
            [TlChannelUserDef.companyId]: companyId,
            [TlChannelUserDef.channelId]: channelId,
            [TlChannelUserDef.type]: type,
            [TlChannelUserDef.flag]: 0,
            [TlChannelUserDef.userId]: userId,
            [TlChannelUserDef.roleId]: roleId,
            [TlChannelUserDef.status]: TlChannelUserStatus.NORMAL,
        })
    }

    const list = await TlChannelUserDao.addList(dataList)

    if(list == null){
        tlConsoleError(TableName, "请求dao异常")
        return {}
    }

    return list
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

    const info = await TlChannelUserDao.getInfo({
        [TlChannelUserDef.companyId]: companyId,
        [TlChannelUserDef.id]: id
    }, fields)

    if(info == null) {
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

    const infoList = await TlChannelUserDao.getList({
        [TlChannelUserDef.companyId]: companyId,
        [TlChannelUserDef.channelId]: channelId
    }, fields, [
        [TlChannelUserDef.createdAt, "DESC"]
    ])

    if(infoList == null) {
        return []
    }

    return infoList
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

    const infoList = await TlChannelUserDao.getListForPage({
        [TlChannelUserDef.companyId]: companyId,
        [TlChannelUserDef.channelId]: channelId
    }, fields, [
        [TlChannelUserDef.createdAt, "DESC"]
    ], page, pageSize)

    if(infoList == null) {
        return []
    }

    return infoList
}

/**
 * getListByUserId 接口
 * @param {*} companyId
 * @param {*} userId 
 * @param {*} fields
 */
const getListByUserId = async function({companyId, userId}, fields){
    if(!userId){
        tlConsoleError(TableName, "请求service参数userId为空")
        return []
    }

    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return []
    }

    const infoList = await TlChannelUserDao.getList({
        [TlChannelUserDef.companyId]: companyId,
        [TlChannelUserDef.userId]: userId
    }, fields, [
        [TlChannelUserDef.createdAt, "DESC"]
    ])

    if(infoList == null) {
        return []
    }

    return infoList
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
    if(!userId){
        tlConsoleError(TableName, "请求service参数userId为空")
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

    const infoList = await TlChannelUserDao.getListForPage({
        [TlChannelUserDef.companyId]: companyId,
        [TlChannelUserDef.userId]: userId
    }, fields, [
        [TlChannelUserDef.createdAt, "DESC"]
    ], page, pageSize)

    if(infoList == null) {
        return []
    }

    return infoList
}

/**
 * getListByTypeUserIdList 接口
 * @param {*} companyId
 * @param {*} type
 * @param {*} userIdList
 * @param {*} fields
 */
const getListByTypeUserIdList = async function({companyId, type, userIdList}, fields){
    if(!userIdList){
        tlConsoleError(TableName, "请求service参数userIdList为空")
        return []
    }

    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return []
    }

    if(!type){
        tlConsoleError(TableName, "请求service参数type为空")
        return []
    }

    const infoList = await TlChannelUserDao.getList({
        [TlChannelUserDef.companyId]: companyId,
        [TlChannelUserDef.type]: type,
        [TlChannelUserDef.userId]: userIdList
    }, fields, [
        [TlChannelUserDef.createdAt, "DESC"]
    ])

    if(infoList == null) {
        return []
    }

    return infoList
}

/**
 * getListByTypeUserIdListForPage 接口
 * @param {*} companyId
 * @param {*} type
 * @param {*} userIdList
 * @param {*} fields
 * @param {*} page
 * @param {*} pageSize
 */
const getListByTypeUserIdListForPage = async function({companyId, type, userIdList}, fields, page, pageSize){
    if(!userIdList){
        tlConsoleError(TableName, "请求service参数userIdList为空")
        return []
    }

    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return []
    }

    if(!type){
        tlConsoleError(TableName, "请求service参数type为空")
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

    const infoList = await TlChannelUserDao.getListForPage({
        [TlChannelUserDef.companyId]: companyId,
        [TlChannelUserDef.type]: type,
        [TlChannelUserDef.userId]: userIdList
    }, fields, [
        [TlChannelUserDef.createdAt, "DESC"]
    ], page, pageSize)

    if(infoList == null) {
        return []
    }

    return infoList
}

/**
 * getListByTypeUserId 接口
 * @param {*} companyId
 * @param {*} type
 * @param {*} userId
 * @param {*} fields
 */
const getListByTypeUserId = async function({companyId, type, userId}, fields){
    if(!userId){
        tlConsoleError(TableName, "请求service参数userId为空")
        return []
    }

    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return []
    }

    if(!type){
        tlConsoleError(TableName, "请求service参数type为空")
        return []
    }

    const infoList = await TlChannelUserDao.getList({
        [TlChannelUserDef.companyId]: companyId,
        [TlChannelUserDef.type]: type,
        [TlChannelUserDef.userId]: userId
    }, fields, [
        [TlChannelUserDef.createdAt, "DESC"]
    ])

    if(infoList == null) {
        return []
    }

    return infoList
}

/**
 * getListByTypeUserIdForPage 接口
 * @param {*} companyId
 * @param {*} type
 * @param {*} userId
 * @param {*} fields
 * @param {*} page
 * @param {*} pageSize
 */
const getListByTypeUserIdForPage = async function({companyId, type, userId}, fields, page, pageSize){
    if(!userId){
        tlConsoleError(TableName, "请求service参数userId为空")
        return []
    }

    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return []
    }

    if(!type){
        tlConsoleError(TableName, "请求service参数type为空")
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

    const infoList = await TlChannelUserDao.getListForPage({
        [TlChannelUserDef.companyId]: companyId,
        [TlChannelUserDef.type]: type,
        [TlChannelUserDef.userId]: userId
    }, fields, [
        [TlChannelUserDef.createdAt, "DESC"]
    ], page, pageSize)

    if(infoList == null) {
        return []
    }

    return infoList
}

/**
 * getListByChannelUserIdList 接口
 * @param {*} companyId
 * @param {*} channelId
 * @param {*} userIdList 
 * @param {*} fields
 */
const getListByChannelUserIdList = async function({companyId, channelId, userIdList}, fields){
    if(!userIdList){
        tlConsoleError(TableName, "请求service参数userIdList为空")
        return []
    }

    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return []
    }

    if(!channelId){
        tlConsoleError(TableName, "请求service参数channelId为空")
        return []
    }

    const infoList = await TlChannelUserDao.getList({
        [TlChannelUserDef.companyId]: companyId,
        [TlChannelUserDef.channelId]: channelId,
        [TlChannelUserDef.userId]: userIdList
    }, fields, [
        [TlChannelUserDef.createdAt, "DESC"]
    ])

    if(infoList == null) {
        return []
    }

    return infoList
}

/**
 * getListByChannelUserIdListForPage 接口
 * @param {*} companyId
 * @param {*} channelId
 * @param {*} userIdList 
 * @param {*} fields
 * @param {*} page
 * @param {*} pageSize
 */
const getListByChannelUserIdListForPage = async function({companyId, channelId, userIdList}, fields, page, pageSize){
    if(!userIdList){
        tlConsoleError(TableName, "请求service参数userIdList为空")
        return []
    }

    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return []
    }

    if(!channelId){
        tlConsoleError(TableName, "请求service参数channelId为空")
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

    const infoList = await TlChannelUserDao.getListForPage({
        [TlChannelUserDef.companyId]: companyId,
        [TlChannelUserDef.channelId]: channelId,
        [TlChannelUserDef.userId]: userIdList
    }, fields, [
        [TlChannelUserDef.createdAt, "DESC"]
    ], page, pageSize)

    if(infoList == null) {
        return []
    }

    return infoList
}

/**
 * getListByTypeChannelIdList 接口
 * @param {*} companyId
 * @param {*} type
 * @param {*} channelIdList
 * @param {*} fields
 */
const getListByTypeChannelIdList = async function({companyId, type, channelIdList}, fields){
    if(!channelIdList){
        tlConsoleError(TableName, "请求service参数channelIdList为空")
        return []
    }

    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return []
    }

    if(!type){
        tlConsoleError(TableName, "请求service参数type为空")
        return []
    }

    const infoList = await TlChannelUserDao.getList({
        [TlChannelUserDef.companyId]: companyId,
        [TlChannelUserDef.type]: type,
        [TlChannelUserDef.channelId]: channelIdList
    }, fields, [
        [TlChannelUserDef.createdAt, "DESC"]
    ])

    if(infoList == null) {
        return []
    }

    return infoList
}

/**
 * getListByTypeChannelIdListForPage 接口
 * @param {*} companyId
 * @param {*} type
 * @param {*} channelIdList
 * @param {*} fields
 */
const getListByTypeChannelIdListForPage = async function({companyId, type, channelIdList}, fields, page, pageSize){
    if(!channelIdList){
        tlConsoleError(TableName, "请求service参数channelIdList为空")
        return []
    }

    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return []
    }

    if(!type){
        tlConsoleError(TableName, "请求service参数type为空")
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

    const infoList = await TlChannelUserDao.getListForPage({
        [TlChannelUserDef.companyId]: companyId,
        [TlChannelUserDef.type]: type,
        [TlChannelUserDef.channelId]: channelIdList
    }, fields, [
        [TlChannelUserDef.createdAt, "DESC"]
    ], page, pageSize)

    if(infoList == null) {
        return []
    }

    return infoList
}

/**
 * updateInfoById 接口
 * @param {*} companyId
 * @param {*} id
 * @param {*} data 
 */
const updateInfoById = async function({companyId, id}, data){
    if(!id){
        tlConsoleError(TableName, "请求service参数id为空")
        return {}
    }

    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return {}
    }

    if(Object.keys(data).length === 0){
        tlConsoleError(TableName, "请求service参数data为空")
        return {}
    }

    const info = await TlChannelUserDao.updateInfo({
        [TlChannelUserDef.companyId]: companyId,
        [TlChannelUserDef.id]: id
    }, data)

    if(info == null) {
        tlConsoleError(TableName, "请求dao异常")
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
        return {}
    }

    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return {}
    }

    const info = await TlChannelUserDao.deleteInfo({
        [TlChannelUserDef.companyId]: companyId,
        [TlChannelUserDef.id]: id
    })

    if(info == null) {
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

    const count = await TlChannelUserDao.getCount({
        [TlChannelUserDef.companyId]: companyId,
        [TlChannelUserDef.channelId]: channelId
    })

    if(count == null) {
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

    const counts = await TlChannelUserDao.getGroupCount({
        [TlChannelUserDef.companyId]: companyId,
        [TlChannelUserDef.channelId]: channelIdList
    }, TlChannelUserDef.channelId)

    if(counts == null) {
        return {}
    }

    return counts
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

    const infoList = await TlChannelUserDao.getList({
        [TlChannelUserDef.companyId]: companyId,
        [TlChannelUserDef.channelId]: channelIdList
    }, fields, [
        [TlChannelUserDef.createdAt, "DESC"]
    ])

    if(infoList == null) {
        return []
    }

    return infoList
}

/**
 * getListByChannelIdListForPage 接口
 * @param {*} companyId
 * @param {*} channelIdList
 * @param {*} fields
 * @param {*} page
 * @param {*} pageSize
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

    const infoList = await TlChannelUserDao.getListForPage({
        [TlChannelUserDef.companyId]: companyId,
        [TlChannelUserDef.channelId]: channelIdList
    }, fields, [
        [TlChannelUserDef.createdAt, "DESC"]
    ], page, pageSize)

    if(infoList == null) {
        return []
    }

    return infoList
}

/**
 * getInfoByChannelIdAndUserId 接口
 * @param {*} companyId 
 * @param {*} channelId
 * @param {*} userId
 * @returns 
 */
const getInfoByChannelIdAndUserId = async function({companyId, channelId, userId}){
    if(!channelId){
        tlConsoleError(TableName, "请求service参数channelId为空")
        return {}
    }

    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return {}
    }

    if(!userId){
        tlConsoleError(TableName, "请求service参数userId为空")
        return {}
    }

    const info = await TlChannelUserDao.getInfo({
        [TlChannelUserDef.companyId]: companyId,
        [TlChannelUserDef.channelId]: channelId,
        [TlChannelUserDef.userId]: userId
    })

    if(info == null) {
        return {}
    }

    return info
}




module.exports = {
    addInfo, 
    addInfoList, 
    updateInfoById, 
    deleteInfoById,
    getInfoById, 
    getInfoByChannelIdAndUserId, 
    getCountByChannelId,
    getCountByChannelIdList, 

    getListByChannelId, 
    getListByChannelIdForPage, 
    getListByUserId, 
    getListByUserIdForPage,
    getListByChannelUserIdList, 
    getListByChannelUserIdListForPage, 
    getListByChannelIdList,
    getListByChannelIdListForPage,
    getListByTypeUserIdList, 
    getListByTypeUserIdListForPage,
    getListByTypeUserId, 
    getListByTypeUserIdForPage, 
    getListByTypeChannelIdList,
    getListByTypeChannelIdListForPage,
}