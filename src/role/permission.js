/**
 * @description 权限配置
 * @module permission
 * @auther iamtsm
 */

// 权限id基数
const systemPermissionIdBase = 1
const channelPermissionIdBase = 100000
const cloudPermissionIdBase = 200000
const companyPermissionIdBase = 300000
const userPermissionIdBase = 400000
const configPermissionIdBase = 500000

// key前缀
const systemWebConfigPerfix = 'SYSTEM_WEB_CONFIG:'
const systemWebCompanyPerfix = 'SYSTEM_WEB_COMPANY:'
const systemWebUserPerfix = 'SYSTEM_WEB_USER:'
const systemWebChannelPerfix = 'SYSTEM_WEB_CHANNEL:'
const systemWebServicePerfix = 'SYSTEM_WEB_SERVICE:'
const channelPerfix = 'CHANNEL:'
const channelChatPerfix = 'CHANNEL_CHAT:'
const channelMediaPerfix = 'CHANNEL_MEDIA:'
const channelFilePerfix = 'CHANNEL_FILE:'
const channelNoticePerfix = 'CHANNEL_NOTICE:'
const channelUserPerfix = 'CHANNEL_USER:'
const cloudFilePerfix = 'CLOUD_FILE:'
const companyPerfix = 'COMPANY:'
const userPerfix = 'USER:'
const userApplyPerfix = 'USER_APPLY:'
const userFriendPerfix = 'USER_FRIEND:'
const userConfigPerfix = 'USER_CONFIG:'
const userReadPerfix = 'USER_READ:'
const userTagPerfix = 'USER_TAG:'
const userRegisterPerfix = 'USER_REGISTER:'
const userLoginPerfix = 'USER_LOGIN:'
const userLogoutPerfix = 'USER_LOGOUT:'
const userClearPerfix = 'USER_CLEAR:'
const configSkinPerfix = 'CONFIG_SKIN:'


// 补充前缀
const addPerfix = function(permission, perfix){
    for (let key in permission){
        permission[perfix + key] = permission[key]
        delete permission[key]
    }
}

// 系统默认预设权限 1-999999
let systemPermission = {
    systemWebConfig: { // 1 ~ 9999
        // 获取网站配置
        GET_SYSTEM_CONFIG: systemPermissionIdBase + 1,
        // 更新网站配置
        UPDATE_SYSTEM_CONFIG: systemPermissionIdBase + 2,
    },
    systemWebService: { // 10000 ~ 19999
        // 重启服务
        RESTART_SERVICE: systemPermissionIdBase + 10000,
        // 获取服务状态
        GET_SERVICE_STATUS: systemPermissionIdBase + 10001,
        // 停止服务
        STOP_SERVICE: systemPermissionIdBase + 10002,
        // 启动服务
        START_SERVICE: systemPermissionIdBase + 10003,
        // 启动socket
        START_SOCKET: systemPermissionIdBase + 10004,
    },
    systemWebCompany: { // 20000 ~ 29999
        // 获取公司信息
        GET_COMPANY_LIST: systemPermissionIdBase + 20000,
        // 更新公司信息
        UPDATE_COMPANY: systemPermissionIdBase + 20001,
        // 添加公司
        ADD_COMPANY: systemPermissionIdBase + 20002,
        // 删除公司
        DELETE_COMPANY: systemPermissionIdBase + 20003,
        // 获取公司信息
        GET_COMPANY_INFO: systemPermissionIdBase + 20004,
    },
    systemWebUser: { // 30000 ~ 39999
        // 删除用户
        DELETE_USER: systemPermissionIdBase + 30000,
        // 获取用户列表
        GET_USER_LIST: systemPermissionIdBase + 30001,
        // 更新用户信息
        UPDATE_USER: systemPermissionIdBase + 30002,
        // 添加用户
        ADD_USER: systemPermissionIdBase + 30003,
        // 获取用户信息
        GET_USER_INFO: systemPermissionIdBase + 30004,
    },
    systemWebChannel: { // 40000 ~ 49999
        // 添加频道
        ADD_CHANNEL: systemPermissionIdBase + 40000,
        // 更新频道
        UPDATE_CHANNEL: systemPermissionIdBase + 40001,
        // 删除频道
        DELETE_CHANNEL: systemPermissionIdBase + 40002,
        // 获取频道列表
        GET_CHANNEL_LIST: systemPermissionIdBase + 40003,
        // 获取频道用户列表
        GET_CHANNEL_USER_LIST: systemPermissionIdBase + 40004,
    },
}

