const { DataTypes, where } = require('sequelize');
const { dbClient } = require('../tables/db')
const { model, fields } = require('../tables/tl_user_config')
const Table = model(dbClient, DataTypes).TlUserConfig
const TableName = fields.Name
const TableFields = Object.keys(fields.Def).map(key => fields.Def[key])
const { tlConsoleError, tlConsole, checkRawFieldType } = require("../../src/utils/utils");

/**
 * addInfo 接口
 * @param {*} data 
 */
const addInfo = async function(data){
    if(Object.keys(data).length === 0){
        tlConsoleError(TableName, "请求dao参数为空")
        return null
    }

    // 参数校验
    const checkStatus = checkRawFieldType(Table.rawAttributes, data)
    if (!checkStatus) {
        tlConsoleError(TableName, "请求dao参数类型错误")
        return null
    }

    const info = await Table.create(data)

    tlConsole(TableName, data, info)

    return info
}

/**
 * addList 接口
 * @param {*} dataList
 */
const addList = async function(dataList){
    if(dataList.length === 0){
        tlConsoleError(TableName, "请求dao参数为空")
        return null
    }

    for(let data of dataList){
        if(Object.keys(data).length === 0){
            tlConsoleError(TableName, "请求dao参数有为空项")
            return null
        }

        // 参数校验
        const checkStatus = checkRawFieldType(Table.rawAttributes, data)
        if (!checkStatus) {
            tlConsoleError(TableName, "请求dao参数类型错误")
            return null
        }
    }

    const list = await Table.bulkCreate(dataList)

    tlConsole(TableName, dataList, list)

    return list
}


/**
 * getInfo 接口
 * @param {*} params 
 * @param {*} fields
 */
const getInfo = async function(params, fields = TableFields){
    if(Object.keys(params).length === 0){
        tlConsoleError(TableName, "请求dao参数为空")
        return null
    }

    const info = await Table.findOne({
        where: params,
        attributes: fields
    })

    return info
}

/**
 * getList 接口
 * @param {*} params
 * @param {*} fields
 * @param {*} order
 */
const getList = async function(params, fields = TableFields, order = [['id', 'ASC']]){
    if(Object.keys(params).length === 0){
        tlConsoleError(TableName, "请求dao参数有为空项")
        return null
    }

    const list = await Table.findAll({
        where : params,
        attributes: fields,
        order: order,
    })
    
    return list
}

/**
 * getListForPage 接口
 * @param {*} params
 * @param {*} fields
 * @param {*} order
 * @param {*} page
 * @param {*} pageSize
 */
const getListForPage = async function(params, fields = TableFields, order = [['id', 'ASC']], page = 1, pageSize = 10){
    if(Object.keys(params).length === 0){
        tlConsoleError(TableName, "请求dao参数有为空项")
        return null
    }

    const list = await Table.findAll({
        where : params,
        attributes: fields,
        order: order,
        limit: pageSize,
        offset: (page - 1) * pageSize
    })
    
    return list
}

/**
 * updateInfo 接口
 * @param {*} params 
 * @param {*} data
 */
const updateInfo = async function(params, data){
    if(Object.keys(params).length === 0){
        tlConsoleError(TableName, "请求dao参数为空")
        return null
    }

    if(Object.keys(data).length === 0){
        tlConsoleError(TableName, "请求dao参数为空")
        return null
    }

    // 参数校验
    const checkStatus = checkRawFieldType(Table.rawAttributes, data)
    if (!checkStatus) {
        tlConsoleError(TableName, "请求dao参数类型错误")
        return null
    }

    const info = await Table.update(data, {
        where: params
    })

    tlConsole(TableName, params, data, info)

    return info
}


/**
 * deleteInfo 接口
 * @param {*} params 
 */
const deleteInfo = async function(params){
    if(Object.keys(params).length === 0){
        tlConsoleError(TableName, "请求dao参数为空")
        return null
    }

    const info = await Table.destroy({
        where: params
    })

    tlConsole(TableName, params, info)

    return info
}

/**
 * getCount 接口
 * @param {*} params
 */
const getCount = async function(params){
    if(Object.keys(params).length === 0){
        tlConsoleError(TableName, "请求dao参数有为空项")
        return null
    }

    const count = await Table.count({
        where : params
    })
    
    return count
}


module.exports = {
    addInfo, addList,
    getInfo, getList, getListForPage,
    updateInfo,
    deleteInfo,
    getCount,
}