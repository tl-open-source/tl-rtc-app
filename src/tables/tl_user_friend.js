const tl_user_friend_fields = {
    Name: 'tl_user_friend',
    Description: '用户好友关系记录',
    Def : {
        id : 'id',
        companyId : 'company_id',
        flag : 'flag',
        userId : 'user_id',
        origin: 'origin',
        remark: 'remark',
        friendId : 'friend_id',
        status: 'status',
        friendType : 'friend_type',
        rename: 'rename',
        channelId: 'channel_id',
        createdAt : 'createdAt',
        updatedAt : 'updatedAt',
        deletedAt : 'deletedAt',
    },
    Status:{
        NORMAL : 1, //正常
    },
    Flag: {
        
    },
    FriendType: {
        NORMAL: 1, //普通好友
        SPECIAL: 2, //特别关注
    },
    Origin: {
        SEARCH_NAME: '1', //搜索用户名添加
        SEARCH_PHONE: '2', //搜索手机号添加
        SEARCH_EMAIL: '3', //搜索邮箱添加
        INVITE_QR: '4', //二维码邀请添加
        INVITE_LINK: '5', //链接邀请添加
    }
}

const tl_user_friend_model = function(DataTypes){
    return {
        model : {
            id: {
                type: DataTypes.INTEGER,
                comment: '关系id',
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
            origin: {
                type: DataTypes.STRING,
                comment: '来源',
                defaultValue: 0,
            },
            user_id: {
                type: DataTypes.INTEGER,
                comment: '用户id'
            },
            friend_id: {
                type: DataTypes.INTEGER,
                comment: '好友userid'
            },
            friend_type: {
                type: DataTypes.INTEGER,
                comment: '好友类型'
            },
            channel_id: {
                type: DataTypes.INTEGER,
                comment: '关联好友频道id'
            },
            status:{
                type: DataTypes.INTEGER,
                comment: '好友关系记录状态'
            },
            remark: {
                type: DataTypes.STRING(64),
                comment: '备注'
            },
            rename: {
                type: DataTypes.STRING(64),
                comment: '好友备注'
            }
        },
        options : {
			timestamps: true,
			comment: '好友记录表',
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
            TlUserFriend: sequelize.define(
                'tl_user_friend', 
                tl_user_friend_model(DataTypes).model, 
                tl_user_friend_model(DataTypes).options
            )
        }
    },
    fields: tl_user_friend_fields
}