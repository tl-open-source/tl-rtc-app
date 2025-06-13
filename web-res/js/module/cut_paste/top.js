const tl_rtc_app_module_cut_paste_top = {
    props : {
        company : {
            type : Object,
            default : function(){
                return {
                    name : ""
                }
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
        propsCompany(){
            return this.company;
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
        searchKey : {
            deep: true,
            immediate: true,
            handler: function(cur, pre){
                this.emitSubModuleEvent({
                    event: 'sub-module-cut-paste-search-key-update',
                    data: {
                        key: cur
                    }
                })
            }
        },
        leftModule: function (val) {
            
        },
        rightModule: function (val) {
            
        }
    },
    data : function(){
        return {
            searchKey: '', // 搜索关键字
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
         * 打开快速操作面板
         */
        openQuickOperPanel: function(){
            this.emitSubModuleEvent({
                event: 'component-popup-add-quick-oper-panel',
            })
        }
    },
    mounted() {
        
    },
    template: `
        <div class="tl-rtc-app-left-panel-cut-paste-top">
            <div class="tl-rtc-app-left-panel-cut-paste-top-header">
                <div class="tl-rtc-app-left-panel-cut-paste-top-header-title">
                    共享剪贴板
                </div>
                <div class="tl-rtc-app-left-panel-cut-paste-top-header-tool">
                    <svg class="icon" aria-hidden="true" @click="openQuickOperPanel">
                        <use xlink:href="#tl-rtc-app-icon-tianjia"></use>
                    </svg>
                </div>
            </div>
            <div class="tl-rtc-app-left-panel-cut-paste-top-search">
                <i class="layui-icon layui-icon-search"></i>
                <input type="text" v-model="searchKey" autocomplete="off" placeholder="搜索剪贴板" class="layui-input" maxlength="30">
                <svg class="icon" aria-hidden="true" @click="searchKey = ''" v-show="searchKey.length > 0"> 
                    <use xlink:href="#tl-rtc-app-icon-cuowu"></use>
                </svg>
            </div>
        </div>
    `,
}

window.tl_rtc_app_module_cut_paste_top = tl_rtc_app_module_cut_paste_top