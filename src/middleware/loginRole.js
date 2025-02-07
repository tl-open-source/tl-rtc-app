const { 
    tlConsoleApiIcon, tlConsole, tlConsoleError,
    tlResponseArgsError, tlResponseForbidden, tlResponseSvrError, 
    tlResponseTimeout, tlResponseNotFound, tlResponseSuccess
} = require("../utils/utils");
const {
    LOGIN : {
        LOGIN_TOKEN_KEY
    }
} = require('../utils/constant');
const userSessionService = require('../service/user/tl_user_session_service')
const { inner: TlRoleInner } = require('../tables/tl_role')
const { 
    getAllPermissionsMap
 } = require('../role/role')


const loginRoleIngoreApi = [
    // 初始化
    '/api/web/config/init',

    // 登录
    '/api/web/user-login/login-state',
    '/api/web/user-login/website-login-state',
    '/api/web/user-login/login-by-account',
    '/api/web/user-login/login-by-mobile',
    '/api/web/user-login/login-by-email',
    '/api/web/user-login/login-by-code',
    '/api/web/user-login/login-by-wechat',
    '/api/web/user-login/login-by-qq',
    '/api/web/user-login/login-by-qy-wechat',
    '/api/web/user-login/login-by-fp',
    '/api/web/user-login/login-by-website',

    // 注册
    '/api/web/user-register/register-by-account',
    '/api/web/user-register/register-by-mobile',
    '/api/web/user-register/register-by-email',
    '/api/web/user-register/get-email-code',
    '/api/web/user-register/register-website-user',
    
    // 退出
    '/api/web/user-logout/logout',
    '/api/web/user-logout/website-logout',
]


/**
 * 根据角色id获取角色信息
 * 目前角色是固定的，后续可以从数据库中获取
 * @param {*} roleId 
 * @returns 
 */
const getRoleInfoById = function({roleId}){
    const roleList = [
        TlRoleInner.user.normal,
        TlRoleInner.user.admin,

        TlRoleInner.channel.creator,
        TlRoleInner.channel.admin,
        TlRoleInner.channel.member,
    ]

    return roleList.find(role => role.id === roleId)
}

/**
 * 判断角色是否有权限
 * @param {*} roleId 
 * @param {*} permissionId 
 * @returns 
 */
const roleHasPermission = function({ roleId, permissionId }){
    const roleInfo = getRoleInfoById({ roleId })
    if(!roleInfo){
        return false
    }

    let permissionIdList = []
    try{
        let permissionIdListJson = roleInfo.permissionIdList
        permissionIdList = JSON.parse(permissionIdListJson)
    }catch(e){
        tlConsoleError(e)
        return false
    }

    return permissionIdList.includes(permissionId)
}

/**
 * 判断用户在频道中是否有权限
 * @param {*} userId
 * @param {*} permissionId
 * @param {*} channelId 
 * @returns 
 */
const channelRoleHasPermission = async function({ userId, permissionId, channelId }){
    let channelRole = await userSessionService.getUserChannelRole({
        userId, channelId
    })
    channelRole = parseInt(channelRole)

    const roleInfo = getRoleInfoById({ roleId: channelRole })
    if(!roleInfo){
        return false
    }

    let permissionIdList = []
    try{
        let permissionIdListJson = roleInfo.permissionIdList
        permissionIdList = JSON.parse(permissionIdListJson)
    }catch(e){
        tlConsoleError(e)
        return false
    }

    return permissionIdList.includes(permissionId)
}


/**
 * 根据请求api获取对应的权限id
 * @param {*} url 
 */
const getRequestApiPermissionId = function(url){
    let apiSplit = url.split("/")
    if(apiSplit.length !== 5){
        return ""
    }

    let [_a, _b, apiPlatform, apiModule, apiAction] = apiSplit

    apiAction = apiAction.split("?")[0]

    apiModule = apiModule.replace(/-/g, "_").toUpperCase()
    apiAction = apiAction.replace(/-/g, "_").toUpperCase()

    // 获取权限key
    let permissionKey = apiModule + ":" + apiAction

    // 获取权限map
    let permissionMap = getAllPermissionsMap()

    // 获取权限id
    return permissionMap[permissionKey]
}


/**
 * 权限验证中间件
 * @param {*} request 
 * @param {*} response 
 * @param {*} next 
 * @returns 
 */
const loginRoleHandler = async function(request, response, next) {
    // 非api请求不需要权限验证
    if(!request.url.startsWith("/api/")) {
        return next()
    }

    // 跳过忽略权限校验的api
    for (const ignoreApi of loginRoleIngoreApi) {
        if (request.url.startsWith(ignoreApi)) {
            return next()
        }
    }

    // 频道相关不处理
    if(request.url.startsWith("/api/web/channel")){
        return next()
    }

    const isWebsite = request.url.includes("/website-")

    const {
        loginUserCompanyId, 
        loginUserCompanyName,
        loginUserId, 
        loginUsername,
        loginUserRoleId,  
        loginUserAvatar,
        loginTime, 
        loginUserEmail, 
        loginUserMobile
    } = request.ctx

    if(!loginUserRoleId){
        return response.json(tlResponseForbidden("身份无权限"))
    }

    let permissionId = getRequestApiPermissionId(request.url)

    if(isWebsite){
        tlConsole("website role check:", request.url, loginUserCompanyId, loginUserId, loginUserRoleId, permissionId)
    }else{
        tlConsole("role check:", request.url, loginUserCompanyId, loginUserId, loginUserRoleId, permissionId)
    }
    
    if(!permissionId){
        return response.json(tlResponseForbidden("请求无权限"))
    }

    const hasPermission = roleHasPermission({
        roleId: loginUserRoleId,
        permissionId: permissionId
    })
    if(!hasPermission){
        return response.json(tlResponseForbidden("操作无权限"))
    }
    
    next()
}

/**
 * 频道权限验证中间件
 * @param {*} request 
 * @param {*} response 
 * @param {*} next 
 * @returns 
 */
const loginChannelRoleHandler = async function(request, response, next) {
    // 非api请求不需要权限验证
    if(!request.url.startsWith("/api/")) {
        return next()
    }

    // 跳过忽略权限校验的api
    for (const ignoreApi of loginRoleIngoreApi) {
        if (request.url.startsWith(ignoreApi)) {
            return next()
        }
    }

    // 只处理频道相关的api
    if(!request.url.startsWith("/api/web/channel")){
        return next()
    }

    let channelId = request.query.channelId || request.body.channelId
    if(!channelId){
        return next()
    }

    channelId = String(channelId)

    const {
        loginUserCompanyId, 
        loginUserCompanyName,
        loginUserId, 
        loginUsername,
        loginUserRoleId,  
        loginUserAvatar,
        loginTime, 
        loginUserEmail, 
        loginUserMobile
    } = request.ctx

    if(!loginUserRoleId){
        return response.json(tlResponseForbidden("身份无权限"))
    }

    let permissionId = getRequestApiPermissionId(request.url)

    tlConsole("channel role check:", request.url, loginUserCompanyId, loginUserId, loginUserRoleId, permissionId)
    
    if(!permissionId){
        return response.json(tlResponseForbidden("请求无权限"))
    }

    const hasPermission = await channelRoleHasPermission({
        userId: loginUserId,
        permissionId: permissionId,
        channelId: channelId
    })
    if(!hasPermission){
        return response.json(tlResponseForbidden("操作无权限"))
    }
    
    next()
}


module.exports = {
    loginRoleHandler,
    loginChannelRoleHandler
}