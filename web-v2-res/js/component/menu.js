const tl_rtc_app_menu = new Vue({
    el: '#tl-rtc-app-menu',
    data: function () {
        return {
            menuList: [],
            registerList: [],
            isMobile: window.tl_rtc_app_comm.isMobile()
        }
    },
    methods: {
        /**
         * 刷新页面
         */
        addRefreshMenu: function () {
            let that = this
            this.menuList.push({
                id: "refresh",
                title: `
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#tl-rtc-app-icon-chulizhong"></use>
                    </svg>
                    <span>刷新页面</span>
                `,
                handler: function(data){
                    window.location.reload();
                }
            })
        },  
        /**
         * 添加快捷面板菜单
         */
        addQuickPanelMenu: function () {
            let that = this
            this.menuList.push({
                id: 'quickPanel',
                title: `
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#tl-rtc-app-icon-caidan"></use>
                    </svg>
                    <span>快捷面板</span>
                `,
                handler: function(data){
                    that.emitSubModuleEvent({
                        event: 'component-popup-add-quick-oper-panel',
                    })
                }
            })
        },
        /**
         * 添加个人中心菜单
         */
        addPersonalMenu: function () {
            let that = this
            // this.menuList.push({
            //     id: 'personal',
            //     title: `
            //         <svg class="icon" aria-hidden="true">
            //             <use xlink:href="#tl-rtc-app-icon-gerenzhongxin"></use>
            //         </svg>
            //         <span>个人中心</span>
            //     `,
            //     handler: function(data){
            //         that.popWarningMsg('暂未开放')
            //     }
            // })
        },
        /**
         * 添加主题菜单
         */
        addThemeMenu: function () {
            let that = this
            this.menuList.push({
                id: 'theme',
                title: `
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#tl-rtc-app-icon-gensuixitong-followsystem-line"></use>
                    </svg>
                    <span>切换主题</span>
                `,
                handler: function(data){
                    that.emitSubModuleEvent({
                        event: 'sub-module-setting-skin-change-global',
                    })
                }
            })
        },
        /**
         * 添加设置菜单
         */
        addSettingMenu: function () {
            let that = this
            // this.menuList.push({
            //     id: 'setting',
            //     title: `
            //         <svg class="icon" aria-hidden="true">
            //             <use xlink:href="#tl-rtc-app-icon-shezhi"></use>
            //         </svg>
            //         <span>更多设置</span>
            //     `,
            //     handler: function(data){
            //         that.popWarningMsg('暂未开放')
            //     }
            // })
        },
        /**
         * 添加退出频道菜单
         */
        addExitChannelMenu: function () {
            let that = this
            this.menuList.push({
                id: 'exitChannel',
                title: `
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#tl-rtc-app-icon-guanbi"></use>
                    </svg>
                    <span style="color: #f00;">退出聊天</span>
                `,
                handler: function(data){
                    let channelId = data.extra.channelId
                    console.log('退出 : ', channelId)
                    that.emitSubModuleEvent({
                        event: 'sub-module-channel-content-exit-group-channel-quick',
                        data: {
                            channelId: channelId
                        }
                    })
                }
            })
        },
        /**
         * 添加删除好友菜单
         */
        addDeleteFriendMenu: function () {
            let that = this
            this.menuList.push({
                id: 'deleteFriend',
                title: `
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#tl-rtc-app-icon-guanbi"></use>
                    </svg>
                    <span style="color: #f00;">删除好友</span>
                `,
                handler: function(data){
                    let channelId = data.extra.channelId
                    console.log('删除好友 : ', channelId)
                    that.emitSubModuleEvent({
                        event: 'sub-module-channel-content-delete-friend-quick',
                        data: {
                            channelId: channelId
                        }
                    })
                }
            })
        },
        /**
        * 添加置顶频道菜单
        */
        addTopChannelMenu: function () {
            let that = this
            this.menuList.push({
                id: 'topChannel',
                title: `
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#tl-rtc-app-icon-zhiding1"></use>
                    </svg>
                    <span>置顶聊天</span>
                `,
                handler: function(data){
                    let channelId = data.extra.channelId
                    console.log('置顶 : ', channelId)
                    that.emitSubModuleEvent({
                        event: 'sub-module-channel-content-update-channel-top-quick',
                        data: {
                            channelId: channelId,
                            channelTop: true
                        }
                    })
                }
            })
        },
        /**
        * 添加取消置顶频道菜单
        */
        addUnTopChannelMenu: function () {
            let that = this
            this.menuList.push({
                id: 'unTopChannel',
                title: `
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#tl-rtc-app-icon-zhiding1"></use>
                    </svg>
                    <span>取消置顶聊天</span>
                `,
                handler: function(data){
                    let channelId = data.extra.channelId
                    console.log('取消置顶 : ', channelId)
                    that.emitSubModuleEvent({
                        event: 'sub-module-channel-content-update-channel-top-quick',
                        data: {
                            channelId: channelId,
                            channelTop: false
                        }
                    })
                }
            })
        },
        /**
        * 添加消息免打扰菜单
        */
        addHiddenNotifyMenu: function () {
            let that = this
            // this.menuList.push({
            //     id: 'hiddenNotify',
            //     title: `
            //         <svg class="icon" aria-hidden="true">
            //             <use xlink:href="#tl-rtc-app-icon-miandarao"></use>
            //         </svg>
            //         <span>消息免打扰</span>
            //     `,
            //     handler: function(data){
            //         let channelId = data.extra.channelId
            //         console.log('消息免打扰 : ', channelId)
            //         that.popWarningMsg('暂未开放')
            //     }
            // })
        },
        /**
        * 添加邀请好友菜单
        */
        addInviteFriendMenu: function () {
            let that = this
            this.menuList.push({
                id: 'inviteFriend',
                title: `
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#tl-rtc-app-icon-yaoqing"></use>
                    </svg>
                    <span>邀请好友</span>
                `,
                handler: function(data){
                    let channelId = data.extra.channelId
                    console.log('邀请好友 : ', channelId)
                    that.emitSubModuleEvent({
                        event: 'sub-module-channel-content-invite-user-quick',
                        data: {
                            channelId: channelId,
                        }
                    })
                }
            })
        },
        /**
        * 添加复制频道号菜单
        */
        addCopyChannelIdMenu: function () {
            let that = this
            this.menuList.push({
                id: 'copyChannelId',
                title: `
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#tl-rtc-app-icon-fuzhi"></use>
                    </svg>
                    <span>复制聊天号</span>
                `,
                ready: function(data){
                    let channelId = data.extra.channelId
                    let clipboard = window.tl_rtc_app_comm.copyTxt('copyChannelId', channelId, function(){
                        that.popSuccessMsg('复制成功')
                    }, [
                        'dropdownShade'
                    ])

                    return clipboard
                },
            })
        },
        /**
        * 添加标记未读菜单
        */
        addMarkUnreadMenu: function () {
            let that = this
            // this.menuList.push({
            //     id: 'markUnread',
            //     title: `
            //         <svg class="icon" aria-hidden="true">
            //             <use xlink:href="#tl-rtc-app-icon-biaoji-"></use>
            //         </svg>
            //         <span>标记未读</span>
            //     `,
            //     handler: function(data){
            //         let channelId = data.extra.channelId
            //         console.log('标记未读 : ', channelId)
            //         that.popWarningMsg('暂未开放')
            //     }
            // })
        },
        /**
        * 添加不显示频道菜单
        */
        addHiddenChannel: function () {
            let that = this
            // this.menuList.push({
            //     id: 'hiddenChannel',
            //     title: `
            //         <svg class="icon" aria-hidden="true">
            //             <use xlink:href="#tl-rtc-app-icon-yichu"></use>
            //         </svg>
            //         <span>不显示聊天</span>
            //     `,
            //     handler: function(data){
            //         that.popWarningMsg('暂未开放')
            //     }
            // })
        },
        /**
        * 添加清除历史记录菜单
        */
        addClearHistoryMenu: function () {
            let that = this
            this.menuList.push({
                id: 'clearHistory',
                title: `
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#tl-rtc-app-icon-clear"></use>
                    </svg>
                    <span>清除聊天记录</span>
                `,
                handler: function(data){
                    let channelId = data.extra.channelId
                    that.emitSubModuleEvent({
                        event: 'sub-module-channel-list-clear-channel-message',
                        data: {
                            channelId: channelId
                        }
                    })
                }
            })
        },
        /**
        * 添加回复消息菜单
        */
        addReplyMessageMenu: function () {
            let that = this
            this.menuList.push({
                id: 'replyMessage',
                title: `
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#tl-rtc-app-icon-xiaoxi"></use>
                    </svg>
                    <span>回复消息</span>
                `,
                handler: function(data){
                    let messageId = data.extra.id
                    that.emitSubModuleEvent({
                        event: 'sub-module-channel-content-quick-reply-message',
                        data: {
                            messageId: messageId,
                            messageType: data.extra.type,
                            messageContent: data.extra.message,
                        }
                    })
                }
            })
        },
        /**
        * 添加删除消息菜单
        */
        addDeleteMessageMenu: function () {
            let that = this
            this.menuList.push({
                id: 'deleteMessage',
                title: `
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#tl-rtc-app-icon-clear"></use>
                    </svg>
                    <span style="color: #f00;">删除消息</span>
                `,
                handler: function(data){
                    let messageId = data.extra.id
                    console.log('删除 : ', messageId)
                    that.popWarningMsg('暂未开放')
                }
            })
        },
        /**
        * 添加撤回消息菜单
        */
        addRollbackMessageMenu: function () {
            let that = this
            this.menuList.push({
                id: 'rollbackMessage',
                title: `
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#tl-rtc-app-icon-huifu"></use>
                    </svg>
                    <span>撤回消息</span>
                `,
                handler: function(data){
                    let messageId = data.extra.id
                    let messageType = data.extra.type
                    that.emitSubModuleEvent({
                        event: 'sub-module-channel-content-quick-rollback-message',
                        data: {
                            messageId: messageId,
                            messageType: messageType,
                        }
                    })
                }
            })
        },
        /**
        * 添加复制消息菜单
        */
        addCopyMessageMenu: function () {
            let that = this
            this.menuList.push({
                id: 'copyMessage',
                title: `
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#tl-rtc-app-icon-fuzhi"></use>
                    </svg>
                    <span>复制消息</span>
                `,
                ready: function(data){
                    let message = data.extra.message
                    let clipboard = window.tl_rtc_app_comm.copyTxt('copyMessage', message, function(){
                        that.popSuccessMsg('复制成功')
                    }, [
                        'dropdownShade'
                    ])

                    return clipboard
                },
                handler: function(data){
                    
                }
            })
        },
        /**
        * 添加切换帐号菜单
        */
        addSwitchAccountMenu: function () {
            let that = this
            // this.menuList.push({
            //     id: 'switchAccount',
            //     title: `
            //         <svg class="icon" aria-hidden="true">
            //             <use xlink:href="#tl-rtc-app-icon-navbar_guanzhong"></use>
            //         </svg>
            //         <span>切换帐号</span>
            //     `,
            //     handler: function(data){
            //         that.popWarningMsg('暂未开放')
            //     },
            //    child: [{
            //        id: '帐号1',
            //        title: `
            //            <svg class="icon" aria-hidden="true">
            //                <use xlink:href="#tl-rtc-app-icon-qita"></use>
            //            </svg>
            //            <span>帐号1</span>
            //        `,
            //        handler: function(){
            //            that.popWarningMsg('暂未开放')
            //        }
            //    }]
            // })
        },
        /**
        * 添加退出帐号菜单
        */
        addLogoutMenu: function () {
            let that = this
            this.menuList.push({
                id: "logout",
                title: `
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#tl-rtc-app-icon-tuichu"></use>
                    </svg>
                    <span style="color: #f00;">退出帐号</span>
                `,
                handler: async function(data){
                    let isLogin = await that.emitSubModuleEvent({
                        event: 'sub-module-core-is-login'
                    })

                    if(!isLogin){
                        that.popWarningMsg('请先登录')
                        return
                    }

                    that.emitSubModuleEvent({
                        event: 'sub-module-sidebar-logout',
                    })
                }
            })
        },
        /**
         * 初始化菜单
         * @param {*} elemId
         * @param {*} className
         * @param {*} show
         * @param {*} align
         * @param {*} menuDataInfo
         * @param {*} trigger
         * @returns
         */
        initMenu: function ({elemId, className, show, align, trigger, menuDataInfo}) {
            let that = this

            window.dropdown.render({
                elem: elemId,
                trigger: trigger,
                align: align,
                className: className,
                show: show,
                data: JSON.parse(JSON.stringify(menuDataInfo)),
                click: function (data, othis) {
                    that.emitSubModuleEvent({
                        event: 'component-shade-destroy',
                        data: {
                            id: 'dropdownShade'
                        }
                    })

                    const clickItem = that.menuList.find(item => item.id === data.id)
                    if(!clickItem){
                        return
                    }
                    clickItem.handler && clickItem.handler(data);
                },
                ready: function (elemPanel, elem) {
                    that.emitSubModuleEvent({
                        event: 'component-shade-show',
                        data: {
                            id: 'dropdownShade',
                            className: 'tl-rtc-app-right-dropdow-shade-content-body', 
                            shadeListener: {
                                click: function(){
                                    that.emitSubModuleEvent({
                                        event: 'component-shade-destroy',
                                        data: {
                                            id: 'dropdownShade'
                                        }
                                    })
                                }
                            }
                        }
                    })

                    let data = $(this)[0].data
                    data.forEach(item => {
                        const clickItem = that.menuList.find(menuItem => menuItem.id === item.id)
                        if(!clickItem){
                            return
                        }
                        clickItem.ready && clickItem.ready(item)
                    })
                },
                close: function(elemPanel){
                    let data = $(this)[0].data
                }
            });
        },
        /**
         * 获取菜单数据
         * @param {*} menuIdList
         * @param {*} extra
         * @returns 
         */
        getMenuData: function({
            menuIdList, extra
        }){
            let resultMenuList = []

            // 按照传入的idList索引排序
            for (let i = 0; i < this.menuList.length; i++) {
                let item = this.menuList[i];
                if(menuIdList.indexOf(item.id) === -1){
                    continue
                }
                resultMenuList.push(item)
            }

            resultMenuList = resultMenuList.sort((a, b) => {
                return menuIdList.indexOf(a.id) - menuIdList.indexOf(b.id)
            })

            // 传入额外数据
            for (let i = 0; i < resultMenuList.length; i++) {
                let item = resultMenuList[i];
                item.extra = extra
            }

            return resultMenuList
        },
        /**
         * 注册自定义菜单
         * @param {*} elemId
         * @param {*} eventList
         * @param {*} menuIdList
         * @param {*} extra
         * @param {*} tapCallback
         * @param {*} pressCallback
         * @param {*} pressUpCallback
         * @param {*} doubleTapCallback
         * @param {*} panCallback
         * @param {*} panedCallback
         * @returns
         */
        registerCustomMenu: function({
            eventList = [],
            menuIdList,
            elemId,
            extra,
            tapCallback,
            pressCallback, 
            pressUpCallback,
            doubleTapCallback,
            panCallback, 
            panedCallback,
            callback
        }){
            let that = this
            const dom = document.querySelector(elemId)
            if(!dom){
                console.error('未找到节点', elemId)
                callback && callback(false)
                return
            }

            let hammer = new Hammer.Manager(dom)

            if(eventList.includes('contextmenu')){
                // 注册右键菜单
                this.registerRightMenu({
                    menuIdList, elemId, extra, hammer
                })
            }
            if (eventList.includes('tap')) {
                // 注册点击事件
                this.registerTapMenu({
                    menuIdList, elemId, extra, tapCallback, hammer
                })
            }
            if (eventList.includes('doubletap')) {
                // 注册双击菜单
                this.registerDoubleTapMenu({
                    menuIdList, elemId, extra, doubleTapCallback, hammer
                })
            }
            if (eventList.includes('press')) {
                // 注册长按菜单
                this.registerPressMenu({
                    menuIdList, elemId, extra, pressCallback, pressUpCallback, hammer
                })
            }
            if (eventList.includes('pan')) {
                // 注册滑动菜单
                this.registerPanMenu({
                    menuIdList, elemId, extra, panCallback, panedCallback, panedCallback, hammer
                })
            }

            callback && callback(true)
        },
        /**
         * 注册右键菜单
         * @param {*} elemId
         * @param {*} menuIdList
         * @param {*} extra
         * @param {*} hammer
         * @returns
         */
        registerRightMenu: function({
            menuIdList, elemId, extra, hammer
        }){
            const eventType = 'contextmenu'
            const exist = this.registerList.find(item => item.elemId === elemId && item.eventType === eventType)
            if(exist && !this.isMobile){
                // console.warn(elemId + '节点菜单'+eventType+'事件已注册', exist)
                return
            }
            
            if(!exist){
                this.registerList.push({
                    elemId: elemId,
                    eventType: eventType,
                })
            }

            this.initMenu({
                elemId: elemId,
                className: 'custom-context-menu',
                show: false,
                align: 'left',
                trigger: 'contextmenu',
                menuDataInfo: this.getMenuData({menuIdList, extra})
            })
        },
        /**
         * 注册长按菜单
         * @param {*} elemId
         * @param {*} menuIdList
         * @param {*} extra
         * @param {*} pressCallback
         * @param {*} pressUpCallback
         * @param {*} hammer
         * @returns
         */
        registerPressMenu: function({
            menuIdList, elemId, extra, pressCallback, pressUpCallback, hammer
        }){
            let that = this
            const eventType = 'press'
            const exist = this.registerList.find(item => item.elemId === elemId && item.eventType === eventType)
            if(exist && !this.isMobile){
                // console.warn(elemId + '节点菜单'+eventType+'事件已注册', exist, document.querySelector(elemId))
                return
            }
            
            if(!exist){
                this.registerList.push({
                    elemId: elemId,
                    eventType: eventType
                })
            }

            const press = new Hammer.Press({ time: 500 });
            // 注册长按菜单
            hammer.add( press );
            // 长按
            hammer.on('press', function(event) {
                console.log('长按', event);
                event.preventDefault();

                that.initMenu({
                    elemId: elemId,
                    className: 'custom-context-menu',
                    show: true,
                    trigger: 'contextmenu',
                    menuDataInfo: that.getMenuData({menuIdList, extra})
                })
                
                // 修改定位为当前点击位置，计算大小不要超过屏幕
                const pressDom = document.querySelector('.custom-context-menu')
                if (pressDom) {
                    const x = event.center.x
                    const y = event.center.y
                    const width = pressDom.offsetWidth
                    const height = pressDom.offsetHeight
                    const windowWidth = window.innerWidth
                    const windowHeight = window.innerHeight

                    let left = x
                    let top = y
                    if (x + width > windowWidth) {
                        left = windowWidth - width
                    }
                    if (y + height > windowHeight) {
                        top = windowHeight - height
                    }

                    pressDom.style.left = left + 'px'
                    pressDom.style.top = top + 'px'
                }

                pressCallback && pressCallback()
            });
            // 长按松开
            hammer.on('pressup', function() {
                console.log('长按松开');
                pressUpCallback && pressUpCallback()
            });
        },
        /**
         * 注册单击菜单
         * @param {*} elemId
         * @param {*} menuIdList
         * @param {*} extra
         * @param {*} tapCallback
         * @param {*} hammer
         * @returns
         */
        registerTapMenu: function({
            menuIdList, elemId, extra, tapCallback, hammer
        }){
            // 单击
            const singletap = new Hammer.Tap({ event: 'singletap' });
            hammer.add( singletap );

            hammer.on('singletap', function(event) {
                console.log('单击', event);
                tapCallback && tapCallback()
            });
        },
        /**
         * 注册双击菜单
         * @param {*} elemId
         * @param {*} menuIdList
         * @param {*} extra
         * @param {*} doubleTapCallback
         * @param {*} hammer
         * @returns
         */
        registerDoubleTapMenu: function({
            menuIdList, elemId, extra, doubleTapCallback, hammer
        }){
            const doubletap = new Hammer.Tap({ event: 'doubletap', taps: 2 });
            hammer.add( doubletap );

            // 双击
            hammer.on('doubletap', function(event) {
                console.log('双击', event);
                doubleTapCallback && doubleTapCallback()
            });
        },
        /**
         * 注册滑动菜单
         * @param {*} elemId
         * @param {*} menuIdList
         * @param {*} extra
         * @param {*} panCallback
         * @param {*} panedCallback
         * @param {*} dom
         * @returns
         */
        registerPanMenu: function({
            menuIdList, elemId, extra, panCallback, panedCallback, hammer
        }){
            const pan = new Hammer.Pan({ direction: Hammer.DIRECTION_HORIZONTAL });
            hammer.add( pan );

            // 滑动过程
            hammer.on('pan', function(event) {
                // 方向
                const direction = event.offsetDirection;
                // 距离
                const distance = event.distance;
                // console.log('滑动过程', direction);

                panCallback && panCallback(direction, distance)
            });

            // 滑动结束
            hammer.on('panend', function(event) {
                // 方向
                const direction = event.offsetDirection;
                // 距离
                const distance = event.distance;
                // console.log('滑动结束', event);

                panedCallback && panedCallback(direction, distance)
            });
        },
    },
    mounted() {
        // 添加菜单项目
        this.addRefreshMenu();
        this.addQuickPanelMenu();
        this.addPersonalMenu();
        this.addThemeMenu();
        this.addSettingMenu();
        this.addExitChannelMenu();
        this.addTopChannelMenu();
        this.addHiddenNotifyMenu();
        this.addInviteFriendMenu();
        this.addCopyChannelIdMenu();
        this.addMarkUnreadMenu();
        this.addHiddenChannel();
        this.addClearHistoryMenu();
        this.addReplyMessageMenu();
        this.addDeleteMessageMenu();
        this.addRollbackMessageMenu();
        this.addCopyMessageMenu();
        this.addSwitchAccountMenu();
        this.addLogoutMenu();
        this.addUnTopChannelMenu();
        this.addDeleteFriendMenu();
    },
    created(){
        // 注册自定义菜单
        window.subModule.$on('component-menu-register-custom', this.registerCustomMenu);
    }
})

window.tl_rtc_app_menu = tl_rtc_app_menu;