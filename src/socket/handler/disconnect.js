const socketCount = require("./count");
const {socketClientEvent} = require("../event");


/**
 * 断开连接的操作
 * @param {*} io socketio对象
 * @param {*} socket 单个socket连接
 * @param {*} data event参数
 */
async function disconnect(io, socket, data){
    socket.broadcast.emit(socketClientEvent.exit, {
        from : socket.id,
    });
    
    socketCount.count(io, socket, data);
}

module.exports = {
    disconnect
}