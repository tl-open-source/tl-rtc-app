const tl_rtc_app_popup = new Vue({
    el: '#tl-rtc-app-popup',
    data : function(){
        let that = this
        return {
            popUpList: [], // 弹窗队列
            inviteLayerIndex: -1, // 邀请弹窗index
            isMobile: tl_rtc_app_comm.isMobile(),
            quickOperList: [{
                id: 'quickCreateChannel',
                icon: 'tl-rtc-app-icon-chuangjianqunliao',
                text: '快速创建群聊',
                handler: function(){
                    that.emitSubModuleEvent({
                        event: 'sub-module-channel-top-quick-create-channel',
                        data: {
                            channelName: '快速创建频道'
                        }
                    })
                }
            },{
                id: 'createCustomChannel',
                icon: 'tl-rtc-app-icon-xiaoxi',
                text: '创建群聊',
                handler: function(){
                    that.emitSubModuleEvent({
                        event: 'sub-module-channel-top-create-custom-channel',
                    })
                }
            },{
                id: 'searchAddUser',
                icon: 'tl-rtc-app-icon-_detail_chest',
                text: '搜索添加好友',
                handler: function(){
                    that.emitSubModuleEvent({
                        event: 'sub-module-contact-top-search-user',
                    })
                }
            },{
                id: 'openStandaloneWindow',
                icon: 'tl-rtc-app-icon-daochu',
                text: '独立窗口打开',
                handler: async function(){
                    const top = (screen.availHeight - 500) / 2;
                    const left = (screen.availWidth - 700) / 2;

                    const {leftModule, rightModule} = await that.emitSubModuleEvent({
                        event: 'sub-module-core-get-module',
                    })
                    
                    window.open(`/index.html#mode=standalone&lm=${leftModule}&rm=${rightModule}`, '_blank', 'resizable=no,location=no,width=500,height=700,top=' + top + ',left=' + left);
                }
            }]
        }
    },
    methods: {
        /**
         * 添加弹窗
         * @param {*} title
         * @param {*} message
         */
        addPopUpMsg : function({
            title, message, callback
        }) {
            this.popUpList.push({
                title, message
            });

            callback && callback();
        },
        /**
         * 处理弹窗信息
         * @returns 
         */
        startPopUpMsg : async function() {
            let that = this;
            let data = this.popUpList.shift();
            let lengthLevel = {//渐进式弹悬浮时间
                2 : 1000, // 队列只有两个弹窗排队时, 弹窗悬停时间1800ms
                5 : 900,
                8 : 600,
                10 : 300,
                20 : 100
            };
            //轮训是否有弹窗排队中
            if(!data){
                await new Promise(resolve=>{
                    setTimeout(async ()=>{
                        await this.startPopUpMsg()
                        resolve()
                    }, 100);
                })
                return
            }
        
            //如果开启了系统弹窗 && 当前页面没有焦点
            if(this.webMsgNotify && !document.hasFocus()){
                //修改标签页title
                let title = document.title;
                let msg = data.title + " " + data.message;
                let time = 0;
                let timer = null;
                timer = setInterval(() => {
                    time++;
                    if(time % 2 === 0){
                        document.title = msg;
                    }else{
                        document.title = title;
                    }
                    if(time > 10){
                        clearInterval(timer);
                        document.title = title;
                    }
                }, 500);
        
                //浏览器系统桌面消息通知
                if(window.Notification && Notification.permission === 'granted'){
                    new Notification("tl-rtc-app通知" + data.title, {
                        body: data.message,
                        dir: 'auto',
                        icon: '/image/default-avatar.png'
                    })
                }
            }
        
            let levelTime = 1800;
            for(let len in lengthLevel){
                if(len > this.popUpList.length){
                    levelTime = lengthLevel[len]
                    break;
                }
            }
        
            let msgDom = document.createElement('div');
            msgDom.setAttribute("class","tl-rtc-app-notification")
            msgDom.style.opacity = 0;
            msgDom.innerHTML = 
                '<div class="tl-rtc-app-notification-close"><i class="layui-icon layui-icon-close "></i></div>' +
                '<div class="tl-rtc-app-notification-icon"><i class="layui-icon layui-icon-chat"></i></div>' +
                '<div class="tl-rtc-app-notification-content">' +
                    '<div class="tl-rtc-app-notification-title">' +
                        data.title +
                        '<small style="position: absolute;right: 20px;">' +
                        this.popUpList.length > 0 ? '(' + this.popUpList.length + ')' : '' + 
                        '</small>' +
                    '</div>' +
                    '<div class="tl-rtc-app-notification-content-msg"> '+ data.message +' </div>' +
                '</div>' 
            ;
            let msgDomContainer = document.getElementById('notificationContainer');
            msgDomContainer.style.right = "-320px";
            msgDomContainer.prepend(msgDom);
        
            setTimeout(() => {
                msgDomContainer.style.right = "10px";
                msgDom.style.opacity = 1;
                setTimeout(() => {
                    msgDomContainer.style.right = "-320px";
                    msgDom.style.opacity = 0;
                    setTimeout(() => {
                        msgDomContainer.removeChild(msgDom);
                        that.startPopUpMsg();
                    }, 450);
                }, levelTime);
            }, 0);
        },
        /**
         * 添加提示, layer改造
         * @param {*} type 
         * @param {*} time 
         * @param {*} message 
         * @returns 
         */
        addToastMsg : function({
            type, time = 1000, message, callback
        }) {
            if(!layer){
                return this.addPopUpMsg({
                    title: '',
                    message,
                    callback
                })
            }
            const icons = {
                success : 
                    '<svg class="icon tl-toast-msg-success" aria-hidden="true">' +
                        '<use xlink:href="#tl-rtc-app-icon-70chenggong"></use>' +
                    '</svg>'
                ,
                warning :
                    '<svg class="icon tl-toast-msg-warning" aria-hidden="true">' +
                        '<use xlink:href="#tl-rtc-app-icon-jinggao"></use>' +
                    '</svg>'
                ,
                error : 
                    '<svg class="icon tl-toast-msg-error" aria-hidden="true">' + 
                        '<use xlink:href="#tl-rtc-app-icon-71shibai"></use>' +
                    '</svg>'
                
            }
            let icon = icons.success
            if(type){
                icon = icons[type]
            }

            layer.msg(icon + '<div>'+ message +'</div>',{
                offset: '10px', anim: 0, time: time, skin: 'tl-rtc-app-layer-msg'
            });

            callback && callback();
        },
        /**
         * 添加快捷操作面板
         */
        addQuickOperPanel: function({
            callback
        }){
            let that = this
            
            let gridCount = 4
            let operListDom = ''
            this.quickOperList.forEach((item) => {
                operListDom += `
                    <div class="tl-rtc-app-quick-oper-panel-list-item" id="${item.id}">
                        <svg class="icon" aria hidden="true">
                            <use xlink:href="#${item.icon}"></use>
                        </svg>
                        <div>${item.text}</div>
                    </div>
                `
            })

            layer.open({
                type: 1,
                title: '快捷操作中心',
                closeBtn: 1,
                skin: 'tl-rtc-app-layer-quick-oper-panel',
                content: `
                    <div style="overflow-y: auto;">
                        <div class="tl-rtc-app-quick-oper-panel">
                            <div class="tl-rtc-app-quick-oper-panel-list">
                                ${operListDom}
                            </div>
                        </div>
                    </div>
                `,
                area: this.isMobile ? [Math.min(document.clientWidth, 350)+'px', '320px'] : ['400px', '320px'],
                offset: this.isMobile ? 'auto' : '200px',
                shadeClose: true,
                resize: false,
                yes: function (index) {
                    layer.close(index)
                },
                success: function (layero, index) {
                    layero.css({
                        "border-radius": "6px",
                    })
                    
                    that.quickOperList.forEach(item => {
                        document.querySelector("#" + item.id).addEventListener('click', function(){
                            item.handler()
                            layer.close(index)
                        })
                    })
                }
            })

            callback && callback()
        },
        /**
         * 用户信息弹窗 - pc
         * @param {*} clientX
         * @param {*} clientY
         * @param {*} userInfo
         * @param {*} callback
         */
        userInfoPopupPc: async function({
            clientX, clientY, userInfo, callback
        }){
            // 创建弹窗，位置坐标为clientX, clientY，信息为userInfo，点击回调为callback
            const width = 320
            const height = 280
            if(clientY + height > window.innerHeight){
                clientY = clientY - height
            }
            if(clientX + width > window.innerWidth){
                clientX = clientX - width
            }

            let footerBtns = ''
            if(userInfo.channelId){
                footerBtns += `
                    <button class="tl-rtc-app-user-info-popup-footer-btn layui-btn layui-btn-sm layui-btn-primary" id="chatUserInfoPopup">发送信息</button>
                    <button class="tl-rtc-app-user-info-popup-footer-btn layui-btn layui-btn-sm layui-btn-primary" id="callUserInfoPopup">发起语音</button>
                    <button class="tl-rtc-app-user-info-popup-footer-btn layui-btn layui-btn-sm layui-btn-primary" id="videoUserInfoPopup">发起视频</button>
                `
                if(!userInfo.isFriend){
                    footerBtns += `
                        <button class="tl-rtc-app-user-info-popup-footer-btn layui-btn layui-btn-sm layui-btn-primary" id="addFriendUserInfoPopup">加好友</button>
                    `
                }
            }
            
            let that = this
            layer.open({
                type: 1,
                title: false,
                closeBtn: 0,
                move: '.tl-rtc-app-user-info-popup-header',
                skin: 'tl-rtc-app-layer-user-info-popup',
                content: `
                    <div class="tl-rtc-app-user-info-popup">
                        <div class="tl-rtc-app-user-info-popup-header">
                            <div class="tl-rtc-app-user-info-popup-header-avatar">
                                <img src="${userInfo.userAvatar}">
                            </div>
                            <div class="tl-rtc-app-user-info-popup-header-name">
                                <div>${userInfo.username || '-'}</div>
                                <div style="font-size: 12px;margin-top: 5px;"> ${userInfo.userCompanyName || '-'}</div>
                            </div>
                        </div>
                        <div class="tl-rtc-app-user-info-popup-content">
                            <div class="tl-rtc-app-user-info-popup-content-item">
                                <div class="tl-rtc-app-user-info-popup-content-item-title">手机:</div>
                                <div class="tl-rtc-app-user-info-popup-content-item-value">${userInfo.mobile || '-'}</div>
                            </div>
                            <div class="tl-rtc-app-user-info-popup-content-item">
                                <div class="tl-rtc-app-user-info-popup-content-item-title">邮箱:</div>
                                <div class="tl-rtc-app-user-info-popup-content-item-value">${userInfo.email || '-'}</div>
                            </div>
                            <div class="tl-rtc-app-user-info-popup-content-item">
                                <div class="tl-rtc-app-user-info-popup-content-item-title">微信:</div>
                                <div class="tl-rtc-app-user-info-popup-content-item-value">${userInfo.wechatName || '-'}</div>
                            </div>
                        </div>
                        <div class="tl-rtc-app-user-info-popup-footer">
                            ${footerBtns}
                        </div>
                    </div>
                `,
                shade: 0.001,
                area: [width + 'px', height + 'px'],
                offset: [clientY + 'px', clientX + 'px'],
                shadeClose: true,
                resize: false,
                yes: function (index) {
                    layer.close(index)
                },
                success: function (layero, index) {
                    layero.css({
                        "border-radius": "6px",
                    })
                    layero.find(".tl-rtc-app-user-info-popup-content").css({
                        'height': height - 140 + 'px',
                    })

                    const chatUserInfoPopup = document.querySelector("#chatUserInfoPopup")
                    chatUserInfoPopup && chatUserInfoPopup.addEventListener('click', function(e){
                        callback && callback({
                            type: 'chat',
                            userInfo: userInfo
                        })
                        layer.close(index)
                    })
                    const callUserInfoPopup = document.querySelector("#callUserInfoPopup")
                    callUserInfoPopup && callUserInfoPopup.addEventListener('click', function(){
                        callback && callback({
                            type: 'audio',
                            userInfo: userInfo
                        })
                        layer.close(index)
                    })
                    const videoUserInfoPopup = document.querySelector("#videoUserInfoPopup")
                    videoUserInfoPopup && videoUserInfoPopup.addEventListener('click', function(){
                        callback && callback({
                            type: 'video',
                            userInfo: userInfo
                        })
                        layer.close(index)
                    })
                    const addFriendUserInfoPopup = document.querySelector("#addFriendUserInfoPopup")
                    addFriendUserInfoPopup && addFriendUserInfoPopup.addEventListener('click', function(){
                        callback && callback({
                            type: 'addFriend',
                            userInfo: userInfo
                        })
                        layer.close(index)
                    })
                }
            })
        },
        /**
         * 用户信息弹窗 - 移动端
         * @param {*} clientX
         * @param {*} clientY
         * @param {*} userInfo
         * @param {*} callback
         */
        userInfoPopupMobile: async function({
            clientX, clientY, userInfo, callback
        }){
            // 创建弹窗，信息为userInfo，点击回调为callback
            let footerBtns = ''
            if(userInfo.channelId){
                footerBtns += `
                    <button class="tl-rtc-app-user-info-popup-footer-btn layui-btn layui-btn-primary" id="chatUserInfoPopup">发送信息</button>
                    <button class="tl-rtc-app-user-info-popup-footer-btn layui-btn layui-btn-primary" id="callUserInfoPopup">发起语音</button>
                    <button class="tl-rtc-app-user-info-popup-footer-btn layui-btn layui-btn-primary" id="videoUserInfoPopup">发起视频</button>
                `
                if(!userInfo.isFriend){
                    footerBtns += `
                        <button class="tl-rtc-app-user-info-popup-footer-btn layui-btn layui-btn-primary" id="addFriendUserInfoPopup">加好友</button>
                    `
                }
            }

            let that = this
            layer.open({
                type: 1,
                title: "用户信息",
                skin: 'tl-rtc-app-layer-user-info-popup',
                content: `
                    <div class="tl-rtc-app-user-info-popup">
                        <div class="tl-rtc-app-user-info-popup-header-mobile">
                            <div class="tl-rtc-app-user-info-popup-header-avatar">
                                <img src="${userInfo.userAvatar}">
                            </div>
                            <div class="tl-rtc-app-user-info-popup-header-name">
                                <div>${userInfo.username || '-'}</div>
                                <div style="font-size: 12px;margin-top: 5px;"> ${userInfo.userCompanyName || '-'}</div>
                            </div>
                        </div>
                        <div class="tl-rtc-app-user-info-popup-content-mobile">
                            <div class="tl-rtc-app-user-info-popup-content-item-mobile">
                                <div class="tl-rtc-app-user-info-popup-content-item-title">手机:</div>
                                <div class="tl-rtc-app-user-info-popup-content-item-value">${userInfo.mobile || '-'}</div>
                            </div>
                            <div class="tl-rtc-app-user-info-popup-content-item-mobile">
                                <div class="tl-rtc-app-user-info-popup-content-item-title">邮箱:</div>
                                <div class="tl-rtc-app-user-info-popup-content-item-value">${userInfo.email || '-'}</div>
                            </div>
                            <div class="tl-rtc-app-user-info-popup-content-item-mobile">
                                <div class="tl-rtc-app-user-info-popup-content-item-title">微信:</div>
                                <div class="tl-rtc-app-user-info-popup-content-item-value">${userInfo.wechatName || '-'}</div>
                            </div>
                        </div>
                        <div class="tl-rtc-app-user-info-popup-footer-mobile">
                            ${footerBtns}
                        </div>
                    </div>
                `,
                area: ['100%', '100%'],
                shadeClose: true,
                resize: false,
                yes: function (index) {
                    layer.close(index)
                    console.log('yes')
                },
                success: function (layero, index) {
                    layero.find(".layui-layer-content").css({
                        "border-radius": "0px",
                    })

                    const chatUserInfoPopup = document.querySelector("#chatUserInfoPopup")
                    chatUserInfoPopup && chatUserInfoPopup.addEventListener('click', function(e){
                        callback && callback({
                            type: 'chat',
                            userInfo: userInfo
                        })
                        layer.close(index)
                    })
                    const callUserInfoPopup = document.querySelector("#callUserInfoPopup")
                    callUserInfoPopup && callUserInfoPopup.addEventListener('click', function(){
                        callback && callback({
                            type: 'audio',
                            userInfo: userInfo
                        })
                        layer.close(index)
                    })
                    const videoUserInfoPopup = document.querySelector("#videoUserInfoPopup")
                    videoUserInfoPopup && videoUserInfoPopup.addEventListener('click', function(){
                        callback && callback({
                            type: 'video',
                            userInfo: userInfo
                        })
                        layer.close(index)
                    })
                    const addFriendUserInfoPopup = document.querySelector("#addFriendUserInfoPopup")
                    addFriendUserInfoPopup && addFriendUserInfoPopup.addEventListener('click', function(){
                        callback && callback({
                            type: 'addFriend',
                            userInfo: userInfo
                        })
                        layer.close(index)
                    })
                }
            })
        },
        /**
         * 用户信息弹窗
         * @param {*} clientX
         * @param {*} clientY
         * @param {*} userInfo
         * @param {*} callback
         */
        userInfoPopup: async function({
            clientX, clientY, userInfo, callback
        }){
            const userId = userInfo.id
            if (userId == 'system'){
                return
            }

            if(!userId){
                this.addToastMsg({
                    type: 'error',
                    message: '获取用户信息失败'
                })
                return
            }

            const params = {
                id: userId
            }

            if(!window.tl_rtc_app_comm.checkRequestParams(params)){
                return
            }

            const { data: userRes } = await this.tlRequest({
                url: '/api/web/user/search-user-by-id',
                method: 'post',
                useCache: false,
                data: params,
            })

            if(!userRes.success){
                this.addToastMsg({
                    type: 'error',
                    message: '获取用户信息失败: ' + userRes.msg
                })
                return
            }
            userInfo = userRes.data

            if(this.isMobile){
                return await this.userInfoPopupMobile({
                    clientX, clientY, userInfo, callback
                })
            }else{
                return await this.userInfoPopupPc({
                    clientX, clientY, userInfo, callback
                })
            }
        },
        /**
         * 群聊信息弹窗 - pc
         * @param {*} clientX
         * @param {*} clientY
         * @param {*} channelInfo
         * @param {*} callback
         */
        channelInfoPopupPc: async function({
            clientX, clientY, channelInfo, callback
        }){
            // 创建弹窗，位置坐标为clientX, clientY，信息为channelInfo，点击回调为callback
            const width = 320
            const height = 280
            if(clientY + height > window.innerHeight){
                clientY = clientY - height
            }
            if(clientX + width > window.innerWidth){
                clientX = clientX - width
            }

            let footerBtns = ''
            if(channelInfo.channelId){
                footerBtns += `
                    <button class="tl-rtc-app-user-info-popup-footer-btn layui-btn layui-btn-sm layui-btn-primary" id="chatChannelInfoPopup">发送信息</button>
                `
                if(!channelInfo.isChannelUser){
                    footerBtns += `
                        <button class="tl-rtc-app-user-info-popup-footer-btn layui-btn layui-btn-sm layui-btn-primary" id="addChannelInfoPopup">加入群聊</button>
                    `
                }
            }

            let that = this
            layer.open({
                type: 1,
                title: false,
                closeBtn: 0,
                move: '.tl-rtc-app-user-info-popup-header',
                skin: 'tl-rtc-app-layer-user-info-popup',
                content: `
                    <div class="tl-rtc-app-user-info-popup">
                        <div class="tl-rtc-app-user-info-popup-header">
                            <div class="tl-rtc-app-user-info-popup-header-avatar">
                                <img src="${channelInfo.channelAvatar}">
                            </div>
                            <div class="tl-rtc-app-user-info-popup-header-name">
                                <div>${channelInfo.channelName || '-'}</div>
                                <div style="font-size: 12px;margin-top: 5px;"> ${channelInfo.companyName || '-'}</div>
                            </div>
                        </div>
                        <div class="tl-rtc-app-user-info-popup-content">
                            <div class="tl-rtc-app-user-info-popup-content-item">
                                <div class="tl-rtc-app-user-info-popup-content-item-title">群号:</div>
                                <div class="tl-rtc-app-user-info-popup-content-item-value">
                                    ${channelInfo.channelId || '-'}
                                    <svg style="margin-left:5px;cursor: pointer;" class="icon" aria-hidden="true" id="popupCopyChannelId">
                                        <use xlink:href="#tl-rtc-app-icon-fuzhi"></use>
                                    </svg>
                                </div>
                            </div>
                            <div class="tl-rtc-app-user-info-popup-content-item">
                                <div class="tl-rtc-app-user-info-popup-content-item-title">成员:</div>
                                <div class="tl-rtc-app-user-info-popup-content-item-value">${channelInfo.channelUserCount}人</div>
                            </div>
                            <div class="tl-rtc-app-user-info-popup-content-item">
                                <div class="tl-rtc-app-user-info-popup-content-item-title">群介绍:</div>
                                <div class="tl-rtc-app-user-info-popup-content-item-value">${channelInfo.channelIntro || '-'}</div>
                            </div>
                        </div>
                        <div class="tl-rtc-app-user-info-popup-footer">
                            ${footerBtns}
                        </div>
                    </div>
                `,
                shade: 0.001,
                area: [width + 'px', height + 'px'],
                offset: [clientY + 'px', clientX + 'px'],
                shadeClose: true,
                resize: false,
                yes: function (index) {
                    layer.close(index)
                    console.log('yes')
                },
                success: function (layero, index) {
                    layero.css({
                        "border-radius": "6px",
                    })
                    layero.find(".tl-rtc-app-user-info-popup-content").css({
                        'height': height - 140 + 'px',
                    })

                    const chatChannelnfoPopup = document.querySelector("#chatChannelInfoPopup")
                    chatChannelnfoPopup && chatChannelnfoPopup.addEventListener('click', function(e){
                        callback && callback({
                            type: 'chat',
                            channelInfo: channelInfo
                        })
                        layer.close(index)
                    })
                    const addChannelInfoPopup = document.querySelector("#addChannelInfoPopup")
                    addChannelInfoPopup && addChannelInfoPopup.addEventListener('click', function(){
                        callback && callback({
                            type: 'addFriend',
                            channelInfo: channelInfo
                        })
                        layer.close(index)
                    })

                    const popupCopyChannelId = document.querySelector("#popupCopyChannelId")
                    popupCopyChannelId && popupCopyChannelId.addEventListener('click', function(){
                        window.tl_rtc_app_comm.copyTxt('popupCopyChannelId', channelInfo.channelId, function(){
                            that.addToastMsg({
                                type: 'success',
                                message: '复制成功'
                            })
                        })
                    })
                }
            })
        },
        /**
         * 群聊信息弹窗 - 移动端
         * @param {*} clientX
         * @param {*} clientY
         * @param {*} channelInfo
         * @param {*} callback
         */
        channelInfoPopupMobile: async function({
            clientX, clientY, channelInfo, callback
        }){
            // 创建弹窗，信息为channelInfo，点击回调为callback
            let footerBtns = ''
            if(channelInfo.channelId){
                footerBtns += `
                    <button class="tl-rtc-app-user-info-popup-footer-btn layui-btn layui-btn-primary" id="chatChannelInfoPopup">发送信息</button>
                `
                if(!channelInfo.isChannelUser){
                    footerBtns += `
                        <button class="tl-rtc-app-user-info-popup-footer-btn layui-btn layui-btn-primary" id="addChannelInfoPopup">加入群聊</button>
                    `
                }
            }

            let that = this
            layer.open({
                type: 1,
                title: "群聊信息",
                skin: 'tl-rtc-app-layer-user-info-popup',
                content: `
                    <div class="tl-rtc-app-user-info-popup">
                        <div class="tl-rtc-app-user-info-popup-header-mobile">
                            <div class="tl-rtc-app-user-info-popup-header-avatar">
                                <img src="${channelInfo.channelAvatar}">
                            </div>
                            <div class="tl-rtc-app-user-info-popup-header-name">
                                <div>${channelInfo.channelName || '-'}</div>
                                <div style="font-size: 12px;margin-top: 5px;"> ${channelInfo.companyName || '-'}</div>
                            </div>
                        </div>
                        <div class="tl-rtc-app-user-info-popup-content-mobile">
                            <div class="tl-rtc-app-user-info-popup-content-item-mobile">
                                <div class="tl-rtc-app-user-info-popup-content-item-title">群号:</div>
                                <div class="tl-rtc-app-user-info-popup-content-item-value">
                                    ${channelInfo.channelId || '-'}
                                    <svg style="margin-left:5px;cursor: pointer;" class="icon" aria-hidden="true" id="popupCopyChannelId">
                                        <use xlink:href="#tl-rtc-app-icon-fuzhi"></use>
                                    </svg>
                                </div>
                            </div>
                            <div class="tl-rtc-app-user-info-popup-content-item-mobile">
                                <div class="tl-rtc-app-user-info-popup-content-item-title">成员:</div>
                                <div class="tl-rtc-app-user-info-popup-content-item-value">${channelInfo.channelUserCount}人</div>
                            </div>
                            <div class="tl-rtc-app-user-info-popup-content-item-mobile">
                                <div class="tl-rtc-app-user-info-popup-content-item-title">群介绍:</div>
                                <div class="tl-rtc-app-user-info-popup-content-item-value">${channelInfo.channelIntro || '-'}</div>
                            </div>
                        </div>
                        <div class="tl-rtc-app-user-info-popup-footer-mobile">
                            ${footerBtns}
                        </div>
                    </div>
                `,
                area: ['100%', '100%'],
                shadeClose: true,
                resize: false,
                yes: function (index) {
                    layer.close(index)
                    console.log('yes')
                },
                success: function (layero, index) {
                    layero.find(".layui-layer-content").css({
                        "border-radius": "0px",
                    })

                    const chatChannelnfoPopup = document.querySelector("#chatChannelInfoPopup")
                    chatChannelnfoPopup && chatChannelnfoPopup.addEventListener('click', function(e){
                        callback && callback({
                            type: 'chat',
                            channelInfo: channelInfo
                        })
                        layer.close(index)
                    })
                    const addChannelInfoPopup = document.querySelector("#addChannelInfoPopup")
                    addChannelInfoPopup && addChannelInfoPopup.addEventListener('click', function(){
                        callback && callback({
                            type: 'addFriend',
                            channelInfo: channelInfo
                        })
                        layer.close(index)
                    })
                    const popupCopyChannelId = document.querySelector("#popupCopyChannelId")
                    popupCopyChannelId && popupCopyChannelId.addEventListener('click', function(){
                        window.tl_rtc_app_comm.copyTxt('popupCopyChannelId', channelInfo.channelId, function(){
                            that.addToastMsg({
                                type: 'success',
                                message: '复制成功'
                            })
                        })
                    })
                }
            })
        },
        /**
         * 群聊信息弹窗
         * @param {*} clientX
         * @param {*} clientY
         * @param {*} channelInfo
         * @param {*} callback
         */
        channelInfoPopup: async function({
            clientX, clientY, channelInfo, callback
        }){
            const channelId = channelInfo.id
         
            if(!channelId){
                this.addToastMsg({
                    type: 'error',
                    message: '获取群聊信息失败'
                })
                return
            }

            const params = {
                channelId: channelId
            }

            if(!window.tl_rtc_app_comm.checkRequestParams(params)){
                return
            }

            const { data: channelRes } = await this.tlRequest({
                url: '/api/web/channel/search-channel-by-id',
                method: 'post',
                useCache: false,
                data: params,
            })

            if(!channelRes.success){
                this.addToastMsg({
                    type: 'error',
                    message: '获取群聊信息失败: ' + channelRes.msg
                })
                return
            }
            channelInfo = channelRes.data

            if(this.isMobile){
                return await this.channelInfoPopupMobile({
                    clientX, clientY, channelInfo, callback
                })
            }else{
                return await this.channelInfoPopupPc({
                    clientX, clientY, channelInfo, callback
                })
            }
        }
    },
    mounted() {
        this.startPopUpMsg()
    },
    created(){
        // 添加系统消息弹窗
        window.subModule.$on('component-popup-add-pop-up-msg', this.addPopUpMsg);

        // 提示消息toast
        window.subModule.$on('component-popup-add-toast-msg', this.addToastMsg);

        // 快捷操作面板
        window.subModule.$on('component-popup-add-quick-oper-panel', this.addQuickOperPanel)

        // 用户信息弹窗
        window.subModule.$on('component-popup-user-info-popup', this.userInfoPopup)

        // 群聊信息弹窗
        window.subModule.$on('component-popup-channel-info-popup', this.channelInfoPopup)
    }
})

window.tl_rtc_app_popup = tl_rtc_app_popup;