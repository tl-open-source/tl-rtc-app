const tl_cut_paste_fields = {
    Name: 'tl_cut_paste',
    Description: '剪贴板表',
    Def: {
        id : 'id',
        companyId : 'company_id',
        userId: 'user_id',
        title: 'title',
        code: 'code',
        flag: 'flag',
        status: 'status',
        password: 'password',
        createdAt : 'createdAt',
        updatedAt : 'updatedAt',
        deletedAt : 'deletedAt',
    },
    Flag: {
        HAS_PASSWORD: 0x1, // 有密码
    },
    Status: {
        USEED: 1, // 使用中
        CLOSE: 2, // 关闭

        toStr: function(status){
            switch(status){
                case this.USEED: return '使用中';
                case this.CLOSE: return '关闭';
                default: return '未知';
            }
        }
    }
}

const tl_cut_paste_model = function(DataTypes){
    return {
        model : {
            id: {
                type: DataTypes.INTEGER,
                comment: '剪贴板id',
                primaryKey: true,
                autoIncrement: true
            },
            company_id: {
                type: DataTypes.INTEGER,
                comment: '企业id'
            },
            user_id:{
                type: DataTypes.INTEGER,
                comment: '属于的用户id',
                defaultValue: 0
            },
            title: {
                type: DataTypes.STRING(32),
                comment: '剪贴板标题'
            },
            code: {
                type: DataTypes.STRING(32),
                comment: '剪贴板码'
            },
            password: {
                type: DataTypes.STRING(32),
                comment: '剪贴板密码'
            },
            flag: {
                type: DataTypes.INTEGER,
                comment: '标志位',
                defaultValue: 0,
            },
            status: {
                type: DataTypes.INTEGER,
                comment: '状态',
                defaultValue: tl_cut_paste_fields.Status.USEED
            },
        },
        options : {
			timestamps: true,
			comment: '剪贴板表',
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
            TlCutPaste: sequelize.define(
                'tl_cut_paste', 
                tl_cut_paste_model(DataTypes).model, 
                tl_cut_paste_model(DataTypes).options
            )
        }
    },
    fields: tl_cut_paste_fields
}