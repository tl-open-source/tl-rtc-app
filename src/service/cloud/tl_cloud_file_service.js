const { literal, Op } = require('sequelize');
const { fields } = require('../../tables/tl_cloud_file')
const TlCloudFileDao = require('../../dao/tl_cloud_file_dao')
const TlCloudFileDef = fields.Def
const TlCloudFileType = fields.Type
const TableName = fields.Name
const { tlConsoleError } = require("../../../src/utils/utils");


/**
 * 添加资源文件
 * @param {*} data
 */
const addInfo = async function({
    companyId, type, userId, flag, fileName, fileUrl, fileSize, 
    originFileName, originFileType, fileId, dirId, other
}){
    // 参数校验
    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return {}
    }

    if(!type){
        tlConsoleError(TableName, "请求service参数type为空")
        return {}
    }

    if(Object.values(TlCloudFileType).indexOf(type) === -1){
        tlConsoleError(TableName, "请求service参数type不合法")
        return {}
    }

    if(!userId){
        tlConsoleError(TableName, "请求service参数userId为空")
        return {}
    }

    if(flag === undefined || flag === null){
        tlConsoleError(TableName, "请求service参数flag为空")
        return {}
    }

    if(!fileName){
        tlConsoleError(TableName, "请求service参数fileName为空")
        return {}
    }

    if(!fileUrl){
        tlConsoleError(TableName, "请求service参数fileUrl为空")
        return {}
    }

    if(fileSize === null || fileSize === undefined){
        tlConsoleError(TableName, "请求service参数fileSize为空")
        return {}
    }

    if(!originFileName){
        tlConsoleError(TableName, "请求service参数originFileName为空")
        return {}
    }

    if(!originFileType){
        tlConsoleError(TableName, "请求service参数originFileType为空")
        return {}
    }

    if(!fileId){
        tlConsoleError(TableName, "请求service参数fileId为空")
        return {}
    }

    const info = await TlCloudFileDao.addInfo({
        [TlCloudFileDef.companyId]: companyId,
        [TlCloudFileDef.type]: type,
        [TlCloudFileDef.userId]: userId,
        [TlCloudFileDef.flag]: flag,
        [TlCloudFileDef.originFileName]: originFileName,
        [TlCloudFileDef.originFileType]: originFileType,
        [TlCloudFileDef.fileName]: fileName,
        [TlCloudFileDef.fileUrl]: fileUrl,
        [TlCloudFileDef.fileSize]: fileSize,
        [TlCloudFileDef.fileId]: fileId,
        [TlCloudFileDef.dirId]: dirId,
        [TlCloudFileDef.other]: other
    })

    if(info === null){
        tlConsoleError(TableName, "请求dao异常")
        return {}
    }

    return info
}

/**
 * 删除资源文件
 * @param {*} companyId
 * @param {*} id
 */
const deleteInfoById = async function({companyId, id}){
    // 参数校验
    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return 0
    }

    if(!id){
        tlConsoleError(TableName, "请求service参数id为空")
        return 0
    }

    const info = await TlCloudFileDao.deleteInfo({
        [TlCloudFileDef.companyId]: companyId,
        [TlCloudFileDef.id]: id
    })

    if(info === null){
        tlConsoleError(TableName, "请求dao异常")
        return 0
    }

    return info
}

/**
 * 撤销删除资源文件
 * @param {*} companyId
 * @param {*} id
 */
const restoreInfoById = async function({companyId, id}){
    // 参数校验
    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return {}
    }

    if(!id){
        tlConsoleError(TableName, "请求service参数id为空")
        return {}
    }

    const info = await TlCloudFileDao.restoreInfo({
        [TlCloudFileDef.companyId]: companyId,
        [TlCloudFileDef.id]: id
    })

    if(info === null){
        tlConsoleError(TableName, "请求dao异常")
        return {}
    }

    return info
}

/**
 * 更新资源文件
 * @param {*} companyId
 * @param {*} data
 * @param {*} id
 */
const updateInfoById = async function({companyId, id}, data){
    // 参数校验
    if(Object.keys(data).length === 0){
        tlConsoleError(TableName, "请求service参数为空")
        return {}
    }

    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return {}
    }

    if(!id){
        tlConsoleError(TableName, "请求service参数id为空")
        return {}
    }

    const info = await TlCloudFileDao.updateInfo({
        [TlCloudFileDef.companyId]: companyId,
        [TlCloudFileDef.id]: id
    }, data)

    if(info === null){
        tlConsoleError(TableName, "请求dao异常")
        return {}
    }

    return info
}

