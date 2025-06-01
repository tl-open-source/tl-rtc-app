const tl_rtc_app_module_contact_content_group = {
    props: {
        groupData: {
            type: Object,
            default: {
                channelId: '', // 频道id
                channelName: '', // 频道名称
                channelAvatar: '', // 频道头像
                channelCompanyName: '', // 频道公司名称
                createTime: '', // 创建时间
                createTimeFormat: '', // 创建时间格式化
                joinTime: '', // 加入时间
                joinTimeFormat: '', // 加入时间格式化
                status: '', // 状态,
                channelUserCount: 0, // 频道用户数
            }
        },
        isMobile: {
            type: Boolean,
            default: false
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
        propsGroupData(){
            return this.groupData;
        },
        propsIsMobile(){
            return this.isMobile;
        },
        propsLeftModule() {
            return this.leftModule;
        },
        propsRightModule() {
            return this.rightModule;
        },
    },
    data : function(){
        return {
            
        }
    },
    watch: {
        leftModule: function (val) {
            
        },
        rightModule: function (val) {
            
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
         * 发送信息
         */
        sendMessage: function(){
            this.$emit('send-message', this.propsGroupData)
        },
        /**
         * 发起视频
         */
        sendVideo: function(){
            this.$emit('send-video', this.propsGroupData)
        },
        /**
         * 发起语音
         */
        sendAudio: function(){
            this.$emit('send-audio', this.propsGroupData)
        },
    },
    mounted() {

    },
    template: `
        <div class="tl-rtc-app-right-contact-content-group">
            <div class="tl-rtc-app-right-contact-content-top">
                <div class="tl-rtc-app-right-contact-content-top-title">
                    群组信息
                </div>
            </div>
            <div class="tl-rtc-app-right-contact-content-info">
                <div class="tl-rtc-app-right-contact-content-info-avatar">
                    <img :src="propsGroupData.channelAvatar" alt="">
                </div>
                <div class="tl-rtc-app-right-contact-content-info-more">
                    <div class="tl-rtc-app-right-contact-content-info-more-item">
                        <b>{{ propsGroupData.channelName }}</b>
                    </div>
                    <div class="tl-rtc-app-right-contact-content-info-more-item" style="font-size: 12px;">
                        {{ propsGroupData.channelCompanyName }}
                    </div>
                </div>
            </div>
            <div class="tl-rtc-app-right-contact-content-other">
                <div class="tl-rtc-app-right-contact-content-other-item"> 
                    <span>群号: </span>
                    <span class="tl-rtc-app-right-contact-content-other-item-value">
                        {{ propsGroupData.channelId }}
                    </span>
                </div>
                <div class="tl-rtc-app-right-contact-content-other-item"> 
                    <span>群成员: </span>
                    <span class="tl-rtc-app-right-contact-content-other-item-value">
                        {{ propsGroupData.channelUserCount }}（人）
                    </span>
                </div>
                <div class="tl-rtc-app-right-contact-content-other-item"> 
                    <span>当前状态: </span>
                    <span class="layui-badge layui-bg-blue tl-rtc-app-right-contact-content-other-item-value tl-rtc-app-right-contact-content-other-item-value-badge">
                        {{ propsGroupData.status }}
                    </span>
                </div>
                <div class="tl-rtc-app-right-contact-content-other-item"> 
                    <span>创建时间: </span>
                    <span class="tl-rtc-app-right-contact-content-other-item-value">
                        {{ propsGroupData.createTimeFormat }}
                    </span>
                </div>
                <div class="tl-rtc-app-right-contact-content-other-item"> 
                    <span>加入时间: </span>
                    <span class="tl-rtc-app-right-contact-content-other-item-value">
                        {{ propsGroupData.joinTimeFormat }}
                    </span>
                </div>
            </div>
            <div class="tl-rtc-app-right-contact-content-tool">
                <div class="tl-rtc-app-right-contact-content-tool-item" @click="sendMessage">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#tl-rtc-app-icon-xiaoxi"></use>
                    </svg>
                    <div>发送信息</div>
                </div>
                <div class="tl-rtc-app-right-contact-content-tool-item" @click="sendVideo">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#tl-rtc-app-icon-shexiangtou"></use>
                    </svg>
                    <div>发起视频</div>
                </div>
                <div class="tl-rtc-app-right-contact-content-tool-item" @click="sendAudio">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#tl-rtc-app-icon-31dianhua"></use>
                    </svg>
                    <div>发起语音</div>
                </div>
            </div>
        </div>
    `
}

window.tl_rtc_app_module_contact_content_group = tl_rtc_app_module_contact_content_group