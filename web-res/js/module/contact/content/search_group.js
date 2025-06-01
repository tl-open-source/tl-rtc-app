const tl_rtc_app_module_contact_content_search_group = {
    props: {
        groupSearchData: {
            type: Object,
            default: {
                channelId: '', // 频道id
                channelName: '', // 频道名称
                channelAvatar: '', // 频道头像
                companyName: '', // 频道公司名称
                isChannelUser: false, // 是否是频道用户
                channelUserCount: 0, // 频道用户数
                shareUserId: '', // 分享用户id
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
        propsGroupSearchData(){
            return this.groupSearchData;
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
            this.$emit('send-message', this.propsGroupSearchData)
        },
        /**
         * 发起视频
         */
        sendVideo: function(){
            this.$emit('send-video', this.propsGroupSearchData)
        },
        /**
         * 发起语音
         */
        sendAudio: function(){
            this.$emit('send-audio', this.propsGroupSearchData)
        },
        /**
         * 申请加入群聊
         */
        addUserGroup: function(){
            this.$emit('add-user-group', this.propsGroupSearchData)
        }
    },
    mounted() {

    },
    template: `
        <div class="tl-rtc-app-right-contact-content-group">
            <div class="tl-rtc-app-right-contact-content-top">
                <div class="tl-rtc-app-right-contact-content-top-title">
                    搜索群聊信息
                </div>
            </div>
            <div class="tl-rtc-app-right-contact-content-info">
                <div class="tl-rtc-app-right-contact-content-info-avatar">
                    <img :src="propsGroupSearchData.channelAvatar" alt="">
                </div>
                <div class="tl-rtc-app-right-contact-content-info-more">
                    <div class="tl-rtc-app-right-contact-content-info-more-item">
                        <b>{{ propsGroupSearchData.channelName }}</b>
                    </div>
                    <div class="tl-rtc-app-right-contact-content-info-more-item" style="font-size: 12px;">
                        {{ propsGroupSearchData.companyName }}
                    </div>
                </div>
            </div>
            <div class="tl-rtc-app-right-contact-content-other">
                <div class="tl-rtc-app-right-contact-content-other-item"> 
                    <span>群号: </span>
                    <span class="tl-rtc-app-right-contact-content-other-item-value">
                        {{ propsGroupSearchData.channelId }}
                    </span>
                </div>
                <div class="tl-rtc-app-right-contact-content-other-item"> 
                    <span>群成员: </span>
                    <span class="tl-rtc-app-right-contact-content-other-item-value">
                        {{ propsGroupSearchData.channelUserCount }}（人）
                    </span>
                </div>
            <div class="tl-rtc-app-right-contact-content-tool" v-if="propsGroupSearchData.isChannelUser">
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
            <div class="tl-rtc-app-right-contact-content-tool-btn" v-else>
                <button class="layui-btn" @click="addUserGroup"> 
                    <b>加入群聊</b>
                </button>
            </div>
        </div>
    `
}

window.tl_rtc_app_module_contact_content_search_group = tl_rtc_app_module_contact_content_search_group