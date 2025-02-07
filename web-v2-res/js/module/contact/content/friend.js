const tl_rtc_app_module_contact_content_friend = {
    props: {
        friendUserData: {
            type: Object,
            default: {
                id: '', // 好友记录id
                userId: '', // 用户id
                username: '', // 用户账号
                userAvatar: '', // 用户头像
                userMobile: '', // 用户手机号
                userEmail: '', // 用户邮箱
                userCompanyName: '', // 用户所属企业名称
                origin: '', // 来源
                createTime: '', // 创建时间
                createTimeFormat: '', // 创建时间格式化
                channelId: '', // 好友频道id
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
        propsFriendUserData(){
            return this.friendUserData;
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
         * 发送信息
         */
        sendMessage: function(){
            this.$emit('send-message', this.propsFriendUserData)
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
        <div class="tl-rtc-app-right-contact-content-friend">
            <div class="tl-rtc-app-right-contact-content-top">
                <div class="tl-rtc-app-right-contact-content-top-title">
                    通讯好友信息
                </div>
            </div>
            <div class="tl-rtc-app-right-contact-content-info">
                <div class="tl-rtc-app-right-contact-content-info-avatar">
                    <img :src="propsFriendUserData.userAvatar" alt="">
                </div>
                <div class="tl-rtc-app-right-contact-content-info-more">
                    <div class="tl-rtc-app-right-contact-content-info-more-item">
                        <b>{{ propsFriendUserData.username }}</b>
                    </div>
                    <div class="tl-rtc-app-right-contact-content-info-more-item" style="font-size: 12px;">
                        {{ propsFriendUserData.userCompanyName }}
                    </div>
                </div>
            </div>
            <div class="tl-rtc-app-right-contact-content-other">
                <div class="tl-rtc-app-right-contact-content-other-item">
                    <span>手机: </span>
                    <span class="tl-rtc-app-right-contact-content-other-item-value">
                        {{ propsFriendUserData.userMobile || '-' }}
                    </span>
                </div>
                <div class="tl-rtc-app-right-contact-content-other-item">
                    <span>邮箱: </span>
                    <span class="tl-rtc-app-right-contact-content-other-item-value">
                        {{ propsFriendUserData.userEmail || '-' }}
                    </span>
                </div>
                <div class="tl-rtc-app-right-contact-content-other-item">
                    <span>来源: </span>
                    <span class="layui-badge layui-bg-blue tl-rtc-app-right-contact-content-other-item-value tl-rtc-app-right-contact-content-other-item-value-badge">
                        {{ propsFriendUserData.origin || '-' }}
                    </span>
                </div>
                <div class="tl-rtc-app-right-contact-content-other-item">
                    <span>验证消息: </span>
                    <span class="tl-rtc-app-right-contact-content-other-item-value">
                        {{ propsFriendUserData.remark || '-' }}
                    </span>
                </div>
                <div class="tl-rtc-app-right-contact-content-other-item">
                    <span>添加时间: </span>
                    <span class="tl-rtc-app-right-contact-content-other-item-value">
                        {{ propsFriendUserData.createTimeFormat || '-' }}
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
            </div>
        </div>
    `
}

window.tl_rtc_app_module_contact_content_friend = tl_rtc_app_module_contact_content_friend