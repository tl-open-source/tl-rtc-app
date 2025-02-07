const tl_user_tag_fields = {
    Name: 'tl_user_tag',
    Description: '用户标签表, 主要定义用户频道分组标签，用户好友标签等',
    Def: {
        id : 'id',
        companyId : 'company_id',
        userId : 'user_id',
        name : 'name',
        type : 'type',
        createdAt : 'createdAt',
        updatedAt : 'updatedAt',
        deletedAt : 'deletedAt',
    },
    Type: {
        CHANNEL: 1,  // 频道分组标签
        FRIEND: 2,   // 好友分组标签
        CLOUD: 3,    // 资源库文件标签
    },
}

const tl_user_tag_model = function(DataTypes){
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
            name: {
                type: DataTypes.STRING(255),
                comment: '标签名称',
            },
            type: {
                type: DataTypes.INTEGER,
                comment: '标签类型',
            },
        },
        options : {
			timestamps: true,
			comment: '用户标签记录表',
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
            TlUserTag: sequelize.define(
                'tl_user_tag', 
                tl_user_tag_model(DataTypes).model, 
                tl_user_tag_model(DataTypes).options
            )
        }
    },
    fields: tl_user_tag_fields
}