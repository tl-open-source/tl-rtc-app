const { fields } = require('../../tables/tl_user_config')
const TlUserConfigDao = require('../../dao/tl_user_config_dao')
const TlUserConfigDef = fields.Def
const TableName = fields.Name
const TableFields = Object.keys(fields.Def).map(key => fields.Def[key])
const { tlConsoleError, tlConsole } = require("../../../src/utils/utils");


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
            windowSizeDefault: false,
            windowSizeFull: false,
            fontSize: '小',
            sidebarChannelOpen: true,
            sidebarContactOpen: true,
            sidebarCloudOpen: true,
            sidebarSettingOpen: true,
            sidebarMeetingOpen: true,
            sidebarP2pChannelOpen: true,
            sidebarCutPasteOpen: true,
            sidebarDatesOpen: true,
            sidebarDocumentOpen: true,
            homePage: 'channel',
        }),
        account: JSON.stringify({
            allowLoginMore: false,
            loginRemoteNotify: false,
            notAcceptFriendApply: false,
            autoPassFriendApply: false,
            fileSaveToServer: true,
            fileSaveToAlyOss: false,
            fileSaveToTxOss: true,
        }),
        message: JSON.stringify({
            webNotify: false,
            messageDot: true,
            friendMessageSound: false,
            friendMessageVibrate: false,
            friendMessagePreview: false,
            friendCallSound: false,
            friendCallVibrate: false,
            groupMessageSound: false,
            groupMessageVibrate: false,
            groupMessagePreview: false,
            groupCallSound: false,
            groupCallVibrate: false,
        }),
        skin: JSON.stringify({
            global: 'light',
        }),
        authority: JSON.stringify({
            acceptFriendAudioInvite: false,
            acceptFriendVideoInvite: false,
            acceptFriendScreenInvite: false,
            acceptFriendInviteGroup: false
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
            // 中继服务器
            turnServer: true,
            // 自定义wss
            customWss: '',
        })
    })
}

/**
 * 删除用户配置
 * @param {*} id
 * @param {*} companyId
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

    const info = await TlUserConfigDao.deleteInfo({
        [TlUserConfigDef.companyId]: companyId,
        [TlUserConfigDef.id]: id
    })

    if(info === null){
        tlConsoleError(TableName, "请求dao异常")
        return {}
    }

    return info
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
 * 获取用户配置列表
 * @param {*} companyId
 * @param {*} fields
 */
const getList = async function({companyId}, fields){
    // 参数校验
    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return []
    }

    const infoList = await TlUserConfigDao.getList({
        [TlUserConfigDef.companyId]: companyId
    }, fields, [
        [TlUserConfigDef.createdAt, 'DESC']
    ])

    if(infoList === null){
        return []
    }

    return infoList
}

/**
 * 获取用户配置列表
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
    
    const infoList = await TlUserConfigDao.getListForPage({
        [TlUserConfigDef.companyId]: companyId
    }, fields, [
        [TlUserConfigDef.createdAt, 'DESC']
    ], page, pageSize)

    if(infoList === null){
        return []
    }

    return infoList
}

/**
 * 获取用户配置信息
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

    const info = await TlUserConfigDao.getInfo({
        [TlUserConfigDef.companyId]: companyId,
        [TlUserConfigDef.id]: id
    }, fields)

    if(info === null){
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
    deleteInfoById,
    updateInfoById,
    getInfoById,
    getInfoByUserId,
    addDefaultInfo,

    getList,
    getListForPage
}