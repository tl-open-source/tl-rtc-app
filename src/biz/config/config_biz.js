const crypto = require("crypto")
const {
	checkBit, tlResponseSuccess, tlResponseForbidden
} = require("../../utils/utils");
const { get_env_config, set_env_config } = require("../../../conf/env_config");
const conf = get_env_config()

const companyService = require('../../service/company/tl_company_service')
const userSessionService = require('../../service/user/tl_user_session_service')
const { inner: TlRoleInner } = require('../../tables/tl_role')

const { fields: TlCompanyFields } = require('../../tables/tl_company')

const {
    Def: TlCompanyDef, Flag: TlCompanyFlag
} = TlCompanyFields


/**
 * 获取所有企业邀请码 - 最多返回10个
 * @returns
 */
const getAllCompanyInviteCode = async function () {
    const companyList = await companyService.getListForPage({}, [
        TlCompanyDef.id,
        TlCompanyDef.code,
        TlCompanyDef.name,
        TlCompanyDef.flag
    ], 1, 10)

    const resultList = []

    for(let i = 0; i < companyList.length; i++) {
        const item = companyList[i];
        // 处理每个企业的邀请码
        const flag = item[TlCompanyDef.flag] || 0
        const code = item[TlCompanyDef.code] || ''
        const name = item[TlCompanyDef.name] || ''

        // 过滤掉没有邀请码的企业
        if(code.length === 0) {
            continue
        }

        const authStatus = checkBit(flag, TlCompanyFlag.IS_PASS_AUTH)
        const expiredStatus = checkBit(flag, TlCompanyFlag.IS_EXPIRED)
        const openRegister = checkBit(flag, TlCompanyFlag.IS_OPEN_REGISTER)

        // 没有通过认证、已过期、未开放注册的企业，不算在内
        if(!authStatus && !expiredStatus && !openRegister) {
            continue
        }

        resultList.push({
            value: code,
            name: name
        })
    }

    return resultList
}


/**
 * 获取ip地址,初始化等相关配置
 * @param {*} openTurn 是否开启turn
 * @param {*} useSecret 使用的账号模式
 * @param {*} ip ip地址
 * @param {*} loginInfo 登录信息
 */
const initData = async function({openTurn, useSecret, ip, token}){
    const inviteCodeList = await getAllCompanyInviteCode()

    if(!token){
        return tlResponseSuccess("获取成功",{
            version : conf.version,
            wsHost: "ws://127.0.0.1",
            rtcConfig: { iceServers: [] },
            options: {},
            logo : genClientLogo(),
            codeList: inviteCodeList
        })
    }

    const {
        loginUserCompanyId, loginUserId, loginUsername
    } = await userSessionService.getUserInfoByToken({token})

    if (!loginUserCompanyId || !loginUserId) {
        return tlResponseSuccess("获取成功",{
            version : conf.version,
            wsHost: "ws://127.0.0.1",
            rtcConfig: { iceServers: [] },
            options: {},
            logo : genClientLogo(),
            codeList: inviteCodeList
        })
    }

	//ice服务器配置
	let iceServers = genTurnServerIceServersConfig(openTurn, useSecret, "tlrtcfile");

	if(process.env.tl_rtc_app_env_mode === 'http'){
		let wsHost = conf.socket_host || ip + conf.socket_port;
		return tlResponseSuccess("获取成功",{
            version : conf.version,
            wsHost: "ws://" + wsHost,
            rtcConfig: { iceServers },
            options: {
                "offerToReceiveAudio": 1,
                "offerToReceiveVideo": 1
            },
            logo : genClientLogo(),
            codeList: inviteCodeList
        })
	}

	let wsHost = conf.socket_host || ip;
	return tlResponseSuccess("获取成功",{
        version : conf.version,
        wsHost: "wss://" + wsHost,
        rtcConfig: { iceServers },
        options: {
            "offerToReceiveAudio": 1,
            "offerToReceiveVideo": 1
        },
        logo : genClientLogo(),
        codeList: inviteCodeList
    })
}



/**
 * 生成客户端控制台打印logo
 */
const genClientLogo = function(){
    let style = "font-size:20px;color: black; font-style: italic;";
    style += "font-weight: bold; font-family: system-ui;";
    style += "padding: 8px;cursor: pointer;"
    return style;
}


/**
 * 生成turn服务的iceServers配置
 * @param {*} withTurn 
 * @param {*} useSecret
 * @param {*} username 
 * @returns 
 */
