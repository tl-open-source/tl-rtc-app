const tl_channel_user_fields = {
    Name: 'tl_channel_user',
    Description: '频道用户表，主要定义单聊，群聊等创建的各种频道中的用户信息',
    Def: {
        id : 'id',
        companyId : 'company_id',
        channelId : 'channel_id',
        userId : 'user_id',
        flag : 'flag',
        roleId : 'role_id',
        type: 'type',
        status : 'status',
        createdAt : 'createdAt',
        updatedAt : 'updatedAt',
        deletedAt : 'deletedAt',
    },
    Type: {
        GROUP : 1, // 群聊
        FRIEND : 2, // 好友

        toStr: function(type){
            switch(type){
                case this.GROUP:
                    return 'GROUP';
                case this.FRIEND:
                    return 'FRIEND';
                default:
                    return 'UNKNOWN';
            }
        },

        toZnStr: function(type){
            switch(type){
                case this.GROUP:
                    return '群聊';
                case this.FRIEND:
                    return '好友';
                default:
                    return '未知类型';
            }
        }
    },
    Status: {
        NORMAL: 1, //正常
        BLACK: 2, // 黑名单

        toStr: function(status){
            switch(status){
                case this.NORMAL:
                    return 'NORMAL';
                case this.BLACK:
                    return 'BLACK';
                default:
                    return 'UNKNOWN';
            }
        },

        toZnStr: function(status){
            switch(status){
                case this.NORMAL:
                    return '正常';
                case this.BLACK:
                    return '黑名单';
                default:
                    return '未知状态';
            }
        }
    },
    Flag: {
        IS_SET_TOP: 1, // 置顶
        IS_SET_BLACK: 2, // 拉黑
        IS_SET_HIDDEN: 3, // 不显示
        IS_SET_MUTE: 4, // 静音/免打扰
    }
}

const tl_channel_user_model = function(DataTypes){
    return {
        model : {
            id: {
                type: DataTypes.INTEGER,
                comment: '频道用户记录id',
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
            type: {
                type: DataTypes.INTEGER,
                comment: '频道类型',
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
            role_id: {
                type: DataTypes.INTEGER,
                comment: '角色id'
            },
            status: {
                type: DataTypes.INTEGER,
                comment: '群聊用户状态',
                defaultValue: tl_channel_user_fields.Status.NORMAL
            }
        },
        options : {
			timestamps: true,
			comment: '频道用户记录表',
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
            TlChannelUser: sequelize.define(
                'tl_channel_user', 
                tl_channel_user_model(DataTypes).model, 
                tl_channel_user_model(DataTypes).options
            )
        }
    },
    fields: tl_channel_user_fields
}