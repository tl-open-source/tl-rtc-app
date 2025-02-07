const tl_rtc_app_module_setting_content = {
    props: {
        socket: {
            type: Object,
            default: null
        },
        isMobile:{
            type: Boolean,
            default: false
        },
        user: {
            type: Object,
            default: null
        },
        company: {
            type: Object,
            default: null
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
        propsSocket(){
            return this.socket;
        },
        propsIsMobile(){
            return this.isMobile;
        },
        propsUser(){
            return this.user
        },
        propsCompany(){
            return this.company
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
            settingType : 'normal', // 设置类型
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
         * 设置模块数据变更
         * @param {*} data 
         */
        moduleDataChange: function({
            settingType, callback
        }){
            this.settingType = settingType

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
        },
        /**
         * 更新用户帐号设置
         */
        updateUserConfigAccount: async function(updateAccountSetting){
            let params = {
                account: updateAccountSetting
            }
            if(!window.tl_rtc_app_comm.checkRequestParams(params)){
                this.popErrorMsg("请求参数非法")
                return
            }
            const { data: userConfigRes } = await this.tlRequest({
                url: '/api/web/user-config/update-user-config-account',
                method: 'post',
                useCache: false,
                data: params,
                
            })
            if(!userConfigRes.success){
                this.popErrorMsg(userConfigRes.msg)
                return
            }

            this.emitSubModuleEvent({
                event: 'sub-module-core-user-setting-change',
                data: {
                    accountSetting: updateAccountSetting
                }
            })

            this.popSuccessMsg(userConfigRes.msg)
        },
        /**
         * 更新用户其他设置
         */
        updateUserConfigOther: async function(updateOtherSetting){
            let params = {
                other: updateOtherSetting
            }

            if(updateOtherSetting.customWss){
                const isWssHost = window.tl_rtc_app_comm.isWssHost(updateOtherSetting.customWss)
                if(!isWssHost){
                    this.popWarningMsg('自定义socket服务器地址格式不正确')
                    return
                }
            }

            if(!window.tl_rtc_app_comm.checkRequestParams(params)){
                this.popErrorMsg("请求参数非法")
                return
            }
            const { data: userConfigRes } = await this.tlRequest({
                url: '/api/web/user-config/update-user-config-other',
                method: 'post',
                useCache: false,
                data: params,
                
            })
            if(!userConfigRes.success){
                this.popErrorMsg(userConfigRes.msg)
                return
            }
            
            this.emitSubModuleEvent({
                event: 'sub-module-core-user-setting-change',
                data: {
                    otherSetting: updateOtherSetting
                }
            })

            this.popSuccessMsg(userConfigRes.msg)
        }
    },
    mounted: function() {
        
    },
    created(){
        // 监听子模块数据变更
        window.subModule.$on('sub-module-setting-content-data-change', this.moduleDataChange)
    },
    components : {
        'tl_rtc_app_module_setting_content_account': window.tl_rtc_app_module_setting_content_account,
        'tl_rtc_app_module_setting_content_message': window.tl_rtc_app_module_setting_content_message,
        'tl_rtc_app_module_setting_content_other': window.tl_rtc_app_module_setting_content_other,
    },
    template: `
        <div class="tl-rtc-app-right-setting-content">
            <svg class="icon goBack" aria-hidden="true" @click="goBack" v-if="propsIsMobile">
                <use xlink:href="#tl-rtc-app-icon-xiangzuo1"></use>
            </svg>

            <tl_rtc_app_module_setting_content_account
                v-if="settingType == 'account'"
                :socket="propsSocket"
                :is-mobile="propsIsMobile"
                :account-setting="propsUser.accountSetting"
                :user="propsUser"
                :company="propsCompany"
                @update-user-config-account="updateUserConfigAccount"
                :left-module="propsLeftModule"
                :right-module="propsRightModule"
                @left-module-change="leftModuleChange"
                @right-module-change="rightModuleChange"
            >
            </tl_rtc_app_module_setting_content_account>

            <tl_rtc_app_module_setting_content_message
                v-if="settingType == 'message'"
                :socket="propsSocket"
                :is-mobile="propsIsMobile"
                :message-setting="propsUser.messageSetting"
                @update-user-config-message="updateUserConfigMessage"
                :company="propsCompany"
                :user="propsUser"
                :left-module="propsLeftModule"
                :right-module="propsRightModule"
                @left-module-change="leftModuleChange"
                @right-module-change="rightModuleChange"
            >
            </tl_rtc_app_module_setting_content_message>

            <tl_rtc_app_module_setting_content_other
                v-if="settingType == 'other'"
                :socket="propsSocket"
                :is-mobile="propsIsMobile"
                :other-setting="propsUser.otherSetting"
                @update-user-config-other="updateUserConfigOther"
                :company="propsCompany"
                :user="propsUser"
                :left-module="propsLeftModule"
                :right-module="propsRightModule"
                @left-module-change="leftModuleChange"
                @right-module-change="rightModuleChange"
            >
            </tl_rtc_app_module_setting_content_other>
        </div>
    `,
}

window.tl_rtc_app_module_setting_content = tl_rtc_app_module_setting_content