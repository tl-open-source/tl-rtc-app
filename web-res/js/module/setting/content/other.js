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
        getUpdateSettingFieldsData: function(){
            let that = this
            let returnData = {}
            this.settingFields.forEach((item) => {
                returnData[item] = that.propsOtherSetting[item]
            })
        
            return returnData
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
            
            // 是否使用中继服务器
            returnData.turnServer = window.localStorage.getItem("tl-rtc-app-use-turn") === 'true'
            // 是否使用请求缓存
            returnData.apiCache = window.localStorage.getItem("tl-rtc-app-api-cache") === 'true'

            return returnData
        },
         /**
         * 更新设置
         */
         updateOtherSetting(){
            this.$emit('update-user-config-other', this.getUpdateSettingFieldsData());
        },
        mouseEnter: function (event, title) {
            tl_rtc_app_comm.mouseEnterTips({
                id: event.target.id,
                text: title,
                position: 'top',
                time: 3000
            });
        },
        mouseLeave: function () {
            tl_rtc_app_comm.mouseLeaveTips();
        },
        /**
         * 打开设备调试弹窗
         */
        openDeviceDebugger: function() {
            this.emitSubModuleEvent({
                event: 'component-media-device-select',
                data: {
                    mode: 'debug'
                }
            })
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

            if(data.elem.name === 'turnServer'){
                window.localStorage.setItem("tl-rtc-app-use-turn", data.elem.checked)
                that.popSuccessMsg(data.elem.checked ? '已开启中继转发' : '已关闭中继转发')
            }

            if(data.elem.name === 'apiCache'){
                window.localStorage.setItem("tl-rtc-app-api-cache", data.elem.checked)
                that.popSuccessMsg(data.elem.checked ? '已开启请求缓存' : '已关闭请求缓存')
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
                    <div class="tl-rtc-app-right-setting-content-other-block-title">客户端设置</div>
                    <div class="tl-rtc-app-right-setting-content-other-block-content">

                        <div class="tl-rtc-app-right-setting-content-other-block-item">
                            <div class="tl-rtc-app-right-setting-content-other-block-item-title"> 
                                中继服务器转发 
                                <svg class="icon" aria-hidden="true"
                                    id="tl-rtc-app-setting-turn-server"
                                    @mouseenter="mouseEnter(event, '无法直连时，使用中继服务器转发可提高连接成功率')"
                                    @mouseleave="mouseLeave"
                                >
                                    <use xlink:href="#tl-rtc-app-icon-tishi"></use>
                                </svg>
                            </div>
                            <div class="tl-rtc-app-right-setting-content-other-block-item-oper">
                                <input type="checkbox" name="turnServer" lay-skin="switch">
                            </div>
                        </div>

                        <div class="tl-rtc-app-right-setting-content-other-block-item">
                            <div class="tl-rtc-app-right-setting-content-other-block-item-title"> 
                                浏览器请求缓存 
                                <svg class="icon" aria-hidden="true"
                                    id="tl-rtc-app-setting-api-cache"
                                    @mouseenter="mouseEnter(event, '当前设备会缓存请求结果，加快部分请求，但会影响部分数据时效性')"
                                    @mouseleave="mouseLeave"
                                >
                                    <use xlink:href="#tl-rtc-app-icon-tishi"></use>
                                </svg>
                            </div>
                            <div class="tl-rtc-app-right-setting-content-other-block-item-oper">
                                <input type="checkbox" name="apiCache" lay-skin="switch">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="tl-rtc-app-right-setting-content-other-block" >
                    <div class="tl-rtc-app-right-setting-content-other-block-title">服务端设置</div>
                    <div class="tl-rtc-app-right-setting-content-other-block-content">
                        <div class="tl-rtc-app-right-setting-content-other-block-item"
                            style="display: flex; flex-direction: column; flex-wrap: nowrap; justify-content: center; align-items: flex-start;"
                        >
                            <div class="tl-rtc-app-right-setting-content-other-block-item-title" style="width: 100%;"> 
                                自定义socket服务器地址 
                                <svg class="icon" aria-hidden="true"
                                    id="tl-rtc-app-setting-customer-wss"
                                    @mouseenter="mouseEnter(event, '连接自定义socket服务器地址，如不填写则使用默认配置地址')"
                                    @mouseleave="mouseLeave"
                                >
                                    <use xlink:href="#tl-rtc-app-icon-tishi"></use>
                                </svg>
                            </div>
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