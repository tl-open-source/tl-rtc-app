const { fields } = require('../../tables/tl_user')
const TlUserDao = require('../../dao/tl_user_dao')
const TlUserDef = fields.Def
const TableName = fields.Name
const TableFields = Object.keys(fields.Def).map(key => fields.Def[key])
const { tlConsoleError, tlConsole } = require("../../../src/utils/utils");
const { get } = require('request')

/**
 * addInfo 接口
 * @param {*} data 
 */
const addInfo = async function({
    companyId, name, password, roleId, salt, mobile, email, avatarUrl,
    wchatName, wchatOpenId, wchatUnionId, wchatAvatarUrl, flag,
}){
    // 参数校验
    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return {}
    }

    if(!name){
        tlConsoleError(TableName, "请求service参数name为空")
        return {}
    }

    if(!password){
        tlConsoleError(TableName, "请求service参数password为空")
        return {}
    }

    if(!roleId){
        tlConsoleError(TableName, "请求service参数roleId为空")
        return {}
    }

    if(!salt){
        tlConsoleError(TableName, "请求service参数salt为空")
        return {}
    }

    if(!mobile){
        mobile = ""
    }

    if(!email){
        email = ""
    }

    if(!avatarUrl){
        avatarUrl = ""
    }

    if(!wchatName){
        wchatName = ""
    }

    if(!wchatOpenId){
        wchatOpenId = ""
    }

    if(!wchatUnionId){
        wchatUnionId = ""
    }

    if(!wchatAvatarUrl){
        wchatAvatarUrl = ""
    }

    if(!flag){
        flag = 0
    }

    const info = await TlUserDao.addInfo({
        [TlUserDef.companyId]: companyId,
        [TlUserDef.name]: name,
        [TlUserDef.password]: password,
        [TlUserDef.roleId]: roleId,
        [TlUserDef.salt]: salt,
        [TlUserDef.mobile]: mobile,
        [TlUserDef.email]: email,
        [TlUserDef.avatarUrl]: avatarUrl,
        [TlUserDef.wchatName]: wchatName,
        [TlUserDef.wchatOpenId]: wchatOpenId,
        [TlUserDef.wchatUnionId]: wchatUnionId,
        [TlUserDef.wchatAvatarUrl]: wchatAvatarUrl,
        [TlUserDef.flag]: flag,
    })

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
 * @returns
 */
const getInfoById = async function({companyId, id}, fields){
    // 参数校验
    if(!id){
        tlConsoleError(TableName, "请求service参数id为空")
        return {}
    }
    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return {}
    }

    const info = await TlUserDao.getInfo({
        [TlUserDef.companyId]: companyId,
        [TlUserDef.id]: id
    }, fields)

    if(info === null){
        return {}
    }

    return info
}

/**
 * getInfoByName 接口
 * @param {*} name
 * @param {*} companyId
 * @param {*} fields
 * @returns
 */
const getInfoByName = async function({companyId, name}, fields){
    // 参数校验
    if(!name){
        tlConsoleError(TableName, "请求service参数name为空")
        return {}
    }
    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return {}
    }

    const info = await TlUserDao.getInfo({
        [TlUserDef.companyId]: companyId,
        [TlUserDef.name]: name
    }, fields)

    if(info === null){
        return {}
    }

    return info
}

/**
 * getInfoByNameForLogin 接口
 * @param {*} name
 * @param {*} fields
 * @returns
 */
const getInfoByNameForLogin = async function({name}, fields){
    // 参数校验
    if(!name){
        tlConsoleError(TableName, "请求service参数name为空")
        return {}
    }

    const info = await TlUserDao.getInfo({
        [TlUserDef.name]: name
    }, fields)

    if(info === null){
        return {}
    }

    return info
}

/**
 * getInfoByMobile 接口
 * @param {*} mobile
 * @param {*} companyId
 * @param {*} fields
 * @returns
 */
