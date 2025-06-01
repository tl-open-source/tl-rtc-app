const tl_rtc_app_module_channel = {
    props: {
        socket: {
            type: Object,
            default: null
        },
        company:{
            type: Object,
            default: function(){
                return {
                    name : ''
                }
            }
        },
        user: {
            type: Object,
            default: function(){
                return {
                    userId: '', // 用户id
                    username: '', // 用户名称
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
    computed:{
        propsSocket(){
            return this.socket;
        },
        propsUser(){
            return this.user;
        },
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
    data : function(){
        return {
            
        }
    },
    watch:{
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
    },
    mounted() {
        
    },
    created() {
        
    },
    components:{
        'tl_rtc_app_module_channel_top': window.tl_rtc_app_module_channel_top,
        'tl_rtc_app_module_channel_list': window.tl_rtc_app_module_channel_list,
    },
    template: `
        <div class="tl-rtc-app-left-panel">
            <tl_rtc_app_module_channel_top 
                :company="propsCompany"
                :user="propsUser"
                :socket="propsSocket"
                :is-mobile="propsIsMobile"
                :left-module="propsLeftModule"
                :right-module="propsRightModule"
                @left-module-change="leftModuleChange"
                @right-module-change="rightModuleChange"
                v-cloak> 
            </tl_rtc_app_module_channel_top>

            <tl_rtc_app_module_channel_list
                :user="propsUser"
                :socket="propsSocket"
                :is-mobile="propsIsMobile"
                :left-module="propsLeftModule"
                :right-module="propsRightModule"
                @left-module-change="leftModuleChange"
                @right-module-change="rightModuleChange"
                v-cloak> 
            </tl_rtc_app_module_channel_list>
        </div>
    `
}

window.tl_rtc_app_module_channel = tl_rtc_app_module_channel