const {
	tlResponseSvrError, tlConsoleError, tlResponseArgsError, checkRequestParams,
} = require("../../../utils/utils");
const express = require('express');
const router = express.Router();
const channelBiz = require('../../../biz/channel/channel_biz');


/**
 * #controller post /api/web/system-web-channel/add-channel
 * #desc 添加频道
 * @param {*} request
 * @param {*} response
 */
router.post('/add-channel', async function(request, response) {
    try {
        const { 
            channelName, companyId, userId, canSearch
         } = request.body;

        if (!checkRequestParams({
            channelName, companyId, userId, canSearch
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await channelBiz.adminAddChannel({
            channelName, loginInfo, companyId, userId, canSearch
        });

        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});


/**
 * #controller post /api/web/system-web-channel/update-channel
 * #desc 更新频道
 * @param {*} request
 * @param {*} response
 */
router.post('/update-channel', async function(request, response) {
    try {
        const { 
            companyId, channelName, id, canSearch
         } = request.body;

        if (!checkRequestParams({
            companyId, channelName, id, canSearch
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await channelBiz.adminUpdateChannel({
            companyId, channelName, channelId: id, loginInfo, canSearch
        });

        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
})


/**
 * #controller post /api/web/system-web-channel/delete-channel
 * #desc 删除频道
 * @param {*} request
 * @param {*} response
 */
router.post('/delete-channel', async function(request, response) {
    try {
        const { id, companyId } = request.body;

        if (!checkRequestParams({ id, companyId })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await channelBiz.adminDeleteChannel({ channelId: id, companyId, loginInfo });

        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
})


/**
 * #controller post /api/web/system-web-channel/get-channel-list
 * #desc 获取频道列表
 * @param {*} request
 * @param {*} response
 */
router.get('/get-channel-list', async function(request, response) {
    try {
        const { 
            keyword, page, limit
        } = request.query;

        if (!checkRequestParams({
            keyword, page, limit
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await channelBiz.adminGetChannelList({
            keyword, page, limit, loginInfo
        });

        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
})


/**
 * #controller post /api/web/system-web-channel/get-channel-user-list
 * #desc 获取频道用户列表
 * @param {*} request
 * @param {*} response
 */
router.get('/get-channel-user-list', async function(request, response) {
    try {
        const { 
            keyword, page, limit, channelId
        } = request.query;

        if (!checkRequestParams({
            keyword, page, limit, channelId
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await channelBiz.adminGetChannelUserList({
            keyword, page, limit, loginInfo, channelId
        });

        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
})




module.exports = router;