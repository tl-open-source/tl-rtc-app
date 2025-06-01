const {
	tlResponseSvrError, tlConsoleError, tlResponseArgsError, checkRequestParams,
} = require("../../../utils/utils");
const express = require('express');
const router = express.Router();
const userBiz = require('../../../biz/user/user_biz');
const {
    LOGIN : {
        LOGIN_TOKEN_KEY
    }
} = require('../../../utils/constant');


/**
 * #controller get /api/web/user/search-user-by-name
 * #desc 搜索用户
 * @param {*} request
 * @param {*} response
 * @return {*} 
 */
router.get('/search-user-by-name', async function(request, response) {
    try {
        const { name } = request.query;

        if (!checkRequestParams({
            name,
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await userBiz.searchUserByName({
            loginInfo, name,
        });

        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});

/**
 * #controller post /api/web/user/search-user-by-id
 * #desc 搜索用户通过id
 * @param {*} request
 * @param {*} response
 * @return {*} 
 */
router.post('/search-user-by-id', async function(request, response) {
    try {
        const { id } = request.body;

        if (!checkRequestParams({
            id,
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }
        
        const loginInfo = request.ctx || {}
        const result = await userBiz.searchUserById({
            loginInfo, id,
        });
        
        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});

/**
 * #controller post /api/web/user/update-user-avatar
 * #desc 更新用户头像
 * @param {*} request
 * @param {*} response
 * @return {*} 
 */
router.post('/update-user-avatar', async function(request, response) {
    try {
        const { cloudFileId } = request.body;
        const { [LOGIN_TOKEN_KEY]: token  } = request.cookies;

        if (!checkRequestParams({
            cloudFileId,
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await userBiz.updateUserAvatar({
            loginInfo, cloudFileId, token
        });

        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});

/**
 * #controller post /api/web/user/bind-email
 * #desc 绑定邮箱
 * @param {*} request
 * @param {*} response
 */
router.post('/bind-email', async function(request, response) {
	try {
        const { email, code } = request.body;
        const { [LOGIN_TOKEN_KEY]: token  } = request.cookies;

        if (!checkRequestParams({
            email, code,
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await userBiz.bindEmail({
            loginInfo, email, code, token
        });

        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});


module.exports = router;