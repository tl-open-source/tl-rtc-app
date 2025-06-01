const { 
    tlConsole, tlResponseForbidden, 
} = require("../utils/utils");
const {
    LOGIN : {
        LOGIN_TOKEN_KEY,
        SYSTEM_LOGIN_TOKEN_KEY
    }
} = require('../utils/constant');
const userSessionService = require('../service/user/tl_user_session_service')


const loginAuthIngoreApi = [
    // 初始化
    '/api/web/config/init',

    // 登录
    '/api/web/user-login/login-state',
    '/api/web/user-login/system-login-state',
    '/api/web/user-login/login-by-account',
    '/api/web/user-login/login-by-email',
    '/api/web/user-login/login-by-system',

    // 注册
    '/api/web/user-register/register-by-account',
    '/api/web/user-register/register-by-email',

    // 退出
    '/api/web/user-logout/logout',
    '/api/web/user-logout/system-logout',
]


/**
 * 登录验证中间件
 * @param {*} request 
 * @param {*} response 
 * @param {*} next 
 * @returns 
 */
const loginAuthHandler = async function(request, response, next) {
    // 非api请求不需要登录验证
    if(!request.url.startsWith("/api/")) {
        return next()
    }

    // 跳过忽略登录态校验的api
    for (const ignoreApi of loginAuthIngoreApi) {
        if (request.url.startsWith(ignoreApi)) {
            return next()
        }
    }

    let tokenKey = LOGIN_TOKEN_KEY
    
    const isSystem = request.url.includes("/system-")
    if(isSystem){
        tokenKey = SYSTEM_LOGIN_TOKEN_KEY
    }

    let { [tokenKey]: token } = request.cookies;
    if (!token) {
        // 如果没有token，尝试从请求头中获取
        token = request.headers[tokenKey];
        if (!token) {
            // 如果请求头中也没有token，返回401
            return response.json(tlResponseForbidden("不在线, 请先登录"))
        }
    }
        
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
    } = await userSessionService.getUserInfoByToken({token})

    tlConsole("login check:", request.url, token, loginUserCompanyId, loginUserId)

    if (!loginUserCompanyId) {
        return response.json(tlResponseForbidden("不在线, 请先登录"))
    }

    if (!loginUserId) {
        return response.json(tlResponseForbidden("不在线, 请先登录"))
    }

    request.ctx = {
        token, loginUserCompanyId, loginUserId, 
        loginUsername, loginUserRoleId, loginUserCompanyName,
        loginUserAvatar, loginTime, loginUserEmail, loginUserMobile
    }
    
    next()
}

module.exports = loginAuthHandler