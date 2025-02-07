const tl_rtc_app_module_channel_content_body = {
    props : {
        channelId : {
            type : String,
            default : ''
        },
        channelMessages : {
            type : Array,
            default : []
        },
        socketId : {
            type : String,
            default : ''
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
        company: {
            type: Object,
            default: function(){
                return {
                    name: ''
                }
            }
        },
        channelMessageAllLoad: {
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
    watch: {
        channelMessages: {
            deep: true,
            immediate: true,
            handler: function(val){
                let that = this
                this.$nextTick(function(){
                    that.registerMessageMenu()
                })
            },
        },
        leftModule: function (val) {
            
        },
        rightModule: function (val) {
            
        },
        replyToMessageId: function (val) {
            const bottomBlock = document.querySelector('.tl-rtc-app-right-channel-content-bottom')
            const replyContentBlock = document.querySelector('.tl-rtc-app-right-channel-content-body-reply-content-block')
            if(bottomBlock && replyContentBlock){
                replyContentBlock.style.bottom = bottomBlock.offsetHeight + 42 + 'px'
            }
        }
    },
    computed: {
        propsChannelId(){
            return this.channelId;
        },
        propsChannelMessages(){
            return this.channelMessages;
        },
        propsSocketId(){
            return this.socketId;
        },
        propsUserId(){
            return this.user.userId;
        },
        propsUser(){
            return this.user;
        },
        propsIsMobile(){
            return this.isMobile;
        },
        propsCompanyName(){
            return this.company.name;
        },
        propsChannelMessageAllLoad(){
            return this.channelMessageAllLoad;
        },
        canRollbackMessage(){
            return function(item){
                return item.messageTimeStamp > Date.now() - 2 * 60 * 1000
            }
        },
    },
    data : function(){
        return {
            isLoadingMore : false, // 加载更多
            isPressEvent: false, // 单击事件
            isDoubleTapEvent: false, // 双击事件

            replyToMessageId: '', // 回复消息id
            replyToMessageType: '', // 回复消息类型
            replyToMessageContent: '', // 回复消息内容
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
         * 注册消息菜单
         */
        registerMessageMenu: function(){
            let that = this;
            for(let i = 0; i < this.channelMessages.length; i++){
                const message = this.channelMessages[i]
                const type = message.type
                if(type === 'system'){
                    continue
                }
                // 注册自定义菜单
                this.emitSubModuleEvent({
                    event: 'component-menu-register-custom',
                    data: {
                        elemId: '#' + type + '-message-content-' + message.id,
                        eventList: ['press', 'doubleTap'],
                        menuIdList: [
                            'copyMessage', 
                            'replyMessage', 
                            'rollbackMessage', 
                            'deleteMessage'
                        ],
                        extra: message,
                        pressCallback: function(){
                            that.isPressEvent = true
                        },
                        pressUpCallback: function(){
                            setTimeout(() => {
                                that.isPressEvent = false
                            }, 300);
                        },
                        doubleTapCallback: function(){
                            that.isDoubleTapEvent = true

                            setTimeout(() => {
                                that.isDoubleTapEvent = false
                            }, 300)
                        }
                    }
                })
            }
        },
        /**
         * 用户信息弹窗
         * @param {*} event 
         */
        userInfoPopup: async function(event, user){    
            if (!user || !user.fromUserId) {
                return
            }        
            // 根据userId获取用户基础信息
            let { type, userInfo } = await this.emitSubModuleEvent({
                event: 'component-popup-user-info-popup',
                data: {
                    clientX: event.clientX,
                    clientY: event.clientY,
                    userInfo: {
                        id: user.fromUserId
                    },
                }
            })

            if(type === 'chat'){
                await this.emitSubModuleEvent({
                    event: 'sub-module-contact-content-send-message',
                    data: {
                        channelId: userInfo.channelId,
                    }
                })
            }else if(type === 'video'){
                await this.emitSubModuleEvent({
                    event: 'sub-module-contact-content-send-video',
                    data: {
                        channelId: userInfo.channelId,
                    }
                })
            }else if(type === 'audio'){
                await this.emitSubModuleEvent({
                    event: 'sub-module-contact-content-send-audio',
                    data: {
                        channelId: userInfo.channelId,
                    }
                })
            }
        },
        /**
         * 加载更多消息
         */
        loadMoreMessage: async function(){
            let that = this

            this.isLoadingMore = true

            await this.emitSubModuleEvent({
                event: 'sub-module-channel-list-load-channel-message',
                data: {
                    channelId: this.propsChannelId,
                }
            })

            this.isLoadingMore = false
        },
        mouseEnter: function(event, item){
            if(this.propsIsMobile){
                return
            }
            tl_rtc_app_comm.mouseEnterTips({
                id: event.target.id,
                text: item.fromUserName,
                position: 'top'
            });
        },
        mouseLeave: function(){
            if(this.propsIsMobile){
                return
            }
            tl_rtc_app_comm.mouseLeaveTips();
        },
        /**
         * 生成@用户文本
         * @param {*} item 
         */
        generateAtUserText: function(item){
            this.emitSubModuleEvent({
                event: 'sub-module-channel-content-generate-at-user-text',
                data: {
                    atUserId: item.fromUserId,
                    atUserName: item.fromUserName,
                }
            })
        },
        /**
         * 回复消息
         * @param {*} item 
         */
        replyMessage: function(item){
            this.replyToMessageId = item.id
            this.replyToMessageType = item.type
            this.replyToMessageContent = item.message

            this.emitSubModuleEvent({
                event: 'sub-module-channel-content-set-textarea-reply-message',
                data: {
                    replyToMessageId: item.id,
                    replyToMessageType: item.type,
                    replyToMessageContent: item.message,
                }
            })
        },
        /**
         * 清除回复消息
         */
        clearReplyMessage: function(){
            this.replyToMessageId = ''
            this.replyToMessageType = ''
            this.replyToMessageContent = ''

            this.emitSubModuleEvent({
                event: 'sub-module-channel-content-clear-textarea-reply-message',
            })
        },
        /**
         * 删除消息
         * @param {*} item 
         */
        deleteMessage: function(item){
            console.log('删除 : ', item)
            this.popWarningMsg('暂未开放')
        },
        /**
         * 撤回消息
         * @param {*} item 
         */
        rollbackMessage: function(item){
            if(item.messageTimeStamp < Date.now() - 2 * 60 * 1000){
                this.popWarningMsg('时间超过2分钟不支持撤回')
                return
            }

            this.emitSubModuleEvent({
                event: 'sub-module-channel-content-rollback-channel-message',
                data: {
                    messageId: item.id,
                    channelId: this.propsChannelId,
                    messageType: item.type,
                }
            })
        },
        /**
         * 打开回复表情弹窗
         * @param {*} item
         */
        openEmojiPopup: function(event, item){
            // 回复消息
            this.replyMessage(item)

            this.emitSubModuleEvent({
                event: 'sub-module-channel-content-open-face',
                data: {
                    elem: event.target,
                }
            })
        },
        /**
         * 快速回复消息
         * @param {*} messageId 
         * @param {*} messageType 
         * @param {*} messageContent 
         * @param {*} callback 
         */
        quickReplyMessage: function({
            messageId, messageType, messageContent, callback
        }){
            this.replyMessage({
                id: messageId,
                type: messageType,
                message: messageContent,
            })

            callback && callback()
        },
        /**
         * 快速撤回消息
         * @param {*} messageId 
         * @param {*} callback 
         */
        quickRollbackMessage: function({
            messageId, messageType, callback 
        }){
            this.rollbackMessage({
                id: messageId,
                type: messageType,
            })

            callback && callback()
        },
    },
    mounted() {
        
    },
    created(){
        // 清除回复消息
        window.subModule.$on('sub-module-channel-content-clear-body-reply-message', this.clearReplyMessage)

        // 快速回复消息
        window.subModule.$on('sub-module-channel-content-quick-reply-message', this.quickReplyMessage)

        // 快速撤回消息
        window.subModule.$on('sub-module-channel-content-quick-rollback-message', this.quickRollbackMessage)
    },
    template: `
        <div class="tl-rtc-app-right-channel-content-body">
            <div class="tl-rtc-app-right-channel-content-body-item" v-if="!channelMessageAllLoad">
                <div class="tl-rtc-app-right-channel-content-body-item-load-more" @click="loadMoreMessage">
                    <span>查看历史更多消息...</span>
                    <i v-show='isLoadingMore' class="layui-icon layui-icon-loading layui-anim layui-anim-rotate layui-anim-loop"></i>
                </div>
            </div>
            <div class="tl-rtc-app-right-channel-content-body-item" v-for="(item, index) in propsChannelMessages" :key="index">
                <div v-if="item.type === 'system'" style="padding: 10px 10px;">
                    <div class="tl-rtc-app-right-channel-content-body-item-system">{{item.messageTimeStampFormat}}</div>
                    <div class="tl-rtc-app-right-channel-content-body-item-system">{{item.message}}</div>
                </div>
                <div v-if="item.fromUserId !== propsUserId && item.type !== 'system'" style="padding: 10px 10px;">
                    <div class="tl-rtc-app-right-channel-content-body-item-time">{{item.messageTimeStampFormat}}</div>
                    <div class="tl-rtc-app-right-channel-content-body-item-info">
                        <div class="tl-rtc-app-right-channel-content-body-item-avatar" @click="userInfoPopup(event, item)">
                            <img :src="item.fromUserAvatar" alt="">
                        </div>
                        
                        <div style="margin-left: 10px; display: flex; flex-direction: column; flex-wrap: nowrap; align-items: flex-start;"     
                            v-if="['group', 'friend'].includes(item.type)"
                        >
                            <div class="tl-rtc-app-right-channel-content-body-item-name"
                                :id="'other-username-' + item.id"
                                @mouseenter="mouseEnter(event, item)"
                                @mouseleave="mouseLeave"
                                @click="generateAtUserText(item)"
                            >
                                {{item.fromUserName}} <b>@</b>
                            </div>
                            <div class="tl-rtc-app-right-channel-content-body-item-message" :id="item.type + '-message-content-' + item.id"
                                v-html="item.message">
                            </div>
                            <div class="tl-rtc-app-right-channel-content-body-item-message-reply" v-if="item.replyToMessageId">
                                <div class="tl-rtc-app-right-channel-content-body-item-message-reply-triangle"></div>
                                <div v-html="item.replyToMessageContent"></div>
                            </div>
                            <div class="tl-rtc-app-right-channel-content-body-item-message-menu">
                                <svg class="icon" aria-hidden="true" @click="replyMessage(item)">
                                    <use xlink:href="#tl-rtc-app-icon-huifu1"></use>
                                </svg>
                                <svg class="icon" aria-hidden="true" @click="openEmojiPopup($event, item)">
                                    <use xlink:href="#tl-rtc-app-icon-biaoqing"></use>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else-if="item.fromUserId === propsUserId && item.type !== 'system'" style=" padding: 10px 10px;">
                    <div class="tl-rtc-app-right-channel-content-body-item-time">{{item.messageTimeStampFormat}}</div>
                    <div class="tl-rtc-app-right-channel-content-body-item-info-self">
                        <div class="tl-rtc-app-right-channel-content-body-item-avatar" @click="userInfoPopup(event, item)">
                            <img :src="item.fromUserAvatar" alt="">
                        </div>
                        <div style="display: flex; flex-direction: column; flex-wrap: nowrap; align-items: flex-end;" 
                            v-if="['group', 'friend'].includes(item.type)"
                        >
                            <div class="tl-rtc-app-right-channel-content-body-item-message" 
                                v-html="item.message" :id="item.type + '-message-content-' + item.id">
                            </div>
                            <div class="tl-rtc-app-right-channel-content-body-item-message-reply" v-if="item.replyToMessageId">
                                <div class="tl-rtc-app-right-channel-content-body-item-message-reply-triangle"></div>
                                <div v-html="item.replyToMessageContent"></div>
                            </div>
                            <div class="tl-rtc-app-right-channel-content-body-item-message-menu">
                                <svg class="icon" aria-hidden="true" @click="replyMessage(item)">
                                    <use xlink:href="#tl-rtc-app-icon-huifu1"></use>
                                </svg>
                                <svg class="icon" aria-hidden="true" @click="openEmojiPopup($event, item)">
                                    <use xlink:href="#tl-rtc-app-icon-biaoqing"></use>
                                </svg>
                                <svg class="icon" aria-hidden="true" @click="rollbackMessage(item)"
                                    v-show="canRollbackMessage(item)"
                                >
                                    <use xlink:href="#tl-rtc-app-icon-chehui"></use>
                                </svg>
                                <svg class="icon" aria-hidden="true" @click="deleteMessage(item)">
                                    <use xlink:href="#tl-rtc-app-icon-shanchu"></use>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="tl-rtc-app-right-channel-content-body-reply-content-block" v-show="replyToMessageId">
                <i class="layui-icon layui-icon-close" @click="clearReplyMessage"></i>
                <div class="tl-rtc-app-right-channel-content-body-reply-content-block-name">
                    <span>回复: </span>
                </div>
                <div class="tl-rtc-app-right-channel-content-body-reply-content-block-content">
                    <span v-html="replyToMessageContent"></span>
                </div>
            </div>
        </div>
    `,
}

window.tl_rtc_app_module_channel_content_body = tl_rtc_app_module_channel_content_body