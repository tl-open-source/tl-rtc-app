const tl_channel_chat_fields = {
    Name: 'tl_channel_chat',
    Description: '频道聊天记录表，所有企业，用户的单聊，群聊聊天记录表',
    Def: {
        id : 'id',
        companyId : 'company_id',
        channelId : 'channel_id',
        type : 'type',
        flag : 'flag',
        message : 'message',
        other : 'other',
        fromUserId : 'from_user_id',
        fromUserName : 'from_user_name',
        toUserId : 'to_user_id',
        toUserName : 'to_user_name',
        messageTimeStamp : 'message_ts',
        messageVersion : 'message_version',
        createdAt : 'createdAt',
        updatedAt : 'updatedAt',
        deletedAt : 'deletedAt',
    },
    Flag: {
        IS_ROLL_BACK: 0x1, //是否撤回
        IS_REAL_TEXT: 0x2, // 是否是富文本
        IS_REPLAY: 0x4, // 是否是回复
        IS_AT_USER: 0x8, // 是否是@用户
        IS_AT_ALL: 0x10, // 是否是@所有人
    },
    Other: {
        ip: 'ip', // ip地址
        replyToMessageId: 'reply_to_message_id', // 回复消息id
        replyToMessageType: 'reply_to_message_type', // 回复消息类型
        atUserId: 'at_user_id', // at用户id
        atUserName: 'at_user_name', // at用户昵称
    },
    Type : {
        FRIEND : 'friend', // 好友消息
        GROUP : 'group', // 群消息
        SYSTEM : 'system', // 系统消息
    },
}

const tl_channel_chat_model = function(DataTypes){
    return {
        model : {
            id: {
                type: DataTypes.INTEGER,
                comment: '聊天记录id',
                primaryKey: true,
                autoIncrement: true
            },
            company_id: {
                type: DataTypes.INTEGER,
                comment: '企业id'
            },
            channel_id : {
                type: DataTypes.INTEGER,
                comment: '频道id'
            },
            type : {
                type: DataTypes.STRING(8),
                comment: '消息类型'
            },
            flag: {
                type: DataTypes.INTEGER,
                comment: '标志位',
                defaultValue: 0,
            },
            message: {
                type: DataTypes.STRING(8192),
                comment: '消息内容'
            },
            other: {
                type: DataTypes.TEXT,
                comment: '其他信息, json格式'
            },
            from_user_id: {
                type: DataTypes.INTEGER,
                comment: '发送用户id'
            },
            from_user_name:{
                type: DataTypes.STRING(64),
                comment: '发送用户昵称'
            },
            to_user_id: {
                type: DataTypes.INTEGER,
                comment: '接收用户id'
            },
            to_user_name: {
                type: DataTypes.STRING(64),
                comment: '接收用户昵称'
            },
            message_ts: {
                type: DataTypes.BIGINT,
                comment: '消息时间戳'
            },
            message_version: {
                type: DataTypes.STRING(8),
                comment: '消息版本'
            },
        },
        options : {
			timestamps: true,
			comment: '聊天记录表',
			indexes: [{
				name: 'created_at_index',
				method: 'BTREE',
				fields: ['created_at']
			}, {
                name: 'message_ts_index',
                method: 'BTREE',
                fields: ['message_ts']
            }]
		}
    }
}

module.exports = {
    model: function(sequelize, DataTypes){
        return {
            TlChannelChat: sequelize.define(
                'tl_channel_chat', 
                tl_channel_chat_model(DataTypes).model, 
                tl_channel_chat_model(DataTypes).options
            )
        }
    },
    fields: tl_channel_chat_fields
}