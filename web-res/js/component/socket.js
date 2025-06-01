const tl_rtc_app_socket = new Vue({
    el: '#tl-rtc-app-socket',
    data : function(){
        return {
            socket: null,
            ON_EVENT: {
                OFFER: 'offer',           // rtc-offer
                ANSWER: 'answer',         // rtc-answer
                CANDIDATE: 'candidate',       // rtc-candidate
                CHANNEL_CHAT: 'channelChat',    // 频道聊天
                CHANNEL_VIDEO_CALL: 'channelVideoCall', // 频道视频通话
                CHANNEL_FILE: 'channelFile', // 文件发送
                CONTACT_APPLY: 'contactApply',  // 好友申请
                CONTACT_APPLY_PASS: 'contactApplyPass', // 通过好友申请
                CONTACT_APPLY_REJECT: 'contactApplyReject', // 拒绝好友申请
                GROUP_APPLY: 'groupApply',      // 群组申请
                GROUP_APPLY_PASS: 'groupApplyPass', // 通过群组申请
                GROUP_APPLY_REJECT: 'groupApplyReject', // 拒绝群组申请
                COUNT: 'count',                 // 在线人数
                COMM_DATA: 'comm_data',         // 配置信息
                EXIT: 'exit',                    // 退出
            },
            EMIT_EVENT: {
                OFFER: 'offer',           // rtc-offer
                ANSWER: 'answer',         // rtc-answer
                CANDIDATE: 'candidate',       // rtc-candidate
                CHANNEL_VIDEO_CALL: 'channelVideoCall', // 频道视频通话
                CHANNEL_CHAT: 'channelChat',         // 频道聊天
                CONTACT_APPLY: 'contactApply',       // 好友申请
                CONTACT_APPLY_PASS: 'contactApplyPass', // 通过好友申请
                CONTACT_APPLY_REJECT: 'contactApplyReject', // 拒绝好友申请
                GROUP_APPLY: 'groupApply',           // 群组申请
                GROUP_APPLY_PASS: 'groupApplyPass',   // 通过群组申请
                GROUP_APPLY_REJECT: 'groupApplyReject', // 拒绝群组申请
            }
        }
    },
    methods: {
        /**
         * 初始化socket对象
         * @param {*} socket 
         * @returns 
         */
        initSocket: function({
            socket, callback
        }){
            this.socket = socket

            this.listenSocket()

            callback && callback(true)
        },
        /**
         * 监听socket事件
         * @returns
         * */
        listenSocket: function(){
            // 监听事件
            this.socket.on(this.ON_EVENT.OFFER, this.offerSocketHandler)
            this.socket.on(this.ON_EVENT.ANSWER, this.answerSocketHandler)
            this.socket.on(this.ON_EVENT.CANDIDATE, this.candidateSocketHandler)
            this.socket.on(this.ON_EVENT.CHANNEL_CHAT, this.channelChatSocketHandler)
            this.socket.on(this.ON_EVENT.CHANNEL_FILE, this.channelFileSocketHandler)
            this.socket.on(this.ON_EVENT.COUNT, this.countSocketHandler)
            this.socket.on(this.ON_EVENT.CONTACT_APPLY, this.contactApplySocketHandler)
            this.socket.on(this.ON_EVENT.CONTACT_APPLY_PASS, this.contactApplyPassSocketHandler)
            this.socket.on(this.ON_EVENT.CONTACT_APPLY_REJECT, this.contactApplyRejectSocketHandler)
            this.socket.on(this.ON_EVENT.GROUP_APPLY, this.groupApplySocketHandler)
            this.socket.on(this.ON_EVENT.GROUP_APPLY_PASS, this.groupApplyPassSocketHandler)
            this.socket.on(this.ON_EVENT.GROUP_APPLY_REJECT, this.groupApplyRejectSocketHandler)
            this.socket.on(this.ON_EVENT.CHANNEL_VIDEO_CALL, this.channelVideoCallSocketHandler)
            this.socket.on(this.ON_EVENT.EXIT, this.exitSocketHandler)
        },
        /**
         * 发送socket消息
         * @param {*} event 
         * @param {*} data 
         * @returns 
         */
        sendSocket: function({
            event, data, callback
        }){
            if(!this.socket){
                console.error("socket is null")
                return
            }

            if (!event){
                console.error("event is null")
                return
            }

            if(!Object.values(this.EMIT_EVENT).includes(event)){
                console.error("event is not in EMIT_EVENT")
                return
            }

            this.socket.emit(event, data, callback)
        },
        /**
         * rtc-offer socket消息处理
         * @param {*} data 
         * @returns 
         */
        offerSocketHandler: function(data){
            // 处理rtc-offer消息
            this.emitSubModuleEvent({
                event: 'component-rtc-offer-socket',
                data: data
            })
        },
        /**
         * rtc-answer socket消息处理
         * @param {*} data 
         * @returns 
         */
        answerSocketHandler: function(data){
            // 处理rtc-answer消息
            this.emitSubModuleEvent({
                event: 'component-rtc-answer-socket',
                data: data
            })
        },
        /**
         * rtc-candidate socket消息处理
         * @param {*} data 
         * @returns 
         */
        candidateSocketHandler: function(data){
            // 处理rtc-candidate消息
            this.emitSubModuleEvent({
                event: 'component-rtc-candidate-socket',
                data: data
            })
        },
        /**
         * 聊天socket消息处理
         * @param {*} data 
         * @returns 
         */
        channelChatSocketHandler: function(data){
            // 通知channel模块
            this.emitSubModuleEvent({
                event: 'sub-module-channel-list-chat-socket',
                data: data
            })
        },
        /**
         * 视频通话socket消息处理
         * @param {*} data 
         * @returns 
         */
        channelVideoCallSocketHandler: function(data){
            // 通知video模块
            this.emitSubModuleEvent({
                event: 'component-video-call-socket',
                data: data
            })
        },
        /**
         * 文件socket消息处理
         * @param {*} data 
         * @returns 
         */
        channelFileSocketHandler: function(data){
            // 通知file模块
            this.emitSubModuleEvent({
                event: 'component-file-send-socket',
                data: data
            })
        },
        /**
         * 在线人数socket消息处理
         * @param {*} data 
         */
        countSocketHandler: function(data){
            console.log("count: ", data)
        },
        /**
         * 退出socket消息处理
         * @param {*} data 
         */
        exitSocketHandler: function(data){
            console.log("exit: ", data)

            this.emitSubModuleEvent({
                event: 'component-video-call-socket-exit',
                data: data
            })
        },
        /**
         * 好友申请消息处理
         * @param {*} data 
         */
        contactApplySocketHandler: function(data){
            // 通知好友模块
            this.emitSubModuleEvent({
                event: 'sub-module-contact-apply-socket',
                data: data
            })
        },
        /**
         * 通过好友申请消息处理
         * @param {*} data 
         */
        contactApplyPassSocketHandler: function(data){
            // 通知好友模块
            this.emitSubModuleEvent({
                event: 'sub-module-contact-apply-pass-socket',
                data: data
            })
        },
        /**
         * 拒绝好友申请消息处理
         * @param {*} data 
         */
        contactApplyRejectSocketHandler: function(data){
            // 通知好友模块
            this.emitSubModuleEvent({
                event: 'sub-module-contact-apply-reject-socket',
                data: data
            })
        },
        /**
         * 群组申请消息处理
         * @param {*} data 
         */
        groupApplySocketHandler: function(data){
            // 通知群组模块
            this.emitSubModuleEvent({
                event: 'sub-module-group-apply-socket',
                data: data
            })
        },
        /**
         * 通过群组申请消息处理
         * @param {*} data 
         */
        groupApplyPassSocketHandler: function(data){
            // 通知群组模块
            this.emitSubModuleEvent({
                event: 'sub-module-group-apply-pass-socket',
                data: data
            })
        },
        /**
         * 拒绝群组申请消息处理
         * @param {*} data 
         */
        groupApplyRejectSocketHandler: function(data){
            // 通知群组模块
            this.emitSubModuleEvent({
                event: 'sub-module-group-apply-reject-socket',
                data: data
            })
        }
    },
    mounted() {

    },
    created(){
        // 监听初始化socket
        window.subModule.$on("component-socket-init-socket", this.initSocket)

        // 发送socket消息
        window.subModule.$on("component-socket-send-socket", this.sendSocket)
    },
})

window.tl_rtc_app_socket = tl_rtc_app_socket;