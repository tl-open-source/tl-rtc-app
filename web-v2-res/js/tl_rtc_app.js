// 是否启用中继
let useTurn = (window.localStorage.getItem("tl-rtc-app-use-turn") || "false") === 'true';

let load_tl_rtc_app_js = async function(){
    let { data : configInitRes } = await axios.get("/api/web/config/init", {
        params: {
            turn: useTurn
        }
    })
    if(!configInitRes.success){
        layer.msg("系统错误")
        return
    }

    let {
        wsHost, logo, version, rtcConfig, options,
    } = configInitRes.data

    let {
        tl_rtc_app_comm,
        tl_rtc_app_lang
    } = window

    let { data : loginStateRes } = await axios.get("/api/web/user-login/login-state");
    let isLogin = loginStateRes.success
    let username = loginStateRes.data.loginUsername
    let userId = loginStateRes.data.loginUserId
    let userAvatar = loginStateRes.data.loginUserAvatar
    let userCompanyId = loginStateRes.data.loginUserCompanyId
    let userEmail = loginStateRes.data.loginUserEmail
    let userMobile = loginStateRes.data.loginUserMobile
    let userRoleId = loginStateRes.data.loginUserRoleId
    let loginTime = loginStateRes.data.loginTime
    let companyName = loginStateRes.data.loginUserCompanyName
    let token = loginStateRes.data.token
    let normalSetting = ''
    let accountSetting = ''
    let messageSetting = ''
    let authoritySetting = ''
    let skinSetting = ''
    let otherSetting = ''
    let components = {}

    if(isLogin){
        window.localStorage.setItem('token', token)

        let { data : userConfigRes } = await axios.get('/api/web/user-config/get-user-config')
        accountSetting = userConfigRes.data.account
        messageSetting = userConfigRes.data.message
        otherSetting = userConfigRes.data.other
        // 是否使用自定义wss地址
        customWss = otherSetting.customWss || ""
        if(customWss && window.tl_rtc_app_comm.isWssHost(customWss)){
            wsHost = customWss;
        }
        // 浏览器通知
        webNotify = messageSetting.webNotify
        // 消息红点数量提示
        messageDot = messageSetting.messageDot
        
        components = {
            // 侧边/底部
            'tl_rtc_app_module_sidebar': window.tl_rtc_app_module_sidebar,
            // 登录
            'tl_rtc_app_module_login': window.tl_rtc_app_module_login,
            'tl_rtc_app_module_login_content': window.tl_rtc_app_module_login_content,
            // 空白
            'tl_rtc_app_module_blank_content': window.tl_rtc_app_module_blank_content,
            // 联系人
            'tl_rtc_app_module_contact': window.tl_rtc_app_module_contact,
            'tl_rtc_app_module_contact_content': window.tl_rtc_app_module_contact_content,
            // 频道
            'tl_rtc_app_module_channel': window.tl_rtc_app_module_channel,
            'tl_rtc_app_module_channel_content': window.tl_rtc_app_module_channel_content,
            // 设置
            'tl_rtc_app_module_setting': window.tl_rtc_app_module_setting,
            'tl_rtc_app_module_setting_content': window.tl_rtc_app_module_setting_content,
        }
    }else{
        components = {
            // 侧边/底部
            'tl_rtc_app_module_sidebar': window.tl_rtc_app_module_sidebar,
            // 登录
            'tl_rtc_app_module_login': window.tl_rtc_app_module_login,
            'tl_rtc_app_module_login_content': window.tl_rtc_app_module_login_content,
            // 空白
            'tl_rtc_app_module_blank_content': window.tl_rtc_app_module_blank_content,
        }
    }


    // 注册全局方法
    Vue.prototype.emitSubModuleEvent = async function ({
        event = "",
        data = {},
    }){
        return new Promise((resolve, reject) => {
            window.subModule.$emit(event, Object.assign(data, {
                callback: function(res){
                    resolve(res)
                }
            }))
        })
    }

    Vue.prototype.popSuccessMsg = async function (
        msg
    ){
        return await this.emitSubModuleEvent({
            event: 'component-popup-add-toast-msg',
            data: {
                type: 'success',
                message: msg
            }
        })
    }

    Vue.prototype.popWarningMsg = async function (
        msg
    ){
        return await this.emitSubModuleEvent({
            event: 'component-popup-add-toast-msg',
            data: {
                type: 'warning',
                message: msg
            }
        })
    }

    Vue.prototype.popErrorMsg = async function (
        msg
    ){
        return await this.emitSubModuleEvent({
            event: 'component-popup-add-toast-msg',
            data: {
                type: 'error',
                message: msg
            }
        })
    }

    Vue.prototype.tlRequest = async function ({
        url, method, params, data, headers, 
        useCache, cacheTime, delCaches, responseType
    }){
        return await this.emitSubModuleEvent({
            event: 'component-api-request',
            data: {
                url, method, params, data, headers, 
                useCache, cacheTime, delCaches, responseType
            }
        })
    }

    window.tl_rtc_app = new Vue({
        el: '#tl-rtc-app',
        data: function(){
            let socket = null;

            if (io && isLogin) {
                socket = io(wsHost,{
                    transports : [ 'websocket'],
                    query: { token : token || "" }
                });
                

                // 初始化rtc
                this.emitSubModuleEvent({
                    event: "component-socket-init-socket",
                    data: {
                        socket
                    }
                })
            }

            let langMode = 'zh'
            let langArgs = tl_rtc_app_comm.getRequestHashArgs("lang")
            if (langArgs && ['zh','en'].includes(langArgs)) {
                langMode = langArgs;
            }

            return {
                langMode : langMode, // 默认中文
                lang : tl_rtc_app_lang, // 语言包
                logo : logo, // 打印logo
                version : version,// 项目当前版本
                socket: socket, // socket
                wsHost : wsHost, // ws地址
                isLogin : isLogin, // 是否登录
                user: {
                    userId : userId, // 用户id
                    username: username, // 用户名称
                    userAvatar: userAvatar, // 用户头像
                    userCompanyId: userCompanyId, // 用户公司id
                    userEmail: userEmail, // 用户邮箱
                    userMobile: userMobile, // 用户手机号
                    userRoleId: userRoleId, // 用户角色id
                    loginTime: loginTime, // 登录时间

                    accountSetting: accountSetting, // 用户账号设置
                    messageSetting: messageSetting, // 用户消息设置
                    otherSetting: otherSetting, // 用户其他设置
                    token: token, // 用户token
                },
                company: {
                    name : companyName || 'TL-RTC-APP' // 组织名称
                },
                leftModule : isLogin ? 'channel' : 'login', // 左侧默认模块
                rightModule : isLogin ? 'blank' : 'blank', // 右侧默认模块,
                showRightModule: false, // 是否显示右侧模块
                isMobile: tl_rtc_app_comm.isMobile(),  // 是否移动端
                isStandaloneMode: false, // 是否是独立窗口模式
            }
        },
        methods: {
            /**
             * 左侧模块切换
             * @param {*} module 
             * @returns 
             */
            leftModuleChange: function(module){
                if(module === 'login' && this.isLogin){
                    return
                }
                if(!this.isLogin){
                    this.leftModule = 'login';
                    return
                }

                this.leftModule = module;
                this.rightModule = 'blank';
                
                console.log("leftModuleChange", module)
            },
            /**
             * 右侧模块切换
             * @param {*} module 
             */
            rightModuleChange: function(module){
                this.rightModule = module;

                console.log("rightModuleChange", module)
            },
            /**
             * 控制展示左右模块是否可见 - 移动端
             * @param {*} showRightModule
             * @param {*} callback
             */
            moduleShowChange: function({
                showRightModule, callback
            }){
                if(!this.isMobile){
                    callback && callback(false)
                    return 
                }

                if(showRightModule !== undefined){
                    this.showRightModule = showRightModule
                }

                console.log("moduleShowChange", showRightModule)

                callback && callback(true)
            },
            /**
             * 加载js调试器
             */
            loadVConsoleJs: function () {
                if (window.location.hash && window.location.hash.includes("debug")) {
                    window.tl_rtc_app_comm.loadJS('/static/js/vconsole.min.js', function () {
                        window.tl_rtc_app_comm.loadJS('/static/js/vconsole.js', function () {
                            console.log('load vconsole success')
                        });
                    });
                }
            },
            /**
             * 当前是否登录
             * @param {*} callback
             */
            getIsLogin: function({
                callback
            }){
                return callback && callback(this.isLogin)
            },
            /**
             * 获取模块
             * @param {*} callback
             */
            getModule: function({
                callback
            }){
                return callback && callback({
                    leftModule: this.leftModule,
                    rightModule: this.rightModule
                })
            },
            /**
             * 用户设置变更
             * @param {*} accountSetting
             * @param {*} messageSetting
             * @param {*} otherSetting
             * @returns
             */
            userSettingChange: function({
                accountSetting, messageSetting, otherSetting
            }){
                if(accountSetting){
                    this.user.accountSetting = accountSetting
                }
                if(messageSetting){
                    this.user.messageSetting = messageSetting
                }
                if(otherSetting){
                    this.user.otherSetting = otherSetting
                }
            }
        },
        mounted() {
            let that = this;
        
            window.addEventListener('resize', function(){
                that.isMobile = tl_rtc_app_comm.isMobile()
            }, true)

            this.loadVConsoleJs()

            if(this.isLogin){
                this.emitSubModuleEvent({
                    event: "sub-module-login-set-cache-account",
                    data: {
                        userId: this.user.userId,
                        username: this.user.username,
                        avatarUrl: this.user.userAvatar,
                        token: this.user.token,
                        time: new Date().getTime()
                    }
                })
            }

            // 从URL参数判断是否是独立窗口模式
            const params = new URLSearchParams(location.hash.slice(1));
            this.isStandaloneMode = params.get('mode') === 'standalone';

            if(this.isStandaloneMode){
                this.leftModule = params.get('lm') || 'blank';
                this.rightModule = params.get('rm') || 'blank';

                // 设置侧边栏宽度
                document.documentElement.style.setProperty('--sidebar-width', "0px")
                // 设置页面宽度
                document.documentElement.style.setProperty('--body-width', "100%")
                // 设置页面高度
                document.documentElement.style.setProperty('--body-height', "100%")
                // 设置页面最大宽度
                document.documentElement.style.setProperty('--body-max-width', "100%")
            }
        },
        created(){
            // 修改右侧模块
            window.subModule.$on('sub-module-core-change-module-show', this.moduleShowChange)

            // 获取当前是否登录
            window.subModule.$on('sub-module-core-is-login', this.getIsLogin)

            // 获取当前模块
            window.subModule.$on('sub-module-core-get-module', this.getModule)

            // 用户设置变更
            window.subModule.$on('sub-module-core-user-setting-change', this.userSettingChange)
        },
        watch:{
            isMobile: {
                handler: function(val){},
                immediate: true
            }
        },
        components: components,
    })
}

load_tl_rtc_app_js()