const genTurnServerIceServersConfig = function(withTurn, useSecret, username){
    let iceServers = [{
        urls : conf.webrtc_stun_host
    }];

    //无需turn中继
    if(!withTurn){
        return iceServers;
    }

    //turn固定账号模式
    if(!useSecret){
        iceServers.push({
            urls : conf.webrtc_turn_host,
            username: conf.webrtc_turn_username,
            credential: conf.webrtc_turn_credential
        })
        return iceServers;
    }

    // 有效账号模式
    const secret = conf.webrtc_turn_secret;
    //生成账号的有效期
    const expirseTime = conf.webrtc_turn_expire;
    //当前时间
    const time = new Date().getTime();
    //turn服务的用户名规则
    const turnUsername = `${time + expirseTime}:${username}`;

    //turn服务的密码规则
    const dig = crypto.createHmac('sha1', secret).update(turnUsername).digest();
    const turnPassword = Buffer.from(dig, 'utf-8').toString('base64');

    iceServers.push({
        urls : conf.webrtc_turn_host,
        username: turnUsername,
        credential: turnPassword,
    })

    return iceServers;
}


/**
 * 获取系统环境配置
 * @param {*} loginInfo
 */
const adminGetSystemEnvConfig = async function({
    loginInfo
}) {
    const {
        loginUserCompanyId, loginUserId, loginUserRoleId
    } = loginInfo

    if(loginUserRoleId !== TlRoleInner.user.admin.id){
        return tlResponseForbidden("非法用户")
    }
    
    // redis配置
    const redisConfig = {
        host: conf.redis_host,
        port: conf.redis_port,
        password: conf.redis_password,
    }

    // webrtc配置
    const webrtcConfig = {
        stun_host: conf.webrtc_stun_host,
        turn_host: conf.webrtc_turn_host,
        turn_username: conf.webrtc_turn_username,
        turn_credential: conf.webrtc_turn_credential,
        turn_secret: conf.webrtc_turn_secret,
        turn_expire: conf.webrtc_turn_expire,
    }

    // mysql配置
    const mysqlConfig = {
        host: conf.db_mysql_host,
        port: conf.db_mysql_port,
        user: conf.db_mysql_user,
        password: conf.db_mysql_password,
        database: conf.db_mysql_database,
    }

    // email配置
    const emailConfig = {
        host: conf.mail_host,
        port: conf.mail_port,
        user: conf.mail_user,
        pass: conf.mail_password,
    }

    // 配置项定义 - 从前端移到后端
    const configDefinitions = {
        redis: {
            title: 'Redis配置',
            configKey: 'redisConfig',
            fields: [
                { key: 'host', label: '主机', desc: 'Redis服务器地址', type: 'text' },
                { key: 'port', label: '端口', desc: 'Redis服务器端口', type: 'text' },
                { key: 'password', label: '密码', desc: 'Redis服务器密码', type: 'text' }
            ]
        },
        webrtc: {
            title: 'WebRTC配置',
            configKey: 'webrtcConfig',
            fields: [
                { key: 'stun_host', label: 'STUN服务器', desc: 'STUN服务器地址', type: 'text' },
                { key: 'turn_host', label: 'TURN服务器', desc: 'TURN服务器地址', type: 'text' },
                { key: 'turn_username', label: 'TURN用户名', desc: 'TURN服务器用户名', type: 'text' },
                { key: 'turn_credential', label: 'TURN密码', desc: 'TURN服务器密码', type: 'text' },
                { key: 'turn_secret', label: 'TURN密钥', desc: 'TURN服务器密钥', type: 'text' },
                { key: 'turn_expire', label: '过期时间', desc: 'TURN过期时间（秒）', type: 'text' }
            ]
        },
        mysql: {
            title: 'MySQL配置',
            configKey: 'mysqlConfig',
            fields: [
                { key: 'host', label: '主机', desc: 'MySQL服务器地址', type: 'text' },
                { key: 'port', label: '端口', desc: 'MySQL服务器端口', type: 'text' },
                { key: 'user', label: '用户名', desc: 'MySQL用户名', type: 'text' },
                { key: 'password', label: '密码', desc: 'MySQL密码', type: 'text' },
                { key: 'database', label: '数据库', desc: 'MySQL数据库名称', type: 'text' }
            ]
        },
        email: {
            title: '邮件配置',
            configKey: 'emailConfig',
            fields: [
                { key: 'host', label: 'SMTP服务器', desc: '邮件SMTP服务器地址', type: 'text' },
                { key: 'port', label: 'SMTP端口', desc: '邮件SMTP服务器端口', type: 'text' },
                { key: 'user', label: '邮箱账号', desc: '发送邮件的邮箱账号', type: 'text' },
                { key: 'pass', label: '邮箱密码', desc: '邮箱授权密码', type: 'text' }
            ]
        }
    };

    return tlResponseSuccess("获取成功", {
        redisConfig,
        webrtcConfig,
        mysqlConfig,
        emailConfig,
        configDefinitions
    })
}


