const tl_rtc_app_module_setting = {
    props: {
        socket: {
            type: Object,
            default: null
        },
        isMobile: {
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
        isMobile: {
            handler: function(val){
                this.handlerSettingList()
                this.$forceUpdate()
            },
            immediate: true
        },
        leftModule: function (val) {
            
        },
        rightModule: function (val) {
            
        }
    },
    data : function(){
        return {
            settingList: [
                {
                    name : '通用设置',
                    svg: '#tl-rtc-app-icon-caidan',
                    type : 'normal',
                    show : true,
                    handler: function(){
                        this.$emit('right-module-change', 'content')
                    }
                },
                {
                    name : '帐号设置',
                    svg: '#tl-rtc-app-icon-zhanghao',
                    type : 'account',
                    show : true,
                    handler: function(){
                        this.$emit('right-module-change', 'content')
                    }
                },
                {
                    name : '消息设置',
                    svg: '#tl-rtc-app-icon-xiaoxi1',
                    type : 'message',
                    show : true,
                    handler: function(){
                        this.$emit('right-module-change', 'content')
                    }
                },
                {
                    name : '皮肤设置',
                    svg: '#tl-rtc-app-icon-pifu',
                    type : 'skin',
                    show : true,
                    handler: function(){
                        this.$emit('right-module-change', 'content')
                    }
                },
                {
                    name : '其他设置',
                    svg: '#tl-rtc-app-icon-qita',
                    type : 'other',
                    show : true,
                    handler: function(){
                        this.$emit('right-module-change', 'content')
                    }
                },
                {
                    name : '退出登录',
                    svg: '#tl-rtc-app-icon-tuichu',
                    type : 'logout',
                    show : false,
                    handler: function(){
                        this.emitSubModuleEvent({
                            event: 'sub-module-sidebar-logout',
                        })
                    }
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
         * 处理设置列表
         */
        handlerSettingList: function(){
            if (this.propsIsMobile){
                this.settingList.forEach(item => {
                    if (item.type == 'logout'){
                        item.show = true
                    }
                });
            }else{
                this.settingList.forEach(item => {
                    if (item.type == 'logout'){
                        item.show = false
                    }
                });
            }
        }
    },
    mounted() {
        this.handlerSettingList()
    },
    components:{
        'tl_rtc_app_module_setting_list': window.tl_rtc_app_module_setting_list,
    },
    template: `
        <div class="tl-rtc-app-left-panel">
            <tl_rtc_app_module_setting_list
                :socket="propsSocket"
                :is-mobile="propsIsMobile"
                :setting-list="settingList"
                :left-module="propsLeftModule"
                :right-module="propsRightModule"
                @left-module-change="leftModuleChange"
                @right-module-change="rightModuleChange"
            >
            </tl_rtc_app_module_setting_list>
        </div>
    `
}

window.tl_rtc_app_module_setting = tl_rtc_app_module_setting