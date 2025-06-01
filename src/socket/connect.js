const rtcOffer = require("./handler/rtc/offer");
const rtcAnswer = require("./handler/rtc/answer");
const rtcCandidate = require("./handler/rtc/candidate");
const socketCount = require("./handler/count");
const socketExit = require("./handler/exit");
const socketHeartbeat = require("./handler/heartbeat");
const socketDisConnect = require("./handler/disconnect");
const socketChannelChat = require("./handler/channel_chat");
const socketChannelVideo = require("./handler/channel_video")
const socketContactApply = require('./handler/contact_apply')
const socketContactApplyPass = require('./handler/contact_apply_pass')
const socketContactApplyReject = require('./handler/contact_apply_reject')
const socketGroupApply = require('./handler/group_apply')
const socketGroupApplyPass = require('./handler/group_apply_pass')
const socketGroupApplyReject = require('./handler/group_apply_reject')
const socketChannelFile = require('./handler/channel_file')
const socketAuth = require("./handler/auth");
const {socketServerEvent} = require("./event");


module.exports = (io, socket) => {
    // 登陆态校验
    socketAuth.auth(io, socket)

    // webrtc offer 消息
    socket.on(socketServerEvent.offer, (data) => {
        rtcOffer.offer(io, socket, data)
    });

    // webrtc answer 消息
    socket.on(socketServerEvent.answer, (data) => {
        rtcAnswer.answer(io, socket, data)
    });

    // webrtc candidate 消息
    socket.on(socketServerEvent.candidate, (data) => {
        rtcCandidate.candidate(io, socket, data)
    });

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

    // 广播视频消息
    socket.on(socketServerEvent.channelVideoCall, (data) => {
        socketChannelVideo.channelVideoCall(io, socket, data)
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

    // 广播群组申请消息
    socket.on(socketServerEvent.groupApply, (data) => {
        socketGroupApply.groupApply(io, socket, data)
    })

    // 通过群组申请
    socket.on(socketServerEvent.groupApplyPass, (data) => {
        socketGroupApplyPass.groupApplyPass(io, socket, data)
    })

    // 拒绝群组申请
    socket.on(socketServerEvent.groupApplyReject, (data) => {
        socketGroupApplyReject.groupApplyReject(io, socket, data)
    })
    
    // p2p频道
    socket.on(socketServerEvent.p2pChannel, (data) => {
        socketP2pChannel.p2pChannel(io, socket, data)
    })

    // 频道文件
    socket.on(socketServerEvent.channelFile, (data) => {
        socketChannelFile.channelFile(io, socket, data)
    })
    
    // 触发一次count
    socketCount.count(io, socket, {})
}