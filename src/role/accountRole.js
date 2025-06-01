const {
    systemPermission,
    channelPermission,
    cloudPermission,
    userPermission,
    companyPermission,
    configPermission,

    channelPerfix,
    channelNoticePerfix,
    channelUserPerfix,
} = require('./permission');


/**
 * 普通用户权限
 * @returns 
 */
const userNormalPermissions = function(){
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

    // 资源库权限
    Object.keys(cloudPermission).forEach((key) => {
        returnPermission.push(...Object.values(cloudPermission[key]));
    })
    // 用户权限
    Object.keys(userPermission).forEach((key) => {
        returnPermission.push(...Object.values(userPermission[key]));
    })
    // 配置权限
    Object.keys(configPermission).forEach((key) => {
        returnPermission.push(...Object.values(configPermission[key]));
    })

    return returnPermission;
}

/**
 * 系统超级管理员权限 - 所有权限
 * @returns 
 */
const userAdminPermissions = function(){
    let returnPermission = [];

    // 系统管理员权限
    Object.keys(systemPermission).forEach((key) => {
        returnPermission.push(...Object.values(systemPermission[key]));
    })
    // 频道权限
    Object.keys(channelPermission).forEach((key) => {
        returnPermission.push(...Object.values(channelPermission[key]));
    })
    // 资源库权限
    Object.keys(cloudPermission).forEach((key) => {
        returnPermission.push(...Object.values(cloudPermission[key]));
    })
    // 企业权限
    Object.keys(companyPermission).forEach((key) => {
        returnPermission.push(...Object.values(companyPermission[key]));
    })
    // 用户权限
    Object.keys(userPermission).forEach((key) => {
        returnPermission.push(...Object.values(userPermission[key]));
    })
    // 配置权限
    Object.keys(configPermission).forEach((key) => {
        returnPermission.push(...Object.values(configPermission[key]));
    })

    return returnPermission;
}


module.exports = {
    userNormalPermissions,
    userAdminPermissions,
}