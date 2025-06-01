const {
	tlResponseSvrError, tlConsoleError, tlResponseArgsError, checkRequestParams,
} = require("../../../utils/utils");
const express = require('express');
const router = express.Router();
const channelNoticeBiz = require('../../../biz/channel/channel_notice_biz');


/**
 * #controller post /api/web/channel-notice/add-channel-notice
 * #desc 发布频道公告
 * @param {*} request
 * @param {*} response
 */
router.post('/add-channel-notice', async function(request, response) {
    try {
        const { channelId, content } = request.body;

        if (!checkRequestParams({
            channelId, content
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await channelNoticeBiz.addNotice({
            loginInfo, channelId, content
        });

        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError())
    }
});

/**
 * #controller get /api/web/channel-notice/get-channel-notice-list
 * #desc 获取频道公告
 * @param {*} request
 * @param {*} response
 */
router.get('/get-channel-notice-list', async function(request, response) {
    try {
        const { channelId } = request.query;

        if (!checkRequestParams({
            channelId,
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await channelNoticeBiz.getNoticeList({
            loginInfo, channelId
        });

        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError())
    }
})


module.exports = router;