/**
 * 获取资源文件
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

    const info = await TlCloudFileDao.getInfo({
        [TlCloudFileDef.companyId]: companyId,
        [TlCloudFileDef.id]: id
    }, fields)

    if(info === null){
        return {}
    }

    return info
}

/**
 * 获取资源文件
 * @param {*} companyId
 * @param {*} id
 * @param {*} fields
 */
const getInfoByIdNoCompanyId = async function({id}, fields){
    // 参数校验
    if(!id){
        tlConsoleError(TableName, "请求service参数id为空")
        return {}
    }

    const info = await TlCloudFileDao.getInfo({
        [TlCloudFileDef.id]: id
    }, fields)

    if(info === null){
        return {}
    }

    return info
}

/**
 * 获取资源文件列表
 * @param {*} companyId
 * @param {*} userId 
 * @param {*} fields 
 * @returns 
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

    const list = await TlCloudFileDao.getList({
        [TlCloudFileDef.companyId]: companyId,
        [TlCloudFileDef.userId]: userId
    }, fields, [
        [TlCloudFileDef.createdAt, 'DESC']
    ])

    if(list === null){
        return []
    }

    return list
}

/**
 * 获取资源文件列表
 * @param {*} companyId
 * @param {*} userId 
 * @param {*} dirId
 * @param {*} fields 
 * @returns 
 */
const getListByUserIdAndDirId = async function({companyId, userId, dirId}, fields){
    // 参数校验
    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return []
    }

    if(!userId){
        tlConsoleError(TableName, "请求service参数userId为空")
        return []
    }

    let query = {
        [TlCloudFileDef.companyId]: companyId,
        [TlCloudFileDef.userId]: userId,
    }

    if(dirId){
        query[TlCloudFileDef.dirId] = dirId
    }

    const list = await TlCloudFileDao.getList(query, fields, [
        [TlCloudFileDef.createdAt, 'DESC']
    ])

    if(list === null){
        return []
    }

    return list
}

/**
 * 获取资源文件列表 - 包括逻辑删除的
 * @param {*} companyId
 * @param {*} userId 
 * @param {*} fields 
 * @returns 
 */
const getListByUserIdDeleted = async function({companyId, userId}, fields){
    // 参数校验
    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return []
    }

    if(!userId){
        tlConsoleError(TableName, "请求service参数userId为空")
        return []
    }

    const list = await TlCloudFileDao.getListDeleted({
        [TlCloudFileDef.companyId]: companyId,
        [TlCloudFileDef.userId]: userId,
        [TlCloudFileDef.deletedAt]: {
            [Op.ne]: null
        }
    }, fields, [
        [TlCloudFileDef.deletedAt, 'DESC']
    ])

    if(list === null){
        return []
    }

    return list
}

/**
 * 获取资源文件列表
 * @param {*} companyId
 * @param {*} userId
 * @param {*} flagBit 
 * @param {*} fields 
 * @returns 
 */
const getListByUserIdAndFlagBit = async function({companyId, userId, flagBit}, fields){
    // 参数校验
    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return []
    }

    if(!userId){
        tlConsoleError(TableName, "请求service参数userId为空")
        return []
    }

    if(flagBit === undefined || flagBit === null){
        tlConsoleError(TableName, "请求service参数flagBit为空")
        return []
    }

    const list = await TlCloudFileDao.getList({
        [TlCloudFileDef.companyId]: companyId,
        [TlCloudFileDef.userId]: userId,
        [TlCloudFileDef.flag]: literal(`${TlCloudFileDef.flag} & ${flagBit} = 1`)
    }, fields, [
        [TlCloudFileDef.updatedAt, 'DESC']
    ])

    if(list === null){
        return []
    }

    return list
}

/**
 * 获取资源文件列表
 * @param {*} companyId
 * @param {*} userId
 * @param {*} flagBit 
 * @param {*} fields 
 * @returns 
 */
const getListByUserIdAndFlagBitAndTypeList = async function({
    companyId, userId, flagBit, typeList
}, fields){
    // 参数校验
    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return []
    }

    if(!userId){
        tlConsoleError(TableName, "请求service参数userId为空")
        return []
    }

    if(flagBit === undefined || flagBit === null){
        tlConsoleError(TableName, "请求service参数flagBit为空")
        return []
    }

    if(!typeList || typeList.length === 0){
        tlConsoleError(TableName, "请求service参数typeList为空")
        return []
    }

    const list = await TlCloudFileDao.getList({
        [TlCloudFileDef.companyId]: companyId,
        [TlCloudFileDef.userId]: userId,
        [TlCloudFileDef.type]: typeList,
        [TlCloudFileDef.flag]: literal(`${TlCloudFileDef.flag} & ${flagBit} = 1`)
    }, fields, [
        [TlCloudFileDef.updatedAt, 'DESC']
    ])

    if(list === null){
        return []
    }

    return list
}

