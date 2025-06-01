const {
	tlResponseSvrError, tlConsoleError, tlResponseArgsError, checkRequestParams,
} = require("../../../utils/utils");
const express = require('express');
const router = express.Router();
const companyBiz = require('../../../biz/company/company_biz');


/**
 * #controller post /api/web/system-web-company/add-company
 * #desc 添加企业
 * @param {*} request
 * @param {*} response
 */
router.post('/add-company', async function(request, response) {
    try {
        const { name, address, phone, email, website, logo, description } = request.body;

        if (!checkRequestParams({
            name, address, phone, email, website, logo, description
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await companyBiz.adminAddCompany({
            name, address, phone, email, website, logo, description, loginInfo
        });

        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});


/**
 * #controller post /api/web/system-web-company/update-company
 * #desc 更新企业信息
 * @param {*} request
 * @param {*} response
 */
router.post('/update-company', async function(request, response) {
    try {
        const { 
            id, name, address, phone, email, website, logo, 
            description, code, authStatus, expiredStatus 
        } = request.body;

        if (!checkRequestParams({
            id, name, address, phone, email, website, logo, description,
            code, authStatus, expiredStatus
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await companyBiz.adminUpdateCompany({
            id, name, address, phone, email, website, 
            logo, description, loginInfo, code, authStatus, expiredStatus
        });

        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});


/**
 * #controller post /api/web/system-web-company/get-company-list
 * #desc 获取企业列表
 * @param {*} request
 * @param {*} response
 */
router.get('/get-company-list', async function(request, response) {
    try {
        const { page, limit, keyword } = request.query;

        if (!checkRequestParams({
            page, limit, keyword
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await companyBiz.adminGetCompanyList({
            loginInfo, page, limit, keyword
        });

        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});

/**
 * #controller post /api/web/system-web-company/get-company-info
 * #desc 获取企业详情
 * @param {*} request
 * @param {*} response
 */
router.get('/get-company-info', async function(request, response) {
    try {
        const { id } = request.query;

        if (!checkRequestParams({
            id
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await companyBiz.adminGetCompanyInfo({
            loginInfo, id
        });

        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});

/**
 * #controller post /api/web/system-web-company/delete-company
 * #desc 删除企业
 * @param {*} request
 * @param {*} response
 */
router.post('/delete-company', async function(request, response) {
    try {
        const { id } = request.body;

        if (!checkRequestParams({
            id
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const loginInfo = request.ctx || {}
        const result = await companyBiz.adminDeleteCompany({
            loginInfo, id
        });

        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});



module.exports = router;