const tl_user_finger_print_fields = {
    Name: 'tl_user_finger_print',
    Description: '用户登录指纹表, 主要存储用户相关指纹，用于登录身份认证等',
    Def: {
        id : 'id',
        user_id: 'user_id',
        finger_print: 'finger_print',
        createdAt : 'createdAt',
        updatedAt : 'updatedAt',
        deletedAt : 'deletedAt',
    },
}

const tl_user_finger_print_model = function(DataTypes){
    return {
        model : {
            id: {
                type: DataTypes.INTEGER,
                comment: '主键',
                primaryKey: true,
                autoIncrement: true
            },
            user_id: {
                type: DataTypes.INTEGER,
                comment: '用户id'
            },
            finger_print: {
                type: DataTypes.STRING,
                comment: '指纹'
            },
        },
        options : {
			timestamps: true,
			comment: '用户登录指纹表',
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
            TlUserFingerPrint: sequelize.define(
                'tl_user_finger_print', 
                tl_user_finger_print_model(DataTypes).model, 
                tl_user_finger_print_model(DataTypes).options
            )
        }
    },
    fields: tl_user_finger_print_fields
}