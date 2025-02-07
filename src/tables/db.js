const sequelizeObj = require('sequelize');
const fs = require('fs');
const { tlConsole } = require("../../src/utils/utils");
const { get_env_config } = require("../../conf/env_config");
const { resolve } = require('path');
const conf = get_env_config();

//db connect retry times
let connectRetryTimes = 0;
// 连接对象缓存
let dbClientInstance = null


/**
 * 获取数据库连接对象
 * @returns 
 */
const getDbClient = function() {
	if(dbClientInstance != null){
		return dbClientInstance
	}

	const options = {
		"dialect": "mysql",
		"host": conf.db_mysql_host,
		"port": conf.db_mysql_port,
		"logging": false,
		"pool": {
			"max": 20,
			"min": 5,
			"acquire": 30000,
			"idle": 10000
		},
		"timezone": "+08:00",
		"define": {
			"freezeTableName": true,
			"underscored": true,
			"charset": "utf8",
			"collate": "utf8_general_ci",
			"timestamps": false,
			"paranoid": true
		}
	}

	dbClientInstance = new sequelizeObj(
		conf.db_mysql_dbName, conf.db_mysql_user, conf.db_mysql_password, options
	);
	
	tlConsole("db init done ...")

	return dbClientInstance
}


/**
 * 初始化数据库
 * @returns 
 */
const dbInit = async function(){

	let dbclient = getDbClient()

	try {
		await dbclient.authenticate();
		tlConsole('db connect ok ... ');

		let files = fs.readdirSync(__dirname);
		for (let f of files) {
			if (f[0] == '.' || f == 'db.js') continue;
			try {
				let fn = require('./' + f).model;
				if (typeof fn == 'function') {
					fn(dbclient, sequelizeObj);
				}
			} catch (e) {
				tlConsole(e);
			}
		}

		try {
			await dbclient.sync({ force: false });

			tlConsole("db sync ok ...");
		} catch (e) {
			tlConsole("db sync err : ",e);
		}
	} catch (e) {
		if(connectRetryTimes++ < 8){
			tlConsole('db connect err, retrying ... ',e.message);
			await new Promise(resolve => setTimeout(resolve, connectRetryTimes * 3000));
			await dbInit();
			return;
		}
		tlConsole('db connect err ',e);
	}
}


module.exports = {
	dbClient: getDbClient(),
	dbInit
}
