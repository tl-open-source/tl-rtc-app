const { tlConsoleError, tlConsole, tlResponseSuccess, tlResponseSvrError, tlResponseForbidden } = require("../../utils/utils");
const pm2 = require("pm2");
const { inner: TlRoleInner } = require('../../tables/tl_role')

/**
 * 连接到PM2
 * @returns {Promise<void>} 连接Promise
 */
const connectToPm2 = () => {
    return new Promise((resolve, reject) => {
        pm2.connect((err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

/**
 * 停止PM2服务
 * @param {string|string[]} services - 服务名称(单个服务名或服务名数组)
 * @param {object} loginInfo - 登录信息
 * @returns {Promise<object>} 返回执行结果
 */
const adminStopPm2Service = async function ({ 
    services, loginInfo
}) {
    const {
        loginUserCompanyId, loginUserId, loginUserRoleId
    } = loginInfo

    if(loginUserRoleId !== TlRoleInner.user.admin.id){
        return tlResponseForbidden("非法用户")
    }

    if (!services) {
        return tlResponseSvrError(`Services not specified`);
    }

    // 将单个服务名转换为数组
    const serviceArray = Array.isArray(services) ? services : [services];
    
    if (serviceArray.length === 0) {
        return tlResponseSvrError(`Empty services array`);
    }

    try {
        await connectToPm2();
        
        const results = await Promise.all(serviceArray.map(service => {
            return new Promise((resolve, reject) => {
                pm2.stop(service, (err, proc) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(proc);
                    }
                });
            });
        }));

        // 提取关键信息并格式化返回结果
        let proc = results[0][0];
        let result = {
            name: proc.name,
            status: proc.pm2_env.status,
            pid: proc.pid,
        }
        
        tlConsole(`PM2 services stopped: ${serviceArray.join(', ')}`, result);
        pm2.disconnect();
        return tlResponseSuccess(`Services stopped: ${serviceArray.join(', ')}`, result);
    } catch (error) {
        tlConsoleError(`Failed to stop PM2 services: ${error?.message}`);
        pm2.disconnect();
        return tlResponseSvrError(`Failed to stop PM2 services: ${error?.message}`);
    }
};

/**
 * 启动PM2服务
 * @param {string|string[]} services - 服务名称(单个服务名或服务名数组)
 * @param {object} loginInfo - 登录信息
 * @returns {Promise<object>} 返回执行结果
 */
const adminStartPm2Service = async function ({ 
    services, loginInfo
}) {
    const {
        loginUserCompanyId, loginUserId, loginUserRoleId
    } = loginInfo

    if(loginUserRoleId !== TlRoleInner.user.admin.id){
        return tlResponseForbidden("非法用户")
    }

    if (!services) {
        return tlResponseSvrError(`Services not specified`);
    }

    // 将单个服务名转换为数组
    const serviceArray = Array.isArray(services) ? services : [services];
    
    if (serviceArray.length === 0) {
        return tlResponseSvrError(`Empty services array`);
    }

    try {
        await connectToPm2();
        
        const results = await Promise.all(serviceArray.map(service => {
            return new Promise((resolve, reject) => {
                pm2.start(service, (err, proc) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(proc);
                    }
                });
            });
        }));

        // 提取关键信息并格式化返回结果
        let proc = results[0][0];
        let result = {
            name: proc.name,
            status: proc.pm2_env.status,
            pid: proc.pid,
        }
        
        tlConsole(`PM2 services started: ${serviceArray.join(', ')}`, result);
        pm2.disconnect();
        return tlResponseSuccess(`Services started: ${serviceArray.join(', ')}`, result);
    } catch (error) {
        tlConsoleError(`Failed to start PM2 services: ${error?.message}`);
        pm2.disconnect();
        return tlResponseSvrError(`Failed to start PM2 services: ${error?.message}`);
    }
};

/**
 * 重启PM2服务
 * @param {string|string[]} services - 服务名称(单个服务名或服务名数组)
 * @param {object} loginInfo - 登录信息
 * @returns {Promise<object>} 返回执行结果
 */
const adminReadminStartPm2Service = async function ({ 
    services, loginInfo
}) {
    const {
        loginUserCompanyId, loginUserId, loginUserRoleId
    } = loginInfo

    if(loginUserRoleId !== TlRoleInner.user.admin.id){
        return tlResponseForbidden("非法用户")
    }
    
    if (!services) {
        return tlResponseSvrError(`Services not specified`);
    }

    // 将单个服务名转换为数组
    const serviceArray = Array.isArray(services) ? services : [services];
    
    if (serviceArray.length === 0) {
        return tlResponseSvrError(`Empty services array`);
    }

    try {
        await connectToPm2();
        
        const results = await Promise.all(serviceArray.map(service => {
            return new Promise((resolve, reject) => {
                pm2.restart(service, (err, proc) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(proc);
                    }
                });
            });
        }));

        // 提取关键信息并格式化返回结果
        let proc = results[0][0];
        let result = {
            name: proc.name,
            status: proc.pm2_env.status,
            pid: proc.pid,
        }
        
        tlConsole(`PM2 services restarted: ${serviceArray.join(', ')}`, result);
        pm2.disconnect();
        return tlResponseSuccess(`Services restarted: ${serviceArray.join(', ')}`, result);
    } catch (error) {
        tlConsoleError(`Failed to restart PM2 services: ${error?.message}`);
        pm2.disconnect();
        return tlResponseSvrError(`Failed to restart PM2 services: ${error?.message}`);
    }
};

/**
 * 获取PM2服务状态
 * @param {*} loginInfo 
 * @returns 
 */
const adminGetServiceStatus = async function ({ 
    loginInfo
}) {
    const {
        loginUserCompanyId, loginUserId, loginUserRoleId
    } = loginInfo

    if(loginUserRoleId !== TlRoleInner.user.admin.id){
        return tlResponseForbidden("非法用户")
    }

    try {
        await connectToPm2();
        
        const list = await new Promise((resolve, reject) => {
            pm2.list((err, procList) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(procList);
                }
            });
        });
        
        tlConsole(`PM2 service status retrieved`);
        
        pm2.disconnect();

        // 提取关键信息并格式化返回结果
        let resultList = list.map(proc => ({
            name: proc.name,
            status: proc.pm2_env.status,
            pid: proc.pid,
            monit: {
                memory: proc.monit.memory,
                cpu: proc.monit.cpu
            },
        }));

        // 只保留tl-rtc-app-api和tl-rtc-app-socket服务
        resultList = resultList.filter(
            proc => proc.name === 'tl-rtc-app-api' || 
            proc.name === 'tl-rtc-app-socket'
        );

        return tlResponseSuccess("PM2服务状态获取成功", {
            processList: resultList,
        });
    } catch (error) {
        tlConsoleError(`Failed to get PM2 service status: ${error?.message}`);
        pm2.disconnect();
        return tlResponseSvrError(`Failed to get PM2 service status: ${error?.message}`);
    }
};





module.exports = {
    adminStopPm2Service,
    adminStartPm2Service,
    adminReadminStartPm2Service,
    adminGetServiceStatus
}
