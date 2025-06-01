const {
	tlResponseSvrError, tlConsoleError, tlResponseArgsError,
    checkRequestParams,
} = require("../../../utils/utils");
const express = require('express');
const router = express.Router();
const channelChatBiz = require('../../../biz/channel/channel_chat_biz');
const {
    contentFilter, objectContentFilter
} = require('../../../utils/sensitive/content')


/**
 * #controller post /api/web/channel-chat/add-friend-channel-chat
 * #desc 发送好友频道聊天
 * @param {*} request
 * @param {*} response
 */
router.post('/add-friend-channel-chat', async function(request, response) {
    try {
        const { message, toUserId, toUserName, channelId, atUserId, atUserName } = request.body;

        // 消息内容不过滤
        if (!checkRequestParams({
            toUserId, toUserName, channelId, atUserId, atUserName
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await channelChatBiz.addFriendChannelChat({
            loginInfo, message: contentFilter(message), 
            toUserId, toUserName, channelId, atUserId, atUserName
        });

        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError())
    }
});

/**
 * #controller post /api/web/channel-chat/add-group-channel-chat
 * #desc 发送多人频道聊天
 * @param {*} request
 * @param {*} response
 */
router.post('/add-group-channel-chat', async function(request, response) {
    try {
        const { message, channelId, atUserId, atUserName, isAtAll } = request.body;

        // 消息内容不过滤
        if (!checkRequestParams({
            channelId, atUserId, atUserName, isAtAll
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }
        
        const loginInfo = request.ctx || {}
        const result = await channelChatBiz.addGroupChannelChat({
            loginInfo, message: contentFilter(message), channelId, atUserId, atUserName, isAtAll
        });
        
        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError())
    }
});

/**
 * #controller post /api/web/channel-chat/add-reply-friend-channel-chat
 * #desc 回复好友聊天
 * @param {*} request
 * @param {*} response
 */
router.post('/add-reply-friend-channel-chat', async function(request, response) {
    try {
        const { message, channelId, messageId, messageType, atUserId, atUserName } = request.body;

        // 消息内容不过滤
        if (!checkRequestParams({
            channelId, messageId, messageType, atUserId, atUserName
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await channelChatBiz.addReplyFriendChannelChat({
            loginInfo, message: contentFilter(message), channelId, messageId, messageType, atUserId, atUserName
        });
        
        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError())
    }
});

/**
 * #controller post /api/web/channel-chat/add-reply-group-channel-chat
 * #desc 回复群组聊天
 * @param {*} request
 * @param {*} response
 */
router.post('/add-reply-group-channel-chat', async function(request, response) {
    try {
        const { message, channelId, messageId, messageType, atUserId, atUserName, atAll } = request.body;

        // 消息内容不过滤
        if (!checkRequestParams({
            channelId, messageId, messageType, atUserId, atUserName, atAll
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await channelChatBiz.addReplyGroupChannelChat({
            loginInfo, message: contentFilter(message), channelId, messageId, messageType, atUserId, atUserName, atAll
        });
        
        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError())
    }
});


module.exports = router;
