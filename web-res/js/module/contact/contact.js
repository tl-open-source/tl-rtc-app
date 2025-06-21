const tl_rtc_app_module_contact = {
    props: {
        socket: {
            type: Object,
            default: null
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
        },
        user: {
            type: Object,
            default: {}
        },
    },
    computed: {
        propsSocket(){
            return this.socket;
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
        propsUser(){
            return this.user;
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
    components:{
        'tl_rtc_app_module_contact_top': window.tl_rtc_app_module_contact_top,
        'tl_rtc_app_module_contact_list': window.tl_rtc_app_module_contact_list,
    },
    template: `
        <div class="tl-rtc-app-left-panel">
            <tl_rtc_app_module_contact_top 
                :is-mobile="propsIsMobile"
                :left-module="propsLeftModule"
                :right-module="propsRightModule"
                :socket="propsSocket"
                :user="propsUser"
                @left-module-change="leftModuleChange"
                @right-module-change="rightModuleChange"
                v-cloak> 
            </tl_rtc_app_module_contact_top>

            <tl_rtc_app_module_contact_list
                :left-module="propsLeftModule"
                :right-module="propsRightModule"
                :is-mobile="propsIsMobile"
                :socket="propsSocket"
                :user="propsUser"
                @left-module-change="leftModuleChange"
                @right-module-change="rightModuleChange"
                v-cloak> 
            </tl_rtc_app_module_contact_list>
        </div>
    `
}

window.tl_rtc_app_module_contact = tl_rtc_app_module_contact