const tl_cloud_file_fields = {
    Name: 'tl_cloud_file',
    Description: '云资源库文件表',
    Def: {
        id : 'id',
        companyId : 'company_id',
        type: 'type',
        userId: 'user_id',
        flag : 'flag',
        originFileName: 'origin_file_name',
        originFileType: 'origin_file_type',
        fileName: 'file_name',
        fileUrl: 'file_url',
        fileSize: 'file_size',
        fileId: 'file_id',
        dirId: 'dir_id',
        other: 'other',
        createdAt : 'createdAt',
        updatedAt : 'updatedAt',
        deletedAt : 'deletedAt',
    },  
    Flag: {

    },
    Type: {
        IMAGE: 'image', // 图片
        AUDIO: 'audio', // 音频
        VIDEO: 'video', // 视频
        DOCUMENT: 'document', // 文档
        ZIP: 'zip', // 压缩包
        OTHER: 'other', // 其他

        toStr: function(type){
            switch(type){
                case this.IMAGE:
                    return '图片';
                case this.AUDIO:
                    return '音频';
                case this.VIDEO:
                    return '视频';
                case this.DOCUMENT:
                    return '文档';
                case this.ZIP:
                    return '压缩包';
                case this.OTHER:
                    return '其他';
                default:
                    return '未知';
            }
        }
    },
}

const tl_cloud_file_model = function(DataTypes){
    return {
        model : {
            id: {
                type: DataTypes.INTEGER,
                comment: '文件id',
                primaryKey: true,
                autoIncrement: true
            },
            company_id: {
                type: DataTypes.INTEGER,
                comment: '企业id'
            },
            type : {
                type: DataTypes.STRING(8),
                comment: '文件资源类型'
            },
            user_id:{
                type: DataTypes.INTEGER,
                comment: '用户id',
                defaultValue: 0
            },
            flag: {
                type: DataTypes.INTEGER,
                comment: '标志位',
                defaultValue: 0,
            },
            origin_file_name: {
                type: DataTypes.STRING(255),
                comment: '原文件名'
            },
            origin_file_type: {
                type: DataTypes.STRING(255),
                comment: '原文件类型'
            },
            dir_id: {
                type: DataTypes.INTEGER,
                comment: '文件夹id',
                defaultValue: 0,
            },
            file_name: {
                type: DataTypes.STRING(255),
                comment: '文件名'
            },
            file_url: {
                type: DataTypes.STRING(255),
                comment: '文件路径'
            },
            file_size: {
                type: DataTypes.INTEGER,
                comment: '文件大小'
            },
            file_id: {
                type: DataTypes.STRING(255),
                comment: '文件id'
            },
            other: {
                type: DataTypes.TEXT,
                comment: '其他信息',
                defaultValue: '{}'
            },
        },
        options : {
			timestamps: true,
			comment: '云资源库文件表',
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
            TlCloudFile: sequelize.define(
                'tl_cloud_file', 
                tl_cloud_file_model(DataTypes).model, 
                tl_cloud_file_model(DataTypes).options
            )
        }
    },
    fields: tl_cloud_file_fields
}