const tl_channel_fields = {
    Name: 'tl_channel',
    Description: '频道表，主要定义单聊，群聊等创建的各种频道记录',
    Def: {
        id : 'id',
        companyId : 'company_id',
        flag : 'flag',
        name : 'name',
        status: 'status',
        type: 'type',
        createdAt : 'createdAt',
        updatedAt : 'updatedAt',
        deletedAt : 'deletedAt',
    },
    Type: {
        GROUP : 1, // 群聊
        FRIEND : 2, // 好友
    },
    Status: {
        NORMAL: 1, //正常
    }
}

const tl_channel_model = function(DataTypes){
    return {
        model : {
            id: {
                type: DataTypes.INTEGER,
                comment: '频道id',
                primaryKey: true,
                autoIncrement: true
            },
            company_id: {
                type: DataTypes.INTEGER,
                comment: '企业id'
            },
            flag: {
                type: DataTypes.INTEGER,
                comment: '标志位',
                defaultValue: 0,
            },
            name : {
                type: DataTypes.STRING(64),
                comment: '频道名称'
            },
            type: {
                type: DataTypes.INTEGER,
                comment: '频道类型',
            },
            status: {
                type: DataTypes.INTEGER,
                comment: '频道状态',
                defaultValue: tl_channel_fields.Status.NORMAL
            },
        },
        options : {
			timestamps: true,
			comment: '频道记录表',
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
            TlChannel: sequelize.define(
                'tl_channel', 
                tl_channel_model(DataTypes).model, 
                tl_channel_model(DataTypes).options
            )
        }
    },
    fields: tl_channel_fields
}