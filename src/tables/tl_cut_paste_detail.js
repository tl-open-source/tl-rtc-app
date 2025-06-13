const tl_cut_paste_detail_fields = {
    Name: 'tl_cut_paste_detail',
    Description: '剪贴板详情表',
    Def: {
        id : 'id',
        code: 'code',
        cutPasteId: 'cut_paste_id',
        flag: 'flag',
        content: 'content',
        type: 'type',
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
        FILE: 'file', // 文档
        TEXT: 'text', // 文本
        RICH_TEXT: 'rich_text', // 富文本
        LINK: 'link', // 链接
        OTHER: 'other', // 其他

        toStr: {
            'image': '图片',
            'audio': '音频',
            'video': '视频',
            'file': '文档',
            'text': '文本',
            'rich_text': '富文本',
            'link': '链接',
            'other': '其他',
        }
    }
}

const tl_cut_paste_detail_model = function(DataTypes){
    return {
        model : {
            id: {
                type: DataTypes.INTEGER,
                comment: '剪贴板详情id',
                primaryKey: true,
                autoIncrement: true
            },
            code: {
                type: DataTypes.STRING(32),
                comment: '剪贴板码'
            },
            cut_paste_id: {
                type: DataTypes.INTEGER,
                comment: '剪贴板id'
            },
            type: {
                type: DataTypes.STRING(32),
                comment: '类型',
                defaultValue: tl_cut_paste_detail_fields.Type.TEXT
            },
            flag: {
                type: DataTypes.INTEGER,
                comment: '标志位',
                defaultValue: 0,
            },
            content: {
                type: DataTypes.TEXT,
                comment: '剪贴板内容'
            },
        },
        options : {
			timestamps: true,
			comment: '剪贴板详情记录表',
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
            TlCutPasteDetail: sequelize.define(
                'tl_cut_paste_detail', 
                tl_cut_paste_detail_model(DataTypes).model, 
                tl_cut_paste_detail_model(DataTypes).options
            )
        }
    },
    fields: tl_cut_paste_detail_fields
}