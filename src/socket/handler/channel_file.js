const {socketClientEvent} = require("../event");
const userSessionService = require('../../service/user/tl_user_session_service')

const channelUserService = require('../../service/channel/tl_channel_user_service')
const { fields: channelUserFields } = require('../../tables/tl_channel_user')
const { Def: TlChannelUserDef } = channelUserFields


/**
 * 广播文件消息
 * @param {*} io socketio对象
 * @param {*} socket 单个socket连接
 * @param {*} data event参数
 * @returns 
 */
async function channelFile(io, socket, data){
    let channel = data.channel
    let fileInfo = data.fileInfo
    let to = data.to

    const token = socket.token;

    if(!channel){
        return
    }

    channel = parseInt(channel)

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
            toClient.emit(socketClientEvent.channelFile, {
                channel: data.channel,
                fileInfo: fileInfo,
                from: socket.id,
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

    const userIds = channelUserList.map(item => item[TlP2pChannelUserDef.userId])
    
    // 广播给频道内的所有用户
    for(let userId of userIds){
        if(userId === loginUserId){
            continue
        }
        io.sockets.in(userId).emit(socketClientEvent.channelFile, {
            channel: data.channel,
            fileInfo: fileInfo,
            from: socket.id,
        })
    }
}

module.exports = {
    channelFile
}