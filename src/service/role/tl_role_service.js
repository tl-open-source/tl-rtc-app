const { fields } = require('../../tables/tl_role')
const TlRoleDao = require('../../dao/tl_role_dao')
const TlRoleDef = fields.Def
const TlRoleType = fields.Type
const TableName = fields.Name
const { tlConsoleError } = require("../../../src/utils/utils");


/**
 * 添加角色
 * @param {*} data
 */
const addInfo = async function({
    companyId, name, key, permissionIdList, description, flag, type
}){
    // 参数校验
    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return {}
    }

    if(!key){
        tlConsoleError(TableName, "请求service参数key为空")
        return {}
    }

    if(!name){
        tlConsoleError(TableName, "请求service参数name为空")
        return {}
    }

    if(!permissionIdList){
        tlConsoleError(TableName, "请求service参数permissionIdList为空")
        return {}
    }

    if(!description){
        tlConsoleError(TableName, "请求service参数description为空")
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
        TlRoleType.ADMIN_USER,
        TlRoleType.NORMAL_USER,
        TlRoleType.CHANNEL_NORMAL_USER,
        TlRoleType.CHANNEL_ADMIN_USER,
        TlRoleType.CHANNEL_CREATOR_USER,
    ].includes(type)){
        tlConsoleError(TableName, "请求service参数type不合法")
        return {}
    }

    const exist = await TlRoleDao.getInfo({
        [TlRoleDef.companyId]: companyId,
        [TlRoleDef.type]: type,
        [TlRoleDef.name]: name
    })

    if(exist !== null){
        tlConsoleError(TableName, type + ' 类型下' + "角色名称已存在")
        return {}
    }

    const info = await TlRoleDao.addInfo({
        [TlRoleDef.companyId]: companyId,
        [TlRoleDef.name]: name,
        [TlRoleDef.type]: type,
        [TlRoleDef.permissionIdList]: permissionIdList,
        [TlRoleDef.key]: key,
        [TlRoleDef.description]: description,
        [TlRoleDef.flag]: flag
    })

    if(info === null){
        tlConsoleError(TableName, "请求dao异常")
        return {}
    }

    return info
}

/**
 * 删除角色
 * @param {*} id
 * @param {*} companyId
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

    const info = await TlRoleDao.deleteInfo({
        [TlRoleDef.companyId]: companyId,
        [TlRoleDef.id]: id
    })

    if(info === null){
        tlConsoleError(TableName, "请求dao异常")
        return 0
    }

    return info
}

/**
 * 更新角色
 * @param {*} data
 * @param {*} companyId
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

    const info = await TlRoleDao.updateInfo({
        [TlRoleDef.companyId]: companyId,
        [TlRoleDef.id]: id
    }, data)

    if(info === null){
        tlConsoleError(TableName, "请求dao异常")
        return {}
    }

    return info
}

/**
 * 获取角色列表
 * @param {*} companyId
 * @param {*} fields
 */
const getList = async function({companyId}, fields){
    // 参数校验
    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return []
    }

    const infoList = await TlRoleDao.getList({
        [TlRoleDef.companyId]: companyId
    }, fields, [
        [TlRoleDef.createdAt, "DESC"]
    ])

    if(infoList === null){
        return []
    }

    return infoList
}

/**
 * 获取角色列表
 * @param {*} companyId
 * @param {*} fields
 * @param {*} page
 * @param {*} pageSize
 */
const getListForPage = async function({companyId}, fields, page, pageSize){
    // 参数校验
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

    const infoList = await TlRoleDao.getListForPage({
        [TlRoleDef.companyId]: companyId
    }, fields, [
        [TlRoleDef.createdAt, "DESC"]
    ], page, pageSize)

    if(infoList === null){
        return []
    }

    return infoList
}

/**
 * 获取角色信息
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

    const info = await TlRoleDao.getInfo({
        [TlRoleDef.companyId]: companyId,
        [TlRoleDef.id]: id
    }, fields)

    if(info === null){
        return {}
    }

    return info
}

/**
 * 通过名称获取角色信息
 * @param {*} companyId
 * @param {*} name
 * @param {*} fields
 */
const getListByName = async function({companyId, name}, fields){
    // 参数校验
    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return []
    }

    if(!name){
        tlConsoleError(TableName, "请求service参数name为空")
        return []
    }

    const list = await TlRoleDao.getList({
        [TlRoleDef.companyId]: companyId,
        [TlRoleDef.name]: name
    }, fields)

    if(list === null){
        return []
    }

    return list
}


/**
 * 获取角色信息
 * @param {*} companyId
 * @param {*} name
 * @param {*} fields
 */
const getInfoByTypeAndName = async function({companyId, type, name}, fields){
    // 参数校验
    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return {}
    }

    if(!name){
        tlConsoleError(TableName, "请求service参数name为空")
        return {}
    }

    if(!type){
        tlConsoleError(TableName, "请求service参数type为空")
        return {}
    }

    const info = await TlRoleDao.getInfo({
        [TlRoleDef.companyId]: companyId,
        [TlRoleDef.name]: name,
        [TlRoleDef.type]: type
    }, fields)

    if(info === null){
        return {}
    }

    return info
}

module.exports = {
    addInfo,
    deleteInfoById,
    updateInfoById,
    getInfoById,
    getInfoByTypeAndName,

    getList,
    getListForPage,
    getListByName,
}