// 频道权限 100000 - 199999
let channelPermission = {
    channel: { // 100000 ~ 100999
        // 添加频道
        ADD_CHANNEL: channelPermissionIdBase + 1,
        // 获取频道列表
        GET_CHANNEL_LIST: channelPermissionIdBase + 2,
        // 获取频道信息
        GET_CHANNEL_INFO: channelPermissionIdBase + 3,
        // 获取频道名称
        GET_CHANNEL_NAME: channelPermissionIdBase + 4,
        // 修改频道名称
        UPDATE_CHANNEL_NAME: channelPermissionIdBase + 5,
        // 获取频道聊天记录
        GET_CHANNEL_MESSAGE: channelPermissionIdBase + 6,
        // 获取频道列表聊天记录
        GET_CHANNEL_MESSAGE_LIST: channelPermissionIdBase + 7,
        // 搜索频道聊天记录
        SEARCH_CHANNEL_MESSAGE: channelPermissionIdBase + 8,
        // 通过频道id获取频道信息
        SEARCH_CHANNEL_BY_ID: channelPermissionIdBase + 9,
        // 获取群组频道列表
        GET_GROUP_CHANNEL_LIST: channelPermissionIdBase + 10,
        // 修改频道是否可以被搜索
        UPDATE_CHANNEL_CAN_SEARCH: channelPermissionIdBase + 11,
    },
    channelChat: { // 101000 ~ 101999
        // 发送好友频道聊天
        ADD_FRIEND_CHANNEL_CHAT: channelPermissionIdBase + 1000,
        // 发送多人频道聊天
        ADD_GROUP_CHANNEL_CHAT: channelPermissionIdBase + 1001,
        // 回复好友频道聊天
        ADD_REPLY_FRIEND_CHANNEL_CHAT: channelPermissionIdBase + 1002,
        // 回复多人频道聊天
        ADD_REPLY_GROUP_CHANNEL_CHAT: channelPermissionIdBase + 1003,
    },
    channelFile: { // 102000 ~ 102999
        // 发送好友频道离线文件消息
        ADD_FRIEND_CHANNEL_OFFLINE_FILE: channelPermissionIdBase + 2001,
        // 发送群聊频道离线文件消息
        ADD_GROUP_CHANNEL_OFFLINE_FILE: channelPermissionIdBase + 2002,
    },
    channelMedia: { // 103000 ~ 103999
        // 发送好友频道语音聊天消息
        ADD_FRIEND_CHANNEL_AUDIO: channelPermissionIdBase + 3001,
        // 发送好友频道视频消息
        ADD_FRIEND_CHANNEL_VIDEO: channelPermissionIdBase + 3002,

        // 发送多人频道语音聊天消息
        ADD_GROUP_CHANNEL_AUDIO: channelPermissionIdBase + 3003,
        // 发送多人频道视频消息
        ADD_GROUP_CHANNEL_VIDEO: channelPermissionIdBase + 3004,
    },
    channelNotice: { // 104000 ~ 104999
        // 发布频道公告
        ADD_CHANNEL_NOTICE: channelPermissionIdBase + 4001,
        // 获取频道公告
        GET_CHANNEL_NOTICE_LIST: channelPermissionIdBase + 4002,
    },
    channelUser: { // 105000 ~ 105999
        // 系统管理员添加频道用户
        ADD_CHANNEL_USER: channelPermissionIdBase + 5001,
        // 添加频道普通身份用户
        ADD_CHANNEL_USER_NORMAL: channelPermissionIdBase + 5003,
        // 批量添加频道普通身份用户
        ADD_CHANNEL_USER_LIST_NORMAL: channelPermissionIdBase + 5004,
        // 添加频道管理员身份用户
        ADD_CHANNEL_USER_ADMIN: channelPermissionIdBase + 5005,
        // 删除频道用户
        DELETE_CHANNEL_USER: channelPermissionIdBase + 5006,
        // 更新频道用户角色为管理员
        UPDATE_CHANNEL_USER_ROLE_ADMIN: channelPermissionIdBase + 5007,
        // 更新频道用户角色为普通用户
        UPDATE_CHANNEL_USER_ROLE_NORMAL: channelPermissionIdBase + 5008,
        // 获取所有频道列表的用户
        GET_CHANNEL_LIST_USER_LIST: channelPermissionIdBase + 5009,
        // 获取某个频道的用户列表
        GET_CHANNEL_USER_LIST: channelPermissionIdBase + 5010,
        // 修改频道是否置顶
        UPDATE_CHANNEL_TOP: channelPermissionIdBase + 5011,
        // 修改频道是否拉黑
        UPDATE_CHANNEL_BLACK: channelPermissionIdBase + 5012,
        // 退出频道
        EXIT_CHANNEL: channelPermissionIdBase + 5013,
    }
}

