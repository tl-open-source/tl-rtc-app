/**
 * 服务端监听事件
 * event事件名称
 */


module.exports = {
    // socket连接
    connection : "connection",
    // socket断开连接
    disconnect : "disconnect",
    // webrtc offer
    offer : "offer",
    // webrtc answer
    answer : "answer",
    // webrtc candidate
    candidate : "candidate",
    // 在线人数
    count : "count",
    // 退出
    exit : "exit",
    // 加入/创建房间
    createAndJoin : "createAndJoin",
    // 心跳
    heartbeat : "heartbeat",
    // 广播聊天消息
    channelChat: "channelChat",
    // 广播好友申请
    contactApply: "contactApply",
    // 通过好友申请
    contactApplyPass: "contactApplyPass",
    // 拒绝好友申请
    contactApplyReject: "contactApplyReject",
    // 广播群组申请
    groupApply: "groupApply",
    // 通过群组申请
    groupApplyPass: "groupApplyPass",
    // 拒绝群组申请
    groupApplyReject: "groupApplyReject",
    // 广播视频消息
    channelVideoCall: "channelVideoCall",
    // 文件
    channelFile: "channelFile",
}