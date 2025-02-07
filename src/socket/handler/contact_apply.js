const {socketClientEvent} = require("../event");
const userSessionService = require('../../service/user/tl_user_session_service')
const channelUserService = require('../../service/channel/tl_channel_user_service')
const { fields: channelUserFields } = require('../../tables/tl_channel_user')
const { Def: TlChannelUserDef } = channelUserFields


/**
 * 广播好友申请消息
 * @param {*} io socketio对象
 * @param {*} socket 单个socket连接
 * @param {*} data event参数
 * @returns 
 */
async function contactApply(io, socket, data){
    let userId = data.userId
    let applyInfo = data.applyInfo
    let to = data.to

    const token = socket.token;

    if(!userId){
        return
    }

    const {
        loginUserId, loginUsername
    } = await userSessionService.getUserInfoByToken({token})

    if(!loginUserId){
        return
    }

    // 指定人，无须频道广播
    if (to){
        const toClient = io.sockets.connected[to]
        if (toClient){
            toClient.emit(socketClientEvent.contactApply, {
                fromUsername: loginUsername,
                applyInfo: applyInfo,
                from: socket.id,
            })
        }
        return
    }

    io.sockets.in(userId).emit(socketClientEvent.contactApply, {
        fromUsername: loginUsername,
        applyInfo: applyInfo,
        from: socket.id,
    })
}

module.exports = {
    contactApply
}