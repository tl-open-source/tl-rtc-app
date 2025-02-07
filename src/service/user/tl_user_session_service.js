const { 
    tlResponseArgsError, tlResponseForbidden, tlResponseSvrError, 
    tlResponseTimeout, tlResponseNotFound, tlResponseSuccess,
    tlConsole, tlConsoleError
} = require('../../utils/utils')
const uuid = require('uuid')
const cache = require('../../utils/cache/cache')
const {
    USER_KEYS
} = require('../../utils/cache/cache_key')


/**
 * 通过token获取用户信息
 * @param {*} token
 */
const getUserInfoByToken = async function({token}){
    if(!token){
        return {}
    }

    let info = await cache.getLoginInfo({token})
    
    if(!info){
        return {}
    }
    
    try{
        info = JSON.parse(info)
    }catch(e){
        tlConsoleError(e)
        info = null
    }

    return info
}

/**
 * 通过token设置用户信息
 * @param {*} token
 * @param {*} info
 * @param {*} isLogin
 * @param {*} isWebsite
 */
const setUserInfoByToken = async function({
    token, info, isLogin = true, isWebsite = false
}){
    if(!token){
        return {}
    }

    let jsonInfo = null;

    try{
        jsonInfo = JSON.stringify(info)
    }catch(e){
        tlConsoleError(e)
    }

    if(!jsonInfo){
        return false
    }

    let loginUserId = info.loginUserId

    if(isLogin){
        // 设置userId在线状态
        await cache.setLoginStatus({
            userId: loginUserId,
            status: 1,
            isWebsite
        })
        // 设置token登录态
        return await cache.setLoginInfo({
            token, loginInfo: jsonInfo, isWebsite
        })
    }else{
        // 设置userId在线状态
        await cache.setLoginStatus({
            userId: loginUserId,
            status: 0,
            isWebsite
        })
        // 设置token登录态
        return await cache.setLoginInfo({
            token, loginInfo: '', isWebsite
        })
    }
}


/**
 * 通过userIdList获取登录状态
 * @param {*} userIdList
 */
const getUserLoginStatusByIdList = async function({userIdList}){
    if(!userIdList || userIdList.length === 0){
        return {}
    }

    let statusMap = {}

    let resultList = await cache.getLoginStatusList({userIdList})

    resultList.forEach((status, index) => {
        if(parseInt(status) === 1){
            status = 1
        }else{
            status = 0
        }
        statusMap[parseInt(userIdList[index])] = status
    })

    return statusMap
}


/**
 * 设置登录用户频道权限
 * @param {*} userId
 * @param {*} channelRoleMap
 * @returns
 */
const setUserChannelRoleMap = async function({userId, channelRoleMap}){
    return await cache.setUserChannelRoleMap({userId, channelRoleMap})
}

/**
 * 更新登录用户频道权限
 * @param {*} userId
 * @param {*} channelRoleMap
 */
const updateUserChannelRoleMap = async function({userId, channelRoleMap}){
    return await cache.updateUserChannelRoleMap({userId, channelRoleMap})
}

/**
 * 批量更新登录用户频道权限
 * @param {*} userIdList
 * @param {*} channelRoleMap
 */
const batchUpdateUserChannelRoleMap = async function({userIdList, channelRoleMap}){
    return await cache.batchUpdateUserChannelRoleMap({userIdList, channelRoleMap})
}

/**
 * 获取登录用户所有频道权限
 * @param {*} userId
 * @param {*} channelId
 * @returns 
 */
const getUserChannelRoleMap = async function({userId}){
    return await cache.getUserChannelRoleMap({userId})
}

/**
 * 获取登录用户频道权限
 * @param {*} userId
 * @param {*} channelId
 * @returns 
 */
const getUserChannelRole = async function({userId, channelId}){
    return await cache.getUserChannelRole({userId, channelId})
}


/**
 * 设置邮箱验证码
 * @param {*} email
 * @param {*} code
 */
const setEmailCode = async function({email, code}){
    return await cache.setEmailCode({email, code})
}

/**
 * 获取邮箱验证码
 * @param {*} email
 */
const getEmailCode = async function({email}){
    return await cache.getEmailCode({email})
}

/**
 * 设置手机号验证码
 * @param {*} mobile
 * @param {*} code
 */
const setMobileCode = async function({mobile, code}){
    return await cache.setPhoneCode({mobile, code})
}

/**
 * 获取手机号验证码
 * @param {*} mobile
 */
const getMobileCode = async function({mobile}){
    return await cache.getPhoneCode({mobile})
}

/**
 * 生成token
 */
const generateLoginToken = function(){
    return uuid.v4()
}


module.exports = {
    getUserInfoByToken,
    setUserInfoByToken,
    generateLoginToken,
    getUserLoginStatusByIdList,
    setEmailCode,
    getEmailCode,
    setMobileCode,
    getMobileCode,
    setUserChannelRoleMap,
    getUserChannelRoleMap,
    getUserChannelRole,
    updateUserChannelRoleMap,
    batchUpdateUserChannelRoleMap
}