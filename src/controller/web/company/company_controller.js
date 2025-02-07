const {
	tlConsole, tlResponseSvrError, tlConsoleError, tlResponseArgsError, checkRequestParams
} = require("../../../utils/utils");
const express = require('express');
const router = express.Router();
const companyBiz = require('../../../biz/company/company_biz');


/**
 * #controller post /api/web/company/add-company
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
        const result = await companyBiz.addCompany({
            name, address, phone, email, website, logo, description, loginInfo
        });
        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});

/**
 * #controller post /api/web/company/get-company
 * #desc 获取企业
 * @param {*} request
 * @param {*} response
 */
router.post('/get-company', async function(request, response) {
    try {
        const loginInfo = request.ctx || {}
        const result = await companyBiz.getCompanyInfo({
            loginInfo
        });
        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});


module.exports = router;