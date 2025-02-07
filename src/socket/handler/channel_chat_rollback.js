const {socketClientEvent} = require("../event");
const userSessionService = require('../../service/user/tl_user_session_service')
const channelUserService = require('../../service/channel/tl_channel_user_service')
const { fields: channelUserFields } = require('../../tables/tl_channel_user')
const { Def: TlChannelUserDef } = channelUserFields


/**
 * 广播聊天消息撤回
 * @param {*} io socketio对象
 * @param {*} socket 单个socket连接
 * @param {*} data event参数
 * @returns 
 */
async function channelChatRollback(io, socket, data){
    let channel = data.channel
    let messageId = data.messageId
    let rollbackMessage = data.rollbackMessage
    let to = data.to

    const token = socket.token;

    if(!channel){
        return
    }

    const {
        loginUserId, loginUserCompanyId
    } = await userSessionService.getUserInfoByToken({token})

    if(!loginUserId){
        return
    }

    // 指定人，无须频道广播
    if (to){
        const toClient = io.sockets.connected[to]
        if (toClient){
            toClient.emit(socketClientEvent.channelChatRollback, {
                channel: data.channel,
                messageId: messageId,
                from: socket.id,
                rollbackMessage: rollbackMessage,
            })
        }
        return
    }

    // 拿到当前频道下的所有用户socketid，进行广播
    const channelUserList = await channelUserService.getListByChannelId({
        channelId: channel,
        companyId: loginUserCompanyId
    }, [
        TlChannelUserDef.userId
    ])

    const userIds = channelUserList.map(item => item[TlChannelUserDef.userId])

    // 广播给频道内的所有用户
    for(let userId of userIds){
        if(userId === loginUserId){
            continue
        }
        io.sockets.in(userId).emit(socketClientEvent.channelChatRollback, {
            channel: data.channel,
            messageId: messageId,
            from: socket.id,
            rollbackMessage: rollbackMessage,
        })
    }
}

module.exports = {
    channelChatRollback
}