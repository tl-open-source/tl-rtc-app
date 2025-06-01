const tl_rtc_app_module_contact_content_apply_group = {
    props: {
        groupApplyData: {
            type: Object,
            default: {
                id: '', // 申请id
                channelId: '', // 频道id
                channelName: '', // 频道名称
                channelAvatar: '', // 频道头像
                channelCompanyName: '', // 频道公司名称
                channelApplyRemark: '', // 频道申请备注
                userId: '', // 用户id
                username: '', // 用户账号
                userAvatar: '', // 用户头像
                createTime: '', // 申请时间
                createTimeFormat: '', // 申请时间格式化
                status: '', // 申请状态
                origin: '', // 申请来源
                hasRead: '', // 是否已读
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
        propsGroupApplyData(){
            return this.groupApplyData;
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
         * 用户信息弹窗
         * @param {*} event 
         */
        userInfoPopup: async function(event, user){    
            if (!user || !user.userId) {
                return
            }        
            // 根据userId获取用户基础信息
            let { type, userInfo } = await this.emitSubModuleEvent({
                event: 'component-popup-user-info-popup',
                data: {
                    clientX: event.clientX,
                    clientY: event.clientY,
                    userInfo: {
                        id: user.userId
                    },
                }
            })

            if(type === 'chat'){
                await this.emitSubModuleEvent({
                    event: 'sub-module-contact-content-send-message',
                    data: {
                        channelId: userInfo.channelId,
                    }
                })
            }else if(type === 'video'){
                await this.emitSubModuleEvent({
                    event: 'sub-module-contact-content-send-video',
                    data: {
                        channelId: userInfo.channelId,
                    }
                })
            }else if(type === 'audio'){
                await this.emitSubModuleEvent({
                    event: 'sub-module-contact-content-send-audio',
                    data: {
                        channelId: userInfo.channelId,
                    }
                })
            }
        },
        /**
         * 同意群聊申请
         */
        passGroupApply: function(){
            this.$emit('pass-group-apply')
        },
        /**
         * 拒绝群聊申请
         */
        rejectGroupApply: function(){
            this.$emit('reject-group-apply')
        }
    },
    mounted() {

    },
    template: `
        <div class="tl-rtc-app-right-contact-content-group">
            <div class="tl-rtc-app-right-contact-content-top">
                <div class="tl-rtc-app-right-contact-content-top-title">
                    群聊申请信息
                </div>
            </div>
            <div class="tl-rtc-app-right-contact-content-info">
                <div class="tl-rtc-app-right-contact-content-info-avatar">
                    <img :src="propsGroupApplyData.channelAvatar" alt="">
                </div>
                <div class="tl-rtc-app-right-contact-content-info-more">
                    <div class="tl-rtc-app-right-contact-content-info-more-item">
                        <b>{{ propsGroupApplyData.channelName }}</b>
                    </div>
                    <div class="tl-rtc-app-right-contact-content-info-more-item" style="font-size: 12px;">
                        {{ propsGroupApplyData.companyName }}
                    </div>
                </div>
            </div>
            <div class="tl-rtc-app-right-contact-content-other">
                <div class="tl-rtc-app-right-contact-content-other-item"> 
                    <span>群号: </span>
                    <span class="tl-rtc-app-right-contact-content-other-item-value">
                        {{ propsGroupApplyData.channelId }}
                    </span>
                </div>
                <div class="tl-rtc-app-right-contact-content-other-item" v-if="propsGroupApplyData.userId">
                    <span>申请用户: </span>
                    <span class="tl-rtc-app-right-contact-content-other-item-value">
                        {{ propsGroupApplyData.username }}
                         <img @click="userInfoPopup($event, propsGroupApplyData)" :src="propsGroupApplyData.userAvatar" alt="" class="tl-rtc-app-right-contact-content-other-item-value-avatar">
                    </span>
                </div>
                <div class="tl-rtc-app-right-contact-content-other-item"> 
                    <span>验证消息: </span>
                    <span class="tl-rtc-app-right-contact-content-other-item-value">
                        {{ propsGroupApplyData.channelApplyRemark }}
                    </span>
                </div>
                <div class="tl-rtc-app-right-contact-content-other-item"> 
                    <span>当前状态: </span>
                    <span class="layui-badge layui-bg-blue tl-rtc-app-right-contact-content-other-item-value tl-rtc-app-right-contact-content-other-item-value-badge">
                        {{ propsGroupApplyData.status }}
                    </span>
                </div>
                <div class="tl-rtc-app-right-contact-content-other-item"> 
                    <span>申请来源: </span>
                    <span class="layui-badge layui-bg-blue tl-rtc-app-right-contact-content-other-item-value tl-rtc-app-right-contact-content-other-item-value-badge">
                        {{ propsGroupApplyData.origin }}
                    </span>
                </div>
                <div class="tl-rtc-app-right-contact-content-other-item"> 
                    <span>申请时间: </span>
                    <span class="tl-rtc-app-right-contact-content-other-item-value">
                        {{ propsGroupApplyData.createTimeFormat }}
                    </span>
                </div>
            </div>
            <div class="tl-rtc-app-right-contact-content-tool-btn">
                <div v-if="propsGroupApplyData.status === STATUS.WAITING_ME_PASS" style="display: flex; justify-content: center; flex-wrap: nowrap; flex-direction: row;"> 
                    <button class="layui-btn" @click="passGroupApply" > 
                        <b>同意</b>
                    </button>
                    <button class="layui-btn" style="background-color:#cb5a68" @click="rejectGroupApply">
                        <b>拒绝</b>
                    </button>
                </div>
            </div>
        </div>
    `
}

window.tl_rtc_app_module_contact_content_apply_group = tl_rtc_app_module_contact_content_apply_group