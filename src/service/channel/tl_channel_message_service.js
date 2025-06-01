const { tlConsoleError } = require("../../../src/utils/utils");
const TlChannelMessageDao = require('../../dao/tl_channel_message_dao')
const { fields: TlChannelChatFields } = require('../../tables/tl_channel_chat')
const { fields: TlChannelFileFields } = require('../../tables/tl_channel_file')
const { fields: TlChannelMediaFields } = require('../../tables/tl_channel_media')

const TlChannelChatDef = TlChannelChatFields.Def
const TlChannelChatType = TlChannelChatFields.Type
const TlChannelChatTableName = TlChannelChatFields.Name

const TlChannelFileDef = TlChannelFileFields.Def
const TlChannelFileType = TlChannelFileFields.Type
const TlChannelFileTableName = TlChannelFileFields.Name

const TlChannelMediaDef = TlChannelMediaFields.Def
const TlChannelMediaType = TlChannelMediaFields.Type
const TlChannelMediaTableName = TlChannelMediaFields.Name

const TableName = "TlChannelMessageService"


/**
 * 查询频道最新消息接口
 * @param {*} companyId
 * @param {*} channelId
 * @param {*} chatClearId
 * @param {*} fileClearId
 * @param {*} mediaClearId
 * @param {*} chatFields
 * @param {*} fileFields
 * @param {*} mediaFields
 * @param {*} page
 * @param {*} pageSize
 */
