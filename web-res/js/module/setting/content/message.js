const tl_rtc_app_module_setting_content_message = {
    props: {
        socket: {
            type: Object,
            default: null
        },
        isMobile: {
            type: Boolean,
            default: false
        },
        messageSetting: {
            type: Object,
            default: {
                webNotify: false,
                messageDot: false,
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
        propsSocket(){
            return this.socket;
        },
        propsIsMobile(){
            return this.isMobile;
        },
        propsMessageSetting(){
            return this.messageSetting;
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
            settingFields : [
                'webNotify',
                'messageDot',
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
         * 获取设置字段数据
         * @returns 
         */
        getSettingFieldsData: function(){
            let that = this
            let returnData = {}
            this.settingFields.forEach((item) => {
                returnData[item] = that.propsMessageSetting[item]
            })
            
            return returnData
        },
        /**
         * 更新消息设置
         */
        updateMessageSetting(){
            this.$emit('update-user-config-message', this.getSettingFieldsData());
        }
    },
    mounted() {
        let that = this
        window.form.render();
        window.form.val('messageSettingContent', this.getSettingFieldsData())

        window.form.on('switch', function(data){
            if(that.settingFields.includes(data.elem.name)){
                that.propsMessageSetting[data.elem.name] = data.elem.checked
                that.updateMessageSetting()
            }
        });
    },
    updated() {
        window.form.render();
        window.form.val('messageSettingContent', this.getSettingFieldsData())
    },
    template: `
        <div style="padding: 5px 0px;height: 100%;">
            <div class="tl-rtc-app-right-setting-content-top">
                <div class="tl-rtc-app-right-setting-content-top-title">
                    消息相关设置
                </div>
            </div>
            <div class="tl-rtc-app-right-setting-content-message layui-form" lay-filter="messageSettingContent">
                <div class="tl-rtc-app-right-setting-content-message-block">
                    <div class="tl-rtc-app-right-setting-content-message-block-title">消息设置</div>
                    <div class="tl-rtc-app-right-setting-content-message-block-content">
                        <div class="tl-rtc-app-right-setting-content-message-block-item" >
                            <div class="tl-rtc-app-right-setting-content-message-block-item-title"> 消息浏览器通知 </div>
                            <div class="tl-rtc-app-right-setting-content-message-block-item-oper">
                                <input type="checkbox" name="webNotify" lay-skin="switch">
                            </div>
                        </div>

                        <div class="tl-rtc-app-right-setting-content-message-block-item">
                            <div class="tl-rtc-app-right-setting-content-message-block-item-title"> 消息红点数量提示 </div>
                            <div class="tl-rtc-app-right-setting-content-message-block-item-oper">
                                <input type="checkbox" name="messageDot" lay-skin="switch">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
}

window.tl_rtc_app_module_setting_content_message = tl_rtc_app_module_setting_content_message