/**
 * 获取资源文件列表
 * @param {*} companyId
 * @param {*} idList 
 * @param {*} fields 
 * @returns 
 */
const getListByIdList = async function({companyId, idList}, fields){
    // 参数校验
    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return []
    }

    if(!idList || idList.length === 0){
        tlConsoleError(TableName, "请求service参数idList为空")
        return []
    }

    const list = await TlCloudFileDao.getList({
        [TlCloudFileDef.companyId]: companyId,
        [TlCloudFileDef.id]: idList
    }, fields, [
        [TlCloudFileDef.createdAt, 'DESC']
    ])

    if(list === null){
        return []
    }

    return list
}

/**
 * 获取资源文件列表 - 包括已删除的
 * @param {*} companyId
 * @param {*} idList 
 * @param {*} fields 
 * @returns 
 */
const getListByIdListWithDeleted = async function({companyId, idList}, fields){
    // 参数校验
    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return []
    }

    if(!idList || idList.length === 0){
        tlConsoleError(TableName, "请求service参数idList为空")
        return []
    }

    const list = await TlCloudFileDao.getList({
        [TlCloudFileDef.companyId]: companyId,
        [TlCloudFileDef.id]: idList,
        [TlCloudFileDef.deletedAt]: {
            [Op.ne]: null
        }
    }, fields, [
        [TlCloudFileDef.createdAt, 'DESC']
    ])

    if(list === null){
        return []
    }

    return list
}

/**
 * 获取资源文件列表
 * @param {*} companyId
 * @param {*} userId
 * @param {*} typeList 
 * @param {*} fields 
 * @returns 
 */
const getListByUserIdAndTypeList = async function({companyId, userId, typeList}, fields){
    // 参数校验
    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return []
    }

    if(!userId){
        tlConsoleError(TableName, "请求service参数userId为空")
        return []
    }

    if(!typeList || typeList.length === 0){
        tlConsoleError(TableName, "请求service参数typeList为空")
        return []
    }

    const list = await TlCloudFileDao.getList({
        [TlCloudFileDef.companyId]: companyId,
        [TlCloudFileDef.userId]: userId,
        [TlCloudFileDef.type]: typeList
    }, fields, [
        [TlCloudFileDef.createdAt, 'DESC']
    ])

    if(list === null){
        return []
    }

    return list
}

/**
 * 获取资源文件列表
 * @param {*} companyId
 * @param {*} userId
 * @param {*} typeList 
 * @param {*} dirId
 * @param {*} fields 
 * @returns 
 */
const getListByUserIdAndTypeListAndDirId = async function({companyId, userId, typeList, dirId}, fields){
    // 参数校验
    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return []
    }

    if(!userId){
        tlConsoleError(TableName, "请求service参数userId为空")
        return []
    }

    if(!typeList || typeList.length === 0){
        tlConsoleError(TableName, "请求service参数typeList为空")
        return []
    }

    let query = {
        [TlCloudFileDef.companyId]: companyId,
        [TlCloudFileDef.userId]: userId,
        [TlCloudFileDef.type]: typeList,
    }

    if(dirId){
        query[TlCloudFileDef.dirId] = dirId
    }

    const list = await TlCloudFileDao.getList(query, fields, [
        [TlCloudFileDef.createdAt, 'DESC']
    ])

    if(list === null){
        return []
    }

    return list
}

/**
 * 获取资源文件列表
 * @param {*} companyId
 * @param {*} userId
 * @param {*} typeList 
 * @param {*} fields 
 * @param {*} page
 * @param {*} pageSize
 * @returns 
 */
const getListByUserIdAndTypeListForPage = async function({companyId, userId, typeList}, fields, page, pageSize){
    // 参数校验
    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return []
    }

    if(!userId){
        tlConsoleError(TableName, "请求service参数userId为空")
        return []
    }

    if(!typeList || typeList.length === 0){
        tlConsoleError(TableName, "请求service参数typeList为空")
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

    const list = await TlCloudFileDao.getListForPage({
        [TlCloudFileDef.companyId]: companyId,
        [TlCloudFileDef.userId]: userId,
        [TlCloudFileDef.type]: typeList
    }, fields, [
        [TlCloudFileDef.createdAt, 'DESC']
    ], page, pageSize)

    if(list === null){
        return []
    }

    return list
}

