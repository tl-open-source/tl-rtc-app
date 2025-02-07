const { 
    tlResponseArgsError, tlResponseForbidden, tlResponseSvrError, 
    tlResponseTimeout, tlResponseNotFound, tlResponseSuccess
} = require('../../utils/utils')
const userService = require('../../service/user/tl_user_service')
const userSessionService = require('../../service/user/tl_user_session_service')


/**
 * 退出登录接口
 * @param {*} token
 */
const userLogout = async function({token}){
    if(!token){
        return tlResponseArgsError("退出成功")
    }

    const {
        loginUserId
    } = await userSessionService.getUserInfoByToken({token})
    if(!loginUserId){
        return tlResponseSuccess("退出成功")
    }

    await userSessionService.setUserInfoByToken({
        token,
        info: {
            loginUserId
        }, 
        isLogin: false
    })
    
    return tlResponseSuccess("退出成功")
}

module.exports = {
    userLogout
}