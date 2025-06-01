const tl_rtc_app_module_setting_list = {
    props: {
        socket: {
            type: Object,
            default: null
        },
        isMobile: {
            type: Boolean,
            default: false
        },
        settingList: {
            type: Array,
            default: []
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
        propsSettingList(){
            return this.settingList;
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
            searchKey: '',
            activeSettingType: ''
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
         * 打开设置项
         * @param {*} item 
         * @returns 
         */
        openSettingItem: function(item){
            if(item.type == 'logout'){
                item.handler && item.handler.call(this)
                return
            }
            item.handler && item.handler.call(this)

            // 通知兄弟子模块，数据变更
            this.emitSubModuleEvent({
                event: 'sub-module-setting-content-data-change',
                data: {
                    settingType : item.type
                }
            })

            // 打开右侧模块 - 处理移动端情况
            this.emitSubModuleEvent({
                event: 'sub-module-core-change-module-show',
                data: {
                    showRightModule: true,
                }
            })

            this.activeSettingType = item.type
        },
        /**
         * 打开快速操作面板
         */
        openQuickOperPanel: function(){
            this.emitSubModuleEvent({
                event: 'component-popup-add-quick-oper-panel',
            })
        },
        /**
         * 搜索设置
         */
        searchSetting: function({
            callback
        }){
            this.popWarningMsg('暂未开放')

            callback && callback()
        }
    },
    mounted() {
        
    },
    created(){
        // 监听搜索快捷设置项目
        window.subModule.$on('sub-module-setting-search', this.searchSetting)
    },
    template: `
        <div class="tl-rtc-app-setting-list">
            <div class="tl-rtc-app-left-panel-setting-top-header">
                <div class="tl-rtc-app-left-panel-setting-top-header-title">设置中心</div>
                <div class="tl-rtc-app-left-panel-setting-top-header-tool">
                    <svg class="icon" aria-hidden="true" @click='openQuickOperPanel'>
                        <use xlink:href="#tl-rtc-app-icon-tianjia"></use>
                    </svg>
                </div>
            </div>
            
            <div class="tl-rtc-app-left-panel-setting-top-search">
                <i class="layui-icon layui-icon-search"></i>
                <input type="text" v-model="searchKey" autocomplete="off" placeholder="搜索设置项" class="layui-input" maxlength="30">
                <svg class="icon" aria-hidden="true" @click="searchKey = ''" v-show="searchKey.length > 0"> 
                    <use xlink:href="#tl-rtc-app-icon-cuowu"></use>
                </svg>
            </div>
            <div class="tl-rtc-app-setting-list-item" 
                :class="{'tl-rtc-app-setting-list-item-active': activeSettingType === item.type}"
                v-for="item in propsSettingList" 
                v-show="item.show"
                @click="openSettingItem(item)"
            >

                <div class="tl-rtc-app-left-panel-setting-item-body">
                    <div class="tl-rtc-app-left-panel-setting-item-icon">
                        <svg class="icon" aria-hidden="true">
                            <use :xlink:href="item.svg"></use>
                        </svg>
                    </div>

                    <div class="tl-rtc-app-left-panel-setting-item-name">
                        {{item.name}}
                    </div>
                </div>

                <div class="tl-rtc-app-left-panel-setting-item-desc">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#tl-rtc-app-icon-xiangyou1"></use>
                    </svg>
                </div>
            </div>
        </div>
    `
}

window.tl_rtc_app_module_setting_list = tl_rtc_app_module_setting_list