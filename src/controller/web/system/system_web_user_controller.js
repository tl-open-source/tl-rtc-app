const {
	tlResponseSvrError, tlConsoleError, tlResponseArgsError, checkRequestParams,
} = require("../../../utils/utils");
const express = require('express');
const router = express.Router();
const userBiz = require('../../../biz/user/user_biz');


/**
 * #controller post /api/web/system-web-user/add-user
 * #desc 添加用户
 * @param {*} request
 * @param {*} response
 */
router.post('/add-user', async function(request, response) {
    try {
        const { 
            companyId, name, password, email, mobile, avatarUrl, roleId,
         } = request.body;

        if (!checkRequestParams({
            companyId, name, password, email, mobile, avatarUrl, roleId,
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await userBiz.adminAddUser({
            companyId, name, password, email, mobile, avatarUrl, roleId, loginInfo
        });

        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});


/**
 * #controller post /api/web/system-web-user/update-user
 * #desc 更新用户
 * @param {*} request
 * @param {*} response
 */
router.post('/update-user', async function(request, response) {
    try {
        const { 
            id, companyId, name, password, email, mobile, avatarUrl, roleId,
            wchatName, wchatOpenId, wchatUnionId, wchatAvatarUrl,
         } = request.body;

        if (!checkRequestParams({
            id, companyId, name, password, email, mobile, avatarUrl, roleId,
            wchatName, wchatOpenId, wchatUnionId, wchatAvatarUrl,
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await userBiz.adminUpdateUser({
            id, companyId, name, password, email, mobile, avatarUrl, roleId,
            wchatName, wchatOpenId, wchatUnionId, wchatAvatarUrl, loginInfo
        });

        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
})


/**
 * #controller post /api/web/system-web-user/delete-user
 * #desc 删除用户
 * @param {*} request
 * @param {*} response
 */
router.post('/delete-user', async function(request, response) {
    try {
        const { id, companyId } = request.body;

        if (!checkRequestParams({ id, companyId })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await userBiz.adminDeleteUser({ id, companyId, loginInfo });

        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
})


/**
 * #controller post /api/web/system-web-user/get-user-list
 * #desc 获取用户列表
 * @param {*} request
 * @param {*} response
 */
router.get('/get-user-list', async function(request, response) {
    try {
        const { 
            keyword, page, limit, companyId
        } = request.query;

        if (!checkRequestParams({
            keyword, page, limit, companyId
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await userBiz.adminGetUserList({
            keyword, page, limit, loginInfo, companyId
        });

        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
})

/**
 * #controller post /api/web/system-web-user/get-user-info
 * #desc 获取用户信息
 * @param {*} request
 * @param {*} response
 */
router.get('/get-user-info', async function(request, response) {
    try {
        const { 
            companyId, id
        } = request.query;

        if (!checkRequestParams({
            companyId, id
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await userBiz.adminGetUserInfo({
            loginInfo, companyId, id
        });

        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
})





module.exports = router;