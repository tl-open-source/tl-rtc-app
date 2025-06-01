const tl_rtc_app_module_setting_content_skin = {
    props: {
        socket: {
            type: Object,
            default: null
        },
        isMobile: {
            type: Boolean,
            default: false
        },
        skinSetting: {
            type: Object,
            default: {

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
    computed: {
        propsSocket(){
            return this.socket;
        },
        propsIsMobile(){
            return this.isMobile;
        },
        propsSkinSetting(){
            return this.skinSetting;
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
    data : function(){
        return {
            settingFields: [],
            hasListenedSkinChange: false,
            previewType: 'global',

            commSkinList: [],       // 公共皮肤设置
            sidebarSkinList: [],    // 侧边栏皮肤设置
            channelSkinList: [],    // 频道皮肤设置
            contactSkinList: [],    // 联系人皮肤设置
            loginSkinList: [],      // 登录皮肤设置
            settingSkinList: [],    // 设置皮肤设置

            channelHistoryMessageSkinList: [],  // 频道历史消息皮肤设置
            channelMoreSkinList: [],            // 频道更多面板皮肤设置
            channelInviteSkinList: [],          // 频道邀请面板皮肤设置
            channelNoticeSkinList: [],          // 频道公告面板皮肤设置
            layerMsgSkinList: [],               // 弹层消息皮肤设置
            layerTipSkinList: [],               // 弹层提示皮肤设置
            quickOperSkinList: [],              // 快捷操作面板皮肤设置
            mediaSkinList: [],                  // 音视频界面皮肤设置
            faceSkinList: [],                   // 表情皮肤设置
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
         * 修改预览类型
         * @param {*} type
         */
        changePreviewType: function(type){
            this.previewType = type
        },
        /**
        * 初始化公共皮肤设置
        */
        initCommSkinList: function(){
            let settingFieldsMap = {
                skinTopHeaderToolBackground : {
                    id: 'skin-top-header-tool-background',
                    name: '顶部工具栏背景色',
                    type: 'background',
                    color: '',
                },
                skinTopHeaderTitleColor : {
                    id: 'skin-top-header-title-color',
                    name: '顶部标题栏字体颜色',
                    type: 'color',
                    color: '',
                },
                skinTopHeaderToolFillColor : {
                    id: 'skin-top-header-tool-fill-color',
                    name: '顶部工具栏SVG字体颜色',
                    type: 'fill-color',
                    color: '',
                },
                skinTopHeaderToolHoverFillColor : {
                    id: 'skin-top-header-tool-hover-fill-color',
                    name: '顶部工具栏HoverSVG字体颜色',
                    type: 'fill-color',
                    color: '',
                },
                skinTopHeaderToolHoverShadow : {
                    id: 'skin-top-header-tool-hover-shadow',
                    name: '顶部工具栏Hover阴影',
                    type: 'shadow',
                    color: '',
                },
                skinBodyColor : {
                    id: 'skin-body-color',
                    name: '页面字体颜色',
                    type: 'color',
                    color: '',
                },
                skinBodyBackground : {
                    id: 'skin-body-background',
                    name: '页面背景颜色',
                    type: 'color',
                    color: '',
                },
                skinBodyShadow : {
                    id: 'skin-body-shadow',
                    name: '页面阴影',
                    type: 'shadow',
                    color: '',
                },
                skinBodyBorderColor : {
                    id: 'skin-body-border-color',
                    name: '页面边框颜色',
                    type: 'color',
                    color: '',
                },
            }

            // 过滤type=shadow类型，暂不支持
            let settingFields = Object.keys(settingFieldsMap).filter((key) => {
                return settingFieldsMap[key].type !== 'shadow'
            })

            const propertyKeys = []
            settingFields.forEach((key) => {
                propertyKeys.push({
                    key: key, value: settingFieldsMap[key].id
                })
            })
            // 初始值
            let propertyValues = window.tl_rtc_app_comm.getPropertyValues(propertyKeys)

            let skinList = []
            settingFields.forEach((key) => {
                skinList.push({
                    id: settingFieldsMap[key].id,
                    key: key,
                    name: settingFieldsMap[key].name,
                    color: propertyValues[key]
                })
            })

            this.commSkinList = skinList
            this.settingFields.push(...settingFields)

            this.renderSkinColorPicker(this.commSkinList)
        },
        /**
        * 初始化消息提示皮肤设置
        */
        initLayerMsgSkinList: function(){
            let settingFieldsMap = {
                skinLayerMsgBackground : {
                    id: 'skin-layer-msg-background',
                    name: '弹层消息背景色',
                    type: 'background',
                    color: '',
                },
                skinLayerMsgColor : {
                    id: 'skin-layer-msg-color',
                    name: '弹层消息字体颜色',
                    type: 'color',
                    color: '',
                },
                skinLayerMsgSuccessColor : {
                    id: 'skin-layer-msg-success-color',
                    name: '弹层成功消息字体颜色',
                    type: 'color',
                    color: '',
                },
                skinLayerMsgWarningColor : {
                    id: 'skin-layer-msg-warning-color',
                    name: '弹层警告消息字体颜色',
                    type: 'color',
                    color: '',
                },
                skinLayerMsgErrorColor : {
                    id: 'skin-layer-msg-error-color',
                    name: '弹层错误消息字体颜色',
                    type: 'color',
                    color: '',
                },
            }

            // 过滤type=shadow类型，暂不支持
            let settingFields = Object.keys(settingFieldsMap).filter((key) => {
                return settingFieldsMap[key].type !== 'shadow'
            })

            const propertyKeys = []
            settingFields.forEach((key) => {
                propertyKeys.push({
                    key: key, value: settingFieldsMap[key].id
                })
            })
            // 初始值
            let propertyValues = window.tl_rtc_app_comm.getPropertyValues(propertyKeys)

            let skinList = []
            settingFields.forEach((key) => {
                skinList.push({
                    id: settingFieldsMap[key].id,
                    key: key,
                    name: settingFieldsMap[key].name,
                    color: propertyValues[key]
                })
            })

            this.layerMsgSkinList = skinList
            this.settingFields.push(...settingFields)

            this.renderSkinColorPicker(this.layerMsgSkinList)
        },
        /**
        * 初始化侧边栏皮肤设置
        */
        initSidebarSkinList: function(){
            let settingFieldsMap = {
                skinSidebarToolBackground : {
                    id: 'skin-sidebar-tool-background',
                    name: '侧边栏工具背景色',
                    type: 'background',
                    color: '',
                },
                skinSidebarToolHoverBackground : {
                    id: 'skin-sidebar-tool-hover-background',
                    name: '侧边栏工具Hover背景色',
                    type: 'background',
                    color: '',
                },
                skinSidebarToolColor : {
                    id: 'skin-sidebar-tool-color',
                    name: '侧边栏工具字体颜色',
                    type: 'color',
                    color: '',
                },
                skinSidebarToolHoverColor : {
                    id: 'skin-sidebar-tool-hover-color',
                    name: '侧边栏工具Hover字体颜色',
                    type: 'color',
                    color: '',
                },
                skinSidebarToolFillColor : {
                    id: 'skin-sidebar-tool-fill-color',
                    name: '侧边栏工具SVG字体颜色',
                    type: 'fill-color',
                    color: '',
                },
                skinSidebarToolHoverFillColor : {
                    id: 'skin-sidebar-tool-hover-fill-color',
                    name: '侧边栏工具HoverSVG字体颜色',
                    type: 'fill-color',
                    color: '',
                },
                skinSidebarToolMoreBorderColor : {
                    id: 'skin-sidebar-tool-more-border-color',
                    name: '侧边栏工具更多模块边框颜色',
                    type: 'color',
                    color: '',
                },
            }

            // 过滤type=shadow类型，暂不支持
            let settingFields = Object.keys(settingFieldsMap).filter((key) => {
                return settingFieldsMap[key].type !== 'shadow'
            })

            const propertyKeys = []
            settingFields.forEach((key) => {
                propertyKeys.push({
                    key: key, value: settingFieldsMap[key].id
                })
            })
            // 初始值
            let propertyValues = window.tl_rtc_app_comm.getPropertyValues(propertyKeys)

            let skinList = []
            settingFields.forEach((key) => {
                skinList.push({
                    id: settingFieldsMap[key].id,
                    key: key,
                    name: settingFieldsMap[key].name,
                    color: propertyValues[key]
                })
            })

            this.sidebarSkinList = [...skinList]
            this.settingFields.push(...settingFields)

            this.renderSkinColorPicker(this.sidebarSkinList)
        },
        /**
        * 初始化快捷面板皮肤设置
        */
        initQuickOperSkinList: function(){
            let settingFieldsMap = {
                skinQuickOperPanelBackground : {
                    id: 'skin-quick-oper-panel-background',
                    name: '快捷操作面板背景色',
                    type: 'background',
                    color: '',
                },
                skinQuickOperPanelItemHoverBackground : {
                    id: 'skin-quick-oper-panel-item-hover-background',
                    name: '快捷操作面板Hover背景色',
                    type: 'background',
                    color: '',
                },
                skinQuickOperPanelItemColor : {
                    id: 'skin-quick-oper-panel-item-color',
                    name: '快捷操作面板字体颜色',
                    type: 'color',
                    color: '',
                },
                skinQuickOperPanelItemHoverColor : {
                    id: 'skin-quick-oper-panel-item-hover-color',
                    name: '快捷操作面板Hover字体颜色',
                    type: 'color',
                    color: '',
                },
            }

            // 过滤type=shadow类型，暂不支持
            let settingFields = Object.keys(settingFieldsMap).filter((key) => {
                return settingFieldsMap[key].type !== 'shadow'
            })

            const propertyKeys = []
            settingFields.forEach((key) => {
                propertyKeys.push({
                    key: key, value: settingFieldsMap[key].id
                })
            })
            // 初始值
            let propertyValues = window.tl_rtc_app_comm.getPropertyValues(propertyKeys)

            let skinList = []
            settingFields.forEach((key) => {
                skinList.push({
                    id: settingFieldsMap[key].id,
                    key: key,
                    name: settingFieldsMap[key].name,
                    color: propertyValues[key]
                })
            })

            this.quickOperSkinList = [...skinList]
            this.settingFields.push(...settingFields)

            this.renderSkinColorPicker(this.quickOperSkinList)
        },
        /**
        * 初始化频道皮肤设置
        */
        initChannelSkinList: function(){
            let settingFieldsMap = {
                skinChannelListNoChannelColor : {
                    id: 'skin-channel-list-no-channel-color',
                    name: '频道列表无频道时字体颜色',
                    type: 'color',
                    color: '',
                },
                skinChannelListItemTopBackground : {
                    id: 'skin-channel-list-item-top-background',
                    name: '频道列表置顶项目背景色',
                    type: 'background',
                    color: '',
                },
                skinChannelTopSearchIColor : {
                    id: 'skin-channel-top-search-i-color',
                    name: '频道顶部搜索图标字体颜色',
                    type: 'color',
                    color: '',
                },
                skinChannelTopSearchInputBackground : {
                    id: 'skin-channel-top-search-input-background',
                    name: '频道顶部搜索框背景色',
                    type: 'background',
                    color: '',
                },
                skinChannelTopSearchInputColor : {
                    id: 'skin-channel-top-search-input-color',
                    name: '频道顶部搜索框文字字体颜色',
                    type: 'color',
                    color: '',
                },
                skinChannelContentTopMoreFillColor : {
                    id: 'skin-channel-content-top-more-fill-color',
                    name: '频道内容顶部更多SVG颜色',
                    type: 'fill-color',
                    color: '',
                },

                skinChannelListItemHoverBackground : {
                    id: 'skin-channel-list-item-hover-background',
                    name: '频道列表项目Hover背景色',
                    type: 'background',
                    color: '',
                },
                skinChannelListItemMessageColor : {
                    id: 'skin-channel-list-item-message-color',
                    name: '频道列表消息字体颜色',
                    type: 'color',
                    color: '',
                },
                skinChannelListItemMessageAtUserTextColor : {
                    id: 'skin-channel-list-item-message-at-user-text-color',
                    name: '频道列表消息@用户字体颜色',
                    type: 'color',
                    color: '',
                },
                skinChannelListItemMessageAtMeTextColor : {
                    id: 'skin-channel-list-item-message-at-me-text-color',
                    name: '频道列表消息@你字体颜色',
                    type: 'color',
                    color: '',
                },
                skinChannelListItemTimeColor : {
                    id: 'skin-channel-list-item-time-color',
                    name: '频道列表时间字体颜色',
                    type: 'color',
                    color: '',
                },
                skinChannelListItemQuickMarkUnreadBackground : {
                    id: 'skin-channel-list-item-quick-mark-unread-background',
                    name: '频道列表未读标记背景色',
                    type: 'background',
                    color: '',
                },
                skinChannelListItemQuickMarkUnreadColor : {
                    id: 'skin-channel-list-item-quick-mark-unread-color',
                    name: '频道列表未读标记字体颜色',
                    type: 'color',
                    color: '',
                },
                skinChannelListItemQuickTopBackground : {
                    id: 'skin-channel-list-item-quick-top-background',
                    name: '频道列表置顶标记背景色',
                    type: 'background',
                    color: '',
                },
                skinChannelListItemQuickTopColor : {
                    id: 'skin-channel-list-item-quick-top-color',
                    name: '频道列表置顶标记字体颜色',
                    type: 'color',
                    color: '',
                },
                skinChannelListItemQuickDeleteBackground : {
                    id: 'skin-channel-list-item-quick-delete-background',
                    name: '频道列表删除标记背景色',
                    type: 'background',
                    color: '',
                },
                skinChannelListItemQuickDeleteColor : {
                    id: 'skin-channel-list-item-quick-delete-color',
                    name: '频道列表删除标记字体颜色',
                    type: 'color',
                    color: '',
                },
                skinChannelListItemQuickHiddenBackground : {
                    id: 'skin-channel-list-item-quick-hidden-background',
                    name: '频道列表不显示标记背景色',
                    type: 'background',
                    color: '',
                },
                skinChannelListItemQuickHiddenColor : {
                    id: 'skin-channel-list-item-quick-hidden-color',
                    name: '频道列表不显示标记字体颜色',
                    type: 'color',
                    color: '',
                },
                skinChannelListItemQuickUnNotifyBackground : {
                    id: 'skin-channel-list-item-quick-un-notify-background',
                    name: '频道列表免打扰标记背景色',
                    type: 'background',
                    color: '',
                },
                skinChannelListItemQuickUnNotifyColor : {
                    id: 'skin-channel-list-item-quick-un-notify-color',
                    name: '频道列表免打扰标记字体颜色',
                    type: 'color',
                    color: '',
                },
                skinChannelContentBodyMessageBackground : {
                    id: 'skin-channel-content-body-message-background',
                    name: '频道内容消息背景色',
                    type: 'background',
                    color: '',
                },
                skinChannelContentBodyMessageColor : {
                    id: 'skin-channel-content-body-message-color',
                    name: '频道内容消息文字字体颜色',
                    type: 'color',
                    color: '',
                },
                skinChannelContentBodyMessageSystemColor : {
                    id: 'skin-channel-content-body-message-system-color',
                    name: '频道内容系统消息字体颜色',
                    type: 'color',
                    color: '',
                },
                skinChannelContentBodyMessageTimeColor : {
                    id: 'skin-channel-content-body-message-time-color',
                    name: '频道内容消息时间字体颜色',
                    type: 'color',
                    color: '',
                },
                skinChannelContentBodyMessageLoadMoreColor : {
                    id: 'skin-channel-content-body-message-load-more-color',
                    name: '频道内容加载更多按钮字体颜色',
                    type: 'color',
                    color: '',
                },
                skinChannelContentBodyMessageLoadMoreHoverColor : {
                    id: 'skin-channel-content-body-message-load-more-hover-color',
                    name: '频道内容加载更多按钮Hover字体颜色',
                    type: 'color',
                    color: '',
                },
                skinChannelContentBodyMessageNameColor : {
                    id: 'skin-channel-content-body-message-name-color',
                    name: '频道内容消息用户名字体颜色',
                    type: 'color',
                    color: '',
                },
                skinChannelContentBodyMessageNameHoverColor : {
                    id: 'skin-channel-content-body-message-name-hover-color',
                    name: '频道内容消息用户名字体Hover颜色',
                    type: 'color',
                    color: '',
                },
                skinChannelContentBodyItemMessageAtUserTextColor : {
                    id: 'skin-channel-content-body-item-message-at-user-text-color',
                    name: '频道内容消息@用户字体颜色',
                    type: 'color',
                    color: '',
                },
                skinChannelContentBodyMessageMenuIconBackground : {
                    id: 'skin-channel-content-body-message-menu-icon-background',
                    name: '频道内容消息菜单图标背景色',
                    type: 'background',
                    color: '',
                },
                skinChannelContentBodyMessageMenuIconColor : {
                    id: 'skin-channel-content-body-message-menu-icon-color',
                    name: '频道内容消息菜单图标字体颜色',
                    type: 'color',
                    color: '',
                },
                skinChannelContentBodyMessageMenuIconHoverBackground : {
                    id: 'skin-channel-content-body-message-menu-icon-hover-background',
                    name: '频道内容消息菜单图标Hover背景色',
                    type: 'background',
                    color: '',
                },
                skinChannelContentBodyMessageMenuIconHoverColor : {
                    id: 'skin-channel-content-body-message-menu-icon-hover-color',
                    name: '频道内容消息菜单图标Hover字体颜色',
                    type: 'color',
                    color: '',
                },
                skinChannelContentBodyReplyContentBlockColor : {
                    id: 'skin-channel-content-body-reply-content-block-color',
                    name: '频道内容回复内容块字体颜色',
                    type: 'color',
                    color: '',
                },
                skinChannelContentBodyReplyContentBlockBackground : {
                    id: 'skin-channel-content-body-reply-content-block-background',
                    name: '频道内容回复内容块背景色',
                    type: 'background',
                    color: '',
                },
            }

            // 过滤type=shadow类型，暂不支持
            let settingFields = Object.keys(settingFieldsMap).filter((key) => {
                return settingFieldsMap[key].type !== 'shadow'
            })

            const propertyKeys = []
            settingFields.forEach((key) => {
                propertyKeys.push({
                    key: key, value: settingFieldsMap[key].id
                })
            })
            // 初始值
            let propertyValues = window.tl_rtc_app_comm.getPropertyValues(propertyKeys)

            let skinList = []
            settingFields.forEach((key) => {
                skinList.push({
                    id: settingFieldsMap[key].id,
                    key: key,
                    name: settingFieldsMap[key].name,
                    color: propertyValues[key]
                })
            })

            this.channelSkinList = [...skinList]
            this.settingFields.push(...settingFields)

            this.renderSkinColorPicker(this.channelSkinList)
        },
        /**
        * 初始化频道更多面板皮肤设置
        */
        initChannelMoreSkinList: function(){
            let settingFieldsMap = {
                skinChannelContentMoreBackground : {
                    id: 'skin-channel-content-more-background',
                    name: '频道内容更多按钮背景色',
                    type: 'background',
                    color: '',
                },
                skinChannelContentMoreShadow : {
                    id: 'skin-channel-content-more-shadow',
                    name: '频道内容更多按钮阴影',
                    type: 'shadow',
                    color: '',
                },
                skinChannelContentMoreListItemHoverColor : {
                    id: 'skin-channel-content-more-list-item-hover-color',
                    name: '频道内容更多列表项Hover字体颜色',
                    type: 'color',
                    color: '',
                },
                skinChannelContentMoreListItemOperChannelNameColor : {
                    id: 'skin-channel-content-more-list-item-oper-channel-name-color',
                    name: '频道内容更多列表项操作频道名称字体颜色',
                    type: 'color',
                    color: '',
                },
                skinChannelContentMoreShareToolItemHoverBackground : {
                    id: 'skin-channel-content-more-share-tool-item-hover-background',
                    name: '频道内容分享工具Hover背景色',
                    type: 'background',
                    color: '',
                },
                skinChannelContentMoreListItemBorderColor: {
                    id: 'skin-channel-content-more-list-item-border-color',
                    name: '频道内容更多列表项边框颜色',
                    type: 'color',
                    color: '',
                },
                skinChannelContentMoreListUserItemOperHoverBackground : {
                    id: 'skin-channel-content-more-list-user-item-oper-hover-background',
                    name: '频道内容更多列表用户操作Hover背景色',
                    type: 'background',
                    color: '',
                },
                skinChannelContentMoreListUserItemOperHoverFillColor : {
                    id: 'skin-channel-content-more-list-user-item-oper-hover-fill-color',
                    name: '频道内容更多列表用户操作Hover字体颜色',
                    type: 'color',
                    color: '',
                },
            }

            // 过滤type=shadow类型，暂不支持
            let settingFields = Object.keys(settingFieldsMap).filter((key) => {
                return settingFieldsMap[key].type !== 'shadow'
            })

            const propertyKeys = []
            settingFields.forEach((key) => {
                propertyKeys.push({
                    key: key, value: settingFieldsMap[key].id
                })
            })
            // 初始值
            let propertyValues = window.tl_rtc_app_comm.getPropertyValues(propertyKeys)

            let skinList = []
            settingFields.forEach((key) => {
                skinList.push({
                    id: settingFieldsMap[key].id,
                    key: key,
                    name: settingFieldsMap[key].name,
                    color: propertyValues[key]
                })
            })

            this.channelMoreSkinList = [...skinList]
            this.settingFields.push(...settingFields)

            this.renderSkinColorPicker(this.channelMoreSkinList)
        },
        /**
        * 初始化频道邀请界面皮肤设置
        */
        initChannelInviteSkinList: function(){
            let settingFieldsMap = {
                skinChannelContentInviteSearchIColor : {
                    id: 'skin-channel-content-invite-search-i-color',
                    name: '频道内容邀请搜索图标字体颜色',
                    type: 'color',
                    color: '',
                },
                skinChannelContentInviteSearchInputBackground : {
                    id: 'skin-channel-content-invite-search-input-background',
                    name: '频道内容邀请搜索框背景色',
                    type: 'background',
                    color: '',
                },
                skinChannelContentInviteSearchInputColor : {
                    id: 'skin-channel-content-invite-search-input-color',
                    name: '频道内容邀请搜索框文字字体颜色',
                    type: 'color',
                    color: '',
                },
                skinChannelContentInviteChooseListItemHoverBackground : {
                    id: 'skin-channel-content-invite-choose-list-item-hover-background',
                    name: '频道内容邀请选择列表项Hover背景色',
                    type: 'background',
                    color: '',
                },
                skinChannelContentInviteChooseListEmptyColor : {
                    id: 'skin-channel-content-invite-choose-list-empty-color',
                    name: '频道内容邀请选择列表为空时的字体颜色',
                    type: 'color',
                    color: '',
                }
            }

            // 过滤type=shadow类型，暂不支持
            let settingFields = Object.keys(settingFieldsMap).filter((key) => {
                return settingFieldsMap[key].type !== 'shadow'
            })

            const propertyKeys = []
            settingFields.forEach((key) => {
                propertyKeys.push({
                    key: key, value: settingFieldsMap[key].id
                })
            })
            // 初始值
            let propertyValues = window.tl_rtc_app_comm.getPropertyValues(propertyKeys)

            let skinList = []
            settingFields.forEach((key) => {
                skinList.push({
                    id: settingFieldsMap[key].id,
                    key: key,
                    name: settingFieldsMap[key].name,
                    color: propertyValues[key]
                })
            })

            this.channelInviteSkinList = [...skinList]
            this.settingFields.push(...settingFields)

            this.renderSkinColorPicker(this.channelInviteSkinList)
        },
        /**
        * 初始化频道公告皮肤设置
        */
        initChannelNoticeSkinList: function(){
            let settingFieldsMap = {
                skinChannelContentNoticeEmptyColor : {
                    id: 'skin-channel-content-notice-empty-color',
                    name: '频道内容公告为空时的字体颜色',
                    type: 'color',
                    color: '',
                },
                skinChannelContentNoticeItemHoverBackground : {
                    id: 'skin-channel-content-notice-item-hover-background',
                    name: '频道内容公告项目Hover背景色',
                    type: 'background',
                    color: '',
                },
                skinChannelContentNoticeItemTimeColor : {
                    id: 'skin-channel-content-notice-item-time-color',
                    name: '频道内容公告项目时间字体颜色',
                    type: 'color',
                    color: '',
                },
                skinChannelContentNoticeItemTitleColor : {
                    id: 'skin-channel-content-notice-item-title-color',
                    name: '频道内容公告项目标题字体颜色',
                    type: 'color',
                    color: '',
                },
            }

            // 过滤type=shadow类型，暂不支持
            let settingFields = Object.keys(settingFieldsMap).filter((key) => {
                return settingFieldsMap[key].type !== 'shadow'
            })

            const propertyKeys = []
            settingFields.forEach((key) => {
                propertyKeys.push({
                    key: key, value: settingFieldsMap[key].id
                })
            })
            // 初始值
            let propertyValues = window.tl_rtc_app_comm.getPropertyValues(propertyKeys)

            let skinList = []
            settingFields.forEach((key) => {
                skinList.push({
                    id: settingFieldsMap[key].id,
                    key: key,
                    name: settingFieldsMap[key].name,
                    color: propertyValues[key]
                })
            })

            this.channelNoticeSkinList = [...skinList]
            this.settingFields.push(...settingFields)

            this.renderSkinColorPicker(this.channelNoticeSkinList)
        },
        /**
        * 初始化媒体音视频皮肤设置
        */
        initMediaSkinList: function(){
            let settingFieldsMap = {
                skinMediaVideoOtherItemShadow : {
                    id: 'skin-media-video-other-item-shadow',
                    name: '媒体视频其他项目阴影',
                    type: 'shadow',
                    color: '',
                },
                skinMediaVideoToolListSvgFillColor : {
                    id: 'skin-media-video-tool-list-svg-fill-color',
                    name: '媒体视频工具列表图标SVG颜色',
                    type: 'fill-color',
                    color: '',
                },
                skinMediaVideoToolListSvgBackground : {
                    id: 'skin-media-video-tool-list-svg-background',
                    name: '媒体视频工具列表图标背景色',
                    type: 'background',
                    color: '',
                },
                skinMediaVideoToolListSvgHoverBackground : {
                    id: 'skin-media-video-tool-list-svg-hover-background',
                    name: '媒体视频工具列表图标Hover背景色',
                    type: 'background',
                    color: '',
                },
                skinMediaVideoToolListSvgHoverFillColor : {
                    id: 'skin-media-video-tool-list-svg-hover-fill-color',
                    name: '媒体视频工具列表图标HoverSVG字体颜色',
                    type: 'fill-color',
                    color: '',
                },
                skinMediaVideoToolListYsqCloseBackground : {
                    id: 'skin-media-video-tool-list-ysq-close-background',
                    name: '媒体视频工具列表关闭按钮背景色',
                    type: 'background',
                    color: '',
                },
            }

            // 过滤type=shadow类型，暂不支持
            let settingFields = Object.keys(settingFieldsMap).filter((key) => {
                return settingFieldsMap[key].type !== 'shadow'
            })

            const propertyKeys = []
            settingFields.forEach((key) => {
                propertyKeys.push({
                    key: key, value: settingFieldsMap[key].id
                })
            })
            // 初始值
            let propertyValues = window.tl_rtc_app_comm.getPropertyValues(propertyKeys)

            let skinList = []
            settingFields.forEach((key) => {
                skinList.push({
                    id: settingFieldsMap[key].id,
                    key: key,
                    name: settingFieldsMap[key].name,
                    color: propertyValues[key]
                })
            })

            this.mediaSkinList = [...skinList]
            this.settingFields.push(...settingFields)

            this.renderSkinColorPicker(this.mediaSkinList)
        },
        /**
        * 初始化联系人皮肤设置
        */
        initContactSkinList: function(){
            let settingFieldsMap = {
                skinContactHeaderToolHoverShadow : {
                    id: 'skin-contact-header-tool-hover-shadow',
                    name: '联系人头部工具Hover阴影',
                    type: 'shadow',
                    color: '',
                },
                skinContactHeaderToolSvgFillColor : {
                    id: 'skin-contact-header-tool-svg-fill-color',
                    name: '联系人头部工具图标SVG字体颜色',
                    type: 'fill-color',
                    color: '',
                },
                skinContactHeaderToolSvgHoverFillColor : {
                    id: 'skin-contact-header-tool-svg-hover-fill-color',
                    name: '联系人头部工具图标HoverSVG字体颜色',
                    type: 'fill-color',
                    color: '',
                },
                skinContactTopSearchIColor : {
                    id: 'skin-contact-top-search-i-color',
                    name: '联系人顶部搜索图标字体颜色',
                    type: 'color',
                    color: '',
                },
                skinContactTopSearchInputBackground : {
                    id: 'skin-contact-top-search-input-background',
                    name: '联系人顶部搜索框背景色',
                    type: 'background',
                    color: '',
                },
                skinContactTopSearchInputColor : {
                    id: 'skin-contact-top-search-input-color',
                    name: '联系人顶部搜索框文字字体颜色',
                    type: 'color',
                    color: '',
                },
                skinContactListItemHoverBackground : {
                    id: 'skin-contact-list-item-hover-background',
                    name: '联系人列表项目Hover背景色',
                    type: 'background',
                    color: '',
                },
                skinContactContentToolItemHoverBackground : {
                    id: 'skin-contact-content-tool-item-hover-background',
                    name: '联系人内容工具项目Hover背景色',
                    type: 'background',
                    color: '',
                },
                skinContactContentOtherItemBadgeBackground : {
                    id: 'skin-contact-content-other-item-badge-background',
                    name: '联系人内容其他项目徽章背景色',
                    type: 'background',
                    color: '',
                },
                skinContactContentItemMessageColor : {
                    id: 'skin-contact-content-item-message-color',
                    name: '联系人内容消息字体颜色',
                    type: 'color',
                    color: '',
                },
                skinContactContentItemOtherStatusColor : {
                    id: 'skin-contact-content-item-other-status-color',
                    name: '联系人内容其他状态字体颜色',
                    type: 'color',
                    color: '',
                },
            }

            // 过滤type=shadow类型，暂不支持
            let settingFields = Object.keys(settingFieldsMap).filter((key) => {
                return settingFieldsMap[key].type !== 'shadow'
            })

            const propertyKeys = []
            settingFields.forEach((key) => {
                propertyKeys.push({
                    key: key, value: settingFieldsMap[key].id
                })
            })
            // 初始值
            let propertyValues = window.tl_rtc_app_comm.getPropertyValues(propertyKeys)

            let skinList = []
            settingFields.forEach((key) => {
                skinList.push({
                    id: settingFieldsMap[key].id,
                    key: key,
                    name: settingFieldsMap[key].name,
                    color: propertyValues[key]
                })
            })

            this.contactSkinList = [...skinList]
            this.settingFields.push(...settingFields)

            this.renderSkinColorPicker(this.contactSkinList)
        },
        /*
        * 初始化登录皮肤设置
        */
        initLoginSkinList: function(){
            let settingFieldsMap = {
                skinLoginButtonBackground : {
                    id: 'skin-login-button-background',
                    name: '登录按钮背景色',
                    type: 'background',
                    color: '',
                },
                skinLoginListItemHoverBackground : {
                    id: 'skin-login-list-item-hover-background',
                    name: '登录列表项目Hover背景色',
                    type: 'background',
                    color: '',
                },
                skinLoginListItemHoverColor : {
                    id: 'skin-login-list-item-hover-color',
                    name: '登录列表项目Hover字体颜色',
                    type: 'color',
                    color: '',
                },
                skinLoginContentFormInputColor : {
                    id: 'skin-login-content-form-input-color',
                    name: '登录内容表单输入框字体颜色',
                    type: 'color',
                    color: '',
                },
                skinLoginContentBodyBottomColor : {
                    id: 'skin-login-content-body-bottom-color',
                    name: '登录内容底部字体颜色',
                    type: 'color',
                    color: '',
                },
                skinLoginContentBodyBottomHoverColor : {
                    id: 'skin-login-content-body-bottom-hover-color',
                    name: '登录内容底部Hover字体颜色',
                    type: 'color',
                    color: '',
                },
                skinLoginContentBodyScanTitleColor : {
                    id: 'skin-login-content-body-scan-title-color',
                    name: '登录内容扫码标题字体颜色',
                    type: 'color',
                    color: '',
                },
                skinLoginContentBodyScanTitleBackground : {
                    id: 'skin-login-content-body-scan-title-background',
                    name: '登录内容扫码标题背景色',
                    type: 'background',
                    color: '',
                },
                skinLoginContentBodyScanCodeItemDisabledBackground : {
                    id: 'skin-login-content-body-scan-code-item-disabled-background',
                    name: '登录内容扫码项目禁用背景色',
                    type: 'background',
                    color: '',
                },
                skinLoginContentBodyScanCodeItemFocusBorderColor: {
                    id: 'skin-login-content-body-scan-code-item-focus-border-color',
                    name: '登录内容扫码项目聚焦边框字体颜色',
                    type: 'color',
                    color: '',
                },
                skinLoginEmailCodeBtnColor: {
                    id: 'skin-login-email-code-btn-color',
                    name: '登录邮箱验证码按钮字体颜色',
                    type: 'color',
                    color: '',
                },
                skinLoginEmailCodeBtnDisabledBackground: {
                    id: 'skin-login-email-code-btn-disabled-background',
                    name: '登录邮箱验证码按钮禁用背景',
                    type: 'background',
                    color: '',
                },
                skinLoginHelpMobileColor: {
                    id: 'skin-login-help-mobile-color',
                    name: '登录帮助手机字体颜色',
                    type: 'color',
                    color: '',
                },
                skinLoginHelpMobileHoverColor: {
                    id: 'skin-login-help-mobile-hover-color',
                    name: '登录帮助手机Hover字体颜色',
                    type: 'color',
                    color: '',
                },
                skinLoginBodyCleanColor: {
                    id: 'skin-login-body-clean-color',
                    name: '登录清理按钮字体颜色',
                    type: 'color',
                    color: '',
                },
                skinLoginBodyCleanHoverColor: {
                    id: 'skin-login-body-clean-hover-color',
                    name: '登录清理按钮Hover字体颜色',
                    type: 'color',
                    color: '',
                },
                skinLoginItemMobileIconBackground: {
                    id: 'skin-login-item-mobile-icon-background',
                    name: '登录手机图标背景色',
                    type: 'background',
                    color: '',
                },
            }

            // 过滤type=shadow类型，暂不支持
            let settingFields = Object.keys(settingFieldsMap).filter((key) => {
                return settingFieldsMap[key].type !== 'shadow'
            })

            const propertyKeys = []
            settingFields.forEach((key) => {
                propertyKeys.push({
                    key: key, value: settingFieldsMap[key].id
                })
            })
            // 初始值
            let propertyValues = window.tl_rtc_app_comm.getPropertyValues(propertyKeys)

            let skinList = []
            settingFields.forEach((key) => {
                skinList.push({
                    id: settingFieldsMap[key].id,
                    key: key,
                    name: settingFieldsMap[key].name,
                    color: propertyValues[key]
                })
            })

            this.loginSkinList = [...skinList]
            this.settingFields.push(...settingFields)

            this.renderSkinColorPicker(this.loginSkinList)
        },
        /**
        * 初始化设置皮肤设置
        */
        initSettingSkinList: function(){
            let settingFieldsMap = {
                skinSettingListItemHoverBackground: {
                    id: 'skin-setting-list-item-hover-background',
                    name: '设置列表项Hover背景色',
                    type: 'background',
                    color: '',
                },
                skinSettingListItemActiveBackground: {
                    id: 'skin-setting-list-item-active-background',
                    name: '设置列表项激活背景色',
                    type: 'background',
                    color: '',
                },
                skinSettingTopSearchIColor: {
                    id: 'skin-setting-top-search-i-color',
                    name: '设置顶部搜索图标字体颜色',
                    type: 'color',
                    color: '',
                },
                skinSettingTopSearchInputBackground: {
                    id: 'skin-setting-top-search-input-background',
                    name: '设置顶部搜索输入背景色',
                    type: 'background',
                    color: '',
                },
                skinSettingTopSearchInputColor: {
                    id: 'skin-setting-top-search-input-color',
                    name: '设置顶部搜索输入字体颜色',
                    type: 'color',
                    color: '',
                },
                skinSettingContentTopExportBackground: {
                    id: 'skin-setting-content-top-export-background',
                    name: '设置内容顶部导出背景色',
                    type: 'background',
                    color: '',
                },
                skinSettingContentTopExportFillColor: {
                    id: 'skin-setting-content-top-export-fill-color',
                    name: '设置内容顶部导出SVG字体颜色',
                    type: 'background',
                    color: '',
                },
                skinSettingContentBlockBackground: {
                    id: 'skin-setting-content-block-background',
                    name: '设置内容块背景色',
                    type: 'background',
                    color: '',
                },
                skinSettingContentBlockBadgeBackground: {
                    id: 'skin-setting-content-block-badge-background',
                    name: '设置内容块徽章背景色',
                    type: 'background',
                    color: '',
                },
                skinSettingContentBlockBadgeColor: {
                    id: 'skin-setting-content-block-badge-color',
                    name: '设置内容块徽章字体颜色',
                    type: 'color',
                    color: '',
                },
                skinSettingContentBlockBadgeHoverBackground: {
                    id: 'skin-setting-content-block-badge-hover-background',
                    name: '设置内容块徽章Hover背景色',
                    type: 'background',
                    color: '',
                },
                skinSettingContentBlockBadgeHoverColor: {
                    id: 'skin-setting-content-block-badge-hover-color',
                    name: '设置内容块徽章Hover字体颜色',
                    type: 'color',
                    color: '',
                },
                skinSettingContentBlockItemHoverBackground: {
                    id: 'skin-setting-content-block-item-hover-background',
                    name: '设置内容块项目Hover背景色',
                    type: 'background',
                    color: '',
                },
                skinSettingContentBindIconHoverColor: {
                    id: 'skin-setting-content-bind-icon-hover-color',
                    name: '设置内容绑定图标Hover字体颜色',
                    type: 'color',
                    color: '',
                },
                skinSettingContentBindIconTipFillColor: {
                    id: 'skin-setting-content-bind-icon-tip-fill-color',
                    name: '设置内容绑定图标提示SVG字体颜色',
                    type: 'fill-color',
                    color: '',
                },
                skinSettingContentPreviewItemSvgBackground: {
                    id: 'skin-setting-content-preview-item-svg-background',
                    name: '设置配色预览SVG背景色',
                    type: 'background',
                    color: '',
                },
                skinSettingContentPreviewItemSvgHoverBackground: {
                    id: 'skin-setting-content-preview-item-svg-hover-background',
                    name: '设置配色预览SVGHover背景色',
                    type: 'background',
                    color: '',
                },
                skinSettingContentAccountBindEmailBtnBackground: {
                    id: 'skin-setting-content-account-bind-email-btn-background',
                    name: '设置内容账号绑定邮箱按钮背景色',
                    type: 'background',
                    color: '',
                },
                skinSettingContentAccountBindEmailBtnColor: {
                    id: 'skin-setting-content-account-bind-email-btn-color',
                    name: '设置内容账号绑定邮箱按钮字体颜色',
                    type: 'color',
                    color: '',
                },
                skinSettingContentAccountBindEmailInputBackground: {
                    id: 'skin-setting-content-account-bind-email-input-background',
                    name: '设置内容账号绑定邮箱输入框背景色',
                    type: 'background',
                    color: '',
                },
                skinSettingContentAccountBindEmailInputColor: {
                    id: 'skin-setting-content-account-bind-email-input-color',
                    name: '设置内容账号绑定邮箱输入框字体颜色',
                    type: 'color',
                    color: '',
                },
                skinSettingContentAccountBindEmailBtnDisabledBackground: {
                    id: 'skin-setting-content-account-bind-email-btn-disabled-background',
                    name: '设置内容账号绑定邮箱按钮禁用背景色',
                    type: 'background',
                    color: '',
                },
                skinSettingContentAccountBindEmailBtnDisabledColor: {
                    id: 'skin-setting-content-account-bind-email-btn-disabled-color',
                    name: '设置内容账号绑定邮箱按钮禁用字体颜色',
                    type: 'color',
                    color: '',
                },
            }

            // 过滤type=shadow类型，暂不支持
            let settingFields = Object.keys(settingFieldsMap).filter((key) => {
                return settingFieldsMap[key].type !== 'shadow'
            })

            const propertyKeys = []
            settingFields.forEach((key) => {
                propertyKeys.push({
                    key: key, value: settingFieldsMap[key].id
                })
            })
            // 初始值
            let propertyValues = window.tl_rtc_app_comm.getPropertyValues(propertyKeys)

            let skinList = []
            settingFields.forEach((key) => {
                skinList.push({
                    id: settingFieldsMap[key].id,
                    key: key,
                    name: settingFieldsMap[key].name,
                    color: propertyValues[key]
                })
            })

            this.settingSkinList = [...skinList]
            this.settingFields.push(...settingFields)

            this.renderSkinColorPicker(this.settingSkinList)
        },
        /**
        * 初始化频道历史消息皮肤设置
        */
        initChannelHistoryMessageSkinList: function(){
            let settingFieldsMap = {
                skinChannelHistoryMessageTopSearchIColor: {
                    id: 'skin-channel-history-message-top-search-i-color',
                    name: '频道历史消息顶部搜索图标字体颜色',
                    type: 'color',
                    color: '',
                },
                skinChannelHistoryMessageTopSearchInputBackground: {
                    id: 'skin-channel-history-message-top-search-input-background',
                    name: '频道历史消息顶部搜索输入背景',
                    type: 'background',
                    color: '',
                },
                skinChannelHistoryMessageTopSearchInputColor: {
                    id: 'skin-channel-history-message-top-search-input-color',
                    name: '频道历史消息顶部搜索输入字体颜色',
                    type: 'color',
                    color: '',
                },
                skinChannelHistoryMessageHeaderToolItemTitleColor: {
                    id: 'skin-channel-history-message-header-tool-item-title-color',
                    name: '频道历史消息头部工具项标题字体颜色',
                    type: 'color',
                    color: '',
                },
                skinChannelHistoryMessageSearchParamBadgeColor: {
                    id: 'skin-channel-history-message-search-param-badge-color',
                    name: '频道历史消息搜索参数徽章字体颜色',
                    type: 'color',
                    color: '',
                },
                skinChannelHistoryMessageSearchParamBadgeHoverBackground: {
                    id: 'skin-channel-history-message-search-param-badge-hover-background',
                    name: '频道历史消息搜索参数徽章Hover背景',
                    type: 'background',
                    color: '',
                },
                skinChannelHistoryMessageSearchParamBadgeHoverColor: {
                    id: 'skin-channel-history-message-search-param-badge-hover-color',
                    name: '频道历史消息搜索参数徽章Hover字体颜色',
                    type: 'color',
                    color: '',
                },
                skinChannelHistoryMessageSearchParamBadgeActiveBackground: {
                    id: 'skin-channel-history-message-search-param-badge-active-background',
                    name: '频道历史消息搜索参数徽章激活背景',
                    type: 'background',
                    color: '',
                },
                skinChannelHistoryMessageSearchParamBadgeActiveColor: {
                    id: 'skin-channel-history-message-search-param-badge-active-color',
                    name: '频道历史消息搜索参数徽章激活字体颜色',
                    type: 'color',
                    color: '',
                },
                skinChannelHistoryMessageListItemTimeColor: {
                    id: 'skin-channel-history-message-list-item-time-color',
                    name: '频道历史消息列表项时间字体颜色',
                    type: 'color',
                    color: '',
                },
                skinChannelHistoryMessageContentBodyMessageBackground: {
                    id: 'skin-channel-history-message-content-body-message-background',
                    name: '频道历史消息内容主体消息背景',
                    type: 'background',
                    color: '',
                },
                skinChannelHistoryMessageContentBodyMessageColor: {
                    id: 'skin-channel-history-message-content-body-message-color',
                    name: '频道历史消息内容主体消息字体颜色',
                    type: 'color',
                    color: '',
                },
                skinChannelHistoryMessageFooterTotalColor: {
                    id: 'skin-channel-history-message-footer-total-color',
                    name: '频道历史消息页脚总计字体颜色',
                    type: 'color',
                    color: '',
                },
                skinChannelHistoryMessageFooterLoadMoreColor: {
                    id: 'skin-channel-history-message-footer-load-more-color',
                    name: '频道历史消息页脚加载更多字体颜色',
                    type: 'color',
                    color: '',
                },
                skinChannelHistoryMessageFooterLoadMoreHoverColor: {
                    id: 'skin-channel-history-message-footer-load-more-hover-color',
                    name: '频道历史消息页脚加载更多Hover字体颜色',
                    type: 'color',
                    color: '',
                }
            }

            // 过滤type=shadow类型，暂不支持
            let settingFields = Object.keys(settingFieldsMap).filter((key) => {
                return settingFieldsMap[key].type !== 'shadow'
            })

            const propertyKeys = []
            settingFields.forEach((key) => {
                propertyKeys.push({
                    key: key, value: settingFieldsMap[key].id
                })
            })
            // 初始值
            let propertyValues = window.tl_rtc_app_comm.getPropertyValues(propertyKeys)

            let skinList = []
            settingFields.forEach((key) => {
                skinList.push({
                    id: settingFieldsMap[key].id,
                    key: key,
                    name: settingFieldsMap[key].name,
                    color: propertyValues[key]
                })
            })

            this.channelHistoryMessageSkinList = [...skinList]
            this.settingFields.push(...settingFields)

            this.renderSkinColorPicker(this.channelHistoryMessageSkinList)
        },
        /**
        * 初始化表情弹窗皮肤设置
        */
        initFaceSkinList: function(){
            let settingFieldsMap = {
                skinFaceItemHoverBackground: {
                    id: 'skin-face-item-hover-background',
                    name: '表情项Hover背景色',
                    type: 'background',
                    color: '',
                },
                skinFaceItemHoverColor: {
                    id: 'skin-face-item-hover-color',
                    name: '表情项Hover字体颜色',
                    type: 'color',
                    color: '',
                },
                skinFaceTabBackground: {
                    id: 'skin-face-tab-background',
                    name: '表情Tab背景色',
                    type: 'background',
                    color: '',
                },
                skinFaceTabColor: {
                    id: 'skin-face-tab-color',
                    name: '表情Tab字体颜色',
                    type: 'color',
                    color: '',
                },
                skinFaceTabHoverBackground: {
                    id: 'skin-face-tab-hover-background',
                    name: '表情TabHover背景色',
                    type: 'background',
                    color: '',
                },
                skinFaceTabHoverColor: {
                    id: 'skin-face-tab-hover-color',
                    name: '表情TabHover字体颜色',
                    type: 'color',
                    color: '',
                },
                skinFaceSearchInputBackground: {
                    id: 'skin-face-search-input-background',
                    name: '表情搜索输入背景色',
                    type: 'background',
                    color: '',
                },
                skinFaceSearchInputColor: {
                    id: 'skin-face-search-input-color',
                    name: '表情搜索输入字体颜色',
                    type: 'color',
                    color: '',
                },
                skinFaceContentTitleColor: {
                    id: 'skin-face-content-title-color',
                    name: '表情内容标题字体颜色',
                    type: 'color',
                    color: '',
                },
            }

            // 过滤type=shadow类型，暂不支持
            let settingFields = Object.keys(settingFieldsMap).filter((key) => {
                return settingFieldsMap[key].type !== 'shadow'
            })

            const propertyKeys = []
            settingFields.forEach((key) => {
                propertyKeys.push({
                    key: key, value: settingFieldsMap[key].id
                })
            })
            // 初始值
            let propertyValues = window.tl_rtc_app_comm.getPropertyValues(propertyKeys)

            let skinList = []
            settingFields.forEach((key) => {
                skinList.push({
                    id: settingFieldsMap[key].id,
                    key: key,
                    name: settingFieldsMap[key].name,
                    color: propertyValues[key]
                })
            })

            this.faceSkinList = [...skinList]
            this.settingFields.push(...settingFields)

            this.renderSkinColorPicker(this.faceSkinList)
        },
        /**
         * 获取设置字段数据
         * @returns 
         */
        getSettingFieldsData: function(skinListBatch, global){
            let that = this
            let returnData = {}

            if(global){
                returnData['global'] = global
            }

            if(!skinListBatch || skinListBatch.length === 0){
                return returnData
            }

            skinListBatch.forEach((skinList) => {
                that.settingFields.forEach((key) => {
                    let itemSkin = skinList.find((skin) => skin.key === key)
                    if(!itemSkin){
                        return
                    }
                    returnData[key] = itemSkin.color
                })
            })
            
            return returnData
        },
        /**
         * 更新设置
         */
         updateSkinSetting(skinListBatch){
            this.$emit('update-user-config-skin', this.getSettingFieldsData(skinListBatch));
        },
        /**
         * 更新设置
         */
        updateSkinSettingWithGlobal(skinListBatch){
            this.$emit('update-user-config-skin', this.getSettingFieldsData(skinListBatch, this.propsSkinSetting.global));
        },
        /**
         * 切换全局皮肤
         */
        changeGlobalSkin: async function(type){
            this.propsSkinSetting.global = type;
            if(type === 'light'){
                 this.importSkinHandler(await this.getLightSkin())
            }else if(type === 'dark'){
                 this.importSkinHandler(await this.getDarkSkin())
            }else if(type === 'system'){
                // this.listenAutoChangeSkin()
            }
        },
        /**
         * 快速切换全局皮肤
         * @param {*} callback
         */
        changeGlobalSkinQuick: async function({
            callback
        }){
            if(this.propsSkinSetting.global === 'light'){
                await this.changeGlobalSkin('dark')
            }else if(this.propsSkinSetting.global === 'dark'){
                await this.changeGlobalSkin('light')
            }

            callback && callback()
        },
        /**
         * 监听系统自动切换皮肤处理函数
         * @param {*} event 
         */
        autoChangeSkinHandler: function(event){
            let prefersDarkMode = null
            if(!event){
                let media = window.matchMedia('(prefers-color-scheme: dark)');
                prefersDarkMode = media.matches;
            }else{
                prefersDarkMode = event.matches;
            }

            if (prefersDarkMode) {
                console.log('dark mode');
            }else{
                console.log('light mode');
            }

            if(this.propsSkinSetting.global === 'system'){
                this.listenAutoChangeSkin()
            }
        },
        /**
         * 监听系统自动切换皮肤
         */
        listenAutoChangeSkin: function(){
            let that = this;
            if(this.hasListenedSkinChange){
                return
            }

            let media = window.matchMedia('(prefers-color-scheme: dark)');

            if (typeof media.addEventListener === 'function') {
                media.addEventListener('change', function(event){
                    that.autoChangeSkinHandler(event)
                });

                that.hasListenedSkinChange = true
            } else if (typeof media.addListener === 'function') {
                media.addListener(function(event){
                    that.autoChangeSkinHandler(event)
                });
                that.hasListenedSkinChange = true
            }
        },
        /**
        * 渲染皮肤颜色选择器
        * @param {Array} skinList 皮肤列表
        * @param {Boolean} useDefault 是否使用默认颜色
        */
        renderSkinColorPicker: function(skinList, useDefault = true){
            let that = this;
            skinList.forEach(item => {
                if(useDefault){
                    // 优先使用用户设置的字体颜色
                    let color = this.propsSkinSetting[item.key]
                    if(color !== '' && color !== undefined && color !== null) {
                        item.color = color;
                        document.documentElement.style.setProperty(`--${item.id}`, color);
                    }
                }else{
                    // 否则使用默认的
                    if(item.color !== '' && item.color !== undefined && item.color !== null) {
                        document.documentElement.style.setProperty(`--${item.id}`, item.color);
                    }
                }
            })

            this.$nextTick(() => {
                skinList.forEach(item => {
                    colorpicker.render({
                        elem: '#' + item.id,
                        size: 'xs',
                        predefine: true,
                        color: item.color,
                        alpha: true, 
                        colors: [
                            '#959595', '#FFFFFF', '#000000', '#FF6900', 
                            '#FCB900', '#7BDCB5', '#00D084',
                            '#8ED1FC', '#0693E3', '#ABB8C3', '#F78DA7'
                        ],
                        change: function(color){
                            const isLightColor = window.tl_rtc_app_comm.isLightColor(color);
    
                            item.color = color;
                            document.documentElement.style.setProperty(`--${item.id}`, color);
                            const domId = document.getElementById(item.id);
                            // 找到domId下的i标签设置color
                            if(domId){
                                const iDom = domId.querySelector('i');
                                if(iDom){
                                    iDom.style.color = isLightColor ? '#000000' : '#ffffff';
                                }
                            }
                        },
                        done: function(color){
                            that.propsSkinSetting[item.key] = color
                            that.updateSkinSetting([skinList]);
                        },
                    });
                })
            })

            this.$forceUpdate();
        },
        /**
         * 获取浅色主题皮肤
         */
        getLightSkin: async function(){
            let params = {
                skin: 'light'
            }
            if(!window.tl_rtc_app_comm.checkRequestParams(params)){
                this.popErrorMsg("请求参数非法")
                return
            }

            const { data: skinRes } = await this.tlRequest({
                url: '/api/web/config-skin/get-detail',
                method: 'get',
                useCache: true,
                params: params,
                cacheTime: 10 * 1000
            })
            if(!skinRes.success){
                this.popErrorMsg(skinRes.msg)
                return
            }

            let skinData = skinRes.data
            return skinData.replace(/\s/g, '')
        },
        /**
         * 获取深色主题皮肤
         */
        getDarkSkin: async function(){
            let params = {
                skin: 'dark'
            }
            if(!window.tl_rtc_app_comm.checkRequestParams(params)){
                this.popErrorMsg("请求参数非法")
                return
            }

            const { data: skinRes } = await this.tlRequest({
                url: '/api/web/config-skin/get-detail',
                method: 'get',
                useCache: true,
                params: params,
                cacheTime: 10 * 1000
            })
            if(!skinRes.success){
                this.popErrorMsg(skinRes.msg)
                return
            }

            let skinData = skinRes.data
            return skinData.replace(/\s/g, '')
        },
        /**
         * 导出当前皮肤设置
         */
        exportSkinSetting: function(){
            let that = this;
            let contentJson = JSON.stringify({
                commSkinMap: this.getSettingFieldsData([this.commSkinList]),
                sidebarSkinMap: this.getSettingFieldsData([this.sidebarSkinList]),
                channelSkinMap: this.getSettingFieldsData([this.channelSkinList]),
                contactSkinMap: this.getSettingFieldsData([this.contactSkinList]),
                loginSkinMap: this.getSettingFieldsData([this.loginSkinList]),
                settingSkinMap: this.getSettingFieldsData([this.settingSkinList]),

                channelMoreSkinMap: this.getSettingFieldsData([this.channelMoreSkinList]),
                channelInviteSkinMap: this.getSettingFieldsData([this.channelInviteSkinList]),
                channelNoticeSkinMap: this.getSettingFieldsData([this.channelNoticeSkinList]),
                quickOperSkinMap: this.getSettingFieldsData([this.quickOperSkinList]),
                mediaSkinMap: this.getSettingFieldsData([this.mediaSkinList]),
                faceSkinMap: this.getSettingFieldsData([this.faceSkinList]),
                layerMsgSkinMap: this.getSettingFieldsData([this.layerMsgSkinList]),
                channelHistoryMessageSkinMap: this.getSettingFieldsData([this.channelHistoryMessageSkinList]),
            })

            let content = Base64.encode(contentJson)
            window.tl_rtc_app_comm.copyTxt('setting-skin-export', content, function(){
                that.popSuccessMsg('皮肤设置已复制到剪贴板');
            })
        },
        /**
         * 导入皮肤设置
         */
        importSkinSetting: function(){
            let that = this;
            layer.prompt({
                formType: 2,
                title: "导入皮肤设置",
                btn : ['确定', '取消'],
                value: "",
                maxlength: 100000,
                shadeClose : true,
            }, async function (value, index, elem) {
                let ok = that.importSkinHandler(value)
                if(!ok){
                    return false
                }

                layer.close(index)
                return false
            });
        },
        /**
         * 导入皮肤设置处理
         * @param {*} skin 
         * @returns 
         */
        importSkinHandler: function(skin){
            let content = ''
            try{
                content = JSON.parse(Base64.decode(skin))
            }catch(e){
                this.popErrorMsg('皮肤设置格式错误: 解析错误');
                return false
            }

            if(!content){
                this.popErrorMsg('皮肤设置格式错误: 内容错误');
                return false
            }

            const {
                commSkinMap,

                sidebarSkinMap,
                channelSkinMap,
                contactSkinMap,
                loginSkinMap,
                settingSkinMap,
                layerMsgSkinMap,
                quickOperSkinMap,
                mediaSkinMap,
                faceSkinMap,
                channelHistoryMessageSkinMap,
                channelMoreSkinMap,
                channelInviteSkinMap,
                channelNoticeSkinMap,
            } = content

            let updateSkinBatch = []

            if(commSkinMap && Object.keys(commSkinMap).length > 0){
                this.commSkinList.forEach((item) => {
                    item.color = commSkinMap[item.key]
                })
                this.renderSkinColorPicker(this.commSkinList, false)
                updateSkinBatch.push(this.commSkinList)
            }

            if(sidebarSkinMap && Object.keys(sidebarSkinMap).length > 0){
                this.sidebarSkinList.forEach((item) => {
                    item.color = sidebarSkinMap[item.key]
                })
                this.renderSkinColorPicker(this.sidebarSkinList, false)
                updateSkinBatch.push(this.sidebarSkinList)
            }

            if(channelSkinMap && Object.keys(channelSkinMap).length > 0){
                this.channelSkinList.forEach((item) => {
                    item.color = channelSkinMap[item.key]
                })
                this.renderSkinColorPicker(this.channelSkinList, false)
                updateSkinBatch.push(this.channelSkinList)
            }

            if(contactSkinMap && Object.keys(contactSkinMap).length > 0){
                this.contactSkinList.forEach((item) => {
                    item.color = contactSkinMap[item.key]
                })
                this.renderSkinColorPicker(this.contactSkinList, false)
                updateSkinBatch.push(this.contactSkinList)
            }

            if(loginSkinMap && Object.keys(loginSkinMap).length > 0){
                this.loginSkinList.forEach((item) => {
                    item.color = loginSkinMap[item.key]
                })
                this.renderSkinColorPicker(this.loginSkinList, false)
                updateSkinBatch.push(this.loginSkinList)
            }

            if(settingSkinMap && Object.keys(settingSkinMap).length > 0){
                this.settingSkinList.forEach((item) => {
                    item.color = settingSkinMap[item.key]
                })
                this.renderSkinColorPicker(this.settingSkinList, false)
                updateSkinBatch.push(this.settingSkinList)
            }

            if(layerMsgSkinMap && Object.keys(layerMsgSkinMap).length > 0){
                this.layerMsgSkinList.forEach((item) => {
                    item.color = layerMsgSkinMap[item.key]
                })
                this.renderSkinColorPicker(this.layerMsgSkinList, false)
                updateSkinBatch.push(this.layerMsgSkinList)
            }

            if(quickOperSkinMap && Object.keys(quickOperSkinMap).length > 0){
                this.quickOperSkinList.forEach((item) => {
                    item.color = quickOperSkinMap[item.key]
                })
                this.renderSkinColorPicker(this.quickOperSkinList, false)
                updateSkinBatch.push(this.quickOperSkinList)
            }

            if(mediaSkinMap && Object.keys(mediaSkinMap).length > 0){
                this.mediaSkinList.forEach((item) => {
                    item.color = mediaSkinMap[item.key]
                })
                this.renderSkinColorPicker(this.mediaSkinList, false)
                updateSkinBatch.push(this.mediaSkinList)
            }

            if(faceSkinMap && Object.keys(faceSkinMap).length > 0){
                this.faceSkinList.forEach((item) => {
                    item.color = faceSkinMap[item.key]
                })
                this.renderSkinColorPicker(this.faceSkinList, false)
                updateSkinBatch.push(this.faceSkinList)
            }

            if(channelHistoryMessageSkinMap && Object.keys(channelHistoryMessageSkinMap).length > 0){
                this.channelHistoryMessageSkinList.forEach((item) => {
                    item.color = channelHistoryMessageSkinMap[item.key]
                })
                this.renderSkinColorPicker(this.channelHistoryMessageSkinList, false)
                updateSkinBatch.push(this.channelHistoryMessageSkinList)
            }

            if(channelMoreSkinMap && Object.keys(channelMoreSkinMap).length > 0){
                this.channelMoreSkinList.forEach((item) => {
                    item.color = channelMoreSkinMap[item.key]
                })
                this.renderSkinColorPicker(this.channelMoreSkinList, false)
                updateSkinBatch.push(this.channelMoreSkinList)
            }

            if(channelInviteSkinMap && Object.keys(channelInviteSkinMap).length > 0){
                this.channelInviteSkinList.forEach((item) => {
                    item.color = channelInviteSkinMap[item.key]
                })
                this.renderSkinColorPicker(this.channelInviteSkinList, false)
                updateSkinBatch.push(this.channelInviteSkinList)
            }

            if(channelNoticeSkinMap && Object.keys(channelNoticeSkinMap).length > 0){
                this.channelNoticeSkinList.forEach((item) => {
                    item.color = channelNoticeSkinMap[item.key]
                })
                this.renderSkinColorPicker(this.channelNoticeSkinList, false)
                updateSkinBatch.push(this.channelNoticeSkinList)
            }

            if(updateSkinBatch.length > 0){
                this.updateSkinSettingWithGlobal(updateSkinBatch);
            }

            return true
        },
        mouseEnter: function(event, msg){
            if(this.propsIsMobile){
                return
            }
            tl_rtc_app_comm.mouseEnterTips({
                id: event.target.id,
                text: msg,
                position: 'top'
            });
        },
        mouseLeave: function(){
            if(this.propsIsMobile){
                return
            }
            tl_rtc_app_comm.mouseLeaveTips();
        },
    },
    mounted() {
        window.form.render();

        this.initCommSkinList()
        this.initSidebarSkinList()
        this.initChannelSkinList()
        this.initContactSkinList()
        this.initLoginSkinList()
        this.initSettingSkinList()

        this.initLayerMsgSkinList()
        this.initQuickOperSkinList()
        this.initMediaSkinList()
        this.initChannelHistoryMessageSkinList()
        this.initChannelMoreSkinList()
        this.initChannelInviteSkinList()
        this.initChannelNoticeSkinList()
        this.initFaceSkinList()

        // 处理主题色
        this.autoChangeSkinHandler()

        this.$forceUpdate();
    },
    created(){
        // 监听全局皮肤变化
        window.subModule.$on('sub-module-setting-skin-change-global', this.changeGlobalSkinQuick);
    },
    watch: {
        
    },
    component: {
        ContentLoader: contentLoaders.ContentLoader,
        FacebookLoader: contentLoaders.FacebookLoader,
        CodeLoader: contentLoaders.CodeLoader,
        BulletListLoader: contentLoaders.BulletListLoader,
        InstagramLoader: contentLoaders.InstagramLoader,
        ListLoader: contentLoaders.ListLoader,
    },
    template: `
        <div <div style="padding: 5px 0px; height: 100%;">
            <div class="tl-rtc-app-right-setting-content-top">
                <div class="tl-rtc-app-right-setting-content-top-title">
                    皮肤相关设置
                </div>
                <div class="tl-rtc-app-right-setting-content-top-export">
                    <svg class="icon" aria-hidden="true" 
                        @click="importSkinSetting"
                        id="setting-skin-import"
                        @mouseenter="mouseEnter(event, '导入皮肤')"
                        @mouseleave="mouseLeave"
                    >
                        <use xlink:href="#tl-rtc-app-icon-daoru"></use>
                    </svg>
                    <svg class="icon" aria-hidden="true" style=" margin-left: 15px;width: 15px;height: 15px;" 
                        id='setting-skin-export' 
                        @click="exportSkinSetting"
                        @mouseenter="mouseEnter(event, '导出皮肤')"
                        @mouseleave="mouseLeave"
                    >
                        <use xlink:href="#tl-rtc-app-icon-daochu"></use>
                    </svg>
                </div>
            </div>

            <div class="tl-rtc-app-right-setting-content-skin layui-form" lay-filter="settingContent">
                <div class="tl-rtc-app-right-setting-content-skin-block">
                    <div class="tl-rtc-app-right-setting-content-skin-block-title">主题设置</div>
                    <div class="tl-rtc-app-right-setting-content-skin-block-content">
                        <div class="tl-rtc-app-right-setting-content-skin-block-item" @click="changeGlobalSkin('light')"
                            :class="(propsSkinSetting.global === 'light' || propsSkinSetting.global === '') ? 'tl-rtc-app-right-setting-content-skin-block-item-active' : ''"
                        >
                            <div class="tl-rtc-app-right-setting-content-skin-block-item-title"> 浅色主题 </div>
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#tl-rtc-app-icon-mingliangmoshi"></use>
                            </svg>
                        </div>

                        <div class="tl-rtc-app-right-setting-content-skin-block-item" @click="changeGlobalSkin('dark')"
                            :class="propsSkinSetting.global === 'dark' ? 'tl-rtc-app-right-setting-content-skin-block-item-active' : ''"
                        >
                            <div class="tl-rtc-app-right-setting-content-skin-block-item-title"> 深色主题 </div>
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#tl-rtc-app-icon-anhei"></use>
                            </svg>
                        </div>

                        <div class="tl-rtc-app-right-setting-content-skin-block-item" @click="changeGlobalSkin('system')" style="display: none;"
                            :class="propsSkinSetting.global === 'system' ? 'tl-rtc-app-right-setting-content-skin-block-item-active' : ''"
                        >
                            <div class="tl-rtc-app-right-setting-content-skin-block-item-title"> 跟随系统 </div>
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#tl-rtc-app-icon-gensuixitong-followsystem-line"></use>
                            </svg>
                        </div>
                    </div>
                </div>

                <div class="tl-rtc-app-right-setting-content-skin-block-custom">
                    <div class="tl-rtc-app-right-setting-content-skin-block-custom-title">
                        <span>自定义配色-全局</span>
                        <svg class="icon" aria-hidden="true" @click="changePreviewType('global')">
                            <use xlink:href="#tl-rtc-app-icon-yulan"></use>
                        </svg>
                    </div>
                    <div class="tl-rtc-app-right-setting-content-skin-block-custom-content">
                        <div class="tl-rtc-app-right-setting-content-skin-block-custom-item" v-for="item in commSkinList">
                            <div class="tl-rtc-app-right-setting-content-skin-block-custom-item-title"> 
                                <span>{{item.name}}</span>
                            </div>
                            <div class="tl-rtc-app-right-setting-content-skin-block-custom-item-oper">
                                <div :id="item.id" :style="'background:' + item.color">
                                    {{item.color}}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="tl-rtc-app-right-setting-content-skin-block-custom">
                    <div class="tl-rtc-app-right-setting-content-skin-block-custom-title">
                        <span>自定义配色-侧边栏</span>
                        <svg class="icon" aria-hidden="true" @click="changePreviewType('sidebar')">
                            <use xlink:href="#tl-rtc-app-icon-yulan"></use>
                        </svg>
                    </div>
                    <div class="tl-rtc-app-right-setting-content-skin-block-custom-content">
                        <div class="tl-rtc-app-right-setting-content-skin-block-custom-item" v-for="item in sidebarSkinList">
                            <div class="tl-rtc-app-right-setting-content-skin-block-custom-item-title"> 
                                <span>{{item.name}}</span>
                            </div>
                            <div class="tl-rtc-app-right-setting-content-skin-block-custom-item-oper">
                                <div :id="item.id" :style="'background:' + item.color">
                                    {{item.color}}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="tl-rtc-app-right-setting-content-skin-block-custom">
                    <div class="tl-rtc-app-right-setting-content-skin-block-custom-title">
                        <span>自定义配色-聊天界面</span>
                        <svg class="icon" aria-hidden="true" @click="changePreviewType('channel')">
                            <use xlink:href="#tl-rtc-app-icon-yulan"></use>
                        </svg>
                    </div>
                    <div class="tl-rtc-app-right-setting-content-skin-block-custom-content">
                        <div class="tl-rtc-app-right-setting-content-skin-block-custom-item" v-for="item in channelSkinList">
                            <div class="tl-rtc-app-right-setting-content-skin-block-custom-item-title"> 
                                <span>{{item.name}}</span>
                            </div>
                            <div class="tl-rtc-app-right-setting-content-skin-block-custom-item-oper">
                                <div :id="item.id" :style="'background:' + item.color">
                                    {{item.color}}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="tl-rtc-app-right-setting-content-skin-block-custom">
                    <div class="tl-rtc-app-right-setting-content-skin-block-custom-title">
                        <span>自定义配色-通讯录</span>
                        <svg class="icon" aria-hidden="true" @click="changePreviewType('contact')">
                            <use xlink:href="#tl-rtc-app-icon-yulan"></use>
                        </svg>
                    </div>
                    <div class="tl-rtc-app-right-setting-content-skin-block-custom-content">
                        <div class="tl-rtc-app-right-setting-content-skin-block-custom-item" v-for="item in contactSkinList">
                            <div class="tl-rtc-app-right-setting-content-skin-block-custom-item-title"> 
                                <span>{{item.name}}</span>
                            </div>
                            <div class="tl-rtc-app-right-setting-content-skin-block-custom-item-oper">
                                <div :id="item.id" :style="'background:' + item.color">
                                    {{item.color}}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="tl-rtc-app-right-setting-content-skin-block-custom">
                    <div class="tl-rtc-app-right-setting-content-skin-block-custom-title">
                        <span>自定义配色-设置中心</span>
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#tl-rtc-app-icon-yulan"></use>
                        </svg>
                    </div>
                    <div class="tl-rtc-app-right-setting-content-skin-block-custom-content">
                        <div class="tl-rtc-app-right-setting-content-skin-block-custom-item" v-for="item in settingSkinList">
                            <div class="tl-rtc-app-right-setting-content-skin-block-custom-item-title">
                                <span>{{item.name}}</span>
                            </div>
                            <div class="tl-rtc-app-right-setting-content-skin-block-custom-item-oper">
                                <div :id="item.id" :style="'background:' + item.color">
                                    {{item.color}}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="tl-rtc-app-right-setting-content-skin-block-custom">
                    <div class="tl-rtc-app-right-setting-content-skin-block-custom-title">
                        <span>自定义配色-登录界面</span>
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#tl-rtc-app-icon-yulan"></use>
                        </svg>
                    </div>
                    <div class="tl-rtc-app-right-setting-content-skin-block-custom-content">
                        <div class="tl-rtc-app-right-setting-content-skin-block-custom-item" v-for="item in loginSkinList">
                            <div class="tl-rtc-app-right-setting-content-skin-block-custom-item-title">
                                <span>{{item.name}}</span>
                            </div>
                            <div class="tl-rtc-app-right-setting-content-skin-block-custom-item-oper">
                                <div :id="item.id" :style="'background:' + item.color">
                                    {{item.color}}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="tl-rtc-app-right-setting-content-skin-block-custom">
                    <div class="tl-rtc-app-right-setting-content-skin-block-custom-title">
                        <span>自定义配色-表情选择弹窗</span>
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#tl-rtc-app-icon-yulan"></use>
                        </svg>
                    </div>
                    <div class="tl-rtc-app-right-setting-content-skin-block-custom-content">
                        <div class="tl-rtc-app-right-setting-content-skin-block-custom-item" v-for="item in faceSkinList">
                            <div class="tl-rtc-app-right-setting-content-skin-block-custom-item-title"> 
                                <span>{{item.name}}</span>
                            </div>
                            <div class="tl-rtc-app-right-setting-content-skin-block-custom-item-oper">
                                <div :id="item.id" :style="'background:' + item.color">
                                    {{item.color}}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="tl-rtc-app-right-setting-content-skin-block-custom">
                    <div class="tl-rtc-app-right-setting-content-skin-block-custom-title">
                        <span>自定义配色-快捷面板</span>
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#tl-rtc-app-icon-yulan"></use>
                        </svg>
                    </div>
                    <div class="tl-rtc-app-right-setting-content-skin-block-custom-content">
                        <div class="tl-rtc-app-right-setting-content-skin-block-custom-item" v-for="item in quickOperSkinList">
                            <div class="tl-rtc-app-right-setting-content-skin-block-custom-item-title"> 
                                <span>{{item.name}}</span>
                            </div>
                            <div class="tl-rtc-app-right-setting-content-skin-block-custom-item-oper">
                                <div :id="item.id" :style="'background:' + item.color">
                                    {{item.color}}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="tl-rtc-app-right-setting-content-skin-block-custom">
                    <div class="tl-rtc-app-right-setting-content-skin-block-custom-title">
                        <span>自定义配色-频道历史消息面板</span>
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#tl-rtc-app-icon-yulan"></use>
                        </svg>
                    </div>
                    <div class="tl-rtc-app-right-setting-content-skin-block-custom-content">
                        <div class="tl-rtc-app-right-setting-content-skin-block-custom-item" v-for="item in channelHistoryMessageSkinList">
                            <div class="tl-rtc-app-right-setting-content-skin-block-custom-item-title"> 
                                <span>{{item.name}}</span>
                            </div>
                            <div class="tl-rtc-app-right-setting-content-skin-block-custom-item-oper">
                                <div :id="item.id" :style="'background:' + item.color">
                                    {{item.color}}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="tl-rtc-app-right-setting-content-skin-block-custom">
                    <div class="tl-rtc-app-right-setting-content-skin-block-custom-title">
                        <span>自定义配色-频道更多面板</span>
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#tl-rtc-app-icon-yulan"></use>
                        </svg>
                    </div>
                    <div class="tl-rtc-app-right-setting-content-skin-block-custom-content">
                        <div class="tl-rtc-app-right-setting-content-skin-block-custom-item" v-for="item in channelMoreSkinList">
                            <div class="tl-rtc-app-right-setting-content-skin-block-custom-item-title">
                                <span>{{item.name}}</span>
                            </div>
                            <div class="tl-rtc-app-right-setting-content-skin-block-custom-item-oper">
                                <div :id="item.id" :style="'background:' + item.color">
                                    {{item.color}}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="tl-rtc-app-right-setting-content-skin-block-custom">
                    <div class="tl-rtc-app-right-setting-content-skin-block-custom-title">
                        <span>自定义配色-频道邀请面板</span>
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#tl-rtc-app-icon-yulan"></use>
                        </svg>
                    </div>
                    <div class="tl-rtc-app-right-setting-content-skin-block-custom-content">
                        <div class="tl-rtc-app-right-setting-content-skin-block-custom-item" v-for="item in channelInviteSkinList">
                            <div class="tl-rtc-app-right-setting-content-skin-block-custom-item-title">
                                <span>{{item.name}}</span>
                            </div>
                            <div class="tl-rtc-app-right-setting-content-skin-block-custom-item-oper">
                                <div :id="item.id" :style="'background:' + item.color">
                                    {{item.color}}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="tl-rtc-app-right-setting-content-skin-block-custom">
                    <div class="tl-rtc-app-right-setting-content-skin-block-custom-title">
                        <span>自定义配色-频道公告面板</span>
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#tl-rtc-app-icon-yulan"></use>
                        </svg>
                    </div>
                    <div class="tl-rtc-app-right-setting-content-skin-block-custom-content">
                        <div class="tl-rtc-app-right-setting-content-skin-block-custom-item" v-for="item in channelNoticeSkinList">
                            <div class="tl-rtc-app-right-setting-content-skin-block-custom-item-title">
                                <span>{{item.name}}</span>
                            </div>
                            <div class="tl-rtc-app-right-setting-content-skin-block-custom-item-oper">
                                <div :id="item.id" :style="'background:' + item.color">
                                    {{item.color}}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    `
}

window.tl_rtc_app_module_setting_content_skin = tl_rtc_app_module_setting_content_skin