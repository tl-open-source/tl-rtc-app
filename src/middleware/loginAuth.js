const { 
    tlConsoleApiIcon, tlConsole, tlConsoleError,
    tlResponseArgsError, tlResponseForbidden, tlResponseSvrError, 
    tlResponseTimeout, tlResponseNotFound, tlResponseSuccess
} = require("../utils/utils");
const {
    LOGIN : {
        LOGIN_TOKEN_KEY,
        WEBSITE_LOGIN_TOKEN_KEY
    }
} = require('../utils/constant');
const userSessionService = require('../service/user/tl_user_session_service')


const loginAuthIngoreApi = [
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

    const isWebsite = request.url.includes("/website-")

    let tokenKey = LOGIN_TOKEN_KEY
    if(isWebsite){
        tokenKey = WEBSITE_LOGIN_TOKEN_KEY
    }

    const { [tokenKey]: token } = request.cookies;
    if (!token) {
        return response.json(tlResponseForbidden("不在线, 请先登录"))
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

    if(isWebsite){
        tlConsole("website login check:", request.url, token, loginUserCompanyId, loginUserId)
    }else{
        tlConsole("login check:", request.url, token, loginUserCompanyId, loginUserId)
    }

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