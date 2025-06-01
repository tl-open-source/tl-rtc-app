const {socketClientEvent} = require("../event");
const userSessionService = require('../../service/user/tl_user_session_service')
const channelUserService = require('../../service/channel/tl_channel_user_service')
const { fields: channelUserFields } = require('../../tables/tl_channel_user')
const { inner: TlRoleInner } = require('../../tables/tl_role')
const { Def: TlChannelUserDef } = channelUserFields


/**
 * 广播群组申请消息
 * @param {*} io socketio对象
 * @param {*} socket 单个socket连接
 * @param {*} data event参数
 * @returns 
 */
async function groupApply(io, socket, data){
    let channelId = data.channelId
    let applyInfo = data.applyInfo
    let to = data.to

    const token = socket.token;

    if(!channelId){
        return
    }

    const {
        loginUserId, loginUsername, loginUserCompanyId
    } = await userSessionService.getUserInfoByToken({token})

    if(!loginUserId){
        return
    }

    // 指定人，无须频道广播
    if (to){
        const toClient = io.sockets.connected[to]
        if (toClient){
            toClient.emit(socketClientEvent.groupApply, {
                fromUsername: loginUsername,
                applyInfo: applyInfo,
                from: socket.id,
            })
        }
        return
    }

    // 获取频道创建人
    const channelUserList = await channelUserService.getListByChannelIdAndRoleId({
        companyId: loginUserCompanyId,
        channelId: channelId,
        roleId: TlRoleInner.channel.creator.id
    })

    if(channelUserList.length === 0){
        return
    }

    const channelCreatorUserInfo = channelUserList[0]

    const userId = channelCreatorUserInfo[TlChannelUserDef.userId]

    io.sockets.in(userId).emit(socketClientEvent.groupApply, {
        fromUsername: loginUsername,
        applyInfo: applyInfo,
        from: socket.id,
    })
}

module.exports = {
    groupApply
}