const getCombinedChannelMessageListForPage = async function({
    companyId, channelId, chatClearId, fileClearId, mediaClearId
}, commonFields, chatFields, fileFields, mediaFields, page, pageSize){
    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return []
    }

    if(!channelId){
        tlConsoleError(TableName, "请求service参数channelId为空")
        return []
    }

    if(!chatClearId){
        tlConsoleError(TableName, "请求service参数chatClearId为空")
        return []
    }

    if(!fileClearId){
        tlConsoleError(TableName, "请求service参数fileClearId为空")
        return []
    }

    if(!mediaClearId){
        tlConsoleError(TableName, "请求service参数mediaClearId为空")
        return []
    }

    if(!pageSize){
        tlConsoleError(TableName, "请求service参数pageSize为空")
        return []
    }

    if(page <= 0){
        tlConsoleError(TableName, "请求service参数page不合法")
        return []
    }

    if(pageSize <= 0){
        tlConsoleError(TableName, "请求service参数pageSize不合法")
        return []
    }

    if(pageSize > 1000){
        tlConsoleError(TableName, "请求service参数pageSize过大")
        return []
    }
    
    let searchChatFields = []
    let searchFileFields = []
    let searchMediaFields = []
    
    const chatFieldsPerfix = "field_chat_"
    const fileFieldsPerfix = "field_file_"
    const mediaFieldsPerfix = "field_media_"

    if(chatFields){
        if(commonFields){
            commonFields.forEach(field => {
                // 如果字段是驼峰命名，需要转换为下划线命名
                field = field.replace(/([A-Z])/g, "_$1").toLowerCase()
                searchChatFields.push(`${field} AS \`${field}\``)
            })
        }

        chatFields.forEach(field => {
            // 如果字段是驼峰命名，需要转换为下划线命名
            field = field.replace(/([A-Z])/g, "_$1").toLowerCase()
            searchChatFields.push(`${field} AS \`${chatFieldsPerfix + field}\``)
        })

        // 如果三个表字段不一致，需要补齐处理
        if(fileFields){
            fileFields.forEach(field => {
                // 如果字段是驼峰命名，需要转换为下划线命名
                field = field.replace(/([A-Z])/g, "_$1").toLowerCase()
                searchChatFields.push(`NULL AS \`${fileFieldsPerfix + field}\``)
            })
        }

        // 如果三个表字段不一致，需要补齐处理
        if(mediaFields){
            mediaFields.forEach(field => {
                // 如果字段是驼峰命名，需要转换为下划线命名
                field = field.replace(/([A-Z])/g, "_$1").toLowerCase()
                searchChatFields.push(`NULL AS \`${mediaFieldsPerfix + field}\``)
            })
        }
    }
    
    if(fileFields){
        if(commonFields){
            commonFields.forEach(field => {
                // 如果字段是驼峰命名，需要转换为下划线命名
                field = field.replace(/([A-Z])/g, "_$1").toLowerCase()
                searchFileFields.push(`${field} AS \`${field}\``)
            })
        }

        // 如果三个表字段不一致，需要补齐处理
        if(chatFields){
            chatFields.forEach(field => {
                // 如果字段是驼峰命名，需要转换为下划线命名
                field = field.replace(/([A-Z])/g, "_$1").toLowerCase()
                searchFileFields.push(`NULL AS \`${chatFieldsPerfix + field}\``)
            })
        }

        fileFields.forEach(field => {
            // 如果字段是驼峰命名，需要转换为下划线命名
            field = field.replace(/([A-Z])/g, "_$1").toLowerCase()
            searchFileFields.push(`${field} AS \`${fileFieldsPerfix + field}\``)
        })

        // 如果三个表字段不一致，需要补齐处理
        if(mediaFields){
            mediaFields.forEach(field => {
                // 如果字段是驼峰命名，需要转换为下划线命名
                field = field.replace(/([A-Z])/g, "_$1").toLowerCase()
                searchFileFields.push(`NULL AS \`${mediaFieldsPerfix + field}\``)
            })
        }
    }

    if(mediaFields){
        if(commonFields){
            commonFields.forEach(field => {
                // 如果字段是驼峰命名，需要转换为下划线命名
                field = field.replace(/([A-Z])/g, "_$1").toLowerCase()
                searchMediaFields.push(`${field} AS \`${field}\``)
            })
        }

        // 如果三个表字段不一致，需要补齐处理
        if(chatFields){
            chatFields.forEach(field => {
                // 如果字段是驼峰命名，需要转换为下划线命名
                field = field.replace(/([A-Z])/g, "_$1").toLowerCase()
                searchMediaFields.push(`NULL AS \`${chatFieldsPerfix + field}\``)
            })
        }

        // 如果三个表字段不一致，需要补齐处理
        if(fileFields){
            fileFields.forEach(field => {
                // 如果字段是驼峰命名，需要转换为下划线命名
                field = field.replace(/([A-Z])/g, "_$1").toLowerCase()
                searchMediaFields.push(`NULL AS \`${fileFieldsPerfix + field}\``)
            })
        }

        mediaFields.forEach(field => {
            // 如果字段是驼峰命名，需要转换为下划线命名
            field = field.replace(/([A-Z])/g, "_$1").toLowerCase()
            searchMediaFields.push(`${field} AS \`${mediaFieldsPerfix + field}\``)
        })
    }
    
    // 补充 null 字段
    const querySql = `
        SELECT * FROM (
            (
                SELECT 
                ${searchChatFields.map(field => `${field}`).join(", ")} 
                FROM \`${TlChannelChatTableName}\` 
                WHERE 
                \`${TlChannelChatDef.companyId}\` = :companyId 
                AND \`${TlChannelChatDef.channelId}\` = :channelId 
                AND \`${TlChannelChatDef.id}\` > :chatClearId 
                AND \`deleted_at\` IS NULL
            ) 
            UNION ALL 
            (
                SELECT 
                ${searchFileFields.map(field => `${field}`).join(", ")} 
                FROM \`${TlChannelFileTableName}\` 
                WHERE 
                \`${TlChannelFileDef.companyId}\` = :companyId 
                AND \`${TlChannelFileDef.channelId}\` = :channelId 
                AND \`${TlChannelFileDef.id}\` > :fileClearId 
                AND \`deleted_at\` IS NULL
            ) 
            UNION ALL 
            (
                SELECT 
                ${searchMediaFields.map(field => `${field}`).join(", ")} 
                FROM \`${TlChannelMediaTableName}\` 
                WHERE 
                \`${TlChannelMediaDef.companyId}\` = :companyId 
                AND \`${TlChannelMediaDef.channelId}\` = :channelId 
                AND \`${TlChannelMediaDef.id}\` > :mediaClearId 
                AND \`deleted_at\` IS NULL
            )
        ) AS \`combined\`
        ORDER BY \`${TlChannelMediaDef.messageTimeStamp}\` DESC 
        LIMIT :limit 
        OFFSET :offset;
    `;
    
    const list = await TlChannelMessageDao.getListBySql(querySql, {
        companyId, channelId, chatClearId, fileClearId, mediaClearId, limit: pageSize, offset: (page - 1) * pageSize
    })

    if(list == null){
        return []
    }

    // 处理字段
    list.forEach(item => {
        const type = item[TlChannelChatDef.type]

        if(Object.values(TlChannelChatType).includes(type)){
            for(let key in item){
                if(key.startsWith(chatFieldsPerfix)){
                    item[key.replace(chatFieldsPerfix, "")] = item[key]
                    delete item[key]
                }
            }
        }else if(Object.values(TlChannelFileType).includes(type)){
            for(let key in item){
                if(key.startsWith(fileFieldsPerfix)){
                    item[key.replace(fileFieldsPerfix, "")] = item[key]
                    delete item[key]
                }
            }
        }else if(Object.values(TlChannelMediaType).includes(type)){
            for(let key in item){
                if(key.startsWith(mediaFieldsPerfix)){
                    item[key.replace(mediaFieldsPerfix, "")] = item[key]
                    delete item[key]
                }
            }
        }
    })

    return list
}


