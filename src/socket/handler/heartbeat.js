const {socketClientEvent} = require("../event");


/**
 * 心跳
 * @param {*} io socketio对象
 * @param {*} socket 单个socket连接
 * @param {*} data event参数
 * @returns 
 */
async function heartbeat(io, socket, data){
    socket.emit(socketClientEvent.heartbeat, {
        status : "ok"
    })
}

module.exports = {
    heartbeat
}