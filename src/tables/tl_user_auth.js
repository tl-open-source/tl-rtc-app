const tl_user_auth_fields = {
    Name: 'tl_user_auth',
    Description: '用户认证表, 主要定义用户各种认证记录，如邮箱认证，手机号认证等',
    Def: {
        id : 'id',
        key: 'key',
        type : 'type',
        code : 'code',
        createdAt : 'createdAt',
        updatedAt : 'updatedAt',
        deletedAt : 'deletedAt',
    },
    Type: {
        EMAIL_REGISTER_CODE: 1,
        PHONE_REGISTER_CODE: 2,
        PHONE_LOGIN_CODE: 3,
    },
}

const tl_user_auth_model = function(DataTypes){
    return {
        model : {
            id: {
                type: DataTypes.INTEGER,
                comment: '认证id',
                primaryKey: true,
                autoIncrement: true
            },
            key: {
                type: DataTypes.STRING,
                comment: '认证key'
            },
            code: {
                type: DataTypes.STRING(16),
                comment: '认证code'
            },
            type: {
                type: DataTypes.INTEGER,
                comment: '认证类型'
            },
        },
        options : {
			timestamps: true,
			comment: '用户认证记录表',
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
            TlUserAuth: sequelize.define(
                'tl_user_auth', 
                tl_user_auth_model(DataTypes).model, 
                tl_user_auth_model(DataTypes).options
            )
        }
    },
    fields: tl_user_auth_fields
}