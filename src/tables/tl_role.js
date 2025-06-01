const role = require('../role/role');

const tl_role_fields = {
    Name: 'tl_role',
    Description: '角色表，定义各种角色，包括企业角色，系统角色，管理员角色等',
    Def : {
        id : 'id',
        companyId : 'company_id',
        name : 'name',
        key: 'key',
        flag : 'flag',
        type: 'type',
        description : 'description',
        permissionIdList: 'permission_id_list',
        createdAt : 'createdAt',
        updatedAt : 'updatedAt',
        deletedAt : 'deletedAt',
    },
    Type: {
        NORMAL_USER: 1, // 普通用户角色
        ADMIN_USER: 2, // 管理员角色

        CHANNEL_CREATOR_USER: 4, // 频道群主角色
        CHANNEL_ADMIN_USER: 5, // 频道管理员角色
        CHANNEL_NORMAL_USER: 6, // 频道普通用户角色
    }
}

const tl_role_model = function(DataTypes){
    return {
        model : {
            id: {
                type: DataTypes.INTEGER,
                comment: '角色记录id',
                primaryKey: true,
                autoIncrement: true
            },
            company_id: {
                type: DataTypes.INTEGER,
                comment: '企业id'
            },
            key: {
                type: DataTypes.STRING(20),
                comment: '角色key'
            },
            type: {
                type: DataTypes.INTEGER,
                comment: '角色类型',
            },
            name: {
                type: DataTypes.STRING(20),
                comment: '角色名称'
            },
            description: {
                type: DataTypes.STRING(256),
                comment: '角色描述'
            },
            permission_id_list: {
                type: DataTypes.TEXT,
                comment: '权限id列表',
            },
            flag: {
                type: DataTypes.INTEGER,
                comment: '标志位',
                defaultValue: 0,
            },
        },
        options : {
			timestamps: true,
			comment: '用户角色表',
			indexes: [{
				name: 'created_at_index',
				method: 'BTREE',
				fields: ['created_at']
			}]
		}
    }
}

const tl_inner_role = {
    user: {
        normal : {
            id : 1,
            key: 'normal',
            name : '普通角色',
            type: tl_role_fields.Type.NORMAL_USER,
            permissionIdList : JSON.stringify(
                role.userNormalPermissions()
            ),
            description : '普通角色用户',
            flag : 0,
        },
        admin : {
            id : 2,
            key: 'admin',
            name : '管理员',
            type: tl_role_fields.Type.ADMIN_USER,
            permissionIdList : JSON.stringify(
                role.userAdminPermissions()
            ),
            description : '管理员角色用户',
            flag : 0,
        },
    },
    channel : {
        creator : {
            id : 10000,
            key: 'creator',
            name : '群主',
            type: tl_role_fields.Type.CHANNEL_CREATOR_USER,
            permissionIdList : JSON.stringify(
                role.userChannelCreatorPermissions()
            ),
            description : '频道创建者',
            flag : 0,
        },
        admin : {
            id : 10001,
            key: 'admin',
            name : '管理员',
            type: tl_role_fields.Type.CHANNEL_ADMIN_USER,
            permissionIdList : JSON.stringify(
                role.userChannelAdminPermissions()
            ),
            description : '频道管理员',
            flag : 0,
        },
        member : {
            id : 10002,
            key: 'member',
            name : '成员',
            type: tl_role_fields.Type.CHANNEL_NORMAL_USER,
            permissionIdList : JSON.stringify(
                role.userChannelNormalPermissions()
            ),
            description : '频道成员',
            flag : 0,
        }
    },
}

module.exports = {
    model: function(sequelize, DataTypes){
        return {
            TlRole: sequelize.define(
                'tl_role', 
                tl_role_model(DataTypes).model, 
                tl_role_model(DataTypes).options
            )
        }
    },
    fields: tl_role_fields,
    inner: tl_inner_role
}