/**
 * 获取用户上传文件数量
 * @param {*} companyId
 * @param {*} userId 
 * @param {*} dirId
 * @returns 
 */
const getCountByUserIdAndDirId = async function({companyId, userId, dirId}){
    // 参数校验
    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return 0
    }

    if(!userId){
        tlConsoleError(TableName, "请求service参数userId为空")
        return 0
    }

    let query = {
        [TlCloudFileDef.companyId]: companyId,
        [TlCloudFileDef.userId]: userId,
    }

    if(dirId){
        query[TlCloudFileDef.dirId] = dirId
    }

    const count = await TlCloudFileDao.getCount(query)

    if(count === null){
        return 0
    }

    return count
}

/**
 * 获取用户上传文件数量
 * @param {*} companyId
 * @param {*} userId 
 * @returns 
 */
const getCountByUserIdAndTypeList = async function({companyId, userId, typeList}){
    // 参数校验
    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return 0
    }

    if(!userId){
        tlConsoleError(TableName, "请求service参数userId为空")
        return 0
    }

    if(!typeList || typeList.length === 0){
        tlConsoleError(TableName, "请求service参数typeList为空")
        return 0
    }

    const count = await TlCloudFileDao.getCount({
        [TlCloudFileDef.companyId]: companyId,
        [TlCloudFileDef.userId]: userId,
        [TlCloudFileDef.type]: typeList
    })

    if(count === null){
        return 0
    }

    return count
}

/**
 * 获取用户上传文件数量
 * @param {*} companyId
 * @param {*} userId 
 * @param {*} typeList
 * @param {*} dirId
 * @returns 
 */
const getCountByUserIdAndTypeListAndDirId = async function({companyId, userId, typeList, dirId}){
    // 参数校验
    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return 0
    }

    if(!userId){
        tlConsoleError(TableName, "请求service参数userId为空")
        return 0
    }

    if(!typeList || typeList.length === 0){
        tlConsoleError(TableName, "请求service参数typeList为空")
        return 0
    }

    let query = {
        [TlCloudFileDef.companyId]: companyId,
        [TlCloudFileDef.userId]: userId,
        [TlCloudFileDef.type]: typeList,
    }

    if(dirId){
        query[TlCloudFileDef.dirId] = dirId
    }

    const count = await TlCloudFileDao.getCount(query)

    if(count === null){
        return 0
    }

    return count
}

/**
 * 获取用户上传文件数量
 * @param {*} companyId
 * @param {*} userId
 * @param {*} flagBit 
 * @returns 
 */
const getCountByUserIdAndFlagBit = async function({companyId, userId, flagBit}){
    // 参数校验
    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return 0
    }

    if(!userId){
        tlConsoleError(TableName, "请求service参数userId为空")
        return 0
    }

    if(flagBit === undefined || flagBit === null){
        tlConsoleError(TableName, "请求service参数flagBit为空")
        return 0
    }

    const count = await TlCloudFileDao.getCount({
        [TlCloudFileDef.companyId]: companyId,
        [TlCloudFileDef.userId]: userId,
        [TlCloudFileDef.flag]: literal(`${TlCloudFileDef.flag} & ${flagBit} = 1`)
    })

    if(count === null){
        return 0
    }

    return count
}

/**
 * 获取用户上传文件数量
 * @param {*} companyId
 * @param {*} userId
 * @param {*} flagBit 
 * @returns 
 */
const getCountByUserIdAndFlagBitAndTypeList = async function({companyId, userId, flagBit, typeList}){
    // 参数校验
    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return 0
    }

    if(!userId){
        tlConsoleError(TableName, "请求service参数userId为空")
        return 0
    }

    if(flagBit === undefined || flagBit === null){
        tlConsoleError(TableName, "请求service参数flagBit为空")
        return 0
    }

    if(!typeList || typeList.length === 0){
        tlConsoleError(TableName, "请求service参数typeList为空")
        return 0
    }

    const count = await TlCloudFileDao.getCount({
        [TlCloudFileDef.companyId]: companyId,
        [TlCloudFileDef.userId]: userId,
        [TlCloudFileDef.type]: typeList,
        [TlCloudFileDef.flag]: literal(`${TlCloudFileDef.flag} & ${flagBit} = 1`)
    })

    if(count === null){
        return 0
    }

    return count
}


/**
 * 获取用户删除文件数量
 * @param {*} companyId
 * @param {*} userId 
 * @returns 
 */
