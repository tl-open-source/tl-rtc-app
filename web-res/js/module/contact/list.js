const tl_rtc_app_module_contact_list = {
    props : {
        isMobile:{
            type: Boolean,
            default: false
        },
        user: {
            type: Object,
            default: function(){
                return {}
            }
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
    data : function(){
        return {
            // 好友列表
            contactList: [],
            // 好友申请列表
            applyContactList: [],
            // 群聊申请列表
            applyGroupList: [],
            // 群组列表
            groupList: [],
            // 搜索关键字
            searchKey: '',
            // 默认选择 '全部' 标签
            chooseTag: 1, 
            // 标签列表
            tagList: [{
                id: 1,
                system: true,
                name: '特别关注',
            }]
        }
    },
    computed: {
        propsIsMobile(){
            return this.isMobile;
        },
        filterGroupList: function(){
            if(this.searchKey === '' || this.searchKey.trim() === ''){
                return this.groupList
            }
            return this.groupList.filter(item => {
                let values = item.channelName
                if(!values){
                    return false
                }
                return values.indexOf(this.searchKey) > -1
            })
        },
        filterContactList: function(){
            if(this.searchKey === '' || this.searchKey.trim() === ''){
                return this.contactList
            }
            return this.contactList.filter(item => {
                let values = item.username
                if(!values){
                    return false
                }
                return values.indexOf(this.searchKey) > -1
            })
        },
        filterApplyContactList: function(){
            if(this.searchKey === '' || this.searchKey.trim() === ''){
                return this.applyContactList
            }
            return this.applyContactList.filter(item => {
                let values = item.username
                if(!values){
                    return false
                }
                return values.indexOf(this.searchKey) > -1
            })
        },
        filterApplyGroupList: function(){
            if(this.searchKey === '' || this.searchKey.trim() === ''){
                return this.applyGroupList
            }
            return this.applyGroupList.filter(item => {
                let values = item.channelName
                if(!values){
                    return false
                }
                return values.indexOf(this.searchKey) > -1
            })
        },
        webNotify(){
            return this.user.messageSetting.webNotify
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
         * 更新好友申请信息
         * @param {*} id 
         * @param {*} data 
         */
        updateApplyContactInfo: function(id, data){
            this.applyContactList.forEach(item => {
                if(item.id === id){
                    item = Object.assign(item, data)
                }
            })

            this.$forceUpdate()

            // 更新联系人未读数量
            const unreadCount = this.applyContactList.filter(
                item => !item.hasRead
            ).length

            this.emitSubModuleEvent({
                event: 'sub-module-sidebar-unread-update',
                data: {
                    name: 'contact', 
                    type: 'all', 
                    count: unreadCount
                }
            })
        },
        /**
         * 更新群聊申请信息
         * @param {*} id
         * @param {*} data
         */
        updateApplyGroupInfo: function(id, data){
            this.applyGroupList.forEach(item => {
                if(item.id === id){
                    item = Object.assign(item, data)
                }
            })

            this.$forceUpdate()

            // 更新联系人未读数量
            const unreadCount = this.applyGroupList.filter(
                item => !item.hasRead
            ).length

            this.emitSubModuleEvent({
                event: 'sub-module-sidebar-unread-update',
                data: {
                    name: 'contact', 
                    type: 'all', 
                    count: unreadCount
                }
            })
        },
        /**
         * 更新好友列表, 打开指定好友信息
         * @param {*} userFriendId 
         */
        updateContactList: async function({
            contactId, callback
        }){
            await this.getContactList()
            // 打开指定好友信息
            if(contactId){
                const openItem = this.contactList.find(item => item.id === contactId)
                if(openItem){
                    this.openContactInfo(openItem)
                }
            }

            callback && callback()
        },
        /**
         * 更新好友申请列表, 打开指定申请信息
         * @param {*} applyId 
         */
        updateApplyContactList: async function({
            applyId, callback
        }) {
            await this.getApplyContactList()
            // 打开指定申请记录信息
            if(applyId){
                const openItem = this.applyContactList.find(item => item.id === applyId)
                if(openItem){
                    await this.openApplyContactInfo(openItem)
                }
            }

            callback && callback()
        },
        /**
         * 更新群聊申请列表, 打开指定申请信息
         * @param {*} applyId
         */
        updateApplyGroupList: async function({
            applyId, callback
        }) {
            await this.getApplyGroupList()
            // 打开指定申请记录信息
            if(applyId){
                const openItem = this.applyGroupList.find(item => item.id === applyId)
                if(openItem){
                    await this.openApplyGroupInfo(openItem)
                }
            }

            callback && callback()
        },
        /**
         * 打开好友申请信息
         * @param {*} data 
         */
        openApplyContactInfo: async function(data){
            this.$emit('right-module-change', 'content')

            // 通知兄弟子模块，数据变更
            this.emitSubModuleEvent({
                event: 'sub-module-contact-content-user-apply-data-change',
                data
            })

            // 打开右侧模块 - 处理移动端情况
            this.emitSubModuleEvent({
                event: 'sub-module-core-change-module-show',
                data: {
                    showRightModule: true,
                }
            })

            if(!data.hasRead){
                const params = {
                    recordId: data.id
                }
                if(!window.tl_rtc_app_comm.checkRequestParams(params)){
                    this.popErrorMsg("请求参数非法")
                    return
                }
                const { data: readRes } = await this.tlRequest({
                    url: '/api/web/user-read/update-user-friend-apply-read',
                    method: 'post',
                    useCache: false,
                    data: params,
                    
                })
                if(readRes.success){
                    this.updateApplyContactInfo(data.id, {
                        hasRead: true
                    })
                }else{
                    this.popErrorMsg(readRes.msg)
                }
            }
        },
        /**
         * 打开群聊申请信息
         * @param {*} data
         * @returns
         */
        openApplyGroupInfo: async function(data){
            this.$emit('right-module-change', 'content')

            // 通知兄弟子模块，数据变更
            this.emitSubModuleEvent({
                event: 'sub-module-contact-content-group-apply-data-change',
                data
            })

            // 打开右侧模块 - 处理移动端情况
            this.emitSubModuleEvent({
                event: 'sub-module-core-change-module-show',
                data: {
                    showRightModule: true,
                }
            })

            if(!data.hasRead){
                const params = {
                    recordId: data.id
                }
                if(!window.tl_rtc_app_comm.checkRequestParams(params)){
                    this.popErrorMsg("请求参数非法")
                    return
                }
                const { data: readRes } = await this.tlRequest({
                    url: '/api/web/user-read/update-user-group-apply-read',
                    method: 'post',
                    useCache: false,
                    data: params,
                })
                if(readRes.success){
                    this.updateApplyGroupInfo(data.id, {
                        hasRead: true
                    })
                }else{
                    this.popErrorMsg(readRes.msg)
                }
            }
        },
        /**
         * 打开好友信息
         * @param {*} data 
         */
        openContactInfo: function(data){
            this.$emit('right-module-change', 'content')

            // 通知兄弟子模块，数据变更
            this.emitSubModuleEvent({
                event: 'sub-module-contact-content-user-friend-data-change',
                data
            })

            // 打开右侧模块 - 处理移动端情况
            this.emitSubModuleEvent({
                event: 'sub-module-core-change-module-show',
                data: {
                    showRightModule: true,
                }
            })
        },
        /**
         * 获取群组列表
         * @returns 
         */
        getGroupList: async function(){
            const { data: groupRes } = await this.tlRequest({
                url: '/api/web/channel/get-group-channel-list',
                method: 'get',
                useCache: true,
                cacheTime: 10 * 1000
            })
            if(!groupRes.success){
                this.popErrorMsg(groupRes.msg)
                return
            }
            this.groupList = groupRes.data

            // 处理时间
            this.groupList.forEach(item => {
                if(item.createTime){
                    item.createTimeFormat = window.util.timeAgo(item.createTime)
                }
                if(item.joinTime){
                    item.joinTimeFormat = window.util.timeAgo(item.joinTime)
                }
            })

            this.$forceUpdate()
        },
        /**
         * 获取用户好友列表
         */
        getContactList: async function(){
            const { data: contactRes } = await this.tlRequest({
                url: '/api/web/user-friend/get-user-friend-list',
                method: 'get',
                useCache: true,
                cacheTime: 10 * 1000
            })
            if(!contactRes.success){
                this.popErrorMsg(contactRes.msg)
                return
            }
            this.contactList = contactRes.data

            // 处理时间
            this.contactList.forEach(item => {
                if(item.createTime){
                    item.createTimeFormat = window.util.timeAgo(item.createTime)
                }
            })

            this.$forceUpdate()
        },
        /**
         * 获取好友申请列表
         */
        getApplyContactList: async function(useCache = false){
            const { data: selfContactRes } = await this.tlRequest({
                url: '/api/web/user-apply/get-user-friend-self-apply-list',
                method: 'get',
                useCache: useCache,
                cacheTime: 10 * 1000
            })
            if(!selfContactRes.success){
                this.popErrorMsg(selfContactRes.msg)
                return
            }
            const selfContactList = selfContactRes.data

            const { data: otherContactRes } = await this.tlRequest({
                url: '/api/web/user-apply/get-user-friend-other-apply-list',
                method: 'get',
                useCache: useCache,
                cacheTime: 10 * 1000
            })
            if(!otherContactRes.success){
                this.popErrorMsg(otherContactRes.msg)
                return
            }
            const otherContactList = otherContactRes.data

            this.applyContactList = selfContactList.concat(otherContactList)

            // 按时间倒序排序
            this.applyContactList.sort((a, b) => {
                return new Date(b.createTime).getTime() - new Date(a.createTime).getTime()
            })

            // 处理时间
            this.applyContactList.forEach(item => {
                if(item.createTime){
                    item.createTimeFormat = window.util.timeAgo(item.createTime)
                }
            })

            this.$forceUpdate()

            // 更新联系人未读数量
            const unreadCount = this.applyContactList.filter(
                item => !item.hasRead
            ).length

            this.emitSubModuleEvent({
                event: 'sub-module-sidebar-unread-update',
                data: {
                    name: 'contact', type: 'all', count: unreadCount
                }
            })
        },
        /**
         * 获取群聊申请列表
         * @returns
         */
        getApplyGroupList: async function(useCache = false){
            const { data: selfGroupRes } = await this.tlRequest({
                url: '/api/web/user-apply/get-user-group-self-apply-list',
                method: 'get',
                useCache: useCache,
                cacheTime: 10 * 1000
            })
            if(!selfGroupRes.success){
                this.popErrorMsg(selfGroupRes.msg)
                return
            }
            const selfGroupList = selfGroupRes.data

            const { data: otherGroupRes } = await this.tlRequest({
                url: '/api/web/user-apply/get-user-group-other-apply-list',
                method: 'get',
                useCache: useCache,
                cacheTime: 10 * 1000
            })
            if(!otherGroupRes.success){
                this.popErrorMsg(otherGroupRes.msg)
                return
            }
            const otherGroupList = otherGroupRes.data

            this.applyGroupList = selfGroupList.concat(otherGroupList)

            // 按时间倒序排序
            this.applyGroupList.sort((a, b) => {
                return new Date(b.createTime).getTime() - new Date(a.createTime).getTime()
            })

            // 处理时间
            this.applyGroupList.forEach(item => {
                if(item.createTime){
                    item.createTimeFormat = window.util.timeAgo(item.createTime)
                }
            })

            this.$forceUpdate()

            // 更新联系人未读数量
            const unreadCount = this.applyGroupList.filter(
                item => !item.hasRead
            ).length

            this.emitSubModuleEvent({
                event: 'sub-module-sidebar-unread-update',
                data: {
                    name: 'contact', type: 'all', count: unreadCount
                }
            })
        },
        /**
         * 收到好友申请socket消息
         * @param {*} data 
         */
        contactApplySocketHandler: async function({
            callback
        }){
            await this.getApplyContactList()

            // 有浏览器系统桌面消息通知
            if(webNotify && window.Notification && Notification.permission === 'granted'){
                new Notification("好友申请提醒", {
                    body: '收到新的好友申请，快去看看吧',
                    dir: 'auto',
                    icon: '/image/default-avatar.png',
                })
            }

            callback && callback()
        },
        /**
         * 收到通过好友申请socket消息
         * @param {*} data
         */
        contactApplyPassSocketHandler: async function({
            callback
        }){
            await this.getApplyContactList()

            // 有浏览器系统桌面消息通知
            if(webNotify && window.Notification && Notification.permission === 'granted'){
                new Notification("好友申请提醒", {
                    body: 'ta通过了你的好友申请',
                    dir: 'auto',
                    icon: '/image/default-avatar.png',
                })
            }

            callback && callback()
        },
        /**
         * 收到拒绝好友申请socket消息
         * @param {*} data
         */
        contactApplyRejectSocketHandler: async function({
            callback
        }){
            await this.getApplyContactList()

            // 有浏览器系统桌面消息通知
            if(webNotify && window.Notification && Notification.permission === 'granted'){
                new Notification("好友申请提醒", {
                    body: 'ta拒绝了你的好友申请',
                    dir: 'auto',
                    icon: '/image/default-avatar.png',
                })
            }

            callback && callback()
        },
        /**
         * 收到群聊申请socket消息
         * @returns 
         */
        groupApplySocketHandler: async function(){
            await this.getApplyGroupList()

            // 有浏览器系统桌面消息通知
            if(webNotify && window.Notification && Notification.permission === 'granted'){
                new Notification("群聊申请提醒", {
                    body: '收到新的群聊申请，快去看看吧',
                    dir: 'auto',
                    icon: '/image/default-avatar.png',
                })
            }
        },
        /**
         * 收到通过群聊申请socket消息
         * @returns 
         */
        groupApplyPassSocketHandler: async function(){
            await this.getApplyGroupList()

            // 有浏览器系统桌面消息通知
            if(webNotify && window.Notification && Notification.permission === 'granted'){
                new Notification("群聊申请提醒", {
                    body: 'ta通过了你的群聊申请',
                    dir: 'auto',
                    icon: '/image/default-avatar.png',
                })
            }
        },
        /**
         * 收到拒绝群聊申请socket消息
         * @returns 
         */
        groupApplyRejectSocketHandler: async function(){
            await this.getApplyGroupList()

            // 有浏览器系统桌面消息通知
            if(webNotify && window.Notification && Notification.permission === 'granted'){
                new Notification("群聊申请提醒", {
                    body: 'ta拒绝了你的群聊申请',
                    dir: 'auto',
                    icon: '/image/default-avatar.png',
                })
            }
        },
        /**
         * 获取好友标签列表
         */
        getFriendTagList: async function(){
            const { data: tagRes } = await this.tlRequest({
                url: '/api/web/user-tag/get-friend-tag-list',
                method: 'get',
                useCache: true,
                cacheTime: 10 * 1000
            })
            if(!tagRes.success){
                this.popErrorMsg(tagRes.msg)
                return
            }

            if (tagRes.data.length > 0){
                this.tagList = this.tagList.concat(tagRes.data)
            }
        },
        /**
         * 用户搜索名称变更
         * @param {*} key
         */
        searchKeyChange: function({
            key, callback
        }){
            this.searchKey = key
            callback && callback()
        },
        /**
         * 获取所有好友列表
         * @param {*} callback
         */
        getAllContactList: function({
            callback
        }){
            return callback && callback(this.contactList)
        },
        /**
         * 打开群组信息
         * @param {*} data
         * @returns
         * */
        openGroupInfo: function(data){
            this.$emit('right-module-change', 'content')

            // 通知兄弟子模块，数据变更
            this.emitSubModuleEvent({
                event: 'sub-module-contact-content-group-data-change',
                data
            })

            // 打开右侧模块 - 处理移动端情况
            this.emitSubModuleEvent({
                event: 'sub-module-core-change-module-show',
                data: {
                    showRightModule: true,
                }
            })
        }
    },
    mounted: async function(){
        let that = this

        window.element.init();

        // 获取好友列表
        await this.getContactList()

        // 获取好友申请列表
        await this.getApplyContactList(true)

        // 获取群聊申请列表
        await this.getApplyGroupList(true)
        
        // 获取群组列表
        await this.getGroupList()

        // 获取好友标签列表
        await this.getFriendTagList()

        window.element.on('collapse()', function(data){});
    },
    created(){
        // 监听搜索用户名称
        window.subModule.$on('sub-module-contact-search-key-update', this.searchKeyChange)

        // 获取好友列表
        window.subModule.$on('sub-module-contact-list-get', this.getAllContactList)
        
        // 更新好友列表
        window.subModule.$on('sub-module-contact-list-update', this.updateContactList)

        // 更新好友申请记录列表
        window.subModule.$on('sub-module-apply-contact-list-update', this.updateApplyContactList)

        // 更新群聊申请记录列表
        window.subModule.$on('sub-module-apply-group-list-update', this.updateApplyGroupList)

        // 好友申请socket通知
        window.subModule.$on('sub-module-contact-apply-socket', this.contactApplySocketHandler)

        // 通过好友申请socket通知
        window.subModule.$on('sub-module-contact-apply-pass-socket', this.contactApplyPassSocketHandler)
        
        // 拒绝好友申请socket通知
        window.subModule.$on('sub-module-contact-apply-reject-socket', this.contactApplyRejectSocketHandler)

        // 群聊申请socket通知
        window.subModule.$on('sub-module-group-apply-socket', this.groupApplySocketHandler)

        // 通过群聊申请socket通知
        window.subModule.$on('sub-module-group-apply-pass-socket', this.groupApplyPassSocketHandler)

        // 拒绝群聊申请socket通知
        window.subModule.$on('sub-module-group-apply-reject-socket', this.groupApplyRejectSocketHandler)
    },
    template: `
        <div class="tl-rtc-app-left-panel-contact">
            <div class="layui-collapse">
                <div class="layui-colla-item">
                    <h2 class="layui-colla-title">好友申请记录 ({{filterApplyContactList.length}})</h2>
                    <div class="layui-colla-content">
                        <div class="tl-rtc-app-left-panel-contact-item"
                            v-for="item in filterApplyContactList"
                            @click="openApplyContactInfo(item)"
                        >
                            <div class="tl-rtc-app-left-panel-contact-item-img">
                                <img :src="item.userAvatar" alt="">
                            </div>
                            <div class="tl-rtc-app-left-panel-contact-item-content">
                                <div class="tl-rtc-app-left-panel-contact-item-content-nickname">
                                    {{item.username}}
                                </div>
                                <div class="tl-rtc-app-left-panel-contact-item-content-message">
                                    {{item.userApplyRemark}}
                                </div>
                            </div>
                            <div class="tl-rtc-app-left-panel-contact-item-other">
                                <div class="tl-rtc-app-left-panel-contact-item-other-status">
                                    {{item.status}}
                                </div>
                                <div class="tl-rtc-app-left-panel-contact-item-other-unread" v-if="!item.hasRead">
                                    <div class="layui-badge"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="layui-colla-item">
                    <h2 class="layui-colla-title">群聊申请记录 ({{filterApplyGroupList.length}})</h2>
                    <div class="layui-colla-content">
                        <div class="tl-rtc-app-left-panel-contact-item"
                            v-for="item in filterApplyGroupList"
                            @click="openApplyGroupInfo(item)"
                        >
                            <div class="tl-rtc-app-left-panel-contact-item-img">
                                <img :src="item.channelAvatar" alt="">
                            </div>
                            <div class="tl-rtc-app-left-panel-contact-item-content">
                                <div class="tl-rtc-app-left-panel-contact-item-content-nickname">
                                    {{item.channelName}}
                                </div>
                                <div class="tl-rtc-app-left-panel-contact-item-content-message">
                                    {{item.channelApplyRemark}}
                                </div>
                            </div>
                            <div class="tl-rtc-app-left-panel-contact-item-other">
                                <div class="tl-rtc-app-left-panel-contact-item-other-status">
                                    {{item.status}}
                                </div>
                                <div class="tl-rtc-app-left-panel-contact-item-other-unread" v-if="!item.hasRead">
                                    <div class="layui-badge"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="layui-colla-item">
                    <h2 class="layui-colla-title">我的群组 ({{filterGroupList.length}})</h2>
                    <div class="layui-colla-content">
                        
                        <div class="tl-rtc-app-left-panel-contact-item" 
                            v-for="item in filterGroupList"
                            @click="openGroupInfo(item)"
                        >
                            <div class="tl-rtc-app-left-panel-contact-item-img">
                                <img :src="item.channelAvatar" alt="">
                            </div>
                            <div class="tl-rtc-app-left-panel-contact-item-content">
                                <div class="tl-rtc-app-left-panel-contact-item-content-nickname">
                                    {{item.channelName}}
                                </div>
                                <div class="tl-rtc-app-left-panel-contact-item-content-state">
                                    <span>{{item.channelUserCount}}人</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="layui-colla-item">
                    <h2 class="layui-colla-title">我的好友 ({{filterContactList.length}})</h2>
                    <div class="layui-colla-content layui-show">
                        
                        <div class="tl-rtc-app-left-panel-contact-item" 
                            v-for="item in filterContactList"
                            @click="openContactInfo(item)"
                        >
                            <div class="tl-rtc-app-left-panel-contact-item-img">
                                <img :src="item.userAvatar" alt="">
                            </div>
                            <div class="tl-rtc-app-left-panel-contact-item-content">
                                <div class="tl-rtc-app-left-panel-contact-item-content-nickname">
                                    {{item.username}}
                                </div>
                                <div class="tl-rtc-app-left-panel-contact-item-content-state">
                                    <span v-if="item.loginStatus === 0">[离线]</span>
                                    <span v-else>[在线]</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
}

window.tl_rtc_app_module_contact_list = tl_rtc_app_module_contact_list