// 资源库权限 200000 - 299999
let cloudPermission = {
    cloudFile: { // 200000 ~ 200999
        // 上传文件
        UPLOAD_FILE: cloudPermissionIdBase + 1,
        // 从服务器获取云文件
        DOWNLOAD_SERVER_FILE: cloudPermissionIdBase + 2,
    },
}

// 企业权限 300000 - 399999
let companyPermission = {
    company: { // 300000 ~ 300999
        // 获取企业信息
        GET_COMPANY: companyPermissionIdBase + 1,
    }
}

// 用户权限 400000 - 499999
let userPermission = {
    user: { // 400000 ~ 400999
        // 搜索用户
        SEARCH_USER_BY_NAME: userPermissionIdBase + 1,
        // 搜索用户通过id
        SEARCH_USER_BY_ID: userPermissionIdBase + 2,
        // 更新用户头像
        UPDATE_USER_AVATAR: userPermissionIdBase + 3,
        // 绑定邮箱
        BIND_EMAIL: userPermissionIdBase + 4
    },
    userApply: { // 401000 ~ 401999
        // 添加好友申请
        ADD_USER_FRIEND_APPLY: userPermissionIdBase + 1000,
        // 通过好友申请
        PASS_USER_FRIEND: userPermissionIdBase + 1001,
        // 拒绝好友申请
        REJECT_USER_FRIEND: userPermissionIdBase + 1002,
        // 获取自己收到的用户好友申请列表
        GET_USER_FRIEND_OTHER_APPLY_LIST: userPermissionIdBase + 1003,
        // 获取自己发出的用户好友申请列表
        GET_USER_FRIEND_SELF_APPLY_LIST: userPermissionIdBase + 1004,
        // 获取自己收到的群聊申请列表
        GET_USER_GROUP_OTHER_APPLY_LIST: userPermissionIdBase + 1005,
        // 获取自己发出的群聊申请列表
        GET_USER_GROUP_SELF_APPLY_LIST: userPermissionIdBase + 1006,
        // 通过群聊申请
        PASS_USER_GROUP: userPermissionIdBase + 1007,
        // 拒绝群聊申请
        REJECT_USER_GROUP: userPermissionIdBase + 1008,
        // 添加群聊申请
        ADD_USER_GROUP_APPLY: userPermissionIdBase + 1009,
    },
    userFriend: { // 402000 ~ 402999
        // 删除好友
        DELETE_USER_FRIEND: userPermissionIdBase + 2000,
        // 更新好友信息备注
        UPDATE_USER_FRIEND_REMARK: userPermissionIdBase + 2001,
        // 更新好友名称备注
        UPDATE_USER_FRIEND_RENAME: userPermissionIdBase + 2002,
        // 获取用户好友列表
        GET_USER_FRIEND_LIST: userPermissionIdBase + 2003,
        // 关注好友
        UPDATE_USER_FRIEND_SPECIAL: userPermissionIdBase + 2004,
    },
    userConfig: { // 403000 ~ 403999
        // 获取用户配置
        GET_USER_CONFIG: userPermissionIdBase + 3000,
        // 更新用户通用设置
        UPDATE_USER_CONFIG_NORMAL: userPermissionIdBase + 3001,
        // 更新用户皮肤设置
        UPDATE_USER_CONFIG_SKIN: userPermissionIdBase + 3002,
        // 更新用户账号设置
        UPDATE_USER_CONFIG_ACCOUNT: userPermissionIdBase + 3003,
        // 更新用户消息设置
        UPDATE_USER_CONFIG_MESSAGE: userPermissionIdBase + 3004,
        // 更新用户权限设置
        UPDATE_USER_CONFIG_AUTHORITY: userPermissionIdBase + 3005,
        // 更新用户其他设置
        UPDATE_USER_CONFIG_OTHER: userPermissionIdBase + 3006,
    },
    userRead: { // 404000 ~ 404999
        // 更新频道文件/媒体/聊天消息已读记录
        UPDATE_CHANNEL_MUTIL_READ: userPermissionIdBase + 4000,
        // 更新频道聊天消息已读记录
        UPDATE_CHANNEL_CHAT_READ: userPermissionIdBase + 4001,
        // 更新频道媒体消息已读记录
        UPDATE_CHANNEL_MEDIA_READ: userPermissionIdBase + 4002,
        // 更新频道文件消息已读记录
        UPDATE_CHANNEL_FILE_READ: userPermissionIdBase + 4003,
        // 新增申请消息已读记录
        UPDATE_USER_FRIEND_APPLY_READ: userPermissionIdBase + 4004,
        // 新增通过申请消息已读记录
        UPDATE_USER_FRIEND_APPLY_PASS_READ: userPermissionIdBase + 4005,
        // 新增拒绝申请消息已读记录
        UPDATE_USER_FRIEND_APPLY_REJECT_READ: userPermissionIdBase + 4006,
        // 新增群聊申请消息已读记录
        UPDATE_USER_GROUP_APPLY_READ: userPermissionIdBase + 4007,
        // 新增通过群聊申请消息已读记录
        UPDATE_USER_GROUP_APPLY_PASS_READ: userPermissionIdBase + 4008,
        // 新增拒绝群聊申请消息已读记录
        UPDATE_USER_GROUP_APPLY_REJECT_READ: userPermissionIdBase + 4009,
    },
    userTag: { // 405000 ~ 405999
        // 添加频道分组标签
        ADD_CHANNEL_TAG: userPermissionIdBase + 5000,
        // 添加好友分组标签
        ADD_FRIEND_TAG: userPermissionIdBase + 5001,
        // 获取频道分组标签列表
        GET_CHANNEL_TAG_LIST: userPermissionIdBase + 5002,
        // 获取好友分组标签列表
        GET_FRIEND_TAG_LIST: userPermissionIdBase + 5003,
        // 删除标签
        DELETE_TAG: userPermissionIdBase + 5004,
    },
    userRegister: { // 406000 ~ 406999

    },
    userLogin: { // 407000 ~ 407999

    },
    userLogout: { // 408000 ~ 408999

    },
    userClear: { // 409000 ~ 409999
        // 更新频道聊天清理记录
        UPDATE_CHANNEL_CHAT_CLEAR: userPermissionIdBase + 9000,
        // 更新频道媒体清理记录
        UPDATE_CHANNEL_MEDIA_CLEAR: userPermissionIdBase + 9001,
        // 更新频道文件清理记录
        UPDATE_CHANNEL_FILE_CLEAR: userPermissionIdBase + 9002,
        // 更新频道多消息清理记录
        UPDATE_CHANNEL_MUTIL_CLEAR: userPermissionIdBase + 9003,
    }
}

