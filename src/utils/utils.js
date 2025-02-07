const os = require('os');
const { get_env_config } = require('./../../conf/env_config');
const conf = get_env_config()
const crypto = require('crypto');

/**
 * 获取本机ip
 * @returns 
 */
function getLocalIP() {
    const osType = os.type(); //系统类型
    const netInfo = os.networkInterfaces(); //网络信息
    let ip = '';
    if (osType === 'Windows_NT') {
        for (let dev in netInfo) {
            //win7的网络信息中显示为本地连接，win10显示为以太网
            if (dev === '本地连接' || dev === '以太网') {
                for (let j = 0; j < netInfo[dev].length; j++) {
                    if (netInfo[dev][j].family === 'IPv4') {
                        ip = netInfo[dev][j].address;
                        break;
                    }
                }
            }
        }

    } else if (osType === 'Linux') {
        for (let dev in netInfo) {
            let iface = netInfo[dev];
            for (let i = 0; i < iface.length; i++) {
                let alias = iface[i];
                if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                    return alias.address;
                }
            }
        }
    }

    return ip;
}

/**
 *  检查两个IP地址是否在同一个子网内
 * @param {*} ip1 
 * @param {*} ip2 
 * @param {*} subnetMask 
 * @returns 
 */
function isSameSubnet(ip1, ip2, subnetMask) {
    // 将IPv4或IPv6地址和子网掩码转换为数字形式
    function ipToNumber(ip) {
        if (ip.indexOf(':') > -1) { // IPv6
            const parts = ip.split(':');
            return parts.map(part => parseInt(part, 16)).join('');
        } else { // IPv4
            const parts = ip.split('.');
            return (parseInt(parts[0]) << 24) |
                (parseInt(parts[1]) << 16) |
                (parseInt(parts[2]) << 8) |
                parseInt(parts[3]);
        }
    }

    // 检查第一个IP和第二个IP是否在同一个子网内
    const ip1Number = ipToNumber(ip1);
    const ip2Number = ipToNumber(ip2);
    const subnetMaskNumber = ipToNumber(subnetMask);

    return (ip1Number & subnetMaskNumber) === (ip2Number & subnetMaskNumber);
}

/**
 * 获取请求的ip
 * @param {*} request 
 * @returns 
 */
function getClientIP(request) {
    let ip = request.headers['x-forwarded-for'] ||
        request.ip ||
        request.connection.remoteAddress ||
        request.socket.remoteAddress ||
        request.connection.socket.remoteAddress;

    if (ip.split(',').length > 0) {
        ip = ip.split(',')[0]
    }

    ip = ip.substr(ip.lastIndexOf(':') + 1, ip.length);
    return ip;
}

/**
 * 生成随机数
 * @param {*} req 
 * @returns 
 */
function genFlow(req) {
    return num = Math.floor(Math.random(100000000) * 100000000 + 1);
}

/**
 * 生成随机数
 * @param {*} req 
 * @returns 
 */
function genRoom(req) {
    return num = Math.floor(Math.random(100000000) * 100000000 + 1);
}

/**
 * 格式化时间
 * @param {*} time 
 * @param {*} format 
 * @returns 
 */
function formateDateTime(time, format) {
    let o = {
        'M+': time.getMonth() + 1, // 月份
        'd+': time.getDate(), // 日
        'h+': time.getHours(), // 小时
        'm+': time.getMinutes(), // 分
        's+': time.getSeconds(), // 秒
        'q+': Math.floor((time.getMonth() + 3) / 3), // 季度
        S: time.getMilliseconds(), // 毫秒
    };
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (time.getFullYear() + '').substring(4 - RegExp.$1.length));
    }
    for (let k in o) {
        if (new RegExp('(' + k + ')').test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substring(('' + o[k]).length));
        }
    }
    return format;
}

/**
 * 获取当前时间下一天
 * @param {*} time 
 * @returns 
 */
function getNextDay(time) {
    let date = new Date(time);
    date.setDate(date.getDate() + 1);
    let y = date.getFullYear();
    let m = date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    let d = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    return y + "-" + m + "-" + d;
}

