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
        }
    },
    data : function(){
        return {
            mainTools: [
                {
                    svg : '#tl-rtc-app-icon-xiaoxi',
                    title : '消息',
                    active: this.leftModule === 'channel',
                    name: 'channel',
                    unread: 0,
                    show: true,
                    handler: this.handlerChannel
                },
                {
                    svg : '#tl-rtc-app-icon-tongxunlu',
                    title : '通讯录',
                    active: this.leftModule === 'contact',
                    name: 'contact',
                    unread: 0,
                    show: true,
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
                }
            ],
            subTools : [
                {
                    svg : '#tl-rtc-app-icon-wode-guanyuwomen',
                    title : '关于我们',
                    name: 'about',
                    show: true,
                    handler: this.aboutHandler
                },
                {
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
            window.open('https://app.iamtsm.cn/website.html', '_blank')
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
                    'refresh', 'switchAccount', 'theme', 'personal',
                    'quickPanel', 'switchAccount', 'setting', 'logout', 
                ] : [
                    'refresh',
                ],
                extra: {}
            }
        })
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
        </div>
    `
}

window.tl_rtc_app_module_sidebar = tl_rtc_app_module_sidebar