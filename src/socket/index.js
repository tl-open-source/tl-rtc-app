const connect = require("./connect");
const {socketServerEvent} = require("./event");
const {
    tlConsole
} = require("./../utils/utils");


/**
 * socket事件初始化入口
 * @param {*} io 
 * @returns 
 */
async function execute(io) {
    if (io === undefined || io === null) {
        tlConsole("io is null")
        return;
    }

    io.sockets.on(socketServerEvent.connection, function (socket) {
        if(socket.id === undefined || socket.id === null || socket.id === 0 || socket.id === "0"){
            socket.emit("tips", {
                to: socket.id,
                msg: "非法连接"
            });
            return
        }
        connect(io, socket)
    });
}

module.exports = {
    execute
}