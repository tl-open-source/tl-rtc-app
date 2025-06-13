// Autor: iamtsm
// web包含的controller定义
// Date: 2024-01-13

// 系统
const systemWebConfig = require('./system/system_web_config_controller')
const systemWebCompany = require('./system/system_web_company_controller')
const systemWebUser = require('./system/system_web_user_controller')
const systemWebChannel = require('./system/system_web_channel_controller')
const systemWebService = require('./system/system_web_service_controller')

// 配置
const configInit = require('./config/init_controller')
const configSkin = require('./config/skin_controller')

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
const userClear = require('./user/user_clear_controller')

// 频道
const channel = require('./channel/channel_controller')
const channelChat = require('./channel/channel_chat_controller')
const channelNotice = require('./channel/channel_notice_controller')
const channelUser = require('./channel/channel_user_controller')
const channelFile = require('./channel/channel_file_controller')
const channelMedia = require('./channel/channel_media_controller')

// 文件
const cloudFile = require('./cloud/cloud_file_controller')

// 剪贴板
const cutPaste = require('./cut_paste/cut_paste_controller')
const cutPasteShare = require('./cut_paste/cut_paste_share_controller')


module.exports = {
    "system-web-config" : systemWebConfig,
    "system-web-company" : systemWebCompany,
    "system-web-user" : systemWebUser,
    "system-web-channel" : systemWebChannel,
    "system-web-service" : systemWebService,
    
    "config" : configInit,
    "config-skin" : configSkin,

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
    "user-clear" : userClear,
    "channel" : channel,
    "channel-chat" : channelChat,
    "channel-user" : channelUser,
    "channel-notice" : channelNotice,
    "channel-file" : channelFile,
    "channel-media" : channelMedia,

    "cut-paste" : cutPaste,
    "cut-paste-share" : cutPasteShare,

    "cloud-file" : cloudFile,
}
