const tl_rtc_app_module_channel_list = {
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
            // 搜索标签
            searchTag : {},
            // 频道列表
            channels : [],
            // 频道会话消息列表
            channelsMessageMap: {},
            // 频道用户map
            channelsUserMap: {},
            // 当前显示的频道id
            showChannelId: -1,
            // 请求是否完成
            requestOk: false,
            // 滑动开始坐标
            startPointX: 0,
            // swiper
            swiper: null,
            // 是否是长按事件
            isPressEvent: false,
            // 是否是滑动事件
            isPanEvent: false,
            // 当前滑动的频道id
            currentSwiperChannelId: -1,
            // swiperMap
            swiperMap: {},
            // 是否是第一次加载
            isFirstLoad: true,
            // 频道消息第一页加载是否完成
            channelMessageFirstPageLoadMap: {}
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
        filterChannels(){
            let resultList = this.channels
            
            // 先搜索关键字
            if(this.searchKey !== '' || this.searchKey.trim() !== ''){
                // 搜索关键字，匹配对象的所有属性值
                resultList = this.channels.filter(item => {
                    let values = item.channelName
                    if(!values){
                        return false
                    }
                    return values.indexOf(this.searchKey) > -1
                })
            }

            // 再搜索标签
            if(this.searchTag.system){
                const tagName = this.searchTag.name
                if(tagName === '置顶'){
                    resultList = resultList.filter(item => item.channelTop)
                }else if(tagName === '未读'){
                    resultList = resultList.filter(item => item.channelChatUnReadCount > 0)
                }else if(tagName === '群聊'){
                    resultList = resultList.filter(item => item.channelType === 'group')
                }else if(tagName === '单聊'){
                    resultList = resultList.filter(item => item.channelType === 'friend')
                }else if(tagName === '拉黑'){
                    resultList = resultList.filter(item => item.channelBlack)
                }
            }

            return resultList
        },
        openMessageDot(){
            return this.user.messageSetting.messageDot
        },
        webNotify(){
            return this.user.messageSetting.webNotify
        },
        propsLeftModule() {
            return this.leftModule;
        },
        propsRightModule() {
            return this.rightModule;
        },
    },
    watch:{
        channels : {
            deep: true,
            immediate: true,
            handler: function(pre, cur){
                
            }
        },
        channelsMessageMap : {
            deep: true,
            immediate: true,
            handler: function(pre, cur){}
        },
        channelsUserMap : {
            deep: true,
            immediate: true,
            handler: function(pre, cur){}
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
         * 收到socket聊天消息
         * @param {*} data 
         * @returns 
         */
        channelChatSocketHandler: function(data){
            const { channel, messageInfo } = data
            if(!channel || !messageInfo){
                data.callback && data.callback()
                return
            }

            // console.log('channelChatSocketHandler', data)
            
            this.addChannelMessageHandler({
                channelId: channel, messageInfo
            })

            data.callback && data.callback()
        },
        /**
         * 添加频道消息 - 公共处理逻辑
         * @param {*} channelId 
         * @param {*} messageInfo 
         */
        addChannelMessageHandler: function({
            channelId, messageInfo
        }){
            if(!this.channelsMessageMap[channelId]){
                this.channelsMessageMap[channelId] = []
            }
            
            this.updateChannelLatestMessage({
                channelId: channelId, extra: messageInfo
            })

            // 更新侧边栏未读消息数量
            this.emitSubModuleEvent({
                event: 'sub-module-sidebar-unread-update',
                data: {
                    name: 'channel',
                    type: 'add',
                    count: 1
                }
            })

            // 更新频道未读消息数量
            messageInfo.hasRead = false
            this.channels.forEach(item => {
                if(item.channelId === channelId){
                    item.channelChatUnReadCount += 1
                }
            })

            // 先按频道列表按时间倒序排序
            this.channels.sort((a, b) => {
                return new Date(b.createTime).getTime() - new Date(a.createTime).getTime()
            })

            // 按照频道未读消息数量排序
            this.channels.sort((a, b) => {
                return b.channelChatUnReadCount - a.channelChatUnReadCount
            })

            // 再将置顶的频道放在最前面
            this.channels.sort((a, b) => {
                return b.channelTop - a.channelTop
            })

            this.$forceUpdate()

            if(this.showChannelId === channelId){
                // 刷新频道内容缓存
                this.refreshChannelContent(channelId)
            }

            // 有浏览器系统桌面消息通知
            if(webNotify && window.Notification && Notification.permission === 'granted'){
                const channelInfo = this.channels.find(item => item.channelId === channelId)
                new Notification(channelInfo.channelName, {
                    body: '收到新消息啦，快去看看吧',
                    dir: 'auto',
                    icon: channelInfo.channelAvatar 
                })
            }
        },
        /**
         * 打开频道消息
         * @param {*} channelId 
         */
        openChannelMessageHandler: async function({
            channelId, callback
        }){
            let that = this
            if(this.isPressEvent || this.isPanEvent){
                callback && callback()
                return
            }
            
            let index = layer.load(2, {
                shade: [0.3, '#0000001f']
            })

            // 点击切换频道
            if(channelId !== this.showChannelId){
                if(this.isFirstLoad){
                    // 首次加载右侧频道内容，先更新频道已有缓存数据，再刷新频道内容, 为了处理首次加载时，频道内容布局错乱问题
                    await this.refreshChannelContent(channelId)
                    this.isFirstLoad = false
                }

                // 通知子模块，获取通知列表
                await this.emitSubModuleEvent({
                    event: 'sub-module-channel-content-get-notice-list',
                })

                // 如果加载频道首页消息列表完成，后续切换频道使用已有的即可，无需再次请求消息列表（后续消息交由历史记录流程）
                let update_types = ['channelInfo', 'channelUserList', 'channelMessageList']
                if(this.channelMessageFirstPageLoadMap[channelId]){
                    update_types = ['channelInfo', 'channelUserList']
                }
                // 更新频道信息
                await this.updateChannelInfo({
                    channelId: channelId, update_types
                })
                // 加载首页频道消息列表完成
                this.channelMessageFirstPageLoadMap[channelId] = true

                this.showChannelId = channelId

                // 切换频道的时候，如果有回复消息，需要清除回复消息面板
                this.emitSubModuleEvent({
                    event: 'sub-module-channel-content-clear-body-panel',
                })
            }

            this.$emit('left-module-change', 'channel')
            this.$emit('right-module-change', 'content')

            // 打开右侧模块 - 处理移动端情况
            await this.emitSubModuleEvent({
                event: 'sub-module-core-change-module-show',
                data: {
                    showRightModule: true,
                }
            })
            
            // 刷新频道内容缓存
            await this.refreshChannelContent(channelId)

            layer.close(index)
            callback && callback()
        },
        /**
         * 刷新频道内容缓存
         * @returns 
         */
        refreshChannelContent: async function(channelId){
            const data = this.channels.find(item => item.channelId === channelId)
            if (!data) {
                return
            }

            // 通知兄弟子模块，数据变更
            await this.emitSubModuleEvent({
                event: 'sub-module-channel-content-open',
                data: {
                    channelId: data.channelId,
                    channelName: data.channelName,
                    channelReName: data.channelReName,
                    channelUserCount: data.channelUserCount,
                    channelType: data.channelType,
                    channelMessages: this.channelsMessageMap[data.channelId] || [],
                    channelUsers: this.channelsUserMap[data.channelId] || [],
                    channelTop: data.channelTop,
                    channelBlack: data.channelBlack,
                    channelRole: data.channelRole,
                    channelGroupCanBeSearch: data.channelGroupCanBeSearch,
                    channelMessageAllLoad: (this.channelsMessageMap[data.channelId] || []).length === 0,
                }
            })

            // 滚动消息列表到底部
            await this.emitSubModuleEvent({
                event: 'sub-module-channel-content-scroll-to-bottom',
            })

            // 更新频道已读记录，需要更新全部类型的已读记录
            await this.updateChannelUnReadMessage(channelId, null)

            const preSwiper = this.swiperMap[channelId]
            preSwiper && preSwiper.slideTo(0)
            this.currentSwiperChannelId = ''
        },
        /**
         * 更新频道未读消息为已读
         * @param {*} channelId
         */
        updateChannelUnReadMessage: async function(channelId, event){
            if(event){
                event.stopPropagation()
                this.popWarningMsg('暂未开放')
                return
            }
            let data = this.channels.find(item => item.channelId === channelId)
            if (!data) {
                return
            }
            if(data.channelChatUnReadCount <= 0){
                return
            }

            let messageList = this.channelsMessageMap[channelId] || []
            if(messageList.length === 0){
                return
            }

            // 找到时间最晚一条chat类型的消息
            let latestChatMessage = messageList.filter(item => [
                'system', 'friend', 'group'
            ].includes(item.type)).sort((a, b) => {
                return new Date(a.messageTimeStamp).getTime() - new Date(b.messageTimeStamp).getTime()
            }).pop()

            // 找到时间最晚一条media类型的消息
            let latestMediaMessage = messageList.filter(item => [
                'audio', 'video'
            ].includes(item.type)).sort((a, b) => {
                return new Date(a.messageTimeStamp).getTime() - new Date(b.messageTimeStamp).getTime()
            }).pop()

            // 找到时间最晚一条file类型的消息
            let latestFileMessage = messageList.filter(item => [
                'p2p', 'offline'
            ].includes(item.type)).sort((a, b) => {
                return new Date(a.messageTimeStamp).getTime() - new Date(b.messageTimeStamp).getTime()
            }).pop()

            let latestChatReadId = latestChatMessage ? latestChatMessage.id : 0
            let latestMediaReadId = latestMediaMessage ? latestMediaMessage.id : 0
            let latestFileReadId = latestFileMessage ? latestFileMessage.id : 0

            const params = {
                channelId, latestChatReadId, latestMediaReadId, latestFileReadId
            }
            if(!window.tl_rtc_app_comm.checkRequestParams(params)){
                this.popErrorMsg("请求参数非法")
                return
            }
            const { data: readRes } = await this.tlRequest({
                url: '/api/web/user-read/update-channel-mutil-read',
                method: 'post',
                useCache: false,
                data: params,
                
            })

            if(!readRes.success){
                this.popErrorMsg(readRes.msg)
                return
            }

            // 更新侧边栏未读消息数量
            await this.emitSubModuleEvent({
                event: 'sub-module-sidebar-unread-update',
                data: {
                    name: 'channel', 
                    type: 'reduce', 
                    count: data.channelChatUnReadCount
                }
            })

            // 更新频道未读消息数量
            this.channels.forEach(item => {
                if(item.channelId === channelId){
                    item.channelChatUnReadCount = 0
                }
            })

            // 更新channelChatUnReadCount
            messageList.forEach(message => {
                const messageType = message.type
                let latestReadId = 0
                if(['system', 'friend', 'group'].includes(messageType)){
                    latestReadId = latestChatReadId
                }else if(['audio', 'video'].includes(messageType)){
                    latestReadId = latestMediaReadId
                }else if(['p2p', 'offline'].includes(messageType)){
                    latestReadId = latestFileReadId
                }
                if(message.id <= latestReadId){
                    message.hasRead = true
                }
            })
        },
        /**
         * 更新频道最新消息
         * @param {*} channelId 
         * @param {*} extra 
         */
        updateChannelLatestMessage: function({
            channelId, extra, callback
        }){
            const channel = this.channels.find(item => item.channelId === channelId)
            if(!channel){
                callback && callback()
                return
            }

            channel.extra = JSON.parse(JSON.stringify(extra))

            // 遍历消息列表，如果未读消息有人@你，则显示@你
            let messageList = this.channelsMessageMap[channelId] || []
            messageList.forEach(item => {
                if(item.atUserId === this.propsUser.userId && !item.hasRead){
                    channel.extra.message = `
                        <span class="tl-rtc-app-left-panel-channel-item-content-message-at-me">
                            [有人@你]
                        </span> ${channel.extra.message}
                    `
                }
            })

            messageList.push(extra)

            this.channelsMessageMap[channelId] = messageList
            
            this.$forceUpdate()

            callback && callback()
        },
        /**
         * 获取频道列表
         */
        getChannelList: async function(){
            const { data: channelRes } = await this.tlRequest({
                url: '/api/web/channel/get-channel-list',
                method: 'get',
                useCache: true,
                cacheTime: 5 * 1000
            })

            if(!channelRes.success){
                this.popErrorMsg(channelRes.msg)
                return []
            }

            return channelRes.data
        },
        /**
         * 获取频道列表的用户列表
         */
        getChannelListUserList : async function(){
            const { data: channelsUserMapRes } = await this.tlRequest({
                url: '/api/web/channel-user/get-channel-list-user-list',
                method: 'get',
                useCache: true,
                cacheTime: 10 * 1000
            })

            if(!channelsUserMapRes.success){
                this.popErrorMsg(channelsUserMapRes.msg)
                return 
            }

            this.channelsUserMap = channelsUserMapRes.data
        },
        /**
         * 获取所有频道消息列表
         */
        getChannelListMessageList : async function(channelIdList){
            if(!channelIdList || channelIdList.length === 0){
                return {}
            }

            const params = {
                channelIdList : channelIdList
            }
            if(!window.tl_rtc_app_comm.checkRequestParams(params)){
                this.popErrorMsg("请求参数非法")
                return {}
            }
            const { data: channelsMessageRes } = await this.tlRequest({
                url: '/api/web/channel/get-channel-message-list',
                method: 'post',
                useCache: false,
                data: params,
            })

            if(!channelsMessageRes.success){
                this.popErrorMsg(channelsMessageRes.msg)
                return {}
            }

            let channelsMessageMap = channelsMessageRes.data

            // 处理消息
            for (let channelId in channelsMessageMap) {
                const messageList = channelsMessageMap[channelId] || []
                if(!channelsMessageMap[channelId]){
                    channelsMessageMap[channelId] = []
                }

                // 按时间排序
                messageList.sort((a, b) => {
                    return new Date(a.messageTimeStamp).getTime() - new Date(b.messageTimeStamp).getTime()
                })

                channelsMessageMap[channelId] = messageList
            }

            return channelsMessageMap
        },
        /**
         * 获取指定频道信息
         */
        getChannelInfo: async function(channelId){
            const params = {
                channelId: channelId
            }
            if(!window.tl_rtc_app_comm.checkRequestParams(params)){
                this.popErrorMsg("请求参数非法")
                return
            }
            const { data: channelRes } = await this.tlRequest({
                url: '/api/web/channel/get-channel-info',
                method: 'get',
                params: params,
                useCache: true,
                cacheTime: 5 * 1000
            })

            if(!channelRes.success){
                this.popErrorMsg(channelRes.msg)
                return
            }
            if(channelRes.data.length === 0){
                return
            }

            // 更新频道列表
            const updateChannelData = channelRes.data
            const channelIndex = this.channels.findIndex(item => item.channelId === channelId)
            if(channelIndex > -1){
                this.channels[channelIndex] = updateChannelData
            }else{
                this.channels.push(updateChannelData)
            }
        },
        /**
         * 获取指定频道的用户列表
         */
        getChannelUserList: async function(channelId){
            const params = {
                channelId: channelId
            }
            if(!window.tl_rtc_app_comm.checkRequestParams(params)){
                this.popErrorMsg("请求参数非法")
                return
            }
            const { data: channelsUserMapRes } = await this.tlRequest({
                url: '/api/web/channel-user/get-channel-user-list',
                method: 'get',
                params: params,
                useCache: true,
                cacheTime: 10 * 1000
            })

            if(!channelsUserMapRes.success){
                this.popErrorMsg(channelsUserMapRes.msg)
                return
            }
            // 更新频道用户列表
            this.channelsUserMap[channelId] = channelsUserMapRes.data
        },
        /**
         * 获取指定频道的消息列表
         */
        getChannelMessageList: async function({
            channelId
        }){
            if(!this.channelsMessageMap[channelId]){
                // 更新频道，通知兄弟子模块，数据变更
                for(let i = 0; i < this.channels.length; i++){
                    let item  = this.channels[i]
                    if(item.channelId !== channelId){
                        continue
                    }
                    // 更新channelMessageAllLoad
                    item.channelMessageAllLoad = true

                    // 通知兄弟子模块，数据变更
                    await this.emitSubModuleEvent({
                        event: 'sub-module-channel-content-open',
                        data: {
                            channelMessageAllLoad: item.channelMessageAllLoad,
                        }
                    })
                }
                return
            }

            // 拿到时间最早的一条消息
            let chatMinId = -1
            let mediaMinId = -1
            let fileMinId = -1

            this.channelsMessageMap[channelId].forEach(item => {
                const messageType = item.type
                const messageId = item.id
                if(['system', 'friend', 'group'].includes(messageType)){
                    if(chatMinId === -1){
                        chatMinId = messageId
                    }
                    if (messageId < chatMinId){
                        chatMinId = messageId
                    }
                }else if(['audio', 'video'].includes(messageType)){
                    if(mediaMinId === -1){
                        mediaMinId = messageId
                    }
                    if (messageId < mediaMinId){
                        mediaMinId = messageId
                    }
                }else if(['p2p', 'offline'].includes(messageType)){
                    if(fileMinId === -1){
                        fileMinId = messageId
                    }
                    if (messageId < fileMinId){
                        fileMinId = messageId
                    }
                }
            })

            const params = {
                channelId: channelId,
                chatMinId: chatMinId,
                mediaMinId: mediaMinId,
                fileMinId: fileMinId,
            }
            if(!window.tl_rtc_app_comm.checkRequestParams(params)){
                this.popErrorMsg("请求参数非法")
                return
            }

            // 获取频道消息列表
            const { data: channelsMessageRes } = await this.tlRequest({
                url: '/api/web/channel/get-channel-message',
                method: 'post',
                useCache: false,
                data: params,
            })
            if(!channelsMessageRes.success){
                this.popErrorMsg(channelsMessageRes.msg)
                return
            }

            // 更新频道消息列表
            let messageList = channelsMessageRes.data || []
            if(!this.channelsMessageMap[channelId]){
                this.channelsMessageMap[channelId] = []
            }
            this.channelsMessageMap[channelId].unshift(...messageList)

            // 按时间排序
            this.channelsMessageMap[channelId].sort((a, b) => {
                return new Date(a.messageTimeStamp).getTime() - new Date(b.messageTimeStamp).getTime()
            })

            // 更新频道，通知兄弟子模块，数据变更
            for(let i = 0; i < this.channels.length; i++){
                let item  = this.channels[i]
                if(item.channelId !== channelId){
                    continue
                }
                // 更新channelMessageAllLoad
                item.channelMessageAllLoad = messageList.length < 20

                // 通知兄弟子模块，数据变更
                await this.emitSubModuleEvent({
                    event: 'sub-module-channel-content-open',
                    data: {
                        channelMessageAllLoad: item.channelMessageAllLoad,
                        channelMessages: this.channelsMessageMap[channelId] || [],
                    }
                })
            }
        },
        /**
         * 更新指定频道信息，指定频道用户列表，指定频道消息列表
         * @param {*} callback
         * @param {*} channelId
         * @param {*} update_types
         */
        updateChannelInfo: async function({
            channelId, update_types, callback
        }){

            if(update_types && update_types.length >= 0){
                if(update_types.includes('channelInfo')){
                    // 获取指定频道信息
                    await this.getChannelInfo(channelId)
                }
                if(update_types.includes('channelUserList')){
                    // 获取指定频道用户列表
                    await this.getChannelUserList(channelId)
                }
                if(update_types.includes('channelMessageList')){
                    // 获取指定频道消息列表
                    await this.getChannelMessageList({
                        channelId
                    })
                }

                // 处理频道列表数据
                this.handlerChannelListData({
                    channels: this.channels, channelsMessageMap: this.channelsMessageMap
                })
                
                this.$forceUpdate()
            }

            // 回调结果
            callback && callback()
        },
        /**
         * 初始化频道数据
         * @param {*} next
         */
        initChannelList: async function({
            callback
        }){
            let index = layer.load(2, {
                shade: [0.3, '#0000001f']
            })

            // 获取频道列表
            const channels = await this.getChannelList()

            // 分批获取频道消息列表, 10个频道一次
            let batchCount = 10
            let channelsMessageMap = {}
            let channelIdList = channels.map(channel => channel.channelId)
            let count = Math.ceil(channelIdList.length / batchCount)
            for(let i = 0; i < count; i++){
                let start = i * batchCount
                let end = (i + 1) * batchCount
                let tempChannelIdList = channelIdList.slice(start, end)
                let tempChannelsMessageMap = await this.getChannelListMessageList(tempChannelIdList)
                channelsMessageMap = Object.assign(channelsMessageMap, tempChannelsMessageMap)
            }

            // 处理频道列表数据
            this.handlerChannelListData({
                channels, channelsMessageMap
            })

            // 获取频道用户列表
             await this.getChannelListUserList()

            this.$forceUpdate()

            layer.close(index)

            callback && callback()
        },
        /**
         * 处理频道列表数据
         */
        handlerChannelListData: function({
            channels, channelsMessageMap
        }){
            // 更新channelChatUnReadCount
            let allUnreadCount = 0

            // 处理频道相关消息数据
            for(let i = 0; i < channels.length; i++){
                let channelInfo  = channels[i]

                const messageList = channelsMessageMap[channelInfo.channelId] || []

                let hasAtMe = false;
                let channelChatUnReadCount = 0
                messageList.forEach(message => {
                    // 统计未读消息数量
                    if(!message.hasRead){
                        channelChatUnReadCount += 1
                    }
                    // 时间格式化
                    if(message.messageTimeStamp){
                        message.messageTimeStampFormat = window.util.timeAgo(message.messageTimeStamp)
                    }
                    if(message.type === 'audio'){
                        // 设置icon
                        message.mediaIcon = '#tl-rtc-app-icon-31dianhua'
                    }else if(message.type === 'video'){
                        // 设置icon
                        message.mediaIcon = '#tl-rtc-app-icon-shexiangtou'
                    }else if (['p2p', 'offline'].includes(message.type)){
                        // 设置icon
                        let fileExt = message.fileName.split('.').pop().toLowerCase()
                        message.fileIcon = window.tl_rtc_app_comm.getFileIcon(fileExt)
                        //文件大小format, kb/mb/gb
                        let fileSize = message.fileSize
                        message.fileSizeFormat = window.tl_rtc_app_comm.getFileSize(fileSize)
                    }
                    
                    // 如果未读消息有人@你，则显示@你
                    if(message.atUserId === this.propsUser.userId && !message.hasRead){
                        hasAtMe = true
                    }
                })

                // 处理频道列表展示的最新消息
                const latestMessage = messageList[messageList.length - 1] || {}
                let messageTimeStampFormat = latestMessage.messageTimeStamp
                if(messageTimeStampFormat){
                    messageTimeStampFormat = window.util.timeAgo(latestMessage.messageTimeStamp, true)
                }

                channelInfo.extra = {
                    fromUserName: latestMessage.fromUserName || '',
                    message : latestMessage.message || '',
                    createTime : latestMessage.createTime || '',
                    messageTimeStamp: latestMessage.messageTimeStamp || '',
                    messageTimeStampFormat: messageTimeStampFormat,
                    messageVersion: latestMessage.messageVersion || '',
                    replyToMessageId: latestMessage.replyToMessageId || '',
                    replyToMessageType: latestMessage.replyToMessageType || '',
                    replyToMessageContent: latestMessage.replyToMessageContent || '',
                    type : latestMessage.type,
                    atUserId: latestMessage.atUserId || '',
                    atUserName: latestMessage.atUserName || '',
                    isAtAll: latestMessage.isAtAll || false,
                    fileName : latestMessage.fileName || '',
                    fileSizeFormat : latestMessage.fileSizeFormat || '',
                    fileIcon : latestMessage.fileIcon || '',
                    mediaIcon: latestMessage.mediaIcon || '',
                }

                // 如果未读消息有人@你，则显示@你
                if(hasAtMe){
                    channelInfo.extra.message = `
                        <span class="tl-rtc-app-left-panel-channel-item-content-message-at-me">
                            [有人@你]
                        </span> ${channelInfo.extra.message}
                    `
                }

                // 统计频道未读消息数量
                if(channelChatUnReadCount > 0){
                    channelInfo.channelChatUnReadCount = channelChatUnReadCount
                    allUnreadCount += channelChatUnReadCount
                }
            }

            // 更新侧边栏未读消息数量
            this.emitSubModuleEvent({
                event: 'sub-module-sidebar-unread-update',
                data: {
                    name: 'channel', type: 'all', count: allUnreadCount
                }
            })

            // 按照频道未读消息数量排序
            channels.sort((a, b) => {
                return b.channelChatUnReadCount - a.channelChatUnReadCount
            })

            // 先按频道列表按时间倒序排序
            channels.sort((a, b) => {
                return new Date(b.createTime).getTime() - new Date(a.createTime).getTime()
            })

            // 再将置顶的频道放在最前面
            channels.sort((a, b) => {
                return b.channelTop - a.channelTop
            })

            this.channels = [...channels]

            this.channelsMessageMap = channelsMessageMap

            this.$nextTick(() => {
                this.registerCustomMenu()
            })
        },
        /**
         * 快速创建频道
         */
        quickCreateChannel: function(){
            this.emitSubModuleEvent({
                event: 'sub-module-channel-top-quick-create-channel',
                data: {
                    channelName: '我的聊天频道'
                }
            })
        },
        /**
        * 不显示频道
        * @param {*} channelId
        */
        hiddenChannel: async function(channelId, event){
            event.stopPropagation()

            this.popWarningMsg('暂未开放')
        },
        /**
        * 更新频道置顶
        * @param {*} channelId
        */
        updateChannelTop: async function(channelId, event){
            event.stopPropagation()

            const channel = this.channels.find(item => item.channelId === channelId)
            if(!channel){
                return
            }

            this.emitSubModuleEvent({
                event: 'sub-module-channel-content-update-channel-top-quick',
                data: {
                    channelId: channelId, channelTop: !channel.channelTop
                }
            })

            const preSwiper = this.swiperMap[channelId]
            preSwiper && preSwiper.slideTo(0)
            this.currentSwiperChannelId = ''
        },
        /**
         * 消息免打扰
         * @param {*} channelId 
         * @param {*} event 
         */
        unNotifyChannel: async function(channelId, event){
            if(event){
                event.stopPropagation()
            }

            this.popWarningMsg('暂未开放')
        },
        /**
         * 删除频道
         * @param {*} channelId 
         * @param {*} event 
         */
        deleteChannel: async function(channelId, event){
            if(event){
                event.stopPropagation()
            }

            this.popWarningMsg('暂未开放')
        },
        /**
         * 加载更多频道消息
         * @param {*} channelId
         * @param {*} callback
         */
        loadMoreChannelMessage: async function({
            channelId, callback
        }){
            // 获取指定频道消息列表
            await this.getChannelMessageList({
                channelId
            })

            // 处理频道列表数据
            this.handlerChannelListData({
                channels: this.channels, channelsMessageMap: this.channelsMessageMap
            })

            callback && callback()
        },
        /**
         * 注册自定义菜单
         */
        registerCustomMenu: function(){
            let that = this
            for(let i = 0; i < this.filterChannels.length; i++){
                let item = this.filterChannels[i]
                let menuIdList = [
                    'hiddenNotify', 'copyChannelId', 'markUnread',
                    'hiddenChannel', 'clearHistory',
                ]

                if(item.channelType === 'group'){
                    // 群聊支持邀请好友
                    menuIdList.unshift('inviteFriend')
                    // 群聊支持退出群聊
                    menuIdList.push('exitChannel')
                }else if(item.channelType === 'friend'){
                    // 私聊支持删除好友
                    menuIdList.push('deleteFriend')
                }
                
                // 置顶/取消置顶
                if(item.channelTop){
                    menuIdList.unshift('unTopChannel')
                }else{
                    menuIdList.unshift('topChannel')
                }

                // 注册自定义菜单
                this.emitSubModuleEvent({
                    event: 'component-menu-register-custom',
                    data: {
                        eventList: ['contextmenu', 'press', 'pan'],
                        elemId: '#channel-item-' + item.channelId,
                        menuIdList: menuIdList,
                        extra: item,
                        pressCallback: function(){
                            that.isPressEvent = true
                        },
                        pressUpCallback: function(){
                            setTimeout(() => {
                                that.isPressEvent = false
                            }, 300);
                        },
                    }
                })
            }
        },
        /**
         * 过滤频道标签
         * @param {*} tag 
         */
        filterTag: function({
            tag, callback
        }){
            this.searchTag = tag
            callback && callback()
        },
        /**
         * 搜索关键字变更
         * @param {*} key 
         */
        searchKeyChange: function({
            key, callback
        }){
            this.searchKey = key
            callback && callback()
        },
        /**
         * 初始化swiper
         */
        initSwiper: function(){
            let that = this

            const { bodyHeight } = window.tl_rtc_app_comm.getPropertyValues([
                { key: "bodyHeight", value: "body-height" }
            ])

            // 计算编辑器的高度
            let height = (
                Number(bodyHeight.replace("%", "")) * (
                    window.innerHeight * Number(bodyHeight.replace("%", "")) / 100
                ) / 100
            )

            let slidesPerView = parseInt(height / 84)
            if(height < 650){
                slidesPerView = parseInt(height / 70)
            }

            // 初始化频道列表swiper
            new Swiper('#channelListSwiper', {
                slidesPerView: slidesPerView,
                direction: 'vertical',
                loop: false,
                observer: true,
                mousewheel: true, // 鼠标滚轮控制
                forceToAxis: true, // 滚动条只能在一个方向上拖动
                spaceBetween: 0.5,
                freeMode: {
                    momentumRatio: 1, // 惯性动量比
                    momentumBounceRatio: 0, // 滑动反弹
                    minimumVelocity: 0, // 最小滑动速度
                }
            });

            // 初始化频道列表swiper子项
            for(let i = 0; i < this.channels.length; i++){
                let channelId = this.channels[i].channelId
                
                let swiper = new Swiper('#channel-item-swiper-' + channelId, {
                    slidesPerView: 1,
                    direction: 'horizontal',
                    threshold: 10,
                    longSwipesMs: 100,
                    on:{
                        slideChange: function(){
                            if(this.activeIndex === 0){ // 右滑
                                that.currentSwiperChannelId = ''
                                return
                            }else if(this.activeIndex === 1){ // 左滑
                                const preSwiper = that.swiperMap[that.currentSwiperChannelId]
                                preSwiper && preSwiper.slideTo(0)
                            }

                            that.currentSwiperChannelId = channelId
                        },
                    }
                });

                this.swiperMap[channelId] = swiper
            }
        },
        channelListGoBack: function({
            callback
        }){
            this.showChannelId = ''

            callback && callback()
        },
        /**
         * 清理频道消息
         * @param {*} channelId 
         * @param {*} callback 
         */
        clearChannelMessage: async function({
            channelId, callback
        }){
            let isConfirm = await new Promise(resolve => {
                layer.confirm('确定要清空聊天记录吗？', {
                    title: '清空聊天记录',
                    content: '清空后将无法恢复',
                    btn: ['确定', '取消'],
                    shadeClose: 1,
                },function (index) {
                    resolve(true)
                    layer.close(index)
                }, function (index) {
                    resolve(false)
                })
            })

            if(!isConfirm){
                callback && callback()
                return
            }

            const params = {
                channelId
            }

            if(!window.tl_rtc_app_comm.checkRequestParams(params)){
                this.popErrorMsg("请求参数非法")
                callback && callback()
                return
            }

            const { data: userClearRes } = await this.tlRequest({
                url: '/api/web/user-clear/update-channel-mutil-clear',
                method: 'post',
                useCache: false,
                data: params,
            })

            if(!userClearRes.success){
                this.popErrorMsg(userClearRes.msg)
                callback && callback()
                return
            }

            // 更新频道
            await this.updateChannelInfo({
                channelId, update_types: ['channelMessageList']
            })

            this.channelsMessageMap[channelId] = []
            for(let i = 0; i < this.channels.length; i++){
                let item = this.channels[i]
                if(item.channelId === channelId){
                    item.extra = {}
                }
            }

            this.$forceUpdate()

            // 通知兄弟子模块，数据变更
            await this.emitSubModuleEvent({
                event: 'sub-module-channel-content-open',
                data: {
                    channelMessages: this.channelsMessageMap[channelId] || []
                }
            })

            this.popSuccessMsg(userClearRes.msg)

            callback && callback()
        }
    },
    mounted: async function() {
        let that = this

        // 初始化swiper TODO 目前有问题
        this.initSwiper()
    },
    created: async function(){
        // 获取频道列表
        await this.initChannelList({})

        this.requestOk = true

        // 监听搜索关键字更新
        window.subModule.$on('sub-module-channel-list-search-key-update', this.searchKeyChange)

        // 监听点击频道标签
        window.subModule.$on('sub-module-channel-list-filter-tag', this.filterTag)

        // 初始化频道列表
        window.subModule.$on('sub-module-channel-list-init', this.initChannelList)

        // 更新指定频道数据
        window.subModule.$on('sub-module-channel-list-update-channel', this.updateChannelInfo)
        
        // 加载指定频道消息
        window.subModule.$on('sub-module-channel-list-load-channel-message', this.loadMoreChannelMessage)

        // 打开频道面板
        window.subModule.$on('sub-module-channel-list-item-open', this.openChannelMessageHandler)

        // 更新频道最新消息
        window.subModule.$on('sub-module-channel-list-update-latest-message', this.updateChannelLatestMessage)

        // 监听收到socket聊天消息
        window.subModule.$on('sub-module-channel-list-chat-socket', this.channelChatSocketHandler)

        // 移动端返回到频道列表
        window.subModule.$on('sub-module-channel-list-go-back', this.channelListGoBack)

        // 清理频道消息
        window.subModule.$on('sub-module-channel-list-clear-channel-message', this.clearChannelMessage)
    },
    template: `
        <div class="tl-rtc-app-left-panel-channel">
            <div v-if="requestOk && filterChannels.length === 0 && channels.length > 0">
                <div class="tl-rtc-app-left-panel-no-channel">
                    未找到相关聊天
                </div>
            </div>
            <div v-if="requestOk && channels.length === 0">
                <div class="tl-rtc-app-left-panel-no-channel">
                    暂无聊天，快创建一个吧
                </div>
                <div class="tl-rtc-app-left-panel-no-channel">
                    <button class="layui-btn layui-btn-primary" @click="quickCreateChannel()">快速创建</button>
                </div>
            </div>
            <div class="swiper" id="channelListSwiper" v-show="filterChannels.length > 0">
                <div class="swiper-wrapper">
                    <div class="swiper-slide" v-for="item in filterChannels" @click="openChannelMessageHandler(item)">

                        <div class="swiper tl-rtc-app-left-panel-channel-sub" :id="'channel-item-swiper-' + item.channelId">
                            <div class="swiper-wrapper">
                                <div class="tl-rtc-app-left-panel-channel-item swiper-slide"
                                    :class="{
                                        'tl-rtc-app-left-panel-channel-item-active' : showChannelId === item.channelId,
                                        'tl-rtc-app-left-panel-channel-item-top' : item.channelTop
                                    }"
                                    :id="'channel-item-' + item.channelId"
                                >
                                    <div class="tl-rtc-app-left-panel-channel-item-img">
                                        <img :src="item.channelAvatar" alt="">
                                    </div>
                                    <div class="tl-rtc-app-left-panel-channel-item-content">
                                        <div class="tl-rtc-app-left-panel-channel-item-content-nickname" v-if="item.channelType === 'friend'">
                                            {{item.channelReName}}
                                            <span v-if="item.channelBlack" class="tl-rtc-app-left-panel-channel-item-content-nickname-black">
                                                ( 已拉黑<svg class="icon" aria-hidden="true" >
                                                    <use xlink:href="#tl-rtc-app-icon-lahei-1"></use>
                                                </svg>)
                                            </span>
                                        </div>
                                        <div class="tl-rtc-app-left-panel-channel-item-content-nickname" v-if="item.channelType === 'group'">
                                            {{item.channelName}}
                                        </div>
                                        <div class="tl-rtc-app-left-panel-channel-item-content-message"
                                            v-if="['offline', 'p2p'].includes(item.extra.type)"
                                        >
                                            <div class="tl-rtc-app-left-panel-channel-item-content-message-file">
                                                <svg class="icon" aria-hidden="true">
                                                    <use :xlink:href="item.extra.fileIcon"></use>
                                                </svg>
                                                <div class="tl-rtc-app-left-panel-channel-item-content-message-file-info">
                                                    <span style="font-size: 12px;">{{item.extra.fileName}}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="tl-rtc-app-left-panel-channel-item-content-message"
                                            v-else-if="['audio', 'video'].includes(item.extra.type)"
                                        >
                                            <svg class="icon" aria-hidden="true">
                                                <use :xlink:href="item.extra.mediaIcon"></use>
                                            </svg>
                                            <span>{{item.extra.message}}</span>
                                        </div>
                                        <div v-else class="tl-rtc-app-left-panel-channel-item-content-message" v-html="item.extra.message"> </div>
                                    </div>
                                    <div class="tl-rtc-app-left-panel-channel-item-other">
                                        <div class="tl-rtc-app-left-panel-channel-item-other-time">
                                            {{item.extra.messageTimeStampFormat}}
                                        </div>
                                        <div class="tl-rtc-app-left-panel-channel-item-other-unread" v-if="item.channelChatUnReadCount > 0">
                                            <div v-if="openMessageDot">
                                                <div class="layui-badge" v-if="item.channelChatUnReadCount > 9">
                                                    {{Math.min(item.channelChatUnReadCount, 99)}}
                                                </div>
                                                <div class="layui-badge" v-else>
                                                    {{Math.min(item.channelChatUnReadCount, 99)}}
                                                </div>
                                            </div>
                                            <div v-else>
                                                <div class="layui-badge" style="background:#aeaaaa;" v-if="item.channelChatUnReadCount > 9">
                                                    {{Math.min(item.channelChatUnReadCount, 99)}}
                                                </div>
                                                <div class="layui-badge" style="background:#aeaaaa;" v-else>
                                                    {{Math.min(item.channelChatUnReadCount, 99)}}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="tl-rtc-app-left-panel-channel-item-quick swiper-slide">
                                    <div class="tl-rtc-app-left-panel-channel-item-quick-mark-unread" 
                                        :id="'channel-item-mark-unread-' + item.channelId" style="background-color: #8c8cdf;"
                                        @click="updateChannelUnReadMessage(item.channelId, $event)"
                                    >
                                        {{item.channelChatUnReadCount > 0 ? '标记已读' : '标记未读'}}
                                    </div>
                                    <div class="tl-rtc-app-left-panel-channel-item-quick-top" 
                                        :id="'channel-item-top-' + item.channelId" style="background-color: #75b963;"
                                        @click="updateChannelTop(item.channelId, $event)"
                                    >
                                        {{item.channelTop ? '取消置顶' : '置顶'}}
                                    </div>
                                    <div class="tl-rtc-app-left-panel-channel-item-quick-un-notify" 
                                        :id="'channel-item-no-notify-' + item.channelId" style="background-color: #c2b862;"
                                        @click="unNotifyChannel(item.channelId, $event)"
                                    >
                                        免打扰
                                    </div>
                                    <div class="tl-rtc-app-left-panel-channel-item-quick-hidden" 
                                        :id="'channel-item-hidden-' + item.channelId" style="background-color: #88adac;"
                                        @click="hiddenChannel(item.channelId, $event)"
                                    >
                                        不显示
                                    </div>
                                    <div class="tl-rtc-app-left-panel-channel-item-quick-delete" 
                                        :id="'channel-item-delete-' + item.channelId" style="background-color: #da5d5d;"
                                        @click="deleteChannel(item.channelId, $event)"
                                    >
                                        删除
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div class="swiper-slide" v-show="propsIsMobile"></div>
                </div>
            </div>
        </div>
    `,
}

window.tl_rtc_app_module_channel_list = tl_rtc_app_module_channel_list