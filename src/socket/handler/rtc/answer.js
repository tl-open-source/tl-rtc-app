const {socketClientEvent} = require("../../event");

/**
 * webrtc answer
 * 转发answer消息至room其他客户端 [from,to,room,sdp]
 * @param {*} io socketio对象
 * @param {*} socket 单个socket连接
 * @param {*} data event参数
 * @returns 
 */
async function answer(io, socket, data){
    let otherClient = io.sockets.connected[data.to];
    if (!otherClient) {
        return;
    }
    otherClient.emit(socketClientEvent.answer, data);
}

module.exports = {
    answer
}