const tl_rtc_app_module_login = {
    props: {
        socket: {
            type: Object,
            default: null
        },
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
    computed:{
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
    },
    watch: {
        leftModule: function (val) {
            
        },
        rightModule: function (val) {
            
        }
    },
    data : function(){
        return {
            loginedCacheList: [],
            loginedListCacheKey: 'tl_logined_list',
            loginList: [
                {
                    name : '帐号登录',
                    svg: '#tl-rtc-app-icon-gerenzhongxin',
                    type : 'account',
                    default : true,
                    handler: this.handlerAccountLogin
                },
                {
                    name : '邮箱登录',
                    svg: '#tl-rtc-app-icon-youjian1',
                    type : 'email',
                    default : false,
                    handler: this.handlerEmailLogin
                }
            ]
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
        * 帐号登录
        */
        handlerAccountLogin: function(){
            this.$emit('right-module-change', 'content')
        },
        /**
        * 邮箱登录
        */
        handlerEmailLogin: function(){
            this.$emit('right-module-change', 'content')
        },
        /**
         * 设置登录过的帐号缓存到localStorage
         * @param {*} userId
         * @param {*} username
         * @param {*} avatarUrl
         * @param {*} token
         * @param {*} time
         * @returns
         */
        setCacheLoginAccount: function({
            userId, username, avatarUrl, token, time, callback
        }){
            let loginedList = localStorage.getItem(this.loginedListCacheKey)
            if(loginedList){
                loginedList = JSON.parse(loginedList)
                
                // 如果已经存在，不再添加
                if(loginedList.some(item => item.userId == userId)){
                    callback && callback()
                    return
                }

                loginedList.push({
                    userId,
                    username,
                    avatarUrl,
                    token,
                    time
                })
            }else{
                loginedList = [{
                    userId,
                    username,
                    avatarUrl,
                    token,
                    time
                }]
            }

            if(loginedList.length > 3){
                loginedList = loginedList.slice(0, 3)
            }

            localStorage.setItem(this.loginedListCacheKey, JSON.stringify(loginedList))

            callback && callback()
        },
        /**
         * 获取登录过的帐号缓存, 按time倒序
         * @returns 
         */
        getCacheLoginAccount: function(){
            let loginedList = localStorage.getItem(this.loginedListCacheKey)
            if(loginedList){
                loginedList = JSON.parse(loginedList)
                loginedList.sort((a, b) => b.time - a.time)
                this.loginedCacheList = loginedList
            }
        },
        /**
         * 清除登录过的帐号缓存
         */
        cleanCacheAccount: function(){
            localStorage.removeItem(this.loginedListCacheKey)
            this.loginedCacheList = []
        }
    },
    created() {
        // 设置登录过的帐号
        window.subModule.$on('sub-module-login-set-cache-account', this.setCacheLoginAccount)
    },
    mounted() {
        let that = this
        
        this.getCacheLoginAccount()
    },
    components:{
        'tl_rtc_app_module_login_list': window.tl_rtc_app_module_login_list,
        'tl_rtc_app_module_login_mobile': window.tl_rtc_app_module_login_mobile,
    },
    template: `
        <div class="tl-rtc-app-left-panel">

            <tl_rtc_app_module_login_list v-if="!propsIsMobile"
                :login-list='loginList'
                :is-mobile="propsIsMobile"
                :left-module="propsLeftModule"
                :right-module="propsRightModule"
                @left-module-change="leftModuleChange"
                @right-module-change="rightModuleChange"
                v-cloak
            > 
            </tl_rtc_app_module_login_list>

            <tl_rtc_app_module_login_mobile v-else
                @clean-cache-account="cleanCacheAccount"
                :login-list='loginList'
                :is-mobile="propsIsMobile"
                :logined-cache-list="loginedCacheList"
                :left-module="propsLeftModule"
                :right-module="propsRightModule"
                @left-module-change="leftModuleChange"
                @right-module-change="rightModuleChange"
                v-cloak
            >
            </tl_rtc_app_module_login_mobile>

        </div>
    `
}

window.tl_rtc_app_module_login = tl_rtc_app_module_login