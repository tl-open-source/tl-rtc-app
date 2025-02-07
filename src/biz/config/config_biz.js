
const {
	tlResponseArgsError, tlResponseForbidden, tlResponseSvrError,
	tlResponseTimeout, tlResponseNotFound, tlResponseSuccess
} = require("../../utils/utils");
const {get_env_config} = require("../../../conf/env_config");
const conf = get_env_config()
const crypto = require("crypto")
const userSessionService = require('../../service/user/tl_user_session_service')


/**
 * 获取ip地址,初始化等相关配置
 * @param {*} openTurn 是否开启turn
 * @param {*} useSecret 使用的账号模式
 * @param {*} ip ip地址
 * @param {*} loginInfo 登录信息
 */
const initData = async function({openTurn, useSecret, ip, token}){
    if(!token){
        return tlResponseSuccess("获取成功",{
            version : conf.version,
            wsHost: "ws://127.0.0.1",
            rtcConfig: { iceServers: [] },
            options: {},
            logo : genClientLogo(),
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

module.exports = {
    initData
}