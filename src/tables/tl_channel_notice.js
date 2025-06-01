const tl_channel_notice_fields = {
    Name: 'tl_channel_notice',
    Description: '频道公告表，主要定义群聊频道公告记录',
    Def: {
        id : 'id',
        companyId : 'company_id',
        channelId : 'channel_id',
        userId: 'user_id',
        content: 'content',
        flag : 'flag',
        createdAt : 'createdAt',
        updatedAt : 'updatedAt',
        deletedAt : 'deletedAt',
    },
    Flag: {
        IS_SET_TOP: 1, // 置顶
    }
}

const tl_channel_notice_model = function(DataTypes){
    return {
        model : {
            id: {
                type: DataTypes.INTEGER,
                comment: '公告id',
                primaryKey: true,
                autoIncrement: true
            },
            channel_id: {
                type: DataTypes.INTEGER,
                comment: '频道id'
            },
            company_id: {
                type: DataTypes.INTEGER,
                comment: '企业id'
            },
            user_id: {
                type: DataTypes.INTEGER,
                comment: '用户id'
            },
            flag: {
                type: DataTypes.INTEGER,
                comment: '标志位',
                defaultValue: 0,
            },
            content : {
                type: DataTypes.TEXT,
                comment: '公告内容'
            },
            type: {
                type: DataTypes.INTEGER,
                comment: '公告类型',
            },
        },
        options : {
			timestamps: true,
			comment: '频道公告记录表',
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
            TlChannelNotice: sequelize.define(
                'tl_channel_notice', 
                tl_channel_notice_model(DataTypes).model, 
                tl_channel_notice_model(DataTypes).options
            )
        }
    },
    fields: tl_channel_notice_fields
}