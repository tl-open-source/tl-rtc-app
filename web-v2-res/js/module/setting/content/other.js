const tl_rtc_app_module_setting_content_other = {
    props: {
        socket: {
            type: Object,
            default: null
        },
        isMobile: {
            type: Boolean,
            default: false
        },
        otherSetting: {
            type: Object,
            default: {
                turnServer: false,
                customWss: '',
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
        propsOtherSetting(){
            return this.otherSetting;
        },
        disableCustomWss(){
            return this.propsOtherSetting.customWss === this.customWss
        },
        propsLeftModule() {
            return this.leftModule;
        },
        propsRightModule() {
            return this.rightModule;
        },
    },
    data : function(){
        return {
            settingFields: [
                'turnServer',
                'customWss',
            ]
        }
    },
    watch: {
        leftModule: function (val) {
            
        },
        rightModule: function (val) {
            
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
                returnData[item] = that.propsOtherSetting[item]
            })

            if(returnData.turnServer){
                window.localStorage.setItem("tl-rtc-app-use-turn", "true")
            }else{
                window.localStorage.setItem("tl-rtc-app-use-turn", "false")
            }

            return returnData
        },
         /**
         * 更新设置
         */
         updateOtherSetting(){
            this.$emit('update-user-config-other', this.getSettingFieldsData());
        },
    },
    mounted() {
        let that = this
        window.form.render();
        window.form.val('otherSettingContent', this.getSettingFieldsData())

        window.form.on('switch', function(data){
            if(that.settingFields.includes(data.elem.name)){
                that.propsOtherSetting[data.elem.name] = data.elem.checked
                that.updateOtherSetting()
            }
        })
    },
    updated() {
        window.form.render();
        window.form.val('otherSettingContent', this.getSettingFieldsData())
    },
    template: `
        <div style="padding: 5px 0px; height: 100%;">
            <div class="tl-rtc-app-right-setting-content-top">
                <div class="tl-rtc-app-right-setting-content-top-title">
                    其他设置
                </div>
            </div>
            <div class="tl-rtc-app-right-setting-content-other layui-form" lay-filter="otherSettingContent">
                <div class="tl-rtc-app-right-setting-content-other-block" >
                    <div class="tl-rtc-app-right-setting-content-other-block-title">开发设置</div>
                    <div class="tl-rtc-app-right-setting-content-other-block-content">

                        <div class="tl-rtc-app-right-setting-content-other-block-item">
                            <div class="tl-rtc-app-right-setting-content-other-block-item-title"> 中继服务器转发 </div>
                            <div class="tl-rtc-app-right-setting-content-other-block-item-oper">
                                <input type="checkbox" name="turnServer" lay-skin="switch">
                            </div>
                        </div>

                        <div class="tl-rtc-app-right-setting-content-other-block-item"
                            style="display: flex; flex-direction: column; flex-wrap: nowrap; justify-content: center; align-items: flex-start;"
                        >
                            <div class="tl-rtc-app-right-setting-content-other-block-item-title" style="width: 100%;"> 自定义socket服务器地址 </div>
                            <div class="tl-rtc-app-right-setting-content-other-block-item-oper" style="display:flex;width: 100%; margin-top: 10px;">
                                <input type="text" autocomplete="off" placeholder="wss://" class="layui-input" maxlength="100" 
                                    v-model="propsOtherSetting.customWss" id="customWss">
                                <button class="layui-btn layui-btn-sm layui-btn-normal" @click="updateOtherSetting">保存</button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    `
}

window.tl_rtc_app_module_setting_content_other = tl_rtc_app_module_setting_content_other