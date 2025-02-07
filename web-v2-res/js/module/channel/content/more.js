const tl_rtc_app_module_channel_content_more = {
    props : {
        channelId : {
            type : String,
            default : ''
        },
        channelName : {
            type : String,
            default : ''
        },
        channelType : {
            type : String,
            default : ''
        },
        channelMessages : {
            type : Array,
            default : function(){
                return []
            }
        },
        channelUsers : {
            type : Array,
            default : function(){
                return []
            }
        },
        socketId : {
            type : String,
            default : ''
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
        channelTop:{
            type: Boolean,
            default: false
        },
        channelBlack: {
            type: Boolean,
            default: false
        },
        isMobile: {
            type: Boolean,
            default: false
        },
        company:{
            type: Object,
            default: function(){
                return {
                    name: ''
                }
            }
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
        propsChannelId(){
            return this.channelId;
        },
        propsChannelName(){
            return this.channelName;
        },
        propsSocketId(){
            return this.socketId;
        },
        propsUserId(){
            return this.user.userId;
        },
        propsChannelUsers(){
            return this.channelUsers;
        },
        propsChannelMessages(){
            return this.channelMessages;
        },
        propsChannelType(){
            return this.channelType;
        },
        propsChannelTop(){
            return this.channelTop;
        },
        propsChannelBlack(){
            return this.channelBlack;
        },
        propsUser(){
            return this.user;
        },
        propsIsMobile(){
            return this.isMobile;
        },
        propsCompanyName(){
            return this.company.name;
        },
        propsCompany(){
            return this.company;
        },
        gridGroupChannelUsers(){
            if(this.propsChannelUsers.length < this.groupSlidesPerView * this.groupGridSize){
                return this.chunkArray(this.propsChannelUsers, 1)
            }
            return this.chunkArray(this.propsChannelUsers, this.groupGridSize)
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
    watch:{
        leftModule: function (val) {
            
        },
        rightModule: function (val) {
            
        }
    },
    data : function(){
        return {
            openPanel: false,
            friendSlidesPerView: 3, // 好友swiper每页显示数量
            friendSwiperInstant: null, // 好友网格swiper实例

            groupGridSize: 2, // 群聊网格大小
            groupSlidesPerView: 4, // 群聊swiper每页显示数量
            groupSwiperInstant: null, // 群聊网格swiper实例
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
        chunkArray: function(array, size){
            return array.reduce((acc, _, i) =>
                (i % size ? acc : [...acc, array.slice(i, i + size)]), [])
        },
        /**
         * 操作更多面板
         */
        operChannelMore: function({
            callback
        }){
            let that = this
            this.openPanel = !this.openPanel

            if(this.openPanel){
                document.querySelector('.tl-rtc-app-right-channel-content-more').style.right = "0"
                if(this.propsIsMobile){
                    document.querySelector('.tl-rtc-app-right').style.zIndex = 'unset';
                }
                
                this.emitSubModuleEvent({
                    event: 'component-shade-show',
                    data: {
                        id: 'channelMoreShade',
                        className: 'tl-rtc-app-right-channel-more-shade-content-body', 
                        shadeListener: {
                            click: function(){
                                that.operChannelMore({
                                    callback
                                })
                            }
                        }
                    }
                })
            }else{
                if(this.propsIsMobile){
                    document.querySelector('.tl-rtc-app-right').style.zIndex = 3;
                }
                document.querySelector('.tl-rtc-app-right-channel-content-more').style.right = "-300px"
                
                this.emitSubModuleEvent({
                    event: 'component-shade-destroy',
                    data: {
                        id: 'channelMoreShade'
                    }
                })
            }

            callback && callback()
        },
        /**
         * 用户信息弹窗
         * @param {*} event 
         */
        userInfoPopup: async function(event, user){      
            let that = this      
            // 根据userId获取用户基础信息
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
        
            // 先关闭右侧侧边栏
            this.operChannelMore({})

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
                this.operChannelMore({})
            }else if(type === 'audio'){
                await this.emitSubModuleEvent({
                    event: 'sub-module-contact-content-send-audio',
                    data: {
                        channelId: userInfo.channelId,
                    }
                })
                this.operChannelMore({})
            }
        },
        /**
         * 更新群聊名称
         */
        updateGroupChannelName: async function(){
            this.$emit('update-group-channel-name', {})
        },
        /**
         * 设置频道置顶
         */
        updateChannelToTop: async function(){
            this.$emit('update-channel-to-top')
        },
        /**
         * 退出群聊
         */
        exitGroupChannel: async function(){
            this.$emit('exit-group-channel')
            this.operChannelMore({})
        },
        /**
         * 删除好友
         */
        deleteFriend: async function(){
            this.$emit('delete-friend')
        },
        /**
         * 拉黑好友
         */
        blackFriend: async function(){
            this.$emit('black-friend')
        },
        /**
         * 更新好友备注名称
         */
        updateFriendName: async function(){
            this.$emit('update-friend-name', {})
        },
        /**
         * 设置群公告
         */
        addGroupNotice: async function(){
            this.$emit('add-group-notice')
        },
        /**
         * 分享群聊
         */
        groupChannelShare: async function(){
            this.$emit('group-channel-share')
        },
        /**
         * 添加群成员
         */
        addGroupMember: async function(){
            this.$emit('invite-channel-user')
        },
        /**
         * 移除群成员
         */
        removeGroupMember: async function(){
            this.popWarningMsg('暂未开放')
        },
        /**
         * 初始化swiper
         */
        initSwiper: function(){
            this.friendSwiperInstant = new Swiper('#friendSwiper', {
                slidesPerView: this.friendSlidesPerView,
                direction: 'horizontal',
                loop: false,
                observer: true,
                mousewheel: true, // 鼠标滚轮控制
                forceToAxis: true, // 滚动条只能在一个方向上拖动
                spaceBetween: 3,
                freeMode: {
                    momentumRatio: 1, // 惯性动量比
                    momentumBounceRatio: 0, // 滑动反弹
                    minimumVelocity: 0, // 最小滑动速度
                }
            });

            this.groupSwiperInstant = new Swiper('#groupSwiper', {
                slidesPerView: this.groupSlidesPerView,
                direction: 'horizontal',
                observer: true,
                mousewheel: true, // 鼠标滚轮控制
                forceToAxis: true, // 滚动条只能在一个方向上拖动
                freeMode: {
                    momentumRatio: 1, // 惯性动量比
                    momentumBounceRatio: 0, // 滑动反弹
                    minimumVelocity: 0, // 最小滑动速度
                },
                scrollbar: {
                    el : '#group-more-swiper-scrollbar',
                    hide: false, // 自动隐藏滚动条
                }
            });
        }
    },
    mounted() {
        
    },
    created(){
        // 频道打开更多面板
        window.subModule.$on('sub-module-channel-more-open', this.operChannelMore);
    },
    updated() {
        window.form.render();

        window.form.val('channelMore', {
            setTopFriend: this.propsChannelTop,
            setTopGroup: this.propsChannelTop,
            setBlackFriend: this.propsChannelBlack,
        });

        this.initSwiper()
    },
    template: `
        <div class="tl-rtc-app-right-channel-content-more" :class="openPanel? '': ''">
            <div class="tl-rtc-app-right-channel-content-more-list layui-form" v-show="propsChannelType === 'friend'" lay-filter="channelMore">

                <div class="tl-rtc-app-right-channel-content-more-list-item">
                    <div class="tl-rtc-app-right-channel-content-more-list-item-title">
                        频道类型
                    </div>
                    <div class="tl-rtc-app-right-channel-content-more-list-item-oper">
                        <div class="tl-rtc-app-right-channel-content-more-list-item-oper-channel-name">
                            <span v-if="propsChannelType === 'friend'">好友</span>
                            <span v-if="propsChannelType === 'group'">群聊</span>
                        </div>
                    </div>
                </div>
                <div class="tl-rtc-app-right-channel-content-more-list-item">
                    <div class="tl-rtc-app-right-channel-content-more-list-item-title"> 成员列表 </div>
                    <div class="tl-rtc-app-right-channel-content-more-list-item-oper">
                        <div class="tl-rtc-app-right-channel-content-more-list-item-oper-channel-name">
                            {{propsChannelUsers.length}}个成员
                        </div>
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#tl-rtc-app-icon-xiangyou1"></use>
                        </svg>
                    </div>
                </div>
                <div class="tl-rtc-app-right-channel-content-more-list-user-list swiper" id="friendSwiper">
                    <div class="swiper-wrapper">
                        <div class="tl-rtc-app-right-channel-content-more-list-user-item-oper swiper-slide"
                            v-for="user in propsChannelUsers" @click="userInfoPopup(event, user)"
                        >
                            <img class="tl-rtc-app-right-channel-content-more-list-user-item-avatar" :src="user.userAvatar" alt="">
                            <div class="tl-rtc-app-right-channel-content-more-list-user-item-username">{{user.username}}</div>
                        </div>
                    </div>
                </div>
                <div class="tl-rtc-app-right-channel-content-more-list-item">
                    <div class="tl-rtc-app-right-channel-content-more-list-item-title"> 好友昵称 </div>
                    <div class="tl-rtc-app-right-channel-content-more-list-item-oper">
                        <div class="tl-rtc-app-right-channel-content-more-list-item-oper-channel-name" style="font-weight: bold;">
                            {{propsChannelName}}
                        </div>
                    </div>
                </div>
                <div class="tl-rtc-app-right-channel-content-more-list-item" @click="updateFriendName">
                    <div class="tl-rtc-app-right-channel-content-more-list-item-title"> 好友备注 </div>
                    <div class="tl-rtc-app-right-channel-content-more-list-item-oper">
                        <div class="tl-rtc-app-right-channel-content-more-list-item-oper-channel-name">{{propsChannelReName}}</div>
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#tl-rtc-app-icon-xiangyou1"></use>
                        </svg>
                    </div>
                </div>
                <div class="tl-rtc-app-right-channel-content-more-list-item">
                    <div class="tl-rtc-app-right-channel-content-more-list-item-title"> 置顶好友 </div>
                    <div class="tl-rtc-app-right-channel-content-more-list-item-oper" @click="updateChannelToTop">
                        <input type="checkbox" name="setTopFriend" lay-skin="switch">
                    </div>
                </div>
                <div class="tl-rtc-app-right-channel-content-more-list-item" @click="blackFriend">
                    <div class="tl-rtc-app-right-channel-content-more-list-item-title"> 拉黑好友 </div>
                    <div class="tl-rtc-app-right-channel-content-more-list-item-oper">
                        <input type="checkbox" name="setBlackFriend" lay-skin="switch">
                    </div>
                </div>
                <div class="tl-rtc-app-right-channel-content-more-list-item" style="color: #f45858" @click="deleteFriend">
                    <div class="tl-rtc-app-right-channel-content-more-list-item-title"> 删除好友 </div>
                </div>
            </div>

            <div class="tl-rtc-app-right-channel-content-more-list layui-form" v-show="propsChannelType === 'group'" lay-filter="channelMore">

                <div class="tl-rtc-app-right-channel-content-more-list-item">
                    <div class="tl-rtc-app-right-channel-content-more-list-item-title" @click="groupChannelShare()"> 
                        频道类型 
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#tl-rtc-app-icon-fenxiang1"></use>
                        </svg>
                    </div>
                    <div class="tl-rtc-app-right-channel-content-more-list-item-oper">
                        <div class="tl-rtc-app-right-channel-content-more-list-item-oper-channel-name">
                            <span v-if="propsChannelType === 'friend'">好友</span>
                            <span v-if="propsChannelType === 'group'">群聊</span>
                        </div>
                    </div>
                </div>
                <div class="tl-rtc-app-right-channel-content-more-list-item">
                    <div class="tl-rtc-app-right-channel-content-more-list-item-title"> 成员列表 </div>
                    <div class="tl-rtc-app-right-channel-content-more-list-item-oper">
                        <div class="tl-rtc-app-right-channel-content-more-list-item-oper-channel-name">
                            {{propsChannelUsers.length}}个成员
                        </div>
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#tl-rtc-app-icon-xiangyou1"></use>
                        </svg>
                    </div>
                </div>
                <div class="tl-rtc-app-right-channel-content-more-list-user-list swiper" id="groupSwiper">
                    <div class="swiper-wrapper">
                        <div class="swiper-slide">
                            <div class="tl-rtc-app-right-channel-content-more-list-user-item-oper" @click="addGroupMember">
                                <svg class="icon" aria-hidden="true">
                                    <use xlink:href="#tl-rtc-app-icon-tianjia1"></use>
                                </svg>                                
                                <div class="tl-rtc-app-right-channel-content-more-list-user-item-username" style="color: #557189;font-weight: 500;">
                                    添加
                                </div>
                            </div>
                            <div class="tl-rtc-app-right-channel-content-more-list-user-item-oper" @click="removeGroupMember">
                                <svg class="icon" aria-hidden="true" style="fill: #887e7e;">
                                    <use xlink:href="#tl-rtc-app-icon-yichu"></use>
                                </svg>                                
                                <div class="tl-rtc-app-right-channel-content-more-list-user-item-username" style="color: #887e7e;">
                                    移除
                                </div>
                            </div>
                        </div>
                        <div class="swiper-slide" v-for="subList in gridGroupChannelUsers">
                            <div v-for="(item, sub_index) in subList" @click="userInfoPopup(event, item)" class="tl-rtc-app-right-channel-content-more-list-user-item-oper">
                                <img class="tl-rtc-app-right-channel-content-more-list-user-item-avatar" :src="item.userAvatar" alt="">
                                <div class="tl-rtc-app-right-channel-content-more-list-user-item-username">{{item.username}}</div>
                            </div>
                        </div>
                    </div>
                    <div class="swiper-scrollbar" id="group-more-swiper-scrollbar"></div>
                </div>
                <div class="tl-rtc-app-right-channel-content-more-list-item" @click="updateGroupChannelName">
                    <div class="tl-rtc-app-right-channel-content-more-list-item-title"> 群聊名称 </div>
                    <div class="tl-rtc-app-right-channel-content-more-list-item-oper">
                        <div class="tl-rtc-app-right-channel-content-more-list-item-oper-channel-name">{{propsChannelName}}</div>
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#tl-rtc-app-icon-xiangyou1"></use>
                        </svg>
                    </div>
                </div>
                <div class="tl-rtc-app-right-channel-content-more-list-item">
                    <div class="tl-rtc-app-right-channel-content-more-list-item-title"> 置顶群聊 </div>
                    <div class="tl-rtc-app-right-channel-content-more-list-item-oper" @click="updateChannelToTop">
                        <input type="checkbox" name="setTopGroup" lay-skin="switch">
                    </div>
                </div>
                <div class="tl-rtc-app-right-channel-content-more-list-item" style="color: #f45858" @click="exitGroupChannel">
                    <div class="tl-rtc-app-right-channel-content-more-list-item-title"> 退出群聊 </div>
                </div>
            </div>
        </div>
    `,
}

window.tl_rtc_app_module_channel_content_more = tl_rtc_app_module_channel_content_more