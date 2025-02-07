const tl_rtc_app_socket = new Vue({
    el: '#tl-rtc-app-socket',
    data : function(){
        return {
            socket: null,
            CHANNEL_CHAT: 'channelChat',    // 频道聊天
            CHANNEL_CHAT_ROLLBACK: 'channelChatRollback', // 频道聊天消息撤回
            CONTACT_APPLY: 'contactApply',  // 好友申请
            CONTACT_APPLY_PASS: 'contactApplyPass', // 通过好友申请
            CONTACT_APPLY_REJECT: 'contactApplyReject', // 拒绝好友申请
            COUNT: 'count',                 // 在线人数
            EXIT: 'exit'                    // 退出
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

            // 监听事件
            this.socket.on(this.CHANNEL_CHAT, this.channelChatSocketHandler)
            this.socket.on(this.CHANNEL_CHAT_ROLLBACK, this.channelChatRollbackSocketHandler)
            this.socket.on(this.COUNT, this.countSocketHandler)
            this.socket.on(this.CONTACT_APPLY, this.contactApplySocketHandler)
            this.socket.on(this.CONTACT_APPLY_PASS, this.contactApplyPassSocketHandler)
            this.socket.on(this.CONTACT_APPLY_REJECT, this.contactApplyRejectSocketHandler)
            this.socket.on(this.EXIT, this.exitSocketHandler)

            callback && callback(true)
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
         * 频道聊天消息撤回socket消息处理
         * @param {*} data 
         */
        channelChatRollbackSocketHandler: function(data){
            // 通知channel模块
            this.emitSubModuleEvent({
                event: 'sub-module-channel-list-rollback-channel-message-socket',
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
            
            this.emitSubModuleEvent({
                event: 'component-screen-call-socket-exit',
                data: data
            })

            this.emitSubModuleEvent({
                event: 'component-live-call-socket-exit',
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
        }
    },
    mounted() {

    },
    created(){
        // 监听初始化socket
        window.subModule.$on("component-socket-init-socket", this.initSocket)
    },
})

window.tl_rtc_app_socket = tl_rtc_app_socket;