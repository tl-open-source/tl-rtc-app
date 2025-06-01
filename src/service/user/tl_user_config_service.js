const { fields } = require('../../tables/tl_user_config')
const TlUserConfigDao = require('../../dao/tl_user_config_dao')
const TlUserConfigDef = fields.Def
const TableName = fields.Name
const { tlConsoleError } = require("../../../src/utils/utils");


/**
 * 添加用户配置
 * @param {*} data
 */
const addInfo = async function({
    companyId, userId, normal, account, message, skin, authority, other,
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

    if(!normal){
        tlConsoleError(TableName, "请求service参数normal为空")
        return {}
    }

    if(!account){
        tlConsoleError(TableName, "请求service参数account为空")
        return {}
    }

    if(!message){
        tlConsoleError(TableName, "请求service参数message为空")
        return {}
    }

    if(!skin){
        tlConsoleError(TableName, "请求service参数skin为空")
        return {}
    }

    if(!authority){
        tlConsoleError(TableName, "请求service参数authority为空")
        return {}
    }

    if(!other){
        tlConsoleError(TableName, "请求service参数other为空")
        return {}
    }

    const exist = await TlUserConfigDao.getInfo({
        [TlUserConfigDef.companyId]: companyId,
        [TlUserConfigDef.userId]: userId
    })

    if(exist !== null){
        tlConsoleError(TableName, "用户配置已存在")
        return {}
    }

    const info = await TlUserConfigDao.addInfo({
        [TlUserConfigDef.companyId]: companyId,
        [TlUserConfigDef.userId]: userId,
        [TlUserConfigDef.normal]: normal,
        [TlUserConfigDef.account]: account,
        [TlUserConfigDef.message]: message,
        [TlUserConfigDef.skin]: skin,
        [TlUserConfigDef.authority]: authority,
        [TlUserConfigDef.other]: other
    })

    if(info === null){
        tlConsoleError(TableName, "请求dao异常")
        return {}
    }

    return info
}

/**
 * 添加默认用户配置
 * @param {*} companyId
 * @param {*} userId
 */
const addDefaultInfo = async function({companyId, userId}){
    return await addInfo({
        companyId: companyId,
        userId: userId,
        normal: JSON.stringify({
            sidebarChannelOpen: true,
            sidebarContactOpen: true,
            sidebarSettingOpen: true,
            homePage: 'channel',
        }),
        account: JSON.stringify({
            notAcceptFriendApply: false,
            autoPassFriendApply: false,
            notAllowSearchAccount: true,
            fileSaveToServer: true,
        }),
        message: JSON.stringify({
            webNotify: false,
            messageDot: true,
        }),
        skin: JSON.stringify({
            global: 'light',
        }),
        authority: JSON.stringify({
            
        }),
        other: JSON.stringify({
            // 我的文件视图模式
            cloudSelfViewMode: 'list',
            // 我的收藏视图模式
            cloudCollectionViewMode: 'list',
            // 我的回收小站视图模式
            cloudRecycleViewMode: 'list',
            // 群聊文件视图模式
            cloudGroupViewMode: 'list',
            // 自定义wss
            customWss: '',
        })
    })
}

/**
 * 更新用户配置
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

    const info = await TlUserConfigDao.updateInfo({
        [TlUserConfigDef.companyId]: companyId,
        [TlUserConfigDef.id]: id
    }, data)

    if(info === null){
        tlConsoleError(TableName, "请求dao异常")
        return {}
    }

    return info
}

/**
 * 获取用户配置信息
 * @param {*} companyId
 * @param {*} userId
 * @param {*} fields
 */
const getInfoByUserId = async function({companyId, userId}, fields){
    // 参数校验
    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return {}
    }

    if(!userId){
        tlConsoleError(TableName, "请求service参数userId为空")
        return {}
    }

    const info = await TlUserConfigDao.getInfo({
        [TlUserConfigDef.companyId]: companyId,
        [TlUserConfigDef.userId]: userId
    }, fields)

    if(info === null){
        return {}
    }

    return info
}


module.exports = {
    addInfo,
    updateInfoById,
    getInfoByUserId,
    addDefaultInfo,
}