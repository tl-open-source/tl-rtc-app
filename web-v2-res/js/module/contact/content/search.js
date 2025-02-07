const tl_rtc_app_module_contact_content_search = {
    props: {
        searchUserData: {
            type: Object,
            default: {
                channelId: '', // 频道id
                userId: '', // 用户id
                username: '', // 用户账号
                userAvatar: '', // 用户头像
                userMobile: '', // 用户手机号
                userEmail: '', // 用户邮箱
                userCompanyName: '', // 用户所属企业名称
                createTime: '', // 创建时间
                createTimeFormat: '', // 创建时间格式化
                isFriend: '', // 是否是好友
                isSelf: '', // 是否是自己
                remark: '', // 申请消息
                friendType: '', // 好友类型
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
        propsSearchUserData(){
            return this.searchUserData;
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
         * 添加好友
         */
        addUserFriend: function(){
            this.$emit('add-user-friend')
        },
        /**
         * 发送信息
         */
        sendMessage: function(){
            this.$emit('send-message', this.propsSearchUserData)
        },
        /**
         * 鼠标移入
         * @param {*} event 
         * @returns 
         */
        mouseEnter: function(event, title){
            if(this.propsIsMobile){
                return
            }
            tl_rtc_app_comm.mouseEnterTips({
                id: event.target.id,
                text: title,
                position: 'top'
            });
        },
        mouseLeave: function(){
            if(this.propsIsMobile){
                return
            }
            tl_rtc_app_comm.mouseLeaveTips();
        }
    },
    mounted() {

    },
    template: `
        <div class="tl-rtc-app-right-contact-content-search">
            <div class="tl-rtc-app-right-contact-content-top">
                <div class="tl-rtc-app-right-contact-content-top-title">
                    搜索用户信息
                </div>
            </div>
            <div class="tl-rtc-app-right-contact-content-info">
                <div class="tl-rtc-app-right-contact-content-info-avatar">
                    <img :src="propsSearchUserData.userAvatar" alt="">
                </div>
                <div class="tl-rtc-app-right-contact-content-info-more">
                    <div class="tl-rtc-app-right-contact-content-info-more-item">
                        <b>{{ propsSearchUserData.username }}</b> <span v-if="propsSearchUserData.isSelf">（我）</span>
                    </div>
                    <div class="tl-rtc-app-right-contact-content-info-more-item">
                        {{ propsSearchUserData.userCompanyName }}
                    </div>
                </div>
            </div>
            <div class="tl-rtc-app-right-contact-content-other">
                <div class="tl-rtc-app-right-contact-content-other-item">
                    手机: {{ propsSearchUserData.userMobile || '-' }}
                </div>
                <div class="tl-rtc-app-right-contact-content-other-item">
                    邮箱: {{ propsSearchUserData.userEmail || '-'}}
                </div>
            </div>
            <div class="tl-rtc-app-right-contact-content-tool" v-if="propsSearchUserData.isFriend && !propsSearchUserData.isSelf">
                <div class="tl-rtc-app-right-contact-content-tool-item">
                    <svg class="icon" aria-hidden="true" @click="sendMessage">
                        <use xlink:href="#tl-rtc-app-icon-xiaoxi"></use>
                    </svg>
                    <div>发送信息</div>
                </div>
            </div>
            <div class="tl-rtc-app-right-contact-content-tool-btn" v-else-if="!propsSearchUserData.isSelf">
                <button class="layui-btn" @click="addUserFriend"> 
                    <b>添加好友</b>
                </button>
            </div>
        </div>
    `
}

window.tl_rtc_app_module_contact_content_search = tl_rtc_app_module_contact_content_search