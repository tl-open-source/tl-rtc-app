const socketCount = require("./count");
const {socketClientEvent} = require("../event");


/**
 * 退出房间
 * @param {*} io socketio对象
 * @param {*} socket 单个socket连接
 * @param {*} data event参数
 * @returns 
 */
async function exit(io, socket, data){
    
    socket.leave(room);
    
    const clientsInRoom = io.sockets.adapter.rooms[room];
    if (clientsInRoom) {
        let otherSocketIds = Object.keys(clientsInRoom.sockets);
        for (let i = 0; i < otherSocketIds.length; i++) {
            let otherSocket = io.sockets.connected[otherSocketIds[i]];
            otherSocket.emit(socketClientEvent.exit, data);
        }
    }

    socketCount.count(io, socket, data);
}

module.exports = {
    exit
}