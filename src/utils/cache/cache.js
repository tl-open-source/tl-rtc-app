const {
    getRedisClient
} = require('./redis');

const {
    USER_KEYS,
} = require('./cache_key');
const {
    LOGIN : {
        LOGIN_TOKEN_EXPIRE,

        SYSTEM_LOGIN_TOKEN_EXPIRE
    }
} = require('../../utils/constant');


/**
 * 设置登录信息
 * 1小时过期
 * @param {*} token 
 * @param {*} loginInfo 
 * @param {*} isSystem
 */
const setLoginInfo = async function({
    token, loginInfo, isSystem = false
}){
    const key = USER_KEYS.USER_LOGIN_INFO + token;

    const redisClient = getRedisClient();

    await redisClient.set(key, loginInfo);

    if(isSystem){
        await redisClient.expire(key, SYSTEM_LOGIN_TOKEN_EXPIRE);
    }else{
        await redisClient.expire(key, LOGIN_TOKEN_EXPIRE);
    }
}


/**
 * 获取登录信息
 * @param {*} token 
 * @returns 
 */
const getLoginInfo = async function({token}){
    const key = USER_KEYS.USER_LOGIN_INFO + token;

    const redisClient = getRedisClient();

    return await redisClient.get(key);
}

/**
 * 设置用户登录状态
 * 1小时过期
 * @param {*} userId 
 * @param {*} status 
 * @param {*} isSystem
 */
const setLoginStatus = async function({
    userId, status, isSystem = false
}){
    const key = USER_KEYS.USER_LOGIN_STATUS + userId;

    const redisClient = getRedisClient();

    await redisClient.set(key, status);

    if(isSystem){
        await redisClient.expire(key, SYSTEM_LOGIN_TOKEN_EXPIRE);
    }else{
        await redisClient.expire(key, LOGIN_TOKEN_EXPIRE);
    }
}

/**
 * 获取用户登录状态
 * @param {*} userId 
 */
const getLoginStatus = async function({userId}){
    const key = USER_KEYS.USER_LOGIN_STATUS + userId;

    const redisClient = getRedisClient();

    return await redisClient.get(key);
}

/**
 * 获取用户登录状态列表
 * @param {*} userIdList 
 * @returns 
 */
const getLoginStatusList = async function({userIdList}){
    const keyList = userIdList.map(userId => USER_KEYS.USER_LOGIN_STATUS + userId);

    const redisClient = getRedisClient();

    return await redisClient.mGet(keyList);
}

/**
 * 设置用户信息
 * 1小时过期
 * @param {*} userId 
 * @param {*} userInfo
 * @param {*} isSystem
 * @returns 
 */
const setUserInfo = async function({
    userId, userInfo, isSystem = false
}){
    const cacheKey = USER_KEYS.USER_INFO + userId;

    const redisClient = getRedisClient();

    await redisClient.set(cacheKey, userInfo);

    if(isSystem){
        await redisClient.expire(cacheKey, SYSTEM_LOGIN_TOKEN_EXPIRE);
    }else{
        await redisClient.expire(cacheKey, LOGIN_TOKEN_EXPIRE);
    }
}


/**
 * 获取用户信息
 * @param {*} userId 
 * @returns 
 */
const getUserInfo = async function({userId}){
    const cacheKey = USER_KEYS.USER_INFO + userId;

    const redisClient = getRedisClient();

    return await redisClient.get(cacheKey);
}


/**
 * 设置socketId和userId的映射关系
 * 1小时过期
 * @param {*} socketId 
 * @param {*} userId 
 * @param {*} companyId
 * @param {*} isSystem
 */
const setUserIdSocketIdMap = async function({
    companyId, userId, socketId, isSystem = false
}){
    const cacheKey = USER_KEYS.USER_ID_SOCKET_ID_MAP + companyId;

    const redisClient = getRedisClient();

    await redisClient.hSet(cacheKey, {
        [userId]: socketId
    });

    if(isSystem){
        await redisClient.expire(cacheKey, SYSTEM_LOGIN_TOKEN_EXPIRE);
    }else{
        await redisClient.expire(cacheKey, LOGIN_TOKEN_EXPIRE);
    }
}


/**
 * 获取socketId和userId的映射关系
 * @param {*} userId 
 * @returns 
 */
