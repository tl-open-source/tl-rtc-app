const {
	tlConsole, tlResponseSvrError, tlConsoleError, tlResponseArgsError, checkRequestParams
} = require("../../../utils/utils");
const express = require('express');
const router = express.Router();
const userTagBiz = require('../../../biz/user/user_tag_biz');


/**
 * #controller post /api/web/user-tag/add-channel-tag
 * #desc 添加频道标签
 * @param {*} request
 * @param {*} response
 */
router.post('/add-channel-tag', async function(request, response) {
    try {
        const { name } = request.body;

        if (!checkRequestParams({
            name
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await userTagBiz.addChannelTag({
            loginInfo, name
        });
        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});

/**
 * #controller post /api/web/user-tag/add-friend-tag
 * #desc 添加好友标签
 * @param {*} request
 * @param {*} response
 */
router.post('/add-friend-tag', async function(request, response) {
    try {
        const { name } = request.body;

        if (!checkRequestParams({
            name
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await userTagBiz.addFriendTag({
            loginInfo, name
        });
        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});

/**
 * #controller post /api/web/user-tag/add-cloud-tag
 * #desc 添加云资源库标签
 * @param {*} request
 * @param {*} response
 */
router.post('/add-cloud-tag', async function(request, response) {
    try {
        const { name } = request.body;

        if (!checkRequestParams({
            name
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await userTagBiz.addCloudTag({
            loginInfo, name
        });
        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});

/**
 * #controller post /api/web/user-tag/get-channel-tag-list
 * #desc 获取频道标签列表
 * @param {*} request
 * @param {*} response
 */
router.get('/get-channel-tag-list', async function(request, response) {
    try {
        const loginInfo = request.ctx || {}
        const result = await userTagBiz.getChannelTagList({
            loginInfo
        });
        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});

/**
 * #controller post /api/web/user-tag/get-friend-tag-list
 * #desc 获取好友标签列表
 * @param {*} request
 * @param {*} response
 */
router.get('/get-friend-tag-list', async function(request, response) {
    try {
        const loginInfo = request.ctx || {}
        const result = await userTagBiz.getFriendTagList({
            loginInfo
        });
        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});

/**
 * #controller post /api/web/user-tag/get-cloud-tag-list
 * #desc 获取云资源库标签列表
 * @param {*} request
 * @param {*} response
 */
router.get('/get-cloud-tag-list', async function(request, response) {
    try {
        const loginInfo = request.ctx || {}
        const result = await userTagBiz.getCloudTagList({
            loginInfo
        });
        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});

/**
 * #controller post /api/web/user-tag/delete-tag
 * #desc 删除标签
 * @param {*} request
 * @param {*} response
 */
router.post('/delete-tag', async function(request, response) {
    try {
        const { id } = request.body;

        if (!checkRequestParams({
            id
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await userTagBiz.delUserTag({
            loginInfo, id
        });
        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});



module.exports = router;