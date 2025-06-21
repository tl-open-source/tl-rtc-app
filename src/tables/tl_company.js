const tl_company_fields = {
    Name: 'tl_company',
    Description: '企业信息表',
    Def: {
        id : 'id',
        code: 'code',
        name : 'name',
        address : 'address',
        phone : 'phone',
        email : 'email',
        website : 'website',
        logo : 'logo',
        description : 'description',
        flag : 'flag',
        content : 'content',
        createdAt : 'createdAt',
        updatedAt : 'updatedAt',
        deletedAt : 'deletedAt',
    },
    Flag: {
        IS_PASS_AUTH: 0x1, //是否通过认证
        IS_EXPIRED: 0x2, //是否过期
        IS_OPEN_REGISTER: 0x4, // 是否开放注册
    },
}

const tl_company_model = function(DataTypes){
    return {
        model : {
            id: {
                type: DataTypes.INTEGER,
                comment: '企业id',
                primaryKey: true,
                autoIncrement: true
            },
            code: {
                type: DataTypes.STRING(60),
                comment: '企业唯一编码'
            },
            name: {
                type: DataTypes.STRING(20),
                comment: '企业名称'
            },
            address: {
                type: DataTypes.STRING(256),
                comment: '企业地址'
            },
            phone: {
                type: DataTypes.STRING(20),
                comment: '企业电话'
            },
            email: {
                type: DataTypes.STRING(48),
                comment: '企业邮箱'
            },
            website: {
                type: DataTypes.STRING(48),
                comment: '企业网址'
            },
            logo: {
                type: DataTypes.STRING(256),
                comment: '企业logo'
            },
            description: {
                type: DataTypes.STRING(256),
                comment: '企业描述'
            },
            flag: {
                type: DataTypes.INTEGER,
                comment: '标志位',
                defaultValue: 0,
            },
            content: {
                type: DataTypes.TEXT,
                comment: '详细信息'
            },
        },
        options : {
			timestamps: true,
			comment: '企业信息表',
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
            TlCompany: sequelize.define(
                'tl_company', 
                tl_company_model(DataTypes).model, 
                tl_company_model(DataTypes).options
            )
        }
    },
    fields: tl_company_fields   
}