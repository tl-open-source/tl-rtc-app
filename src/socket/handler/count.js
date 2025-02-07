const {socketClientEvent} = require("../event");


/**
 * 在线人数统计广播
 * @param {*} io socketio对象
 * @param {*} socket 单个socket连接
 * @param {*} data event参数
 * @returns 
 */
async function count(io, socket, data){
    let allManCount = Object.keys(io.sockets.connected).length || 0;
    
    io.sockets.emit(socketClientEvent.count, {
        mc : allManCount
    })
}

module.exports = {
    count
}