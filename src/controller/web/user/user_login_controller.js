const {
    tlResponseSvrError, tlConsoleError, 
    tlResponseArgsError, checkRequestParams,
    tlResponseSuccess
} = require("../../../utils/utils");
const express = require('express');
const router = express.Router();
const userLoginBiz = require('../../../biz/user/user_login_biz');
const userLoginStateBiz = require('../../../biz/user/user_login_state_biz');
const {
    LOGIN : {
        LOGIN_TOKEN_KEY,
        LOGIN_TOKEN_EXPIRE,
        SYSTEM_LOGIN_TOKEN_EXPIRE,
        SYSTEM_LOGIN_TOKEN_KEY
    }
} = require('../../../utils/constant');


/**
 * #controller get /api/web/user-login/login-state
 * #desc 获取登录状态
 * @param {*} request
 * @param {*} response
 */
router.get('/login-state', async function(request, response) {
    try {
        const { [LOGIN_TOKEN_KEY]: token  } = request.cookies;
        const result = await userLoginStateBiz.userIsLogin({
            token
        });

        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError())
    }
});

/**
 * #controller post /api/web/user-login/login-by-account
 * #desc 通过账号登录
 * @param {*} request
 * @param {*} response
 */
router.post('/login-by-account', async function(request, response) {
    try {
        const { account, password, fps, inviteCode } = request.body;
        const { [LOGIN_TOKEN_KEY]: token  } = request.cookies;

        if(token){
            const loginResult = await userLoginStateBiz.userIsLogin({
                token
            });
            if(loginResult.success){
                return response.json(loginResult)
            }
        }

        if (!checkRequestParams({
            account, password, fps, inviteCode
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const result = await userLoginBiz.userLoginByAccount({
            account, password, fps, inviteCode
        });

        response.cookie(LOGIN_TOKEN_KEY, result.data, { 
            maxAge: LOGIN_TOKEN_EXPIRE, httpOnly: true 
        });

        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError())
    }
});

/**
 * #controller post /api/web/user-login/login-by-email
 * #desc 通过邮箱登录
 * @param {*} request
 * @param {*} response
 */
router.post('/login-by-email', async function(request, response) {
    try {
        const { email, password, fps, inviteCode } = request.body;
        const { [LOGIN_TOKEN_KEY]: token  } = request.cookies;

        if(token){
            const loginResult = await userLoginStateBiz.userIsLogin({
                token
            });
            if(loginResult.success){
                return response.json(loginResult)
            }
        }

        if (!checkRequestParams({
            email, password, fps, inviteCode
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const result = await userLoginBiz.userLoginByEmail({
            email, password, fps, inviteCode
        });
        
        response.cookie(LOGIN_TOKEN_KEY, result.data, { 
            maxAge: LOGIN_TOKEN_EXPIRE, httpOnly: true 
        });

        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError())
    }
});


/**
 * #controller post /api/web/user-login/login-by-fp
 * #desc 通过指纹一键登录
 * @param {*} request
 * @param {*} response
 */
router.post('/login-by-fp', async function(request, response) {
    try {
        const { username, fps, inviteCode } = request.body;
        const { [LOGIN_TOKEN_KEY]: token  } = request.cookies;

        if(token){
            const loginResult = await userLoginStateBiz.userIsLogin({
                token
            });
            if(loginResult.success){
                return response.json(loginResult)
            }
        }

        if (!checkRequestParams({
            username, fps, inviteCode
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const result = await userLoginBiz.userLoginByFingerPrint({
            username, fps, inviteCode
        });

        response.cookie(LOGIN_TOKEN_KEY, result.data, { 
            maxAge: LOGIN_TOKEN_EXPIRE, httpOnly: true 
        });

        response.json(result);
        
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError())
    }
});


/**
 * #controller get /api/web/user-login/system-login-state
 * #desc 获取管理员登录状态
 * @param {*} request
 * @param {*} response
 */
router.get('/system-login-state', async function(request, response) {
    try {
        const { [SYSTEM_LOGIN_TOKEN_KEY]: token  } = request.cookies;
        const result = await userLoginStateBiz.userIsLogin({
            token
        });

        if(!result.success){
            return response.json(result)
        }

        const data = {
            loginUserId: result.data.loginUserId,
            loginUserEmail: result.data.loginUserEmail,
            loginUsername: result.data.loginUsername,
            loginUserAvatar: result.data.loginUserAvatar,
            loginTime: result.data.loginTime,
            token: result.data.token,
        }
        response.json(tlResponseSuccess("在线", data));
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError())
    }
});


/**
 * #controller post /api/web/user-login/login-by-system
 * #desc 管理员登录
 * @param {*} request
 * @param {*} response
 */
router.post('/login-by-system', async function(request, response) {
    try {
        const { email, password } = request.body;
        const { [SYSTEM_LOGIN_TOKEN_KEY]: token  } = request.cookies;

        if(token){
            const loginResult = await userLoginStateBiz.userIsLogin({
                token
            });
            if(loginResult.success){
                return response.json(loginResult)
            }
        }

        if (!checkRequestParams({
            email, password
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const result = await userLoginBiz.userLoginBySystem({
            email, password
        });

        response.cookie(SYSTEM_LOGIN_TOKEN_KEY, result.data, { 
            maxAge: SYSTEM_LOGIN_TOKEN_EXPIRE, httpOnly: true 
        });

        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError())
    }
});





module.exports = router