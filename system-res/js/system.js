window.subModule = new Vue()

const loadJs = function (url, callback) {
    let script = document.createElement('script'),
        fn = callback || function () { };
    script.type = 'text/javascript';
    //IE
    if (script.readyState) {
        script.onreadystatechange = function () {
            if (script.readyState == 'loaded' || script.readyState == 'complete') {
                script.onreadystatechange = null;
                fn();
            }
        };
    } else {
        //其他浏览器
        script.onload = function () {
            fn();
        };
    }
    script.src = url;
    document.getElementsByTagName('head')[0].appendChild(script);
}


const loadSystemJs = function(){
    layui.use([
        'element', 'layer', 'form', 'table', 'util', 'laypage'
    ], async function () {
        window.layer = layui.layer;
        window.form = layui.form;
        window.$ = layui.$;
        window.element = layui.element;
        window.table = layui.table;
        window.util = layui.util;
        window.laypage = layui.laypage;
    
        /**
         * 获取登录状态
         * 初始化系统登录信息
         */
        let { data: loginStateRes } = await axios.get("/api/web/user-login/system-login-state");
        let isLogin = loginStateRes.success;
        let username = loginStateRes.data?.loginUsername || '';
        let userAvatar = loginStateRes.data?.loginUserAvatar || '';
        let token = loginStateRes.data?.token || '';
    
        if(isLogin && token){
            window.localStorage.setItem('token', token);
        }
    
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
    
        // 系统管理页面Vue实例
        let app = new Vue({
            el: '#tl-rtc-app-system',
            data: {
                isLogin: isLogin,       // 是否已登录
                username: username,     // 用户名
                userAvatar: userAvatar, // 用户头像
                showUserPanel: false,   // 显示用户面板
                activeTab: '',          // 当前激活的Tab
                sidebarCollapsed: false,// 侧边栏是否收缩
                loginForm: {            // 登录表单
                    username: '',
                    password: ''
                }
            },
            watch: {
                activeTab: function(newVal) {
                    // 在标签切换时更新layui元素的渲染
                    this.$nextTick(() => {
                        element.render('nav');
                    });
                },
                // 监听侧边栏收缩状态变化，持久化保存
                sidebarCollapsed: function(newVal) {
                    localStorage.setItem('tl_rtc_app_sidebar_collapsed', newVal ? '1' : '0');
                }
            },
            methods: {
                /**
                 * 初始化页面
                 */
                initPage: async function() {
                    if (!this.isLogin){
                        this.showLoginDialog();
                        return;
                    }
    
                    // 初始化element UI
                    this.$nextTick(() => {
                        element.render('nav');
                        form.render();
                    });
                },
                /**
                 * 显示登录对话框
                 */
                showLoginDialog: function() {
                    const that = this;
                    this.loginForm = { 
                        username: '', 
                        password: ''
                    };
                    
                    layer.open({
                        type: 1,
                        title: '管理员登录',
                        closeBtn: 1,
                        shadeClose: true,
                        area: ['450px', '330px'],
                        skin: 'tl-rtc-app-login-layer',
                        content: `
                            <div class="tl-rtc-app-login-form">
                                <div class="tl-rtc-app-login-form-item">
                                    <label for="username">用户名</label>
                                    <input type="text" id="username" placeholder="请输入用户名">
                                </div>
                                <div class="tl-rtc-app-login-form-item">
                                    <label for="password">密码</label>
                                    <input type="password" id="password" placeholder="请输入密码">
                                </div>
                            </div>
                        `,
                        btn: ['登录', '取消'],
                        success: function(layero) {
                            layero.css({
                                'border-radius': '6px',
                            });
    
                            // 添加回车键登录支持
                            const passwordInput = document.getElementById('password');
                            const usernameInput = document.getElementById('username');
                            
                            if (passwordInput) {
                                passwordInput.addEventListener('keyup', function(e) {
                                    if (e.key === 'Enter') {
                                        that.login();
                                    }
                                });
                            }
                            
                            if (usernameInput) {
                                usernameInput.focus();
                                usernameInput.addEventListener('keyup', function(e) {
                                    if (e.key === 'Enter') {
                                        passwordInput && passwordInput.focus();
                                    }
                                });
                            }
                        },
                        yes: async function(index) {
                            that.loginForm.username = $('#username').val();
                            that.loginForm.password = $('#password').val();
                            await that.login();
                            layer.close(index);
                        }
                    });
                },
                /**
                 * 用户登录
                 */
                login: async function() {
                    try {
                        // 检查表单
                        if (!this.loginForm.username || !this.loginForm.password) {
                            this.popWarningMsg('用户名和密码不能为空');
                            return;
                        }
                        
                        // 调用登录API
                        const { data: loginRes } = await axios.post('/api/web/user-login/login-by-system', {
                            email: Base64.encode(this.loginForm.username),
                            password: Base64.encode(this.loginForm.password)
                        });
                        
                        if (!loginRes.success) {
                            this.popErrorMsg(loginRes.msg || '登录失败');
                            return;
                        }
                        
                        // 保存Token
                        if (loginRes.data && loginRes.data.token) {
                            window.localStorage.setItem('token', loginRes.data.token);
                        }
                        
                        this.popSuccessMsg('登录成功');
                        
                        setTimeout(() => {
                            window.location.reload();
                        }, 300);
                        
                    } catch (error) {
                        console.error('登录失败:', error);
                        this.popErrorMsg('登录失败，请重试');
                    }
                },
                /**
                 * 用户退出登录
                 */
                logout: async function() {
                    try {
                        const { data: logoutRes } = await axios.get('/api/web/user-logout/system-logout');
                        
                        if (!logoutRes.success) {
                            this.popErrorMsg(logoutRes.msg || '退出登录失败');
                            return;
                        }
                        
                        window.localStorage.removeItem('token');
                        this.popSuccessMsg('退出成功');
                        
                        setTimeout(() => {
                            window.location.reload();
                        }, 300);
                        
                    } catch (error) {
                        console.error('退出登录失败:', error);
                        this.popErrorMsg('退出登录失败，请重试');
                    }
                },
                /**
                 * 切换侧边栏收缩状态
                 */
                toggleSidebar: function() {
                    this.sidebarCollapsed = !this.sidebarCollapsed;
                    
                    // 在侧边栏状态改变后，重新渲染导航
                    this.$nextTick(() => {
                        element.render('nav');
                    });
                }
            },
            mounted() {
                this.initPage();
                
                // 从 localStorage 中恢复上次选择的标签页
                const savedTab = localStorage.getItem('tl_rtc_app_active_tab');
                if (savedTab) {
                    this.activeTab = savedTab;
                }
                
                // 从 localStorage 中恢复侧边栏收缩状态
                const savedSidebarState = localStorage.getItem('tl_rtc_app_sidebar_collapsed');
                if (savedSidebarState) {
                    this.sidebarCollapsed = savedSidebarState === '1';
                }
                
                // 监听标签页变化，保存到 localStorage
                this.$watch('activeTab', function(newVal) {
                    localStorage.setItem('tl_rtc_app_active_tab', newVal);
                });
            }
        });
    });    
}


loadJs('lib-basic-sdk.min.js', function () {
    loadJs('lib-component-sdk.min.js', function () {
        loadSystemJs()
    });
});
