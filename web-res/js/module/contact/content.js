const tl_rtc_app_module_contact_content = {
    props: {
        socket: {
            type: Object,
            default: null
        },
        isMobile:{
            type: Boolean,
            default: false
        },
        user: {
            type: Object,
            default: {}
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
        propsSocket(){
            return this.socket;
        },
        propsIsMobile(){
            return this.isMobile;
        },
        propsUser(){
            return this.user;
        },
        propsLeftModule() {
            return this.leftModule;
        },
        propsRightModule() {
            return this.rightModule;
        },
    },
    watch: {
        leftModule: function (val) {
            
        },
        rightModule: function (val) {
            
        }
    },
    data : function(){
        return {
            socketId: this.socket.id, // socketId
            contentType : 'friend', // 当前面板类型, friend, apply, searchUser, searchGroup, group, applyGroup

            friendUserData: { // 搜索用户数据
                id: '', // 好友记录id
                userId: '', // 用户id
                username: '', // 用户账号
                userAvatar: '', // 用户头像
                userMobile: '', // 用户手机号
                userEmail: '', // 用户邮箱
                userCompanyName: '', // 用户所属企业名称
                origin: '', // 申请来源
                createTime: '', // 申请时间
                channelId: '', // 好友频道id
                remark: '', // 申请好友信息
                friendType: '', // 好友类型
            },
            searchUserData: { // 搜索用户数据
                userId: '', // 用户id
                username: '', // 用户账号
                userAvatar: '', // 用户头像
                userMobile: '', // 用户手机号
                userEmail: '', // 用户邮箱
                userCompanyName: '', // 用户所属企业名称
                isFriend: '', // 是否是好友
                isSelf: '', // 是否是自己
                remark: '', // 申请好友信息
                friendType: '', // 好友类型
            }, 
            applyUserData: {  // 申请用户数据
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
                hasRead: '', // 是否已读
            },
            groupData: { // 群组数据
                channelId: '', // 频道id
                channelName: '', // 频道名称
                channelAvatar: '', // 频道头像
                channelCompanyName: '', // 频道公司名称
                createTime: '', // 创建时间
                createTimeFormat: '', // 创建时间格式化
                status: '', // 群组状态,
                joinTime: '', // 加入时间
                joinTimeFormat: '', // 加入时间格式化
                channelUserCount: 0, // 频道用户数
            },
            groupSearchData: { // 搜索群组数据
                channelId: '', // 频道id
                channelName: '', // 频道名称
                channelAvatar: '', // 频道头像
                companyName: '', // 频道公司名称
                isChannelUser: false, // 是否是频道用户
                channelUserCount: 0, // 频道用户数
            },
            groupApplyData: { // 申请群组数据
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
            },
        }
    },
    watch: {

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
         * 搜索用户面板数据变更
         * @param {*} data 
         */
        moduleUserSearchDataChange: function({
            userId, username, userAvatar, userMobile, userEmail, isSelf,
            userCompanyName, isFriend, remark, createTimeFormat, friendType, channelId,
            callback
        }){
            this.contentType = 'searchUser'

            this.searchUserData = {
                userId: userId,
                username: username,
                userAvatar: userAvatar,
                userMobile: userMobile,
                userEmail: userEmail,
                userCompanyName: userCompanyName,
                isFriend: isFriend,
                isSelf: isSelf,
                remark: remark,
                createTimeFormat: createTimeFormat,
                friendType: friendType,
                channelId: channelId
            }
            
            this.$emit('right-module-change', 'content')

            callback && callback()
        },
        /**
         * 搜索群组面板数据变更
         * @param {*} data 
         */
        moduleGroupSearchDataChange: function({
            channelId, channelName, channelAvatar, companyName, isChannelUser,
            channelUserCount, shareUserId, callback
        }){
            this.contentType = 'searchGroup'

            this.groupSearchData = {
                channelId: channelId,
                channelName: channelName,
                channelAvatar: channelAvatar,
                companyName: companyName,
                isChannelUser: isChannelUser,
                channelUserCount: channelUserCount,
                shareUserId: shareUserId
            }

            this.$emit('right-module-change', 'content')

            callback && callback()
        },
        /**
         * 申请群组面板数据变更
         * @param {*} data 
         */
        moduleGroupApplyDataChange: function({
            id, channelId, channelName, channelAvatar, channelCompanyName, channelApplyRemark,
            createTime, createTimeFormat, status, origin, hasRead, 
            
            userId, username, userAvatar,
            callback
        }){
            this.contentType = 'applyGroup'

            this.groupApplyData = {
                id: id,
                channelId: channelId,
                channelName: channelName,
                channelAvatar: channelAvatar,
                channelCompanyName: channelCompanyName,
                channelApplyRemark: channelApplyRemark,
                createTime: createTime,
                createTimeFormat: createTimeFormat,
                status: status,
                origin: origin,
                hasRead: hasRead,

                userId: userId,
                username: username,
                userAvatar: userAvatar,
            }

            this.$emit('right-module-change', 'content')

            callback && callback()
        },
        /**
         * 用户好友面板数据变更
         * @param {*} data 
         */
        moduleUserFriendDataChange: function({
            id, userId, username, userAvatar, userMobile, userEmail,
            userCompanyName, origin, channelId, createTime, createTimeFormat, remark, friendType,
            callback
        }){
            this.contentType = 'friend'

            this.friendUserData = {
                id: id,
                userId: userId,
                username: username,
                userAvatar: userAvatar,
                userMobile: userMobile,
                userEmail: userEmail,
                userCompanyName: userCompanyName,
                origin: origin,
                channelId: channelId,
                createTime: createTime,
                createTimeFormat: createTimeFormat,
                remark: remark,
                friendType: friendType
            }

            this.$emit('right-module-change', 'content')

            callback && callback()
        },
        /**
         * 群组数据变更
         * @param {*} data
         */
        moduleGroupDataChange: function({
            channelId, channelName, channelAvatar, channelCompanyName, 
            createTime, createTimeFormat, status, joinTime, joinTimeFormat,
            channelUserCount, callback
        }){
            this.contentType = 'group'

            this.groupData = {
                channelId: channelId,
                channelName: channelName,
                channelAvatar: channelAvatar,
                channelCompanyName: channelCompanyName,
                createTime: createTime,
                createTimeFormat: createTimeFormat,
                status: status,
                joinTime: joinTime,
                joinTimeFormat: joinTimeFormat,
                channelUserCount: channelUserCount
            }

            this.$emit('right-module-change', 'content')

            callback && callback()
        },
        /**
         * 用户申请数据变更
         * @param {*} data 
         */
        moduleUserApplyDataChange: function({
            id, userId, username, userAvatar, userMobile, userEmail, 
            userCompanyName, status, origin, userApplyRemark, 
            createTime, createTimeFormat, hasRead,
            callback
        }){
            this.contentType = 'applyUser'

            this.applyUserData = {
                id: id,
                userId: userId,
                username: username,
                userAvatar: userAvatar,
                userMobile: userMobile,
                userEmail: userEmail,
                userCompanyName: userCompanyName,
                status: status,
                origin: origin,
                userApplyRemark: userApplyRemark,
                createTime: createTime,
                createTimeFormat: createTimeFormat,
                hasRead: hasRead
            }

            this.$emit('right-module-change', 'content')

            callback && callback()
        },
        /**
         * 添加好友
         * @returns 
         */
        addUserFriend: async function(){
            let userInfo = {}
            if(this.contentType == 'friend'){
               userInfo = this.friendUserData
            }else if(this.contentType == 'apply'){
                userInfo = this.applyUserData
            }else if(this.contentType == 'searchUser'){
                userInfo = this.searchUserData
            }else{
                this.popWarningMsg("用户不存在")
                return
            }
            let {userId, isFriend} = userInfo

            if(this.contentType == 'searchUser' && isFriend){
                this.popWarningMsg("已经是好友了")
                return
            }

            if(!userId){
                this.popWarningMsg("用户不存在")
                return
            }

            let that = this;

            layer.prompt({
                formType: 0,
                title: "发送好友申请",
                btn : ['确定', '取消'],
                value: "",
                shadeClose : true,
                maxlength : 15,
            }, async function (value, index, elem) {
                value = value.trim()
                if(value.length === 0){
                    that.popWarningMsg("请先填写好友申请内容")
                    return false;
                }

                const params = {
                    friendId : userId,
                    remark : value
                }
                if(!window.tl_rtc_app_comm.checkRequestParams(params)){
                    that.popErrorMsg("请求参数非法")
                    return
                }
                const { data: userRes } = await that.tlRequest({
                    url: '/api/web/user-apply/add-user-friend-apply',
                    method: 'post',
                    useCache: false,
                    data: params,
                })
                if(userRes.success){
                    that.popSuccessMsg(userRes.msg)

                    that.emitSubModuleEvent({
                        event: 'sub-module-apply-contact-list-update',
                        data: {
                            applyId : userRes.data.applyId
                        }
                    })

                    // 通知被申请人
                    that.emitSubModuleEvent({
                        event: 'component-socket-send-socket',
                        data: {
                            event: 'contactApply',
                            data: {
                                userId: userId,
                                applyInfo: {
                                    remark: value
                                }
                            }
                        }
                    });
                }else{
                    that.popErrorMsg(userRes.msg)
                }
                
                layer.close(index)

                return false
            });
        },
        /**
         * 通过好友申请
         */
        passUserFriend: async function(){
            if(!this.applyUserData.id){
                this.popWarningMsg("申请记录不存在")
                return
            }

            const params = {
                id : this.applyUserData.id,
                remark : ""
            }
            if(!window.tl_rtc_app_comm.checkRequestParams(params)){
                this.popErrorMsg("请求参数非法")
                return
            }
            const { data: userRes } = await this.tlRequest({
                url: '/api/web/user-apply/pass-user-friend',
                method: 'post',
                useCache: false,
                data: params,
                
            })

            if(userRes.success){
                this.popSuccessMsg(userRes.msg)
                
                this.emitSubModuleEvent({
                    event: 'sub-module-apply-contact-list-update',
                    data: {
                        applyId : userRes.data.applyId
                    }
                })

                await this.emitSubModuleEvent({
                    event: 'sub-module-contact-list-update'
                })

                await this.emitSubModuleEvent({
                    event: 'sub-module-channel-list-init'
                })

                // 通知申请人
                this.emitSubModuleEvent({
                    event: 'component-socket-send-socket',
                    data: {
                        event: 'contactApplyPass',
                        data: {
                            userId: userRes.data.applyUserId,
                            passInfo: {
                                remark: ""
                            }
                        }
                    }
                });
            }else{
                this.popErrorMsg(userRes.msg)
            }
        },
        /**
         * 拒绝好友申请
         */
        rejectUserFriend: async function(){
            if(!this.applyUserData.id){
                this.popWarningMsg("申请记录不存在")
                return
            }

            const params = {
                id : this.applyUserData.id,
                remark : ""
            }
            if(!window.tl_rtc_app_comm.checkRequestParams(params)){
                this.popErrorMsg("请求参数非法")
                return
            }
            const { data: userRes } = await this.tlRequest({
                url: '/api/web/user-apply/reject-user-friend',
                method: 'post',
                useCache: false,
                data: params,
                
            })
            if(userRes.success){
                this.popSuccessMsg(userRes.msg)

                this.emitSubModuleEvent({
                    event: 'sub-module-apply-contact-list-update',
                    data: {
                        applyId : userRes.data.applyId
                    }
                })

                // 通知申请人
                this.emitSubModuleEvent({
                    event: 'component-socket-send-socket',
                    data: {
                        event: 'contactApplyReject',
                        data: {
                            userId: userRes.data.applyUserId,
                            rejectInfo: {
                                remark: ""
                            }
                        }
                    }
                });
            }else{
                this.popErrorMsg(userRes.msg)
            }
        },
        /**
         * 发送信息
         */
        sendMessage: async function({
            channelId, callback
        }){
            this.$emit('left-module-change', 'channel')

            await this.emitSubModuleEvent({
                event: 'sub-module-channel-list-item-open',
                data: {
                    channelId: channelId
                }
            })

            callback && callback()
        },
        /**
         * 发起视频
         */
        sendVideo: async function({
            channelId, callback
        }){
            // 屏幕是否是横向
            const screenIsLandscape = window.tl_rtc_app_comm.isLandscape()

            await this.emitSubModuleEvent({
                event: 'component-video-start-video',
                data: {
                    channelId : channelId,
                    audio: true, video: true,
                    videoConstraints: {
                        width: {
                            ideal: screenIsLandscape ? 300 : 450,
                        },
                        height: {
                            ideal: screenIsLandscape ? 450 : 300,
                        },
                        frameRate: {
                            ideal: 40, max: 50
                        },
                        facingMode: 'user'
                    },
                }
            })

            await this.emitSubModuleEvent({
                event: 'sub-module-channel-content-add-media-message',
                data: {
                    channelId: channelId,
                    type: 'video',
                    channelType: 'friend'
                }
            })

            callback && callback()
        },
        /**
         * 发起语音
         */
        sendAudio: async function({
            channelId, callback
        }){
            await this.emitSubModuleEvent({
                event: 'component-video-start-video',
                data: {
                    channelId : channelId,
                    audio: true, video: false,
                }
            })

            await this.emitSubModuleEvent({
                event: 'sub-module-channel-content-add-media-message',
                data: {
                    channelId: channelId,
                    type: 'audio',
                    channelType: 'friend'
                }
            })

            callback && callback()
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
         * 申请加入群聊
         */
        addUserGroup: async function({
            channelId, shareUserId
        }){
            let that = this;

            if(!channelId){
                this.popWarningMsg("群组不存在")
                return
            }

            layer.prompt({
                formType: 0,
                title: "发送加群申请",
                btn : ['确定', '取消'],
                value: "",
                shadeClose : true,
                maxlength : 15,
            }, async function (value, index, elem) {
                value = value.trim()
                if(value.length === 0){
                    that.popWarningMsg("请先填写群聊申请内容")
                    return false;
                }

                const params = {
                    channelId,
                    remark : value,
                    shareUserId: shareUserId
                }
                if(!window.tl_rtc_app_comm.checkRequestParams(params)){
                    that.popErrorMsg("请求参数非法")
                    return
                }
                const { data: userRes } = await that.tlRequest({
                    url: '/api/web/user-apply/add-user-group-apply',
                    method: 'post',
                    useCache: false,
                    data: params,
                })
                if(userRes.success){
                    that.popSuccessMsg(userRes.msg)

                    that.emitSubModuleEvent({
                        event: 'sub-module-apply-group-list-update',
                        data: {
                            applyId : userRes.data.applyId
                        }
                    })

                    // 通知被申请人
                    that.emitSubModuleEvent({
                        event: 'component-socket-send-socket',
                        data: {
                            event: 'groupApply',
                            data: {
                                channelId: channelId,
                                applyInfo: {
                                    remark: value
                                }
                            }
                        }
                    });
                }else{
                    that.popErrorMsg(userRes.msg)
                }
                
                layer.close(index)

                return false
            });
        },
        /**
         * 通过群聊申请
         */
        passGroupApply: async function(){
            if(!this.groupApplyData.id){
                this.popWarningMsg("申请记录不存在")
                return
            }

            const params = {
                id : this.groupApplyData.id,
                remark : ""
            }
            if(!window.tl_rtc_app_comm.checkRequestParams(params)){
                this.popErrorMsg("请求参数非法")
                return
            }
            const { data: userRes } = await this.tlRequest({
                url: '/api/web/user-apply/pass-user-group',
                method: 'post',
                useCache: false,
                data: params,
            })

            if(userRes.success){
                this.popSuccessMsg(userRes.msg)
                
                this.emitSubModuleEvent({
                    event: 'sub-module-apply-group-list-update',
                    data: {
                        applyId : userRes.data.applyId
                    }
                })

                await this.emitSubModuleEvent({
                    event: 'sub-module-contact-list-update'
                })

                await this.emitSubModuleEvent({
                    event: 'sub-module-channel-list-init'
                })

                // 通知申请人
                this.emitSubModuleEvent({
                    event: 'component-socket-send-socket',
                    data: {
                        event: 'groupApplyPass',
                        data: {
                            userId: userRes.data.applyUserId,
                            passInfo: {
                                remark: ""
                            }
                        }
                    }
                });
            }else{
                this.popErrorMsg(userRes.msg)
            }
        },
        /**
         * 拒绝群聊申请
         */
        rejectGroupApply: async function(){
            if(!this.groupApplyData.id){
                this.popWarningMsg("申请记录不存在")
                return
            }

            const params = {
                id : this.groupApplyData.id,
                remark : ""
            }
            if(!window.tl_rtc_app_comm.checkRequestParams(params)){
                this.popErrorMsg("请求参数非法")
                return
            }
            const { data: userRes } = await this.tlRequest({
                url: '/api/web/user-apply/reject-user-group',
                method: 'post',
                useCache: false,
                data: params,
            })
            if(userRes.success){
                this.popSuccessMsg(userRes.msg)

                this.emitSubModuleEvent({
                    event: 'sub-module-apply-group-list-update',
                    data: {
                        applyId : userRes.data.applyId
                    }
                })

                // 通知申请人
                this.emitSubModuleEvent({
                    event: 'component-socket-send-socket',
                    data: {
                        event: 'groupApplyReject',
                        data: {
                            userId: userRes.data.applyUserId,
                            rejectInfo: {
                                remark: ""
                            }
                        }
                    }
                });
            }else{
                this.popErrorMsg(userRes.msg)
            }
        }
    },
    mounted() {
        
    },
    created(){
        // 搜索用户数据变更
        window.subModule.$on('sub-module-contact-content-user-search-data-change', this.moduleUserSearchDataChange)

        // 用户好友数据变更
        window.subModule.$on('sub-module-contact-content-user-friend-data-change', this.moduleUserFriendDataChange)

        // 用户申请数据变更
        window.subModule.$on('sub-module-contact-content-user-apply-data-change', this.moduleUserApplyDataChange)

        // 搜索群组数据变更
        window.subModule.$on('sub-module-contact-content-group-search-data-change', this.moduleGroupSearchDataChange)

        // 群聊申请数据变更
        window.subModule.$on('sub-module-contact-content-group-apply-data-change', this.moduleGroupApplyDataChange)

        // 群组数据变更
        window.subModule.$on('sub-module-contact-content-group-data-change', this.moduleGroupDataChange)
        
        // 发送消息
        window.subModule.$on('sub-module-contact-content-send-message', this.sendMessage)

        // 发送视频
        window.subModule.$on('sub-module-contact-content-send-video', this.sendVideo)
        
        // 发送音频
        window.subModule.$on('sub-module-contact-content-send-audio', this.sendAudio)
    },
    components: {
        'tl-rtc-app-module-contact-content-friend' : window.tl_rtc_app_module_contact_content_friend,
        'tl-rtc-app-module-contact-content-apply-user' : window.tl_rtc_app_module_contact_content_apply_user,
        'tl-rtc-app-module-contact-content-apply-group' : window.tl_rtc_app_module_contact_content_apply_group,
        'tl-rtc-app-module-contact-content-search-user' : window.tl_rtc_app_module_contact_content_search_user,
        'tl-rtc-app-module-contact-content-search-group' : window.tl_rtc_app_module_contact_content_search_group,
        'tl-rtc-app-module-contact-content-group' : window.tl_rtc_app_module_contact_content_group,
    },
    template: `
        <div class="tl-rtc-app-right-contact-content">
            <svg class="icon goBack" aria-hidden="true" @click="goBack" v-show="propsIsMobile">
                <use xlink:href="#tl-rtc-app-icon-xiangzuo1"></use>
            </svg>
            
            <tl-rtc-app-module-contact-content-friend
                v-show="contentType == 'friend'"
                :friend-user-data="friendUserData"
                :is-mobile="propsIsMobile"
                @send-message="sendMessage"
                @send-video="sendVideo"
                @send-audio="sendAudio"
                :socket="propsSocket"
                :user="propsUser"
                :left-module="propsLeftModule"
                :right-module="propsRightModule"
                @left-module-change="leftModuleChange"
                @right-module-change="rightModuleChange"
            >
            </tl-rtc-app-module-contact-content-friend>

            <tl-rtc-app-module-contact-content-search-user
                v-show="contentType == 'searchUser'"
                :search-user-data="searchUserData"
                :is-mobile="propsIsMobile"
                @add-user-friend="addUserFriend"
                @send-message="sendMessage"
                @send-video="sendVideo"
                @send-audio="sendAudio"
                :socket="propsSocket"
                :user="propsUser"
                :left-module="propsLeftModule"
                :right-module="propsRightModule"
                @left-module-change="leftModuleChange"
                @right-module-change="rightModuleChange"
            >
            </tl-rtc-app-module-contact-content-search-user>

            <tl-rtc-app-module-contact-content-apply-user
                v-show="contentType == 'applyUser'"
                :is-mobile="propsIsMobile"
                :apply-user-data="applyUserData"
                @pass-user-friend="passUserFriend"
                @reject-user-friend="rejectUserFriend"
                :socket="propsSocket"
                :user="propsUser"
                :left-module="propsLeftModule"
                :right-module="propsRightModule"
                @left-module-change="leftModuleChange"
                @right-module-change="rightModuleChange"
            >
            </tl-rtc-app-module-contact-content-apply-user>

            <tl-rtc-app-module-contact-content-group
                v-show="contentType == 'group'"
                :group-data="groupData"
                :is-mobile="propsIsMobile"
                @send-message="sendMessage"
                @send-video="sendVideo"
                @send-audio="sendAudio"
                :socket="propsSocket"
                :user="propsUser"
                :left-module="propsLeftModule"
                :right-module="propsRightModule"
                @left-module-change="leftModuleChange"
                @right-module-change="rightModuleChange"
            >
            </tl-rtc-app-module-contact-content-group>

            <tl-rtc-app-module-contact-content-search-group
                v-show="contentType == 'searchGroup'"
                :group-search-data="groupSearchData"
                :is-mobile="propsIsMobile"
                @send-message="sendMessage"
                @send-video="sendVideo"
                @send-audio="sendAudio"
                @add-user-group="addUserGroup"
                :socket="propsSocket"
                :user="propsUser"
                :left-module="propsLeftModule"
                :right-module="propsRightModule"
                @left-module-change="leftModuleChange"
                @right-module-change="rightModuleChange"
            >
            </tl-rtc-app-module-contact-content-search-group>

            <tl-rtc-app-module-contact-content-apply-group
                v-show="contentType == 'applyGroup'"
                :is-mobile="propsIsMobile"
                @pass-group-apply="passGroupApply"
                @reject-group-apply="rejectGroupApply"
                :socket="propsSocket"
                :user="propsUser"
                :group-apply-data="groupApplyData"
                :left-module="propsLeftModule"
                :right-module="propsRightModule"
                @left-module-change="leftModuleChange"
                @right-module-change="rightModuleChange"
            >
            </tl-rtc-app-module-contact-content-apply-group>
        </div>
    `
}

window.tl_rtc_app_module_contact_content = tl_rtc_app_module_contact_content