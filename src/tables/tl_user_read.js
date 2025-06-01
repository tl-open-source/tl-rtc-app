const tl_user_read_fields = {
    Name: 'tl_user_read',
    Description: '频道已读消息，其他已读消息表，聊天消息只存最新消息id，其他消息已读一条就是一条记录',
    Def: {
        id: 'id',
        companyId: 'company_id',
        userId: 'user_id',
        type: 'type',
        channelId : 'channel_id',
        latestReadId: 'latest_read_id',
        recordId: 'record_id',
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
        deletedAt: 'deletedAt'
    },
    Type: {
        CHAT : 1, // 聊天消息
        MEDIA : 2, // 媒体流消息
        FILE: 3, // 文件消息
        FRIEND_APPLY: 4, // 好友申请消息
        FRIEND_APPLY_PASS: 5, // 好友同意消息
        FRIEND_APPLY_REJECT: 6, // 好友拒绝消息
        GROUP_APPLY: 7, // 群申请消息
        GROUP_APPLY_PASS: 8, // 群同意消息
        GROUP_APPLY_REJECT: 9, // 群拒绝消息
    },
}

const tl_user_read_model = function(DataTypes){
    return {
        model : {
            id: {
                type: DataTypes.INTEGER,
                comment: '频道已读记录id',
                primaryKey: true,
                autoIncrement: true
            },
            company_id: {
                type: DataTypes.INTEGER,
                comment: '企业id'
            },
            user_id: {
                type: DataTypes.INTEGER,
                comment: '频道所属用户id'
            },
            type: {
                type: DataTypes.INTEGER,
                comment: '消息类型',
            },
            channel_id: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                comment: '频道id'
            },
            latest_read_id: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                comment: '频道用户已读最新消息id'
            },
            record_id: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                comment: '用户已读消息记录id'
            },
        },
        options : {
			timestamps: true,
			comment: '频道已读记录表',
			indexes: [{
				name: 'created_at_index',
				method: 'BTREE',
				fields: ['created_at']
			}]
		}
    }
}

module.exports = {
    model: function(sequelize, DataTypes){
        return {
            TlUserRead: sequelize.define(
                'tl_user_read', 
                tl_user_read_model(DataTypes).model, 
                tl_user_read_model(DataTypes).options
            )
        }
    },
    fields: tl_user_read_fields
}