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
        },
        channelUsers: {
            type: Array,
            default: function () {
                return []
            }
        },
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
        propsChannelUsers() {
            return this.channelUsers;
        },
    },
    watch: {
        leftModule: function (val) {
            if (this.propsLeftModule === 'channel' && this.propsRightModule === 'content') {
                this.$nextTick(() => {
                    this.loadLayedit(this.getLayeditHeight())
                })
            }
        },
        rightModule: function (val) {
            if (this.propsLeftModule === 'channel' && this.propsRightModule === 'content') {
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

            layeditToolHeight: 41, // 编辑器工具栏高度
            hitQuickMessageList: [], // 命中快捷消息列表
            hitAtUserList: [], // 命中@用户列表
            quickMessageList: window.tl_rtc_app_comm.getQuickMessageList().map(item => {
                return {
                    message: item,
                }
            }),
        }
    },
    methods: {
        /**
         *  事件触发，向上传递
         * @param {*} event 
         */
        leftModuleChange: function (event) {
            this.$emit('left-module-change', event)
        },
        /**
         * 事件触发，向上传递
         * @param {*} event 
         */
        rightModuleChange: function (event) {
            this.$emit('right-module-change', event)
        },
        /**
         * 获取layedit的高度
         * @returns 
         */
        getLayeditHeight: function () {
            const textareaBody = document.getElementById('channel_chat_textarea');
            if (textareaBody.style.height) {
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
            if (isBodyHeightPersent) {
                editorHeight = (
                    Number(channelEditHeight.replace("%", "")) * (
                        window.innerHeight * Number(bodyHeight.replace("%", "")) / 100
                    ) / 100 - 85
                ) + "px"
            } else {
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
        saveRecentFace: function (face) {
            let recentFaceList = localStorage.getItem('recentFaceList')
            if (recentFaceList) {
                recentFaceList = JSON.parse(recentFaceList)
            } else {
                recentFaceList = []
            }
            if (recentFaceList.length >= 30) {
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
        getRecentFaceList: function () {
            let recentFaceList = localStorage.getItem('recentFaceList')
            if (recentFaceList) {
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

            let tool = ['face', 'file', 'history', 'record', 'draw', 'printCut']

            const options = {
                elem: null,
                tool: tool,
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
                    clickFaceCallback: function (face) {
                        // 保存为最近使用
                        that.saveRecentFace(face)

                        try {
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
                            if (textareaIframeDom) {
                                textareaIframeDom.ownerDocument.getSelection().removeAllRanges()
                            }
                        } catch (e) {
                            console.log(e)
                        }
                    }
                },
                file: {
                    url: '/api/web/cloud-file/upload-file',
                    type: 'post',
                    chooseFileCallback: async function (res) { //获取文件数据的回调方法
                        const files = Object.values(res.pushFile())
                        for (let i = 0; i < files.length; i++) {
                            await that.sendFileCallback(files[i])
                        }
                    }
                },
                history: {
                    historyCallback: function () {
                        that.emitSubModuleEvent({
                            event: 'sub-module-channel-search-message',
                        })
                    }
                },
                printCut: {
                    printCutCallback: async function () {
                        let res = await window.tl_rtc_app_comm.captureScreenshot()
                        if(res){
                            that.popSuccessMsg("截图成功");
                        }else{
                            that.popErrorMsg("截图失败");
                        }
                    }
                },
                record: {
                    recordCallback: function () {
                        that.emitSubModuleEvent({
                            event: 'component-record-start',
                        })
                    }
                },
                draw: {
                    drawCallback: async function () {
                        const imageFile = await that.emitSubModuleEvent({
                            event: 'component-draw-start-local',
                            data: {
                                openCallback: function () {

                                },
                                closeCallback: function () {

                                },
                                localDrawCallback: function () {

                                }
                            }
                        })
                        if (imageFile) {
                            await that.sendFileCallback(imageFile)
                        }
                    }
                },
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

            if (textareaIframeDom) {
                // 监听键盘事件
                window.tl_rtc_app_comm.keydownCallback(textareaIframeDom, this.sendTextareaMessage)

                let that = this
                // 监听输入事件
                textareaIframeDom.addEventListener('input', (e) => {
                    let text = layedit.getText(that.layeditId)
                    that.quickMessageHandler(text)

                    if (text.includes('@')) {
                        const atUserText = text.substring(text.lastIndexOf('@'))
                        that.atUserMessageHandler(atUserText)
                    }else{
                        that.atUserMessageHandler('')
                    }
                })
            }

            // 设置编辑器字体颜色
            setTimeout(() => {
                const { skinBodyColor } = window.tl_rtc_app_comm.getPropertyValues([
                    { key: "skinBodyColor", value: "skin-body-color" }
                ])
                if (textareaIframeDom) {
                    textareaIframeDom.style.color = skinBodyColor
                }
            }, 500)
        },
        /**
         * 快捷消息过滤处理
         * @param {*} text
         * @param {*} callback 
         */
        quickMessageHandler: async function(text){
            if(text === ''){
                this.hitQuickMessageList = []
            }else{
                let hitQuickMessageList = this.quickMessageList.filter(item => {
                    // 处理命中文本高亮
                    let hitText = item.message
                    let hitTextIndex = hitText.indexOf(text)
                    if (hitTextIndex !== -1) {
                        item.hitMessage = hitText.substring(0, hitTextIndex) + "<span class='tl-rtc-app-right-channel-content-textarea-quick-message-hit-text'>" + hitText.substring(hitTextIndex, hitTextIndex + text.length) + "</span>" + hitText.substring(hitTextIndex + text.length)
                        return true
                    }
                    return false
                })
                this.hitQuickMessageList = hitQuickMessageList
            }

            // 通知body模块显示快捷消息
            await this.emitSubModuleEvent({
                event: 'sub-module-channel-content-show-quick-message',
                data: {
                    hitQuickMessageList: this.hitQuickMessageList
                }
            })
        },
        /**
         * at用户过滤处理
         * @param {*} text
         * @param {*} callback 
         */
        atUserMessageHandler: async function(text){
            if(text === ''){
                this.hitAtUserList = []
            }else if(text === '@'){
                this.hitAtUserList = this.propsChannelUsers
            }else{
                text = text.substring(1)
                let hitAtUserList = this.propsChannelUsers.filter(item => {
                    // 处理命中文本高亮
                    let hitText = item.username
                    let hitTextIndex = hitText.indexOf(text)
                    if (hitTextIndex !== -1) {
                        item.hitMessage = `
                            ${hitText.substring(0, hitTextIndex)} 
                            <span class='tl-rtc-app-right-channel-content-textarea-at-user-hit-text'>
                                ${hitText.substring(hitTextIndex, hitTextIndex + text.length)}
                            </span> 
                            ${hitText.substring(hitTextIndex + text.length)}
                        `
                        return true
                    }
                    return false
                })
                this.hitAtUserList = hitAtUserList
            }

            // 通知body模块显示快捷消息
            await this.emitSubModuleEvent({
                event: 'sub-module-channel-content-show-at-user',
                data: {
                    hitAtUserList: this.hitAtUserList
                }
            })
        },
        /**
         * 渲染选择文件组件
         * @returns
         */
        loadChooseFile: async function () {
            let that = this;

            await that.emitSubModuleEvent({
                event: 'component-file-init-drag',
                data: {
                    className: 'tl-rtc-app-right',
                    chooseFileCallback: function ({
                        fileList, file
                    }) {
                        that.sendFileCallback(file, true)
                    }
                }
            })
        },
        /**
         * 卸载选择文件组件
         */
        unloadChooseFile: function () {

        },
        /**
         * 发送消息
         * @returns 
         */
        sendTextareaMessage: function () {
            let realContent = layedit.getContent(this.layeditId)
            realContent = window.tl_rtc_app_comm.sanitizeHTML(realContent)
            let text = layedit.getText(this.layeditId)

            if (realContent.length > 20000 || text.length > 10000) {
                this.popWarningMsg("消息内容过长")
                return;
            }

            if (realContent.length === 0 || realContent.trim().length === 0) {
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
        sendChannelMessage: function ({
            messageData, callback
        }) {
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
         * 选择文件回调
         * @param {*} cur_file 
         */
        sendFileCallback: async function (cur_file, isDrag = false) {
            if (cur_file.size > 1024 * 1024 * 5) {
                this.popWarningMsg("文件大小不能超过5M")
                return
            }

            if (isDrag) {
                await this.emitSubModuleEvent({
                    event: 'component-file-show-upload-icon'
                })
            }

            // 上传文件
            let formData = new FormData();
            formData.append('file', cur_file);
            formData.append('channelId', this.propsChannelId)

            const { data: uploadRes } = await this.tlRequest({
                url: '/api/web/cloud-file/upload-file',
                method: 'post',
                useCache: false,
                data: formData,
                headers: { 'Content-Type': 'multipart/form-data' },

            })

            if (!uploadRes.success) {
                this.popErrorMsg(uploadRes.msg)
                if (isDrag) {
                    await this.emitSubModuleEvent({
                        event: 'component-file-close-upload-icon'
                    })
                }
                return
            }

            this.popSuccessMsg(uploadRes.msg)

            // 上传成功
            if (isDrag) {
                cur_file.uploadStatus = 'done'
                await this.emitSubModuleEvent({
                    event: 'component-file-update-upload-icon'
                })
            }

            // 如果是频道发送文件, 生成消息
            const cloudFileId = uploadRes.data.cloudFileId
            const inChannelPage = this.propsLeftModule === 'channel' && this.propsRightModule === 'content'
            if (this.propsChannelId && cloudFileId && inChannelPage) {
                const messageData = {
                    cloudFileId: cloudFileId
                }
                this.$emit('push-channel-file-message', messageData)
            }
        },
        /**
         * 调整textarea的大小
         */
        resizeTextarea: function () {
            let that = this
            const resizeHandle = document.querySelector('.tl-rtc-app-right-channel-content-bottom-resize-handle');
            const textareaBody = document.getElementById('channel_chat_textarea');
            const contentBody = document.querySelector('.tl-rtc-app-right-channel-content-body');

            // 需要调整回复块的位置
            let replyMessageBlock = document.querySelector('.tl-rtc-app-right-channel-content-body-reply-content-block');
            // 需要调整快捷消息块的位置
            let quickMessageBlock = document.querySelector('.tl-rtc-app-right-channel-content-body-quick-message-content-block');
            // 需要调整at用户块的位置
            let atUserBlock = document.querySelector('.tl-rtc-app-right-channel-content-body-at-user-content-block');

            const downHandler = (e) => {
                that.isResizing = true;
                that.startY = e.clientY; // 记录初始鼠标Y位置
                document.body.style.cursor = 'row-resize';

                that.preContent = layedit.getContent(that.layeditId)

                // 需要调整回复块的位置
                replyMessageBlock = document.querySelector('.tl-rtc-app-right-channel-content-body-reply-content-block');
                // 需要调整快捷消息块的位置
                quickMessageBlock = document.querySelector('.tl-rtc-app-right-channel-content-body-quick-message-content-block');
                // 需要调整at用户块的位置
                atUserBlock = document.querySelector('.tl-rtc-app-right-channel-content-body-at-user-content-block');

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
                if (newHeight < 100) {
                    newHeight = 100
                    moveHeight = newHeight - textareaRect.height
                } else if (newHeight > 300) {
                    newHeight = 300
                    moveHeight = newHeight - textareaRect.height
                }
                textareaBody.style.height = newHeight + 'px';

                const bodyRect = contentBody.getBoundingClientRect();
                const newBodyHeight = bodyRect.height - moveHeight
                contentBody.style.height = newBodyHeight + 'px';

                if (replyMessageBlock) {
                    // 回复情况下，处理回复框定位
                    if(that.replyToMessageId){
                        replyMessageBlock.style.bottom = newHeight + that.layeditToolHeight + 'px'    //42px是layedit工具栏的高度

                        // 回复情况下，处理快捷消息定位
                        if(quickMessageBlock && that.hitQuickMessageList.length > 0){
                            that.$nextTick(() => {
                                quickMessageBlock.style.bottom = newHeight + that.layeditToolHeight + replyMessageBlock.clientHeight + 'px'
                            })
                        }

                        // 回复情况下，处理@用户定位
                        if(atUserBlock && that.hitAtUserList.length > 0){
                            that.$nextTick(() => {
                                atUserBlock.style.bottom = newHeight + that.layeditToolHeight + replyMessageBlock.clientHeight + 'px'
                            })
                        }
                    }else{
                        // 取消回复情况下，处理快捷消息定位
                        if(quickMessageBlock){
                            quickMessageBlock.style.bottom = newHeight + that.layeditToolHeight + 'px'
                        }

                        // 取消回复情况下，处理@用户定位
                        if(atUserBlock){
                            atUserBlock.style.bottom = newHeight + that.layeditToolHeight + 'px'
                        }
                    }
                }

                // 需要调整快捷消息块的位置, 42px是layedit工具栏的高度
                if (quickMessageBlock) {
                    if(replyMessageBlock && that.replyToMessageId){
                        that.$nextTick(() => {
                            quickMessageBlock.style.bottom = newHeight + that.layeditToolHeight + replyMessageBlock.clientHeight + 'px'
                        })
                    }
                }

                // 需要调整at用户块的位置
                if (atUserBlock) {
                    if(replyMessageBlock && that.replyToMessageId){
                        that.$nextTick(() => {
                            atUserBlock.style.bottom = newHeight + that.layeditToolHeight + replyMessageBlock.clientHeight + 'px'
                        })
                    }
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
        atUserText: function (atUserName) {
            return '<span class="textarea-at-user-text">'+ atUserName +'</span>&nbsp;'
        },
        /**
         * 生成@用户文本
         * @param {*} item 
         */
        generateAtUserText: function ({
            atUserId, atUserName, isAtAll, callback
        }) {
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
            if (atUserId && atUserName) {
                textareaIframeDom.innerHTML += this.atUserText(atUserName)
            }

            // 生成@所有人文本
            if (isAtAll) {
                textareaIframeDom.innerHTML += this.atUserText('所有人')
            }

            this.atUserId = atUserId
            this.atUserName = atUserName
            this.isAtAll = isAtAll

            // 清空命中at用户列表
            this.atUserMessageHandler("")

            callback && callback()
        },
        /**
         * 生成快捷消息文本
         * @param {*} item 
         */
        generateQuickMessageText: function ({
            text, callback
        }) {
            let textareaIframeDom = null
            let textareaIframe = document.getElementsByTagName("iframe");
            if (textareaIframe && textareaIframe.length >= 1) {
                for (let i = 0; i < textareaIframe.length; i++) {
                    if (textareaIframe[i].id.includes("LAY_layedit")) {
                        textareaIframeDom = textareaIframe[i].contentDocument.body
                    }
                }
            }

            textareaIframeDom.innerHTML = text

            this.quickMessageHandler('')

            callback && callback()
        },
        /**
         * 设置回复消息
         * @param {*} replyToMessageId 
         * @param {*} replyToMessageContent 
         * @param {*} callback 
         */
        setReplyMessage: function ({
            replyToMessageId, replyToMessageType, replyToMessageContent, callback
        }) {
            this.replyToMessageId = replyToMessageId
            this.replyToMessageType = replyToMessageType
            this.replyToMessageContent = replyToMessageContent

            callback && callback()
        },
        /**
         * 清除回复消息
         */
        clearReplyMessage: function ({
            callback
        }) {
            this.replyToMessageId = ''
            this.replyToMessageType = ''
            this.replyToMessageContent = ''

            callback && callback()
        },
        /**
         * 清除快捷消息
         */
        clearQuickMessage: function ({
            callback
        }) {
            this.hitQuickMessageList = []

            callback && callback()
        },
        /**
         * 清除@用户
         */
        clearAtUserMessage: function ({
            callback
        }) {
            this.atUserId = ''
            this.atUserName = ''
            this.isAtAll = false
            this.hitAtUserList = []

            callback && callback()
        },
        /**
         * 打开表情选择
         */
        openFace: function ({
            elem,
            callback
        }) {
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
                clickFaceCallback: function (face) {
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

                    if (!textareaIframeDom) {
                        return
                    }

                    if (face.type === 'img') {
                        let elem = document.createElement('img')
                        for (var key in face) {
                            elem.setAttribute(key, face[key]);
                        }
                        textareaIframeDom.appendChild(elem)
                    } else if (face.type === 'text') {
                        textareaIframeDom.innerHTML += face.alt
                    }
                }
            });

            callback && callback()
        }
    },
    mounted: async function () {
        let that = this

        await this.loadChooseFile()

        this.resizeTextarea()
    },
    created() {
        // 发送频道消息
        window.subModule.$on('sub-module-channel-texarea-send-message', this.sendChannelMessage)

        // 生成@用户文本
        window.subModule.$on('sub-module-channel-content-generate-at-user-text', this.generateAtUserText)

        // 生成快捷消息文本
        window.subModule.$on('sub-module-channel-content-generate-quick-message-text', this.generateQuickMessageText)

        // 设置回复消息
        window.subModule.$on('sub-module-channel-content-set-textarea-reply-message', this.setReplyMessage)

        // 清除回复消息面板
        window.subModule.$on('sub-module-channel-content-clear-textarea-reply-message', this.clearReplyMessage)

        // 清除快捷消息面板
        window.subModule.$on('sub-module-channel-content-clear-textarea-quick-message', this.clearQuickMessage)

        // 清除@用户面板
        window.subModule.$on('sub-module-channel-content-clear-textarea-at-user', this.clearAtUserMessage)

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