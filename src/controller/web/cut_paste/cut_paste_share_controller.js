const {
	tlConsole, tlResponseSvrError, tlConsoleError, tlResponseArgsError, checkRequestParams
} = require("../../../utils/utils");
const express = require('express');
const router = express.Router();
const cutPasteBiz = require('../../../biz/cut_paste/cut_paste_biz');


/**
 * #controller post /api/web/cut-paste-share/share-get-cut-paste-list
 * #desc 通过分享渠道获取剪切板列表
 * @param {*} request
 * @param {*} response
 */
router.post('/share-get-cut-paste-list', async function(request, response) {
    try {
        const { code, typeList, password } = request.body;
        if (!checkRequestParams({
            code, typeList, password
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const result = await cutPasteBiz.getCutPasteDetailListByCode({
            code, typeList, inputPassword: password
        });

        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});


/**
 * #controller post /api/web/cut-paste-share/share-add-cut-paste-detail
 * #desc 通过分享渠道新增剪切板详情
 * @param {*} request
 * @param {*} response
 */
router.post('/share-add-cut-paste-detail', async function(request, response) {
    try {
        const { code, content, password } = request.body;
        
        if (!checkRequestParams({
            code, password
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const result = await cutPasteBiz.addCutPasteDetailByCode({
            code, content, inputPassword: password
        });
        
        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});


module.exports = router;

