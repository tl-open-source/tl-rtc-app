const tl_rtc_app_module_cut_paste_list = {
    props : {
        user: {
            type: Object,
            default: null
        },
        socket: {
            type: Object,
            default: null
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
    data : function(){
        return {
            // 搜索关键字
            searchKey : '',
            // 剪贴板列表
            cutPasteList: [],
            // 当前显示的剪贴板
            showCutPasteId: -1,
        }
    },
    computed: {
        propsUser(){
            return this.user;
        },
        propsSocket(){
            return this.socket;
        },
        propsIsMobile(){
            return this.isMobile;
        },
        filterCutPasteList(){
            let that = this
            if(this.searchKey.length === 0){
                return this.cutPasteList
            }
            const list = this.cutPasteList.filter(item => {
                return item.title.indexOf(that.searchKey) !== -1
            })
            
            return list
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
            
        },
        cutPasteList: {
            handler: function (val) {
                
            },
            deep: true,
            immediate: true
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
         * 创建一个共享剪贴板
         */
        createCutPaste: async function(){
            let that = this
            layer.prompt({
                formType: 0,
                title: "输入新建剪贴板名称",
                btn : ['确定', '取消'],
                value: "",
                shadeClose : true,
                skin: 'layui-layer-prompt tl-rtc-app-layer-cut-paste-create',
                maxlength : 15,
            }, async function (value, index, elem) {
                value = value.trim()
                if(value.length === 0){
                    layer.msg("请输入剪贴板名称",{offset: 't'});
                    return false;
                }

                const params = {
                    title: value,
                    password: ''
                }
                if(!window.tl_rtc_app_comm.checkRequestParams(params)){
                    that.popErrorMsg("请求参数非法")
                    return
                }
                const { data: cutPasteRes } = await that.tlRequest({
                    url: '/api/web/cut-paste/add-cut-paste',
                    method: 'post',
                    useCache: false,
                    data: params,
                    
                })
                if(!cutPasteRes.success){
                    that.popErrorMsg(cutPasteRes.msg)
                    layer.close(index)
                    return
                }
    
                that.popSuccessMsg(cutPasteRes.msg)

                layer.close(index)

                // 获取剪贴板列表
                await that.getCutPasteList()

                return false
            });
        },
        /**
         * 打开剪贴板详情
         * @param {*} item 
         */
        openCutPasteDetail: async function(item){
            let that = this

            this.$emit('left-module-change', 'cut_paste')
            this.$emit('right-module-change', 'content')
            
            // 点击切换频道
            if(item.id !== this.showCutPasteId){
                this.emitSubModuleEvent({
                    event: 'sub-module-cut-paste-content-open',
                    data: {
                        title: item.title,
                        cutPasteId: item.id,
                        code: item.code,
                        status: item.status,
                    }
                })
            }

            // 打开右侧模块 - 处理移动端情况
            this.emitSubModuleEvent({
                event: 'sub-module-core-change-module-show',
                data: {
                    showRightModule: true,
                }
            })
        },
        /**
         * 获取剪贴板列表
         */
        getCutPasteList: async function(){
            let that = this
            const { data: cutPasteRes } = await this.tlRequest({
                url: '/api/web/cut-paste/get-cut-paste-list',
                method: 'get',
                useCache: true,
                cacheTime: 10 * 1000
            })

            if(!cutPasteRes.success){
                this.popErrorMsg(cutPasteRes.msg)
                return
            }

            // 处理时间
            cutPasteRes.data.forEach(item => {
                item.createTimeFormat = window.util.timeAgo(item.createTime)
            })

            this.cutPasteList = cutPasteRes.data
        },
        /**
         * 初始化swiper
         */
        initSwiper: function(){
            const { bodyHeight } = window.tl_rtc_app_comm.getPropertyValues([
                { key: "bodyHeight", value: "body-height" }
            ])

            // 计算编辑器的高度
            let height = (
                Number(bodyHeight.replace("%", "")) * (
                    window.innerHeight * Number(bodyHeight.replace("%", "")) / 100
                ) / 100 - 120
            )

            let slidesPerView = parseInt(height / 84)
            if(height < 500){
                slidesPerView = parseInt(height / 70)
            }

            // 初始化共享剪贴板列表swiper
            new Swiper('#cutPasteListSwiper', {
                slidesPerView: slidesPerView,
                direction: 'vertical',
                loop: false,
                observer: true,
                mousewheel: true, // 鼠标滚轮控制
                forceToAxis: true, // 滚动条只能在一个方向上拖动
                spaceBetween: 1,
                freeMode: {
                    momentumRatio: 1, // 惯性动量比
                    momentumBounceRatio: 0, // 滑动反弹
                    minimumVelocity: 0, // 最小滑动速度
                }
            });
        },
        /**
         * 用户搜索名称变更
         * @param {*} key
         */
        searchKeyUpdate: function({
            key, callback
        }){
            this.searchKey = key

            callback && callback()
        }
    },
    mounted: async function() {
        let that = this

        // 获取剪贴板列表
        await this.getCutPasteList()

        // 初始化swiper
        this.initSwiper()
    },
    created(){
        // 监听搜索用户名称
        window.subModule.$on('sub-module-cut-paste-search-key-update', this.searchKeyUpdate)
    },
    template: `
        <div class="tl-rtc-app-left-panel-cut-paste">
            <div class="tl-rtc-app-left-panel-no-cut-paste" v-if="searchKey.length !== 0 && filterCutPasteList.length === 0">
                未找到相关共享剪贴板
            </div>
            <div style="padding: 20px;" v-if="searchKey.length === 0">
                <div class="tl-rtc-app-left-panel-no-cut-paste">
                    创建一个共享剪贴板
                </div>
                <div class="tl-rtc-app-left-panel-no-cut-paste">
                    <button class="layui-btn layui-btn-primary" @click="createCutPaste()">快速创建</button>
                </div>
            </div>
            <div class="swiper" id="cutPasteListSwiper"> 
                <div class="swiper-wrapper">
                    <div class="tl-rtc-app-left-panel-cut-paste-item swiper-slide"
                        :class="{
                            'tl-rtc-app-left-panel-cut-paste-item-active' : showCutPasteId === item.id,
                        }"
                        v-for="item in filterCutPasteList"
                        :id="'cut-paste-item-' + item.id"
                        @click="openCutPasteDetail(item)"
                    >

                        <div class="tl-rtc-app-left-panel-cut-paste-item-img">
                            <img src="/image/default-avatar.png" alt="">
                        </div>
                        <div class="tl-rtc-app-left-panel-cut-paste-item-content">
                            <div class="tl-rtc-app-left-panel-cut-paste-item-content-nickname">
                                {{item.title}}
                            </div>
                            <div class="tl-rtc-app-left-panel-cut-paste-item-content-message" >
                                <div class="tl-rtc-app-left-panel-cut-paste-item-content-message-file">
                                    <svg class="icon" aria-hidden="true">
                                        <use xlink:href="#tl-rtc-app-icon-shengboyuyinxiaoxi"></use>
                                    </svg>
                                    <div class="tl-rtc-app-left-panel-cut-paste-item-content-message-file-info">
                                        <span style="font-size: 12px;">
                                            剪贴板共{{item.detailCount}}条记录
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="tl-rtc-app-left-panel-cut-paste-item-other" v-show="false">
                            <div class="tl-rtc-app-left-panel-cut-paste-item-other-time">
                                
                            </div>
                            <div class="tl-rtc-app-left-panel-cut-paste-item-other-unread">
                                <div class="layui-badge" style="padding-left: 1px;">
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
}

window.tl_rtc_app_module_cut_paste_list = tl_rtc_app_module_cut_paste_list