const getInfoByMobile = async function({companyId, mobile}, fields){
    // 参数校验
    if(!mobile){
        tlConsoleError(TableName, "请求service参数mobile为空")
        return {}
    }

    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return {}
    }

    const info = await TlUserDao.getInfo({
        [TlUserDef.companyId]: companyId,
        [TlUserDef.mobile]: mobile
    }, fields)

    if(info === null){
        return {}
    }

    return info
}

/**
 * getInfoByMobileForLogin 接口
 * @param {*} mobile
 * @param {*} fields
 * @returns
 */
const getInfoByMobileForLogin = async function({mobile}, fields){
    // 参数校验
    if(!mobile){
        tlConsoleError(TableName, "请求service参数mobile为空")
        return {}
    }

    const info = await TlUserDao.getInfo({
        [TlUserDef.mobile]: mobile
    }, fields)

    if(info === null){
        return {}
    }

    return info
}

/**
 * getInfoByEmail 接口
 * @param {*} email
 * @param {*} companyId
 * @param {*} fields
 * @returns
 */
const getInfoByEmail = async function({companyId, email}, fields){
    // 参数校验
    if(!email){
        tlConsoleError(TableName, "请求service参数email为空")
        return {}
    }

    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return {}
    }

    const info = await TlUserDao.getInfo({
        [TlUserDef.companyId]: companyId,
        [TlUserDef.email]: email
    }, fields)

    if(info === null){
        return {}
    }

    return info
}

/**
 * getInfoByEmailForLogin 接口
 * @param {*} email
 * @param {*} fields
 * @returns
 */
const getInfoByEmailForLogin = async function({email}, fields){
    // 参数校验
    if(!email){
        tlConsoleError(TableName, "请求service参数email为空")
        return {}
    }

    const info = await TlUserDao.getInfo({
        [TlUserDef.email]: email
    }, fields)

    if(info === null){
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
    if(Object.keys(data).length === 0){
        tlConsoleError(TableName, "请求service参数为空")
        return {}
    }

    // 参数校验
    if(!id){
        tlConsoleError(TableName, "请求service参数id为空")
        return {}
    }

    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return {}
    }

    const info = await TlUserDao.updateInfo({
        [TlUserDef.companyId]: companyId,
        [TlUserDef.id]: id
    }, data)

    if(info === null){
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
    // 参数校验
    if(!id){
        tlConsoleError(TableName, "请求service参数id为空")
        return {}
    }

    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return {}
    }

    const info = await TlUserDao.deleteInfo({
        [TlUserDef.companyId]: companyId,
        [TlUserDef.id]: id
    })

    if(info === null){
        tlConsoleError(TableName, "请求dao异常")
        return {}
    }

    return info
}

/**
 * getListByIdList 接口
 * @param {*} companyId
 * @param {*} idList
 * @param {*} fields
 */
const getListByIdList = async function({companyId, idList}, fields){    
    // 参数校验
    if(!idList){
        tlConsoleError(TableName, "请求service参数idList为空")
        return []
    }

    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return []
    }

    const list = await TlUserDao.getList({
        [TlUserDef.companyId]: companyId,
        [TlUserDef.id]: idList
    }, fields, [
        [TlUserDef.createdAt, "DESC"]
    ])

    if(list === null){
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
    // 参数校验
    if(!idList){
        tlConsoleError(TableName, "请求service参数idList为空")
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

    const list = await TlUserDao.getListForPage({
        [TlUserDef.companyId]: companyId,
        [TlUserDef.id]: idList
    }, fields, [
        [TlUserDef.createdAt, "DESC"]
    ], page, pageSize)

    if(list === null){
        return []
    }
    
    return list
}



module.exports = {
    addInfo, 
    updateInfoById, 
    deleteInfoById,
    getInfoByName, 
    getInfoById, 
    getInfoByMobile, 
    getInfoByEmail,
    getInfoByNameForLogin, 
    getInfoByMobileForLogin, 
    getInfoByEmailForLogin,

    getListByIdList, 
    getListByIdListForPage
}