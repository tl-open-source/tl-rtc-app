const {socketClientEvent} = require("../event");
const userSessionService = require('../../service/user/tl_user_session_service')


/**
 * 广播通过群组申请消息
 * @param {*} io socketio对象
 * @param {*} socket 单个socket连接
 * @param {*} data event参数
 * @returns 
 */
async function groupApplyPass(io, socket, data){
    let userId = data.userId
    let passInfo = data.passInfo
    let to = data.to

    const token = socket.token;

    if(!userId){
        return
    }

    const {
        loginUserId, loginUsername, loginUserCompanyId
    } = await userSessionService.getUserInfoByToken({token})

    if(!loginUserId){
        return
    }

    // 指定人，无须频道广播
    if (to){
        const toClient = io.sockets.connected[to]
        if (toClient){
            toClient.emit(socketClientEvent.groupApplyPass, {
                fromUsername: loginUsername,
                passInfo: passInfo,
                from: socket.id,
            })
        }
        return
    }

    io.sockets.in(userId).emit(socketClientEvent.groupApplyPass, {
        fromUsername: loginUsername,
        passInfo: passInfo,
        from: socket.id,
    })
}

module.exports = {
    groupApplyPass
}