const getCountByUserIdDeleted = async function({companyId, userId}){
    // 参数校验
    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return 0
    }

    if(!userId){
        tlConsoleError(TableName, "请求service参数userId为空")
        return 0
    }

    const count = await TlCloudFileDao.getCountDeleted({
        [TlCloudFileDef.companyId]: companyId,
        [TlCloudFileDef.userId]: userId,
        [TlCloudFileDef.deletedAt]: {
            [Op.ne]: null
        }
    })

    if(count === null){
        return 0
    }

    return count
}

/**
 * 删除资源文件 - 物理删除
 * @param {*} companyId
 * @param {*} id 
 * @returns 
 */
const deleteInfoForce = async function({companyId, id}){
    // 参数校验
    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return 0
    }

    if(!id){
        tlConsoleError(TableName, "请求service参数id为空")
        return 0
    }

    const info = await TlCloudFileDao.deleteInfoForce({
        [TlCloudFileDef.companyId]: companyId,
        [TlCloudFileDef.id]: id
    })

    if(info === null){
        tlConsoleError(TableName, "请求dao异常")
        return 0
    }

    return info
}

/**
 * 获取资源文件
 * @param {*} companyId
 * @param {*} id 
 * @param {*} fields 
 * @returns 
 */
const getInfoByIdDeleted = async function({companyId, id}, fields){
    // 参数校验
    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return {}
    }

    if(!id){
        tlConsoleError(TableName, "请求service参数id为空")
        return {}
    }

    const info = await TlCloudFileDao.getInfoDeleted({
        [TlCloudFileDef.companyId]: companyId,
        [TlCloudFileDef.id]: id
    }, fields)

    if(info === null){
        return {}
    }

    return info
}


/**
 * 获取资源文件列表
 * @param {*} fields
 * @param {*} page
 * @param {*} pageSize
 * @returns 
 */
const getListForPage = async function({ }, fields, page, pageSize){
    // 参数校验
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

    const list = await TlCloudFileDao.getListForPage({
        [TlCloudFileDef.id]: {
            [Op.gte]: 0
        }
    }, fields, [
        [TlCloudFileDef.createdAt, 'DESC']
    ], page, pageSize)

    if(list === null){
        return []
    }

    return list
}

/**
 * 获取资源文件数量
 * @returns 
 */
const getCount = async function({ }){
    const count = await TlCloudFileDao.getCount({
        [TlCloudFileDef.id]: {
            [Op.gte]: 0
        }
    })

    if(count === null){
        return 0
    }

    return count
}


/**
 * 获取资源文件列表
 * @param {*} keyword
 * @param {*} fields
 * @param {*} page
 * @param {*} pageSize
 * @returns 
 */
const getListByKeywordForPage = async function({ keyword }, fields, page, pageSize){
    // 参数校验
    if(!keyword){
        tlConsoleError(TableName, "请求service参数keyword为空")
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

    const list = await TlCloudFileDao.getListForPage({
        [TlCloudFileDef.originFileName]: {
            [Op.like]: `%${keyword}%`
        }
    }, fields, [
        [TlCloudFileDef.createdAt, 'DESC']
    ], page, pageSize)

    if(list === null){
        return []
    }

    return list
}

/**
 * 获取资源文件数量
 * @param {*} keyword
 * @returns 
 */
const getCountByKeyword = async function({ keyword }){
    // 参数校验
    if(!keyword){
        tlConsoleError(TableName, "请求service参数keyword为空")
        return 0
    }

    const count = await TlCloudFileDao.getCount({
        [TlCloudFileDef.originFileName]: {
            [Op.like]: `%${keyword}%`
        }
    })

    if(count === null){
        return 0
    }

    return count
}


module.exports = {
    addInfo,
    deleteInfoById,
    restoreInfoById,
    deleteInfoForce,
    updateInfoById,
    getInfoById,
    getInfoByIdNoCompanyId,
    getInfoByIdDeleted,
    getCountByUserIdAndFlagBit,
    getCountByUserIdDeleted,
    getCountByUserIdAndTypeList,
    getCountByUserIdAndFlagBitAndTypeList,
    getCountByUserIdAndDirId,
    getCountByUserIdAndTypeListAndDirId,

    getListByIdList,
    getListByUserId,
    getListByUserIdAndTypeList,
    getListByUserIdAndTypeListForPage,
    getListByUserIdAndFlagBit,
    getListByUserIdDeleted,
    getListByUserIdAndFlagBitAndTypeList,
    getListByUserIdAndDirId,
    getListByUserIdAndTypeListAndDirId,
    getListByIdListWithDeleted,

    getListForPage,
    getCount,
    getListByKeywordForPage,
    getCountByKeyword
}