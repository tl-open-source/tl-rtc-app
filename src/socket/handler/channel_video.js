const {socketClientEvent} = require("../event");
const userSessionService = require('../../service/user/tl_user_session_service')
const channelUserService = require('../../service/channel/tl_channel_user_service')
const { fields: channelUserFields } = require('../../tables/tl_channel_user')
const { Def: TlChannelUserDef } = channelUserFields


/**
 * 广播视频通话消息
 * @param {*} io socketio对象
 * @param {*} socket 单个socket连接
 * @param {*} data event参数
 * @returns 
 */
async function channelVideoCall(io, socket, data){
    let channel = data.channel;
    let videoCallInfo = data.videoCallInfo
    let videoCallInfoType = videoCallInfo.type
    let to = videoCallInfo.to

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

    // 邀请方信息收集
    if(videoCallInfoType === 'try-invite'){
        const channelUserList = await channelUserService.getListByChannelId({
            channelId: channel,
            companyId: loginUserCompanyId
        }, [
            TlChannelUserDef.userId
        ])

        const userIds = channelUserList.map(item => item[TlChannelUserDef.userId])
        videoCallInfo.inviterInviteList = userIds.filter(userId => userId !== loginUserId)
    }

    // 指定人发送
    if(to){
        let otherClient = io.sockets.connected[to];
        if (!otherClient){
            return;
        }
        otherClient.emit(socketClientEvent.channelVideoCall, {
            channel: data.channel,
            videoCallInfo: videoCallInfo,
            from: socket.id,
        });

        return
    }

    // 拿到当前频道下的所有用户socketid，进行广播
    const channelUserList = await channelUserService.getListByChannelId({
        channelId: channel,
        companyId: loginUserCompanyId
    }, [
        TlChannelUserDef.userId
    ])

    const userIds = channelUserList.map(item => item[TlChannelUserDef.userId])

    // 广播给频道内的所有用户
    for(let userId of userIds){
        if(userId === loginUserId){
            continue
        }
        io.sockets.in(userId).emit(socketClientEvent.channelVideoCall, {
            channel: data.channel,
            videoCallInfo: videoCallInfo,
            from: socket.id,
        })
    }
}

module.exports = {
    channelVideoCall
}