// 配置权限 500000 - 599999
const configPermission = {
    skin: { // 700000 ~ 700999
        GET_DETAIL: configPermissionIdBase + 1,
    }
}


addPerfix(systemPermission.systemWebConfig, systemWebConfigPerfix)
addPerfix(systemPermission.systemWebCompany, systemWebCompanyPerfix)
addPerfix(systemPermission.systemWebUser, systemWebUserPerfix)
addPerfix(systemPermission.systemWebChannel, systemWebChannelPerfix)
addPerfix(systemPermission.systemWebService, systemWebServicePerfix)

addPerfix(channelPermission.channel, channelPerfix)
addPerfix(channelPermission.channelChat, channelChatPerfix)
addPerfix(channelPermission.channelMedia, channelMediaPerfix)
addPerfix(channelPermission.channelFile, channelFilePerfix)
addPerfix(channelPermission.channelNotice, channelNoticePerfix)
addPerfix(channelPermission.channelUser, channelUserPerfix)

addPerfix(cloudPermission.cloudFile, cloudFilePerfix)

addPerfix(companyPermission.company, companyPerfix)

addPerfix(userPermission.user, userPerfix)
addPerfix(userPermission.userApply, userApplyPerfix)
addPerfix(userPermission.userFriend, userFriendPerfix)
addPerfix(userPermission.userConfig, userConfigPerfix)
addPerfix(userPermission.userRead, userReadPerfix)
addPerfix(userPermission.userRegister, userRegisterPerfix)
addPerfix(userPermission.userLogin, userLoginPerfix)
addPerfix(userPermission.userLogout, userLogoutPerfix)
addPerfix(userPermission.userTag, userTagPerfix)
addPerfix(userPermission.userClear, userClearPerfix)
addPerfix(configPermission.skin, configSkinPerfix)


module.exports = {
    systemPermission,
    channelPermission,
    cloudPermission,
    companyPermission,
    userPermission,
    configPermission,

    systemWebConfigPerfix,
    systemWebCompanyPerfix,
    systemWebUserPerfix,
    systemWebChannelPerfix,
    systemWebServicePerfix,
    channelPerfix,
    channelChatPerfix,
    channelFilePerfix,
    channelNoticePerfix,
    channelUserPerfix,
    cloudFilePerfix,
    companyPerfix,
    userPerfix,
    userApplyPerfix,
    userFriendPerfix,
    userConfigPerfix,
    userReadPerfix,
    userRegisterPerfix,
    userLoginPerfix,
    userLogoutPerfix,
    userTagPerfix,
    configSkinPerfix,
}