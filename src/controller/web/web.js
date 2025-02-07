// Autor: iamtsm
// web包含的controller定义
// Date: 2024-01-13

// 配置
const configInit = require('./config/init_controller')

// 企业
const company = require('./company/company_controller')

// 用户
const userLogin = require('./user/user_login_controller')
const userRegister = require('./user/user_register_controller')
const userLogout = require('./user/user_logout_controller')
const userFriend = require('./user/user_friend_controller')
const user = require('./user/user_controller')
const userApply = require('./user/user_apply_controller')
const userRead = require('./user/user_read_controller')
const userConfig = require('./user/user_config_controller')
const userTag = require('./user/user_tag_controller')

// 频道
const channel = require('./channel/channel_controller')
const channelChat = require('./channel/channel_chat_controller')
const channelUser = require('./channel/channel_user_controller')


module.exports = {
    "config" : configInit,
    "company" : company,
    
    "user" : user,
    "user-login" : userLogin,
    "user-logout" : userLogout,
    "user-register" : userRegister,
    "user-friend" : userFriend,
    "user-apply" : userApply,
    "user-read" : userRead,
    "user-config" : userConfig,
    "user-tag" : userTag,
    "channel" : channel,
    "channel-chat" : channelChat,
    "channel-user" : channelUser,
}
