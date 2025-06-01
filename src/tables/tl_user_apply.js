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
        IS_APPLY_GROUP_BY_SEARCH_NAME: 0x1, //通过搜索名称添加群聊
        IS_APPLY_GROUP_BY_SHARE_LINK: 0x2, //通过分享链接添加群聊

        IS_APPLY_FRIEND_BY_SEARCH_NAME: 0x4, //通过搜索名称添加好友
        IS_APPLY_FRIEND_BY_SEARCH_PHONE: 0x8, //通过搜索手机号添加好友
        IS_APPLY_FRIEND_BY_SEARCH_EMAIL: 0x10, //通过搜索邮箱添加好友
        IS_APPLY_FRIEND_BY_INVITE: 0x20, //通过邀请添加好友
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
                comment: '申请来源信息'
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