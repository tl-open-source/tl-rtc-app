const {
    channelPermission,
    userPermission,
    companyPermission,
    configPermission,
} = require('./permission');

const {
    userNormalPermissions,
    userAdminPermissions,
} = require('./accountRole')

const {
    userChannelCreatorPermissions,
    userChannelAdminPermissions,
    userChannelNormalPermissions,
} = require('./channelRole')



/**
 * 获取所有权限
 * @returns 
 */
const getAllPermissionsMap = function(){
    let returnPermissionMap = {};

    // 频道权限
    returnPermissionMap = Object.assign(returnPermissionMap, channelPermission.channel)
    returnPermissionMap = Object.assign(returnPermissionMap, channelPermission.channelChat)
    returnPermissionMap = Object.assign(returnPermissionMap, channelPermission.channelUser)
    // 企业权限
    returnPermissionMap = Object.assign(returnPermissionMap, companyPermission.company)
    // 用户权限
    returnPermissionMap = Object.assign(returnPermissionMap, userPermission.user)
    returnPermissionMap = Object.assign(returnPermissionMap, userPermission.userFriend)
    returnPermissionMap = Object.assign(returnPermissionMap, userPermission.userApply)
    returnPermissionMap = Object.assign(returnPermissionMap, userPermission.userConfig)
    returnPermissionMap = Object.assign(returnPermissionMap, userPermission.userRead)
    returnPermissionMap = Object.assign(returnPermissionMap, userPermission.userLogin)
    returnPermissionMap = Object.assign(returnPermissionMap, userPermission.userLogout)
    returnPermissionMap = Object.assign(returnPermissionMap, userPermission.userRegister)
    returnPermissionMap = Object.assign(returnPermissionMap, userPermission.userTag)
    // 配置权限
    
    return returnPermissionMap;
}


module.exports = {
    userNormalPermissions,
    userAdminPermissions,
    userChannelCreatorPermissions,
    userChannelAdminPermissions,
    userChannelNormalPermissions,

    getAllPermissionsMap
}