const tl_rtc_app_module_cut_paste_content = {
    props : {
        isMobile: {
            type: Boolean,
            default: false
        },
        otherSetting: {
            type: Object,
            default: function(){
                return {}
            }
        },
        user: {
            type: Object,
            default: function(){
                return {}
            }
        },
        socket: {
            type: Object,
            default: function(){
                return {}
            }
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
        propsUser(){
            return this.user;
        },
        propsIsMobile(){
            return this.isMobile;
        },
        propsOtherSetting(){
            return this.otherSetting;
        },
        propsSocket(){
            return this.socket;
        },
        propsLeftModule(){
            return this.leftModule;
        },
        propsRightModule(){
            return this.rightModule;
        },
    },
    watch: {
        leftModule: function (val) {
            
        },
        rightModule: function (val) {
            
        }
    },
    data : function(){
        return {
            title: '',
            cutPasteId: '',
            code: '',
            status: '',
            cutPasteDetailList: [],
            maxInputContentLength: 65000, // 约等于 64kb
            showMode: 'textarea', // 显示界面内容，textarea, histroy
            cutPasteShareHashKey: 'cut-paste-share',
            lang: 'txt',

            currentCutPaste: {
                id: -1,
                content: '',
                curInputContent: '',
                curFormatContent: '',
                preInputContent: '',
                preFormatContent: '',
                inputContentSaveTime: '',
                createTimeFormat: '',
                type: '',
            }
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
        mouseEnter: function(event, title){
            tl_rtc_app_comm.mouseEnterTips({
                id: event.target.id,
                text: title,
                position: 'bottom'
            });
        },
        mouseLeave: function(){
            tl_rtc_app_comm.mouseLeaveTips();
        },
        /**
         * 回退
         */
        goBack: function(){
            this.emitSubModuleEvent({
                event: 'sub-module-core-change-module-show',
                data: {
                    showRightModule: false,
                }
            })
        },
        /**
         * 分享剪贴板
         */
        shareCutPaste: function(){
            let that = this
            layer.open({
                type: 1,
                title: '分享剪贴板',
                closeBtn: 0,
                skin: 'tl-rtc-app-layer-cut-paste-share',
                content: `
                    <div>
                        <div id="tl-rtc-app-cut-paste-share-image"></div>
                        <div class="tl-rtc-app-cut-paste-share-tools">
                            <div class="tl-rtc-app-cut-paste-share-tools-item" id="copyCutPasteShareLink">复制链接</div>
                            <div class="tl-rtc-app-cut-paste-share-tools-item" id="saveCutPasteShareImage">保存图片</div>
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

                    let content = window.tl_rtc_app_comm.addUrlHashParams({
                        [that.cutPasteShareHashKey]: that.code
                    })

                    if(content.indexOf('#') !== -1){
                        let res = content.split('#')
                        content = res[0] + '/cut-paste.html#' + res[1]
                    }else if(content.indexOf('?') !== -1){
                        let res = content.split('?')
                        content = res[0] + '/cut-paste.html?' + res[1]
                    }else{
                        content = content + '/cut-paste.html'
                    }

                    window.tl_rtc_app_comm.getQrCode(
                        "tl-rtc-app-cut-paste-share-image", content, skinBodyColor, skinBodyBackground
                    )

                    document.getElementById('copyCutPasteShareLink').addEventListener('click', function(){
                        window.tl_rtc_app_comm.copyTxt('copyCutPasteShareLink', content)

                        that.popSuccessMsg('复制成功')

                        layer.close(index)
                    })

                    document.getElementById('saveCutPasteShareImage').addEventListener('click', function(){
                        window.tl_rtc_app_comm.saveQrCode('tl-rtc-app-cut-paste-share-image')

                        layer.close(index)
                    })
                }
            })
        },
        /**
         * 打开剪贴板内容
         */
        openCutPasteContent: async function(data){
            if('title' in data){
                this.title = data.title;
            }
            if('cutPasteId' in data){
                this.cutPasteId = data.cutPasteId;
            }
            if('code'in data){
                this.code = data.code;
            }
            if('status' in data){
                this.status = data.status;
            }

            await this.getCutPasteDetailList()

            data.callback && data.callback()
        },
        /**
         * 获取剪贴板内容详情列表
         */
        getCutPasteDetailList: async function(){
            let that = this
            const params = {
                cutPasteId: this.cutPasteId,
                typeList: [],
            }
            if(!window.tl_rtc_app_comm.checkRequestParams(params)){
                this.popErrorMsg("请求参数非法")
                return
            }
            
            const { data: cutPasteRes } = await this.tlRequest({
                url: '/api/web/cut-paste/get-cut-paste-detail-list',
                method: 'post',
                useCache: false,
                data: params
            })

            if(!cutPasteRes.success){
                this.popErrorMsg(cutPasteRes.msg)
                return
            }

            // 处理时间
            cutPasteRes.data.forEach(item => {
                item.createTimeFormat = window.util.timeAgo(item.createdTime)
            })

            this.cutPasteDetailList = cutPasteRes.data
        },
        /**
         * 保存剪贴板内容
         */
        autoSaveCutPasteContent: async function(){
            // 获取当前输入内容
            const content = this.currentCutPaste.curFormatContent
            if(!content){
                // console.log('内容为空，不保存')
                return
            }

            // 如果内容没有变化，则不保存
            if(this.currentCutPaste.preFormatContent === content){
                // console.log('内容没有变化，不保存')
                return
            }

            if(content && content.length > this.maxInputContentLength){
                this.popErrorMsg("内容超出限制")
                return
            }

            let params = {
                cutPasteId: this.cutPasteId,
            }
            if(!window.tl_rtc_app_comm.checkRequestParams(params)){
                this.popErrorMsg("请求参数非法")
                return
            }
            params.content = content

            const { data: cutPasteRes } = await this.tlRequest({
                url: '/api/web/cut-paste/add-cut-paste-detail',
                method: 'post',
                useCache: false,
                data: params
            })

            if(!cutPasteRes.success){
                this.popErrorMsg(cutPasteRes.msg)
                return
            }

            // 更新
            let newData = cutPasteRes.data
            newData.createTimeFormat = window.util.timeAgo(newData.createdTime)
            this.cutPasteDetailList.unshift(newData)
            
            // 保存成功后，更新preInputContent
            this.currentCutPaste.preInputContent = content
            this.currentCutPaste.preFormatContent = this.currentCutPaste.curFormatContent
            this.currentCutPaste.inputContentSaveTime = new Date().toLocaleString()
        },
        /**
         * 删除剪贴板内容
         * @param {*} item
         */
        deleteCutPasteContent: async function(item, event){
            event.stopPropagation()

            let acceptOrReject = await new Promise(resolve => {
                layer.confirm('确认删除当前内容吗?', {
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

            const params = {
                cutPasteDetailId: item.id
            }
            if(!window.tl_rtc_app_comm.checkRequestParams(params)){
                this.popErrorMsg("请求参数非法")
                return
            }

            const { data: cutPasteRes } = await this.tlRequest({
                url: '/api/web/cut-paste/delete-cut-paste-detail',
                method: 'post',
                useCache: false,
                data: params
            })

            if(!cutPasteRes.success){
                this.popErrorMsg(cutPasteRes.msg)
                return
            }

            this.cutPasteDetailList = this.cutPasteDetailList.filter(i => i.id !== item.id)

            this.popSuccessMsg(cutPasteRes.msg)
        },
        /**
         * 开启剪贴板
         */
        openCutPaste: async function(){
            const params = {
                cutPasteId: this.cutPasteId
            }
            if(!window.tl_rtc_app_comm.checkRequestParams(params)){
                this.popErrorMsg("请求参数非法")
                return
            }

            const { data: cutPasteRes } = await this.tlRequest({
                url: '/api/web/cut-paste/open-cut-paste',
                method: 'post',
                useCache: false,
                data: params
            })

            if(!cutPasteRes.success){
                this.popErrorMsg(cutPasteRes.msg)
                return
            }

            // 更新状态
            this.status = '使用中'

            this.popSuccessMsg(cutPasteRes.msg)
        },
        /**
         * 关闭剪贴板
         */
        closeCutPaste: async function(){
            let acceptOrReject = await new Promise(resolve => {
                layer.confirm('关闭后，他人将无法看到剪贴板内容', {
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

            const params = {
                cutPasteId: this.cutPasteId
            }
            if(!window.tl_rtc_app_comm.checkRequestParams(params)){
                this.popErrorMsg("请求参数非法")
                return
            }

            const { data: cutPasteRes } = await this.tlRequest({
                url: '/api/web/cut-paste/close-cut-paste',
                method: 'post',
                useCache: false,
                data: params
            })

            if(!cutPasteRes.success){
                this.popErrorMsg(cutPasteRes.msg)
                return
            }

            // 更新状态
            this.status = '已关闭'

            this.popSuccessMsg(cutPasteRes.msg)
        },
        /**
         * 复制内容
         * @param {*} item
         */
        copyCutPasteContent: function(item){
            let that = this;
            window.tl_rtc_app_comm.copyTxt('cut-paste-content-history-' + item.id, item.content, function(){
                that.popSuccessMsg('复制成功')
            })
        },
        /**
         * 初始化代码高亮
         * @param {*} content 
         * @returns 
         */
        initHighlightContent: function(content){
            if (typeof hljs.getLanguage(this.lang) === "undefined") {
                return content
            }

            let transferContent = hljs.highlight(content, { language: this.lang }).value;
            return '<pre><code class="hljs ' + this.lang + '">' + transferContent + '</code></pre>'
        },
        /**
         * 编辑内容
         * @param {*} event
         */
        cutPastePreChange(event) {
            // 直接获取当前光标位置
            const selection = window.getSelection();
            const range = selection.getRangeAt(0);
            const offset = range.startOffset;
            const node = range.startContainer;

            // 更新内容
            this.currentCutPaste.curInputContent = event.target.innerText;
            this.currentCutPaste.curFormatContent = this.currentCutPaste.curInputContent;

            // 在下一个 tick 恢复光标位置
            this.$nextTick(() => {
                try {
                    const newRange = document.createRange();
                    newRange.setStart(node, offset);
                    newRange.setEnd(node, offset);
                    selection.removeAllRanges();
                    selection.addRange(newRange);
                } catch(e) {
                    console.warn('Failed to restore cursor position:', e);
                }
            });
        },
        /**
         * 设置剪贴板密码
         */
        setCutPastePassword: async function(){
            let that = this
            layer.prompt({
                formType: 0,
                title: "设置剪贴板密码",
                btn : ['确定', '取消'],
                value: "",
                shadeClose : true,
                skin: 'layui-layer-prompt tl-rtc-app-layer-cut-paste-set-password',
                maxlength : 15,
            }, async function (value, index, elem) {
                value = value.trim()
            
                if(value.length > 20){
                    that.popWarningMsg("密码长度不能超过20位")
                    return false;
                }

                const params = {
                    cutPasteId: that.cutPasteId,
                    password: value
                }
                if(!window.tl_rtc_app_comm.checkRequestParams(params)){
                    that.popErrorMsg("请求参数非法")
                    return
                }
                const { data: updateRes } = await that.tlRequest({
                    url: '/api/web/cut-paste/update-cut-paste-password',
                    method: 'post',
                    useCache: false,
                    data: params,
                })
                if(!updateRes.success){
                    that.popErrorMsg(updateRes.msg)
                    layer.close(index)
                    return
                }
    
                that.popSuccessMsg(updateRes.msg)

                layer.close(index)

                return false
            });
        },
        // 添加光标位置保存和恢复方法
        saveCaretPosition(element) {
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                return selection.getRangeAt(0);
            }
            return null;
        },
        // 
        restoreCaretPosition(element, range) {
            if (range) {
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
            }
        },
    },
    mounted: async function() {
        let that = this
        
        // 定时，每隔5秒保存一次输入内容
        setInterval(async () => {
            if(that.propsLeftModule !== 'cut_paste' || that.propsRightModule !== 'content'){
                return
            }
            await this.autoSaveCutPasteContent()
        }, 1000 * 5);
    },
    created(){
        // 监听打开剪贴板内容
        window.subModule.$on('sub-module-cut-paste-content-open', this.openCutPasteContent);
    },
    template: `
        <div class="tl-rtc-app-right-cut-paste-content">
            <div class="tl-rtc-app-right-cut-paste-content-top">
                <svg class="icon goBack" aria-hidden="true" @click="goBack" style='top: 17px;left: 17px;' v-show='propsIsMobile'>
                    <use xlink:href="#tl-rtc-app-icon-xiangzuo1"></use>
                </svg>
                <div class="tl-rtc-app-right-cut-paste-content-top-title">
                    {{title}}
                </div>
                <div class="tl-rtc-app-right-cut-paste-content-top-tool">
                    <div class="tl-rtc-app-right-cut-paste-content-top-tool-item" 
                        id="cut-paste-password-type-pool"
                        @mouseenter="mouseEnter(event, '设置密码')"
                        @mouseleave="mouseLeave"
                        @click="setCutPastePassword"
                    >
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#tl-rtc-app-icon-mima"></use>
                        </svg>
                    </div>

                    <div class="tl-rtc-app-right-cut-paste-content-top-tool-item" 
                        id="cut-paste-share-type-pool"
                        @mouseenter="mouseEnter(event, '分享')"
                        @mouseleave="mouseLeave"
                        @click="shareCutPaste()"
                    >
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#tl-rtc-app-icon-fenxiang"></use>
                        </svg>
                    </div>

                    <div class="tl-rtc-app-right-cut-paste-content-top-tool-item" 
                        id="cut-paste-history-type-pool"
                        @mouseenter="mouseEnter(event, '历史记录')"
                        @mouseleave="mouseLeave"
                        v-show="showMode === 'textarea'"
                        @click="showMode = 'histroy'"
                    >
                        <svg class="icon" aria-hidden="true" style="scale: 1.2">
                            <use xlink:href="#tl-rtc-app-icon-zuijinliulan"></use>
                        </svg>
                    </div>

                    <div class="tl-rtc-app-right-cut-paste-content-top-tool-item" 
                        id="cut-paste-textarea-type-pool"
                        @mouseenter="mouseEnter(event, '粘贴内容')"
                        @mouseleave="mouseLeave"
                        v-show="showMode === 'histroy'"
                        @click="showMode = 'textarea'"
                    >
                        <svg class="icon" aria-hidden="true" style="scale: 1.2">
                            <use xlink:href="#tl-rtc-app-icon-shuru"></use>
                        </svg>
                    </div>

                    <div class="tl-rtc-app-right-cut-paste-content-top-tool-item" 
                        id="cut-paste-close-type-pool"
                        @mouseenter="mouseEnter(event, '点击关闭')"
                        @mouseleave="mouseLeave"
                        v-show="status === '使用中'"
                        @click="closeCutPaste"
                    >
                        <svg class="icon" aria-hidden="true" style="scale: 1.2;fill:red;">
                            <use xlink:href="#tl-rtc-app-icon-guanbi"></use>
                        </svg>
                    </div>

                    <div class="tl-rtc-app-right-cut-paste-content-top-tool-item" 
                        id="cut-paste-open-type-pool"
                        @mouseenter="mouseEnter(event, '点击开启')"
                        @mouseleave="mouseLeave"
                        v-show="status === '已关闭'"
                        @click="openCutPaste"
                    >
                        <svg class="icon" aria-hidden="true" style="scale: 1.1">
                            <use xlink:href="#tl-rtc-app-icon-kaishi1"></use>
                        </svg>
                    </div>
                    
                </div>
            </div>
            <div class="tl-rtc-app-right-cut-paste-content-body" v-show="showMode === 'textarea'">
                <div class="tl-rtc-app-right-cut-paste-content-title">
                    <div class="tl-rtc-app-right-cut-paste-content-limit">
                        {{currentCutPaste.curFormatContent?.length}} / {{maxInputContentLength}}
                    </div>
                    <div class="tl-rtc-app-right-cut-paste-content-time" v-show="currentCutPaste.inputContentSaveTime">
                        {{currentCutPaste.inputContentSaveTime}} 已自动保存 
                        <svg class="icon" aria-hidden="true" style="fill:#4de04d">
                            <use xlink:href="#tl-rtc-app-icon-70chenggong"></use>
                        </svg>
                    </div>
                </div>

                <pre class="tl-rtc-app-right-cut-paste-content-body-textarea tool-code hljs html" 
                    @input="cutPastePreChange" 
                    contenteditable="true"
                    ref="editor">
                
                </pre>

            </div>

            <div class="tl-rtc-app-right-cut-paste-content-body" v-show="showMode === 'histroy'">
                <div v-show="cutPasteDetailList.length === 0" class="tl-rtc-app-right-cut-paste-content-body-no-history">
                    暂无记录
                </div>
                <div v-for="(item, index) in cutPasteDetailList" 
                    v-show="cutPasteDetailList.length > 0"
                    class="tl-rtc-app-right-cut-paste-content-body-textarea-view" 
                    :id="'cut-paste-content-history-' + item.id"
                    @click="copyCutPasteContent(item)"
                >
                    <div class="tl-rtc-app-right-cut-paste-content-body-time">
                        {{item.createTimeFormat}}
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#tl-rtc-app-icon-leixing"></use>
                        </svg><small>: {{item.type}}</small>
                    </div>
                    
                    <div class="tl-rtc-app-right-cut-paste-content-body-title">
                        <div class="tl-rtc-app-right-cut-paste-content-body-info">
                            <small>{{item.content.length}}个字符</small>
                        </div>
                        <div class="tl-rtc-app-right-cut-paste-content-body-tools">
                            <svg class="icon" aria-hidden="true" style="fill:#744343;" @click="deleteCutPasteContent(item, $event)">
                                <use xlink:href="#tl-rtc-app-icon-huishouzhan"></use>
                            </svg>
                        </div>
                    </div>
                    <div class="tl-rtc-app-right-cut-paste-content-body-detail" v-html="initHighlightContent(item.content)"></div>
                </div>
                
            </div>
        </div>
    `,
}

window.tl_rtc_app_module_cut_paste_content = tl_rtc_app_module_cut_paste_content