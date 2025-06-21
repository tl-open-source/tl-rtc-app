const tl_rtc_app_module_login_content = {
    props: {
        socket: {
            type: Object,
            default: null
        },
        isMobile:{
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
        propsSocket(){
            return this.socket;
        },
        propsIsMobile(){
            return this.isMobile;
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
            loginType : 'account',
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
         * 登陆方式
         * @param {*} loginType 
         */
        moduleDataChange: function({
            loginType, callback
        }){
            this.loginType = loginType

            callback && callback()
        },
        /**
         * 回退
         */
        goBack: function(){
            this.emitSubModuleEvent({
                event: 'sub-module-core-change-module-show',
                data: {
                    showRightModule: false,
                }
            })
        }
    },
    mounted() {
        
    },
    created(){
        // 登录方式改变
        window.subModule.$on('sub-module-login-content-data-change', this.moduleDataChange)
    },
    components : {
        'tl_rtc_app_module_login_content_email' : window.tl_rtc_app_module_login_content_email,
        'tl_rtc_app_module_login_content_account' : window.tl_rtc_app_module_login_content_account,
    },
    template: `
        <div class="tl-rtc-app-right-login-content">
            <svg class="icon goBack" aria-hidden="true" @click="goBack" v-show="isMobile">
                <use xlink:href="#tl-rtc-app-icon-xiangzuo1"></use>
            </svg>
            
            <tl_rtc_app_module_login_content_account
                :is-mobile="propsIsMobile"
                v-show="loginType == 'account'"
                :socket="propsSocket"
                :left-module="propsLeftModule"
                :right-module="propsRightModule"
                :code-list="propsCodeList"
                @left-module-change="leftModuleChange"
                @right-module-change="rightModuleChange"
            >
            </tl_rtc_app_module_login_content_account>

            <tl_rtc_app_module_login_content_email
                :is-mobile="propsIsMobile"
                v-show="loginType == 'email'"
                :socket="propsSocket"
                :left-module="propsLeftModule"
                :right-module="propsRightModule"
                :code-list="propsCodeList"
                @left-module-change="leftModuleChange"
                @right-module-change="rightModuleChange"
            >
            </tl_rtc_app_module_login_content_email>
        </div>
    `,
}

window.tl_rtc_app_module_login_content = tl_rtc_app_module_login_content