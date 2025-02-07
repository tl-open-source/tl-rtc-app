/**
 * 客户端监听事件
 * event事件名称
 */

module.exports = {
    // 创建房间
    created : "created",
    // 加入房间
    joined : "joined",
    // 退出
    exit : "exit",
    // 人数
    count : "count",
    // 心跳
    heartbeat : "heartbeat",
    // 广播聊天消息
    channelChat: "channelChat",
    // 广播聊天消息撤回
    channelChatRollback: "channelChatRollback",
    // 广播好友申请
    contactApply: "contactApply",
    // 通过好友申请
    contactApplyPass: "contactApplyPass",
    // 拒绝好友申请
    contactApplyReject: "contactApplyReject",
}
