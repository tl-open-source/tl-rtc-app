const tl_rtc_app_module_login_content_mobile = {
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
        loginMobile: function(){

        },
        registerMobile: function(){
            
        },
        forgotMobile: function(){
            
        }
    },
    template: `
        <div class="tl-rtc-app-right-login-content-body">
            <div class="tl-rtc-app-right-login-content-body-header">
                欢迎回来，使用手机号登录
            </div>
            <div class="tl-rtc-app-right-login-content-body-form">
                <div class="tl-rtc-app-right-login-content-body-form-item">
                    <input type="text" autocomplete="off" placeholder="手机号" class="layui-input" maxlength="48">
                </div>
                <div class="tl-rtc-app-right-login-content-body-form-item">
                    <input type="password" autocomplete="off" placeholder="验证码" class="layui-input" maxlength="48">
                </div>
                <div class="tl-rtc-app-right-login-content-body-form-item">
                    <button class="layui-btn" @click="loginMobile"> 立即登录 </button>
                </div>
            </div>
        </div>
    `,
}

window.tl_rtc_app_module_login_content_mobile= tl_rtc_app_module_login_content_mobile