/**
 * 获取socket中的请求客户端信息
 * @param {*} socket 
 * @returns 
 */
function getSocketClientInfo(socket){
    let handshake = socket.handshake
    
    let userAgent = handshake.headers['user-agent'].toString().substr(0, 255);

    let ip = handshake.headers['x-real-ip'] || handshake.headers['x-forwarded-for'] || handshake.headers['host'];
    ip = ip.indexOf(":") > -1 ? ip.split(":")[0] : ip;

    let address = socket.handshake.address;
    address = address.length > 7 ? address.substr(7, address.length) : address;

    return {
        handshake, userAgent, ip, address
    }
}

/**
 * 转换文件大小
 * @param {*} size 
 * @returns 
 */
function getFileSizeStr(size) {
    let sizeStr = (size / 1048576).toString();
    let head = sizeStr.split(".")[0];
    let tail = "";
    if (sizeStr.split(".")[1]) {
        tail = sizeStr.split(".")[1].substring(0, 3);
    }
    return head + '.' + tail + "M";
}

function tlConsole(...msg){
    let msgArgs = new Array(msg.length).fill("%s").join(" | ")
    console.log(`\x1B[1m${new Date().toLocaleString()}\x1B[0m \x1B[40m\x1B[36m tl-rtc-app-${conf.version} \x1B[0m : \x1B[36m${msgArgs}\x1B[0m`,...msg)
}

function tlConsoleError(...msg){
    let msgArgs = new Array(msg.length).fill("%s").join(" | ")
    console.log(`\x1B[1m${new Date().toLocaleString()}\x1B[0m \x1B[40m\x1B[31m tl-rtc-app-${conf.version} \x1B[0m : \x1B[31m${msgArgs}\x1B[0m`,...msg)
}

function tlConsoleWarn(...msg){
    let msgArgs = new Array(msg.length).fill("%s").join(" | ")
    console.log(`\x1B[1m${new Date().toLocaleString()}\x1B[0m \x1B[40m\x1B[33m tl-rtc-app-${conf.version} \x1B[0m : \x1B[33m${msgArgs}\x1B[0m`,...msg)
}

function tlConsoleSocketIcon(){
    const icon = `
${".".repeat(process.stdout.columns - 2)}
${".".repeat(process.stdout.columns - 2)}
${".".repeat(process.stdout.columns - 2)}
 .     .                .
_/_    |         .___  _/_     ___          ___  ,___,, ,___,,
 |     |   .---' /   |  |    .'   ' .---'  /   | |    | |    |
 |     |         |   '  |    |            |    | |    | |    |
 |__/  |__       |      |__  [.._.'       '.__/| |'---' |'---'
                                                 |      |
tl-rtc-app-socket-${conf.version}
Copyright (c) 2024 iamtsm
MIT License
${".".repeat(process.stdout.columns - 2)}
${".".repeat(process.stdout.columns - 2)}
${".".repeat(process.stdout.columns - 2)}
`;
    console.log(icon);
}

function tlConsoleApiIcon(){
    const icon = `
${".".repeat(process.stdout.columns - 2)}
${".".repeat(process.stdout.columns - 2)}
${".".repeat(process.stdout.columns - 2)}
 .     .                .
_/_    |         .___  _/_     ___          ___  ,___,, ,___,,
 |     |   .---' /   |  |    .'   ' .---'  /   | |    | |    |
 |     |         |   '  |    |            |    | |    | |    |
 |__/  |__       |      |__  [.._.'       '.__/| |'---' |'---'
                                                 |      |
tl-rtc-app-socket-${conf.version} ${process.stdout.columns}
Copyright (c) 2024 iamtsm
MIT License
${".".repeat(process.stdout.columns - 2)}
${".".repeat(process.stdout.columns - 2)}
${".".repeat(process.stdout.columns - 2)}
`;
    console.log(icon);
}

