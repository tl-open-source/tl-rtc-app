const tl_rtc_app_video = new Vue({
    el: '#tl-rtc-app-video',
    data: function () {
        const screenIsLandscape = window.tl_rtc_app_comm.isLandscape()

        return {
            socket: null, // socket
            stream: null, // 本地音视频流
            times: 0, // 通话时长
            intervalId: 0, // 计时器
            isInviter: false, // 是否是邀请方
            channelId: '', // 频道id
            layerIndex: 0, // layer弹窗索引
            audioPlayer: null, // 音频播放器
            isMobile: tl_rtc_app_comm.isMobile(), // 是否是移动端

            videoCallStatus: "", // try-invite, invite, accept, reject, busy, hangup
            mkfOpen: true, // 麦克风状态
            ysqOpen: true, // 扬声器状态
            needAudio: true, // 是否需要音频
            needVideo: true, // 是否需要视频
            needvideoConstraints: { // 视频约束
                width: {
                    ideal: screenIsLandscape ? 4096 : 2160,
                },
                height: {
                    ideal: screenIsLandscape ? 2160 : 4096
                },
                frameRate: {
                    ideal: 40, max: 50
                },
                facingMode: 'user'
            },
            hanupCallback: null, // 挂断回调
            inviterSocketId: '', // 邀请方socketId

            // 邀请方数据
            inviterInviteList : [], // 邀请列表
            inviterRejectList: [], // 拒绝列表
            inviteBusyingList: [], // 忙线列表
            inviterAcceptList: [], // 邀请方收到的接听人的socketId

            // 被邀请方数据
            unInviterAcceptList: [], // 被邀请方收到的接受人的socketId
        }
    },
    computed: {
        videoCallStatusText: function () {
            let text = "";
            switch (this.videoCallStatus) {
                case 'try-invite': 
                    text = "准备邀请中...";
                    break;
                case "invite":
                    text = "等待接通中...";
                    break;
                case "accept":
                    text = "正在通话中...";
                    break;
                case "reject":
                    text = "对方已拒绝...";
                    break;
                case "busy":
                    text = "对方忙线中...";
                    break;
                default:
                    text = "未知状态";
                    break;
            }
            return text;
        }
    },
    watch: {
        mkfOpen: {
            handler: function (cur, pre) { }
        },
        ysqOpen: {
            handler: function (cur, pre) { }
        },
        videoCallStatus: {
            handler: function (cur, pre) {
                const videoCallStatusDom = document.querySelector("#tl-rtc-app-video-call-status")
                if (videoCallStatusDom) {
                    videoCallStatusDom.innerText = this.videoCallStatusText;
                }
            }
        }
    },
    methods: {
        /**
        * 初始化socket
        * @param {*} socket
        */
        initSocket: function ({
            socket, callback
        }) {
            this.socket = socket;

            callback && callback(true)
        },
        /**
        * 获取rtc连接
        * @param {*} rtcId
        * @returns
        */
        getRtcConnect: async function (rtcId) {
            let that = this
            const rtcConnect = await this.emitSubModuleEvent({
                event: 'component-rtc-get-or-create-connect',
                data: {
                    rtcId: rtcId
                }
            })

            // 媒体流通道
            rtcConnect.addEventListener('track', async (event) => {
                await that.handlerMediaTrack({
                    event, rtcId
                })
            })

            // 添加自定义回调处理函数
            let rtcConnectCallbacks = rtcConnect.callbacks || {};
            let removeStreamCallbacks = rtcConnectCallbacks['removestream'] || [];
            removeStreamCallbacks.push(function(){
                // 移除对应的video
                const video = document.querySelector(`#tl-rtc-app-video-other-media-item${rtcId}`);
                if(video){
                    video.remove()
                }

                // 如果是收到邀请方断开
                if(rtcId === that.inviterSocketId){
                    // 移除邀请弹窗
                    that.emitSubModuleEvent({
                        event: 'component-popup-close-invite-msg'
                    })

                    that.videoCallStatus = 'hangup'
                }
            })
            rtcConnectCallbacks['removestream'] = removeStreamCallbacks
            rtcConnect.callbacks = rtcConnectCallbacks

            return rtcConnect
        },
        /**
         * 远程rtc视频流关闭
         * @param {*} rtcConnect 
         * @param {*} rtcId 
         * @param {*} event 
         */
        closeVideoConnect: async function({rtcConnect, rtcId, event}){
            this.emitSubModuleEvent({
                event: 'component-rtc-remove-stream',
                data: {
                    rtcConnect, rtcId, event
                }
            })
        },
        /**
         * 获取音视频流
         * @returns 
         */
        getMediaPlay: function () {
            let media = null;
            let defaultConstraints = {
                audio: this.needAudio,
                video: this.needVideo ? this.needvideoConstraints : false,
            };
            if (window.navigator.mediaDevices && window.navigator.mediaDevices.getUserMedia) {
                media = window.navigator.mediaDevices.getUserMedia(defaultConstraints);
            } else if (window.navigator.mozGetUserMedia) {
                media = navigator.mozGetUserMedia(defaultConstraints);
            } else if (window.navigator.getUserMedia) {
                media = window.navigator.getUserMedia(defaultConstraints)
            } else if (window.navigator.webkitGetUserMedia) {
                media = new Promise((resolve, reject) => {
                    window.navigator.webkitGetUserMedia(defaultConstraints, (res) => {
                        resolve(res)
                    }, (err) => {
                        reject(err)
                    });
                })
            }
            return media
        },
        /**
         * 打开弹窗
         */
        openVideo: async function () {
            let that = this
            
            await new Promise(resolve => {
                that.layerIndex = layer.open({
                    type: 1,
                    closeBtn: 0,
                    fixed: false,
                    maxmin: false,
                    shadeClose: false,
                    shade: 0,
                    title: this.needVideo ? `
                        <div>
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#tl-rtc-app-icon-shexiangtou"></use>
                            </svg>
                            视频通话中...
                        </div>
                    ` : `
                        <div>
                            <svg class="icon" aria-hidden="true">
                                <use xlink:href="#tl-rtc-app-icon-31dianhua"></use>
                            </svg>
                            语音通话中...
                        </div>
                    `,
                    // title: false,
                    area: ['300px', '500px'],
                    move: '#tl-rtc-app-video-self-media-item',
                    success: function(layero, index){
                        layero.find(".layui-layer-content").css({
                            "overflow": "hidden",
                            "border-bottom-left-radius": "8px",
                            "border-bottom-right-radius": "8px"
                        })
                        layero[0].style.borderRadius = "8px"

                        // 挂断
                        document.querySelector("#mediaVideoCloseTool").onclick = function(){
                            that.emitSubModuleEvent({
                                event: 'component-video-hanup-video-call'
                            })
                        }
                        // 点击 打开麦克风 图标
                        document.querySelector("#mediaVideoMkfOpenTool").onclick = that.mkfOpenChange
                        // 点击 关闭麦克风 图标
                        document.querySelector("#tl-rtc-app-video-mkf-close-tool").onclick = that.mkfOpenChange
                        // 点击 打开扬声器 图标
                        document.querySelector("#mediaVideoYsqOpenTool").onclick = that.ysqOpenChange
                        // 点击 关闭扬声器 图标
                        document.querySelector("#tl-rtc-app-video-ysq-close-tool").onclick = that.ysqOpenChange

                        resolve()
                    },
                    content: `
                        <p id="tl-rtc-app-video-call-status">${that.videoCallStatusText}</p>
                        <div id="tl-rtc-app-video-call-avatar">
                            <img src="/image/default-avatar.png" />
                        </div>
                        <video id="tl-rtc-app-video-self-media-item"
                            ${this.needVideo ? (this.isMobile ? 'controls' : '') : ''}
                            preload="auto"
                            autoplay="autoplay"
                            x-webkit-airplay="true"
                            playsinline="true"
                            webkit-playsinline="true"
                            x5-video-player-type="h5"
                            x5-video-orientation="portraint"
                            x5-video-player-fullscreen="true">
                        </video>
                        <div id="tl-rtc-app-video-tool-list">
                            <svg id="tl-rtc-app-video-mkf-close-tool" aria-hidden="true" style="display:none">
                                <use xlink:href="#tl-rtc-app-icon-guanbimaikefeng"></use>
                            </svg>
                            <svg id="mediaVideoMkfOpenTool" aria-hidden="true">
                                <use xlink:href="#tl-rtc-app-icon-maikefeng-XDY"></use>
                            </svg>
                            <svg id="mediaVideoCloseTool" aria-hidden="true" style="fill: #ee8181;">
                                <use xlink:href="#tl-rtc-app-icon-guaduandianhua"></use>
                            </svg>
                            <svg id="tl-rtc-app-video-ysq-close-tool" aria-hidden="true" style="display:none">
                                <use xlink:href="#tl-rtc-app-icon-guanbiyangshengqi"></use>
                            </svg>
                            <svg id="mediaVideoYsqOpenTool" aria-hidden="true">
                                <use xlink:href="#tl-rtc-app-icon-laba"></use>
                            </svg>
                        </div>
                        <div id="tl-rtc-app-video-media-list"> </div>
                    `
                })
            })
        },
        /**
         * 获取音视频流
         * @returns 
         */
        tryAcquireVideoStream: async function () {
            let that = this;

            // 打开弹窗
            if (!this.layerIndex) {
                await this.openVideo()
            }

            if (this.stream == null) {
                try {
                    this.stream = await this.getMediaPlay();
                } catch (error) {
                    console.log(error)
                }
            }

            if (this.stream == null) {
                this.popErrorMsg("获取设备"+(this.needVideo ? '摄像头': '麦克风')+"权限失败")
                this.stopChannelVideoCall(true)
                return;
            }

            if(!this.intervalId){
                //计算时间
                this.intervalId = setInterval(() => {
                    that.times += 1;
                }, 1000);
            }

            const video = document.querySelector("#tl-rtc-app-video-self-media-item");
            video.addEventListener('loadedmetadata', function () {
                // ios 微信浏览器兼容问题
                setTimeout(() => {
                    video.play();
                    console.log("video play in loadedmetadata")
                }, 150);
                document.addEventListener('WeixinJSBridgeReady', function () {
                    setTimeout(() => {
                        video.play();
                        console.log("video play in WeixinJSBridgeReady")
                    }, 150);
                }, false);
            });
            document.addEventListener('WeixinJSBridgeReady', function () {
                setTimeout(() => {
                    video.play();
                    console.log("video play in WeixinJSBridgeReady1")
                }, 150);
            }, false);

            try{
                video.srcObject = this.stream;
                setTimeout(() => {
                    video.play();
                    console.log("video play in srcObject")
                }, 150);
            }catch(e){
                setTimeout(() => {
                    video.play();
                    console.log("video play in srcObject catch")
                }, 1000);
            }

            this.popSuccessMsg("开始通话")
        },
        /**
         * 开关麦克风
         */
        mkfOpenChange: function () {
            if (this.mkfOpen) {
                document.querySelector("#mediaVideoMkfOpenTool").style.display = "none"
                document.querySelector("#tl-rtc-app-video-mkf-close-tool").style.display = "block"
            } else {
                document.querySelector("#mediaVideoMkfOpenTool").style.display = "block"
                document.querySelector("#tl-rtc-app-video-mkf-close-tool").style.display = "none"
            }

            this.mkfOpen = !this.mkfOpen

            if (this.mkfOpen) {
                this.stream.getAudioTracks().forEach(track => track.enabled = true);
                this.popSuccessMsg("打开麦克风")
            } else {
                this.stream.getAudioTracks().forEach(track => track.enabled = false);
                this.popWarningMsg("关闭麦克风")
            }
        },
        /***
         * 开关扬声器
         * @param {*} rtcConns
         */
        ysqOpenChange: async function () {
            if (this.ysqOpen) {
                document.querySelector("#mediaVideoYsqOpenTool").style.display = "none"
                document.querySelector("#tl-rtc-app-video-ysq-close-tool").style.display = "block"
            } else {
                document.querySelector("#mediaVideoYsqOpenTool").style.display = "block"
                document.querySelector("#tl-rtc-app-video-ysq-close-tool").style.display = "none"
            }

            this.ysqOpen = !this.ysqOpen

            if (this.ysqOpen) {
                this.popSuccessMsg("打开扬声器")
            } else {
                this.popWarningMsg("关闭扬声器")
            }

            // 关闭远程音频, 关闭所有通话人的扬声器
            const rtcIds = Array.from(new Set(this.inviterAcceptList.concat(this.unInviterAcceptList)))
            for(let i = 0; i < rtcIds.length; i++){
                const rtcConnect = await this.getRtcConnect(rtcIds[i])
                if(rtcConnect){
                    const receivers = rtcConnect.getReceivers();
                    const senders = rtcConnect.getSenders();

                    // console.log("receivers : ", receivers, senders)

                    const receiver = receivers.find((receiver) => (receiver.track ? receiver.track.kind === 'audio' : false));
                    const sender = senders.find((sender) => (sender.track ? sender.track.kind === 'audio' : false));

                    // console.log("receiver : ", receiver, sender)
                    if (!sender) {
                        console.error("changeDevice find sender error! ");
                        return
                    }
                    sender.track.enabled = this.ysqOpen
                }
            }
        },
        /**
         * 远程媒体流处理
         * @param {*} event
         * @param {*} rtcId
         * @returns
         */
        handlerMediaTrack: async function ({ event, rtcId }) {
            let video = null;

            if (event.track.kind === 'audio') {
                return
            }

            video = document.querySelector(`#tl-rtc-app-video-other-media-item${rtcId}`);

            if(!video){
                $("#tl-rtc-app-video-media-list").append(`
                    <video id="tl-rtc-app-video-other-media-item${rtcId}"
                        class="tl-rtc-app-video-other-media-item"
                        ${this.needVideo ? 'controls' : ''}
                        preload="auto"
                        autoplay="autoplay"
                        x-webkit-airplay="true"
                        playsinline="true"
                        webkit-playsinline="true"
                        x5-video-player-type="h5"
                        x5-video-player-fullscreen="true"
                        x5-video-orientation="portraint">
                    </video>
                `);
            }

            video = document.querySelector(`#tl-rtc-app-video-other-media-item${rtcId}`);

            if (video) {
                video.addEventListener('loadedmetadata', function () {
                    setTimeout(() => {
                        video.play();
                        console.log("video play in loadedmetadata")
                    }, 150);
                    // ios 微信浏览器兼容问题
                    document.addEventListener('WeixinJSBridgeReady', function () {
                        setTimeout(() => {
                            video.play();
                            console.log("video play in WeixinJSBridgeReady")
                        }, 150);
                    }, false);
                });
                document.addEventListener('WeixinJSBridgeReady', function () {
                    setTimeout(() => {
                        video.play();
                        console.log("video play in WeixinJSBridgeReady1")
                    }, 150);
                }, false);

                try{
                    video.srcObject = event.streams[0]
                    setTimeout(() => {
                        video.play();
                        console.log("video play in srcObject")
                    }, 150);
                }catch(e){
                    setTimeout(() => {
                        video.play();
                        console.log("video play in srcObject catch")
                    }, 1000);
                }
            }
        },
        /**
         * 处理频道视频通话
         * @param {*} data 
         */
        handleChannelVideoCall: async function (data) {
            const { channel, videoCallInfo } = data
            
            if (!channel || !videoCallInfo) {
                data.callback && data.callback(false)
                return
            }

            this.channelId = channel

            // step1 发出尝试邀请后，收到一次服务端的汇总信息
            if(videoCallInfo.type === 'try-invite'){
                await this.receiveTryInviteChannelVideoCall(data)
                data.callback && data.callback()
                return
            }
            // step2.1 收到邀请消息
            if (videoCallInfo.type === 'invite') {
                await this.receiveInviteChannelVideoCall(data)
                data.callback && data.callback()
                return
            }
            // step2.2 收到静默邀请
            if(videoCallInfo.type === 'silence-invite'){
                await this.receiveSilenceInviteChannelVideoCall(data)
                data.callback && data.callback()
                return
            }
            // step3.1 对方接受邀请
            if (videoCallInfo.type === 'accept') {
                await this.receiveAcceptChannelVideoCall(data)
                data.callback && data.callback()
                return
            }
            // step3.2 对方静默接受邀请
            if(videoCallInfo.type === 'silence-accept'){
                await this.receiveSilenceAcceptChannelVideoCall(data)
                data.callback && data.callback()
                return
            }
            // step4 对方拒绝邀请
            if (videoCallInfo.type === 'reject') {
                await this.receiveRejectChannelVideoCall(data)
                data.callback && data.callback()
                return
            }
            // step5 对方正忙线
            if(videoCallInfo.type === 'busy'){
                await this.receiveBusyChannelVideoCall(data)
                data.callback && data.callback()
                return
            }
            // step6 双方确定接受邀请
            if(videoCallInfo.type === 'accepte-ack'){
                await this.receiveAccepteAckChannelVideoCall(data)
                data.callback && data.callback()
                return
            }
            // step7 对方挂断
            if(videoCallInfo.type === 'hangup'){
                await this.receiveHangupChannelScreenCall(data)
                data.callback && data.callback()
                return
            }

            data.callback && data.callback()
        },
        /**
         * 收到尝试邀请通知
         * @param {*} data 
         */
        receiveTryInviteChannelVideoCall: async function(data){
            const channelId = data.channel
            const videoCallInfo = data.videoCallInfo

            this.inviterInviteList = videoCallInfo.inviterInviteList || []

            // 播放音频
            this.playAudio()

            // 请求视频通话给对方
            this.emitSubModuleEvent({
                event: 'component-socket-send-socket',
                data: {
                    event: 'channelVideoCall',
                    data: {
                        channel: channelId,
                        videoCallInfo: {
                            from: this.socket.id,
                            fromName: videoCallInfo.fromName || "",
                            type: 'invite',
                            audio: this.needAudio,
                            video: this.needVideo,
                            videoConstraints: this.needvideoConstraints
                        }
                    }
                }
            });

            this.videoCallStatus = "try-invite"
        },
        /**
         * 收到邀请通知
         * @param {*} data 
         */
        receiveInviteChannelVideoCall: async function (data) {
            const channelId = data.channel
            const videoCallInfo = data.videoCallInfo

            // 播放音频
            this.playAudio()

            // 当前正忙线中
            if(this.isInVideoing({})){
                this.closeAudio()
                this.emitSubModuleEvent({
                    event: 'component-socket-send-socket',
                    data: {
                        event: 'channelVideoCall',
                        data: {
                            channel: channelId,
                            videoCallInfo: {
                                from: this.socket.id,
                                to: videoCallInfo.from,
                                type: 'busy',
                            }
                        }
                    }
                });
                return
            }

            this.videoCallStatus = 'invite'
            this.inviterSocketId = videoCallInfo.from

            this.needAudio = videoCallInfo.audio
            this.needVideo = videoCallInfo.video
            if(this.needVideo){
                this.needvideoConstraints = videoCallInfo.videoConstraints
            }

            let acceptOrReject = await this.emitSubModuleEvent({
                event: 'component-popup-add-invite-msg',
                data: {
                    imgSrc: "/image/default-avatar.png",
                    text: '收到' + videoCallInfo.fromName + '通话邀请',
                    acceptCallback: async function () {
                        return 'accept'
                    },
                    rejectCallback: async function () {
                        return 'reject'
                    }
                }
            })

            // 接受或者拒绝后关闭播音
            this.closeAudio()

            this.videoCallStatus = acceptOrReject

            if (acceptOrReject === 'accept') {
                // 获取视频流
                await this.tryAcquireVideoStream()

                // 创建/获取远程rtc连接
                const remoteRtcConnect = await this.getRtcConnect(videoCallInfo.from)

                // 视频流添加到远程连接
                if(this.stream){
                    this.stream.getTracks().forEach(track => {
                        remoteRtcConnect.addTrack(track, this.stream)
                    })
                }
                
                // 被邀请方接受邀请后，将邀请人添加到接受列表
                this.unInviterAcceptList.push(videoCallInfo.from)
            }

            // 回复视频通话给邀请方
            this.emitSubModuleEvent({
                event: 'component-socket-send-socket',
                data: {
                    event: 'channelVideoCall',
                    data: {
                        channel: channelId,
                        videoCallInfo: {
                            from: this.socket.id,
                            to: videoCallInfo.from,
                            type: acceptOrReject
                        }
                    }
                }
            });
        },
        /**
         * 收到接受邀请通知
         * @param {*} data 
         */
        receiveAcceptChannelVideoCall: async function (data) {
            const videoCallInfo = data.videoCallInfo

            // 关闭播音
            this.closeAudio()

            this.videoCallStatus = videoCallInfo.type

            // 获取视频流
            await this.tryAcquireVideoStream()

            // 创建/获取远程rtc连接
            const remoteRtcConnect = await this.getRtcConnect(videoCallInfo.from)

            // 视频流添加到连接
            if(this.stream){
                this.stream.getTracks().forEach(track => {
                    remoteRtcConnect.addTrack(track, this.stream)
                })
            }

            // 创建offer
            await this.emitSubModuleEvent({
                event: 'component-rtc-offer-create',
                data: {
                    rtcConnect: remoteRtcConnect,
                    rtcId: videoCallInfo.from
                }
            })

            if(this.isInviter){
                // 加入接收者列表
                this.inviterAcceptList.push(videoCallInfo.from)

                // 广播给当前接受者已接受者列表
                this.emitSubModuleEvent({
                    event: 'component-socket-send-socket',
                    data: {
                        event: 'channelVideoCall',
                        data: {
                            channel: data.channel,
                            videoCallInfo: {
                                from: this.socket.id,
                                to: videoCallInfo.from,
                                type: 'accepte-ack',
                                accepter: this.inviterAcceptList
                            }
                        }
                    }
                });
            }

            this.popSuccessMsg(videoCallInfo.from + "已接通")
        },
        /**
         * 收到acceptAck通知
         * @param {*} data 
         */
        receiveAccepteAckChannelVideoCall: async function(data){
            let that = this;
            const videoCallInfo = data.videoCallInfo
            const otherAccepter = videoCallInfo.accepter || []

            otherAccepter.forEach(item => {
                if(item === that.socket.id){
                    return
                }
                if(that.unInviterAcceptList.includes(item)){
                    return
                }

                // 存在新增接听者，由后者向前者发起 silence-invite, 前者收到后反馈 silence-accept
                that.emitSubModuleEvent({
                    event: 'component-socket-send-socket',
                    data: {
                        event: 'channelVideoCall',
                        data: {
                            channel: data.channel,
                            videoCallInfo: {
                                from: that.socket.id,
                                to: item,
                                type: 'silence-invite',
                            }
                        }
                    }
                });

                that.unInviterAcceptList.push(item)
            })
        },
        /**
         * 收到静默邀请通知
         * @param {*} data 
         */
        receiveSilenceInviteChannelVideoCall: async function (data) {
            const channelId = data.channel
            const videoCallInfo = data.videoCallInfo

            this.videoCallStatus = 'invite'

            // 创建/获取远程rtc连接
            const remoteRtcConnect = await this.getRtcConnect(videoCallInfo.from)

            // 视频流添加到连接
            if(this.stream){
                this.stream.getTracks().forEach(track => {
                    remoteRtcConnect.addTrack(track, this.stream)
                })
            }

            // 回复视频通话给邀请方
            this.emitSubModuleEvent({
                event: 'component-socket-send-socket',
                data: {
                    event: 'channelVideoCall',
                    data: {
                        channel: channelId,
                        videoCallInfo: {
                            from: this.socket.id,
                            to: videoCallInfo.from,
                            type: 'silence-accept'
                        }
                    }
                }
            });
        },
        /**
         * 收到接受静默邀请通知
         * @param {*} data 
         */
        receiveSilenceAcceptChannelVideoCall: async function (data) {
            const videoCallInfo = data.videoCallInfo

            // 创建/获取远程rtc连接
            const remoteRtcConnect = await this.getRtcConnect(videoCallInfo.from)

            // 视频流添加到连接
            if(this.stream){
                this.stream.getTracks().forEach(track => {
                    remoteRtcConnect.addTrack(track, this.stream)
                })
            }

            // 创建offer
            await this.emitSubModuleEvent({
                event: 'component-rtc-offer-create',
                data: {
                    rtcConnect: remoteRtcConnect,
                    rtcId: videoCallInfo.from
                }
            })
        },
        /**
         * 收到拒绝邀请通知
         * @param {*} data 
         */
        receiveRejectChannelVideoCall: async function (data) {
            const channelId = data.channel
            const videoCallInfo = data.videoCallInfo

            this.popWarningMsg(videoCallInfo.from + "已拒绝")

            this.inviterRejectList.push(videoCallInfo.from)

            // 关闭播音
            this.closeAudio()

            // 全部拒绝或者正忙，关闭邀请者通话弹窗
            if(this.inviterInviteList.length === this.inviterRejectList.length + this.inviteBusyingList.length){
                setTimeout(this.stopChannelVideoCall, 2100);
                this.videoCallStatus = ''
            }
        },
        /**
         * 收到忙线通知
         * @param {*} data 
         */
        receiveBusyChannelVideoCall: async function(data){
            const channelId = data.channel
            const videoCallInfo = data.videoCallInfo

            this.popWarningMsg(videoCallInfo.from + "忙线中")

            this.inviteBusyingList.push(videoCallInfo.from)

            // 关闭播音
            this.closeAudio()

            // 全部拒绝或者正忙，关闭通话
            if(this.inviterInviteList.length === this.inviterRejectList.length + this.inviteBusyingList.length){
                setTimeout(this.stopChannelVideoCall, 1000);
                this.videoCallStatus = ''
            }
        },
        /**
         * 收到挂断通知
         * @param {*} data 
         */
        receiveHangupChannelScreenCall: async function(data){
            const videoCallInfo = data.videoCallInfo

            // 创建/获取远程rtc连接
            const remoteRtcConnect = await this.getRtcConnect(videoCallInfo.from)

            this.closeVideoConnect({
                rtcConnect: remoteRtcConnect, rtcId: videoCallInfo.from, event: null
            })

            if(this.isInviter){
                // 移除已接听的用户
                const index = this.inviterAcceptList.indexOf(videoCallInfo.from)
                if(index > -1){
                    this.inviterAcceptList.splice(index, 1)
                }
            }else{
                // 移除已接听的用户
                const index = this.unInviterAcceptList.indexOf(videoCallInfo.from)
                if(index > -1){
                    this.unInviterAcceptList.splice(index, 1)
                }
            }
        },
        /**
         * 发起视频通话 - 对外API
         */
        startChannelVideoCall: async function ({ 
            channelId, 
            video, 
            audio, 
            videoConstraints = {}, 
            fromName, 
            callback, 
            hanupCallback
        }) {
            let that = this

            // 设置音视频通话参数
            this.needVideo = video
            this.needAudio = audio
            if (video) {
                this.needvideoConstraints = videoConstraints
            }

            if(this.isInVideoing({})){
                this.popWarningMsg("当前正在通话中")
                callback && callback(false)
                return
            }

            // 获取视频流
            await this.tryAcquireVideoStream()

            if(!this.stream){
                callback && callback(false)
                return
            }

            // 收集待通话用户列表
            this.emitSubModuleEvent({
                event: 'component-socket-send-socket',
                data: {
                    event: 'channelVideoCall',
                    data: {
                        channel: channelId,
                        videoCallInfo: {
                            from: this.socket.id,
                            fromName: fromName || "",
                            to: this.socket.id,
                            type: 'try-invite',
                        }
                    }
                }
            });

            this.isInviter = true
            this.channelId = channelId
            this.videoCallStatus = "try-invite"
            this.hanupCallback = hanupCallback

            callback && callback(true)
        },
        /**
         * 停止音视频流
         * @returns 
         */
        stopChannelVideoCall: function (isCancel) {
            if (this.stream) {
                this.stream.getTracks().forEach(track => track.stop());
            }

            clearInterval(this.intervalId);

            if (!isCancel) {
                this.popSuccessMsg("通话结束，本次通话时长 " + this.times + "秒")
            }

            if (this.layerIndex) {
                layer.close(this.layerIndex);
                
            }

            this.closeAudio()

            this.stream = null
            this.times = 0
            this.isInviter = false
            this.intervalId = 0
            this.channelId = ''
            this.videoCallStatus = ""
            this.mkfOpen = true
            this.ysqOpen = true
            this.needAudio = true
            this.needVideo = true
            this.layerIndex = 0
            this.audioPlayer = null
            this.inviterInviteList = []
            this.inviterRejectList = []
            this.inviteBusyingList = []
            this.inviterAcceptList = []
            this.unInviterAcceptList = []
            this.hanupCallback = null
            this.inviterSocketId = ''
        },
        /**
         * 播放音频
         */
        playAudio: function () {
            if(!this.audioPlayer){
                try{
                    // this.audioPlayer = new Audio('/image/default-call-audio.mp3');
                    // this.audioPlayer.play();
                }catch(e){
                    console.log("audio play error! ", e)
                }
            }
        },
        /**
         * 关闭音频
         */
        closeAudio: function () {
            if(this.audioPlayer){
                this.audioPlayer.pause();
                this.audioPlayer = null
            }
        },
        /**
         * 是否在通话中
         * @returns 
         */
        isInVideoing: function({
            callback
        }){
            const result = !!this.stream || [
                'try-invite', 'invite', 'accept', 'busy'
            ].includes(this.videoCallStatus)

            callback && callback(result);
            return result
        },
        /**
         * 挂断通话
         */
        hanupChannelVideoCall: async function({
            callback
        }){
            // 挂断通知
            this.emitSubModuleEvent({
                event: 'component-socket-send-socket',
                data: {
                    event: 'channelVideoCall',
                    data: {
                        channel: this.channelId,
                        videoCallInfo: {
                            from: this.socket.id,
                            type: 'hangup'
                        }
                    }
                }
            });

            if (this.hanupCallback) {
                this.hanupCallback({
                    time: this.times
                })
            }

            if(this.isInviter){
                // 清理已接听的用户连接
                // console.log("this.inviterAcceptList", this.inviterAcceptList)
                for (let i = 0; i < this.inviterAcceptList.length; i++) {
                    // 创建/获取远程rtc连接
                    const remoteRtcConnect = await this.getRtcConnect(this.inviterAcceptList[i])
                    // 调用关闭
                    this.closeVideoConnect({
                        rtcConnect: remoteRtcConnect, rtcId: this.inviterAcceptList[i], event: null
                    })
                }
            }else{
                // 清理已接听的用户连接
                for (let i = 0; i < this.unInviterAcceptList.length; i++) {
                    // 创建/获取远程rtc连接
                    const remoteRtcConnect = await this.getRtcConnect(this.unInviterAcceptList[i])
                    // 调用关闭
                    this.closeVideoConnect({
                        rtcConnect: remoteRtcConnect, rtcId: this.unInviterAcceptList[i], event: null
                    })
                }
            }

            this.stopChannelVideoCall()

            callback && callback()
        },
        /**
         * 收到退出通知事件
         */
        handleExit: async function(data){
            // 不在媒体流通话中, 不处理
            if(!this.isInVideoing({})){
                data.callback && data.callback()
                return
            }

            // 创建/获取远程rtc连接
            const remoteRtcConnect = await this.getRtcConnect(data.from)
            // 调用关闭
            this.closeVideoConnect({
                rtcConnect: remoteRtcConnect, rtcId: data.from, event: null
            })

            data.callback && data.callback()
        }
    },
    mounted: async function () {
        let that = this
        window.addEventListener('resize', function(){
            that.isMobile = tl_rtc_app_comm.isMobile()
        }, true)
    },
    created(){
        // 监听初始化socket
        window.subModule.$on("component-video-init-socket", this.initSocket)

        // 唤起视频通话
        window.subModule.$on("component-video-start-video", this.startChannelVideoCall);

        // 是否正在通话中
        window.subModule.$on("component-video-is-in-videoing", this.isInVideoing);

        // socket事件
        window.subModule.$on("component-video-call-socket", this.handleChannelVideoCall);

        // socket退出事件
        window.subModule.$on("component-video-call-socket-exit", this.handleExit);

        // 挂断通话
        window.subModule.$on("component-video-hanup-video-call", this.hanupChannelVideoCall);
    }
})

window.tl_rtc_app_video = tl_rtc_app_video;