const {
	tlResponseSvrError, tlConsoleError, tlResponseArgsError, checkRequestParams,
} = require("../../../utils/utils");
const express = require('express');
const router = express.Router();
const companyBiz = require('../../../biz/company/company_biz');


/**
 * #controller post /api/web/company/get-company
 * #desc 获取企业信息
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