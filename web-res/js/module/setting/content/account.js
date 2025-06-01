const tl_rtc_app_module_setting_content_account = {
    props: {
        socket: {
            type: Object,
            default: null
        },
        isMobile: {
            type: Boolean,
            default: false
        },
        accountSetting: {
            type: Object,
            default: {
                notAcceptFriendApply: false,
                autoPassFriendApply: false,
                notAllowSearchAccount: true,
            }
        },
        user: {
            type: Object,
            default: null
        },
        company: {
            type: Object,
            default: null
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
        propsAccountSetting(){
            return this.accountSetting;
        },
        propsUser(){
            return this.user
        },
        propsCompany(){
            return this.company
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
            settingFields: [
                'notAcceptFriendApply',
                'autoPassFriendApply',
                'notAllowSearchAccount',
            ],
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
         * 获取设置字段数据
         * @returns 
         */
        getSettingFieldsData: function(){
            let that = this
            let returnData = {}
            this.settingFields.forEach((item) => {
                returnData[item] = that.propsAccountSetting[item]
            })
            return returnData
        },
        /**
         * 更新帐号设置
         */
        updateAccountSetting(){
            this.$emit('update-user-config-account', this.getSettingFieldsData());
        },
        /**
         * 选择头像回调
         * @param {*} cur_file 
         */
        uploadAvatarCallback: async function(cur_file){
            if (cur_file.size > 1024 * 1024 * 5) {
                this.popWarningMsg("文件大小不能超过5M")
                return
            }

            // 上传文件
            let formData = new FormData();
            formData.append('file', cur_file);

            const { data: uploadRes } = await this.tlRequest({
                url: '/api/web/cloud-file/upload-file',
                method: 'post',
                useCache: false,
                data: formData,
                headers: {'Content-Type': 'multipart/form-data'},
            })

            if(!uploadRes.success){    
                this.popErrorMsg(uploadRes.msg)
                return
            }

            const cloudFileId = uploadRes.data.cloudFileId
            if(!cloudFileId){
                this.popErrorMsg("更新失败")
                return
            }

            let params = {
                cloudFileId: cloudFileId
            }
            if(!window.tl_rtc_app_comm.checkRequestParams(params)){
                this.popErrorMsg("请求参数非法")
                return
            }
            // 更新用户头像
            const { data: updateRes } = await this.tlRequest({
                url: '/api/web/user/update-user-avatar',
                method: 'post',
                useCache: false,
                data: params,
            })

            if(!updateRes.success){
                this.popErrorMsg(updateRes.msg)
                return
            }

            this.popSuccessMsg(updateRes.msg)

            setTimeout(() => {
                window.location.reload()
            }, 100);
        },
        /**
         * 绑定手机号
         */
        bindMobile: function(){
            this.popWarningMsg("暂未开放")
        },
        /**
         * 绑定邮箱
         * @param {*} isChange
         */
        bindEmail: function(isChange){
            let that = this
            layer.open({
                type: 1,
                title: isChange ? '换绑邮箱': '绑定邮箱',
                area: this.propsIsMobile ? ['90%']:  ['400px', '280px'],
                btn: ['确定', '取消'],
                shadeClose: true,
                content: `
                    <div class="tl-rtc-app-right-setting-content-account-bind-email" id="tl-rtc-app-setting-bind-email-layer">
                        <div class="tl-rtc-app-right-setting-content-account-bind-email-item">
                            <div class="tl-rtc-app-right-setting-content-account-bind-email-item-oper">
                                <input v-model="email" type="text" id="bindEmail" class="layui-input" placeholder="请输入邮箱" maxlength="50" />
                            </div>
                        </div>
                        <div class="tl-rtc-app-right-setting-content-account-bind-email-item">
                            <div class="tl-rtc-app-right-setting-content-account-bind-email-item-oper">
                                <input v-model="code" type="text" id="bindEmailCode" class="layui-input" placeholder="请输入验证码" maxlength="6" />
                                <button class="layui-btn layui-btn-sm tl-rtc-app-right-setting-content-account-bind-email-item-oper-disabled" v-if="noEmail">
                                    获取验证码
                                </button>
                                <button class="layui-btn layui-btn-sm" v-if="!noEmail && !waitGetCode" @click="getEmailCode">
                                    获取验证码
                                </button>
                                <button class="layui-btn layui-btn-sm tl-rtc-app-right-setting-content-account-bind-email-item-oper-disabled" v-if="waitGetCode">
                                    {{ getCodeTime }}s后获取
                                </button>
                            </div>
                        </div>
                    </div>
                `,
                success: (layero, index) => {
                    layero.css({
                        'border-radius': '6px'
                    })

                    new Vue({
                        el: '#tl-rtc-app-setting-bind-email-layer',
                        data: function(){
                            return {
                                email: '',
                                code: '',
                                timer: null,
                                getCodeTime: 0
                            }
                        },
                        computed: {
                            noEmail(){
                                return this.email.trim() === ''
                            },
                            waitGetCode(){
                                return this.getCodeTime > 0
                            },
                        },
                        methods: {
                            getEmailCode: async function(){
                                let _that = this
                                if(!this.email){
                                    this.popWarningMsg("请输入邮箱")
                                    return
                                }
        
                                if(window.tl_rtc_app_comm.isEmail(this.email) === false){
                                    this.popWarningMsg("邮箱格式不正确")
                                    return
                                }
        
                                let params = {
                                    email: this.email
                                }
        
                                if (this.getCodeTime > 0) {
                                    return
                                }
                    
                                this.getCodeTime = 60
          
                                if(!window.tl_rtc_app_comm.checkRequestParams(params)){
                                    this.popErrorMsg("请求参数非法")
                                    return
                                }
                                const { data: codeRes } = await this.tlRequest({
                                    url: '/api/web/user-register/get-email-code',
                                    method: 'post',
                                    useCache: false,
                                    data: params,
                                })
        
                                if(!codeRes.success){
                                    this.popErrorMsg(codeRes.msg)
                                    return
                                }
        
                                this.popSuccessMsg(codeRes.msg)
        
                                this.timer = setInterval(() => {
                                    _that.getCodeTime--
                                    if(_that.getCodeTime <= 0){
                                        clearInterval(_that.timer)
                                        _that.getCodeTime = 0
                                        return
                                    }
                                }, 1000)
                            }
                        },
                        mounted(){

                        }
                    })
                },
                yes: async (index, layero) => {
                    const email = $('#bindEmail').val()
                    const code = $('#bindEmailCode').val()
                    if(!email || !code){
                        that.popWarningMsg("请输入邮箱和验证码")
                        return
                    }

                    if(window.tl_rtc_app_comm.isEmail(email) === false){
                        that.popWarningMsg("邮箱格式不正确")
                        return
                    }

                    if(code.length > 6){
                        that.popWarningMsg("验证码格式不正确")
                        return
                    }

                    let params = {
                        email: Base64.encode(email),
                        code: code
                    }
                    
                    if(!window.tl_rtc_app_comm.checkRequestParams(params)){
                        that.popErrorMsg("请求参数非法")
                        return
                    }
                    const { data: bindRes } = await that.tlRequest({
                        url: '/api/web/user/bind-email',
                        method: 'post',
                        useCache: false,
                        data: params,
                    })

                    if(!bindRes.success){
                        that.popErrorMsg(bindRes.msg)
                        return
                    }

                    that.popSuccessMsg(bindRes.msg)
                    layer.close(index)

                    setTimeout(() => {
                        window.location.reload()
                    }, 100);
                },
            })
        },
        /**
         * 绑定微信
         */
        bindWx: function(){
            this.popWarningMsg("暂未开放")
        },
        mouseEnter: function (event, title) {
            tl_rtc_app_comm.mouseEnterTips({
                id: event.target.id,
                text: title,
                position: 'top',
                time: 30000
            });
        },
        mouseLeave: function () {
            tl_rtc_app_comm.mouseLeaveTips();
        },
    },
    mounted() {
        let that = this
        window.form.render();
        
        window.form.val('accountSettingContent', this.getSettingFieldsData())

        window.form.on('switch', function(data){
            if(that.settingFields.includes(data.elem.name)){
                that.propsAccountSetting[data.elem.name] = data.elem.checked
                that.updateAccountSetting()
            }
        });

        upload.render({
            elem: '.tl-rtc-app-right-setting-content-account-block-item-avatar', //绑定元素
            url: '/api/web/cloud-file/upload-file',
            accept: 'images',
            method: 'post',
            auto: false,
            choose: async function(obj){
                const files = Object.values(obj.pushFile())
                await that.uploadAvatarCallback(files[0])
                obj.clearAllFile()
            }
        });
    },
    updated() {
        window.form.render();

        window.form.val('accountSettingContent', this.getSettingFieldsData())
    },
    template: `
        <div style="padding: 5px 0px;height: 100%;">
            <div class="tl-rtc-app-right-setting-content-top">
                <div class="tl-rtc-app-right-setting-content-top-title">
                    帐号相关设置
                </div>
            </div>
            <div class="tl-rtc-app-right-setting-content-account layui-form" lay-filter="accountSettingContent">
                <div class="tl-rtc-app-right-setting-content-account-block">
                    <div class="tl-rtc-app-right-setting-content-account-block-title">个人信息设置</div>
                    <div class="tl-rtc-app-right-setting-content-account-block-content">

                        <div class="tl-rtc-app-right-setting-content-account-block-item">
                            <div class="tl-rtc-app-right-setting-content-account-block-item-title"> 企业/组织 </div>
                            <div class="tl-rtc-app-right-setting-content-account-block-item-oper">
                                <span style="font-weight: bold;">{{propsCompany.name}}</span>
                            </div>
                        </div>

                        <div class="tl-rtc-app-right-setting-content-account-block-item">
                            <div class="tl-rtc-app-right-setting-content-account-block-item-title"> 帐号 </div>
                            <div class="tl-rtc-app-right-setting-content-account-block-item-oper">
                                <span style="font-weight: bold;">{{propsUser.username}}</span>
                            </div>
                        </div>

                         <div class="tl-rtc-app-right-setting-content-account-block-item">
                            <div class="tl-rtc-app-right-setting-content-account-block-item-title"> 头像 </div>
                            <div class="tl-rtc-app-right-setting-content-account-block-item-oper">
                                <div class="tl-rtc-app-right-setting-content-account-block-item-avatar">
                                    <img :src="propsUser.userAvatar" />
                                </div>
                            </div>
                        </div>
                        
                        <div class="tl-rtc-app-right-setting-content-account-block-item" v-show="false">
                            <div class="tl-rtc-app-right-setting-content-account-block-item-title"> 绑定手机 </div>
                            <div class="tl-rtc-app-right-setting-content-account-block-item-oper">
                                <span v-if="propsUser.mobile">{{propsUser.mobile}}</span>
                                <a v-else class="tl-rtc-app-right-setting-content-account-block-item-go-bind-mobile" @click="bindMobile">
                                    <svg class="icon tl-rtc-app-right-setting-content-account-block-item-go-bind-tips" aria-hidden="true">
                                        <use xlink:href="#tl-rtc-app-icon-jinggao"></use>
                                    </svg>
                                    <span>去绑定</span>
                                    <svg class="icon" aria-hidden="true">
                                        <use xlink:href="#tl-rtc-app-icon-xiangyou1"></use>
                                    </svg>
                                </a>
                            </div>
                        </div>

                        <div class="tl-rtc-app-right-setting-content-account-block-item">
                            <div class="tl-rtc-app-right-setting-content-account-block-item-title"> 绑定邮箱 </div>
                            <div class="tl-rtc-app-right-setting-content-account-block-item-oper">
                                <span v-if="propsUser.userEmail">
                                    {{propsUser.userEmail}}
                                    <a @click="bindEmail(true)" style="cursor: pointer;" class="tl-rtc-app-right-setting-content-account-block-item-go-bind-email">
                                        <svg class="icon tl-rtc-app-right-setting-content-account-block-item-go-bind-tips" aria-hidden="true">
                                            <use xlink:href="#tl-rtc-app-icon-chulizhong"></use>
                                        </svg>
                                        点击换绑
                                    </a>
                                </span>
                                <a v-else class="tl-rtc-app-right-setting-content-account-block-item-go-bind-email" @click="bindEmail">
                                    <svg class="icon tl-rtc-app-right-setting-content-account-block-item-go-bind-tips" aria-hidden="true">
                                        <use xlink:href="#tl-rtc-app-icon-jinggao"></use>
                                    </svg>
                                    <span>去绑定</span>
                                    <svg class="icon" aria-hidden="true">
                                        <use xlink:href="#tl-rtc-app-icon-xiangyou1"></use>
                                    </svg>
                                </a>
                            </div>
                        </div>

                        <div class="tl-rtc-app-right-setting-content-account-block-item" v-show="false">
                            <div class="tl-rtc-app-right-setting-content-account-block-item-title"> 绑定微信 </div>
                            <div class="tl-rtc-app-right-setting-content-account-block-item-oper">
                                <span v-if="propsUser.wchatName">{{propsUser.wchatName}}</span>
                                <a v-else class="tl-rtc-app-right-setting-content-account-block-item-go-bind-wx" @click="bindWx">
                                    <svg class="icon tl-rtc-app-right-setting-content-account-block-item-go-bind-tips" aria-hidden="true">
                                        <use xlink:href="#tl-rtc-app-icon-jinggao"></use>
                                    </svg>
                                    <span>去绑定</span>
                                    <svg class="icon" aria-hidden="true">
                                        <use xlink:href="#tl-rtc-app-icon-xiangyou1"></use>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="tl-rtc-app-right-setting-content-account-block">
                    <div class="tl-rtc-app-right-setting-content-account-block-title">好友申请设置</div>
                    <div class="tl-rtc-app-right-setting-content-account-block-content">
                    <div class="tl-rtc-app-right-setting-content-account-block-item">
                        <div class="tl-rtc-app-right-setting-content-account-block-item-title">     
                            不允许被他人搜索 
                            <svg class="icon" aria-hidden="true"
                                id="tl-rtc-app-setting-account-not-allow-search-account"
                                @mouseenter="mouseEnter($event, '其他用户将无法通过搜索功能找到您')"
                                @mouseleave="mouseLeave"
                            >
                                <use xlink:href="#tl-rtc-app-icon-tishi"></use>
                            </svg>
                        </div>
                        <div class="tl-rtc-app-right-setting-content-account-block-item-oper">
                            <input type="checkbox" name="notAllowSearchAccount" lay-skin="switch">
                        </div>
                    </div>
                        <div class="tl-rtc-app-right-setting-content-account-block-item">
                            <div class="tl-rtc-app-right-setting-content-account-block-item-title"> 
                                不接受好友申请 
                                <svg class="icon" aria-hidden="true"
                                    id="tl-rtc-app-setting-account-not-accept-friend-apply"
                                    @mouseenter="mouseEnter($event, '其他用户将无法添加您为好友')"
                                    @mouseleave="mouseLeave"
                                >
                                    <use xlink:href="#tl-rtc-app-icon-tishi"></use>
                                </svg>
                            </div>
                            <div class="tl-rtc-app-right-setting-content-account-block-item-oper">
                                <input type="checkbox" name="notAcceptFriendApply" lay-skin="switch">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
}

window.tl_rtc_app_module_setting_content_account = tl_rtc_app_module_setting_content_account