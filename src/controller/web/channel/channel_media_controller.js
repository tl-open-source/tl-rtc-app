const {
	tlResponseSvrError, tlConsoleError, tlResponseArgsError, checkRequestParams,
} = require("../../../utils/utils");
const express = require('express');
const router = express.Router();
const channelMediaBiz = require('../../../biz/channel/channel_media_biz');


/**
 * #controller post /api/web/channel-media/add-friend-channel-audio
 * #desc 发送好友频道语音聊天消息
 * @param {*} request
 * @param {*} response
 */
router.post('/add-friend-channel-audio', async function(request, response) {
    try {
        const { channelId } = request.body;

        if (!checkRequestParams({
            channelId,
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await channelMediaBiz.addFriendChannelAudio({
            loginInfo, media : {}, channelId
        });

        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError())
    }
});

/**
 * #controller post /api/web/channel-media/add-friend-channel-video
 * #desc 发送好友频道视频消息
 * @param {*} request
 * @param {*} response
 */
router.post('/add-friend-channel-video', async function(request, response) {
    try {
        const { channelId } = request.body;

        if (!checkRequestParams({
            channelId,
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await channelMediaBiz.addFriendChannelVideo({
            loginInfo, media: {}, channelId
        });

        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError())
    }
});

/**
 * #controller post /api/web/channel-media/add-group-channel-audio
 * #desc 发送多人频道语音聊天消息
 * @param {*} request
 * @param {*} response
 */
router.post('/add-group-channel-audio', async function(request, response) {
    try {
        const { channelId } = request.body;

        if (!checkRequestParams({
            channelId,
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }
        
        const loginInfo = request.ctx || {}
        const result = await channelMediaBiz.addGroupChannelAudio({
            loginInfo, media: {}, channelId
        });

        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError())
    }
});

/**
 * #controller post /api/web/channel-media/add-group-channel-video
 * #desc 发送多人频道视频消息
 * @param {*} request
 * @param {*} response
 */
router.post('/add-group-channel-video', async function(request, response) {
    try {
        const { channelId } = request.body;

        if (!checkRequestParams({
            channelId,
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }
        
        const loginInfo = request.ctx || {}
        const result = await channelMediaBiz.addGroupChannelVideo({
            loginInfo, media: {}, channelId
        });

        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError())
    }
});


module.exports = router;