/**
 * 查询频道历史消息接口
 * @param {*} companyId
 * @param {*} channelId
 * @param {*} chatClearId
 * @param {*} fileClearId
 * @param {*} mediaClearId
 * @param {*} chatMinId
 * @param {*} fileMinId
 * @param {*} mediaMinId
 * @param {*} chatFields
 * @param {*} fileFields
 * @param {*} mediaFields
 * @param {*} page
 * @param {*} pageSize
 */
const getCombinedChannelHistoryMessageListForPage = async function({
    companyId, channelId, chatClearId, fileClearId, mediaClearId,
    chatMinId, fileMinId, mediaMinId
}, commonFields, chatFields, fileFields, mediaFields, page, pageSize){
    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return []
    }

    if(!channelId){
        tlConsoleError(TableName, "请求service参数channelId为空")
        return []
    }

    if(!chatClearId){
        tlConsoleError(TableName, "请求service参数chatClearId为空")
        return []
    }

    if(!fileClearId){
        tlConsoleError(TableName, "请求service参数fileClearId为空")
        return []
    }

    if(!mediaClearId){
        tlConsoleError(TableName, "请求service参数mediaClearId为空")
        return []
    }

    if(!pageSize){
        tlConsoleError(TableName, "请求service参数pageSize为空")
        return []
    }

    if(page <= 0){
        tlConsoleError(TableName, "请求service参数page不合法")
        return []
    }

    if(pageSize <= 0){
        tlConsoleError(TableName, "请求service参数pageSize不合法")
        return []
    }

    if(pageSize > 1000){
        tlConsoleError(TableName, "请求service参数pageSize过大")
        return []
    }

    if(!chatMinId){
        tlConsoleError(TableName, "请求service参数chatMinId为空")
        return []
    }

    if(!fileMinId){
        tlConsoleError(TableName, "请求service参数fileMinId为空")
        return []
    }

    if(!mediaMinId){
        tlConsoleError(TableName, "请求service参数mediaMinId为空")
        return []
    }
    
    let searchChatFields = []
    let searchFileFields = []
    let searchMediaFields = []
    
    const chatFieldsPerfix = "field_chat_"
    const fileFieldsPerfix = "field_file_"
    const mediaFieldsPerfix = "field_media_"

    if(chatFields){
        if(commonFields){
            commonFields.forEach(field => {
                // 如果字段是驼峰命名，需要转换为下划线命名
                field = field.replace(/([A-Z])/g, "_$1").toLowerCase()
                searchChatFields.push(`${field} AS \`${field}\``)
            })
        }

        chatFields.forEach(field => {
            // 如果字段是驼峰命名，需要转换为下划线命名
            field = field.replace(/([A-Z])/g, "_$1").toLowerCase()
            searchChatFields.push(`${field} AS \`${chatFieldsPerfix + field}\``)
        })

        // 如果三个表字段不一致，需要补齐处理
        if(fileFields){
            fileFields.forEach(field => {
                // 如果字段是驼峰命名，需要转换为下划线命名
                field = field.replace(/([A-Z])/g, "_$1").toLowerCase()
                searchChatFields.push(`NULL AS \`${fileFieldsPerfix + field}\``)
            })
        }

        // 如果三个表字段不一致，需要补齐处理
        if(mediaFields){
            mediaFields.forEach(field => {
                // 如果字段是驼峰命名，需要转换为下划线命名
                field = field.replace(/([A-Z])/g, "_$1").toLowerCase()
                searchChatFields.push(`NULL AS \`${mediaFieldsPerfix + field}\``)
            })
        }
    }
    
    if(fileFields){
        if(commonFields){
            commonFields.forEach(field => {
                // 如果字段是驼峰命名，需要转换为下划线命名
                field = field.replace(/([A-Z])/g, "_$1").toLowerCase()
                searchFileFields.push(`${field} AS \`${field}\``)
            })
        }

        // 如果三个表字段不一致，需要补齐处理
        if(chatFields){
            chatFields.forEach(field => {
                // 如果字段是驼峰命名，需要转换为下划线命名
                field = field.replace(/([A-Z])/g, "_$1").toLowerCase()
                searchFileFields.push(`NULL AS \`${chatFieldsPerfix + field}\``)
            })
        }

        fileFields.forEach(field => {
            // 如果字段是驼峰命名，需要转换为下划线命名
            field = field.replace(/([A-Z])/g, "_$1").toLowerCase()
            searchFileFields.push(`${field} AS \`${fileFieldsPerfix + field}\``)
        })

        // 如果三个表字段不一致，需要补齐处理
        if(mediaFields){
            mediaFields.forEach(field => {
                // 如果字段是驼峰命名，需要转换为下划线命名
                field = field.replace(/([A-Z])/g, "_$1").toLowerCase()
                searchFileFields.push(`NULL AS \`${mediaFieldsPerfix + field}\``)
            })
        }
    }

    if(mediaFields){
        if(commonFields){
            commonFields.forEach(field => {
                // 如果字段是驼峰命名，需要转换为下划线命名
                field = field.replace(/([A-Z])/g, "_$1").toLowerCase()
                searchMediaFields.push(`${field} AS \`${field}\``)
            })
        }

        // 如果三个表字段不一致，需要补齐处理
        if(chatFields){
            chatFields.forEach(field => {
                // 如果字段是驼峰命名，需要转换为下划线命名
                field = field.replace(/([A-Z])/g, "_$1").toLowerCase()
                searchMediaFields.push(`NULL AS \`${chatFieldsPerfix + field}\``)
            })
        }

        // 如果三个表字段不一致，需要补齐处理
        if(fileFields){
            fileFields.forEach(field => {
                // 如果字段是驼峰命名，需要转换为下划线命名
                field = field.replace(/([A-Z])/g, "_$1").toLowerCase()
                searchMediaFields.push(`NULL AS \`${fileFieldsPerfix + field}\``)
            })
        }

        mediaFields.forEach(field => {
            // 如果字段是驼峰命名，需要转换为下划线命名
            field = field.replace(/([A-Z])/g, "_$1").toLowerCase()
            searchMediaFields.push(`${field} AS \`${mediaFieldsPerfix + field}\``)
        })
    }
    
    // 补充 null 字段
    const querySql = `
        SELECT * FROM (
            (
                SELECT 
                ${searchChatFields.map(field => `${field}`).join(", ")} 
                FROM \`${TlChannelChatTableName}\` 
                WHERE 
                \`${TlChannelChatDef.companyId}\` = :companyId 
                AND \`${TlChannelChatDef.channelId}\` = :channelId 
                AND \`${TlChannelChatDef.id}\` > :chatClearId 
                AND \`${TlChannelChatDef.id}\` < :chatMinId
                AND \`deleted_at\` IS NULL
            ) 
            UNION ALL 
            (
                SELECT 
                ${searchFileFields.map(field => `${field}`).join(", ")} 
                FROM \`${TlChannelFileTableName}\` 
                WHERE 
                \`${TlChannelFileDef.companyId}\` = :companyId 
                AND \`${TlChannelFileDef.channelId}\` = :channelId 
                AND \`${TlChannelFileDef.id}\` > :fileClearId 
                AND \`${TlChannelFileDef.id}\` < :fileMinId
                AND \`deleted_at\` IS NULL
            ) 
            UNION ALL 
            (
                SELECT 
                ${searchMediaFields.map(field => `${field}`).join(", ")} 
                FROM \`${TlChannelMediaTableName}\` 
                WHERE 
                \`${TlChannelMediaDef.companyId}\` = :companyId 
                AND \`${TlChannelMediaDef.channelId}\` = :channelId 
                AND \`${TlChannelMediaDef.id}\` > :mediaClearId 
                AND \`${TlChannelMediaDef.id}\` < :mediaMinId
                AND \`deleted_at\` IS NULL
            )
        ) AS \`combined\`
        ORDER BY \`${TlChannelMediaDef.messageTimeStamp}\` DESC 
        LIMIT :limit 
        OFFSET :offset;
    `;
    
    const list = await TlChannelMessageDao.getListBySql(querySql, {
        companyId, channelId, chatClearId, fileClearId, mediaClearId, 
        chatMinId, fileMinId, mediaMinId,
        limit: pageSize, offset: (page - 1) * pageSize,
    })

    if(list == null){
        return []
    }

    // 处理字段
    list.forEach(item => {
        const type = item[TlChannelChatDef.type]

        if(Object.values(TlChannelChatType).includes(type)){
            for(let key in item){
                if(key.startsWith(chatFieldsPerfix)){
                    item[key.replace(chatFieldsPerfix, "")] = item[key]
                    delete item[key]
                }
            }
        }else if(Object.values(TlChannelFileType).includes(type)){
            for(let key in item){
                if(key.startsWith(fileFieldsPerfix)){
                    item[key.replace(fileFieldsPerfix, "")] = item[key]
                    delete item[key]
                }
            }
        }else if(Object.values(TlChannelMediaType).includes(type)){
            for(let key in item){
                if(key.startsWith(mediaFieldsPerfix)){
                    item[key.replace(mediaFieldsPerfix, "")] = item[key]
                    delete item[key]
                }
            }
        }
    })

    return list
}


