const {
	tlConsole, tlResponseSvrError, tlConsoleError, tlResponseArgsError, checkRequestParams
} = require("../../../utils/utils");
const express = require('express');
const router = express.Router();
const userConfigBiz = require('../../../biz/user/user_config_biz');


/**
 * #controller post /api/web/user-config/get-user-config
 * #desc 获取用户配置
 * @param {*} request
 * @param {*} response
 */
router.get('/get-user-config', async function(request, response) {
    try {
        const loginInfo = request.ctx || {}
        const result = await userConfigBiz.getUserConfigSetting({
            loginInfo
        });
        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});


/**
 * #controller post /api/web/user-config/update-user-config-normal
 * #desc 更新用户通用设置
 * @param {*} request
 * @param {*} response
 */
router.post('/update-user-config-normal', async function(request, response) {
    try {
        const { normal } = request.body;

        if (!checkRequestParams({
            normal
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await userConfigBiz.updateUserConfigNormal({
            loginInfo, normal
        });
        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});

/**
 * #controller post /api/web/user-config/update-user-config-account
 * #desc 更新用户账号设置
 * @param {*} request
 * @param {*} response
 */
router.post('/update-user-config-account', async function(request, response) {
    try {
        const { account } = request.body;

        if (!checkRequestParams({
            account
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await userConfigBiz.updateUserConfigAccount({
            loginInfo, account
        });
        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});


/**
 * #controller post /api/web/user-config/update-user-config-message
 * #desc 更新用户消息设置
 * @param {*} request
 * @param {*} response
 */
router.post('/update-user-config-message', async function(request, response) {
    try {
        const { message } = request.body;

        if (!checkRequestParams({
            message
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await userConfigBiz.updateUserConfigMessage({
            loginInfo, message
        });
        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});


/**
 * #controller post /api/web/user-config/update-user-config-other
 * #desc 更新用户其他设置
 * @param {*} request
 * @param {*} response
 */
router.post('/update-user-config-other', async function(request, response) {
    try {
        const { other } = request.body;

        if (!checkRequestParams({
            other
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await userConfigBiz.updateUserConfigOther({
            loginInfo, other
        });
        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});


module.exports = router;