const {
	tlConsole, tlResponseSvrError, tlConsoleError, tlResponseArgsError, checkRequestParams
} = require("../../../utils/utils");
const express = require('express');
const router = express.Router();
const channelUserBiz = require('../../../biz/channel/channel_user_biz');



/**
 * #controller post /api/web/channel-user/add-channel-user
 * #desc 添加频道用户
 * @param {*} request
 * @param {*} response
 */
router.post('/add-channel-user', async function(request, response){
    try{
        const { channelId, userId, roleId } = request.body;
        if (!checkRequestParams({
            channelId, userId, roleId
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await channelUserBiz.addChannelUser({ loginInfo, channelId, userId, roleId });

        response.json(result);
    }catch(error){
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});


/**
 * #controller post /api/web/channel-user/share-join-channel
 * #desc 分享加入群聊
 * @param {*} request
 * @param {*} response
 */
router.post('/share-join-channel', async function(request, response){
    try {
        const { channelId } = request.body;
        if (!checkRequestParams({
            channelId
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await channelUserBiz.shareJoinGroupChannel({ loginInfo, channelId });
        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});


/**
 * #controller post /api/web/channel-user/add-channel-user-normal
 * #desc 添加频道普通身份用户
 * @param {*} request
 * @param {*} response
 */
router.post('/add-channel-user-normal', async function(request, response){
    try {
        const { channelId, userId } = request.body;
        if (!checkRequestParams({
            channelId, userId
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await channelUserBiz.addChannelUserNormal({ loginInfo, channelId, userId });
        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});


/**
 * #controller post /api/web/channel-user/add-channel-user-list-normal
 * #desc 批量添加频道普通身份用户
 * @param {*} request
 * @param {*} response
 */
router.post('/add-channel-user-list-normal', async function(request, response){
    try {
        const { channelId, userIdList } = request.body;
        if (!checkRequestParams({
            channelId, userIdList
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await channelUserBiz.addChannelUserListNormal({ loginInfo, channelId, userIdList });
        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});


/**
 * #controller post /api/web/channel-user/add-channel-user-admin
 * #desc 添加频道管理员身份用户
 * @param {*} request
 * @param {*} response
 */
router.post('/add-channel-user-admin', async function(request, response){
    try {
        const { channelId, userId } = request.body;
        if (!checkRequestParams({
            channelId, userId
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await channelUserBiz.addChannelUserAdmin({ loginInfo, channelId, userId });
        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});


/**
 * #controller post /api/web/channel-user/delete-channel-user
 * #desc 删除频道用户
 * @param {*} request
 * @param {*} response
 */
router.post('/delete-channel-user', async function(request, response){
    try {
        const { channelId, userId } = request.body;
        if (!checkRequestParams({
            channelId, userId
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await channelUserBiz.removeChannelUser({ loginInfo, channelId, userId });
        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});


/**
 * #controller post /api/web/channel-user/update-channel-user-role-admin
 * #desc 更新频道用户角色为管理员
 * @param {*} request
 * @param {*} response
 */
router.post('/update-channel-user-role-admin', async function(request, response){
    try {
        const { channelId, userId } = request.body;
        if (!checkRequestParams({
            channelId, userId
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await channelUserBiz.updateChannelUserRoleAdmin({ loginInfo, channelId, userId });
        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});


/**
 * #controller post /api/web/channel-user/update-channel-user-role-normal
 * #desc 更新频道用户角色为普通用户
 * @param {*} request
 * @param {*} response
 */
router.post('/update-channel-user-role-normal', async function(request, response){
    try {
        const { channelId, userId } = request.body;
        if (!checkRequestParams({
            channelId, userId
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await channelUserBiz.updateChannelUserRoleNormal({ loginInfo, channelId, userId });
        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});


/**
 * #controller get /api/web/channel-user/get-channel-list-user-list
 * #desc 获取所有频道列表的用户
 * @param {*} request
 * @param {*} response
 */
router.get('/get-channel-list-user-list', async function(request, response) {
    try {

        const loginInfo = request.ctx || {}
        const result = await channelUserBiz.getChannelListUserList({ loginInfo });
        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});


/**
 * #controller get /api/web/channel-user/get-channel-user-list
 * #desc 获取某个频道的用户列表
 * @param {*} request
 * @param {*} response
 */
router.get('/get-channel-user-list', async function(request, response) {
    try {
        const { channelId } = request.query;

        if (!checkRequestParams({
            channelId
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await channelUserBiz.getChannelUserList({ loginInfo, channelId });
        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});


/**
 * #controller get /api/web/channel-user/update-channel-top
 * #desc 修改频道是否置顶
 * @param {*} request
 * @param {*} response
 */
router.post('/update-channel-top', async function(request, response) {
    try {
        const { channelId, top } = request.body;

        if (!checkRequestParams({
            channelId, top
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await channelUserBiz.updateChannelToTop({ 
            channelId, top, loginInfo 
        });
        
        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});

/**
 * #controller get /api/web/channel-user/update-channel-black
 * #desc 修改频道是否拉黑
 * @param {*} request
 * @param {*} response
 */
router.post('/update-channel-black', async function(request, response) {
    try {
        const { channelId, black } = request.body;

        if (!checkRequestParams({
            channelId, black
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await channelUserBiz.updateChannelToBlack({ 
            channelId, black, loginInfo 
        });
        
        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});

/**
 * #controller get /api/web/channel-user/exit-channel
 * #desc 退出频道
 * @param {*} request
 * @param {*} response
 */
router.post('/exit-channel', async function(request, response) {
    try {
        const { channelId } = request.body;

        if (!checkRequestParams({
            channelId,
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await channelUserBiz.exitChannel({ 
            channelId, loginInfo 
        });
        
        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});



module.exports = router;