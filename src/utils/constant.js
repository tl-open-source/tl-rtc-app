const LOGIN = {
    // 登录token
    LOGIN_TOKEN_KEY : '_tl_lg_tk',
    // 登录token过期时间
    LOGIN_TOKEN_EXPIRE : 1000 * 60 * 60,

    // 管理后台登录token
    SYSTEM_LOGIN_TOKEN_KEY : '_tl_sys_lg_tk',
    // 管理后台登录token过期时间
    SYSTEM_LOGIN_TOKEN_EXPIRE : 1000 * 60 * 60 * 24 * 3
}


module.exports = {
    LOGIN,
}