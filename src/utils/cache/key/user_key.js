
const PREFIX = 'TL:USER:';

const KEYS = {
    // 用户登陆态信息
    USER_LOGIN_INFO: PREFIX + 'USER_LOGIN_INFO:',

    // 用户在线状态
    USER_LOGIN_STATUS: PREFIX + 'USER_LOGIN_STATUS:',

    // 用户信息
    USER_INFO: PREFIX + 'USER_INFO:',

    // 用户的所有频道列表
    USER_CHANNEL_LIST: PREFIX + 'USER_CHANNEL_LIST:',

    // 用户频道权限
    USER_CHANNEL_PERMISSION: PREFIX + 'USER_CHANNEL_PERMISSION:',

    // userId和socketId的映射
    USER_ID_SOCKET_ID_MAP: PREFIX + 'USER_ID_SOCKET_ID_MAP:',

    // 用户邮箱验证码
    USER_EMAIL_CODE: PREFIX + 'USER_EMAIL_CODE:',

    // 用户手机验证码
    USER_PHONE_CODE: PREFIX + 'USER_PHONE_CODE:',
}

module.exports = {
    USER_KEYS : KEYS
}