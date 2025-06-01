const tl_rtc_app_file = new Vue({
    el: '#tl-rtc-app-file',
    data : function(){
        return {
            isLoaded : false,
            chooseFileList: [],
            uploadIconIndex: null,
            shadeIdList: [],
            excludeModule: [
                {
                    leftModule: 'p2p_channel',
                    rightModule: ['content', 'blank']
                },
                {
                    leftModule: 'setting',
                    rightModule: ['content', 'blank']
                },
                {
                    leftModule: 'contact',
                    rightModule: ['content', 'blank']
                }
            ],
        }
    },
    computed: {

    },
    methods: {
        /**
         * 选择文件
         * @param {*} event 
         * @param {*} chooseFileCallback 
         * @returns 
         */
        dragDrop: function(event, chooseFileCallback){
            event.preventDefault();

            this.emitSubModuleEvent({
                event: 'component-shade-destroy',
                data: {
                    id: 'fileUploadShade'
                }
            })

            if (event.dataTransfer.items) {
                for (let i = 0; i < event.dataTransfer.items.length; i++) {
                    if (event.dataTransfer.items[i].kind === "file") {
                        let file = event.dataTransfer.items[i].getAsFile();
                        file['fileId'] = tl_rtc_app_comm.randomId()
                        this.chooseFileList.push(file)
                        chooseFileCallback && chooseFileCallback({
                            fileList: this.chooseFileList, 
                            file
                        })
                    }
                }
            } else {
                for (let i = 0; i < event.dataTransfer.files.length; i++) {
                    let file = event.dataTransfer.files[i]
                    this.chooseFileList.push(file)
                    chooseFileCallback && chooseFileCallback({
                        fileList: this.chooseFileList, 
                        file
                    })
                }
            }
        },
        /**
         * 拖拽文件
         * @param {*} event 
         * @returns 
         */
        dragOver: function(event){
            event.preventDefault();
        },
        /**
         * 拖拽文件
         * @param {*} event 
         * @returns 
         */
        dragLeave: function(event){
            this.emitSubModuleEvent({
                event: 'component-shade-destroy',
                data: {
                    id: 'fileUploadShade'
                }
            })
            event.preventDefault();
        },
        /**
         * 拖拽文件
         * @param {*} event 
         * @param {*} chooseFileCallback 
         * @returns 
         */
        dragEnter: async function(event, chooseFileCallback){
            let that = this

            let { leftModule, rightModule } = await this.emitSubModuleEvent({
                event: 'sub-module-core-get-module',
            })

            let canDrag = this.excludeModule.filter(item => {
                if (item.leftModule === leftModule && item.rightModule.includes(rightModule)) {
                    return false
                }
            })

            if (!canDrag) {
                console.log('can not drag')
                return
            }

            event.preventDefault();

            await this.emitSubModuleEvent({
                event: 'component-shade-show',
                data: {
                    id: 'fileUploadShade',
                    className: 'tl-rtc-app-right-channel-file-shade-content-body',
                    text: '选择文件中，松开后发送',
                    style: {
                        lineHeight: document.documentElement.clientHeight + 'px'
                    },
                    shadeListener: {
                        dragleave: function(event){
                            that.dragLeave(event)
                        },
                        drop: function(event){
                            that.dragDrop(event, chooseFileCallback)
                        },
                        dragover: function(event){
                            that.dragOver(event)
                        }
                    }
                }
            })
        },
        /**
         * 初始化拖拽文件
         * @param {*} className 
         * @param {*} callback
         */
        initDragSelectFile: function ({
            className, chooseFileCallback, callback
        }) {
            let that = this

            document.querySelector("." + className).addEventListener("dragenter", async (event) => {
                await that.dragEnter(event, chooseFileCallback)
            })

            callback && callback()
        },
        /**
         * 销毁拖拽文件
         * @param {*} callback
         */
        destroyDragSelectFile: function ({
            callback
        }) {
            this.isLoaded = false
            this.chooseFileList = []

            callback && callback()
        },
        /**
         * 有文件正在上传时，展示文件上传icon，点击展示文件列表上传进度
         */
        showFileUploadIcon: function({
            callback
        }){
            let that = this
            if (this.uploadIconIndex) {
                this.updateUploadIcon({})

                callback && callback(false)
                return
            }
            this.uploadIconIndex = layer.open({
                type: 1,
                title: `
                    <svg class="icon" aria-hidden="true" style="width:26px;height:26px;fill: #54a450;">
                        <use xlink:href="#tl-rtc-app-icon-shangchuan"></use>
                    </svg>
                `,
                closeBtn: 0,
                shade: 0,
                resize: false,
                area: ['80px', '80px'],
                content: `
                    <div class="tl-rtc-app-right-channel-file-upload-icon" id="tl-rtc-app-upload-file-icon">
                        <div class="tl-rtc-app-right-channel-file-upload-icon-body">
                            <div class="tl-rtc-app-right-channel-file-upload-icon-body-wait">
                                <svg class="icon layui-anim layui-anim-rotate layui-anim-loop" aria-hidden="true">
                                    <use xlink:href="#tl-rtc-app-icon-chulizhong"></use>
                                </svg>
                                <div id="tl-rtc-app-upload-icon-total-value">总共${this.chooseFileList.length}</div>
                            </div>
                            <div class="tl-rtc-app-right-channel-file-upload-icon-body-done">
                                <svg class="icon" aria-hidden="true">
                                    <use xlink:href="#tl-rtc-app-icon-wancheng"></use>
                                </svg>
                                <div id="tl-rtc-app-upload-icon-done-value">完成${
                                    this.chooseFileList.filter(item => item.uploadStatus === 'done').length
                                }</div>
                            </div>
                        </div>
                    </div>
                `,
                success: function(layero, index){
                    layero.css({
                        "border-radius": "6px",
                    })
                    layero.find('.layui-layer-title').css("padding", "0px")
                    layero.find('.layui-layer-title').css("text-align", "center")
                    layero.find('.layui-layer-title').css("height", "30px")
                    layero.find('.layui-layer-title').css("line-height", "40px")

                    document.getElementById('tl-rtc-app-upload-file-icon').addEventListener('click', async function(){
                        let acceptOrReject = await new Promise(resolve => {
                            layer.confirm('是否关闭进度弹窗', {
                                shadeClose: 1
                            }, function (index) {
                                layer.close(index)
                                resolve(true)
                            }, function (index) {
                                resolve(false)
                            });
                        })
            
                        if(!acceptOrReject){
                            return
                        }

                        that.emitSubModuleEvent({
                            event: 'component-file-close-upload-icon'
                        })
                    })
                }
            })

            callback && callback(true)
        },
        /**
         * 更新上传进度
         * @param {*} callback
         */
        updateUploadIcon: function({
            callback
        }){
            const doneCount = this.chooseFileList.filter(item => item.uploadStatus === 'done').length

            if(document.getElementById('tl-rtc-app-upload-icon-total-value')){
                document.getElementById('tl-rtc-app-upload-icon-total-value').innerText = `总共${this.chooseFileList.length}`
            }

            if(document.getElementById('tl-rtc-app-upload-icon-done-value')){
                document.getElementById('tl-rtc-app-upload-icon-done-value').innerText = `完成${doneCount}`
            }

            callback && callback()
        },
        
        /**
         * 关闭文件上传icon
         * @param {*} callback
         */
        closeFileUploadIcon: function({
            callback
        }){
            if (this.uploadIconIndex) {
                layer.close(this.uploadIconIndex)
                this.uploadIconIndex = 0
            }

            callback && callback()
        },
    },
    mounted() {
        let that = this
    },
    created(){
        // 初始化拖拽文件模块
        window.subModule.$on('component-file-init-drag', this.initDragSelectFile)

        // 销毁拖拽文件模块
        window.subModule.$on('component-file-destroy-drag', this.destroyDragSelectFile)

        // 展示文件上传icon
        window.subModule.$on('component-file-show-upload-icon', this.showFileUploadIcon)

        // 关闭文件上传icon
        window.subModule.$on('component-file-close-upload-icon', this.closeFileUploadIcon)

        // 更新文件上传上传进度
        window.subModule.$on('component-file-update-upload-icon', this.updateUploadIcon)
    }
})

window.tl_rtc_app_file = tl_rtc_app_file;