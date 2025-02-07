const tl_user_apply_fields = {
    Name: 'tl_user_apply',
    Description: '用户申请表, 主要定义用户各种申请记录，如好友申请，加群申请等',
    Def: {
        id : 'id',
        companyId : 'company_id',
        userId : 'user_id',
        targetId: 'target_id',
        type : 'type', 
        status : 'status',
        origin: 'origin',
        remark: 'remark',
        flag: 'flag',
        createdAt : 'createdAt',
        updatedAt : 'updatedAt',
        deletedAt : 'deletedAt',
    },
    Flag: {
        
    },
    Type: {
        FRIEND: 1, //好友申请
        GROUP: 2, //群申请
    },
    Status: {
        WAIT: 1, //等待验证
        PASS: 2, //通过
        REJECT: 3, //拒绝
        BLACK: 4, //黑名单
    },
    Origin: {
        SEARCH_NAME: '1', //搜索用户名添加
        SEARCH_PHONE: '2', //搜索手机号添加
        SEARCH_EMAIL: '3', //搜索邮箱添加
        INVITE_QR: '4', //二维码邀请添加
        INVITE_LINK: '5', //链接邀请添加
    }
}

const tl_user_apply_model = function(DataTypes){
    return {
        model : {
            id: {
                type: DataTypes.INTEGER,
                comment: '申请id',
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
            origin:{
                type: DataTypes.STRING,
                comment: '申请来源'
            },
            user_id: {
                type: DataTypes.INTEGER,
                comment: '申请记录所属用户id'
            },
            target_id: {
                type: DataTypes.INTEGER,
                comment: '申请目标id'
            },
            remark:{
                type: DataTypes.STRING,
                comment: '申请备注'
            },
            type: {
                type: DataTypes.INTEGER,
                comment: '申请类型'
            },
            status: {
                type: DataTypes.INTEGER,
                comment: '申请状态',
                defaultValue: tl_user_apply_fields.Status.WAIT
            }
        },
        options : {
			timestamps: true,
			comment: '用户申请记录表',
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
            TlUserApply: sequelize.define(
                'tl_user_apply', 
                tl_user_apply_model(DataTypes).model, 
                tl_user_apply_model(DataTypes).options
            )
        }
    },
    fields: tl_user_apply_fields
}