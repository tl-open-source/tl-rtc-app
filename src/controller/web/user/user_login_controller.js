const {
	tlConsole, 
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

        WEBSITE_LOGIN_TOKEN_KEY,
        WEBSITE_LOGIN_TOKEN_EXPIRE
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
        const { account, password, fps } = request.body;
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
            account, password, fps
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const result = await userLoginBiz.userLoginByAccount({
            account, password, fps
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
 * #controller post /api/web/user-login/login-by-mobile
 * #desc 通过手机号登录
 * @param {*} request
 * @param {*} response
 */
router.post('/login-by-mobile', async function(request, response) {
    try {
        const { mobile, code, fps } = request.body;
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
            mobile, code, fps
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const result = await userLoginBiz.userLoginByMobile({
            mobile, code, fps
        });
        
        response.cookie(LOGIN_TOKEN_KEY, result.data, { 
            maxAge: LOGIN_TOKEN_EXPIRE, httpOnly: true 
        });

        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError())
    }
})

/**
 * #controller post /api/web/user-login/login-by-email
 * #desc 通过邮箱登录
 * @param {*} request
 * @param {*} response
 */
router.post('/login-by-email', async function(request, response) {
    try {
        const { email, password, fps } = request.body;
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
            email, password, fps
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const result = await userLoginBiz.userLoginByEmail({
            email, password, fps
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
 * #controller post /api/web/user-login/login-by-code
 * #desc 游客登录
 * @param {*} request
 * @param {*} response
 */
router.post('/login-by-guest', async function(request, response) {
    try {
        const { code } = request.body;
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
            code
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const result = await userLoginBiz.userLoginByGuest({
            code
        });
        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError())
    }
});

/**
 * #controller post /api/web/user-login/login-by-wechat
 * #desc 微信登录
 * @param {*} request
 * @param {*} response
 */
router.post('/login-by-wechat', async function(request, response) {
    try {
        const { openId, code } = request.body;
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
            openId, code
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const result = await userLoginBiz.userLoginByWechat({
            openId, code
        });
        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError())
    }
});

/**
 * #controller post /api/web/user-login/login-by-qq
 * #desc QQ登录
 * @param {*} request
 * @param {*} response
 */
router.post('/login-by-qq', async function(request, response) {
    try {
        const { openId, code } = request.body;
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
            openId, code
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const result = await userLoginBiz.userLoginByQQ({
            openId, code
        });
        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError())
    }
});

/**
 * #controller post /api/web/user-login/login-by-qy-wechat
 * #desc 企业微信登录
 * @param {*} request
 * @param {*} response
 */
router.post('/login-by-qy-wechat', async function(request, response) {
    try {
        const { openId, code } = request.body;
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
            openId, code
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const result = await userLoginBiz.userLoginByQyWechat({
            openId, code
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
        const { username, fps} = request.body;
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
            username, fps
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const result = await userLoginBiz.userLoginByFingerPrint({
            username, fps
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
 * #controller get /api/web/user-login/website-login-state
 * #desc 获取官网登录状态
 * @param {*} request
 * @param {*} response
 */
router.get('/website-login-state', async function(request, response) {
    try {
        const { [WEBSITE_LOGIN_TOKEN_KEY]: token  } = request.cookies;
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
 * #controller post /api/web/user-login/login-by-website
 * #desc 官网登录
 * @param {*} request
 * @param {*} response
 */
router.post('/login-by-website', async function(request, response) {
    try {
        const { name, email, password } = request.body;
        const { [WEBSITE_LOGIN_TOKEN_KEY]: token  } = request.cookies;

        if(token){
            const loginResult = await userLoginStateBiz.userIsLogin({
                token
            });
            if(loginResult.success){
                return response.json(loginResult)
            }
        }

        if (!checkRequestParams({
            name, email, password
        })) {
            response.json(tlResponseArgsError("请求参数非法"));
            return;
        }

        const result = await userLoginBiz.userLoginByWebsite({
            name, email, password
        });

        response.cookie(WEBSITE_LOGIN_TOKEN_KEY, result.data, { 
            maxAge: WEBSITE_LOGIN_TOKEN_EXPIRE, httpOnly: true 
        });

        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError())
    }
});

module.exports = router