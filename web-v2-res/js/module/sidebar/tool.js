const tl_rtc_app_module_sidebar_tool = {
    props : {
        tools : {
            type : Array,
            default : []
        },
        isLogin: {
            type: Boolean,
            default: false
        },
        isMobile: {
            type: Boolean,
            default: false
        },
        user: {
            type: Object,
            default: function(){
                return {
                    id: '',
                    name: '',
                    avatar: ''
                }
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
    watch: {
        isMobile: {
            handler: function(){
                this.initSwiper()
            },
            immediate: true
        },
        tools: {
            handler: function(val){
                this.initSwiper()
            },
            deep: true,
            immediate: true
        },
        leftModule: function (val) {
            
        },
        rightModule: function (val) {
            
        }
    },
    computed: {
        propsTools(){
            return this.tools;
        },
        propsIsLogin(){
            return this.isLogin;
        },
        propsIsMobile(){
            return this.isMobile;
        },
        propsUser(){
            return this.user;
        },
        openMessageDot(){
            return this.user.messageSetting.messageDot
        },
        showToolCount(){
            return this.propsTools.filter(item => item.show).length
        },
        propsLeftModule() {
            return this.leftModule;
        },
        propsRightModule() {
            return this.rightModule;
        },
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
        },
        mouseEnter: function(event, item){
            if(this.propsIsMobile){
                return
            }
            tl_rtc_app_comm.mouseEnterTips({
                id: event.target.id,
                text: item.title,
                position: 'right'
            });
        },
        mouseLeave: function(){
            if(this.propsIsMobile){
                return
            }
            tl_rtc_app_comm.mouseLeaveTips();
        },
        /**
         * 渲染swiper
         * @returns 
         */
        initSwiper: function(){
            let that = this
            if(!this.propsIsMobile){
                return
            }

            new Swiper('#sidebarToolListMobileSwiper', {
                slidesPerView: that.showToolCount > 4 ? 4 : that.showToolCount,
                direction: 'horizontal',
                loop: false,
                observer: true,
                mousewheel: false, // 鼠标滚轮控制
                forceToAxis: true, // 滚动条只能在一个方向上拖动
                spaceBetween: 0,
                freeMode: {
                    momentumRatio: 1, // 惯性动量比
                    momentumBounceRatio: 0, // 滑动反弹
                    minimumVelocity: 0, // 最小滑动速度
                }
            });
        }
    },
    data : function(){
        return {
            swiper: null
        }
    },
    mounted() {
        this.initSwiper()
    },
    template: `
        <div>
            <div class="tl-rtc-app-left-sidebar-tool swiper" id="sidebarToolListMobileSwiper" v-show="propsIsMobile">
                <div class="swiper-wrapper">
                    <div class="tl-rtc-app-left-sidebar-item swiper-slide" 
                        v-for="tool in propsTools"" 
                        :class="tool.active ? 'tl-rtc-app-left-sidebar-item-hover' : '' "
                        :title="tool.title"
                        @click="activeTool(tool)"
                        v-if="tool.show"
                        :id="'sidebar-mobile-tool-' + tool.name"
                        @mouseenter="mouseEnter(event, tool)"
                        @mouseleave="mouseLeave"
                    >
                        <span class="layui-badge tl-rtc-app-left-sidebar-item-dog" 
                            v-if="propsIsLogin" 
                            v-show="tool.unread > 0 && tool.unread <= 99"
                            :style="{
                                'background': openMessageDot ? '' : '#aeaaaa'
                            }"
                        >
                            {{tool.unread}}
                        </span>
                        <span class="layui-badge tl-rtc-app-left-sidebar-item-dog" 
                            v-if="propsIsLogin" 
                            v-show="tool.unread > 99"
                            :style="{
                                'background': openMessageDot ? '' : '#aeaaaa'
                            }"
                        >
                            {{Math.min(tool.unread, 99)}}+
                        </span>
                        <svg class="icon" aria-hidden="true">
                            <use :xlink:href="tool.svg"></use>
                        </svg>
                        <div style="margin-top: 5px;">{{tool.title}}</div>
                    </div>
                </div>
            </div>

            <div class="tl-rtc-app-left-sidebar-tool" v-show="!propsIsMobile">
                <div class="tl-rtc-app-left-sidebar-item" 
                    v-for="tool in propsTools"" 
                    :class="tool.active ? 'tl-rtc-app-left-sidebar-item-hover' : '' "
                    :title="tool.title"
                    @click="activeTool(tool)"
                    v-show="tool.show"
                    :id="'sidebar-pc-tool-' + tool.name"
                    @mouseenter="mouseEnter(event, tool)"
                    @mouseleave="mouseLeave"
                >
                    <span class="layui-badge tl-rtc-app-left-sidebar-item-dog" 
                        v-if="propsIsLogin" 
                        v-show="tool.unread > 0 && tool.unread <= 99"
                        :style="{
                            'background': openMessageDot ? '' : '#aeaaaa'
                        }"
                    >
                        {{tool.unread}}
                    </span>
                    <span class="layui-badge tl-rtc-app-left-sidebar-item-dog" 
                        v-if="propsIsLogin" 
                        v-show="tool.unread > 99"
                        :style="{
                            'background': openMessageDot ? '' : '#aeaaaa'
                        }"
                    >
                        {{Math.min(tool.unread, 99)}}+
                    </span>
                    <svg class="icon" aria-hidden="true">
                        <use :xlink:href="tool.svg"></use>
                    </svg>
                </div>
            </div>
        </div>
    `,
}

window.tl_rtc_app_module_sidebar_tool = tl_rtc_app_module_sidebar_tool