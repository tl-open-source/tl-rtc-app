const tl_user_notify_fields = {
    Name: 'tl_user_notify',
    Description: '用户通知表',
    Def: {
        id : 'id',
        companyId : 'company_id',
        userId : 'user_id',
        type : 'type',
        title: 'title',
        content: 'content',
        createdAt : 'createdAt',
        updatedAt : 'updatedAt',
        deletedAt : 'deletedAt',
    },
    Type: {
        WORK_CARD: 1, // 工作卡片通知
        SYSTEM_CARD_NOTICE: 2, // 系统卡片通知
    },
}

const tl_user_notify_model = function(DataTypes){
    return {
        model : {
            id: {
                type: DataTypes.INTEGER,
                comment: '标签id',
                primaryKey: true,
                autoIncrement: true
            },
            userId: {
                type: DataTypes.INTEGER,
                comment: '用户id',
            },
            companyId: {
                type: DataTypes.INTEGER,
                comment: '公司id',
            },
            type: {
                type: DataTypes.INTEGER,
                comment: '通知类型',
            },
            title: {
                type: DataTypes.STRING(255),
                comment: '通知标题',
            },
            content: {
                type: DataTypes.TEXT,
                comment: '通知内容',
            }
        },
        options : {
			timestamps: true,
			comment: '用户通知记录表',
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
            TlUserNotify: sequelize.define(
                'tl_user_notify', 
                tl_user_notify_model(DataTypes).model, 
                tl_user_notify_model(DataTypes).options
            )
        }
    },
    fields: tl_user_notify_fields
}