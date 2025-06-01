const tl_rtc_app_module_contact_content_apply_user = {
    props: {
        applyUserData: {
            type: Object,
            default: {
                id: '', // 好友申请记录id
                userId: '', // 用户id
                origin: '', // 申请来源
                username: '', // 用户账号
                userAvatar: '', // 用户头像
                userMobile: '', // 用户手机号
                userEmail: '', // 用户邮箱
                userCompanyName: '', // 用户所属企业名称
                status: '', // 申请状态
                userApplyRemark: '', // 申请备注
                createTime: '', // 申请时间
                createTimeFormat: '', // 申请时间格式化
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
        propsApplyUserData(){
            return this.applyUserData;
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
            STATUS : {
                WAITING_ME_PASS: '等待我验证',
            },
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
         * 同意添加好友
         */
        passUserFriend: function(){
            this.$emit('pass-user-friend')
        },
        /**
         * 拒绝添加好友
         */
        rejectUserFriend: function(){
            this.$emit('reject-user-friend')
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
        }
    },
    mounted() {

    },
    template: `
        <div class="tl-rtc-app-right-contact-content-apply">
            <div class="tl-rtc-app-right-contact-content-top">
                <div class="tl-rtc-app-right-contact-content-top-title">
                    好友申请信息
                </div>
            </div>
            <div class="tl-rtc-app-right-contact-content-info">
                <div class="tl-rtc-app-right-contact-content-info-avatar">
                    <img :src="propsApplyUserData.userAvatar" alt="">
                </div>
                <div class="tl-rtc-app-right-contact-content-info-more">
                    <div class="tl-rtc-app-right-contact-content-info-more-item">
                        <b>{{ propsApplyUserData.username }}</b>
                    </div>
                    <div class="tl-rtc-app-right-contact-content-info-more-item" style="font-size: 12px;">
                        {{ propsApplyUserData.userCompanyName }}
                    </div>
                </div>
            </div>
            <div class="tl-rtc-app-right-contact-content-other">
                <div class="tl-rtc-app-right-contact-content-other-item"> 
                    <span>验证消息: </span>
                    <span class="tl-rtc-app-right-contact-content-other-item-value">
                        {{ propsApplyUserData.userApplyRemark }}
                    </span>
                </div>
                <div class="tl-rtc-app-right-contact-content-other-item"> 
                    <span>当前状态: </span>
                    <span class="layui-badge layui-bg-blue tl-rtc-app-right-contact-content-other-item-value tl-rtc-app-right-contact-content-other-item-value-badge">
                        {{ propsApplyUserData.status }}
                    </span>
                </div>
                <div class="tl-rtc-app-right-contact-content-other-item"> 
                    <span>申请来源: </span>
                    <span class="layui-badge layui-bg-blue tl-rtc-app-right-contact-content-other-item-value tl-rtc-app-right-contact-content-other-item-value-badge">
                        {{ propsApplyUserData.origin }}
                    </span>
                </div>
                <div class="tl-rtc-app-right-contact-content-other-item"> 
                    <span>申请时间: </span>
                    <span class="tl-rtc-app-right-contact-content-other-item-value">
                        {{ propsApplyUserData.createTimeFormat }}
                    </span>
                </div>
            </div>
            <div class="tl-rtc-app-right-contact-content-tool-btn">
                <div v-if="propsApplyUserData.status === STATUS.WAITING_ME_PASS" style="display: flex; justify-content: center; flex-wrap: nowrap; flex-direction: row;"> 
                    <button class="layui-btn" @click="passUserFriend" > 
                        <b>同意</b>
                    </button>
                    <button class="layui-btn" style="background-color:#cb5a68" @click="rejectUserFriend"> 
                        <b>拒绝</b>
                    </button>
                </div>
            </div>
        </div>
    `
}

window.tl_rtc_app_module_contact_content_apply_user = tl_rtc_app_module_contact_content_apply_user