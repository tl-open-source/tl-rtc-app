const {
	tlResponseSvrError, tlConsoleError, checkRequestParams, tlResponseArgsError,
} = require("../../../utils/utils");
const express = require('express');
const router = express.Router();
const configBiz = require('../../../biz/config/config_biz');
const {
    contentFilter, objectContentFilter
} = require('../../../utils/sensitive/content')


/**
 * #controller post /api/web/system-web-config/get-system-config
 * #desc 获取系统配置
 * @param {*} request
 * @param {*} response
 */
router.get('/get-system-config', async function(request, response) {
    try{
        const loginInfo = request.ctx || {}
        const result = await configBiz.adminGetSystemEnvConfig({
            loginInfo
        });
        response.json(result);
    }catch(error){
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});


/**
 * #controller post /api/web/system-web-config/update-system-config
 * #desc 修改系统配置
 * @param {*} request
 * @param {*} response
 */
router.post('/update-system-config', async function(request, response) {
    try{
        const { 
            redisConfig,
            webrtcConfig,
            mysqlConfig,
            emailConfig,
         } = request.body;

        if (!checkRequestParams({
            redisConfig,
            webrtcConfig,
            mysqlConfig,
            emailConfig,
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await configBiz.adminSetSystemEnvConfig({
            loginInfo,
            redisConfig,
            webrtcConfig,
            mysqlConfig,
            emailConfig,
        });

        response.json(result);
    }catch(error){
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});


module.exports = router;