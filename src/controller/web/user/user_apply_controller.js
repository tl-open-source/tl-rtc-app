const {
	tlResponseSvrError, tlConsoleError, tlResponseArgsError, checkRequestParams,
} = require("../../../utils/utils");
const express = require('express');
const router = express.Router();
const userApplyBiz = require('../../../biz/user/user_apply_biz');


/**
 * #controller post /api/web/user-apply/add-user-friend-apply
 * #desc 添加好友申请
 * @param {*} request
 * @param {*} response
 */
router.post('/add-user-friend-apply', async function(request, response) {
    try {
        const { friendId, remark } = request.body;

        if (!checkRequestParams({
            friendId, remark
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await userApplyBiz.applyAddFriend({
            loginInfo, friendId, remark
        });

        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});


/**
 * #controller post /api/web/user-apply/pass-user-friend
 * #desc 通过好友申请
 * @param {*} request
 * @param {*} response
 */
router.post('/pass-user-friend', async function(request, response) {
    try {
        const { id, remark } = request.body;

        if (!checkRequestParams({
            id, remark
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await userApplyBiz.passUserFriendApply({
            loginInfo, id, remark
        });

        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});

/**
 * #controller post /api/web/user-apply/reject-user-friend
 * #desc 拒绝好友申请
 * @param {*} request
 * @param {*} response
 */
router.post('/reject-user-friend', async function(request, response) {
    try {
        const { id, remark } = request.body;
        
        if (!checkRequestParams({
            id, remark
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await userApplyBiz.rejectUserFriendApply({
            loginInfo, id, remark
        });

        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});


/**
 * #controller get /api/web/user-apply/get-user-friend-other-apply-list
 * #desc 获取自己收到的用户好友申请列表
 * @param {*} request
 * @param {*} response
 */
router.get('/get-user-friend-other-apply-list', async function(request, response) {
    try {
        const loginInfo = request.ctx || {}
        const result = await userApplyBiz.getUserFriendListFromOther({
            loginInfo
        });

        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});


/**
 * #controller get /api/web/user-apply/get-user-friend-self-apply-list
 * #desc 获取自己发出的用户好友申请列表
 * @param {*} request
 * @param {*} response
 */
router.get('/get-user-friend-self-apply-list', async function(request, response) {
    try {
        const loginInfo = request.ctx || {}
        const result = await userApplyBiz.getUserFriendApplyListFromSelf({
            loginInfo
        });

        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});


/**
 * #controller get /api/web/user-apply/get-user-group-other-apply-list
 * #desc 获取自己收到的群聊申请列表
 * @param {*} request
 * @param {*} response
 */
router.get('/get-user-group-other-apply-list', async function(request, response) {
    try {
        const loginInfo = request.ctx || {}
        const result = await userApplyBiz.getUserGroupListFromOther({
            loginInfo
        });

        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});


/**
 * #controller get /api/web/user-apply/get-user-group-self-apply-list
 * #desc 获取自己发出的群聊申请列表
 * @param {*} request
 * @param {*} response
 */
router.get('/get-user-group-self-apply-list', async function(request, response) {
    try {
        const loginInfo = request.ctx || {}
        const result = await userApplyBiz.getUserGroupApplyListFromSelf({
            loginInfo
        });

        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});


/**
 * #controller post /api/web/user-apply/add-user-group-apply
 * #desc 添加群聊申请
 * @param {*} request
 * @param {*} response
 */
router.post('/add-user-group-apply', async function(request, response) {
    try {
        const { channelId, remark, shareUserId } = request.body;

        if (!checkRequestParams({
            channelId, remark, shareUserId
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await userApplyBiz.applyAddGroup({
            loginInfo, channelId, remark, shareUserId
        });

        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});


/**
 * #controller post /api/web/user-apply/pass-user-group
 * #desc 通过群聊申请
 * @param {*} request
 * @param {*} response
 */
router.post('/pass-user-group', async function(request, response) {
    try {
        const { id, remark } = request.body;

        if (!checkRequestParams({
            id, remark
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await userApplyBiz.passUserGroupApply({
            loginInfo, id, remark
        });

        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});


/**
 * #controller post /api/web/user-apply/reject-user-group
 * #desc 拒绝群聊申请
 * @param {*} request
 * @param {*} response
 */
router.post('/reject-user-group', async function(request, response) {
    try {
        const { id, remark } = request.body;

        if (!checkRequestParams({
            id, remark
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await userApplyBiz.rejectUserGroupApply({
            loginInfo, id, remark
        });
        
        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});

module.exports = router;