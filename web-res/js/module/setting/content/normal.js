const tl_rtc_app_module_setting_content_normal = {
    props: {
        socket: {
            type: Object,
            default: null
        },
        isMobile: {
            type: Boolean,
            default: false
        },
        normalSetting: {
            type: Object,
            default: {
                homePage: 'channel',
                sidebarChannelOpen: true,
                sidebarContactOpen: true,
                sidebarCutPasteOpen: true,
                sidebarSettingOpen: true,
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
        propsNormalSetting(){
            return this.normalSetting;
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
            settingFields: [
                'sidebarChannelOpen',
                'sidebarContactOpen',
                'sidebarCutPasteOpen',
                'sidebarSettingOpen',
                'homePage'
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
                returnData[item] = that.propsNormalSetting[item]
            })
            
            // 侧边栏-设置强制开启
            returnData.sidebarSettingOpen = true

            return returnData
        },
        mouseEnter: function (event, title) {
            tl_rtc_app_comm.mouseEnterTips({
                id: event.target.id,
                text: title,
                position: 'top'
            });
        },
        mouseLeave: function () {
            tl_rtc_app_comm.mouseLeaveTips();
        },
        /**
         * 更新设置
         */
        updateNormalSetting(){
            this.$emit('update-user-config-normal', this.getSettingFieldsData());
        },
        /**
         * 修改字体大小
         * @param {*} fontSize 
         */
        changeFontSize: function(fontSize){
            this.propsNormalSetting.fontSize = fontSize;
            this.updateNormalSetting()
        },
    },
    mounted() {
        let that = this;
        window.form.render();

        window.form.val('normalSettingContent', this.getSettingFieldsData())

        window.form.on('switch', function(data){
            if(that.settingFields.includes(data.elem.name)){
                that.propsNormalSetting[data.elem.name] = data.elem.checked
                that.updateNormalSetting()
            }
        });

        window.form.on('radio', function(data){
            if(data.elem.name === 'homePage'){
                that.propsNormalSetting.homePage = data.value
                that.updateNormalSetting()
            }
        });
    },
    updated() {
        window.form.val('normalSettingContent', this.getSettingFieldsData())
    },
    template: `
        <div style="padding: 5px 0px;height: 100%;">
            <div class="tl-rtc-app-right-setting-content-top">
                <div class="tl-rtc-app-right-setting-content-top-title">
                    通用设置
                </div>
            </div>
            <div class="tl-rtc-app-right-setting-content-normal layui-form" lay-filter="normalSettingContent">
                <div class="tl-rtc-app-right-setting-content-normal-block">
                    <div class="tl-rtc-app-right-setting-content-normal-block-title">首页设置</div>
                    <div class="tl-rtc-app-right-setting-content-normal-block-content">
                        <div class="tl-rtc-app-right-setting-content-normal-block-item">
                            <div class="tl-rtc-app-right-setting-content-normal-block-item-title"> 
                                <svg class="icon" aria-hidden="true" style="padding-right: 5px;">
                                    <use xlink:href="#tl-rtc-app-icon-xiaoxi"></use>
                                </svg>
                                消息 
                            </div>
                            <div class="tl-rtc-app-right-setting-content-normal-block-item-oper">
                                <input type="radio" name="homePage" value="channel" checked>
                            </div>
                        </div>
                        
                        <div class="tl-rtc-app-right-setting-content-normal-block-item">
                            <div class="tl-rtc-app-right-setting-content-normal-block-item-title"> 
                                <svg class="icon" aria-hidden="true" style="padding-right: 5px;">
                                    <use xlink:href="#tl-rtc-app-icon-tongxunlu"></use>
                                </svg>
                                通讯录 
                            </div>
                            <div class="tl-rtc-app-right-setting-content-normal-block-item-oper">
                                <input type="radio" name="homePage" value="contact">
                            </div>
                        </div>

                        <div class="tl-rtc-app-right-setting-content-normal-block-item">
                            <div class="tl-rtc-app-right-setting-content-normal-block-item-title"> 
                                <svg class="icon" aria-hidden="true" style="padding-right: 5px;">
                                    <use xlink:href="#tl-rtc-app-icon-jianqie"></use>
                                </svg>
                                剪贴板 
                            </div>
                            <div class="tl-rtc-app-right-setting-content-normal-block-item-oper">
                                <input type="radio" name="homePage" value="cut_paste">
                            </div>
                        </div>

                        <div class="tl-rtc-app-right-setting-content-normal-block-item">
                            <div class="tl-rtc-app-right-setting-content-normal-block-item-title"> 
                                <svg class="icon" aria-hidden="true" style="padding-right: 5px;">
                                    <use xlink:href="#tl-rtc-app-icon-shezhi"></use>
                                </svg>
                                设置 
                            </div>
                            <div class="tl-rtc-app-right-setting-content-normal-block-item-oper">
                                <input type="radio" name="homePage" value="setting">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="tl-rtc-app-right-setting-content-normal-block">
                    <div class="tl-rtc-app-right-setting-content-normal-block-title">
                        底部/侧边导航栏设置  
                        <svg class="icon" aria-hidden="true" 
                            style="padding-left: 10px; margin-left: -10px; cursor: pointer; scale: 1.2;"
                            v-show="false"
                            id="setting-normal-sidebar-tip"
                            @mouseenter="mouseEnter(event, '移动端最多展示4个')"
                            @mouseleave="mouseLeave"
                        >
                            <use xlink:href="#tl-rtc-app-icon-tishi"></use>
                        </svg>
                    </div>
                    <div class="tl-rtc-app-right-setting-content-normal-block-content">
                        <div class="tl-rtc-app-right-setting-content-normal-block-item">
                            <div class="tl-rtc-app-right-setting-content-normal-block-item-title"> 
                                <svg class="icon" aria-hidden="true" style="padding-right: 5px;">
                                    <use xlink:href="#tl-rtc-app-icon-xiaoxi"></use>
                                </svg>
                                消息 
                            </div>
                            <div class="tl-rtc-app-right-setting-content-normal-block-item-oper">
                                <input type="checkbox" name="sidebarChannelOpen" lay-skin="switch">
                            </div>
                        </div>
                        
                        <div class="tl-rtc-app-right-setting-content-normal-block-item">
                            <div class="tl-rtc-app-right-setting-content-normal-block-item-title"> 
                                <svg class="icon" aria-hidden="true" style="padding-right: 5px;">
                                    <use xlink:href="#tl-rtc-app-icon-tongxunlu"></use>
                                </svg>
                                通讯录 
                            </div>
                            <div class="tl-rtc-app-right-setting-content-normal-block-item-oper">
                                <input type="checkbox" name="sidebarContactOpen" lay-skin="switch">
                            </div>
                        </div>

                        <div class="tl-rtc-app-right-setting-content-normal-block-item">
                            <div class="tl-rtc-app-right-setting-content-normal-block-item-title"> 
                                <svg class="icon" aria-hidden="true" style="padding-right: 5px;">
                                    <use xlink:href="#tl-rtc-app-icon-jianqie"></use>
                                </svg>
                                剪贴板 
                            </div>
                            <div class="tl-rtc-app-right-setting-content-normal-block-item-oper">
                                <input type="checkbox" name="sidebarCutPasteOpen" lay-skin="switch">
                            </div>
                        </div>

                        <div class="tl-rtc-app-right-setting-content-normal-block-item">
                            <div class="tl-rtc-app-right-setting-content-normal-block-item-title"> 
                                <svg class="icon" aria-hidden="true" style="padding-right: 5px;">
                                    <use xlink:href="#tl-rtc-app-icon-shezhi"></use>
                                </svg>
                                设置
                            </div>
                            <div class="tl-rtc-app-right-setting-content-normal-block-item-oper">
                                <input type="checkbox" name="sidebarSettingOpen" lay-skin="switch" disabled>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
}

window.tl_rtc_app_module_setting_content_normal = tl_rtc_app_module_setting_content_normal