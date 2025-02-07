const tl_rtc_app_module_channel_content_invite = {
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
        socket: {
            type: Object,
            default: function(){
                return {}
            }
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
        propsSocket(){
            return this.socket;
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
    },
    watch:{
        leftModule: function (val) {
            
        },
        rightModule: function (val) {
            
        }
    },
    data : function(){
        return {
            // 选择的好友列表
            chooseUserFriendList : [],
            // 好友列表
            userFriendList: [],
            chooseFriendSwiper: null
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
         * laytpl渲染
         * @param {*} tpl_html 
         * @param {*} data
         * @param {*} tpl_view_html
         * @param {*} callback
         */
        tplRender: function ({tpl_html, data, tpl_view_html, callback}) {
            if (window.laytpl) {
                laytpl(tpl_html.innerHTML).render(data, (html) => {
                    tpl_view_html.innerHTML = html;
                    if (callback) {
                        callback()
                    }
                });
            }
        },
        /**
         * 好友列表渲染
         * @param {*} existUserIdList
         */
        userFriendListTplRender: async function(existUserIdList){
            let that = this
            let userFriendList = await this.emitSubModuleEvent({
                event: 'sub-module-contact-list-get',
            })

            userFriendList = userFriendList.map(user => {
                if(existUserIdList.includes(user.userId)){
                    user.disabled = true
                }else{
                    user.disabled = false
                }
                return user
            })

            this.userFriendList = userFriendList

            const userFriendListTpl = document.getElementById("user_friend_list_tpl")
            const userFriendListTplView = document.getElementById("user_friend_list_tpl_view")

            this.tplRender({
                tpl_html: userFriendListTpl,
                tpl_view_html: userFriendListTplView,
                data: userFriendList,
                callback: function(){
                    window.form.render()

                    const checkboxDoms = document.getElementsByClassName("layui-form-checkbox")
                    if(checkboxDoms){
                        for(let i = 0; i < checkboxDoms.length; i++){
                            const checkboxDom = checkboxDoms[i]
                            checkboxDom.parentElement.onclick = function(){
                                checkboxDom.click()
                            }
                        }
                    }

                    // 初始化频道列表swiper
                    new Swiper('#user_friend_list_tpl_view', {
                        slidesPerView: userFriendListTplView.clientHeight / 65,
                        direction: 'vertical',
                        loop: false,
                        observer: true,
                        mousewheel: true, // 鼠标滚轮控制
                        forceToAxis: true, // 滚动条只能在一个方向上拖动
                        freeMode: {
                            momentumRatio: 1, // 惯性动量比
                            momentumBounceRatio: 0, // 滑动反弹
                            minimumVelocity: 0, // 最小滑动速度
                        },
                        scrollbar: {
                            el: '#user-invite-swiper-scrollbar',
                            hide: true,
                        }
                    });
                }
            })
        },
        /**
         * 选择的好友列表渲染
         */
        chooseUserFriendListTplRender: function(){
            let that = this
            const chooseUserFriendListTpl = document.getElementById("choose_user_friend_list_tpl")
            const chooseUserFriendListTplView = document.getElementById("choose_user_friend_list_tpl_view")

            let slidesPerView = 0
            let direction = ''
            if(this.isMobile){
                slidesPerView = chooseUserFriendListTplView.clientWidth / 80 
                direction = 'horizontal'
            }else{
                slidesPerView = chooseUserFriendListTplView.clientHeight / 65
                direction = 'vertical'
            }

            this.tplRender({
                tpl_html: chooseUserFriendListTpl,
                tpl_view_html: chooseUserFriendListTplView,
                data: this.chooseUserFriendList,
                callback: function(){
                    new Swiper('#choose_user_friend_list_tpl_view', {
                        slidesPerView: slidesPerView,
                        direction: direction,
                        loop: false,
                        observer: true,
                        mousewheel: true, // 鼠标滚轮控制
                        forceToAxis: true, // 滚动条只能在一个方向上拖动
                        spaceBetween: 10,
                        freeMode: {
                            momentumRatio: 1, // 惯性动量比
                            momentumBounceRatio: 0, // 滑动反弹
                            minimumVelocity: 0, // 最小滑动速度
                        }
                    });
                    const titleDom = document.getElementsByClassName("tl-rtc-app-right-channel-content-invite-header-title")
                    if (titleDom && titleDom[0]){
                        titleDom[0].innerText = '已选择('+that.chooseUserFriendList.length+')人'
                    }
                }
            })
        },
        /**
         * 将checkbox事件绑定到删除按钮
         * @param {*} userId 
         */
        bindDeleteChooseUserFriend: function(userId){
            let deleteSvgDoms = document.getElementsByClassName("invite_remove_svg")
            let checkboxDoms = document.getElementsByClassName("layui-form-checkbox")

            for (let i = 0; i < deleteSvgDoms.length; i++) {
                const svgDom = deleteSvgDoms[i];
                const svgUid = svgDom.dataset["uId"]
                if(parseInt(svgUid) !== parseInt(userId)){
                    continue
                }

                // 找到对应的checkbox
                let hitCheckboxDom = null
                for(let j = 0; j < checkboxDoms.length; j++){
                    const checkboxDom = checkboxDoms[j]
                    const parentElement = checkboxDom.parentElement
                    if(!parentElement){
                        continue
                    }
                    const allChildNodes = parentElement.childNodes
                    if(!allChildNodes){
                        continue
                    }
                    for(let k = 0; k < allChildNodes.length; k++){
                        const childNode = allChildNodes[k]
                        if(childNode.tagName !== "INPUT"){
                            continue
                        }
                        if(childNode.name !== `user_${userId}`){
                            continue
                        }
                        hitCheckboxDom = childNode
                        break
                    }
                    if(hitCheckboxDom){
                        svgDom.onclick = checkboxDom.click()
                        break
                    }
                }
            }
        },
        /**
         * 打开pc选择面板
         */
        operPcInviteChannelUser: async function({
            existUserIdList = []
        }){            
            let that = this;

            await new Promise(resolve => {
                layer.open({
                    type: 1,
                    closeBtn: that.isMobile ? 1 : 0,
                    fixed: true,
                    maxmin: false,
                    shadeClose: true,
                    shade: 0.4,
                    title: false,
                    area: ['550px', '450px'],
                    btn: ['确定', '取消'],
                    skin: 'tl-rtc-app-layer-channel-invite',
                    success: async function (layero, index) {
                        layero.find(".layui-layer-content").css({
                            "overflow": "hidden",
                        })

                        layero.css({
                            "border-radius": "6px",
                        })
                        
                        document.getElementById('user_friend_list_tpl_view').style.height = '340px'
                        document.getElementById('choose_user_friend_list_tpl_view').style.height = '340px'

                        // 渲染用户列表
                        await that.userFriendListTplRender(existUserIdList)

                        resolve()
                    },
                    end: function(){
                        that.chooseUserFriendList = []
                    },
                    yes: async function(index){
                        await that.confirmInvite(index)
                    },
                    content: `
                        <div class="tl-rtc-app-right-channel-content-invite">
                            <div class="tl-rtc-app-right-channel-content-invite-header">
                                <div class="tl-rtc-app-right-channel-content-invite-header-search">
                                    <i class="layui-icon layui-icon-search"></i>
                                    <input type="text" autocomplete="off" placeholder="搜索" class="layui-input" maxlength="30">
                                </div>
                                <div class="tl-rtc-app-right-channel-content-invite-header-title">
                                    已选择(0)人
                                </div>
                            </div>
                            <div class="tl-rtc-app-right-channel-content-invite-body">
                                <div class="tl-rtc-app-right-channel-content-invite-source-list swiper layui-form" id="user_friend_list_tpl_view"></div>
                                <script id="user_friend_list_tpl" type="text/html">
                                    <div class="swiper-wrapper">
                                        {{# layui.each(d, function(index, user){ }}
                                            <div class="tl-rtc-app-right-channel-content-invite-source-list-item swiper-slide">
                                                {{# if(user.disabled){ }}
                                                    <input type="checkbox" name="user_{{user.userId}}" lay-skin="primary" checked disabled>
                                                {{# }else{ }}
                                                    <input type="checkbox" name="user_{{user.userId}}" lay-skin="primary">
                                                {{# } }}
                                                <img class="tl-rtc-app-right-channel-content-invite-list-item-avatar" src="{{user.userAvatar}}" alt="">
                                                <div class="tl-rtc-app-right-channel-content-invite-list-item-username">{{user.username}}</div>
                                            </div>
                                        {{# }); }}
                                    </div>
                                    <div class="swiper-scrollbar" id="user-invite-swiper-scrollbar"></div>
                                </script>
 
                                <div class="tl-rtc-app-right-channel-content-invite-choose-list swiper layui-form" id="choose_user_friend_list_tpl_view">
                                    <div class="tl-rtc-app-right-channel-content-invite-choose-list-empty">请选择好友</div>
                                </div>
                                <script id="choose_user_friend_list_tpl" type="text/html">
                                    <div class="swiper-wrapper">
                                        {{# layui.each(d, function(index, user){ }}
                                            <div class="tl-rtc-app-right-channel-content-invite-choose-list-item swiper-slide">
                                                <img class="tl-rtc-app-right-channel-content-invite-list-item-avatar" src="{{user.userAvatar}}" alt="">
                                                <div class="tl-rtc-app-right-channel-content-invite-list-item-username">{{user.username}}</div>
                                                <svg class="icon invite_remove_svg" aria-hidden="true" data-u-id="{{user.userId}}" onclick="removeInviteChooseUserFriend({{user.userId}})">
                                                    <use xlink:href="#tl-rtc-app-icon-71shibai"></use>
                                                </svg>
                                            </div>
                                        {{# }); }}
                                    </div>
                                </script>
                            </div>
                        </div>
                    `
                })
            })
        },
        /**
         * 打开mobile选择面板
         */
        operMobileInviteChannelUser: async function({
            existUserIdList = []
        }){            
            let that = this;

            await new Promise(resolve => {
                layer.open({
                    type: 1,
                    closeBtn: that.isMobile ? 1 : 0,
                    fixed: true,
                    maxmin: false,
                    shadeClose: true,
                    shade: 0.4,
                    title: '邀请好友',
                    area: ['100%', '100%'],
                    btn: ['确定', '取消'],
                    skin: 'tl-rtc-app-layer-channel-invite',
                    success: async function (layero, index) {
                        layero.find(".layui-layer-content").css({
                            "overflow": "hidden",
                        })
                        
                        document.getElementById('choose_user_friend_list_tpl_view').style.height = '80px'
                        document.getElementById('choose_user_friend_list_tpl_view').style.width = layero[0].clientWidth + 'px'

                        document.getElementById('user_friend_list_tpl_view').style.height = layero[0].clientHeight - 241 + 'px'

                        // 渲染用户列表
                        await that.userFriendListTplRender(existUserIdList)

                        resolve()
                    },
                    end: function(){
                        that.chooseUserFriendList = []
                    },
                    yes: async function(index){
                        await that.confirmInvite(index)
                    },
                    content: `
                        <div class="tl-rtc-app-right-channel-content-invite-mobile">
                            <div class="tl-rtc-app-right-channel-content-invite-header">
                                <div class="tl-rtc-app-right-channel-content-invite-header-search">
                                    <i class="layui-icon layui-icon-search"></i>
                                    <input type="text" autocomplete="off" placeholder="搜索" class="layui-input" maxlength="30">
                                </div>
                            </div>
                            <div class="tl-rtc-app-right-channel-content-invite-body-mobile">
                                <div class="tl-rtc-app-right-channel-content-invite-source-list swiper layui-form"
                                    id="user_friend_list_tpl_view" style="border-top: 1px solid #efe3e3;">
                                </div>
                                <script id="user_friend_list_tpl" type="text/html">
                                    <div class="swiper-wrapper">
                                        {{# layui.each(d, function(index, user){ }}
                                            <div class="tl-rtc-app-right-channel-content-invite-source-list-item swiper-slide">
                                                {{# if(user.disabled){ }}
                                                    <input type="checkbox" name="user_{{user.userId}}" lay-skin="primary" checked disabled>
                                                {{# }else{ }}
                                                    <input type="checkbox" name="user_{{user.userId}}" lay-skin="primary">
                                                {{# } }}
                                                <img class="tl-rtc-app-right-channel-content-invite-list-item-avatar" src="{{user.userAvatar}}" alt="">
                                                <div class="tl-rtc-app-right-channel-content-invite-list-item-username">{{user.username}}</div>
                                            </div>
                                        {{# }); }}
                                    </div>
                                    <div class="swiper-scrollbar" id="user-invite-swiper-scrollbar"></div>
                                </script>
 
                                <div class="tl-rtc-app-right-channel-content-invite-choose-list swiper layui-form"
                                    id="choose_user_friend_list_tpl_view">
                                    <div class="tl-rtc-app-right-channel-content-invite-choose-list-empty">请选择好友</div>
                                </div>
                                <script id="choose_user_friend_list_tpl" type="text/html">
                                    <div class="swiper-wrapper">
                                        {{# layui.each(d, function(index, user){ }}
                                            <div class="tl-rtc-app-right-channel-content-invite-choose-list-item swiper-slide">
                                                <img class="tl-rtc-app-right-channel-content-invite-list-item-avatar" src="{{user.userAvatar}}" alt="">
                                                <div class="tl-rtc-app-right-channel-content-invite-list-item-username">{{user.username}}</div>
                                                <svg class="icon invite_remove_svg" aria-hidden="true" data-u-id="{{user.userId}}" onclick="removeInviteChooseUserFriend({{user.userId}})">
                                                    <use xlink:href="#tl-rtc-app-icon-71shibai"></use>
                                                </svg>
                                            </div>
                                        {{# }); }}
                                    </div>
                                </script>
                            </div>
                        </div>
                    `
                })
            })
        },
        /**
         * 打开面板
         * @param {*} existUserIdList 
         */
        operInviteChannelUser: async function({
            existUserIdList = [], callback
        }){
            if(this.isMobile){
                await this.operMobileInviteChannelUser({
                    existUserIdList
                })
            }else{
                await this.operPcInviteChannelUser({
                    existUserIdList
                })
            }

            callback && callback()
        },
        /**
         * 确定邀请列表
         * @returns 
         */
        confirmInvite: async function(index){
            let that = this;

            const userIdList = this.chooseUserFriendList.map(user => user.userId)

            if(userIdList.length === 0){
                this.popWarningMsg('请选择好友')
                return
            }

            const params = {
                channelId: this.channelId,
                userIdList: userIdList
            }
            if(!window.tl_rtc_app_comm.checkRequestParams(params)){
                this.popErrorMsg("请求参数非法")
                return
            }
            const { data: addUserRes } = await this.tlRequest({
                url: '/api/web/channel-user/add-channel-user-list-normal',
                method: 'post',
                useCache: false,
                data: params,
            })
            if (!addUserRes.success) {
                this.popErrorMsg(addUserRes.msg)
                layer.close(index)
                return
            }

            layer.close(index)

            await this.emitSubModuleEvent({
                event: 'sub-module-channel-content-add-invite-message',
                data: {
                    addMessage: addUserRes.data
                }
            })

            await this.emitSubModuleEvent({
                event: 'sub-module-channel-list-update-channel',
                data: {
                    channelId: this.channelId,
                    update_types: ['channelInfo', 'channelUserList', 'channelMessageList'],
                }
            })

            // this.emitSubModuleEvent({
            //     event: 'sub-module-channel-list-item-open',
            //     data: {
            //         channelId: this.channelId
            //     }
            // })

            this.popSuccessMsg(addUserRes.msg)
        },
        /**
         * 更新选择的好友列表
         */
        listenUpdateChooseUserFriendList: function(){
            let that = this
            window.form.on('checkbox', function(data){
                const userId = data.elem.name.split("_")[1]
                const user = that.userFriendList.find(user => user.userId === parseInt(userId))
                if (!user) {
                    return
                }
                if(data.elem.checked){
                    const exist = that.chooseUserFriendList.find(user => user.userId === parseInt(userId))
                    if(!exist){
                        that.chooseUserFriendList.push({
                            channelId : user.channelId,
                            userId: user.userId,
                            userAvatar: user.userAvatar,
                            username: user.username
                        })
                        that.chooseUserFriendListTplRender()
                    }
                }else{
                    that.chooseUserFriendList = that.chooseUserFriendList.filter(user => {
                        return user.userId !== parseInt(userId)
                    })
                    that.chooseUserFriendListTplRender()
                }
            })

        }
    },
    mounted() {
        // 监听更新选择的好友列表
        this.listenUpdateChooseUserFriendList()
    },
    created(){
        // 监听频道邀请事件
        window.subModule.$on('sub-module-channel-invite-open', this.operInviteChannelUser);

        // 移除选择的好友
        window.removeInviteChooseUserFriend = this.bindDeleteChooseUserFriend
    },
    updated() {
        
    },
}

window.tl_rtc_app_module_channel_content_invite = tl_rtc_app_module_channel_content_invite