/**
 * 设置系统环境配置
 * @param {*} loginInfo
 * @param {*} redisConfig 
 * @param {*} webrtcConfig
 * @param {*} mysqlConfig
 * @param {*} emailConfig
 * @returns 
 */
const adminSetSystemEnvConfig = async function({
    loginInfo,
    redisConfig = {},
    webrtcConfig = {},
    mysqlConfig = {},
    emailConfig = {},
}) {
    const {
        loginUserCompanyId, loginUserId, loginUserRoleId
    } = loginInfo

    if(loginUserRoleId !== TlRoleInner.user.admin.id){
        return tlResponseForbidden("非法用户")
    }
    
    // 设置redis配置
    if(Object.keys(redisConfig).length > 0) {
        if(redisConfig.host !== undefined && redisConfig.host !== null) {
            set_env_config("redis_host", redisConfig.host)
        }
        if(redisConfig.port !== undefined && redisConfig.port !== null) {
            redisConfig.port = parseInt(redisConfig.port)
            set_env_config("redis_port", redisConfig.port)
        }
        if(redisConfig.password !== undefined && redisConfig.password !== null) {
            set_env_config("redis_password", redisConfig.password)
        }
    }

    // 设置webrtc配置
    if(Object.keys(webrtcConfig).length > 0) {
        if(webrtcConfig.stun_host !== undefined && webrtcConfig.stun_host !== null) {
            set_env_config("webrtc_stun_host", webrtcConfig.stun_host)
        }
        if(webrtcConfig.turn_host !== undefined && webrtcConfig.turn_host !== null) {
            set_env_config("webrtc_turn_host", webrtcConfig.turn_host)
        }
        if(webrtcConfig.turn_username !== undefined && webrtcConfig.turn_username !== null) {
            set_env_config("webrtc_turn_username", webrtcConfig.turn_username)
        }
        if(webrtcConfig.turn_credential !== undefined && webrtcConfig.turn_credential !== null) {
            set_env_config("webrtc_turn_credential", webrtcConfig.turn_credential)
        }
        if(webrtcConfig.turn_secret !== undefined && webrtcConfig.turn_secret !== null) {
            set_env_config("webrtc_turn_secret", webrtcConfig.turn_secret)
        }
        if(webrtcConfig.turn_expire !== undefined && webrtcConfig.turn_expire !== null) {
            webrtcConfig.turn_expire = parseInt(webrtcConfig.turn_expire)
            set_env_config("webrtc_turn_expire", webrtcConfig.turn_expire)
        }
    }

    // 设置mysql配置
    if(Object.keys(mysqlConfig).length > 0) {
        if(mysqlConfig.host !== undefined && mysqlConfig.host !== null) {
            set_env_config("db_mysql_host", mysqlConfig.host)
        }
        if(mysqlConfig.port !== undefined && mysqlConfig.port !== null) {
            set_env_config("db_mysql_port", mysqlConfig.port)
        }
        if(mysqlConfig.user !== undefined && mysqlConfig.user !== null) {
            set_env_config("db_mysql_user", mysqlConfig.user)
        }
        if(mysqlConfig.password !== undefined && mysqlConfig.password !== null) {
            set_env_config("db_mysql_password", mysqlConfig.password)
        }
        if(mysqlConfig.database !== undefined && mysqlConfig.database !== null) {
            set_env_config("db_mysql_database", mysqlConfig.database)
        }
    }

    // 设置email配置
    if(Object.keys(emailConfig).length > 0) {
        if(emailConfig.host !== undefined && emailConfig.host !== null) {
            set_env_config("mail_host", emailConfig.host)
        }
        if(emailConfig.port !== undefined && emailConfig.port !== null) {
            emailConfig.port = parseInt(emailConfig.port)
            set_env_config("mail_port", emailConfig.port)
        }
        if(emailConfig.user !== undefined && emailConfig.user !== null) {
            set_env_config("mail_user", emailConfig.user)
        }
        if(emailConfig.pass !== undefined && emailConfig.pass !== null) {
            set_env_config("mail_password", emailConfig.pass)
        }
    }
    return tlResponseSuccess("设置完成")
}





module.exports = {
    initData,

    adminGetSystemEnvConfig,
    adminSetSystemEnvConfig
}