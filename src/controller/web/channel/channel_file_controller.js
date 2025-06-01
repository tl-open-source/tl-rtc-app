const {
	tlResponseSvrError, tlConsoleError, tlResponseArgsError, checkRequestParams,
} = require("../../../utils/utils");
const express = require('express');
const router = express.Router();
const channelFileBiz = require('../../../biz/channel/channel_file_biz');



/**
 * #controller post /api/web/channel-file/add-friend-channel-offline-file
 * #desc 发送好友频道离线文件消息
 * @param {*} request
 * @param {*} response
 */
router.post('/add-friend-channel-offline-file', async function(request, response) {
    try {
        const { channelId, cloudFileId } = request.body;

        if (!checkRequestParams({
            channelId, cloudFileId
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await channelFileBiz.addFriendChannelOfflineFile({
            loginInfo, cloudFileId, channelId
        });

        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError())
    }
});


/**
 * #controller post /api/web/channel-file/add-group-channel-offline-file
 * #desc 发送群聊频道离线文件消息
 * @param {*} request
 * @param {*} response
 */
router.post('/add-group-channel-offline-file', async function(request, response) {
    try {
        const { channelId, cloudFileId } = request.body;

        if (!checkRequestParams({
            channelId, cloudFileId
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await channelFileBiz.addGroupChannelOfflineFile({
            loginInfo, cloudFileId, channelId
        });

        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError())
    }
});


module.exports = router;