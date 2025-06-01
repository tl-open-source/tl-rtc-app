const tl_rtc_app_module_sidebar_logo = {
    props : {
        isLogin: {
            type: Boolean,
            default: false
        },
        user: {
            type: Object,
            default: function(){
                return {
                    userId: '', // 用户id
                    username: '', // 用户名称
                    userAvatar: '', // 用户头像
                }
            }
        },
        isMobile: {
            type: Boolean,
            default: false
        },
        company:{
            type: Object,
            default: function(){
                return {
                    name: ''
                }
            }
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
        propsIsLogin(){
            return this.isLogin;
        },
        propsUser(){
            return this.user;
        },
        propsIsMobile(){
            return this.isMobile;
        },
        propsCompanyName(){
            return this.company.name;
        },
        propsUserId(){
            return this.user.userId;
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
            logo : 'TL'
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
         * 用户信息弹窗
         * @param {*} event 
         */
        userInfoPopup: async function(event){
            if(!this.propsIsLogin){
                return
            }

            // 根据userId获取用户基础信息
            await this.emitSubModuleEvent({
                event: 'component-popup-user-info-popup',
                data: {
                    clientX: event.clientX,
                    clientY: event.clientY,
                    userInfo: {
                        id: this.propsUserId
                    },
                }
            })
        },
    },
    template: `
        <div class="tl-rtc-app-left-sidebar-logo" @click="userInfoPopup">
            <p v-if="propsIsLogin">{{propsUser.username}}</p>
            <p v-else>{{logo}}</p>
        </div>
    `,
}

window.tl_rtc_app_module_sidebar_logo = tl_rtc_app_module_sidebar_logo