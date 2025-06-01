const tl_rtc_app_rtc = new Vue({
    el: '#tl-rtc-app-rtc',
    data : function(){
        return {
            socket: null,
            rtcConfig: [], // rtc配置
            rtcConnsMap: {}, // rtc连接
            offerOptions: {
                offerToReceiveAudio: 1,
                offerToReceiveVideo: 1
            },
        }
    },
    methods: {
        /**
         * 初始化socket对象
         * @param {*} socket 
         * @param {*} rtcConfig
         */
        initSocket: function({
            socket, rtcConfig, callback
        }){
            this.socket = socket;
            this.rtcConfig = rtcConfig;
            
            callback && callback(true)
        },
        /**
         * 创立链接
         * @param {*} rtcId 
         * @returns 
         */
        createRtcConnect: function (rtcId) {
            if (rtcId === undefined) {
                return;
            }

            let that = this;
            let rtcConnect = new RTCPeerConnection(this.rtcConfig);

            //ice收集
            rtcConnect.addEventListener('icecandidate', (event) => {
                that.iceCandidate({
                    rtcConnect, rtcId, event
                })
            });

            // ice状态变更
            rtcConnect.addEventListener('iceconnectionstatechange', (event) => {
                that.iceStateChange({
                    rtcConnect, rtcId, event
                })
            })

            //文件发送数据通道
            let sendFileDataChannel = rtcConnect.createDataChannel('sendFileDataChannel');
            sendFileDataChannel.binaryType = 'arraybuffer';

            sendFileDataChannel.addEventListener('open', (event) => {
                that.sendFileDataChannelOpenCallback({
                    sendFileDataChannel, rtcConnect, rtcId, event
                })
            });
            sendFileDataChannel.addEventListener('close', (event) => {
                that.sendFileDataChannelCloseCallback({
                    sendFileDataChannel, rtcConnect, rtcId, event
                })
            });
            sendFileDataChannel.addEventListener('error', (error) => {
                console.error(error.error)
                that.removeStream({
                    rtcConnect, rtcId, 
                    event: null
                })
            });

            //自定义数据发送通道
            let sendCustomDataChannel = rtcConnect.createDataChannel('sendCustomDataChannel');
            sendCustomDataChannel.binaryType = 'arraybuffer';
            sendCustomDataChannel.addEventListener('open', (event) => {
                that.customDataChannelOpenCallback({
                    sendCustomDataChannel, rtcConnect, rtcId, event
                })
            });
            sendCustomDataChannel.addEventListener('close', (event) => {
                that.customDataChannelCloseCallback({
                    sendCustomDataChannel, rtcConnect, rtcId, event
                })
            });
            sendCustomDataChannel.addEventListener('error', (error) => {
                console.error(error.error)
                that.removeStream({
                    rtcConnect, rtcId, 
                    event: null
                })
            });

            // 数据传输通道处理逻辑
            rtcConnect.addEventListener('datachannel', (event) => {
                that.receiveDataChannelCallback({
                    rtcConnect, rtcId, event
                });
            });

            // rtc连接关闭
            rtcConnect.addEventListener('removestream', (event) => {
                that.removeStream({
                    rtcConnect, rtcId, event
                })
            });

            rtcConnect.sendCustomDataChannel = sendCustomDataChannel;
            rtcConnect.sendFileDataChannel = sendFileDataChannel;

            //保存peer连接
            this.rtcConnsMap[rtcId] = rtcConnect;

            return rtcConnect;
        },
        /**
         * 接收数据通道
         * @param {*} rtcConnect
         * @param {*} rtcId
         * @param {*} event 
         */
        receiveDataChannelCallback: function ({
            rtcConnect, rtcId, event
        }) {            
            // 执行外部注册的回调
            let rtcConnectCallbacks = rtcConnect.callbacks || {};
            let receiveDataChannelCallbacks = rtcConnectCallbacks['receiveDataChannel'] || [];
            if(receiveDataChannelCallbacks instanceof Array){
                receiveDataChannelCallbacks.forEach(callback => {
                    callback && callback({
                        rtcConnect, rtcId, event
                    })
                })
            }
        },
        /**
         * 自定义数据通道建立连接
         * @param {*} sendCustomDataChannel
         * @param {*} rtcConnect
         * @param {*} rtcId
         * @param {*} event 
         */
        customDataChannelOpenCallback: function ({
            sendCustomDataChannel, rtcConnect, rtcId, event
        }) {
            // 执行外部注册的回调
            let rtcConnectCallbacks = rtcConnect.callbacks || {};
            let customDataChannelOpenCallbacks = rtcConnectCallbacks['customDataChannelOpen'] || [];
            if(customDataChannelOpenCallbacks instanceof Array){
                customDataChannelOpenCallbacks.forEach(callback => {
                    callback && callback({
                        sendCustomDataChannel, rtcConnect, rtcId, event
                    })
                })
            }
        },
        /**
         * 自定义数据通道关闭连接
         * @param {*} sendCustomDataChannel
         * @param {*} rtcConnect
         * @param {*} rtcId
         * @param {*} event
         */
        customDataChannelCloseCallback: function ({
            sendCustomDataChannel, rtcConnect, rtcId, event
        }) {
            // 执行外部注册的回调
            let rtcConnectCallbacks = rtcConnect.callbacks || {};
            let customDataChannelCloseCallbacks = rtcConnectCallbacks['customDataChannelClose'] || [];
            if(customDataChannelCloseCallbacks instanceof Array){
                customDataChannelCloseCallbacks.forEach(callback => {
                    callback && callback({
                        sendCustomDataChannel, rtcConnect, rtcId, event
                    })
                })
            }
        },
        /**
         * 文件发送数据通道建立连接
         * @param {*} sendFileDataChannel
         * @param {*} rtcConnect
         * @param {*} rtcId
         * @param {*} event
         */
        sendFileDataChannelOpenCallback: function ({
            sendFileDataChannel, rtcConnect, rtcId, event
        }) {
            // 执行外部注册的回调
            let rtcConnectCallbacks = rtcConnect.callbacks || {};
            let sendFileDataChannelOpenCallbacks = rtcConnectCallbacks['sendFileDataChannelOpen'] || [];
            if(sendFileDataChannelOpenCallbacks instanceof Array){
                sendFileDataChannelOpenCallbacks.forEach(callback => {
                    callback && callback({
                        sendFileDataChannel, rtcConnect, rtcId, event
                    })
                })
            }
        },
        /**
         * 文件发送数据通道关闭连接
         * @param {*} sendFileDataChannel
         * @param {*} rtcConnect
         * @param {*} rtcId
         * @param {*} event
         */
        sendFileDataChannelCloseCallback: function ({
            sendFileDataChannel, rtcConnect, rtcId, event
        }) {
            // 执行外部注册的回调
            let rtcConnectCallbacks = rtcConnect.callbacks || {};
            let sendFileDataChannelCloseCallbacks = rtcConnectCallbacks['sendFileDataChannelClose'] || [];
            if(sendFileDataChannelCloseCallbacks instanceof Array){
                sendFileDataChannelCloseCallbacks.forEach(callback => {
                    callback && callback({
                        sendFileDataChannel, rtcConnect, rtcId, event
                    })
                })
            }
        },
        /**
         * ice状态变更
         * @param {*} rtcConnect
         * @param {*} rtcId
         * @param {*} event
         */
        iceStateChange: function ({
            rtcConnect, rtcId, event
        }) {
            // console.log("iceConnectionState: " + rtcConnect.iceConnectionState)

            // 执行外部注册的回调
            let rtcConnectCallbacks = rtcConnect.callbacks || {};
            let iceStateChangeCallbacks = rtcConnectCallbacks['iceStateChange'] || [];
            if(iceStateChangeCallbacks instanceof Array){
                iceStateChangeCallbacks.forEach(callback => {
                    callback && callback({
                        rtcConnect, rtcId, event
                    })
                })
            }
        },
        /**
         * 获取本地与远程连接
         * @param {*} rtcId 
         * @returns 
         */
        getOrCreateRtcConnect: function (rtcId) {
            let rtcConnect = this.rtcConnsMap[rtcId];
            if (typeof (rtcConnect) == 'undefined') {
                rtcConnect = this.createRtcConnect(rtcId);
            }
            return rtcConnect;
        },
        /**
         * 移除rtc连接
         * @param {*} rtcConnect 
         * @param {*} rtcId 
         * @param {*} event 
         */
        removeStream: function ({
            rtcConnect, rtcId, event, callback
        }) {
            rtcConnect.close;
            delete this.rtcConnsMap[rtcId];

            // 执行外部注册的回调
            let rtcConnectCallbacks = rtcConnect.callbacks || {};
            let removeStreamCallbacks = rtcConnectCallbacks['removestream'] || [];
            if(removeStreamCallbacks instanceof Array){
                removeStreamCallbacks.forEach(eachCallback => {
                    eachCallback && eachCallback({
                        rtcConnect, rtcId, event
                    })
                })
            }

            callback && callback()
        },
        /**
         * 创建offer
         * @param {*} rtcConnect 
         * @param {*} rtcId 
         */
        createOffer: async function({ rtcConnect, rtcId }){
            let that = this
            // 收集offer信息
            await new Promise((resolve, reject) => {
                rtcConnect.createOffer(this.offerOptions).then(offer => {
                    // 设置描述信息到本地
                    rtcConnect.setLocalDescription(offer).then(event => { })
                    // 发送offer信息给对方
                    that.emitSubModuleEvent({
                        event: 'component-socket-send-socket',
                        data: {
                            event: 'offer',
                            data: {
                                from: that.socket.id,
                                to: rtcId,
                                sdp: offer.sdp
                            }
                        }
                    })
                    resolve()
                }, error => {
                    console.error("offerFailed : ", error)
                    reject()
                });
            })
        },
        /**
         * 处理webrtc offer流程
         * @param {*} data 
         */
        handlerOffer: async function(data){
            // 创建/获取rtc连接
            const rtcConnect = this.getOrCreateRtcConnect(data.from)

            // 收集到远端描述信息，设置到本地
            await new Promise((resolve, reject) => {
                rtcConnect.setRemoteDescription(new RTCSessionDescription({ 
                    type: 'offer', sdp: data.sdp 
                })).then(event => { });
                resolve()
            })

            // 创建answer
            await this.createAnswer({ rtcConnect, rtcId: data.from })
        },
        /**
         * 创建answer
         * @param {*} rtcConnect 
         * @param {*} rtcId 
         */
        createAnswer: async function({ rtcConnect, rtcId }){
            let that = this;

            // 收集offer，响应给对方
            await new Promise((resolve, reject) => {
                rtcConnect.createAnswer(this.offerOptions).then((offer) => {
                    // 设置本地描述信息
                    rtcConnect.setLocalDescription(offer).then(event => { });
                    // 发送answer给对方
                    that.emitSubModuleEvent({
                        event: 'component-socket-send-socket',
                        data: {
                            event: 'answer',
                            data: {
                                from: that.socket.id,
                                to: rtcId,
                                sdp: offer.sdp
                            }
                        }
                    })
                    resolve()
                }).catch((error) => {
                    console.error("answerFailed : ", error)
                    reject()
                });
            })
        },
        /**
         * 处理webrtc answer流程
         * @param {*} data 
         */
        handlerAnswer: async function(data){
            // 创建/获取rtc连接
            const rtcConnect = this.getOrCreateRtcConnect(data.from)

            // 收集到远端描述信息，设置到本地
            rtcConnect.setRemoteDescription(new RTCSessionDescription({ 
                type: 'answer', sdp: data.sdp 
            })).then(event => { })
        },
        /**
         * iceCandidate 收集
         * @param {*} rtcConnect 
         * @param {*} rtcId 
         * @param {*} event 
         * @param {*} channelId
         * @returns
         */
        iceCandidate: function ({ rtcConnect, rtcId, event }) {
            if (event.candidate != null) {
                this.emitSubModuleEvent({
                    event: 'component-socket-send-socket',
                    data: {
                        event: 'candidate',
                        data: {
                            from: this.socket.id,
                            to: rtcId,
                            sdpMid: event.candidate.sdpMid,
                            sdpMLineIndex: event.candidate.sdpMLineIndex,
                            sdp: event.candidate.candidate
                        }
                    }
                })
            }
        },
        /**
         * 处理iceCandidate
         * @param {*} data 
         */
        handelIceCandidate: function(data){
            let that = this;

            // 创建/获取rtc连接
            const rtcConnect = this.getOrCreateRtcConnect(data.from)

            // 收集到协商iceCandidate
            rtcConnect.addIceCandidate(new RTCIceCandidate({
                candidate: data.sdp,
                sdpMid: data.sdpMid,
                sdpMLineIndex: data.sdpMLineIndex
            })).then(event => {
                // console.log("ice success : ", event)
            }).catch(error => {
                // console.log("ice failed : ", error)
            });
        },
        /**
         * 获取所有连接
         * @param {*} callback
         * @returns 
         */
        getAllConnect: function({
            callback
        }){
            callback && callback(this.rtcConnsMap)
        },
        /**
         * 监听获取或创建连接
         * @param {*} rtcId
         * @param {*} callback
         */
        getOrCreateConnect: function({
            rtcId, callback
        }){
            callback && callback(this.getOrCreateRtcConnect(rtcId))
        },
        /**
         * 创建offer并回调
         * @param {*} rtcConnect
         * @param {*} rtcId
         * @param {*} callback
         */
        createOfferAndCallback: async function({
            rtcConnect, rtcId, callback
        }){
            await this.createOffer({ rtcConnect, rtcId })
            callback && callback()
        }
    },
    mounted() {
        let that = this;

    },
    created(){
        // 监听初始化socket
        window.subModule.$on("component-rtc-init-socket", this.initSocket)
        
        // 监听获取或创建连接
        window.subModule.$on("component-rtc-get-or-create-connect", this.getOrCreateConnect)

        // 创建offer
        window.subModule.$on("component-rtc-offer-create", this.createOfferAndCallback)

        // 关闭连接
        window.subModule.$on("component-rtc-remove-stream", this.removeStream)

        // 获取所有连接
        window.subModule.$on("component-rtc-get-all-connect", this.getAllConnect)

        // 监听socket-offer
        window.subModule.$on("component-rtc-offer-socket", this.handlerOffer)

        // 监听socket-answer
        window.subModule.$on("component-rtc-answer-socket", this.handlerAnswer)

        // 监听socket-candidate
        window.subModule.$on("component-rtc-candidate-socket", this.handelIceCandidate)
    }
})

window.tl_rtc_app_rtc = tl_rtc_app_rtc;