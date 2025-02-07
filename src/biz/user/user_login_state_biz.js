const { 
    tlResponseArgsError, tlResponseForbidden, tlResponseSvrError, 
    tlResponseTimeout, tlResponseNotFound, tlResponseSuccess
} = require('../../utils/utils')
const userSessionService = require('../../service/user/tl_user_session_service')


/**
 * 是否登陆中
 * @param {*} token 
 */
const userIsLogin = async function({token}){
    if(!token){
        return tlResponseArgsError("不在线")
    }

    const userInfo = await userSessionService.getUserInfoByToken({token})
    // 登录用户ID
    const loginUserId = userInfo.loginUserId
    if(!loginUserId){
        return tlResponseArgsError("不在线")
    }
    
    return tlResponseSuccess("在线", userInfo)
}



module.exports = {
    userIsLogin
}