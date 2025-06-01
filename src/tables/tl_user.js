const tl_user_fields = {
    Name: 'tl_user',
    Description : '用户表，系统平台所有用户都在这个表',
    Def : {
        id : 'id',
        companyId : 'company_id',
        name : 'name',
        password : 'password',
        salt : 'salt',
        email : 'email',
        mobile : 'mobile',
        avatarUrl : 'avatar_url',
        roleId : 'role_id',
        wchatName : 'wchat_name',
        wchatOpenId : 'wchat_open_id',
        wchatUnionId : 'wchat_union_id',
        wchatAvatarUrl : 'wchat_avatar_url',
        flag : 'flag',
        createdAt : 'createdAt',
        updatedAt : 'updatedAt',
        deletedAt : 'deletedAt',
    },
    Flag: {
        
    },
}

const tl_user_model = function(DataTypes){
    return {
        model : {
            id: {
                type: DataTypes.INTEGER,
                comment: '用户id',
                primaryKey: true,
                autoIncrement: true
            },
            company_id: {
                type: DataTypes.INTEGER,
                comment: '企业id'
            },
            name: {
                type: DataTypes.STRING(20),
                comment: '用户名称'
            },
            password: {
                type: DataTypes.STRING(64),
                comment: '用户密码'
            },
            salt: {
                type: DataTypes.STRING(32),
                comment: '用户密码盐'
            },
            email: {
                type: DataTypes.STRING(64),
                comment: '用户邮箱'
            },
            mobile: {
                type: DataTypes.STRING(11),
                comment: '用户手机号'
            },
            avatar_url: {
                type: DataTypes.STRING(255),
                comment: '头像地址-对应oss-key'
            },
            role_id : {
                type: DataTypes.INTEGER,
                comment: '角色id'
            },
            wchat_name: {
                type: DataTypes.STRING(64),
                comment: '微信昵称'
            },
            wchat_open_id: {
                type: DataTypes.STRING(64),
                comment: '微信open_id'
            },
            wchat_union_id: {
                type: DataTypes.STRING(64),
                comment: '微信union_id'
            },
            wchat_avatar_url: {
                type: DataTypes.STRING(255),
                comment: '微信头像地址'
            },
            flag: {
                type: DataTypes.INTEGER,
                comment: '标志位',
                defaultValue: 0,
            }
        },
        options : {
			timestamps: true,
			comment: '用户表',
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
            TlUser: sequelize.define(
                'tl_user', 
                tl_user_model(DataTypes).model, 
                tl_user_model(DataTypes).options
            )
        }
    },
    fields: tl_user_fields
}