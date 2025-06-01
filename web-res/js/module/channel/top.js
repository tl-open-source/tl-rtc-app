const tl_rtc_app_module_channel_top = {
    props: {
        company: {
            type: Object,
            default: function () {
                return {
                    name: ""
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
        propsCompany() {
            return this.company;
        },
        propsIsMobile() {
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
        searchKey: {
            deep: true,
            immediate: true,
            handler: function (cur, pre) {
                this.emitSubModuleEvent({
                    event: 'sub-module-channel-list-search-key-update',
                    data: {
                        key: cur
                    }
                })
            }
        },
        tagList: {
            deep: true,
            immediate: true,
            handler: function (cur, pre) {
                if (cur.length === 0) {
                    const { leftChannelTop } = window.tl_rtc_app_comm.getPropertyValues([
                        { key: "leftChannelTop", value: "left-channel-top" }
                    ])
                    // 30px为标签列表高度
                    let newLeftChannelTop = parseInt(leftChannelTop.replace("px", "")) - 30
                    document.documentElement.style.setProperty('--left-channel-top', newLeftChannelTop + "px")
                }
            }
        },
        leftModule: function (val) {

        },
        rightModule: function (val) {

        }
    },
    data: function () {
        return {
            searchKey: '', // 搜索关键字
            chooseTag: 1, // 默认选择 '全部' 标签
            tagList: [{
                id: 1,
                system: true,
                name: '全部',
            }, {
                id: 3,
                system: true,
                name: '未读'
            }, {
                id: 4,
                system: true,
                name: '置顶'
            }, {
                id: 5,
                system: true,
                name: '拉黑'
            }, {
                id: 6,
                system: true,
                name: '群聊'
            }, {
                id: 7,
                system: true,
                name: '单聊'
            }]
        }
    },
    methods: {
        /**
         *  事件触发，向上传递
         * @param {*} event 
         */
        leftModuleChange: function (event) {
            this.$emit('left-module-change', event)
        },
        /**
         * 事件触发，向上传递
         * @param {*} event 
         */
        rightModuleChange: function (event) {
            this.$emit('right-module-change', event)
        },
        /**
         * 创建频道
         */
        createChannel: function ({
            callback
        }) {
            let that = this
            layer.prompt({
                formType: 0,
                title: "发起新的群聊",
                btn: ['确定', '取消'],
                value: "",
                shadeClose: true,
                maxlength: 15,
            }, async function (value, index, elem) {
                value = value.trim()
                if (value.length === 0) {
                    layer.msg("请输入频道名称", { offset: 't' });
                    return false;
                }

                const params = {
                    channelName: value
                }
                if (!window.tl_rtc_app_comm.checkRequestParams(params)) {
                    that.popErrorMsg("请求参数非法")
                    return
                }
                const { data: channelRes } = await that.tlRequest({
                    url: '/api/web/channel/add-channel',
                    method: 'post',
                    useCache: false,
                    data: params,
                })
                if (channelRes.success) {
                    that.popSuccessMsg(channelRes.msg)
                } else {
                    that.popErrorMsg(channelRes.msg)
                }

                layer.close(index)

                await that.emitSubModuleEvent({
                    event: 'sub-module-channel-list-init'
                })

                return false
            });

            callback && callback(true)
        },
        /**
         * 首次快速创建频道
         */
        quickCreateChannel: async function ({
            channelName, callback
        }) {
            const params = {
                channelName: channelName
            }
            if (!window.tl_rtc_app_comm.checkRequestParams(params)) {
                this.popErrorMsg("请求参数非法")
                callback && callback(false)
                return
            }
            const { data: channelRes } = await this.tlRequest({
                url: '/api/web/channel/add-channel',
                method: 'post',
                useCache: false,
                data: params,
            })
            if (channelRes.success) {
                this.popSuccessMsg(channelRes.msg)
            } else {
                this.popErrorMsg(channelRes.msg)
            }

            await this.emitSubModuleEvent({
                event: 'sub-module-channel-list-init'
            })

            callback && callback(true)
        },
        /**
         * 打开快速操作面板
         */
        openQuickOperPanel: function () {
            this.emitSubModuleEvent({
                event: 'component-popup-add-quick-oper-panel',
            })
        },
        /**
         * 选择标签
         * @param {*} tag 
         */
        selectTag: async function (tag) {
            this.chooseTag = tag.id
            await this.emitSubModuleEvent({
                event: 'sub-module-channel-list-filter-tag',
                data: {
                    tag
                }
            })
        },
        /**
         * 获取频道标签列表
         */
        getChannelTagList: async function () {
            const { data: tagRes } = await this.tlRequest({
                url: '/api/web/user-tag/get-channel-tag-list',
                method: 'get',
                useCache: true,
                cacheTime: 10 * 1000
            })
            if (!tagRes.success) {
                this.popErrorMsg(tagRes.msg)
                return
            }

            if (tagRes.data.length > 0) {
                this.tagList = this.tagList.concat(tagRes.data)
            }
        },
        /**
         * 初始化swiper
         */
        initSwiper: function () {
            new Swiper('#channelTagSwiper', {
                slidesPerView: 5,
                direction: 'horizontal',
                loop: false,
                observer: true,
                mousewheel: true, // 鼠标滚轮控制
                forceToAxis: true, // 滚动条只能在一个方向上拖动
                spaceBetween: 5,
                freeMode: {
                    momentumRatio: 1, // 惯性动量比
                    momentumBounceRatio: 0, // 滑动反弹
                    minimumVelocity: 0, // 最小滑动速度
                }
            });
        }
    },
    mounted: async function () {
        let that = this

        await this.getChannelTagList()

        this.initSwiper()

        window.addEventListener('resize', window.tl_rtc_app_comm.throttle(function () {
            that.initSwiper()
        }, 100), true)
    },
    created() {
        // 监听快速频道创建事件
        window.subModule.$on('sub-module-channel-top-quick-create-channel', this.quickCreateChannel)

        // 监听自定义频道创建事件
        window.subModule.$on('sub-module-channel-top-create-custom-channel', this.createChannel)
    },
    template: `
        <div class="tl-rtc-app-left-panel-channel-top">
            <div class="tl-rtc-app-left-panel-channel-top-header">
                <div class="tl-rtc-app-left-panel-channel-top-header-title">
                    {{propsCompany.name}}
                </div>
                <div class="tl-rtc-app-left-panel-channel-top-header-tool">
                    <svg class="icon" aria-hidden="true" @click="openQuickOperPanel">
                        <use xlink:href="#tl-rtc-app-icon-tianjia"></use>
                    </svg>
                </div>
            </div>
            <div class="tl-rtc-app-left-panel-channel-top-search">
                <i class="layui-icon layui-icon-search"></i>
                <input type="text" v-model="searchKey" autocomplete="off" placeholder="搜索聊天/消息" class="layui-input" maxlength="30">

                <svg class="icon" aria-hidden="true" @click="searchKey = ''" v-show="searchKey.length > 0"> 
                    <use xlink:href="#tl-rtc-app-icon-cuowu"></use>
                </svg>
            </div>

            <div class="tl-rtc-app-left-panel-channel-top-tag swiper" id="channelTagSwiper" v-show="tagList.length > 0">
                <div class="tl-rtc-app-left-panel-channel-top-tag-list swiper-wrapper">
                    <span class="swiper-slide" :class="{'tag-active': chooseTag === tag.id}"
                        v-for="tag in tagList" @click="selectTag(tag)" 
                    >
                        {{tag.name}}
                    </span>
                </div>
            </div>
        </div>
    `,
}

window.tl_rtc_app_module_channel_top = tl_rtc_app_module_channel_top