const tl_rtc_app_module_sidebar = {
    props: {
        socket: {
            type: Object,
            default: null
        },
        isLogin: {
            type: Boolean,
            default: false
        },
        user: {
            type: Object,
            default: function(){
                return {
                    userId: '', // 用户id
                    username: '', // 用户名称
                    userAvatar: '', // 用户头像
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
        },
        company:{
            type: Object,
            default: function(){
                return {
                    name: ''
                }
            }
        }
    },
    computed:{
        propsSocket(){
            return this.socket;
        },
        propsIsLogin(){
            return this.isLogin;
        },
        propsUser(){
            return this.user;
        },
        propsIsMobile(){
            return this.isMobile;
        },
        propsLeftModule(){
            return this.leftModule;
        },
        propsRightModule(){
            return this.rightModule;
        },
        propsCompany(){
            return this.company;
        }
    },
    watch: {
        user: {
            handler: function(val){
                this.handlerSidebarMenu({})
                this.$forceUpdate()
            },
            deep: true,
            immediate: true
        },
        isMobile: {
            handler: function(val){
                this.handlerSidebarMenu({})
                this.$forceUpdate()
            },
            immediate: true
        },
        mainTools: {
            handler: function(val){
                
            },
            deep: true,
        },
        hiddenTools: {
            handler: function(val){
                
            },
            deep: true,
        }
    },
    data : function(){
        return {
            maxVisibleTools: 20, // 最大可见工具数量
            hiddenTools: [], // 被隐藏的工具
            toolsOriginalState: {}, // 保存工具项的原始显示状态
            showHovertips: false, // 控制hovertips的显示
            mainTools: [
                {
                    svg : '#tl-rtc-app-icon-xiaoxi',
                    title : '消息',
                    active: this.leftModule === 'channel',
                    name: 'channel',
                    unread: 0,
                    show: false,
                    handler: this.handlerChannel
                },
                {
                    svg : '#tl-rtc-app-icon-tongxunlu',
                    title : '通讯录',
                    active: this.leftModule === 'contact',
                    name: 'contact',
                    unread: 0,
                    show: false,
                    handler: this.handlerContact
                },
                {
                    svg : '#tl-rtc-app-icon-shezhi',
                    title : '设置',
                    active: this.leftModule === 'setting',
                    name: 'setting',
                    unread: 0,
                    show: true,
                    handler: this.handlerSetting
                },
                {
                    svg : '#tl-rtc-app-icon-gengduo',
                    title : '更多',
                    active: false,
                    name: 'more',
                    unread: 0,
                    show: false,
                    handler: this.handlerMoreTools,
                    hover: this.handlerMoreTools,
                }
            ],
            subTools : [
                {
                    id: 'sub-tool-about',
                    svg : '#tl-rtc-app-icon-wode-guanyuwomen',
                    title : '关于我们',
                    name: 'about',
                    show: true,
                    handler: this.aboutHandler
                },
                {
                    id: 'sub-tool-logout',
                    svg : '#tl-rtc-app-icon-tuichu',
                    title : '退出登录',
                    name: 'logout',
                    show: false,
                    handler: this.logoutHandler
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
         * 点击消息面板
         */
        handlerChannel: function(){
            this.$emit('left-module-change', 'channel')
        },
        /**
         * 点击通讯录
         */
        handlerContact: function(){
            this.$emit('left-module-change', 'contact')
        },
        /**
         * 点击设置
         */
        handlerSetting: function(){
            this.$emit('left-module-change', 'setting')
        },
        /**
         * 点击更多按钮，显示隐藏的工具
         */
        handlerMoreTools: function(){
            this.showHovertips = true;
        },
        /**
         * 隐藏hovertips
         */
        hideHovertips: function() {
            this.showHovertips = false;
        },
        /**
         * 调整工具可见性
         */
        adjustToolsVisibility: function(){
            const sidebarElement = document.querySelector('.tl-rtc-app-left-sidebar');
            if (!sidebarElement) return;
            
            // 获取可用高度
            const sidebarHeight = sidebarElement.clientHeight;
            const logoHeight = document.querySelector('.tl-rtc-app-left-sidebar-logo').clientHeight || 60;
            const bottomToolsHeight = document.querySelector('.tl-rtc-app-left-sidebar-bottom').clientHeight || 100;
            const toolItemHeight = 60; // 预估每个工具项的高度
            const padding = 40; // 预留一些间距
            
            // 计算可显示的工具数量
            const availableHeight = sidebarHeight - logoHeight - bottomToolsHeight - padding;
            const visibleCount = Math.floor(availableHeight / toolItemHeight);
            const maxVisible = Math.min(visibleCount, this.maxVisibleTools);
            
            // 筛选出应该显示的工具（根据用户设置）
            const toolsShouldBeVisible = this.mainTools.filter(tool => {
                // 保存每个工具的原始显示状态（基于用户设置）
                if (tool.name !== 'more') {
                    this.toolsOriginalState[tool.name] = this.getUserToolSetting(tool.name);
                }
                return this.getUserToolSetting(tool.name) && tool.name !== 'more';
            });
            
            // 如果可见工具多于可显示数量，则需要显示"更多"按钮
            if (toolsShouldBeVisible.length > maxVisible) {
                // 更新显示状态
                this.hiddenTools = [];
                
                // 先重置所有工具的显示状态为其原始设置值
                this.mainTools.forEach(tool => {
                    if (tool.name !== 'more') {
                        tool.show = this.toolsOriginalState[tool.name] || false;
                    } else {
                        tool.show = false; // 默认不显示更多按钮
                    }
                });
                
                // 然后隐藏超出显示范围的工具
                toolsShouldBeVisible.forEach((tool, index) => {
                    const original = this.mainTools.find(t => t.name === tool.name);
                    if (original) {
                        if (index >= maxVisible) {
                            // 超出部分加入隐藏工具列表并设为不可见
                            original.show = false;
                            this.hiddenTools.push(original);
                        }
                    }
                });
                
                // 确保"更多"按钮可见
                const moreButton = this.mainTools.find(t => t.name === 'more');
                if (moreButton) {
                    moreButton.show = true;
                }
            } else {
                // 空间足够，全部恢复为原始设置的显示状态
                this.mainTools.forEach(tool => {
                    if (tool.name !== 'more') {
                        tool.show = this.toolsOriginalState[tool.name] || false;
                    } else {
                        tool.show = false; // 不需要显示更多按钮
                    }
                });
                this.hiddenTools = [];
            }
            
            this.$forceUpdate();
        },
        
        /**
         * 获取用户为工具设置的显示状态
         */
        getUserToolSetting: function(toolName) {
            if (!this.propsUser || !this.propsUser.normalSetting) return false;
            
            switch(toolName) {
                case 'channel':
                    return this.propsUser.normalSetting.sidebarChannelOpen;
                case 'contact':
                    return this.propsUser.normalSetting.sidebarContactOpen;
                case 'setting':
                    return true; // 设置按钮默认显示
                default:
                    return false;
            }
        },
        
        /**
         * 更新未读数量
         * @param {*} name
         * @param {*} unread
         */
        updateUnReadCount: function({
            name, type, count, callback
        }){
            this.mainTools.forEach((tool) => {
                if(tool.name === name){
                    if(type === 'all'){
                        tool.unread = count
                    }
                    if(type === 'add'){
                        tool.unread += count
                    }
                    if(type === 'reduce'){
                        tool.unread -= count
                    }
                }
            })

            callback && callback()
        },
        /**
         * 关于我们
         * @returns
         */
        aboutHandler: function(){
            window.open('/website/index.html', '_blank')
        },
        /**
         * 退出登录
         * @returns 
         */
        logoutHandler: async function(){
            let acceptOrReject = await new Promise(resolve => {
                layer.confirm('确定退出登录', {
                    shadeClose: 1
                }, function (index) {
                    resolve(true)
                    layer.close(index)
                }, function (index) {
                    resolve(false)
                });
            })

            if(!acceptOrReject){
                return
            }

            const { data: logoutRes } = await this.tlRequest({
                url: '/api/web/user-logout/logout',
                method: 'get',
                useCache: false,
            })
            if(!logoutRes.success){
                return
            }
            window.location.reload()
        },
        /**
         * 处理底部/侧边导航栏
         */
        handlerSidebarMenu: function({
            callback
        }){
            let that = this

            if(!this.propsIsLogin){
                this.mainTools = []
            }else{
                // 登录状态下展示退出登录
                this.subTools.forEach(item => {
                    if(item.name === 'logout'){
                        item.show = true
                    }
                })
            }

            // 判断自定义导航栏开关
            this.mainTools.forEach(item => {
                if(item.name === 'channel'){
                    item.show = this.propsUser.normalSetting.sidebarChannelOpen
                }
                if(item.name === 'contact'){
                    item.show = this.propsUser.normalSetting.sidebarContactOpen
                }
                
                // 保存每个工具的原始显示状态（基于用户设置）
                if (item.name !== 'more') {
                    this.toolsOriginalState[item.name] = item.show;
                }
            })
    
            this.mainTools = [...this.mainTools]
        
            callback && callback()
        }
    },
    mounted(){
        let that = this;
        
        this.handlerSidebarMenu({})

        // 注册自定义菜单
        this.emitSubModuleEvent({
            event: 'component-menu-register-custom',
            data: {
                elemId: '.tl-rtc-app-left-sidebar',
                eventList: ['contextmenu', 'press'],
                menuIdList: this.propsIsLogin? [
                    'refresh', 'theme', 'quickPanel', 'logout', 
                ] : [
                    'refresh',
                ],
                extra: {}
            }
        })

        // 监听页面高度变化
        const resizeObserver = new ResizeObserver(entries => {
            if(that.isMobile){
                return
            }
            this.adjustToolsVisibility();
        });
        
        const sidebarElement = document.querySelector('.tl-rtc-app-left-sidebar');
        if (sidebarElement) {
            resizeObserver.observe(sidebarElement);
        }
    },
    created(){
        // 监听未读消息
        window.subModule.$on('sub-module-sidebar-unread-update', this.updateUnReadCount)

        // 退出登录
        window.subModule.$on('sub-module-sidebar-logout', this.logoutHandler)

        // 处理底部/侧边导航栏
        window.subModule.$on('sub-module-sidebar-menu-update', this.handlerSidebarMenu)
    },
    components:{
        'tl_rtc_app_module_sidebar_logo' : window.tl_rtc_app_module_sidebar_logo,
        'tl_rtc_app_module_sidebar_tool' : window.tl_rtc_app_module_sidebar_tool,
        'tl_rtc_app_module_sidebar_bottom': window.tl_rtc_app_module_sidebar_bottom,
        'tl_rtc_app_module_sidebar_hovertips': window.tl_rtc_app_module_sidebar_hovertips,
    },
    template: `
        <div class="tl-rtc-app-left-sidebar" v-if="propsIsLogin || (!propsIsLogin && !propsIsMobile)">
            <tl_rtc_app_module_sidebar_logo
                :is-login="propsIsLogin"
                :user="propsUser"
                :is-mobile="propsIsMobile"
                :company="propsCompany"
                :left-module="propsLeftModule"
                :right-module="propsRightModule"
                :socket="propsSocket"
                @left-module-change="leftModuleChange"
                @right-module-change="rightModuleChange"
            > 
            </tl_rtc_app_module_sidebar_logo>

            <tl_rtc_app_module_sidebar_tool
                :tools="mainTools"
                :user="propsUser"
                :company="propsCompany"
                :is-login="propsIsLogin"
                :is-mobile="propsIsMobile"
                :left-module="propsLeftModule"
                :right-module="propsRightModule"
                :socket="propsSocket"
                @left-module-change="leftModuleChange"
                @right-module-change="rightModuleChange"
            > 
            </tl_rtc_app_module_sidebar_tool>

            <tl_rtc_app_module_sidebar_bottom
                :tools="subTools"
                :company="propsCompany"
                :user="propsUser"
                :is-mobile="propsIsMobile"
                :left-module="propsLeftModule"
                :right-module="propsRightModule"
                :socket="propsSocket"
                @left-module-change="leftModuleChange"
                @right-module-change="rightModuleChange"
            > 
            </tl_rtc_app_module_sidebar_bottom>
            
            <tl_rtc_app_module_sidebar_hovertips
                :tools="hiddenTools"
                :visible="showHovertips"
                :target-element="'#sidebar-pc-tool-more'"
                @hide="hideHovertips"
            >
            </tl_rtc_app_module_sidebar_hovertips>
        </div>
    `
}

window.tl_rtc_app_module_sidebar = tl_rtc_app_module_sidebar