const tl_channel_file_fields = {
    Name: 'tl_channel_file',
    Description: '频道文件记录表，所有企业，用户的单聊，群聊文件记录表',
    Def: {
        id : 'id',
        companyId : 'company_id',
        channelId : 'channel_id',
        flag : 'flag',
        cloudFileId : 'cloud_file_id',
        other : 'other',
        fromUserId : 'from_user_id',
        fromUserName : 'from_user_name',
        type : 'type',
        status : 'status',
        messageTimeStamp : 'message_ts',
        messageVersion : 'message_version',
        createdAt : 'createdAt',
        updatedAt : 'updatedAt',
        deletedAt : 'deletedAt',
    },  
    Flag: {
    },
    Other: {
        ip: 'ip', // ip地址
    },
    Type : {
        P2P : 'p2p', // 在线
        OFFLINE: 'offline', // 离线/资源库
    },
    Status : {
        INIT: 1, // 发起中
        RECEIVING: 2, // 接收中
        RECEIVED : 3, // 已接收
    },
}

const tl_channel_file_model = function(DataTypes){
    return {
        model : {
            id: {
                type: DataTypes.INTEGER,
                comment: '文件记录id',
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
            flag: {
                type: DataTypes.INTEGER,
                comment: '标志位',
                defaultValue: 0,
            },
            cloud_file_id: {
                type: DataTypes.INTEGER,
                comment: '云文件id'
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
            type : {
                type: DataTypes.STRING(8),
                comment: '文件消息类型'
            },
            status : {
                type: DataTypes.INTEGER,
                comment: '文件记录状态'
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
			comment: '文件记录表',
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
            TlChannelFile: sequelize.define(
                'tl_channel_file', 
                tl_channel_file_model(DataTypes).model, 
                tl_channel_file_model(DataTypes).options
            )
        }
    },
    fields: tl_channel_file_fields
}