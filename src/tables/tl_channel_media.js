const tl_channel_media_fields = {
    Name: 'tl_channel_media',
    Description: '频道媒体流记录表，所有企业，用户的单聊，群聊媒体流记录表，如视频通话，语音通话，屏幕共享，远程画笔等',
    Def: {
        id: 'id',
        companyId: 'company_id',
        channelId : 'channel_id',
        type : 'type',
        status : 'status',
        flag: 'flag',
        media: 'media',
        other: 'other',
        fromUserId: 'from_user_id',
        fromUserName:'from_user_name',
        messageTimeStamp: 'message_ts',
        messageVersion: 'message_version',
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
        deletedAt: 'deletedAt'
    },
    Flag: {
    },
    Other: {
        ip: 'ip', // ip地址
    },
    Status : {
        INIT: 1, // 发起中
        RECEIVING: 2, // 接收中
        RECEIVED : 3, // 已接收
    },
    Media: {
        URL : 'url', // 媒体流内容字段url 
    },
    Type  :{
        VIDEO : 'video', // 视频通话
        AUDIO : 'audio', // 语音通话
    },
}

const tl_channel_media_model = function(DataTypes){
    return {
        model : {
            id: {
                type: DataTypes.INTEGER,
                comment: '媒体流记录id',
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
                comment: '媒体流消息类型'
            },
            status : {
                type: DataTypes.INTEGER,
                comment: '媒体流记录状态'
            },
            flag: {
                type: DataTypes.INTEGER,
                comment: '标志位',
                defaultValue: 0,
            },
            media: {
                type: DataTypes.TEXT,
                comment: '媒体流内容'
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
			comment: '媒体流记录表',
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
            TlChannelMedia: sequelize.define(
                'tl_channel_media', 
                tl_channel_media_model(DataTypes).model, 
                tl_channel_media_model(DataTypes).options
            )
        }
    },
    fields: tl_channel_media_fields
}