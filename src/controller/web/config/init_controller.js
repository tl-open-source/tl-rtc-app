const {
	getClientIP, getLocalIP, tlConsole, tlResponseSvrError, tlConsoleError,
} = require("../../../utils/utils");
const express = require('express');
const router = express.Router();
const configBiz = require('../../../biz/config/config_biz')
const {
    LOGIN : {
        LOGIN_TOKEN_KEY    
	}
} = require('../../../utils/constant');


/**
 * #controller get /api/web/config/init
 * #desc 获取ip地址,初始化等相关配置
 * @param {*} request 
 * @param {*} response
 */
router.get("/init", async function(request, response){
	try {
		const { [LOGIN_TOKEN_KEY]: token  } = request.cookies;
		
        //是否开启turn
		const openTurn = (request.query.turn || "") === 'true';
		//使用的账号模式, true : 有效账号模式, false : 固定账号
		const useSecret = (request.query.secret || "") === 'true' || true;
		//获取ip相关信息
		let regexIP = /^((?:(?:25[0-5]|2[0-4]\d|[01]?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d?\d))$/;
		let ip = getLocalIP();
		if (!regexIP.test(ip)) {
			ip = getClientIP(request)
		}
		if (!regexIP.test(ip)) {
			ip = "127.0.0.1"
		}

		const result = await configBiz.initData({
			openTurn, useSecret, ip, token
		})
		response.json(result)
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError())
	}
})


module.exports = router