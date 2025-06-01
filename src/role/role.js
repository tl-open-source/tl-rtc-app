const {
    systemPermission,
    channelPermission,
    cloudPermission,
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

    // 系统权限
    returnPermissionMap = Object.assign(returnPermissionMap, systemPermission.systemWebConfig)
    returnPermissionMap = Object.assign(returnPermissionMap, systemPermission.systemWebService)
    returnPermissionMap = Object.assign(returnPermissionMap, systemPermission.systemWebCompany)
    returnPermissionMap = Object.assign(returnPermissionMap, systemPermission.systemWebUser)
    returnPermissionMap = Object.assign(returnPermissionMap, systemPermission.systemWebChannel)
    // 频道权限
    returnPermissionMap = Object.assign(returnPermissionMap, channelPermission.channel)
    returnPermissionMap = Object.assign(returnPermissionMap, channelPermission.channelChat)
    returnPermissionMap = Object.assign(returnPermissionMap, channelPermission.channelMedia)
    returnPermissionMap = Object.assign(returnPermissionMap, channelPermission.channelFile)
    returnPermissionMap = Object.assign(returnPermissionMap, channelPermission.channelNotice)
    returnPermissionMap = Object.assign(returnPermissionMap, channelPermission.channelUser)
    // 资源库权限
    returnPermissionMap = Object.assign(returnPermissionMap, cloudPermission.cloudFile)
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
    returnPermissionMap = Object.assign(returnPermissionMap, userPermission.userClear)
    // 配置权限
    returnPermissionMap = Object.assign(returnPermissionMap, configPermission.skin)

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