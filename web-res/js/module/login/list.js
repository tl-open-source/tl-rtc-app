const tl_rtc_app_module_login_list = {
    props : {
        loginList : {
            type: Array,
            default: function(){
                return [];
            }
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
    computed: {
        propsLoginList(){
            return this.loginList;
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
    mounted() {
        
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
         * @param {*} item 
         * @returns 
         */
        openLoginItem: function(item){
            if (![
                'account', 'email',
            ].includes(item.type)){
                item.handler && item.handler.call(this)
                return
            }

            item.handler && item.handler.call(this)

            // 通知兄弟子模块，数据变更
            this.emitSubModuleEvent({
                event: 'sub-module-login-content-data-change',
                data: {
                    loginType : item.type
                }
            })

            // 打开右侧模块 - 处理移动端情况
            this.emitSubModuleEvent({
                event: 'sub-module-core-change-module-show',
                data: {
                    showRightModule: true,
                }
            })
        }
    },
    data : function(){
        return {
            
        }
    },
    template: `
        <div class="tl-rtc-app-left-panel-login">
            <div class="tl-rtc-app-left-panel-login-top-header">
                <div class="tl-rtc-app-left-panel-login-top-header-title">用户登录</div>
            </div>

            <div class="tl-rtc-app-left-panel-login-item"
                v-for="item in propsLoginList"
                @click="openLoginItem(item)"
            >
                
                <div class="tl-rtc-app-left-panel-login-item-icon">
                    <svg class="icon" aria-hidden="true">
                        <use :xlink:href="item.svg"></use>
                    </svg>
                </div>

                <div class="tl-rtc-app-left-panel-login-item-name">
                    {{item.name}}
                </div>

            </div>
        </div>
    `,
}

window.tl_rtc_app_module_login_list = tl_rtc_app_module_login_list