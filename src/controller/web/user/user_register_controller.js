const {
	tlResponseSvrError, tlConsoleError, tlResponseArgsError, checkRequestParams
} = require("../../../utils/utils");
const express = require('express');
const router = express.Router();
const bizUserRegister = require('../../../biz/user/user_register_biz');
const bizUserLoginState = require('../../../biz/user/user_login_state_biz');
const {
    LOGIN : {
        LOGIN_TOKEN_KEY
    }
} = require('../../../utils/constant');
const {
    contentFilter, objectContentFilter
} = require('../../../utils/sensitive/content')


/**
 * #controller post /api/web/user-register/register-by-account
 * #desc 通过账号注册
 * @param {*} request
 * @param {*} response
 */
router.post('/register-by-account', async function(request, response) {
	try {
        const { account, password, invite_code } = request.body;
        const { [LOGIN_TOKEN_KEY]: token  } = request.cookies;

        if(token){
            const loginResult = await bizUserLoginState.userIsLogin({
                token
            });
            if(loginResult.success){
                return response.json(loginResult)
            }
        }

        if (!checkRequestParams({
            account, password, invite_code
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const result = await bizUserRegister.userRegisterByAccount({
            account: contentFilter(account), password, invite_code
        });
        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});

/**
 * #controller post /api/web/user-register/register-by-email
 * #desc 通过邮箱注册
 * @param {*} request
 * @param {*} response
 */
router.post('/register-by-email', async function(request, response) {
	try {
        const { email, code, invite_code, password } = request.body;
        const { [LOGIN_TOKEN_KEY]: token  } = request.cookies;

        if(token){
            const loginResult = await bizUserLoginState.userIsLogin({
                token
            });
            if(loginResult.success){
                return response.json(loginResult)
            }
        }

        if (!checkRequestParams({
            email, code, invite_code, password
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const result = await bizUserRegister.userRegisterByEmail({
            email, code, invite_code, password
        });
        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});

/**
 * #controller post /api/web/user-register/get-email-code
 * #desc 获取邮箱验证码
 * @param {*} request
 * @param {*} response
 */
router.post('/get-email-code', async function(request, response) {
    try {
        const { email } = request.body;

        if (!checkRequestParams({
            email
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const result = await bizUserRegister.getEmailCode({
            email
        });
        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});


/**
 * #controller post /api/web/user-register/reset-by-email
 * #desc 重置邮箱用户密码
 * @param {*} request
 * @param {*} response
 */
router.post('/reset-by-email', async function(request, response) {
    try {
        const { code, email, invite_code } = request.body;

        if (!checkRequestParams({
            code, email, invite_code
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const result = await bizUserRegister.resetPasswordByEmail({
            code, email, invite_code
        });
        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError());
    }
});


module.exports = router