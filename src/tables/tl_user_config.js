const tl_user_config_fields = {
    Name: 'tl_user_config',
    Description: '用户配置表',
    Def: {
        id : 'id',
        companyId : 'company_id',
        userId : 'user_id',
        normal: 'normal',
        account: 'account',
        message: 'message',
        skin: 'skin',
        authority: 'authority',
        other: 'other',
        createdAt : 'createdAt',
        updatedAt : 'updatedAt',
        deletedAt : 'deletedAt',
    },
    Account: {
        
    },
    Normal: {
        
    },
    Message: {  // 消息设置
        // 网页通知
        webNotify: 'webNotify',
        // 消息红点
        messageDot: 'messageDot',
    },
    Authority: { // 权限设置
        
    },
    Skin: {

    },
    Other: {
        // 中继服务
        turnServer: 'turnServer',
        // 自定义wss服务地址
        customWss: 'customWss',
    }
}

const tl_user_config_model = function(DataTypes){
    return {
        model : {
            id: {
                type: DataTypes.INTEGER,
                comment: '用户配置id',
                primaryKey: true,
                autoIncrement: true
            },
            company_id: {
                type: DataTypes.INTEGER,
                comment: '企业id'
            },
            user_id:{
                type: DataTypes.INTEGER,
                comment: '用户id',
                defaultValue: 0
            },
            account: {
                type: DataTypes.TEXT,
                comment: '账户设置',
                defaultValue: ''
            },
            message: {
                type: DataTypes.TEXT,
                comment: '消息设置',
                defaultValue: ''
            },
            skin: {
                type: DataTypes.TEXT,
                comment: '皮肤设置',
                defaultValue: ''
            },
            authority: {
                type: DataTypes.TEXT,
                comment: '权限设置',
                defaultValue: ''
            },
            normal: {
                type: DataTypes.TEXT,
                comment: '通用设置',
                defaultValue: ''
            },
            other: {
                type: DataTypes.TEXT,
                comment: '其他设置',
                defaultValue: ''
            },
        },
        options : {
			timestamps: true,
			comment: '用户配置表',
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
            TlUserConfig: sequelize.define(
                'tl_user_config', 
                tl_user_config_model(DataTypes).model, 
                tl_user_config_model(DataTypes).options
            )
        }
    },
    fields: tl_user_config_fields
}