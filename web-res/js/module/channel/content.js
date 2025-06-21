const tl_rtc_app_module_channel_content = {
    props: {
        socket: {
            type: Object,
            default: null
        },
        company: {
            type: Object,
            default: function () {
                return {
                    name: ''
                }
            }
        },
        user: {
            type: Object,
            default: function () {
                return {
                    userId: '', // 用户id
                    username: '', // 用户名称
                    userAvatar: '', // 用户头像
                }
            }
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
        propsSocket() {
            return this.socket;
        },
        propsUser() {
            return this.user;
        },
        propsCompany() {
            return this.company;
        },
        propsIsMobile(){
            return this.isMobile;
        },
        propsLeftModule() {
            return this.leftModule;
        },
        propsRightModule() {
            return this.rightModule;
        }
    },
    data: function () {
        return {
            channelShareHashKey: 'channel-share',
            isInviter: false, // 是否是邀请方
            socketId: this.socket.id, // socketId
            channelId: '', // 当前会话id
            channelName: '', //当前会话名称 - 单聊【对方名称】- 群聊【群聊名称】
            channelRole: '', // 当前会话角色
            channelReName: '', // 当前会话备注名称
            channelUserCount: 0, // 当前会话用户数量
            channelMessages: [], // 当前会话消息数据 - 单聊/群聊
            channelUsers: [], // 当前会话用户数据 - 单聊/群聊
            channelType: '', // 当前会话类型 - 单聊/群聊
            channelTop: false, // 当前会话是否置顶
            channelBlack: false, // 当前会话是否拉黑
            channelGroupCanBeSearch: false, // 当前群聊是否可以被搜索
            channelNoticeList: [], // 当前会话公告列表
            channelMessageAllLoad: false, // 当前会话消息是否全部加载
            tools: [
                {
                    svg: '#tl-rtc-app-icon-a-tongzhigonggao3x',
                    title: '群公告',
                    active: false,
                    callback: this.showGroupNotice
                },
                {
                    svg: '#tl-rtc-app-icon-31dianhua',
                    title: '语音通话',
                    active: false,
                    callback: this.makeChannelAudioCall
                },
                {
                    svg: '#tl-rtc-app-icon-shexiangtou',
                    title: '视频通话',
                    active: false,
                    callback: this.makeChannelVideoCall
                },
                {
                    svg: '#tl-rtc-app-icon-faqiliaotian',
                    title: '邀请进群',
                    active: false,
                    callback: this.inviteChannelUser
                },
                {
                    svg: '#tl-rtc-app-icon-gengduo',
                    title: '更多',
                    active: false,
                    callback: this.openChannelMore
                },
            ]
        }
    },
    watch: {
        channelMessages: {
            deep: true,
            immediate: true,
            handler: function (pre, cur) { }
        },
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
         * 显示群公告
         */
        showGroupNotice: function () {
            let that = this
            let noticeDom = ""
            this.channelNoticeList.forEach(item => {
                noticeDom += `
                    <div class="tl-rtc-app-right-channel-notice-list-item">
                        <div class="tl-rtc-app-right-channel-notice-list-item-title">${item.username}发布公告: </div>
                        <div class="tl-rtc-app-right-channel-notice-list-item-content">${item.content}</div>
                        <div class="tl-rtc-app-right-channel-notice-list-item-time">${item.createTimeFormat}</div>
                    </div>
                `
            })
            layer.open({
                type: 1,
                title: '群公告',
                skin: 'tl-rtc-app-layer-channel-notice',
                content: `
                    <div class="tl-rtc-app-right-channel-notice">
                        ${this.channelNoticeList.length === 0 ? '<div class="tl-rtc-app-right-channel-notice-empty">暂无公告</div>' : ''}
                        <div class="tl-rtc-app-right-channel-notice-list">${noticeDom}</div>
                    </div>
                `,
                area: this.isMobile ? ['100%', '100%'] : ['350px', '400px'],
                shadeClose: true,
                success: function(layero){
                    if(!that.isMobile){
                        layero.css({
                            'border-radius': '6px',
                        })
                    }
                },
                yes: function (index) {
                    layer.close(index)
                }
            });  
        },
        /**
         * 发起语音通话
         */
        makeChannelAudioCall: async function () {            
            let called = await this.emitSubModuleEvent({
                event: 'component-video-start-video',
                data: {
                    channelId: this.channelId,
                    fromName: this.propsUser.username,
                    audio: true, video: false,
                    hanupCallback: function({
                        time
                    }){
                        console.log("时长", time)
                    }
                }
            })

            if(!called){
                return
            }

            // 添加媒体记录
            await this.addMediaRecord({
                type: 'audio',
                channelId: this.channelId,
                channelType: this.channelType
            })
        },
        /**
         * 发起视频通话
         */
        makeChannelVideoCall: async function () {
            let that = this
            // 屏幕是否是横向
            const screenIsLandscape = window.tl_rtc_app_comm.isLandscape()

            let called = await this.emitSubModuleEvent({
                event: 'component-video-start-video',
                data: {
                    channelId: this.channelId,
                    fromName: this.propsUser.username,
                    audio: true, video: true,
                    videoConstraints: {
                        width: {
                            ideal: screenIsLandscape ? 300 : 450,
                        },
                        height: {
                            ideal: screenIsLandscape ? 450 : 300,
                        },
                        frameRate: {
                            ideal: 40, max: 50
                        },
                        facingMode: 'user'
                    },
                    hanupCallback: function({
                        time
                    }){
                        console.log("时长", time)
                    }
                }
            })

            if(!called){
                return
            }

            // 添加媒体记录
            await this.addMediaRecord({
                type: 'video',
                channelId: this.channelId,
                channelType: this.channelType
            })
        },
        /**
         * 添加媒体记录
         * @param {*} type 
         * @param {*} channelId
         * @param {*} channelType
         * @param {*} meetingCode : 直播会议号
         * @returns 
         */
        addMediaRecord: async function({
            type, channelId, channelType, meetingCode = '', callback
        }){
            let url = ''
            if (channelType === 'group') {
                url = '/api/web/channel-media/add-group-channel-' + type
            }else if (channelType === 'friend') {
                url = '/api/web/channel-media/add-friend-channel-' + type
            }

            let params = {
                channelId: channelId,
            }
            if(!window.tl_rtc_app_comm.checkRequestParams(params)){
                this.popErrorMsg("请求参数非法")
                callback && callback(false)
                return
            }
            // 记录消息
            const { data: addMediaRes } = await this.tlRequest({
                url: url,
                method: 'post',
                useCache: false,
                data: params,
            })
            if (!addMediaRes.success) {
                this.popErrorMsg(addMediaRes.msg)
                callback && callback(false)
                return
            }

            let addMessage = addMediaRes.data
            if (addMessage) {
                if(addMessage.messageTimeStamp){
                    addMessage.messageTimeStampFormat = window.util.timeAgo(addMessage.messageTimeStamp)
                }

                if(addMessage.type === 'audio'){
                    // 设置icon
                    addMessage.mediaIcon = '#tl-rtc-app-icon-31dianhua'
                }else if(addMessage.type === 'video'){
                    // 设置icon
                    addMessage.mediaIcon = '#tl-rtc-app-icon-shexiangtou'
                }
            }

            this.emitSubModuleEvent({
                event: 'component-socket-send-socket',
                data: {
                    event: 'channelChat',
                    data: {
                        channel: channelId,
                        messageInfo: addMessage
                    }
                }
            });

            this.channelMessages.push(addMessage)

            await this.emitSubModuleEvent({
                event: 'sub-module-channel-list-update-latest-message',
                data: {
                    channelId: channelId,
                    extra: addMessage
                }
            })

            this.moduleScrollToBottom({})

            callback && callback(true)
        },
        /**
         * 邀请用户进群
         */
        inviteChannelUser: async function () {
            await this.emitSubModuleEvent({
                event: 'sub-module-channel-invite-open',
                data: {
                    existUserIdList : this.channelUsers.map(item => item.userId)
                }
            })
        },
        /**
         * 快捷邀请用户进群
         * @param {*} channelId
         */
        inviteChannelUserQuick: async function({
            channelId, callback
        }){
            await this.emitSubModuleEvent({
                event: 'sub-module-channel-list-item-open',
                data: {
                    channelId
                }
            })

            await this.emitSubModuleEvent({
                event: 'sub-module-channel-invite-open',
                data: {
                    existUserIdList : this.channelUsers.map(item => item.userId)
                }
            })

            callback && callback(true)
        },
        /**
         * 打开更多面板
         */
        openChannelMore: function () {
            this.emitSubModuleEvent({
                event: 'sub-module-channel-more-open',
                data: {
                    channelId: this.channelId
                }
            })
        },
        /**
         * 打开频道内容
         * @param {*} data 
         */
        openChannelContent: async function (data) {     
            // console.log("频道内容数据变更", data)

            if('channelId' in data){
                this.channelId = data.channelId
            }
            if('channelName' in data){
                this.channelName = data.channelName
            }
            if('channelReName' in data){
                this.channelReName = data.channelReName
            }
            if('channelUserCount' in data){
                this.channelUserCount = data.channelUserCount
            }
            if('channelMessages' in data){
                this.channelMessages = [...data.channelMessages]
            }
            if('channelType' in data){
                this.channelType = data.channelType
            }
            if('channelUsers' in data){
                this.channelUsers = [...data.channelUsers]
            }
            if('channelTop' in data){
                this.channelTop = data.channelTop
            }
            if('channelBlack' in data){
                this.channelBlack = data.channelBlack
            }
            if('channelMessageAllLoad' in data){
                this.channelMessageAllLoad = data.channelMessageAllLoad
            }
            if('channelRole' in data){
                this.channelRole = data.channelRole
            }
            if('channelGroupCanBeSearch' in data){
                this.channelGroupCanBeSearch = data.channelGroupCanBeSearch
            }

            data.callback && data.callback(true)
        },
        /**
         * 发送消息
         * @param {*} data 
         * @returns 
         */
        pushChannelMessage: async function (data) {
            let url = ''
            if (this.channelType === 'group') {
                url = '/api/web/channel-chat/add-group-channel-chat'

                // 回复消息
                if(data.replyToMessageId){
                    url = '/api/web/channel-chat/add-reply-group-channel-chat'
                }
            }else if (this.channelType === 'friend') {
                url = '/api/web/channel-chat/add-friend-channel-chat'

                // 回复消息
                if(data.replyToMessageId){
                    url = '/api/web/channel-chat/add-reply-friend-channel-chat'
                }
            }

            if (!url) {
                this.popErrorMsg('发送消息失败，频道类型错误')
                return
            }

            // 发送给谁
            let toUserId = '', toUserName = ''

            if (this.channelType === 'friend') {
                let firend = this.channelUsers.find(item => item.userId !== this.propsUser.userId)
                if (firend) {
                    toUserId = firend.userId
                    toUserName = firend.username
                }else{
                    this.popErrorMsg('发送消息失败，对方已经不是您的好友')
                    return
                }
            }

            const params = {
                channelId: this.channelId,
                message: data.message,
                toUserId, toUserName,

                // 群聊/好友@用户
                atUserId: data.atUserId,
                atUserName: data.atUserName,
            }

            // 回复消息
            if(data.replyToMessageId && data.replyToMessageType){
                params.messageId = data.replyToMessageId
                params.messageType = data.replyToMessageType
            }

            // 群聊@用户
            if(this.channelType === 'group'){
                params.atAll = data.isAtAll
            }

            const { data: addChatRes } = await this.tlRequest({
                url: url,
                method: 'post',
                useCache: false,
                data: params,
            })
            if (!addChatRes.success) {
                this.popErrorMsg(addChatRes.msg)
                return
            }

            let addMessage = addChatRes.data
            if (addMessage) {
                if(addMessage.messageTimeStamp){
                    addMessage.messageTimeStampFormat = window.util.timeAgo(addMessage.messageTimeStamp)
                }
            }

            if([
                'group', 'friend'
            ].includes(this.channelType)){
                this.emitSubModuleEvent({
                    event: 'component-socket-send-socket',
                    data: {
                        event: 'channelChat',
                        data: {
                            channel: this.channelId,
                            messageInfo: addMessage
                        }
                    }
                });
            }

            this.channelMessages.push(addMessage)

            // 更新最新消息
            await this.emitSubModuleEvent({
                event: 'sub-module-channel-list-update-latest-message',
                data: {
                    channelId: this.channelId,
                    extra: addMessage
                }
            })

            // 清除回复消息/清除快捷回复消息/清除at用户
            this.emitSubModuleEvent({
                event: 'sub-module-channel-content-clear-body-panel',
            })

            this.moduleScrollToBottom({})
        },
        /**
         * 添加邀请消息, 邀请消息记录在服务端生成，此处只做广播
         * @param {*} addMessage 
         * @param {*} callback 
         */
        pushChannelInviteMessage: async function({
            addMessage, callback
        }) {
            this.emitSubModuleEvent({
                event: 'component-socket-send-socket',
                data: {
                    event: 'channelChat',
                    data: {
                        channel: this.channelId,
                        messageInfo: addMessage
                    }
                }
            });

            this.channelMessages.push(addMessage)

            await this.emitSubModuleEvent({
                event: 'sub-module-channel-list-update-latest-message',
                data: {
                    channelId: this.channelId,
                    extra: addMessage
                }
            })

            this.moduleScrollToBottom({})  

            callback && callback(true)
        },
        /**
         * 发送频道文件消息
         * @param {*} data 
         */
        pushChannelFileMessage: async function (data) {
            let url = ''
            if(this.channelType === 'friend'){
                url = '/api/web/channel-file/add-friend-channel-offline-file'
            }else if (this.channelType === 'group'){
                url = '/api/web/channel-file/add-group-channel-offline-file'
            }

            if (!url) {
                this.popErrorMsg('发送消息失败，频道类型错误')
                return
            }

            const params = {
                channelId: this.channelId, 
                cloudFileId: data.cloudFileId
            }
            if(!window.tl_rtc_app_comm.checkRequestParams(params)){
                this.popErrorMsg("请求参数非法")
                return
            }
            const { data: addFileRes } = await this.tlRequest({
                url: url,
                method: 'post',
                useCache: false,
                data: params,
                
            })
            if(!addFileRes.success){
                this.popErrorMsg(addFileRes.msg)
                return
            }

            let addMessage = addFileRes.data
            if (addMessage) {
                if(addMessage.messageTimeStamp){
                    addMessage.messageTimeStampFormat = window.util.timeAgo(addMessage.messageTimeStamp)
                }

                // 设置icon
                let fileExt = addMessage.fileName.split('.').pop().toLowerCase()
                addMessage.fileIcon = window.tl_rtc_app_comm.getFileIcon(fileExt)
                //文件大小format, kb/mb/gb
                let fileSize = addMessage.fileSize
                addMessage.fileSizeFormat = window.tl_rtc_app_comm.getFileSize(fileSize)
            }

            this.emitSubModuleEvent({
                event: 'component-socket-send-socket',
                data: {
                    event: 'channelChat',
                    data: {
                        channel: this.channelId,
                        messageInfo: addMessage
                    }
                }
            });

            this.channelMessages.push(addMessage)

            await this.emitSubModuleEvent({
                event: 'sub-module-channel-list-update-latest-message',
                data: {
                    channelId: this.channelId,
                    extra: addMessage
                }
            })

            this.moduleScrollToBottom({})
        },
        /**
         * 删除消息
         * @param {*} messageId 
         * @param {*} callback 
         */
        deleteChannelMessage: async function({
            messageId, callback
        }){
            
        },
        /**
         * 滚动到底部
         */
        moduleScrollToBottom: function ({
            callback
        }) {
            setTimeout(() => {
                if (window.tl_rtc_app_comm.scrollToBottom) {
                    let contentBodyDom = document.getElementsByClassName("tl-rtc-app-right-channel-content-body")
                    if (contentBodyDom && contentBodyDom[0]) {
                        window.tl_rtc_app_comm.scrollToBottom(contentBodyDom[0], 1000, 50)
                    }
                }
            }, 100);

            callback && callback(true)
        },
        /**
         * 更新群聊名称
         */
        updateGroupChannelName: async function({
            callback
        }){
            if(this.channelType !== 'group'){
                callback && callback(false)
                return
            }
            let that = this;
            
            layer.prompt({
                formType: 0,
                title: "修改群聊名称",
                btn : ['确定', '取消'],
                value: "",
                shadeClose : true,
                skin: 'layui-layer-prompt ',
                maxlength : 15,
            }, async function (value, index, elem) {
                value = value.trim()
                if(value.length === 0){
                    layer.msg("请输入新的群聊名称",{offset: 't'});
                    return false;
                }

                const params = {
                    channelId: that.channelId,
                    channelName: value
                }
                if(!window.tl_rtc_app_comm.checkRequestParams(params)){
                    that.popErrorMsg("请求参数非法")
                    return
                }
                const { data: channelRes } = await that.tlRequest({
                    url: '/api/web/channel/update-channel-name',
                    method: 'post',
                    useCache: false,
                    data: params,
                    
                })
                if(!channelRes.success){
                    that.popErrorMsg(channelRes.msg)
                    layer.close(index)
                    return
                }
    
                that.popSuccessMsg(channelRes.msg)

                layer.close(index)

                await that.emitSubModuleEvent({
                    event: 'sub-module-channel-list-update-channel',
                    data: {
                        channelId: that.channelId,
                        update_types: ['channelInfo'],
                    }
                })

                that.channelName = value

                return false
            });

            callback && callback(true)
        },
        /**
         * 设置频道置顶
         */
        updateChannelToTop: async function(){
            let that = this

            const params = {
                channelId: this.channelId,
                top: !this.channelTop
            }
            if(!window.tl_rtc_app_comm.checkRequestParams(params)){
                this.popErrorMsg("请求参数非法")
                return
            }
            const { data: channelRes } = await this.tlRequest({
                url: '/api/web/channel-user/update-channel-top',
                method: 'post',
                useCache: false,
                data: params,
                
            })
            if(!channelRes.success){
                this.popErrorMsg(channelRes.msg)
                return
            }
            
            this.popSuccessMsg(channelRes.msg)

            await this.emitSubModuleEvent({
                event: 'sub-module-channel-list-update-channel',
                data: {
                    channelId: this.channelId,
                    update_types: ['channelInfo'],
                }
            })

            this.channelTop = !this.channelTop
        },
        /**
         * 快捷设置频道置顶
         * @returns 
         */
        updateChannelToTopQuick: async function({
            channelId, channelTop, callback
        }){
            let that = this
            const params = {
                channelId: channelId,
                top: channelTop
            }
            if(!window.tl_rtc_app_comm.checkRequestParams(params)){
                this.popErrorMsg("请求参数非法")
                callback && callback(false)
                return
            }
            const { data: channelRes } = await this.tlRequest({
                url: '/api/web/channel-user/update-channel-top',
                method: 'post',
                useCache: false,
                data: params,
                
            })
            if(!channelRes.success){
                this.popErrorMsg(channelRes.msg)
                callback && callback(false)
                return
            }
            
            this.popSuccessMsg(channelRes.msg)

            await this.emitSubModuleEvent({
                event: 'sub-module-channel-list-update-channel',
                data: {
                    channelId: channelId,
                    update_types: ['channelInfo'],
                }
            })

            this.channelTop = channelTop

            callback && callback(true)
        },
        /**
         * 退出群聊
         */
        exitGroupChannel: async function(){
            let acceptOrReject = await new Promise(resolve => {
                layer.confirm('确定退出当前群聊吗？', {
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

            let that = this
            const params = {
                channelId: this.channelId
            }
            if(!window.tl_rtc_app_comm.checkRequestParams(params)){
                this.popErrorMsg("请求参数非法")
                return
            }
            const { data: channelRes } = await this.tlRequest({
                url: '/api/web/channel-user/exit-channel',
                method: 'post',
                useCache: false,
                data: params,
                
            })
            if(!channelRes.success){
                this.popSuccessMsg(channelRes.msg)
            }else{
                this.popSuccessMsg(channelRes.msg)
            }

            await this.emitSubModuleEvent({
                event: 'sub-module-channel-list-init'
            })
            
            this.$emit('right-module-change', 'blank')
        },
        /**
         * 快捷退出群聊
         * @param {*} channelId
         * @param {*} callback
         * @returns 
         */
        exitGroupChannelQuick: async function({
            channelId, callback
        }){
            let acceptOrReject = await new Promise(resolve => {
                layer.confirm('确定退出当前群聊吗？', {
                    shadeClose: 1
                }, function (index) {
                    resolve(true)
                    layer.close(index)
                }, function (index) {
                    resolve(false)
                });
            })

            if(!acceptOrReject){
                callback && callback(false)
                return
            }

            let that = this
            const params = {
                channelId: channelId
            }
            if(!window.tl_rtc_app_comm.checkRequestParams(params)){
                this.popErrorMsg("请求参数非法")
                callback && callback(false)
                return
            }
            const { data: channelRes } = await this.tlRequest({
                url: '/api/web/channel-user/exit-channel',
                method: 'post',
                useCache: false,
                data: params,
                
            })
            if(!channelRes.success){
                this.popSuccessMsg(channelRes.msg)
            }else{
                this.popSuccessMsg(channelRes.msg)
            }
            
            await this.emitSubModuleEvent({
                event: 'sub-module-channel-list-init'
            })

            this.$emit('right-module-change', 'blank')

            callback && callback(true)
        },
        /**
         * 删除好友
         */
        deleteFriend: async function(){
            let acceptOrReject = await new Promise(resolve => {
                layer.confirm('确定删除该好友吗？', {
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

            let that = this
            const params = {
                channelId: this.channelId
            }
            if(!window.tl_rtc_app_comm.checkRequestParams(params)){
                this.popErrorMsg("请求参数非法")
                return
            }
            const { data: userFriendRes } = await this.tlRequest({
                url: '/api/web/user-friend/delete-user-friend',
                method: 'post',
                useCache: false,
                data: params,
                
            })
            if(!userFriendRes.success){
                this.popSuccessMsg(userFriendRes.msg)
            }else{
                this.popSuccessMsg(userFriendRes.msg)
            }
            
            await this.emitSubModuleEvent({
                event: 'sub-module-channel-list-init'
            })

            this.$emit('right-module-change', 'blank')
        },
        /**
         * 快捷删除好友
         * @param {*} channelId
         * @param {*} callback
         * @returns 
         */
        deleteFriendQuick: async function({
            channelId, callback
        }){
            let acceptOrReject = await new Promise(resolve => {
                layer.confirm('确定删除该好友吗？', {
                    shadeClose: 1
                }, function (index) {
                    resolve(true)
                    layer.close(index)
                }, function (index) {
                    resolve(false)
                });
            })

            if(!acceptOrReject){
                callback && callback(false)
                return
            }

            let that = this
            const params = {
                channelId: channelId
            }
            if(!window.tl_rtc_app_comm.checkRequestParams(params)){
                this.popErrorMsg("请求参数非法")
                callback && callback(false)
                return
            }
            const { data: userFriendRes } = await this.tlRequest({
                url: '/api/web/user-friend/delete-user-friend',
                method: 'post',
                useCache: false,
                data: params,
                
            })
            if(!userFriendRes.success){
                this.popSuccessMsg(userFriendRes.msg)
            }else{
                this.popSuccessMsg(userFriendRes.msg)
            }
            
            await this.emitSubModuleEvent({
                event: 'sub-module-channel-list-init'
            })

            this.$emit('right-module-change', 'blank')

            callback && callback(true)
        },
        /**
         * 拉黑好友
         */
        blackFriend: async function(){
            let that = this
            const params = {
                channelId: this.channelId,
                black: !this.channelBlack
            }
            if(!window.tl_rtc_app_comm.checkRequestParams(params)){
                this.popErrorMsg("请求参数非法")
                return
            }
            const { data: userFriendRes } = await this.tlRequest({
                url: '/api/web/channel-user/update-channel-black',
                method: 'post',
                useCache: false,
                data: params,
                
            })
            if(!userFriendRes.success){
                this.popErrorMsg(userFriendRes.msg)
                return
            }
            
            this.popSuccessMsg(userFriendRes.msg)

            await this.emitSubModuleEvent({
                event: 'sub-module-channel-list-update-channel',
                data: {
                    channelId: this.channelId,
                    update_types: ['channelInfo'],
                }
            })

            this.channelBlack = !this.channelBlack
        },
        /**
         * 更新好友备注名称
         */
        updateFriendName: async function({
            callback
        }){
            if(this.channelType !== 'friend'){
                callback && callback(false)
                return
            }
            let that = this;
            
            layer.prompt({
                formType: 0,
                title: "修改好友备注",
                btn : ['确定', '取消'],
                value: "",
                shadeClose : true,
                maxlength : 15,
            }, async function (value, index, elem) {
                value = value.trim()
                if(value.length === 0){
                    layer.msg("请输入好友备注",{offset: 't'});
                    return false;
                }

                const params = {
                    channelId: that.channelId,
                    rename: value
                }
                if(!window.tl_rtc_app_comm.checkRequestParams(params)){
                    that.popErrorMsg("请求参数非法")
                    return
                }
                const { data: userFriendRes } = await that.tlRequest({
                    url: '/api/web/user-friend/update-user-friend-rename',
                    method: 'post',
                    useCache: false,
                    data: params,
                    
                })
                if(!userFriendRes.success){
                    that.popErrorMsg(userFriendRes.msg)
                }else{
                    that.popSuccessMsg(userFriendRes.msg)
                }
                
                await that.emitSubModuleEvent({
                    event: 'sub-module-channel-list-update-channel',
                    data: {
                        channelId: that.channelId,
                        update_types: ['channelInfo'],
                    }
                })

                that.channelReName = value

                layer.close(index)

                return false
            });

            callback && callback(true)
        },
        /**
         * 发布群公告
         * @returns 
         */
        addGroupNotice: async function(){
            if(this.channelType !== 'group'){
                return
            }
            let that = this;
            
            layer.prompt({
                formType: 2,
                title: "发布新的群公告",
                btn : ['确定', '取消'],
                value: "",
                skin: 'layui-layer-prompt tl-rtc-app-layer-channel-notice-send',
                shadeClose : true,
            }, async function (value, index, elem) {
                value = value.trim()
                if(value.length === 0){
                    that.popWarningMsg("请输入群公告内容")
                    return false;
                }

                if(value.length > 3000){
                    that.popWarningMsg("群公告内容过长，最多3000个字符")
                    return false;
                }

                const params = {
                    channelId: that.channelId,
                    content: value
                }
                if(!window.tl_rtc_app_comm.checkRequestParams(params)){
                    that.popErrorMsg("请求参数非法")
                    return
                }
                const { data: userFriendRes } = await that.tlRequest({
                    url: '/api/web/channel-notice/add-channel-notice',
                    method: 'post',
                    useCache: false,
                    data: params,
                })
                if(!userFriendRes.success){
                    that.popErrorMsg(userFriendRes.msg)
                }else{
                    that.popSuccessMsg(userFriendRes.msg)
                }
            
                await that.emitSubModuleEvent({
                    event: 'sub-module-channel-list-update-channel',
                    data: {
                        channelId: that.channelId,
                        update_types: ['channelInfo', 'channelUserList', 'channelMessageList'],
                    }
                })

                layer.close(index)

                return false
            });
        },
        /**
         * 获取群公告列表
         */
        getChannelNoticeList: async function({
            callback
        }){
            if(this.channelType !== 'group'){
                callback && callback(false)
                return
            }
            let that = this;

            const params = {
                channelId: this.channelId
            }
            if(!window.tl_rtc_app_comm.checkRequestParams(params)){
                this.popErrorMsg("请求参数非法")
                callback && callback(false)
                return
            }
            const { data: channelNoticeRes } = await this.tlRequest({
                url: '/api/web/channel-notice/get-channel-notice-list',
                method: 'get',
                useCache: true,
                params: params,
                cacheTime: 10 * 1000
            })

            if(!channelNoticeRes.success){
                this.popErrorMsg(channelNoticeRes.msg)
                callback && callback(false)
                return
            }

            this.channelNoticeList = channelNoticeRes.data

            this.channelNoticeList.forEach(item => {
                item.createTimeFormat = window.util.timeAgo(item.createTime)
            })

            callback && callback(true)
        },
        /**
         * 分享群聊
         */
        groupChannelShare: async function(){
            let that = this
            layer.open({
                type: 1,
                title: '分享群聊',
                closeBtn: 0,
                skin: 'tl-rtc-app-layer-channel-share',
                content: `
                    <div>
                        <div id="tl-rtc-app-channel-share-image"></div>
                        <div class="tl-rtc-app-channel-share-tools">
                            <div class="tl-rtc-app-channel-share-tools-item" id="copyChannelShareLink">复制链接</div>
                            <div class="tl-rtc-app-channel-share-tools-item" id="saveChannelShareImage">保存图片</div>
                        </div>
                    </div>
                `,
                area: ['300px', '350px'],
                shadeClose: true,
                resize: false,
                yes: function (index) {
                    layer.close(index)
                },
                success: function (layero, index) {
                    layero.css({
                        'border-radius': '6px',
                    })
                    let _that = that
                    const { skinBodyBackground, skinBodyColor } = window.tl_rtc_app_comm.getPropertyValues([
                        { key: "skinBodyBackground", value: "skin-body-background" },
                        { key: "skinBodyColor", value: "skin-body-color" },
                    ])

                    const content = window.tl_rtc_app_comm.addUrlHashParams({
                        [that.channelShareHashKey]: Base64.encode(that.channelId + '-' + that.propsUser.userId)
                    })

                    window.tl_rtc_app_comm.getQrCode(
                        "tl-rtc-app-channel-share-image", content, skinBodyColor, skinBodyBackground
                    )

                    document.getElementById('copyChannelShareLink').addEventListener('click', function(){
                        window.tl_rtc_app_comm.copyTxt('copyChannelShareLink', content)

                        that.popSuccessMsg('复制成功')
                    })

                    document.getElementById('saveChannelShareImage').addEventListener('click', function(){
                        window.tl_rtc_app_comm.saveQrCode('tl-rtc-app-channel-share-image')
                    })
                }
            })
        },
        /**
         * 处理分享加入群聊
         * @returns 
         */
        handlerShareJoinGroupChannel: async function(){
            let that = this
            let hash = window.location.hash || "";
            if (!hash || !hash.includes("#") || !hash.includes(this.channelShareHashKey + "=")) {
                return
            }

            let shadeContent = window.tl_rtc_app_comm.getRequestHashArgs(this.channelShareHashKey)
            if(!shadeContent){
                console.log("分享参数为空")
                return
            }

            let decodeContent = Base64.decode(shadeContent)
            if(!decodeContent){
                console.log("分享参数解析失败")
                return
            }

            const args = decodeContent.split('-')
            if(!args || args.length < 2){
                console.log("分享参数不完整")
                return
            }

            let shareChannelId = args[0]
            if(!shareChannelId){
                console.log("分享参数不完整")
                return
            }

            let shareUserId = args[1]
            if(!shareUserId){
                console.log("分享参数不完整")
                return
            }

            shareChannelId = parseInt(shareChannelId)
            shareUserId = parseInt(shareUserId)
            
            window.location.hash = window.location.hash.replace(this.channelShareHashKey + "=" + shadeContent, "")

            const params = {
                channelId: shareChannelId,
                shareUserId
            }
            if(!window.tl_rtc_app_comm.checkRequestParams(params)){
                this.popErrorMsg("请求参数非法")
                return
            }
            const { data: groupRes } = await this.tlRequest({
                url: '/api/web/channel/search-channel-by-id',
                method: 'post',
                useCache: false,
                data: params,
            })
            if(!groupRes.success){
                this.popErrorMsg(groupRes.msg)
                return false;
            }

            this.popSuccessMsg(groupRes.msg)

            this.emitSubModuleEvent({
                event: 'sub-module-contact-content-group-search-data-change',
                data: groupRes.data
            })

            // 打开右侧模块 - 处理移动端情况
            this.emitSubModuleEvent({
                event: 'sub-module-core-change-module-show',
                data: {
                    showRightModule: true,
                }
            })

            this.$emit('left-module-change', 'contact')
            this.$emit('right-module-change', 'content')
        },
        /**
         * 更新频道是否可搜索
         * @param {*} callback 
         * @returns 
         */
        updateChannelCanSearch: async function(){
            const params = {
                channelId: this.channelId,
                canSearch: !this.channelGroupCanBeSearch
            }
            if(!window.tl_rtc_app_comm.checkRequestParams(params)){
                this.popErrorMsg("请求参数非法")
                return
            }
            const { data: channelRes } = await this.tlRequest({
                url: '/api/web/channel/update-channel-can-search',
                method: 'post',
                useCache: false,
                data: params,
            })
            if(!channelRes.success){
                this.popErrorMsg(channelRes.msg)
                return
            }
            
            this.popSuccessMsg(channelRes.msg)

            await this.emitSubModuleEvent({
                event: 'sub-module-channel-list-update-channel',
                data: {
                    channelId: this.channelId,
                    update_types: ['channelInfo'],
                }
            })

            this.channelGroupCanBeSearch = !this.channelGroupCanBeSearch
        },
    },
    mounted() {
        // 处理分享加入群聊
        this.handlerShareJoinGroupChannel()
    },
    created() {
        // 监听频道数据变更
        window.subModule.$on('sub-module-channel-content-open', this.openChannelContent)

        // 监听频道消息滚动到底部
        window.subModule.$on('sub-module-channel-content-scroll-to-bottom', this.moduleScrollToBottom)

        // 获取群公告列表
        window.subModule.$on('sub-module-channel-content-get-notice-list', this.getChannelNoticeList)

        // 快捷设置频道置顶
        window.subModule.$on('sub-module-channel-content-update-channel-top-quick', this.updateChannelToTopQuick)

        // 快捷邀请用户进群
        window.subModule.$on('sub-module-channel-content-invite-user-quick', this.inviteChannelUserQuick)

        // 快捷删除好友
        window.subModule.$on('sub-module-channel-content-delete-friend-quick', this.deleteFriendQuick)

        // 快捷退出群聊
        window.subModule.$on('sub-module-channel-content-exit-group-channel-quick', this.exitGroupChannelQuick)

        // 添加邀请消息
        window.subModule.$on('sub-module-channel-content-add-invite-message', this.pushChannelInviteMessage)

        // 添加媒体消息
        window.subModule.$on('sub-module-channel-content-add-media-message', this.addMediaRecord)

        // 修改好友备注
        window.subModule.$on('sub-module-channel-content-update-friend-name', this.updateFriendName)

        // 修改群聊名称
        window.subModule.$on('sub-module-channel-content-update-group-channel-name', this.updateGroupChannelName)

        // 删除消息
        window.subModule.$on('sub-module-channel-content-delete-channel-message', this.deleteChannelMessage)
    },
    components: {
        'tl_rtc_app_module_channel_content_tool': window.tl_rtc_app_module_channel_content_tool,
        'tl_rtc_app_module_channel_content_body': window.tl_rtc_app_module_channel_content_body,
        'tl_rtc_app_module_channel_content_textarea': window.tl_rtc_app_module_channel_content_textarea,
        'tl_rtc_app_module_channel_content_more': window.tl_rtc_app_module_channel_content_more,
        'tl_rtc_app_module_channel_content_invite': window.tl_rtc_app_module_channel_content_invite,
        'tl_rtc_app_module_channel_content_search_message': window.tl_rtc_app_module_channel_content_search_message
    },
    template: `
        <div class="tl-rtc-app-right-channel-content">
            <tl_rtc_app_module_channel_content_tool
                :socket-id='socketId'
                :channel-id='channelId'
                :channel-name='channelName'
                :channel-user-count='channelUserCount'
                :channel-type='channelType'
                :channel-users='channelUsers'
                :channel-role='channelRole'
                :user='propsUser'
                :is-mobile='propsIsMobile'
                :left-module='propsLeftModule'
                :right-module='propsRightModule'
                @left-module-change='leftModuleChange'
                @right-module-change='rightModuleChange'
                :tools='tools'
                :channel-re-name='channelReName'
            > 
            </tl_rtc_app_module_channel_content_tool>

            <tl_rtc_app_module_channel_content_body
                :socket-id='socketId'
                :channel-id='channelId'
                :channel-messages='channelMessages'
                :user='propsUser'
                :company='propsCompany'
                :is-mobile='propsIsMobile'
                :left-module='propsLeftModule'
                :right-module='propsRightModule'
                @left-module-change='leftModuleChange'
                @right-module-change='rightModuleChange'
                @make-channel-audio-call='makeChannelAudioCall'
                @make-channel-video-call='makeChannelVideoCall'
                :channel-message-all-load='channelMessageAllLoad'
            > 
            </tl_rtc_app_module_channel_content_body>

            <tl_rtc_app_module_channel_content_textarea
                @push-channel-message='pushChannelMessage'
                @push-channel-file-message='pushChannelFileMessage'
                :socket-id='socketId'
                :channel-id='channelId'
                :channel-type='channelType'
                :channel-users='channelUsers'
                :user='propsUser'
                :is-mobile='propsIsMobile'
                :left-module='propsLeftModule'
                :right-module='propsRightModule'
                @left-module-change='leftModuleChange'
                @right-module-change='rightModuleChange'
            > 
            </tl_rtc_app_module_channel_content_textarea>

            <tl_rtc_app_module_channel_content_more
                @update-group-channel-name='updateGroupChannelName'
                @group-channel-share='groupChannelShare'
                @update-channel-to-top='updateChannelToTop'
                @exit-group-channel='exitGroupChannel'
                @delete-friend='deleteFriend'
                @black-friend='blackFriend'
                @update-friend-name='updateFriendName'
                @add-group-notice='addGroupNotice'
                @left-module-change='leftModuleChange'
                @right-module-change='rightModuleChange'
                @invite-channel-user='inviteChannelUser'
                @update-channel-can-search='updateChannelCanSearch'
                :socket-id='socketId'
                :channel-id='channelId'
                :channel-name='channelName'
                :channel-messages='channelMessages'
                :channel-type='channelType'
                :channel-users='channelUsers'
                :channel-top='channelTop'
                :channel-black='channelBlack'
                :channel-group-can-be-search='channelGroupCanBeSearch'
                :channel-role='channelRole'
                :user='propsUser'
                :channel-re-name='channelReName'
                :company='propsCompany'
                :is-mobile='propsIsMobile'
                :left-module='propsLeftModule'
                :right-module='propsRightModule'
            > 
            </tl_rtc_app_module_channel_content_more>

            <tl_rtc_app_module_channel_content_invite
                :socket-id='socketId'
                :channel-id='channelId'
                :channel-name='channelName'
                :channel-messages='channelMessages'
                :channel-type='channelType'
                :channel-users='channelUsers'
                :user='propsUser'
                :socket='propsSocket'
                :is-mobile='propsIsMobile'
                :left-module='propsLeftModule'
                :right-module='propsRightModule'
                @left-module-change='leftModuleChange'
                @right-module-change='rightModuleChange'
            > 
            </tl_rtc_app_module_channel_content_invite>

            <tl_rtc_app_module_channel_content_search_message
                :socket-id='socketId'
                :channel-id='channelId'
                :channel-name='channelName'
                :channel-type='channelType'
                :channel-users='channelUsers'
                :channel-messages='channelMessages'
                :socket='propsSocket'
                :user='propsUser'
                :is-mobile='propsIsMobile'
                :left-module='propsLeftModule'
                :right-module='propsRightModule'
                @left-module-change='leftModuleChange'
                @right-module-change='rightModuleChange'
            >
            </tl_rtc_app_module_channel_content_search_message>

        </div>
    `
}

window.tl_rtc_app_module_channel_content = tl_rtc_app_module_channel_content