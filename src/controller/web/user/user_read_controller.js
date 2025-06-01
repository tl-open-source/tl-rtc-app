const {
	tlResponseSvrError, tlConsoleError, tlResponseArgsError, checkRequestParams,
    encryptData
} = require("../../../utils/utils");
const express = require('express');
const router = express.Router();
const userReadBiz = require('../../../biz/user/user_read_biz');


/**
 * #controller post /api/web/user-read/update-channel-mutil-read
 * #desc 更新频道文件/媒体/聊天消息已读记录
 * @param {*} request
 * @param {*} response
 */
router.post('/update-channel-mutil-read', async function(request, response) {
    try {
        const { 
            channelId,  latestChatReadId,  latestMediaReadId, latestFileReadId 
        } = request.body;

        if (!checkRequestParams({
            channelId, latestChatReadId, latestMediaReadId, latestFileReadId
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await userReadBiz.updateChannelMuiltRead({
            loginInfo, channelId, latestChatReadId, latestMediaReadId, latestFileReadId
        })

        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError())
    }
})

/**
 * #controller post /api/web/user-read/update-channel-chat-read
 * #desc 更新频道聊天消息已读记录
 * @param {*} request
 * @param {*} response
 */
router.post('/update-channel-chat-read', async function(request, response) {
    try {
        const { channelId, latestReadId } = request.body;

        if (!checkRequestParams({
            channelId, latestReadId
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await userReadBiz.updateChannelChatRead({
            loginInfo, channelId, latestReadId
        });

        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError())
    }
});

/**
 * #controller post /api/web/user-read/update-channel-media-read
 * #desc 更新频道媒体消息已读记录
 * @param {*} request
 * @param {*} response
 */
router.post('/update-channel-media-read', async function(request, response) {
    try {
        const { channelId, latestReadId } = request.body;

        if (!checkRequestParams({
            channelId, latestReadId
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await userReadBiz.updateChannelMediaRead({
            loginInfo, channelId, latestReadId
        });

        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError())
    }
})

/**
 * #controller post /api/web/user-read/update-channel-file-read
 * #desc 更新频道文件消息已读记录
 * @param {*} request
 * @param {*} response
 */
router.post('/update-channel-file-read', async function(request, response) {
    try {
        const { channelId, latestReadId } = request.body;

        if (!checkRequestParams({
            channelId, latestReadId
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await userReadBiz.updateChannelFileRead({
            loginInfo, channelId, latestReadId
        });

        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError())
    }
})

/**
 * #controller post /api/web/user-read/update-user-friend-apply-read
 * #desc 新增好友申请消息已读记录
 * @param {*} request
 * @param {*} response
 */
router.post('/update-user-friend-apply-read', async function(request, response) {
    try {
        const { recordId } = request.body;

        if (!checkRequestParams({
            recordId
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await userReadBiz.addUserFriendApplyRead({
            loginInfo, recordId
        });

        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError())
    }
})


/**
 * #controller post /api/web/user-read/update-user-friend-apply-pass-read
 * #desc 新增通过好友申请消息已读记录
 * @param {*} request
 * @param {*} response
 */
router.post('/update-user-friend-apply-pass-read', async function(request, response) {
    try {
        const { recordId } = request.body;

        if (!checkRequestParams({
            recordId
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await userReadBiz.addUserFriendApplyPassRead({
            loginInfo, recordId
        });

        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError())
    }
})

/**
 * #controller post /api/web/user-read/update-user-friend-apply-reject-read
 * #desc 新增拒绝好友申请消息已读记录
 * @param {*} request
 * @param {*} response
 */
router.post('/update-user-friend-apply-reject-read', async function(request, response) {
    try {
        const { applyId } = request.body;

        if (!checkRequestParams({
            applyId
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await userReadBiz.addUserFriendApplyRejectRead({
            loginInfo, applyId
        });

        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError())
    }
})


/**
 * #controller post /api/web/user-read/update-user-group-apply-read
 * 新增群聊申请消息已读记录
 * @param {*} request
 * @param {*} response
 */
router.post('/update-user-group-apply-read', async function(request, response) {
    try {
        const { recordId } = request.body;

        if (!checkRequestParams({
            recordId
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await userReadBiz.addUserGroupApplyRead({
            loginInfo, recordId
        });

        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError())
    }
})

/**
 * #controller post /api/web/user-read/update-user-group-apply-pass-read
 * 新增通过群聊申请消息已读记录
 * @param {*} request
 * @param {*} response
 */
router.post('/update-user-group-apply-pass-read', async function(request, response) {
    try {
        const { recordId } = request.body;

        if (!checkRequestParams({
            recordId
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await userReadBiz.addUserGroupApplyPassRead({
            loginInfo, recordId
        });

        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError())
    }
})

/**
 * #controller post /api/web/user-read/update-user-group-apply-reject-read
 * 新增拒绝群聊申请消息已读记录
 * @param {*} request
 * @param {*} response
 */
router.post('/update-user-group-apply-reject-read', async function(request, response) {
    try {
        const { recordId } = request.body;

        if (!checkRequestParams({
            recordId
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await userReadBiz.addUserGroupApplyRejectRead({
            loginInfo, recordId
        });

        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError())
    }
})

module.exports = router;