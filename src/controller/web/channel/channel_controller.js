const {
	tlResponseSvrError, tlConsoleError, checkRequestParams, tlResponseArgsError,
} = require("../../../utils/utils");
const express = require('express');
const router = express.Router();
const channelBiz = require('../../../biz/channel/channel_biz');
const {
    contentFilter, objectContentFilter
} = require('../../../utils/sensitive/content')


/**
 * #controller post /api/web/channel/search-channel-by-id
 * #desc 根据频道id搜索频道
 * @param {*} request
 * @param {*} response
 */
router.post('/search-channel-by-id', async function(request, response) {
    try{
        const { channelId, shareUserId } = request.body;

        if (!checkRequestParams({
            channelId, shareUserId
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await channelBiz.searchChannelById({
            channelId, loginInfo, shareUserId
        });

        response.json(result);
    }catch(error){
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});

/**
 * #controller post /api/web/channel/add-channel
 * #desc 添加频道
 * @param {*} request
 * @param {*} response
 */
router.post('/add-channel', async function(request, response) {
    try{
        const { channelName } = request.body;

        if (!checkRequestParams({
            channelName,
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await channelBiz.addChannel({
            channelName: contentFilter(channelName), loginInfo
        });

        response.json(result);
    }catch(error){
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});


/**
 * #controller get /api/web/channel/get-channel-list
 * #desc 获取频道列表
 * @param {*} request
 * @param {*} response
 */
router.get('/get-channel-list', async function(request, response) {
    try {
        const loginInfo = request.ctx || {}
        const result = await channelBiz.getChannelList({ loginInfo });
    
        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});


/**
 * #controller get /api/web/channel/get-channel-info
 * #desc 获取频道信息
 * @param {*} request
 * @param {*} response
 */
router.get('/get-channel-info', async function(request, response) {
    try {
        const { channelId } = request.query;

        if (!checkRequestParams({
            channelId,
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await channelBiz.getChannelInfo({ loginInfo, channelId });

        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});


/**
 * #controller post /api/web/channel/get-channel-name
 * #desc 获取频道名称
 * @param {*} request
 * @param {*} response
 */
router.post('/get-channel-name', async function(request, response) {
    try {
        const { channelId } = request.body;

        if (!checkRequestParams({
            channelId,
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await channelBiz.getChannelNameById({ loginInfo, channelId });
        
        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});


/**
 * #controller post /api/web/channel/update-channel-name
 * #desc 修改频道名称
 * @param {*} request
 * @param {*} response
 */
router.post('/update-channel-name', async function(request, response) {
    try {
        const { channelId, channelName } = request.body;

        if (!checkRequestParams({
            channelId, channelName
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await channelBiz.updateChannelName({ 
            channelId, channelName: contentFilter(channelName), loginInfo 
        });

        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});

/**
 * #controller post /api/web/channel/update-channel-can-search
 * #desc 修改频道是否可以被搜索
 * @param {*} request
 * @param {*} response
 */
router.post('/update-channel-can-search', async function(request, response) {
    try {
        const { channelId, canSearch } = request.body;

        if (!checkRequestParams({
            channelId, canSearch
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await channelBiz.updateChannelCanSearch({ 
            channelId, canSearch, loginInfo 
        });
        
        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});

/**
 * #controller post /api/web/channel/get-channel-message
 * #desc 获取频道聊天记录
 * @param {*} request
 * @param {*} response
 */
router.post('/get-channel-message', async function(request, response) {
    try {
        const { 
            channelId, chatMinId, fileMinId, mediaMinId
        } = request.body;

        if (!checkRequestParams({
            channelId, chatMinId, fileMinId, mediaMinId
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }
        
        const loginInfo = request.ctx || {}
        const result = await channelBiz.getChannelChatList({
            loginInfo, channelId, chatMinId, fileMinId, mediaMinId
        });

        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError())
    }
})

/**
 * #controller post /api/web/channel/get-channel-message-list
 * #desc 获取频道列表聊天记录
 * @param {*} request
 * @param {*} response
 */
router.post('/get-channel-message-list', async function(request, response) {
    try {
        const { channelIdList } = request.body;

        if (!checkRequestParams({
            channelIdList
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }
        
        const loginInfo = request.ctx || {}
        const result = await channelBiz.getChannelChatListByChannelIdList({
            loginInfo, channelIdList
        });

        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError())
    }
});

/**
 * #controller post /api/web/channel/search-channel-message
 * #desc 搜索频道聊天记录
 * @param {*} request
 * @param {*} response
 */
router.post('/search-channel-message', async function(request, response) {
    try {
        const { 
            channelId, keyword, startTime, endTime,
            types, chatMinId, fileMinId, mediaMinId
        } = request.body;

        if (!checkRequestParams({
            channelId, keyword, startTime, endTime,
            types, chatMinId, fileMinId, mediaMinId
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }
        
        const loginInfo = request.ctx || {}
        const result = await channelBiz.searchChannelChatList({
            loginInfo, channelId, startTimeStamp: startTime, endTimeStamp: endTime, types, keyword,
            chatMinId, fileMinId, mediaMinId
        });

        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError())
    }
})

/**
 * #controller get /api/web/channel/get-group-channel-list
 * #desc 获取群组频道列表
 * @param {*} request
 * @param {*} response
 */
router.get('/get-group-channel-list', async function(request, response) {
    try {
        const loginInfo = request.ctx || {}
        const result = await channelBiz.getChannelGroupList({ loginInfo });
        
        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});


module.exports = router;
