const tl_rtc_app_module_login_content_account = {
    props : {
        isMobile: {
            type: Boolean,
            default: false
        },
        leftModule: {
            type: String,
            default: ''
        },
        rightModule: {
            type: String,
            default: ''
        }
    },
    computed: {
        propsIsMobile(){
            return this.isMobile;
        },
        propsLeftModule() {
            return this.leftModule;
        },
        propsRightModule() {
            return this.rightModule;
        },
    },
    watch: {
        leftModule: function (val) {
            
        },
        rightModule: function (val) {
            
        }
    },
    data : function(){
        return {
            account: '',
            password: '',
            inviteCode: 'tlrtcappdemo',
            btnType : 'login',
            requesting : false
        }
    },
    methods: {
        /**
         *  事件触发，向上传递
         * @param {*} event 
         */
        leftModuleChange: function(event){
            this.$emit('left-module-change', event)
        },
        /**
         * 事件触发，向上传递
         * @param {*} event 
         */
        rightModuleChange: function(event){
            this.$emit('right-module-change', event)
        },
        /**
         * 切换到注册帐号
         * @returns
         * */
        showRegisterAccount: function(){
            this.btnType = 'register'
        },
        /**
         * 切换到登录帐号
         * @returns
         * */
        showLoginAccount: function(){
            this.btnType = 'login'
        },
        /**
         * 登陆帐号
         * @returns
         * */
        loginAccount: async function(){
            if(this.account == ''){
                this.popWarningMsg("请输入帐号")
                return;
            }
            if(this.password == ''){
                this.popWarningMsg("请输入密码")
                return;
            }
            
            const bfpData = await this.emitSubModuleEvent({
                event: 'component-bfp-info',
            })
            const {fps} = bfpData
            
            let params = {
                account: Base64.encode(this.account),
                password: Base64.encode(this.password),
                fps: fps,
            }
            if(!window.tl_rtc_app_comm.checkRequestParams(params)){
                this.popErrorMsg("请求参数非法")
                return
            }

            this.requesting = true
            const { data: loginRes } = await this.tlRequest({
                url: '/api/web/user-login/login-by-account',
                method: 'post',
                useCache: false,
                data: params,
                
            })
            if(loginRes.success){
                this.popSuccessMsg(loginRes.msg)
                window.location.reload()
            }else{
                this.popErrorMsg(loginRes.msg)
                this.password = '' 
            }
            this.requesting = false
        },
        /**
         * 注册帐号
         * @returns
         * */
        registerAccount: async function(){
            if(this.account == ''){
                this.popWarningMsg("请输入帐号")
                return;
            }
            if(this.password == ''){
                this.popWarningMsg("请输入密码")
                return;
            }
            if(this.inviteCode == ''){
                this.popWarningMsg("请输入邀请码")
                return;
            }

            let params = {
                account: Base64.encode(this.account),
                password: Base64.encode(this.password),
                invite_code: this.inviteCode
            }
            if(!window.tl_rtc_app_comm.checkRequestParams(params)){
                this.popErrorMsg("请求参数非法")
                return
            }

            this.requesting = true
            const { data: loginRes } = await this.tlRequest({
                url: '/api/web/user-register/register-by-account',
                method: 'post',
                useCache: false,
                data: params,
                
            })
            if(loginRes.success){
                this.popSuccessMsg(loginRes.msg)
            }else{
                this.popErrorMsg(loginRes.msg)
                this.password = ''
            }
            this.requesting = false
        },
        loginHelp: function(){
            this.popWarningMsg("可加群联系开发人员")
        }
    },
    mounted() {
        const textareaDom = document.querySelector('#loginAccountPasswordInput')
        window.tl_rtc_app_comm.keydownCallback(textareaDom, this.loginAccount)

        const textareaDom2 = document.querySelector('#loginAccountInput')
        window.tl_rtc_app_comm.keydownCallback(textareaDom2, function(){
            textareaDom.focus()
        })
    },
    template: `
        <div class="tl-rtc-app-right-login-content-body">
            <div class="tl-rtc-app-right-login-content-body-header" v-if="btnType === 'login'">
                欢迎回来，使用帐号登录
            </div>
            <div class="tl-rtc-app-right-login-content-body-header" v-else-if="btnType === 'register'">
                开始注册帐号
            </div>
            <div class="tl-rtc-app-right-login-content-body-form">
                <div class="tl-rtc-app-right-login-content-body-form-item" v-show="btnType === 'register'">
                    <input
                        v-model="inviteCode"
                        type="text" autocomplete="off" placeholder="邀请码" class="layui-input" maxlength="60">
                </div>
                <div class="tl-rtc-app-right-login-content-body-form-item">
                    <input id='loginAccountInput'
                        v-model="account"
                        type="text" autocomplete="off" placeholder="帐号" class="layui-input" maxlength="20">
                </div>
                <div class="tl-rtc-app-right-login-content-body-form-item">
                    <input id='loginAccountPasswordInput' 
                        v-model="password"
                        type="password" autocomplete="off" placeholder="密码" class="layui-input" maxlength="48">
                </div>
                <div class="tl-rtc-app-right-login-content-body-form-item">
                    <button v-if="btnType === 'login'" class="layui-btn" @click="loginAccount"> 
                        <i v-show='requesting' 
                            class="layui-icon layui-icon-loading layui-anim layui-anim-rotate layui-anim-loop"></i>
                        <b>立即登录</b> 
                    </button>
                    <button v-else="btnType === 'register'" class="layui-btn" @click="registerAccount"> 
                        <b>立即注册</b>
                    </button>
                </div>
            </div>
            <div class="tl-rtc-app-right-login-content-body-bottom">
                <div @click="showRegisterAccount" v-if="btnType === 'login'">
                    没有帐号?，立即注册 >
                </div>
                <div @click="showLoginAccount" v-else-if="btnType === 'register'">
                    已有帐号?，立即登录 >
                </div>

                <div @click="loginHelp">
                    登陆遇到问题?
                </div>

            </div>
        </div>
    `,
}

window.tl_rtc_app_module_login_content_account = tl_rtc_app_module_login_content_account