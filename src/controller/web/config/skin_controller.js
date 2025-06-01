const {
	tlResponseSvrError, tlConsoleError, 
    checkRequestParams, tlResponseArgsError,
    tlResponseSuccess
} = require("../../../utils/utils");
const express = require('express');
const router = express.Router();
const {
    LOGIN : {
        LOGIN_TOKEN_KEY    
	}
} = require('../../../utils/constant');
const darkConf = require('../../../../conf/skin/dark');
const lightConf = require('../../../../conf/skin/light');


/**
 * #controller get /api/web/config-skin/detail
 * #desc 获取皮肤配置
 * @param {*} request 
 * @param {*} response
 */
router.get("/get-detail", async function(request, response){
	try {
		const { [LOGIN_TOKEN_KEY]: token  } = request.cookies;
        const { skin } = request.query;

        if (!checkRequestParams({
            skin
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        if(skin === 'dark'){
            response.json(tlResponseSuccess("获取成功", darkConf))
            return
        }

        if(skin === 'light'){
            response.json(tlResponseSuccess("获取成功", lightConf))
            return
        }

        response.json(tlResponseArgsError("请求参数非法"));
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError())
	}
})


module.exports = router