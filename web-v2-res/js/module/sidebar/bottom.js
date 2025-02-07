const tl_rtc_app_module_sidebar_bottom = {
    props : {
        tools : {
            type : Array,
            default : []
        },
        isMobile:{
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
        propsTools(){
            return this.tools;
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
         * 点击工具栏
         * @param {*} tool 
         */
        activeTool : function(tool){
            this.tools.map(item => {
                item.active = false;
            })

            tool.active = true;
            
            tool.handler && tool.handler.call(this)
        }
    },
    data : function(){
        return {
            
        }
    },
    template: `
        <div class="tl-rtc-app-left-sidebar-bottom">
            <div class="tl-rtc-app-left-sidebar-item"
                v-for="tool in propsTools"" 
                :title="tool.title"
                v-show="tool.show"
                @click="activeTool(tool)"
            >
                <svg class="icon" aria-hidden="true">
                    <use :xlink:href="tool.svg"></use>
                </svg>
            </div>
        </div>
    `,
}

window.tl_rtc_app_module_sidebar_bottom = tl_rtc_app_module_sidebar_bottom