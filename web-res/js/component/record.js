const tl_rtc_app_record = new Vue({
    el: '#tl-rtc-app-record',
    data: function () {
        return {
            stream: null, //录制流
            chunks: [], //录制数据
            mediaRecorder: null, //录制对象
            recording: null, //录制文件
            times: 0,   //录制时间
            intervalId: 0, //计时器id
            size: 0, //录制文件大小
            isRecording : false, //是否正在录制
        }
    },
    watch: {
        isRecording: function (val, oldVal) {
            
        }
    },
    methods: {
        /**
         * 获取录制流
         * @returns 
         */
        getMediaPlay: function () {
            if (navigator.getDisplayMedia) {
                return navigator.getDisplayMedia({ video: true, audio: true });
            } else if (navigator.mediaDevices.getDisplayMedia) {
                return navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
            } else if (navigator.mediaDevices.getUserMedia) {
                return navigator.mediaDevices.getUserMedia({ video: { mediaSource: 'screen' }, audio: true });
            } else {
                return navigator.getUserMedia({
                    video: { 'mandatory': { 'chromeMediaSource': 'desktop' } },
                    audio: true
                })
            }
        },
        /**
         * 开始录制
         * @param {*} callback
         * @returns 
         */
        startRecord: async function ({
            callback
        }) {
            if (this.isRecording) {
                this.popWarningMsg("正在录制中")
                callback && callback(false)
                return;
            }

            let that = this;
            if (this.recording) {
                window.URL.revokeObjectURL(this.recording);
            }

            this.chunks = [];
            this.recording = null;

            try {
                this.stream = await this.getMediaPlay();
            } catch (error) {
                console.log(error)
                this.isRecording = false
            }

            if (this.stream == null) {
                this.isRecording = false
                this.popErrorMsg("获取设备录制权限失败")
                callback && callback(false)
                return;
            }

            this.stream.getVideoTracks()[0].onended = () => {
                that.stopRecord({
                    callback
                })
            }

            this.mediaRecorder = new MediaRecorder(this.stream, { mimeType: 'video/webm' });
            this.mediaRecorder.addEventListener('dataavailable', event => {
                if (event.data && event.data.size > 0) {
                    that.size += event.data.size
                    that.chunks.push(event.data);
                }
            });
            this.mediaRecorder.start(10);

            //计算时间
            this.intervalId = setInterval(() => {
                that.times += 1;
                const timeDom = document.getElementById('tl-rtc-app-record-time')
                if(timeDom){
                    timeDom.innerText = "停止录制 （ " + that.times + "秒 ）"
                }
            }, 1000);

            // 创建上方停止录制按钮
            const stopRecordDiv = document.createElement('div')
            stopRecordDiv.id = 'tl-rtc-app-record-stop-div'
            stopRecordDiv.className = 'tl-rtc-app-record-stop-div'
            stopRecordDiv.innerHTML = `
                <div class="layui-btn layui-btn-sm layui-btn-danger tl-rtc-app-record-stop-body">
                    <svg class="icon layui-anim tl-rtc-app-record-stop-svg layui-anim-loop " aria-hidden="true" id="tl-rtc-app-record-stop-svg">
                        <use xlink:href="#tl-rtc-app-icon-luzhi"></use>
                    </svg>
                    <span id="tl-rtc-app-record-time">停止录制 （ 0秒 ）</span>
                </div>
            `
            stopRecordDiv.addEventListener('click', () => {
                this.stopRecord({})
            })
            document.body.appendChild(stopRecordDiv)

            this.popSuccessMsg("屏幕录制中...")
            this.isRecording = true
            
            callback && callback(true)
            return;
        },
        /**
         * 停止录制
         * @param {*} callback
         * @returns 
         */
        stopRecord: function ({
            callback = null
        }) {
            if (!this.isRecording) {
                this.popWarningMsg("未开始录制")
                callback && callback(false)
                return;
            }

            let hasErr = false;

            try {
                this.mediaRecorder.stop();
            } catch (e) {
                this.popWarningMsg("屏幕录制完毕! 检测到录制不完整")
                hasErr = true
            }

            this.stream.getTracks().forEach(track => track.stop());
            this.recording = window.URL.createObjectURL(new Blob(this.chunks, { type: 'video/webm' }));

            clearInterval(this.intervalId);

            const downloadLink = document.createElement('a');
            downloadLink.download = "screen_record_" + new Date().getTime() + ".webm";
            downloadLink.href = this.recording;
            downloadLink.style.display = 'none';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);

            if (!hasErr) {
                let msg = "录制完成，共" + this.times + "秒" + "，大小约" + window.tl_rtc_app_comm.getFileSize(this.size)
                this.popSuccessMsg(msg)
            }

            this.mediaRecorder = null;
            this.chunks = [];
            this.stream = null;
            this.times = 0;
            this.size = 0;
            this.isRecording = false;

            const stopRecordDiv = document.getElementById('tl-rtc-app-record-stop-div')
            if(stopRecordDiv){
                stopRecordDiv.remove()
            }

            callback && callback(true)
            return;
        },
    },
    mounted: function () {
        
    },
    created(){
        // 开始录制
        window.subModule.$on("component-record-start", this.startRecord);

        // 停止录制
        window.subModule.$on("component-record-stop", this.stopRecord);
    }
})