const {
	tlResponseSvrError, tlConsoleError, tlResponseArgsError, checkRequestParams,
} = require("../../../utils/utils");
const express = require('express');
const router = express.Router();
const cloudFileBiz = require('../../../biz/cloud/cloud_file_biz');


/**
 * #controller post /api/web/cloud-file/upload-file
 * #desc 上传文件
 * @param {*} request
 * @param {*} response
 */
router.post('/upload-file', async function(request, response) {
    try {
        const file = request.files[0];
        const { channelId, dirId } = request.body;

        if (!checkRequestParams({
            channelId, dirId
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const fileId = request.fileId
        const result = await cloudFileBiz.uploadFile({
            loginInfo, file, channelId, dirId, fileId
        });

        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});


/**
 * #controller post /api/web/cloud-file/download-server-file
 * #desc 下载服务器云文件
 * @param {*} request
 * @param {*} response
 */
router.get('/download-server-file', async function(request, response) {
    try {
        const { fileId, key } = request.query;

        if (!checkRequestParams({
            fileId, key
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await cloudFileBiz.downloadCloudFile({
            loginInfo, fileId, key
        });

        if (!result.success) {
            response.json(result);
            return;
        }

        response.download(result.data);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});


module.exports = router;