function tlConsoleTaskIcon(){
    const icon = `
${".".repeat(process.stdout.columns - 2)}
${".".repeat(process.stdout.columns - 2)}
${".".repeat(process.stdout.columns - 2)}
 .     .                .
_/_    |         .___  _/_     ___          ___  ,___,, ,___,,
 |     |   .---' /   |  |    .'   ' .---'  /   | |    | |    |
 |     |         |   '  |    |            |    | |    | |    |
 |__/  |__       |      |__  [.._.'       '.__/| |'---' |'---'
                                                 |      |
tl-rtc-app-task-${conf.version} ${process.stdout.columns}
Copyright (c) 2024 iamtsm
MIT License
${".".repeat(process.stdout.columns - 2)}
${".".repeat(process.stdout.columns - 2)}
${".".repeat(process.stdout.columns - 2)}
`;
    console.log(icon);
}

/**
 * 转义字符串
 * @param {*} str 
 * @returns 
 */
function escapeStr(str) {
    const entityMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;'
    };

    const encodedMap = {
        '%': '%25',
        '!': '%21',
        "'": '%27',
        '(': '%28',
        ')': '%29',
        '*': '%2A',
        '-': '%2D',
        '.': '%2E',
        '_': '%5F',
        '~': '%7E'
    };

    return String(str).replace(/[&<>"'`=\/%!'()*\-._~]/g, function (s) {
        return entityMap[s] || encodedMap[s] || '';
    });
}

/**
 * 解析转义字符串
 * @param {*} str 
 * @returns 
 */
function unescapeStr(str) {
    const entityMap = {
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#39;': "'",
        '&#x2F;': '/',
        '&#x60;': '`',
        '&#x3D;': '='
    };

    const encodedMap = {
        '%25': '%',
        '%21': '!',
        '%27': "'",
        '%28': '(',
        '%29': ')',
        '%2A': '*',
        '%2D': '-',
        '%2E': '.',
        '%5F': '_',
        '%7E': '~'
    };

    return String(str).replace(/&(amp|lt|gt|quot|#39|#x2F|#x60|#x3D);|%(25|21|27|28|29|2A|2D|2E|5F|7E)/g, function (s) {
        return entityMap[s] || encodedMap[s] || '';
    });
}

/**
 *  根据socketid加密websocket数据
 * @param {*} socketId 
 * @param {*} data 
 * @returns 
 */
