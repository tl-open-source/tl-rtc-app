const {socketClientEvent} = require("../../event");

/**
 * webrtc candidate
 * 转发candidate消息至room其他客户端 [from,to,room,candidate[sdpMid,sdpMLineIndex,sdp]]
 * @param {*} io socketio对象
 * @param {*} socket 单个socket连接
 * @param {*} data event参数
 * @returns 
 */
async function candidate(io, socket, data){
    let otherClient = io.sockets.connected[data.to];
    if (!otherClient){
        return;
    }
    otherClient.emit(socketClientEvent.candidate, data);
}

module.exports = {
    candidate
}