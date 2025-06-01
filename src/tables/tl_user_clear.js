const tl_user_clear_fields = {
    Name: 'tl_user_clear',
    Description: '频道清理消息记录，一个用户+频道一条记录',
    Def: {
        id: 'id',
        companyId: 'company_id',
        userId: 'user_id',
        channelId : 'channel_id',
        type: 'type',
        latestClearId: 'latest_clear_id',
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
        deletedAt: 'deletedAt'
    },
    Type: {
        CHAT : 1, // 聊天消息
        MEDIA : 2, // 媒体流消息
        FILE: 3, // 文件消息
    },
}

const tl_user_clear_model = function(DataTypes){
    return {
        model : {
            id: {
                type: DataTypes.INTEGER,
                comment: '频道清理消息记录id',
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
            latest_clear_id: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                comment: '频道用户清理最新消息id'
            },
        },
        options : {
			timestamps: true,
			comment: '频道清理消息记录表',
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
            TlUserClear: sequelize.define(
                'tl_user_clear', 
                tl_user_clear_model(DataTypes).model, 
                tl_user_clear_model(DataTypes).options
            )
        }
    },
    fields: tl_user_clear_fields
}