function encryptSocketData(socketId, data){
    const key = "tl-rtc-app";
    const iv = socketId.substring(0, 16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

/**
 * 根据socketid解密websocket数据
 * @param {*} socketId 
 * @param {*} data 
 * @returns 
 */
function decryptSocketData(socketId, data){
    const key = "tl-rtc-app";
    const iv = socketId.substring(0, 16);
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(data, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

/**
 *  根据flag和bit获取对应的值
 * @param {*} flag 
 * @param {*} bit 
 */
function checkBit(flag, bit){
    return (flag & bit) === bit;
}

/**
 * 根据flag和bit设置对应的值
 * @param {*} flag 
 * @param {*} bit 
 * @param {*} value
 */
function setBit(flag, bit, value){
    if(value){
        return flag | bit;
    }
    return flag & (~bit);
}

const tlResponse = function(success=true, code = 200, msg = '', data = {}){
    return { success, code, msg, data }
}

const tlResponseSuccess = function(msg = '', data = {}){
    return tlResponse(true, 200, msg, data)
}

const tlResponseArgsError = function(msg = '', data = {}){
    return tlResponse(false, 400, msg, data)
}

const tlResponseSvrError = function(msg = '', data = {}){
    return tlResponse(false, 500, msg, data)
}

const tlResponseNotFound = function(msg = '', data = {}){
    return tlResponse(false, 404, msg, data)
}

const tlResponseForbidden = function(msg = '', data = {}){
    return tlResponse(false, 403, msg, data)
}

const tlResponseTimeout = function(msg = '', data = {}){
    return tlResponse(false, 504, msg, data)
}

/**
 * 检查入库参数
 * @param {*} rawAttributes 
 * @param {*} data
 * @returns 
 */
const checkRawFieldType = function(rawAttributes, data){
    for (let key in data) {
        const value = data[key]
        const {result, msg} = checkField(rawAttributes, key, value)
        if(!result){
            tlConsoleError("参数校验失败", msg)
            return false
        }
    }
    return true
}

/**
 * 检查字段
 * @param {*} rawAttributes 
 * @param {*} key 
 * @param {*} value
 * @returns 
 */
const checkField = function(rawAttributes, key, value){
    const fieldDef = rawAttributes[key]
    if(!fieldDef){
        return {result: false, msg: `字段${key}非法`}
    }

    if(fieldDef.type.key === 'STRING'){
        if(typeof value !== 'string'){
            return {result: false, msg: `字段${key}类型错误 - except: STRING, result: ${value}`}
        }
        if(value.length > fieldDef.type._length){
            return {result: false, msg: `字段${key}长度超出`}
        }
    }
    if(fieldDef.type.key === 'INTEGER'){
        if(typeof value !== 'number'){
            return {result: false, msg: `字段${key}类型错误 - except: INTEGER, result: ${value}`}
        }
    }
    if(fieldDef.type.key === 'BOOLEAN'){
        if(typeof value !== 'boolean'){
            return {result: false, msg: `字段${key}类型错误 - except: BOOLEAN, result: ${value}`}
        }
    }
    if(fieldDef.type.key === 'DATE'){
        if(!(value instanceof Date)){
            return {result: false, msg: `字段${key}类型错误 - except: DATE, result: ${value}`}
        }
    }
    if(fieldDef.type.key === 'JSON'){
        if(typeof value !== 'object'){
            return {result: false, msg: `字段${key}类型错误 - Jexcept: JSON, result: ${value}`}
        }
    }
    return {result: true, msg: '通过'}
}


/**
 * 检测是否是合法的手机号/电话号码
 * @param {*} mobile
 * @returns 
 */
const checkIsMobile = function(mobile){
    return /^1[3456789]\d{9}$/.test(mobile)
}

/**
 * 检测是否是合法的邮箱
 * @param {*} email
 * @returns 
 */
const checkIsEmail = function(email){
    return /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(email)
}

/**
 * 检查请求参数内容是否包含攻击或非法字符
 * @param {*} params
 * @returns
 */
const checkRequestParams = function(params){
    const reg = /<|>|&|;|'|"/g;
    for (const key in params) {
        if(reg.test(key)){
            return false;
        }
        const value = params[key];
        if(value && value instanceof Object){
            return checkRequestParams(value);
        }
        if (reg.test(params[key])) {
            return false;
        }
    }
    return true;
}

/**
 * 加密函数
 * @param {*} password 
 * @param {*} salt 
 * @returns 
 */
const encryptStr = function({
    str, salt
}) {
  const iterations = 10000;
  const keyLength = 32;
  const digest = 'sha512';
  // 使用PBKDF2算法生成加密后的密码
  return crypto.pbkdf2Sync(str, salt, iterations, keyLength, digest).toString('hex');;
}

/**
 * 验证函数
 * @param {*} inputStr 
 * @param {*} hashedStr 
 * @param {*} salt 
 * @returns 
 */
const verifyEncryptStr = function({
    inputStr, hashedStr, salt
}) {
  return encryptStr({
    str: inputStr,
    salt
  }) === hashedStr;
}


const generateSaltPassword = function({
    password
}) {
    const salt = crypto.randomBytes(16).toString('hex');
    const saltPassword = encryptStr({
        str: password,
        salt
    });
    return {
        salt,
        saltPassword
    }
}

module.exports = {
    getLocalIP,
    getClientIP,
    genFlow,
    genRoom,
    formateDateTime,
    getNextDay,
    getSocketClientInfo,
    getFileSizeStr,
    tlConsole,
    tlConsoleError,
    tlConsoleWarn,
    tlConsoleApiIcon,
    tlConsoleSocketIcon,
    unescapeStr,
    escapeStr,
    isSameSubnet,
    checkBit,
    setBit,
    tlResponseSuccess,
    tlResponseArgsError,
    tlResponseSvrError,
    tlResponseNotFound,
    tlResponseForbidden,
    tlResponseTimeout,
    checkRawFieldType,
    checkIsMobile,
    checkIsEmail,
    checkRequestParams,
    encryptStr,
    verifyEncryptStr,
    tlConsoleTaskIcon
}