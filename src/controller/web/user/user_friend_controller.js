const {
	tlConsole, tlResponseSvrError, tlConsoleError, tlResponseArgsError, checkRequestParams
} = require("../../../utils/utils");
const express = require('express');
const router = express.Router();
const userFriendBiz = require('../../../biz/user/user_friend_biz');


/**
 * #controller post /api/web/user-friend/delete-user-friend
 * #desc 删除好友
 * @param {*} request
 * @param {*} response
 */
router.post('/delete-user-friend', async function(request, response) {
    try {
        const { channelId } = request.body;

        if (!checkRequestParams({
            channelId
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await userFriendBiz.deleteFriend({
            loginInfo, channelId
        });
        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError(error));   
    }
});

/**
 * #controller post /api/web/user-friend/update-user-friend-remark
 * #desc 更新好友信息备注
 * @param {*} request
 * @param {*} response
 */
router.post('/update-user-friend-remark', async function(request, response) {
    try {
        const { channelId, remark } = request.body;

        if (!checkRequestParams({
            channelId, remark
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await userFriendBiz.updateRemark({
            loginInfo, channelId, remark
        });
        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError(error));
    }
});

/**
 * #controller post /api/web/user-friend/update-user-friend-rename
 * #desc 更新好友名称备注
 * @param {*} request
 * @param {*} response
 */
router.post('/update-user-friend-rename', async function(request, response) {
    try {
        const { channelId, rename } = request.body;

        if (!checkRequestParams({
            channelId, rename
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await userFriendBiz.updateRename({
            loginInfo, channelId, rename
        });
        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError(error));
    }
});

/**
 * #controller post /api/web/user-friend/update-user-special
 * #desc 关注好友
 * @param {*} request
 * @param {*} response
 */
router.post('/update-user-friend-special', async function(request, response) {
    try {
        const { channelId, special } = request.body;

        if (!checkRequestParams({
            channelId, special
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await userFriendBiz.updateFriendSpecical({
            loginInfo, channelId, special
        });
        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError(error));
    }
});

/**
 * #controller post /api/web/user-friend/get-user-friend-list
 * #desc 获取用户好友列表
 * @param {*} request
 * @param {*} response
 */
router.get('/get-user-friend-list', async function(request, response) {
    try {
        const loginInfo = request.ctx || {}
        const result = await userFriendBiz.getFriendList({
            loginInfo
        });
        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError(error));
    }
});


module.exports = router;