const {
	tlResponseSvrError, tlConsoleError, checkRequestParams, tlResponseArgsError,
} = require("../../../utils/utils");
const express = require('express');
const router = express.Router();
const systemServiceBiz = require("../../../biz/system/system_service_biz");


/**
 * #controller post /api/web/system-web-service/restart-service
 * #desc 重启服务
 * @param {*} request
 * @param {*} response
 */
router.post('/restart-service', async function(request, response) {
    try{
        const { serviceName } = request.body;

        if (!checkRequestParams({
            serviceName
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }
        const loginInfo = request.ctx || {}
        const result = await systemServiceBiz.adminReadminStartPm2Service({
            loginInfo, services: serviceName
        });
        response.json(result);
    }catch(error){
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});


/**
 * #controller post /api/web/system-web-service/stop-service
 * #desc 停止服务服务
 * @param {*} request
 * @param {*} response
 */
router.post('/stop-service', async function(request, response) {
    try{
        const { serviceName } = request.body;

        if (!checkRequestParams({
            serviceName
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }
        const loginInfo = request.ctx || {}
        const result = await systemServiceBiz.adminStopPm2Service({
            loginInfo, services: serviceName
        });
        response.json(result);
    }catch(error){
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});


/**
 * #controller post /api/web/system-web-service/start-service
 * #desc 启动服务
 * @param {*} request
 * @param {*} response
 */
router.post('/start-service', async function(request, response) {
    try{
        const { serviceName } = request.body;

        if (!checkRequestParams({
            serviceName
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }
        const loginInfo = request.ctx || {}
        const result = await systemServiceBiz.adminStartPm2Service({
            loginInfo, services: serviceName
        });
        response.json(result);
    }catch(error){
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});


/**
 * #controller get /api/web/system-web-service/get-service-status
 * #desc 获取服务状态
 * @param {*} request
 * @param {*} response
 */
router.get('/get-service-status', async function(request, response) {
    try{
        const loginInfo = request.ctx || {}
        const result = await systemServiceBiz.adminGetServiceStatus({
            loginInfo,
        });
        response.json(result);
    }catch(error){
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});

module.exports = router;