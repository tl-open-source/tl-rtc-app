const tl_rtc_app_module_cut_paste = {
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
        propsLeftModule(){
            return this.leftModule;
        },
        propsRightModule(){
            return this.rightModule;
        }
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
    created() {

    },
    components:{
        'tl_rtc_app_module_cut_paste_top': window.tl_rtc_app_module_cut_paste_top,
        'tl_rtc_app_module_cut_paste_list': window.tl_rtc_app_module_cut_paste_list,
    },
    template: `
        <div class="tl-rtc-app-left-panel">
            <tl_rtc_app_module_cut_paste_top
                :left-module="propsLeftModule"
                :right-module="propsRightModule"
                :company="propsCompany"
                :user="propsUser"
                :socket="propsSocket"
                :is-mobile="propsIsMobile"
                @left-module-change="leftModuleChange"
                @right-module-change="rightModuleChange"
                v-cloak> 
            </tl_rtc_app_module_cut_paste_top>

            <tl_rtc_app_module_cut_paste_list
                :left-module="propsLeftModule"
                :right-module="propsRightModule"
                :user="propsUser"
                :socket="propsSocket"
                :is-mobile="propsIsMobile"
                @left-module-change="leftModuleChange"
                @right-module-change="rightModuleChange"
                v-cloak> 
            </tl_rtc_app_module_cut_paste_list>
        </div>
    `
}

window.tl_rtc_app_module_cut_paste = tl_rtc_app_module_cut_paste