/**
 * 搜索频道消息接口
 * @param {*} companyId
 * @param {*} channelId
 * @param {*} chatClearId
 * @param {*} fileClearId
 * @param {*} mediaClearId
 * @param {*} startTimeStamp
 * @param {*} endTimeStamp
 * @param {*} chatMinId
 * @param {*} fileMinId
 * @param {*} mediaMinId
 * @param {*} chatFields
 * @param {*} fileFields
 * @param {*} mediaFields
 * @param {*} page
 * @param {*} pageSize
 */
const searchCombinedChannelMessageListForPage = async function({
    companyId, channelId, chatClearId, fileClearId, mediaClearId,
    startTimeStamp, endTimeStamp, chatMinId, fileMinId, mediaMinId
}, commonFields, chatFields, fileFields, mediaFields, page, pageSize){
    if(!companyId){
        tlConsoleError(TableName, "请求service参数companyId为空")
        return []
    }

    if(!channelId){
        tlConsoleError(TableName, "请求service参数channelId为空")
        return []
    }

    if(!chatClearId){
        tlConsoleError(TableName, "请求service参数chatClearId为空")
        return []
    }

    if(!fileClearId){
        tlConsoleError(TableName, "请求service参数fileClearId为空")
        return []
    }

    if(!mediaClearId){
        tlConsoleError(TableName, "请求service参数mediaClearId为空")
        return []
    }

    if(!pageSize){
        tlConsoleError(TableName, "请求service参数pageSize为空")
        return []
    }

    if(page <= 0){
        tlConsoleError(TableName, "请求service参数page不合法")
        return []
    }

    if(pageSize <= 0){
        tlConsoleError(TableName, "请求service参数pageSize不合法")
        return []
    }

    if(pageSize > 1000){
        tlConsoleError(TableName, "请求service参数pageSize过大")
        return []
    }

    if(!startTimeStamp){
        tlConsoleError(TableName, "请求service参数startTimeStamp为空")
        return []
    }

    if(!endTimeStamp){
        tlConsoleError(TableName, "请求service参数endTimeStamp为空")
        return []
    }
    
    let searchChatFields = []
    let searchFileFields = []
    let searchMediaFields = []
    
    const chatFieldsPerfix = "field_chat_"
    const fileFieldsPerfix = "field_file_"
    const mediaFieldsPerfix = "field_media_"

    if(chatFields){
        if(commonFields){
            commonFields.forEach(field => {
                // 如果字段是驼峰命名，需要转换为下划线命名
                field = field.replace(/([A-Z])/g, "_$1").toLowerCase()
                searchChatFields.push(`${field} AS \`${field}\``)
            })
        }

        chatFields.forEach(field => {
            // 如果字段是驼峰命名，需要转换为下划线命名
            field = field.replace(/([A-Z])/g, "_$1").toLowerCase()
            searchChatFields.push(`${field} AS \`${chatFieldsPerfix + field}\``)
        })

        // 如果三个表字段不一致，需要补齐处理
        if(fileFields){
            fileFields.forEach(field => {
                // 如果字段是驼峰命名，需要转换为下划线命名
                field = field.replace(/([A-Z])/g, "_$1").toLowerCase()
                searchChatFields.push(`NULL AS \`${fileFieldsPerfix + field}\``)
            })
        }

        // 如果三个表字段不一致，需要补齐处理
        if(mediaFields){
            mediaFields.forEach(field => {
                // 如果字段是驼峰命名，需要转换为下划线命名
                field = field.replace(/([A-Z])/g, "_$1").toLowerCase()
                searchChatFields.push(`NULL AS \`${mediaFieldsPerfix + field}\``)
            })
        }
    }
    
    if(fileFields){
        if(commonFields){
            commonFields.forEach(field => {
                // 如果字段是驼峰命名，需要转换为下划线命名
                field = field.replace(/([A-Z])/g, "_$1").toLowerCase()
                searchFileFields.push(`${field} AS \`${field}\``)
            })
        }

        // 如果三个表字段不一致，需要补齐处理
        if(chatFields){
            chatFields.forEach(field => {
                // 如果字段是驼峰命名，需要转换为下划线命名
                field = field.replace(/([A-Z])/g, "_$1").toLowerCase()
                searchFileFields.push(`NULL AS \`${chatFieldsPerfix + field}\``)
            })
        }

        fileFields.forEach(field => {
            // 如果字段是驼峰命名，需要转换为下划线命名
            field = field.replace(/([A-Z])/g, "_$1").toLowerCase()
            searchFileFields.push(`${field} AS \`${fileFieldsPerfix + field}\``)
        })

        // 如果三个表字段不一致，需要补齐处理
        if(mediaFields){
            mediaFields.forEach(field => {
                // 如果字段是驼峰命名，需要转换为下划线命名
                field = field.replace(/([A-Z])/g, "_$1").toLowerCase()
                searchFileFields.push(`NULL AS \`${mediaFieldsPerfix + field}\``)
            })
        }
    }

    if(mediaFields){
        if(commonFields){
            commonFields.forEach(field => {
                // 如果字段是驼峰命名，需要转换为下划线命名
                field = field.replace(/([A-Z])/g, "_$1").toLowerCase()
                searchMediaFields.push(`${field} AS \`${field}\``)
            })
        }

        // 如果三个表字段不一致，需要补齐处理
        if(chatFields){
            chatFields.forEach(field => {
                // 如果字段是驼峰命名，需要转换为下划线命名
                field = field.replace(/([A-Z])/g, "_$1").toLowerCase()
                searchMediaFields.push(`NULL AS \`${chatFieldsPerfix + field}\``)
            })
        }

        // 如果三个表字段不一致，需要补齐处理
        if(fileFields){
            fileFields.forEach(field => {
                // 如果字段是驼峰命名，需要转换为下划线命名
                field = field.replace(/([A-Z])/g, "_$1").toLowerCase()
                searchMediaFields.push(`NULL AS \`${fileFieldsPerfix + field}\``)
            })
        }

        mediaFields.forEach(field => {
            // 如果字段是驼峰命名，需要转换为下划线命名
            field = field.replace(/([A-Z])/g, "_$1").toLowerCase()
            searchMediaFields.push(`${field} AS \`${mediaFieldsPerfix + field}\``)
        })
    }
    
    // 补充 null 字段
    const querySql = `
        SELECT * FROM (
            (
                SELECT 
                ${searchChatFields.map(field => `${field}`).join(", ")} 
                FROM \`${TlChannelChatTableName}\` 
                WHERE 
                \`${TlChannelChatDef.companyId}\` = :companyId 
                AND \`${TlChannelChatDef.channelId}\` = :channelId 
                AND \`${TlChannelChatDef.id}\` > :chatClearId 
                ${chatMinId !== -1 ? `AND \`${TlChannelChatDef.id}\` < :chatMinId` : ""}
                AND \`${TlChannelChatDef.messageTimeStamp}\` >= :startTimeStamp
                AND \`deleted_at\` IS NULL
            ) 
            UNION ALL 
            (
                SELECT 
                ${searchFileFields.map(field => `${field}`).join(", ")} 
                FROM \`${TlChannelFileTableName}\` 
                WHERE 
                \`${TlChannelFileDef.companyId}\` = :companyId 
                AND \`${TlChannelFileDef.channelId}\` = :channelId 
                AND \`${TlChannelFileDef.id}\` > :fileClearId 
                ${fileMinId !== -1 ? `AND \`${TlChannelFileDef.id}\` < :fileMinId` : ""}
                AND \`${TlChannelFileDef.messageTimeStamp}\` >= :startTimeStamp
                AND \`deleted_at\` IS NULL
            ) 
            UNION ALL 
            (
                SELECT 
                ${searchMediaFields.map(field => `${field}`).join(", ")} 
                FROM \`${TlChannelMediaTableName}\` 
                WHERE 
                \`${TlChannelMediaDef.companyId}\` = :companyId 
                AND \`${TlChannelMediaDef.channelId}\` = :channelId 
                AND \`${TlChannelMediaDef.id}\` > :mediaClearId 
                ${mediaMinId !== -1 ? `AND \`${TlChannelMediaDef.id}\` < :mediaMinId` : ""}
                AND \`${TlChannelMediaDef.messageTimeStamp}\` >= :startTimeStamp
                AND \`deleted_at\` IS NULL
            )
        ) AS \`combined\`
        ORDER BY \`${TlChannelMediaDef.messageTimeStamp}\` DESC 
        LIMIT :limit 
        OFFSET :offset;
    `;
    
    const list = await TlChannelMessageDao.getListBySql(querySql, {
        companyId, channelId, chatClearId, fileClearId, mediaClearId, limit: pageSize, offset: (page - 1) * pageSize,
        startTimeStamp, endTimeStamp
    })

    if(list == null){
        return []
    }

    // 处理字段
    list.forEach(item => {
        const type = item[TlChannelChatDef.type]

        if(Object.values(TlChannelChatType).includes(type)){
            for(let key in item){
                if(key.startsWith(chatFieldsPerfix)){
                    item[key.replace(chatFieldsPerfix, "")] = item[key]
                    delete item[key]
                }
            }
        }else if(Object.values(TlChannelFileType).includes(type)){
            for(let key in item){
                if(key.startsWith(fileFieldsPerfix)){
                    item[key.replace(fileFieldsPerfix, "")] = item[key]
                    delete item[key]
                }
            }
        }else if(Object.values(TlChannelMediaType).includes(type)){
            for(let key in item){
                if(key.startsWith(mediaFieldsPerfix)){
                    item[key.replace(mediaFieldsPerfix, "")] = item[key]
                    delete item[key]
                }
            }
        }
    })

    return list
}


module.exports = {
    getCombinedChannelMessageListForPage,
    getCombinedChannelHistoryMessageListForPage,
    searchCombinedChannelMessageListForPage,
}