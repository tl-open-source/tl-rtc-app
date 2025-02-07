const tl_rtc_app_module_channel_content_textarea = {
    props: {
        channelId: {
            type: String,
            default: ''
        },
        socketId: {
            type: String,
            default: ''
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
        isMobile: {
            type: Boolean,
            default: false
        },
        channelType: {
            type: String,
            default: ''
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
        propsChannelId() {
            return this.channelId;
        },
        propsSocketId() {
            return this.socketId;
        },
        propsUser() {
            return this.user;
        },
        propsIsMobile() {
            return this.isMobile;
        },
        propsChannelType() {
            return this.channelType;
        },
        propsLeftModule() {
            return this.leftModule;
        },
        propsRightModule() {
            return this.rightModule;
        },
    },
    watch: {
        leftModule: function (val) {
            if(this.propsLeftModule === 'channel' && this.propsRightModule === 'content'){
                this.$nextTick(() => {
                    this.loadLayedit(this.getLayeditHeight())
                })
            }
        },
        rightModule: function (val) {
            if(this.propsLeftModule === 'channel' && this.propsRightModule === 'content'){
                this.$nextTick(() => {
                    this.loadLayedit(this.getLayeditHeight())
                })
            }
        }
    },
    data: function () {
        return {
            historyMessages: [], // 历史消息
            layeditId: '', // 编辑器id
            isResizing: false, // 是否正在调整大小
            startY: 0, // 鼠标起始位置
            preContent: '',  // 编辑器内容

            atUserId: '',  // @用户id
            atUserName: '', // @用户名称
            isAtAll: false, // @所有人

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
         * 获取layedit的高度
         * @returns 
         */
        getLayeditHeight: function () {
            const textareaBody = document.getElementById('channel_chat_textarea');
            if(textareaBody.style.height){
                let height = textareaBody.style.height.replace("px", "")
                return height - 40 + "px";
            }
            const { channelEditHeight, bodyHeight } = window.tl_rtc_app_comm.getPropertyValues([
                { key: "channelEditHeight", value: "right-channel-editor-height" },
                { key: "bodyHeight", value: "body-height" }
            ])

            // 计算编辑器的高度
            let editorHeight = ""
            const isBodyHeightPersent = bodyHeight.indexOf("%") !== -1
            if(isBodyHeightPersent){
                editorHeight = (
                    Number(channelEditHeight.replace("%", "")) * (
                        window.innerHeight * Number(bodyHeight.replace("%", "")) / 100
                    ) / 100 - 85
                ) + "px"
            }else{
                editorHeight = (
                    Number(channelEditHeight.replace("px", "")) * (
                        window.innerHeight
                    ) / 100 - 85
                ) + "px"
            }

            return editorHeight
        },
        /**
         * 保存最近使用表情
         * @param {*} face 
         */
        saveRecentFace: function(face){
            let recentFaceList = localStorage.getItem('recentFaceList')
            if(recentFaceList){
                recentFaceList = JSON.parse(recentFaceList)
            }else{
                recentFaceList = []
            }
            if(recentFaceList.length >= 30){
                recentFaceList.pop()
            }
            // 去重
            recentFaceList = recentFaceList.filter(item => item.alt !== face.alt)
            recentFaceList.unshift(face)
            localStorage.setItem('recentFaceList', JSON.stringify(recentFaceList))
        },
        /**
         * 获取最近使用表情
         * @returns 
         */
        getRecentFaceList: function(){
            let recentFaceList = localStorage.getItem('recentFaceList')
            if(recentFaceList){
                return JSON.parse(recentFaceList)
            }
            return []
        },
        /**
         * 加载富文本编辑器
         * @param {*} layeditHeight 
         */
        loadLayedit: function (layeditHeight) {
            let that = this;

            const options = {
                elem: null,
                tool: ['face'],
                height: layeditHeight,
                face: {
                    recentFaceList: that.getRecentFaceList(),
                    defaultFaceList: [
                        "[小丑]", "[冷漠]", "[可爱]", "[偷笑]", "[调皮]", "[哭笑]",
                    ],
                    textFaceList: [
                        "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
                        "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "_", "+", "=", "[", "]", "{", "}", "|", ":", ";", "'", "<", ">", "?", "/", ".", ",",
                        "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
                    ],
                    customFaceList: [],
                    clickFaceCallback: function(face){
                        // 保存为最近使用
                        that.saveRecentFace(face)

                        try{
                            // 移除选中
                            let textareaIframeDom = null
                            let textareaIframe = document.getElementsByTagName("iframe");
                            if (textareaIframe && textareaIframe.length >= 1) {
                                for (let i = 0; i < textareaIframe.length; i++) {
                                    if (textareaIframe[i].id.includes("LAY_layedit")) {
                                        textareaIframeDom = textareaIframe[i].contentDocument.body
                                    }
                                }
                            }

                            // 移除选中
                            if(textareaIframeDom){
                                textareaIframeDom.ownerDocument.getSelection().removeAllRanges()
                            }
                        }catch(e){
                            console.log(e)
                        }
                    }
                },
                cusFace: {
                    cusFaceCallback: function () {
                        
                    }
                }
            }

            this.layeditId = layedit.build('tl-rtc-app-chat-textarea', options);

            let textareaIframeDom = null
            let textareaIframe = document.getElementsByTagName("iframe");
            if (textareaIframe && textareaIframe.length >= 1) {
                for (let i = 0; i < textareaIframe.length; i++) {
                    if (textareaIframe[i].id.includes("LAY_layedit")) {
                        textareaIframeDom = textareaIframe[i].contentDocument.body
                    }
                }
            }
            
            if(textareaIframeDom){
                window.tl_rtc_app_comm.keydownCallback(textareaIframeDom, this.sendTextareaMessage)
            }

            // 设置编辑器字体颜色
            setTimeout(() => {
                const { skinBodyColor } = window.tl_rtc_app_comm.getPropertyValues([
                    { key: "skinBodyColor", value: "skin-body-color" }
                ])
                if(textareaIframeDom){
                    textareaIframeDom.style.color = skinBodyColor
                }
            }, 500)
        },
        /**
         * 发送消息
         * @returns 
         */
        sendTextareaMessage: function () {
            let realContent = layedit.getContent(this.layeditId)
            let text = layedit.getText(this.layeditId)

            if (realContent.length > 20000 || text.length > 10000) {
                this.popWarningMsg("消息内容过长")
                return;
            }

            if(realContent.length === 0 || realContent.trim().length === 0){
                this.popWarningMsg("请输入消息内容")
                return;
            }

            if((
                realContent.length > 0 && !window.tl_rtc_app_comm.containChinese(realContent)
            ) && text.length === 0){
                this.popWarningMsg("请输入消息内容")
                return;
            }

            const messageData = {
                message: realContent,
                atUserId: this.atUserId,
                atUserName: this.atUserName,
                isAtAll: this.isAtAll,
                replyToMessageId: this.replyToMessageId,
                replyToMessageType: this.replyToMessageType,
            }

            // 发送消息
            this.sendChannelMessage({
                messageData
            })

            // 清空输入
            layedit.setContent(this.layeditId, "", false)
        },
        /**
         * 发送频道消息
         */
        sendChannelMessage: function({
            messageData, callback
        }){
            // 添加到历史记录
            if (this.historyMessages.length > 10) {
                this.historyMessages.unshift()
            }
            this.historyMessages.push(messageData)

            // 通知父模块，数据变更
            this.$emit('push-channel-message', messageData)

            callback && callback()
        },
        /**
         * 调整textarea的大小
         */
        resizeTextarea: function () {
            let that = this
            const resizeHandle = document.querySelector('.tl-rtc-app-right-channel-content-bottom-resize-handle');
            const textareaBody = document.getElementById('channel_chat_textarea');
            const contentBody = document.querySelector('.tl-rtc-app-right-channel-content-body');
            let replyMessageBlock = document.querySelector('.tl-rtc-app-right-channel-content-body-reply-content-block');

            const downHandler = (e) => {
                that.isResizing = true;
                that.startY = e.clientY; // 记录初始鼠标Y位置
                document.body.style.cursor = 'row-resize';

                that.preContent = layedit.getContent(that.layeditId)
                
                replyMessageBlock = document.querySelector('.tl-rtc-app-right-channel-content-body-reply-content-block');

                document.addEventListener('mouseup', upHandler);
                document.addEventListener('mousemove', moveHandler);

                resizeHandle.addEventListener('touchend', upHandler);
                resizeHandle.addEventListener('touchmove', moveHandler);
            }

            const moveHandler = (e) => {
                if (!that.isResizing) return;
                let moveHeight = that.startY - e.clientY

                const textareaRect = textareaBody.getBoundingClientRect();
                let newHeight = textareaRect.height + moveHeight
                if (newHeight < 100){
                    newHeight = 100
                    moveHeight = newHeight - textareaRect.height
                }else if(newHeight > 300){
                    newHeight = 300
                    moveHeight = newHeight - textareaRect.height
                }
                textareaBody.style.height = newHeight + 'px';

                const bodyRect = contentBody.getBoundingClientRect();
                const newBodyHeight = bodyRect.height - moveHeight
                contentBody.style.height = newBodyHeight + 'px';

                if(replyMessageBlock && that.replyToMessageId){
                    replyMessageBlock.style.bottom = newHeight + 42 + 'px'
                }

                that.startY = e.clientY;

                // 禁用body的选中
                document.body.style.userSelect = 'none';
            }

            const upHandler = () => {
                that.isResizing = false;
                document.body.style.cursor = 'default';

                // 启用body的滚动和选中
                document.body.style.userSelect = 'auto';

                that.emitSubModuleEvent({
                    event: 'sub-module-channel-content-scroll-to-bottom'
                })

                // 保存编辑器高度
                that.loadLayedit(that.getLayeditHeight())

                // 重新渲染编辑器内容
                layedit.setContent(that.layeditId, that.preContent, false)

                // 卸载down和move事件
                document.removeEventListener('mouseup', upHandler);
                document.removeEventListener('mousemove', moveHandler);

                resizeHandle.removeEventListener('touchend', upHandler);
                resizeHandle.removeEventListener('touchmove', moveHandler);
            }
            
            // pc端
            resizeHandle.addEventListener('mousedown', downHandler);
            // 移动端
            resizeHandle.addEventListener('touchstart', downHandler);
        },
        /**
         * 艾特用户模版
         * @param {*} atUserName 
         * @returns 
         */
        atUserText: function(atUserName){
            return '<span class="tl-rtc-app-right-channel-content-textarea-at-user-text">@'+atUserName+'</span>&nbsp;'
        },
        /**
         * 生成@用户文本
         * @param {*} item 
         */
        generateAtUserText: function({
            atUserId, atUserName, isAtAll, callback
        }){
            let textareaIframeDom = null
            let textareaIframe = document.getElementsByTagName("iframe");
            if (textareaIframe && textareaIframe.length >= 1) {
                for (let i = 0; i < textareaIframe.length; i++) {
                    if (textareaIframe[i].id.includes("LAY_layedit")) {
                        textareaIframeDom = textareaIframe[i].contentDocument.body
                    }
                }
            }

            // 生成@用户文本
            if(atUserId && atUserName){
                textareaIframeDom.innerHTML += this.atUserText(atUserName)
            }

            // 生成@所有人文本
            if(isAtAll){
                textareaIframeDom.innerHTML += this.atUserText('所有人')
            }

            this.atUserId = atUserId
            this.atUserName = atUserName
            this.isAtAll = isAtAll

            callback && callback()
        },
        /**
         * 设置回复消息
         * @param {*} replyToMessageId 
         * @param {*} replyToMessageContent 
         * @param {*} callback 
         */
        setReplyMessage: function({
            replyToMessageId, replyToMessageType, replyToMessageContent, callback
        }){
            this.replyToMessageId = replyToMessageId
            this.replyToMessageType = replyToMessageType
            this.replyToMessageContent = replyToMessageContent

            callback && callback()
        },
        /**
         * 清除回复消息
         */
        clearReplyMessage: function({
            callback
        }){
            this.replyToMessageId = ''
            this.replyToMessageType = ''
            this.replyToMessageContent = ''

            callback && callback()
        },
        /**
         * 打开表情选择
         */
        openFace: function({
            elem,
            callback
        }){
            let that = this

            layedit.face({
                elem: elem,
                recentFaceList: this.getRecentFaceList(),
                defaultFaceList: [
                    "[小丑]", "[冷漠]", "[可爱]", "[偷笑]", "[调皮]", "[哭笑]",
                ],
                textFaceList: [
                    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
                    "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "_", "+", "=", "[", "]", "{", "}", "|", ":", ";", "'", "<", ">", "?", "/", ".", ",",
                    "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
                ],
                customFaceList: [],
                clickFaceCallback: function(face){
                    // 保存为最近使用
                    that.saveRecentFace(face)

                    let textareaIframeDom = null
                    let textareaIframe = document.getElementsByTagName("iframe");
                    if (textareaIframe && textareaIframe.length >= 1) {
                        for (let i = 0; i < textareaIframe.length; i++) {
                            if (textareaIframe[i].id.includes("LAY_layedit")) {
                                textareaIframeDom = textareaIframe[i].contentDocument.body
                            }
                        }
                    }

                    if(!textareaIframeDom){
                        return
                    }

                    if(face.type === 'img'){
                        let elem = document.createElement('img')
                        for(var key in face){
                            elem.setAttribute(key, face[key]);
                        }
                        textareaIframeDom.appendChild(elem)
                    }else if(face.type === 'text'){
                        textareaIframeDom.innerHTML += face.alt
                    }
                }
            });

            callback && callback()
        }
    },
    mounted: async function() {
        let that = this

        this.resizeTextarea()
    },
    created(){
        // 发送频道消息
        window.subModule.$on('sub-module-channel-texarea-send-message', this.sendChannelMessage)

        // 生成@用户文本
        window.subModule.$on('sub-module-channel-content-generate-at-user-text', this.generateAtUserText)

        // 设置回复消息
        window.subModule.$on('sub-module-channel-content-set-textarea-reply-message', this.setReplyMessage)

        // 清除回复消息
        window.subModule.$on('sub-module-channel-content-clear-textarea-reply-message', this.clearReplyMessage)

        // 打开表情选择
        window.subModule.$on('sub-module-channel-content-open-face', this.openFace)
    },
    template: `
        <div>
            <div class="tl-rtc-app-right-channel-content-bottom-resize-handle"></div>
            <div class="tl-rtc-app-right-channel-content-bottom" id="channel_chat_textarea">
                <textarea id="tl-rtc-app-chat-textarea" maxlength="50000" class="layui-textarea"></textarea>
                <div class="tl-rtc-app-right-channel-content-bottom-btn">
                    <div class="tl-rtc-app-right-channel-content-bottom-tips">enter 发送 | shift+enter 换行</div>
                    <button class="layui-btn layui-btn-sm layui-btn-normal" @click="sendTextareaMessage">发送</button>
                </div>
            </div>
        </div>
    `,
}

window.tl_rtc_app_module_channel_content_textarea = tl_rtc_app_module_channel_content_textarea