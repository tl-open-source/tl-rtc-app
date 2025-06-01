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
            // 42px是layedit工具栏的高度
            const bottomBlock = document.querySelector('.tl-rtc-app-right-channel-content-bottom')
            const replyContentBlock = document.querySelector('.tl-rtc-app-right-channel-content-body-reply-content-block')
            const quickMessageContentBlock = document.querySelector('.tl-rtc-app-right-channel-content-body-quick-message-content-block')
            const atUserContentBlock = document.querySelector('.tl-rtc-app-right-channel-content-body-at-user-content-block')

            if(!bottomBlock || !replyContentBlock){
                return
            }

            if(val){ 
                // 回复情况下，处理回复框定位
                replyContentBlock.style.bottom = bottomBlock.offsetHeight + this.layeditToolHeight + 'px'

                // 如果有快捷消息，处理快捷消息定位到回复框上面
                if(quickMessageContentBlock && this.hitQuickMessageList.length > 0){
                    this.$nextTick(()=>{
                        quickMessageContentBlock.style.bottom = bottomBlock.offsetHeight + this.layeditToolHeight + replyContentBlock.clientHeight + 'px'
                    })
                }

                // 如果有@用户，处理选择at用户定位到回复框上面
                if(atUserContentBlock && this.hitAtUserList.length > 0){
                    this.$nextTick(()=>{
                        atUserContentBlock.style.bottom = bottomBlock.offsetHeight + this.layeditToolHeight + replyContentBlock.clientHeight + 'px'
                    })
                }
            }else{                    
                // 取消回复情况下，处理快捷消息定位
                if(quickMessageContentBlock && this.hitQuickMessageList.length > 0){
                    quickMessageContentBlock.style.bottom = bottomBlock.offsetHeight + this.layeditToolHeight + 'px'
                }

                // 取消回复情况下，处理选择at用户定位
                if(atUserContentBlock && this.hitAtUserList.length > 0){
                    atUserContentBlock.style.bottom = bottomBlock.offsetHeight + this.layeditToolHeight + 'px'
                }
            }
        },
        hitQuickMessageList: {
            deep: true,
            immediate: true,
            handler: function(val){
                // 42px是layedit工具栏的高度
                const bottomBlock = document.querySelector('.tl-rtc-app-right-channel-content-bottom')
                const quickMessageContentBlock = document.querySelector('.tl-rtc-app-right-channel-content-body-quick-message-content-block')
                const replyContentBlock = document.querySelector('.tl-rtc-app-right-channel-content-body-reply-content-block')

                if(!bottomBlock || !quickMessageContentBlock){
                    return
                }

                // 快捷消息情况下，处理快捷消息定位
                if(val.length > 0){ 
                    quickMessageContentBlock.style.bottom = bottomBlock.offsetHeight + this.layeditToolHeight + 'px'

                    // 如果有回复，处理快捷消息定位需要在回复框上面
                    if(replyContentBlock && this.replyToMessageId){
                        this.$nextTick(()=>{
                            quickMessageContentBlock.style.bottom = bottomBlock.offsetHeight + this.layeditToolHeight + replyContentBlock.clientHeight + 'px'
                        })
                    }
                }
            },
        },
        hitAtUserList: {
            deep: true,
            immediate: true,
            handler: function(val){
                // 42px是layedit工具栏的高度
                const bottomBlock = document.querySelector('.tl-rtc-app-right-channel-content-bottom')
                const atUserContentBlock = document.querySelector('.tl-rtc-app-right-channel-content-body-at-user-content-block')
                const replyContentBlock = document.querySelector('.tl-rtc-app-right-channel-content-body-reply-content-block')
                
                if(!bottomBlock || !atUserContentBlock){
                    return
                }

                // 选择at用户情况下，处理选择at用户定位
                if(val.length > 0){ 
                    atUserContentBlock.style.bottom = bottomBlock.offsetHeight + this.layeditToolHeight + 'px'

                    // 如果有回复，处理选择at用户需要在回复框上面
                    if(replyContentBlock && this.replyToMessageId){
                        this.$nextTick(()=>{
                            atUserContentBlock.style.bottom = bottomBlock.offsetHeight + this.layeditToolHeight + replyContentBlock.clientHeight + 'px'
                        })
                    }
                }
            },
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
    },
    data : function(){
        return {
            layeditToolHeight: 41, // layedit工具栏高度
            isLoadingMore : false, // 加载更多
            isPressEvent: false, // 单击事件
            isDoubleTapEvent: false, // 双击事件

            hitQuickMessageList: [], // 命中快捷消息列表
            hitAtUserList: [], // 命中@用户列表

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
         * 发送快捷消息
         * @param {*} item
         */
        sendQuickMessage: function(item){
            this.emitSubModuleEvent({
                event: 'sub-module-channel-content-generate-quick-message-text',
                data: {
                    text: item.message,
                }
            })
        },
        /**
         * 文件名格式化
         * @param {*} fileName 
         * @returns 
         */
        fileNameFormat: function(fileName){
            if(!fileName){
                return ''
            }
            if(fileName.length > 35){
                return fileName.substring(0, 35) + '...'
            }
            return fileName
        },
        /**
         * 下载文件
         * @param {*} item 
         * @returns 
         */
        downloadFile: async function(item){
            // console.log("downloadFile", item)
            if(item.fileNotFound){
                this.popWarningMsg("文件已失效")
                return
            }
            
            const result = await new Promise((resolve) => {
                layer.confirm('即将下载 ' + item.fileName, {
                    title: '下载确认',
                    shadeClose: true,
                    closeBtn: false,
                    area: ['300px', 'auto'],
                }, function (index) {
                    resolve(true)
                    layer.close(index)
                }, function (index) {
                    resolve(false)
                });
            });

            if (!result) {
                return
            }

            const a = document.createElement('a');
            a.href = item.fileUrl;
            a.download = item.fileName;
            a.click();

            this.popSuccessMsg("下载成功")
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
         * 开始媒体通话
         * @param {*} item 
         */
        startMediaCall: async function(item){
            let that = this;
            
            let text = ''
            if(item.type === 'audio'){
                text = '发起新的语音通话'
            }else if(item.type === 'video'){
                text = '发起新的视频通话'
            }

            const result = await new Promise((resolve) => {
                layer.confirm(text, {
                    shadeClose: 1,
                    title: '确认操作'
                }, function (index) {
                    resolve(true)
                    layer.close(index)
                }, function (index) {
                    resolve(false)
                });
            });

            if (!result) {
                return
            }
            
            if(item.type === 'audio'){
                this.$emit('make-channel-audio-call')
            }else if(item.type === 'video'){
                this.$emit('make-channel-video-call')
            }
        },
        /**
         * 生成@用户文本
         * @param {*} item 
         */
        generateAtUserText: function(item){
            this.emitSubModuleEvent({
                event: 'sub-module-channel-content-generate-at-user-text',
                data: {
                    atUserId: item.userId,
                    atUserName: item.username,
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
         * @param {*} callback
         */
        clearReplyMessage: async function({
            callback
        }){
            this.replyToMessageId = ''
            this.replyToMessageType = ''
            this.replyToMessageContent = ''

            await this.emitSubModuleEvent({
                event: 'sub-module-channel-content-clear-textarea-reply-message',
            })

            callback && callback()
        },
        /**
         * 清除快捷消息
         * @param {*} callback
         */
        clearQuickMessage: async function({
            callback
        }){
            this.hitQuickMessageList = []

            await this.emitSubModuleEvent({
                event: 'sub-module-channel-content-clear-textarea-quick-message',
            })

            callback && callback()
        },
        /**
         * 清除@用户
         * @param {*} callback
         * @returns
         **/
        clearAtUser: async function({
            callback
        }){
            this.hitAtUserList = []

            await this.emitSubModuleEvent({
                event: 'sub-module-channel-content-clear-textarea-at-user',
            })

            callback && callback()
        },

        /**
         * 快捷消息过滤处理
         * @param {*} hitQuickMessageList
         * @param {*} callback 
         */
        quickMessageHandler: function({
            hitQuickMessageList, callback
        }){
            this.hitQuickMessageList = hitQuickMessageList

            callback && callback()
        },
        /**
         * at用户过滤处理
         * @param {*} hitAtUserList
         * @param {*} callback 
         */
        atUserMessageHandler: function({
            hitAtUserList, callback
        }){
            this.hitAtUserList = hitAtUserList

            callback && callback()
        },
        /**
         * 清除所有面板
         * @returns
         * */
        clearAllBodyPanel: async function({
            callback
        }){
            await this.clearReplyMessage({})
            await this.clearQuickMessage({})
            await this.clearAtUser({})

            callback && callback()
        },
        /**
         * 删除消息
         * @param {*} item 
         */
        deleteMessage: function(item){
            // console.log('删除 : ', item)
            this.popWarningMsg('暂未开放')
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
    },
    mounted() {
        
    },
    created(){
        // 清除面板
        window.subModule.$on('sub-module-channel-content-clear-body-panel', this.clearAllBodyPanel)

        // 快速回复消息
        window.subModule.$on('sub-module-channel-content-quick-reply-message', this.quickReplyMessage)

        // 消息输入事件
        window.subModule.$on('sub-module-channel-content-show-quick-message', this.quickMessageHandler)

        // @用户输入事件
        window.subModule.$on('sub-module-channel-content-show-at-user', this.atUserMessageHandler)
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
                    <div class="tl-rtc-app-right-channel-content-body-item-system" v-html="item.message"></div>
                </div>
                <div v-if="item.fromUserId !== propsUserId && item.type !== 'system'" style="padding: 10px 10px;">
                    <div class="tl-rtc-app-right-channel-content-body-item-time">{{item.messageTimeStampFormat}}</div>
                    <div class="tl-rtc-app-right-channel-content-body-item-info">
                        <div class="tl-rtc-app-right-channel-content-body-item-avatar" @click="userInfoPopup(event, item)">
                            <img :src="item.fromUserAvatar" alt="">
                        </div>
                        
                        <div style="margin-left: 10px;display: flex; flex-direction: column; flex-wrap: nowrap; align-items: flex-start;"
                            v-if="['offline', 'p2p'].includes(item.type)"
                        >
                            <div class="tl-rtc-app-right-channel-content-body-item-name"
                                :id="'other-username-' + item.id"
                                @mouseenter="mouseEnter(event, item)"
                                @mouseleave="mouseLeave"
                                @click="generateAtUserText(item)"
                            >
                                {{item.fromUserName}} <b>@</b>
                            </div>
                            <div class="tl-rtc-app-right-channel-content-body-item-message">
                                <div class="tl-rtc-app-right-channel-content-body-item-message-file"
                                    @click="downloadFile(item)" :id="item.type + '-message-content-' + item.id"
                                >
                                    <div class="tl-rtc-app-right-channel-content-body-item-message-file-left">
                                        <svg class="icon" aria-hidden="true">
                                            <use :xlink:href="item.fileIcon"></use>
                                        </svg>
                                    </div>
                                    <div class="tl-rtc-app-right-channel-content-body-item-message-file-info">
                                        <span style="font-weight: bold;font-size: 12px;">{{fileNameFormat(item.fileName)}}</span>
                                        <span style="margin-top: 10px;font-size: 10px;color: #8f8f8f;font-weight: bold;">
                                            <span v-if="item.type === 'offline'">[离线]</span>
                                            <span v-else-if="item.type === 'p2p'">[在线]</span>
                                            <span>{{item.fileSizeFormat}}</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div class="tl-rtc-app-right-channel-content-body-item-message-menu" v-if="!item.fileNotFound">
                                <svg class="icon" aria-hidden="true" @click="replyMessage(item)">
                                    <use xlink:href="#tl-rtc-app-icon-huifu1"></use>
                                </svg>
                                <svg class="icon" aria-hidden="true" @click="openEmojiPopup($event, item)">
                                    <use xlink:href="#tl-rtc-app-icon-biaoqing"></use>
                                </svg>
                            </div>
                        </div>
                        <div v-else-if="['audio', 'video'].includes(item.type)"
                            style="margin-left: 10px; display: flex; flex-direction: column; flex-wrap: nowrap; align-items: flex-start;"
                        >
                            <div class="tl-rtc-app-right-channel-content-body-item-name"
                                :id="'other-username-' + item.id"
                                @mouseenter="mouseEnter(event, item)"
                                @mouseleave="mouseLeave"
                                @click="generateAtUserText(item)"
                            >
                                {{item.fromUserName}} <b>@</b>
                            </div>
                            <div class="tl-rtc-app-right-channel-content-body-item-message" @click="startMediaCall(item)">
                                <svg class="icon tl-rtc-app-right-channel-content-body-item-message-icon" aria-hidden="true">
                                    <use :xlink:href="item.mediaIcon"></use>
                                </svg> 
                                <span :id="item.type + '-message-content-' + item.id">{{item.message}}</span>
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

                        <div style="margin-left: 10px; display: flex; flex-direction: column; flex-wrap: nowrap; align-items: flex-start;"     
                            v-else-if="['group', 'friend'].includes(item.type)"
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
                            <div class="tl-rtc-app-right-channel-content-body-item-message-menu" v-show="item.type !== 'ai'">
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
                        <div v-if="['offline', 'p2p'].includes(item.type)" 
                            style="display: flex; flex-direction: column; flex-wrap: nowrap; align-items: flex-end;"
                        >
                            <div class="tl-rtc-app-right-channel-content-body-item-message">
                                <div class="tl-rtc-app-right-channel-content-body-item-message-file" 
                                    :id="item.type + '-message-content-' + item.id"
                                    @click="downloadFile(item)" 
                                >
                                    <div class="tl-rtc-app-right-channel-content-body-item-message-file-left">
                                        <svg class="icon" aria-hidden="true">
                                            <use :xlink:href="item.fileIcon"></use>
                                        </svg>
                                    </div>
                                    <div class="tl-rtc-app-right-channel-content-body-item-message-file-info">
                                        <span style="font-weight: bold;font-size: 12px;">{{fileNameFormat(item.fileName)}}</span>
                                        <span style="margin-top: 10px;font-size: 10px;color: #8f8f8f;font-weight: bold;">
                                            <span v-if="item.type === 'offline'">[离线]</span>
                                            <span v-else-if="item.type === 'p2p'">[在线]</span>
                                            <span>{{item.fileSizeFormat}}</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div class="tl-rtc-app-right-channel-content-body-item-message-menu" v-if="!item.fileNotFound">
                                <svg class="icon" aria-hidden="true" @click="replyMessage(item)">
                                    <use xlink:href="#tl-rtc-app-icon-huifu1"></use>
                                </svg>
                                <svg class="icon" aria-hidden="true" @click="openEmojiPopup($event, item)">
                                    <use xlink:href="#tl-rtc-app-icon-biaoqing"></use>
                                </svg>
                            </div>
                        </div>
                        <div style="display: flex; flex-direction: column; flex-wrap: nowrap; align-items: flex-end;"
                            v-else-if="['audio', 'video'].includes(item.type)"
                        >
                            <div class="tl-rtc-app-right-channel-content-body-item-message" @click="startMediaCall(item)">
                                <svg class="icon tl-rtc-app-right-channel-content-body-item-message-icon" aria-hidden="true">
                                    <use :xlink:href="item.mediaIcon"></use>
                                </svg> 
                                <span :id="item.type + '-message-content-' + item.id">{{item.message}}</span>
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
                        <div style="display: flex; flex-direction: column; flex-wrap: nowrap; align-items: flex-end;" 
                            v-else-if="['group', 'friend'].includes(item.type)"
                        >
                            <div class="tl-rtc-app-right-channel-content-body-item-message" 
                                v-html="item.message" :id="item.type + '-message-content-' + item.id">
                            </div>
                            <div class="tl-rtc-app-right-channel-content-body-item-message-reply" v-if="item.replyToMessageId">
                                <div class="tl-rtc-app-right-channel-content-body-item-message-reply-triangle"></div>
                                <div v-html="item.replyToMessageContent"></div>
                            </div>
                            <div class="tl-rtc-app-right-channel-content-body-item-message-menu" v-show="item.type !== 'ai'">
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
            </div>

            <div class="tl-rtc-app-right-channel-content-body-reply-content-block" v-show="replyToMessageId">
                <i class="layui-icon layui-icon-close" @click="clearReplyMessage"></i>
                <div class="tl-rtc-app-right-channel-content-body-reply-content-block-name">
                    <div style="width: 35px;">回复: </div>
                </div>
                <div class="tl-rtc-app-right-channel-content-body-reply-content-block-content">
                    <span v-html="replyToMessageContent"></span>
                </div>
            </div>

            <div class="tl-rtc-app-right-channel-content-body-quick-message-content-block" v-show="hitQuickMessageList.length > 0">
                <i class="layui-icon layui-icon-close" @click="clearQuickMessage"></i>
                <div class="tl-rtc-app-right-channel-content-body-quick-message-content-block-item" 
                    v-for="item in hitQuickMessageList" :key="item.id" @click="sendQuickMessage(item)"
                    v-html="item.hitMessage"
                >
                    
                </div>
            </div>

            <div class="tl-rtc-app-right-channel-content-body-at-user-content-block" v-show="hitAtUserList.length > 0">
                <i class="layui-icon layui-icon-close" @click="clearAtUser"></i>
                <div class="tl-rtc-app-right-channel-content-body-at-user-content-block-item"  v-for="item in hitAtUserList" :key="item.id" 
                    @click="generateAtUserText(item)">
                    <div class="tl-rtc-app-right-channel-content-body-at-user-content-block-item-info">
                        <span>@</span>
                        <img :src="item.userAvatar" :alt="item.username">
                    </div>
                    <div v-if="item.friendName"><b>{{item.friendName}}</b>（{{item.username}}）</div>
                    <div v-else><b>{{item.username}}</b></div>
                </div>
            </div>
        </div>
    `,
}

window.tl_rtc_app_module_channel_content_body = tl_rtc_app_module_channel_content_body