const socketCount = require("./handler/count");
const socketExit = require("./handler/exit");
const socketHeartbeat = require("./handler/heartbeat");
const socketDisConnect = require("./handler/disconnect");
const socketChannelChat = require("./handler/channel_chat");
const socketChannelChatRollback = require("./handler/channel_chat_rollback");
const socketContactApply = require('./handler/contact_apply')
const socketContactApplyPass = require('./handler/contact_apply_pass')
const socketContactApplyReject = require('./handler/contact_apply_reject')
const socketAuth = require("./handler/auth");
const {socketServerEvent} = require("./event");


module.exports = (io, socket) => {
    // 登陆态校验
    socketAuth.auth(io, socket)

    // 断开连接
    socket.on(socketServerEvent.disconnect, (data)=>{
        socketDisConnect.disconnect(io, socket, data)
    });

    // 在线人数统计
    socket.on(socketServerEvent.count, (data) => {
        socketCount.count(io, socket, data)
    });

    // 退出房间
    socket.on(socketServerEvent.exit, (data) => {
        socketExit.exit(io, socket, data)
    });

    // 心跳
    socket.on(socketServerEvent.heartbeat, (data) => {
        socketHeartbeat.heartbeat(io, socket, data)
    });

    // 广播聊天消息
    socket.on(socketServerEvent.channelChat, (data) => {
        socketChannelChat.channelChat(io, socket, data)
    })

    // 广播聊天消息撤回
    socket.on(socketServerEvent.channelChatRollback, (data) => {
        socketChannelChatRollback.channelChatRollback(io, socket, data)
    })

    // 广播好友申请消息
    socket.on(socketServerEvent.contactApply, (data) => {
        socketContactApply.contactApply(io, socket, data)
    })

    // 通过好友申请
    socket.on(socketServerEvent.contactApplyPass, (data) => {
        socketContactApplyPass.contactApplyPass(io, socket, data)
    })

    // 拒绝好友申请
    socket.on(socketServerEvent.contactApplyReject, (data) => {
        socketContactApplyReject.contactApplyReject(io, socket, data)
    })
    
    // 触发一次count
    socketCount.count(io, socket, {})
}