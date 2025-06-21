const tl_rtc_app_module_login_content_email = {
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
        },
        codeList: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        propsIsMobile(){
            return this.isMobile;
        },
        waitGetCode(){
            return this.getCodeTime > 0
        },
        noEmail(){
            return this.email.trim() === ''
        },
        propsLeftModule() {
            return this.leftModule;
        },
        propsRightModule() {
            return this.rightModule;
        },
        propsCodeList() {
            return this.codeList;
        }
    },
    watch: {
        leftModule: function (val) {
            
        },
        rightModule: function (val) {
            
        }
    },
    data : function(){
        return {
            code: '',
            email: '',
            password: '',
            inviteCode: '请输入邀请码',
            btnType : 'login',
            requesting : false,
            getCodeTime: 0,
            timer: null
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
         * 显示注册邮箱
         * @returns
         * */
        showRegisterEmail: function(){
            this.btnType = 'register'
        },
        /**
         * 显示登录邮箱
         */
        showLoginEmail: function(){
            this.btnType = 'login'
        },
        /**
         * 登录邮箱
         * @returns
         */
        loginEmail: async function(){
            if(this.email == ''){
                this.popWarningMsg("请输入邮箱")
                return;
            }
            if(this.password == ''){
                this.popWarningMsg("请输入密码")
                return;
            }

            if(window.tl_rtc_app_comm.isEmail(this.email) === false){
                this.popWarningMsg("邮箱格式不正确")
                return
            }

            let params = {
                email: Base64.encode(this.email),
                password: Base64.encode(this.password),
                inviteCode: this.inviteCode
            }
            if(!window.tl_rtc_app_comm.checkRequestParams(params)){
                this.popErrorMsg("请求参数非法")
                return
            }

            this.requesting = true
            const { data: loginRes } = await this.tlRequest({
                url: '/api/web/user-login/login-by-email',
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
         * 注册邮箱
         * @returns 
         */
        registerEmail: async function(){
            if(this.email == ''){
                this.popWarningMsg("请输入邮箱")
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
            if(this.password.length > 30){
                this.popWarningMsg("密码长度不能超过30位")
                return;
            }

            if(window.tl_rtc_app_comm.isEmail(this.email) === false){
                this.popWarningMsg("邮箱格式不正确")
                return
            }

            let params = {
                email: Base64.encode(this.email),
                password: Base64.encode(this.password),
                invite_code: this.inviteCode,
                code: this.code
            }
            if(!window.tl_rtc_app_comm.checkRequestParams(params)){
                this.popErrorMsg("请求参数非法")
                return
            }

            this.requesting = true
            const { data: loginRes } = await this.tlRequest({
                url: '/api/web/user-register/register-by-email',
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
        /**
         * 忘记密码
         */
        forgotEmail: function(){
            this.btnType = 'forgot'
        },
        /**
         * 获取邮箱验证码
         */
        getEmailCode: async function(){
            let that = this;
            if(this.email == ''){
                this.popWarningMsg("请输入邮箱")
                return;
            }

            if(window.tl_rtc_app_comm.isEmail(this.email) === false){
                this.popWarningMsg("邮箱格式不正确")
                return
            }

            if (this.getCodeTime > 0) {
                return
            }

            this.getCodeTime = 60

            let params = {
                email: this.email
            }
            if(!window.tl_rtc_app_comm.checkRequestParams(params)){
                this.popErrorMsg("请求参数非法")
                return
            }
            const { data: codeRes } = await this.tlRequest({
                url: '/api/web/user-register/get-email-code',
                method: 'post',
                useCache: false,
                data: params,
                
            })
            if(!codeRes.success){
                this.popErrorMsg(codeRes.msg)
                return
            }

            this.popSuccessMsg(codeRes.msg)

            this.timer = setInterval(() => {
                that.getCodeTime--
                if(that.getCodeTime <= 0){
                    clearInterval(that.timer)
                    that.getCodeTime = 0
                    return
                }
            }, 1000)
        },
        forgotHelp: function(){
            this.popWarningMsg("可加群联系开发人员")
        },
        /**
         * 重置邮箱密码
         * @returns 
         */
        resetEmail: async function(){
            if(this.email == ''){
                this.popWarningMsg("请输入邮箱")
                return;
            }

            if(this.inviteCode == ''){
                this.popWarningMsg("请输入邀请码")
                return;
            }

            if(this.code == ''){
                this.popWarningMsg("请输入验证码")
                return;
            }

            if(window.tl_rtc_app_comm.isEmail(this.email) === false){
                this.popWarningMsg("邮箱格式不正确")
                return
            }

            let params = {
                email: Base64.encode(this.email),
                invite_code: this.inviteCode,
                code: this.code
            }
            if(!window.tl_rtc_app_comm.checkRequestParams(params)){
                this.popErrorMsg("请求参数非法")
                return
            }

            this.requesting = true

            const { data: loginRes } = await this.tlRequest({
                url: '/api/web/user-register/reset-by-email',
                method: 'post',
                useCache: false,
                data: params,
            })

            if(loginRes.success){
                this.popSuccessMsg(loginRes.msg)
            }else{
                this.popErrorMsg(loginRes.msg)
            }

            this.code = 0
            this.btnType = 'login'

            this.requesting = false
        }
    },
    mounted() {
        const textareaDom = document.querySelector('#loginEmailPasswordInput')
        window.tl_rtc_app_comm.keydownCallback(textareaDom, this.loginEmail)

        const textareaDom2 = document.querySelector('#loginEmailInput')
        window.tl_rtc_app_comm.keydownCallback(textareaDom2, function(){
            textareaDom.focus()
        })
    },
    template: `
        <div class="tl-rtc-app-right-login-content-body">
            <div class="tl-rtc-app-right-login-content-body-header" v-if="btnType === 'login'">
                欢迎回来，使用邮箱登录
            </div>
            <div class="tl-rtc-app-right-login-content-body-header" v-else-if="btnType === 'register'">
                开始注册邮箱号
            </div>
            <div class="tl-rtc-app-right-login-content-body-header" v-else-if="btnType === 'forgot'">
                开始重置密码
            </div>
            <div class="tl-rtc-app-right-login-content-body-form">
                <div class="tl-rtc-app-right-login-content-body-form-item">
                    <select class="layui-input" lay-search="" v-model="inviteCode">
                        <option key="请输入邀请码" value="请输入邀请码">请输入邀请码</option>
                        <option v-for="code in propsCodeList" :key="code.value" :value="code.value">{{ code.value }} ({{ code.name }})</option>
                    </select>
                </div>
                <div class="tl-rtc-app-right-login-content-body-form-item">
                    <input id='loginEmailInput' v-model="email" type="text" autocomplete="off" placeholder="邮箱" class="layui-input" maxlength="48">
                </div>
                <div class="tl-rtc-app-right-login-content-body-form-item" v-show="btnType === 'register' || btnType === 'forgot'" style='display: flex;'>
                    <input id='loginCodeInput'  v-model="code"
                        style="border-top-right-radius: 0; border-bottom-right-radius: 0;"
                        type="text" autocomplete="off" placeholder="验证码" class="layui-input" maxlength="6">

                    <button class="layui-btn layui-btn-primary tl-rtc-app-get-email-code-btn tl-rtc-app-get-email-code-btn-disabled" v-if="noEmail">
                        获取验证码
                    </button>
                    <button class="layui-btn layui-btn-primary tl-rtc-app-get-email-code-btn" @click="getEmailCode" v-if="!noEmail && !waitGetCode">
                        获取验证码
                    </button>
                    <button class="layui-btn layui-btn-primary tl-rtc-app-get-email-code-btn tl-rtc-app-get-email-code-btn-disabled" v-if="waitGetCode">
                        {{ getCodeTime }}s后获取
                    </button>
                </div>
                <div class="tl-rtc-app-right-login-content-body-form-item" v-show="btnType === 'login' || btnType === 'register'">
                    <input id='loginEmailPasswordInput' v-model="password" type="password" autocomplete="off" placeholder="密码" class="layui-input" maxlength="32">
                </div>
                <div class="tl-rtc-app-right-login-content-body-form-item">
                    <button v-if="btnType === 'login'" class="layui-btn" @click="loginEmail"> 
                        <i v-show='requesting' 
                            class="layui-icon layui-icon-loading layui-anim layui-anim-rotate layui-anim-loop"></i>
                        <b>立即登录</b> 
                    </button>

                    <button v-else-if="btnType === 'register'" class="layui-btn" @click="registerEmail"> 
                        <i v-show='requesting' 
                            class="layui-icon layui-icon-loading layui-anim layui-anim-rotate layui-anim-loop"></i>
                        <b>立即注册</b>
                    </button>

                    <button v-else-if="btnType === 'forgot'" class="layui-btn" @click="resetEmail"> 
                        <i v-show='requesting' 
                            class="layui-icon layui-icon-loading layui-anim layui-anim-rotate layui-anim-loop"></i>
                        <b>立即重置</b>
                    </button>
                </div>
            </div>
            <div class="tl-rtc-app-right-login-content-body-bottom">
                <div @click="showRegisterEmail" v-if="btnType === 'login' || btnType === 'forgot'">
                    没有邮箱号?，立即注册 >
                </div>

                <div @click="showLoginEmail" v-else-if="btnType === 'register'">
                    已有邮箱号?，立即登录 >
                </div>

                <div @click="forgotEmail" v-if="btnType === 'login' || btnType === 'register'">
                    忘记密码?
                </div>

                <div @click="forgotHelp" v-if="btnType === 'forgot'">
                    重置遇到问题?
                </div>

            </div>
        </div>
    `,
}

window.tl_rtc_app_module_login_content_email = tl_rtc_app_module_login_content_email