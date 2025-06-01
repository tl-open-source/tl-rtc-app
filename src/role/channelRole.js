const {
    channelPermission,

    channelPerfix,
    channelNoticePerfix,
    channelUserPerfix
} = require('./permission');


/**
 * 频道创建人权限
 * @returns 
 */
const userChannelCreatorPermissions = function(){
    let returnPermission = [];

    // 频道权限
    returnPermission.push(...Object.values(channelPermission.channel))
    returnPermission.push(...Object.values(channelPermission.channelChat))
    returnPermission.push(...Object.values(channelPermission.channelMedia))
    returnPermission.push(...Object.values(channelPermission.channelFile))
    returnPermission.push(...Object.values(channelPermission.channelNotice))
    returnPermission.push(...Object.values(channelPermission.channelUser))

    return returnPermission;
}

/**
 * 频道管理员权限
 * @returns 
 */
const userChannelAdminPermissions = function(){
    let returnPermission = [];

    // 频道权限
    const channelKeys = Object.keys(channelPermission.channel).filter((key) => {
        return ![
            channelPerfix + "UPDATE_CHANNEL_NAME",
            channelPerfix + "UPDATE_CHANNEL_CAN_SEARCH",
        ].includes(key)
    })
    channelKeys.forEach((key) => {
        returnPermission.push(channelPermission.channel[key]);
    })

    const channelUserKeys = Object.keys(channelPermission.channelUser).filter((key) => {
        return ![
            channelUserPerfix + "ADD_CHANNEL_USER_ADMIN",
            channelUserPerfix + "ADD_CHANNEL_USER",
            channelUserPerfix + "DELETE_CHANNEL_USER",
            channelUserPerfix + "UPDATE_CHANNEL_USER_ROLE_ADMIN",
        ].includes(key)
    })
    channelUserKeys.forEach((key) => {
        returnPermission.push(channelPermission.channelUser[key]);
    })

    returnPermission.push(...Object.values(channelPermission.channelChat))
    returnPermission.push(...Object.values(channelPermission.channelMedia))
    returnPermission.push(...Object.values(channelPermission.channelFile))
    returnPermission.push(...Object.values(channelPermission.channelNotice))

    return returnPermission;
}

/**
 * 频道普通用户权限
 * @returns 
 */
const userChannelNormalPermissions = function(){
    let returnPermission = [];

    // 频道权限
    const channelKeys = Object.keys(channelPermission.channel).filter((key) => {
        return ![
            channelPerfix + "UPDATE_CHANNEL_NAME",
            channelPerfix + "UPDATE_CHANNEL_CAN_SEARCH",
        ].includes(key)
    })
    channelKeys.forEach((key) => {
        returnPermission.push(channelPermission.channel[key]);
    })

    const channelNoticeKeys = Object.keys(channelPermission.channelNotice).filter((key) => {
        return ![
            channelNoticePerfix + "ADD_CHANNEL_NOTICE"
        ].includes(key)
    })
    channelNoticeKeys.forEach((key) => {
        returnPermission.push(channelPermission.channelNotice[key]);
    })

    const channelUserKeys = Object.keys(channelPermission.channelUser).filter((key) => {
        return ![
            channelUserPerfix + "ADD_CHANNEL_USER_ADMIN",
            channelUserPerfix + "ADD_CHANNEL_USER",
            channelUserPerfix + "DELETE_CHANNEL_USER",
            channelUserPerfix + "UPDATE_CHANNEL_USER_ROLE_ADMIN",
            channelUserPerfix + "UPDATE_CHANNEL_USER_ROLE_NORMAL",
        ].includes(key)
    })
    channelUserKeys.forEach((key) => {
        returnPermission.push(channelPermission.channelUser[key]);
    })

    returnPermission.push(...Object.values(channelPermission.channelChat))
    returnPermission.push(...Object.values(channelPermission.channelMedia))
    returnPermission.push(...Object.values(channelPermission.channelFile))

    return returnPermission;
}



module.exports = {
    userChannelCreatorPermissions,
    userChannelAdminPermissions,
    userChannelNormalPermissions,
}