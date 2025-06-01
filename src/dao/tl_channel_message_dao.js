const { QueryTypes } = require('sequelize');
const { dbClient } = require('../tables/db')
const { tlConsoleError } = require("../../src/utils/utils");
const TableName = "TlChannelMessageDao"

/**
 * getListBySql 接口
 * @param {*} querySql
 * @param {*} params
 */
const getListBySql = async function(
    querySql, params,
){
    if(!querySql){
        tlConsoleError(TableName, "请求dao参数有为空项")
        return null
    }

    if(Object.keys(params).length === 0){
        tlConsoleError(TableName, "请求dao参数有为空项")
        return null
    }
    
    const list = await dbClient.query(querySql, {
        replacements: params,
        type: QueryTypes.SELECT,
    });
    
    return list
}

/**
 * getCountBySql 接口
 * @param {*} querySql
 * @param {*} params
 */
const getCountBySql = async function(
    querySql, params,
){
    if(!querySql){
        tlConsoleError(TableName, "请求dao参数有为空项")
        return null
    }

    if(Object.keys(params).length === 0){
        tlConsoleError(TableName, "请求dao参数有为空项")
        return null
    }
    
    const count = await dbClient.query(querySql, {
        replacements: params,
        type: QueryTypes.SELECT,
    });
    
    return count
}


module.exports = {
    getListBySql,
    getCountBySql,
}