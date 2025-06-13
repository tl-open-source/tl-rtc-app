const {
	tlResponseSvrError, tlConsoleError, tlResponseArgsError, checkRequestParams,
} = require("../../../utils/utils");
const express = require('express');
const router = express.Router();
const cutPasteBiz = require('../../../biz/cut_paste/cut_paste_biz');
const {
    contentFilter, objectContentFilter
} = require('../../../utils/sensitive/content')


/**
 * #controller get /api/web/cut-paste/get-cut-paste-list
 * #desc 获取剪切板列表
 * @param {*} request
 * @param {*} response
 */
router.get('/get-cut-paste-list', async function(request, response) {
    try {
        const loginInfo = request.ctx || {}
        const result = await cutPasteBiz.getCutPasteList({
            loginInfo
        });

        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});


/**
 * #controller post /api/web/cut-paste/add-cut-paste
 * #desc 新增剪切板
 * @param {*} request
 * @param {*} response
 */
router.post('/add-cut-paste', async function(request, response) {
    try {
        const { code, title, password } = request.body;
        const loginInfo = request.ctx || {}

        if (!checkRequestParams({
            code, title, password
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const result = await cutPasteBiz.createCutPaste({
            loginInfo, code, title: contentFilter(title), password
        });

        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});


/**
 * #controller post /api/web/cut-paste/update-cut-paste-title
 * #desc 更新剪切板标题
 * @param {*} request
 * @param {*} response
 */
router.post('/update-cut-paste-title', async function(request, response) {
    try {
        const { cutPasteId, title } = request.body;
        const loginInfo = request.ctx || {}

        if (!checkRequestParams({
            cutPasteId, title
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const result = await cutPasteBiz.updateCutPasteTitle({
            loginInfo, cutPasteId, title: contentFilter(title),
        });

        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});


/**
 * #controller post /api/web/cut-paste/update-cut-paste-password
 * #desc 更新剪切板密码
 * @param {*} request
 * @param {*} response
 */
router.post('/update-cut-paste-password', async function(request, response) {
    try {
        const { cutPasteId, password } = request.body;
        const loginInfo = request.ctx || {}

        if (!checkRequestParams({
            cutPasteId, password
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const result = await cutPasteBiz.updateCutPastePassword({
            loginInfo, cutPasteId, password
        });

        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});


/**
 * #controller post /api/web/cut-paste/close-cut-paste
 * #desc 关闭剪切板
 * @param {*} request
 * @param {*} response
 */
router.post('/close-cut-paste', async function(request, response) {
    try {
        const { cutPasteId } = request.body;
        const loginInfo = request.ctx || {}

        if (!checkRequestParams({
            cutPasteId
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const result = await cutPasteBiz.closeCutPaste({
            loginInfo, cutPasteId
        });

        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});


/**
 * #controller post /api/web/cut-paste/open-cut-paste
 * #desc 开启剪切板
 * @param {*} request
 * @param {*} response
 */
router.post('/open-cut-paste', async function(request, response) {
    try {
        const { cutPasteId } = request.body;
        const loginInfo = request.ctx || {}

        if (!checkRequestParams({
            cutPasteId
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const result = await cutPasteBiz.openCutPaste({
            loginInfo, cutPasteId
        });

        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});


/**
 * #controller post /api/web/cut-paste/delete-cut-paste
 * #desc 删除剪切板
 * @param {*} request
 * @param {*} response
 */
router.post('/delete-cut-paste', async function(request, response) {
    try {
        const { cutPasteId } = request.body;
        const loginInfo = request.ctx || {}

        if (!checkRequestParams({
            cutPasteId
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const result = await cutPasteBiz.deleteCutPaste({
            loginInfo, cutPasteId
        });

        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});


/**
 * #controller post /api/web/cut-paste/delete-cut-paste-detail
 * #desc 删除剪切板详情
 * @param {*} request
 * @param {*} response
 */
router.post('/delete-cut-paste-detail', async function(request, response) {
    try {
        const { cutPasteDetailId } = request.body;
        const loginInfo = request.ctx || {}

        if (!checkRequestParams({
            cutPasteDetailId
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const result = await cutPasteBiz.deleteCutPasteDetail({
            loginInfo, cutPasteDetailId
        });

        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});



/**
 * #controller post /api/web/cut-paste/add-cut-paste-detail
 * #desc 新增剪切板详情
 * @param {*} request
 * @param {*} response
 */
router.post('/add-cut-paste-detail', async function(request, response) {
    try {
        const { cutPasteId, content } = request.body;
        const loginInfo = request.ctx || {}

        if (!checkRequestParams({
            cutPasteId
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const result = await cutPasteBiz.addCutPasteDetail({
            loginInfo, cutPasteId, content: contentFilter(content),
        });

        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});



/**
 * #controller post /api/web/cut-paste/get-cut-paste-detail-list
 * #desc 获取剪切板详情列表
 * @param {*} request
 * @param {*} response
 */
router.post('/get-cut-paste-detail-list', async function(request, response) {
    try {
        const { cutPasteId, typeList } = request.body;
        const loginInfo = request.ctx || {}

        if (!checkRequestParams({
            cutPasteId, typeList
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const result = await cutPasteBiz.getCutPasteDetailList({
            loginInfo, cutPasteId, typeList
        });

        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});




module.exports = router;

