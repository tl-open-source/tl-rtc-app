const {
	tlResponseSvrError, tlConsoleError
} = require("../../../utils/utils");
const express = require('express');
const router = express.Router();
const userLogoutBiz = require('../../../biz/user/user_logout_biz');
const {
    LOGIN : {
        LOGIN_TOKEN_KEY,
        
        SYSTEM_LOGIN_TOKEN_KEY
    }
} = require('../../../utils/constant');




/**
 * #controller get /api/web/user-logout/logout
 * #desc 退出登录
 * @param {*} request
 * @param {*} response
 */
router.get('/logout', async function(request, response) {
    try {
        const { [LOGIN_TOKEN_KEY]: token } = request.cookies;
        const result = await userLogoutBiz.userLogout({
            token
        });

        response.clearCookie(LOGIN_TOKEN_KEY);

        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError())
    }
});


/**
 * #controller get /api/web/user-logout/system-logout
 * #desc 退出登录
 * @param {*} request
 * @param {*} response
 */
router.get('/system-logout', async function(request, response) {
    try {
        const { [SYSTEM_LOGIN_TOKEN_KEY]: token } = request.cookies;
        const result = await userLogoutBiz.userLogout({
            token
        });

        response.clearCookie(SYSTEM_LOGIN_TOKEN_KEY);

        response.json(result);
    } catch (error) {
        tlConsoleError(error)
        response.json(tlResponseSvrError())
    }
});



module.exports = router