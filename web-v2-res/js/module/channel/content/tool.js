const tl_rtc_app_module_channel_content_tool = {
    props : {
        socketId : {
            type: String,
            default: ''
        },
        channelId: {
            type: String,
            default: ''
        },
        channelName: {
            type: String,
            default: ''
        },
        channelUserCount: {
            type: Number,
            default: 0
        },
        channelType: {
            type: String,
            default: ''
        },
        tools : {
            type: Array,
            default: []
        },
        channelUsers: {
            type: Array,
            default: []
        },
        user: {
            type: Object,
            default: function(){
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
        leftModule: {
            type: String,
            default: ''
        },
        rightModule: {
            type: String,
            default: ''
        },
        channelReName: {
            type: String,
            default: ''
        }
    },
    computed: {
        propsSocketId(){
            return this.socketId;
        },
        propsChannelId(){
            return this.channelId;
        },
        propsChannelType(){
            return this.channelType;
        },
        propsChannelName(){
            return this.channelName;
        },
        propsChannelUserCount(){
            return this.channelUserCount;
        },
        propsTools(){
            if(this.propsChannelType === 'friend'){
                this.tools = this.tools.filter(tool => {
                    return tool.title !== '邀请进群';
                })
            }
            if(this.isMobile){
                this.tools = this.tools.filter(tool => {
                    return tool.title !== '邀请进群';
                })
            }
            return this.tools;
        },
        propsChannelUsers(){
            return this.channelUsers;
        },
        propsUser(){
            return this.user;
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
        propsChannelReName(){
            return this.channelReName;
        }
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
        goBack: function(event){
            if(event){
                event.stopPropagation();
            }
            this.emitSubModuleEvent({
                event: 'sub-module-core-change-module-show',
                data: {
                    showRightModule: false,
                }
            })

            this.emitSubModuleEvent({
                event: 'sub-module-channel-list-go-back'
            })
        },
        mouseEnter: function(event, item){
            if(this.propsIsMobile){
                return
            }
            tl_rtc_app_comm.mouseEnterTips({
                id: event.target.id,
                text: item.title,
                position: 'top'
            });
        },
        mouseLeave: function(){
            if(this.propsIsMobile){
                return
            }
            tl_rtc_app_comm.mouseLeaveTips();
        },
        /**
         * 更新频道名称
         */
        updateChannelName: function(event){
            if(event){
                event.stopPropagation();
            }
            if(this.propsChannelType === 'group'){
                this.emitSubModuleEvent({
                    event: 'sub-module-channel-content-update-group-channel-name',
                    data: {
                        channelId: this.propsChannelId,
                    }
                })
            }else if(this.propsChannelType === 'friend'){
                this.emitSubModuleEvent({
                    event: 'sub-module-channel-content-update-friend-name',
                    data: {
                        channelId: this.propsChannelId,
                    }
                })
            }
        },
        /**
         * 展示群聊信息
         * @param {*} channel
         */
        channelInfoPopup: async function(event, channel){
            if (!channel || !channel.channelId) {
                return
            }

            // 根据channelId获取群聊基础信息
            let { type, channelInfo } = await this.emitSubModuleEvent({
                event: 'component-popup-channel-info-popup',
                data: {
                    clientX: event.clientX,
                    clientY: event.clientY,
                    channelInfo: {
                        id: channel.channelId
                    },
                }
            })
        
            if(type === 'chat'){
                await this.emitSubModuleEvent({
                    event: 'sub-module-contact-content-send-message',
                    data: {
                        channelId: channelInfo.channelId,
                    }
                })
            }
        },
    },
    template: `
        <div class="tl-rtc-app-right-channel-content-top">
            <div class="tl-rtc-app-right-channel-content-top-nickname" 
                style="cursor: pointer;"
                v-show="propsChannelType === 'group'" @click="channelInfoPopup($event, {channelId: propsChannelId})"
            >
                <svg class="icon" aria-hidden="true" @click="goBack($event)" v-show="isMobile">
                    <use xlink:href="#tl-rtc-app-icon-xiangzuo1"></use>
                </svg>
                {{propsChannelName}} ({{propsChannelUserCount}})
                <svg class="icon tl-rtc-app-edit-channel-name" aria-hidden="true" @click="updateChannelName($event)">
                    <use xlink:href="#tl-rtc-app-icon-chongmingm"></use>
                </svg>
            </div>
            <div class="tl-rtc-app-right-channel-content-top-nickname" v-show="propsChannelType === 'friend'">
                <svg class="icon" aria-hidden="true" @click="goBack" v-show="isMobile">
                    <use xlink:href="#tl-rtc-app-icon-xiangzuo1"></use>
                </svg>
                {{propsChannelReName}} <small>({{propsChannelName}})</small>
                <svg class="icon tl-rtc-app-edit-channel-name" aria-hidden="true" @click="updateChannelName">
                    <use xlink:href="#tl-rtc-app-icon-chongmingm"></use>
                </svg>
            </div>
            <div class="tl-rtc-app-right-channel-content-top-more">
                <svg class="icon" aria-hidden="true" 
                    v-for="tool in propsTools" 
                    @click="tool.callback"
                    :id="'channel-tool-' + tool.title"
                    @mouseenter="mouseEnter(event, tool)"
                    @mouseleave="mouseLeave"
                >
                    <use :xlink:href="tool.svg" :title="tool.title" ></use>
                </svg>
            </div>
        </div>
    `,
}

window.tl_rtc_app_module_channel_content_tool = tl_rtc_app_module_channel_content_tool