const {socketClientEvent} = require("../event");
const userSessionService = require('../../service/user/tl_user_session_service')
const cache = require('../../utils/cache/cache')


/**
 * 登陆态校验
 * @param {*} io socketio对象
 * @param {*} socket 单个socket连接
 * @returns 
 */
async function auth(io, socket){
    const { token } = socket.handshake.query;
    
    if(!token){
        return
    }

    const {
        loginUserId, loginUserCompanyId, logniTime
    } = await userSessionService.getUserInfoByToken({token})

    if(!loginUserId){
        return
    }

    // 更新socketId和userId的映射关系
    await cache.setUserIdSocketIdMap({
        companyId: loginUserCompanyId,
        userId: loginUserId,
        socketId: socket.id
    })

    // 加入个人房间
    socket.join(loginUserId)

    // 设置token
    socket.token = token

    return
}

module.exports = {
    auth
}