const {
	tlResponseSvrError, tlConsoleError, tlResponseArgsError, checkRequestParams,
} = require("../../../utils/utils");
const express = require('express');
const router = express.Router();
const userClearBiz = require('../../../biz/user/user_clear_biz');


/**
 * #controller post /api/web/user-clear/update-channel-mutil-clear
 * #desc 更新频道文件/媒体/聊天消息清理记录
 * @param {*} request
 * @param {*} response
 */
router.post('/update-channel-mutil-clear', async function(request, response) {
    try {
        const {
            channelId
        } = request.body;

        if (!checkRequestParams({
            channelId
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await userClearBiz.updateChannelMuiltClear({
            loginInfo, channelId
        })

        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError())
    }
})

/**
 * #controller post /api/web/user-clear/update-channel-chat-clear
 * #desc 更新频道聊天消息清理记录
 * @param {*} request
 * @param {*} response
 */
router.post('/update-channel-chat-read', async function(request, response) {
    try {
        const { channelId } = request.body;

        if (!checkRequestParams({
            channelId
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await userClearBiz.updateChannelChatClear({
            loginInfo, channelId
        });

        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError())
    }
});

/**
 * #controller post /api/web/user-clear/update-channel-media-clear
 * #desc 更新频道媒体消息清理记录
 * @param {*} request
 * @param {*} response
 */
router.post('/update-channel-media-clear', async function(request, response) {
    try {
        const { channelId } = request.body;

        if (!checkRequestParams({
            channelId
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await userClearBiz.updateChannelMediaClear({
            loginInfo, channelId
        });

        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError())
    }
})

/**
 * #controller post /api/web/user-clear/update-channel-file-clear
 * #desc 更新频道文件消息清理记录
 * @param {*} request
 * @param {*} response
 */
router.post('/update-channel-file-clear', async function(request, response) {
    try {
        const { channelId } = request.body;

        if (!checkRequestParams({
            channelId
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await userClearBiz.updateChannelFileClear({
            loginInfo, channelId
        });

        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError())
    }
})



module.exports = router;