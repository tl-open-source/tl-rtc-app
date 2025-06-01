const path = require("path");
const dotEnv = require("dotenv");
const fs = require("fs");
const { exec } = require("child_process");

/**
 * 从.env文件中加载环境变量
 * docker环境下，使用docker-compose.yml中指定的env逻辑，不使用主动加载的.env文件中的环境变量
 * docker环境下，使用docker run 中指定的 -e 逻辑，不使用主动加载的.env文件中的环境变量
 * 非docker环境下，使用.env文件中的环境变量
 */
const load_env_config = function(){
    if(process.env.tl_rtc_app_node_load_env === 'false'){
        return
    }
    const pathsEnv = path.resolve(__dirname, "../")
    dotEnv.config({ path: `${pathsEnv}/tlrtcapp.env` })
    console.log(`load env config from .env file ${pathsEnv}/tlrtcapp.env`)
}

/**
 * 从环境变量中注入配置
 * 1. 适配容器环境
 * 2. 数据格式转换
 * 3. 统一管理
 */
const get_env_config = function () {
    let defaultConfJson = {}

    Object.keys(process.env).filter( key => key.startsWith("tl_rtc_app_") ).map(key => {
        let value = process.env[key]
        key = key.replace("tl_rtc_app_","")

        //端口相关的配置转换为数字
        if (key.endsWith('_port')) {
            value = parseInt(value)
        }

        //过期时间相关的配置转换为数字
        if(key.endsWith("_expire")){
            value = parseInt(value)
        }

        //开关相关的配置转换为boolean
        if (key.endsWith('_open')) {
            value = value === 'true'
        }

        defaultConfJson[key] = value
    })
    
    return defaultConfJson
}

/**
 * 设置环境变量
 * @param {*} key 配置项的键名（不含 tl_rtc_app_ 前缀）
 * @param {*} value 配置项的新值
 */
const set_env_config = function (key, value) {
    // 构建完整的环境变量名
    const fullKey = `tl_rtc_app_${key}`;
    
    // 获取 .env 文件路径
    const envFilePath = path.resolve(__dirname, "../tlrtcapp.env");
    
    try {
        // 读取 .env 文件内容
        let envContent = fs.readFileSync(envFilePath, 'utf8');
        
        // 准备正则表达式，匹配键值对
        const regex = new RegExp(`^${fullKey}=.*$`, 'm');
        
        // 检查键是否存在
        if (regex.test(envContent)) {
            // 如果键存在，则替换其值
            envContent = envContent.replace(regex, `${fullKey}=${value}`);
        } else {
            // 如果键不存在，则在文件末尾添加
            console.error(`Config not found: ${fullKey}`);
            return {
                success: false,
                message: `Config not found: ${fullKey}`
            }
        }
        
        // 写入更新后的内容
        fs.writeFileSync(envFilePath, envContent, 'utf8');
        
        // 更新当前进程中的环境变量
        process.env[fullKey] = value;

        console.log(`Config updated: ${fullKey}=${value}`);

        return {
            success: true,
            message: `Config updated: ${fullKey}=${value}`
        }
    } catch (error) {
        console.error(`Failed to update config ${fullKey}:`, error)
        return {
            success: false,
            message: `Failed to update config ${fullKey}: ${error}`
        }
    }
}


module.exports = {
    get_env_config,
    load_env_config,
    set_env_config,
}
