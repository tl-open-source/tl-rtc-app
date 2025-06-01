const tl_rtc_app_module_channel_content_search_message = {
    props : {
        channelId : {
            type : String,
            default : ''
        },
        channelName : {
            type : String,
            default : ''
        },
        channelType : {
            type : String,
            default : ''
        },
        channelUsers : {
            type : Array,
            default : function(){
                return []
            }
        },
        channelMessages : {
            type : Array,
            default : function(){
                return []
            }
        },
        socketId : {
            type : String,
            default : ''
        },
        socket: {
            type: Object,
            default: function(){
                return {}
            }
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
        }
    },
    computed: {
        propsChannelId(){
            return this.channelId;
        },
        propsChannelName(){
            return this.channelName;
        },
        propsSocketId(){
            return this.socketId;
        },
        propsSocket(){
            return this.socket;
        },
        propsUserId(){
            return this.user.userId;
        },
        propsChannelUsers(){
            return this.channelUsers;
        },
        propsChannelType(){
            return this.channelType;
        },
        propsUser(){
            return this.user;
        },
        propsIsMobile(){
            return this.isMobile;
        },
        propsChannelMessages(){
            return this.channelMessages;
        },
        propsLeftModule() {
            return this.leftModule;
        },
        propsRightModule() {
            return this.rightModule;
        },
    },
    data : function(){
        return {
            searchMessageList: [],
            keyword: '',
            messageTypes: [
                'chat', 'file', 'media'
            ],
            timeRangeType: 'recent-mouth',
            startTime: '',
            endTime: '',
            isLoadMore: false
        }
    },
    watch: {
        isLoadMore: {
            deep: true,
            immediate: true,
            handler: function(val){
                const dom = document.getElementById('search-channel-message-load-more')
                if(!dom){
                    return
                }
                if(val){
                    document.getElementById('search-channel-message-load-more').style.display = 'block'
                }else{
                    document.getElementById('search-channel-message-load-more').style.display = 'none'
                }
            }
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
         * laytpl渲染
         * @param {*} tpl_html
         * @param {*} data
         * @param {*} tpl_view_html
         * @param {*} callback
         */
        tplRender: function ({tpl_html, data, tpl_view_html, callback}) {
            if (window.laytpl) {
                laytpl(tpl_html.innerHTML).render(data, (html) => {
                    tpl_view_html.innerHTML = html;
                    if (callback) {
                        callback()
                    }
                });
            }
        },
        /**
        * 搜索频道消息
        */
        searchChannelMessage: async function(){
            let chatMinId = -1
            let fileMinId = -1
            let mediaMinId = -1

            this.searchMessageList.forEach(item => {
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
            });

            if(this.timeRangeType === 'today'){
                let { today } = window.tl_rtc_app_comm.getTimeRanges()
                this.startTime = today.startTime
                this.endTime = today.endTime
            }else if(this.timeRangeType === 'yesterday'){
                let { yesterday } = window.tl_rtc_app_comm.getTimeRanges()
                this.startTime = yesterday.startTime
                this.endTime = yesterday.endTime
            }else if(this.timeRangeType === 'last-week'){
                let { lastWeek } = window.tl_rtc_app_comm.getTimeRanges()
                this.startTime = lastWeek.startTime
                this.endTime = lastWeek.endTime
            }else if(this.timeRangeType === 'recent-mouth'){
                let { lastMonth } = window.tl_rtc_app_comm.getTimeRanges()
                this.startTime = lastMonth.startTime
                this.endTime = lastMonth.endTime
            }else if(this.timeRangeType === 'cus-day-range'){
                if(!this.startTime || !this.endTime){
                    return
                }
            }

            if(!this.startTime || !this.endTime){
                this.popWarningMsg('请选择时间范围')
                return
            }

            const params = {
                channelId: this.propsChannelId,
                keyword: this.keyword,
                startTime: this.startTime,
                endTime: this.endTime,
                types: this.messageTypes,
                chatMinId: this.messageTypes.includes('chat') && this.isLoadMore ? chatMinId : -1, 
                fileMinId: this.messageTypes.includes('file') && this.isLoadMore ? fileMinId : -1,
                mediaMinId: this.messageTypes.includes('media') && this.isLoadMore ? mediaMinId : -1,
            }
            if(!window.tl_rtc_app_comm.checkRequestParams(params)){
                this.popErrorMsg("请求参数非法")
                return
            }
            const { data: channelMessageRes } = await this.tlRequest({
                url: '/api/web/channel/search-channel-message',
                method: 'post',
                useCache: false,
                data: params,
                
            })
            if(!channelMessageRes.success){
                this.popErrorMsg(channelMessageRes.msg)
                return
            }

            this.searchMessageList = [...channelMessageRes.data]

            this.searchMessageList.forEach(item => {
                if(item.messageTimeStamp){
                    item.messageTimeStampFormat = window.util.timeAgo(item.messageTimeStamp)
                }
                if(item.type === 'audio'){
                    // 设置icon
                    item.mediaIcon = '#tl-rtc-app-icon-31dianhua'
                }else if(item.type === 'video'){
                    // 设置icon
                    item.mediaIcon = '#tl-rtc-app-icon-shexiangtou'
                }else if (['p2p', 'offline'].includes(item.type)){
                    if(!item.fileName){
                        return
                    }
                    // 设置icon
                    let fileExt = item.fileName.split('.').pop().toLowerCase()
                    item.fileIcon = window.tl_rtc_app_comm.getFileIcon(fileExt)
                    //文件大小format, kb/mb/gb
                    let fileSize = item.fileSize
                    item.fileSizeFormat = window.tl_rtc_app_comm.getFileSize(fileSize)
                }
            })

            // 按照时间排序
            this.searchMessageList.sort((a, b) => {
                return new Date(b.messageTimeStamp).getTime() - new Date(a.messageTimeStamp).getTime()
            })

            // 渲染搜索消息列表
            this.searchMessageListTplRender()
        },
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
        * 打开搜索频道消息窗口
        */
        openSearchChannelMessage: async function({
            callback
        }){
            let that = this
            let clientWidth = document.documentElement.clientWidth
            let full = clientWidth < 580

            layer.open({
                type: 1,
                title: '历史聊天记录 - ' + this.propsChannelName,
                closeBtn: full ? 1 : 0,
                area: full ? ['100%', '100%'] : ['580px', '650px'],
                shadeClose: true,
                resize: false,
                skin: 'tl-rtc-app-layer-search-channel-message',
                content: `
                    <div class="tl-rtc-app-right-channel-content-search-message-panel">
                        <div class="tl-rtc-app-right-channel-content-search-message-panel-header">
                            <div class="tl-rtc-app-right-channel-content-search-message-panel-header-search">
                                <i class="layui-icon layui-icon-search"></i>
                                <input id="search-channel-message-input" type="text" autocomplete="off" placeholder="搜索" class="layui-input" maxlength="30">
                            </div>
                            <div class="tl-rtc-app-right-channel-content-search-message-panel-header-tools">
                                <div class="tl-rtc-app-right-channel-content-search-message-panel-header-tools-item" style="display:none;">
                                    <div class="tl-rtc-app-right-channel-content-search-message-panel-header-tools-item-title">
                                        消息类型:
                                    </div>
                                    <div class="tl-rtc-app-right-channel-content-search-message-panel-header-tools-item-content">
                                        <div class="layui-badge" id="search-channel-message-type-chat">
                                            文字
                                        </div>
                                        <div class="layui-badge" id="search-channel-message-type-file">
                                            文件
                                        </div>
                                        <div class="layui-badge" id="search-channel-message-type-media">
                                            通话
                                        </div>
                                    </div>
                                </div>

                                <div class="tl-rtc-app-right-channel-content-search-message-panel-header-tools-item">
                                    <div class="tl-rtc-app-right-channel-content-search-message-panel-header-tools-item-title">
                                        时间范围:
                                    </div>
                                    <div class="tl-rtc-app-right-channel-content-search-message-panel-header-tools-item-content">
                                        <div class="layui-badge" id="search-channel-message-type-today">
                                            今天
                                        </div>
                                        <div class="layui-badge" id="search-channel-message-type-yesterday">
                                            前一天
                                        </div>
                                        <div class="layui-badge" id="search-channel-message-type-last-week">
                                            近一周
                                        </div>
                                        <div class="layui-badge" id="search-channel-message-type-recent-mouth">
                                            近一月
                                        </div>
                                        <div class="layui-badge" id="search-channel-message-type-cus-day-range" style="display:none">
                                            自定义
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="tl-rtc-app-right-channel-content-search-message-panel-list layui-form"
                            id="search_channel_message_tlp_view">
                        </div>
                        <div class="tl-rtc-app-right-channel-content-search-message-panel-footer">
                            <div class="tl-rtc-app-right-channel-content-search-message-panel-footer-load-more" 
                                id="search-channel-message-load-more"
                            >
                                <span>查看历史更多消息...</span>
                                <i class="layui-icon layui-icon-loading layui-anim layui-anim-rotate layui-anim-loop"></i>
                            </div>
                            <div class="tl-rtc-app-right-channel-content-search-message-panel-footer-total" id="search-channel-message-count">
                                共 ${this.searchMessageList.length}条记录
                            </div>
                        </div>
                        <script id="search_channel_message_tlp" type="text/html">
                            {{# if(d.length === 0){ }}
                                <div class="tl-rtc-app-right-channel-content-search-message-panel-list-empty">
                                    <svg class="icon" aria-hidden="true">
                                        <use xlink:href="#tl-rtc-app-icon-xiaoxi"></use>
                                    </svg> 
                                    <div> 暂无消息 </div>
                                </div>
                            {{# } }}
                            {{# layui.each(d, function(index, item){ }}
                                <div class="tl-rtc-app-right-channel-content-search-message-panel-list-item">
                                    <div class="tl-rtc-app-right-channel-content-search-message-panel-list-item-time">
                                        {{item.messageTimeStampFormat}} - 
                                        <span class="tl-rtc-app-right-channel-content-search-message-panel-list-item-user-name">
                                            {{item.fromUserName}}
                                        </span>
                                    </div>
                                    <div class="tl-rtc-app-right-channel-content-search-message-panel-list-item-info">
                                        <div class="tl-rtc-app-right-channel-content-search-message-panel-list-item-avatar"
                                            id="search-channel-message-{{item.type}}-{{item.id}}"
                                        >
                                            <img src="{{item.fromUserAvatar}}" alt="">
                                        </div>
                                        <div class="tl-rtc-app-right-channel-content-search-message-panel-list-item-content">
                                            {{# if(['group', 'friend', 'system'].includes(item.type)){ }}
                                                {{-item.message}}
                                            {{# }else if(['audio', 'video'].includes(item.type)){ }}
                                                <svg class="icon tl-rtc-app-right-channel-content-search-message-panel-list-item-icon" aria-hidden="true">
                                                    <use xlink:href="{{item.mediaIcon}}"></use>
                                                </svg> 
                                                <span>{{item.message}}</span>
                                            {{# }else if(['p2p', 'offline'].includes(item.type)){ }}
                                                <div class="tl-rtc-app-right-channel-content-search-message-panel-list-item-file">
                                                    <div class="tl-rtc-app-right-channel-content-body-item-message-file-left">
                                                        <svg class="icon" aria-hidden="true">
                                                            <use xlink:href="{{item.fileIcon}}"></use>
                                                        </svg>
                                                    </div>
                                                    <div class="tl-rtc-app-right-channel-content-body-item-message-file-info">
                                                        <span style="font-weight: bold;font-size: 12px;">${this.fileNameFormat(`{{item.fileName}}`)}</span>
                                                        <span style="margin-top: 10px;font-size: 10px;color: #8f8f8f;font-weight: bold;">
                                                            {{# if(item.type === 'offline'){ }}
                                                                [离线]
                                                            {{# }else if(item.type === 'p2p'){ }}
                                                                [在线]
                                                            {{# } }}
                                                            <span>{{item.fileSizeFormat}}</span>
                                                        </span>
                                                    </div>
                                                </div>
                                            {{# } }}
                                        </div>
                                    </div>
                                </div>
                            {{# }); }}
                        </script>
                    </div>
                `,
                close: function(){
                    that.searchMessageList = []
                    that.timeRangeType = 'recent-mouth'
                    that.startTime = ''
                    that.endTime = ''
                    that.messageTypes = [
                        'chat', 'file', 'media'
                    ]

                    that.messageTypes.forEach(item => {
                        document.getElementById("search-channel-message-type-" + item).classList.add("layui-badge-active")
                    })

                    document.getElementById("search-channel-message-type-" + that.timeRangeType).classList.add("layui-badge-active")
                },
                yes: function (index) {
                    layer.close(index)
                },
                success: function(layero, index){
                    that.openSearchChannelMessageSuccess(layero, index, full)
                }
            })

            callback && callback()
        },
        /**
         * 打开搜索频道消息成功
         * @param {*} layero 
         * @param {*} index 
         */
        openSearchChannelMessageSuccess: function(layero, index, full){
            let that = this

            if(!full){
                layero.css({
                    'border-radius': '6px',
                })
            }

            let headerHeight = document.querySelector('.tl-rtc-app-right-channel-content-search-message-panel-header')
            const messageListHeight = full ? (
                document.documentElement.clientHeight - headerHeight.clientHeight - 100
            ): (
                550 - headerHeight.clientHeight
            )

            document.getElementById("search_channel_message_tlp_view").style.height = messageListHeight + 'px'

            this.messageTypes.forEach(item => {
                document.getElementById("search-channel-message-type-" + item).classList.add("layui-badge-active")
            })

            document.getElementById("search-channel-message-type-" + this.timeRangeType).classList.add("layui-badge-active")

            // 输入框输入事件
            // document.getElementById("search-channel-message-input").oninput = function(){
            //     window.tl_rtc_app_comm.debounce(that.searchChannelMessage, 500, false)
            // }

            // 图片
            document.getElementById("search-channel-message-type-chat").onclick = function(){
                // 如果存在则删除，不存在则添加
                if(!that.messageTypes.includes("chat")){
                    that.messageTypes.push("chat")
                    document.getElementById("search-channel-message-type-chat").classList.add("layui-badge-active")
                }else{
                    that.messageTypes.splice(that.messageTypes.indexOf("chat"), 1)
                    document.getElementById("search-channel-message-type-chat").classList.remove("layui-badge-active")
                }

                that.isLoadMore = false
                that.searchChannelMessage()
            }

            // 文件
            document.getElementById("search-channel-message-type-file").onclick = function(){
                if(!that.messageTypes.includes("file")){
                    that.messageTypes.push("file")
                    document.getElementById("search-channel-message-type-file").classList.add("layui-badge-active")
                }else{
                    that.messageTypes.splice(that.messageTypes.indexOf("file"), 1)
                    document.getElementById("search-channel-message-type-file").classList.remove("layui-badge-active")
                }

                that.isLoadMore = false
                that.searchChannelMessage()
            }

            // 通话
            document.getElementById("search-channel-message-type-media").onclick = function(){
                if(!that.messageTypes.includes("media")){
                    that.messageTypes.push("media")
                    document.getElementById("search-channel-message-type-media").classList.add("layui-badge-active")
                }else{
                    that.messageTypes.splice(that.messageTypes.indexOf("media"), 1)
                    document.getElementById("search-channel-message-type-media").classList.remove("layui-badge-active")
                }

                that.isLoadMore = false
                that.searchChannelMessage()
            }

            // 今天
            document.getElementById("search-channel-message-type-today").onclick = function(){
                that.timeRangeType = 'today'
                let { today } = window.tl_rtc_app_comm.getTimeRanges()
                that.startTime = today.startTime
                that.endTime = today.endTime

                document.getElementById("search-channel-message-type-today").classList.add("layui-badge-active")
                document.getElementById("search-channel-message-type-yesterday").classList.remove("layui-badge-active")
                document.getElementById("search-channel-message-type-last-week").classList.remove("layui-badge-active")
                document.getElementById("search-channel-message-type-recent-mouth").classList.remove("layui-badge-active")
                document.getElementById("search-channel-message-type-cus-day-range").classList.remove("layui-badge-active")

                that.isLoadMore = false
                that.searchChannelMessage()
            }

            // 前一天
            document.getElementById("search-channel-message-type-yesterday").onclick = function(){
                that.timeRangeType = 'yesterday'
                let { yesterday } = window.tl_rtc_app_comm.getTimeRanges()
                that.startTime = yesterday.startTime
                that.endTime = yesterday.endTime

                document.getElementById("search-channel-message-type-today").classList.remove("layui-badge-active")
                document.getElementById("search-channel-message-type-yesterday").classList.add("layui-badge-active")
                document.getElementById("search-channel-message-type-last-week").classList.remove("layui-badge-active")
                document.getElementById("search-channel-message-type-recent-mouth").classList.remove("layui-badge-active")
                document.getElementById("search-channel-message-type-cus-day-range").classList.remove("layui-badge-active")

                that.isLoadMore = false
                that.searchChannelMessage()
            }

            // 前一周
            document.getElementById("search-channel-message-type-last-week").onclick = function(){
                that.timeRangeType = 'last-week'
                let { lastWeek } = window.tl_rtc_app_comm.getTimeRanges()
                that.startTime = lastWeek.startTime
                that.endTime = lastWeek.endTime

                document.getElementById("search-channel-message-type-today").classList.remove("layui-badge-active")
                document.getElementById("search-channel-message-type-yesterday").classList.remove("layui-badge-active")
                document.getElementById("search-channel-message-type-last-week").classList.add("layui-badge-active")
                document.getElementById("search-channel-message-type-recent-mouth").classList.remove("layui-badge-active")
                document.getElementById("search-channel-message-type-cus-day-range").classList.remove("layui-badge-active")

                that.isLoadMore = false
                that.searchChannelMessage()
            }

            // 近一月
            document.getElementById("search-channel-message-type-recent-mouth").onclick = function(){
                that.timeRangeType = 'recent-mouth'
                let { lastMonth } = window.tl_rtc_app_comm.getTimeRanges()
                that.startTime = lastMonth.startTime
                that.endTime = lastMonth.endTime

                document.getElementById("search-channel-message-type-today").classList.remove("layui-badge-active")
                document.getElementById("search-channel-message-type-yesterday").classList.remove("layui-badge-active")
                document.getElementById("search-channel-message-type-last-week").classList.remove("layui-badge-active")
                document.getElementById("search-channel-message-type-recent-mouth").classList.add("layui-badge-active")
                document.getElementById("search-channel-message-type-cus-day-range").classList.remove("layui-badge-active")

                that.isLoadMore = false
                that.searchChannelMessage()
            }

            // 自定义
            document.getElementById("search-channel-message-type-cus-day-range").onclick = function(){
                that.timeRangeType = 'cus-day-range'
                let { cusDayRange } = window.tl_rtc_app_comm.getTimeRanges()
                that.startTime = cusDayRange.startTime
                that.endTime = cusDayRange.endTime

                document.getElementById("search-channel-message-type-today").classList.remove("layui-badge-active")
                document.getElementById("search-channel-message-type-yesterday").classList.remove("layui-badge-active")
                document.getElementById("search-channel-message-type-last-week").classList.remove("layui-badge-active")
                document.getElementById("search-channel-message-type-recent-mouth").classList.remove("layui-badge-active")
                document.getElementById("search-channel-message-type-cus-day-range").classList.add("layui-badge-active")

                that.isLoadMore = false
                that.searchChannelMessage()
            }

            document.getElementById("search-channel-message-load-more").onclick = function(){
                that.isLoadMore = true
                that.searchChannelMessage()
            }

            that.searchChannelMessage()
        },
        /**
         * 搜索消息列表模板渲染
         */
        searchMessageListTplRender: function(){
            let that = this

            const searchChannelMessageTlp = document.getElementById("search_channel_message_tlp")
            const searchChannelMessageTlpView = document.getElementById("search_channel_message_tlp_view")

            this.tplRender({
                tpl_html: searchChannelMessageTlp,
                tpl_view_html: searchChannelMessageTlpView,
                data: this.searchMessageList,
                callback: function(){
                    that.searchMessageList.forEach(item => {
                        let messageItem = document.getElementById("search-channel-message-" + item.type + "-" + item.id)
                        if(!messageItem){
                            return
                        }
                        messageItem.onclick = function(event){
                            that.userInfoPopup(event, item)
                        }
                    })

                    document.getElementById("search-channel-message-count").innerHTML = "共" + that.searchMessageList.length + '条记录'
                }
            })
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
    },
    mounted() {
        
    },
    created(){
        // 搜索频道消息
        window.subModule.$on('sub-module-channel-search-message', this.openSearchChannelMessage)
    }
}

window.tl_rtc_app_module_channel_content_search_message = tl_rtc_app_module_channel_content_search_message