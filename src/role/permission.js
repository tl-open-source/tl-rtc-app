/**
 * @description 权限配置
 * @module permission
 * @auther iamtsm
 */

// 权限id基数
const systemPermissionIdBase = 1
const channelPermissionIdBase = 100000
const companyPermissionIdBase = 300000
const userPermissionIdBase = 600000
const configPermissionIdBase = 700000

// key前缀
const systemPerfix = 'SYSTEM:'
const channelPerfix = 'CHANNEL:'
const channelChatPerfix = 'CHANNEL_CHAT:'
const channelUserPerfix = 'CHANNEL_USER:'
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


// 补充前缀
const addPerfix = function(permission, perfix){
    for (let key in permission){
        permission[perfix + key] = permission[key]
        delete permission[key]
    }
}

// 系统默认预设权限 1-999999
let systemPermission = {
    
}

// 频道权限 100000 - 199999
let channelPermission = {
    channel: { // 100000 ~ 100999
        // 添加频道
        ADD_CHANNEL: channelPermissionIdBase + 1,
        // 获取频道列表
        GET_CHANNEL_LIST: channelPermissionIdBase + 2,
        // 获取频道信息
        GET_CHANNEL_INFO: channelPermissionIdBase + 4,
        // 获取频道名称
        GET_CHANNEL_NAME: channelPermissionIdBase + 5,
        // 修改频道名称
        UPDATE_CHANNEL_NAME: channelPermissionIdBase + 6,
        // 获取频道聊天记录
        GET_CHANNEL_MESSAGE: channelPermissionIdBase + 7,
        // 获取频道列表聊天记录
        GET_CHANNEL_MESSAGE_LIST: channelPermissionIdBase + 8,
        // 通过频道id获取频道信息
        SEARCH_CHANNEL_BY_ID: channelPermissionIdBase + 10,
        // 获取群组频道列表
        GET_GROUP_CHANNEL_LIST: channelPermissionIdBase + 11,
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
        // 撤回聊天消息
        ROLLBACK_CHANNEL_CHAT: channelPermissionIdBase + 1004,
    },
    channelUser: { // 105000 ~ 105999
        // 系统管理员添加频道用户
        ADD_CHANNEL_USER: channelPermissionIdBase + 5001,
        // 分享加入群聊
        SHARE_JOIN_CHANNEL: channelPermissionIdBase + 5002,
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

// 企业权限 300000 - 399999
let companyPermission = {
    company: { // 300000 ~ 300999
        // 添加企业
        ADD_COMPANY: companyPermissionIdBase + 1,
        // 获取企业
        GET_COMPANY: companyPermissionIdBase + 2,
    }
}

// 用户权限 600000 - 699999
let userPermission = {
    user: { // 600000 ~ 600999
        // 搜索用户
        SEARCH_USER_BY_NAME: userPermissionIdBase + 1,
        // 搜索用户通过id
        SEARCH_USER_BY_ID: userPermissionIdBase + 2,
        // 更新用户头像
        UPDATE_USER_AVATAR: userPermissionIdBase + 3,
        // 绑定邮箱
        BIND_EMAIL: userPermissionIdBase + 4
    },
    userApply: { // 601000 ~ 601999
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
    },
    userFriend: { // 602000 ~ 602999
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
    userConfig: { // 603000 ~ 603999
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
    userRead: { // 604000 ~ 604999
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
    },
    userTag: { // 605000 ~ 605999
        // 添加频道分组标签
        ADD_CHANNEL_TAG: userPermissionIdBase + 5000,
        // 添加好友分组标签
        ADD_FRIEND_TAG: userPermissionIdBase + 5001,
        // 添加资源库分组标签
        ADD_CLOUD_TAG: userPermissionIdBase + 5002,
        // 获取频道分组标签列表
        GET_CHANNEL_TAG_LIST: userPermissionIdBase + 5003,
        // 获取好友分组标签列表
        GET_FRIEND_TAG_LIST: userPermissionIdBase + 5004,
        // 获取资源库分组标签列表
        GET_CLOUD_TAG_LIST: userPermissionIdBase + 5005,
        // 删除标签
        DELETE_TAG: userPermissionIdBase + 5006,
    },
    userRegister: { // 606000 ~ 606999

    },
    userLogin: { // 607000 ~ 607999

    },
    userLogout: { // 608000 ~ 608999

    },
}

// 配置权限 700000 - 799999
const configPermission = {
    
}

addPerfix(channelPermission.channel, channelPerfix)
addPerfix(channelPermission.channelChat, channelChatPerfix)
addPerfix(channelPermission.channelUser, channelUserPerfix)

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


module.exports = {
    systemPermission,
    channelPermission,
    companyPermission,
    userPermission,
    configPermission,

    systemPerfix,
    channelPerfix,
    channelChatPerfix,
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
}