const getUserIdSocketIdMap = async function({userId}){
    const cacheKey = USER_KEYS.USER_ID_SOCKET_ID_MAP;

    const redisClient = getRedisClient();

    return await redisClient.hget(cacheKey, userId);
}

/**
 * 设置邮箱验证码
 * 5分钟过期
 * @param {*} email
 * @param {*} code
 */
const setEmailCode = async function({
    email, code
}){
    const cacheKey = USER_KEYS.USER_EMAIL_CODE + email;

    const redisClient = getRedisClient();

    await redisClient.set(cacheKey, code);
    await redisClient.expire(cacheKey, 5 * 60);
}

/**
 * 获取邮箱验证码
 * @param {*} email
 * @returns 
 */
const getEmailCode = async function({email}){
    const cacheKey = USER_KEYS.USER_EMAIL_CODE + email;

    const redisClient = getRedisClient();

    return await redisClient.get(cacheKey);
}

/**
 * 设置手机号验证码
 * 5分钟过期
 * @param {*} phone
 * @param {*} code
 * @returns 
 */
const setPhoneCode = async function({phone, code}){
    const cacheKey = USER_KEYS.USER_PHONE_CODE + phone;

    const redisClient = getRedisClient();

    await redisClient.set(cacheKey, code);
    await redisClient.expire(cacheKey, 5 * 60);
}

/**
 * 获取手机号验证码
 * @param {*} phone
 * @returns 
 */
const getPhoneCode = async function({phone}){
    const cacheKey = USER_KEYS.USER_PHONE_CODE + phone;

    const redisClient = getRedisClient();

    return await redisClient.get(cacheKey);
}

/**
 * 批量设置用户频道角色
 * @param {*} userId
 * @param {*} channelRoleMap
 */
const setUserChannelRoleMap = async function({userId, channelRoleMap}){

    const cacheKey = USER_KEYS.USER_CHANNEL_PERMISSION + userId;

    const redisClient = getRedisClient();

    await redisClient.hSet(cacheKey, channelRoleMap);
    await redisClient.expire(cacheKey, LOGIN_TOKEN_EXPIRE);
}

/**
 * 更新用户频道角色
 * @param {*} userId
 * @param {*} channelRoleMap
 */
const updateUserChannelRoleMap = async function({userId, channelRoleMap}){
    const cacheKey = USER_KEYS.USER_CHANNEL_PERMISSION + userId;

    const redisClient = getRedisClient();

    await redisClient.hSet(cacheKey, channelRoleMap);
}

/**
 * 批量更新用户频道角色
 * @param {*} userId
 * @param {*} channelRoleMap
 */
const batchUpdateUserChannelRoleMap = async function({userIdList, channelRoleMap}){
    const redisClient = getRedisClient();

    let multi = redisClient.multi()

    userIdList.forEach(userId => {
        const cacheKey = USER_KEYS.USER_CHANNEL_PERMISSION + userId;
        multi.hSet(cacheKey, channelRoleMap);
    })

    await multi.exec();
}

/**
 * 获取用户所有频道角色
 * @param {*} userId
 * @returns 
 */
const getUserChannelRoleMap = async function({userId}){
    const cacheKey = USER_KEYS.USER_CHANNEL_PERMISSION + userId;

    const redisClient = getRedisClient();

    return await redisClient.hGetAll(cacheKey);
}

/**
 * 获取用户频道角色
 * @param {*} userId
 * @param {*} channelId
 * @returns 
 */
const getUserChannelRole = async function({userId, channelId}){
    const cacheKey = USER_KEYS.USER_CHANNEL_PERMISSION + userId;

    const redisClient = getRedisClient();

    return await redisClient.hGet(cacheKey, channelId);
}


module.exports = {
    setLoginInfo, getLoginInfo,
    setUserInfo, getUserInfo,

    setUserIdSocketIdMap, getUserIdSocketIdMap,

    getLoginStatus, setLoginStatus,
    getLoginStatusList,

    setEmailCode, getEmailCode,
    setPhoneCode, getPhoneCode,

    setUserChannelRoleMap, updateUserChannelRoleMap,
    getUserChannelRoleMap, getUserChannelRole, 
    batchUpdateUserChannelRoleMap
}