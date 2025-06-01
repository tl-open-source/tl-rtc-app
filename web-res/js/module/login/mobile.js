const tl_rtc_app_module_login_mobile = {
    props : {
        loginList : {
            type: Array,
            default: function(){
                return [];
            }
        },
        isMobile: {
            type: Boolean,
            default: false
        },
        loginedCacheList: {
            type: Array,
            default: function(){
                return [];
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
            selectedLoginedCache: {},
            scanCode: ''
        }
    },
    watch: {
        scanCode:{
            handler: async function(val){
                // 限制只能输入数字
                if(!/^\d+$/.test(val)){
                    this.scanCode = val.replace(/[^\d]/g, '')
                }

                // 限制只能输入6位数字
                if(val.length > 6){
                    this.scanCode = val.slice(0, 6)
                }

                // 输入6位数字后，自动登录
                if(val.length === 6){
                    await this.quickLogin()
                }
            }
        },
        leftModule: function (val) {
            
        },
        rightModule: function (val) {
            
        }
    },
    computed: {
        propsLoginList(){
            return this.loginList;
        },
        propsIsMobile(){
            return this.isMobile;
        },
        propsLoginedCacheList(){
            if (this.loginedCacheList.length > 0){
                this.chooseLoginedCache(this.loginedCacheList[0])
            }
            return this.loginedCacheList;
        },
        scanCodeDone(){
            return this.scanCode.length === 6
        },
        propsLeftModule() {
            return this.leftModule;
        },
        propsRightModule() {
            return this.rightModule;
        },
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
         * 打开登录项
         * @param {*} item 
         * @returns 
         */
        openLoginItem: function(item){
            if (![
                'account', 'email', 'scan'
            ].includes(item.type)){
                item.handler && item.handler.call(this)
                return
            }

            item.handler && item.handler.call(this)

            // 通知兄弟子模块，数据变更
            this.emitSubModuleEvent({
                event: 'sub-module-login-content-data-change',
                data: {
                    loginType : item.type
                }
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
         * 一键登录
         */
        quickLogin: async function(){
            const bfpData = await this.emitSubModuleEvent({
                event: 'component-bfp-info',
            })
            console.log("bfpData: ", bfpData)
            const {fps} = bfpData
            
            let params = {
                username: this.selectedLoginedCache.username,
                fps: fps,
            }
            if(!window.tl_rtc_app_comm.checkRequestParams(params)){
                this.popErrorMsg("请求参数非法")
                return
            }
            const { data: loginRes } = await this.tlRequest({
                url: '/api/web/user-login/login-by-fp',
                method: 'post',
                useCache: false,
                data: params,
                
            })
            if(loginRes.success){
                this.popSuccessMsg(loginRes.msg)
                window.location.reload()
            }else{
                this.popErrorMsg(loginRes.msg)
            }
        },
        /**
         * 选择登录过的帐号
         */
        chooseLoginedCache: function(item){
            this.selectedLoginedCache = item
        },
        /**
         * 清理常用帐号
         */
        cleanCacheAccount: function(){
            let that = this
            layer.confirm('确定清理常用帐号？', {
                title: '提示',
                btn: ['确定', '取消'],
                shadeClose: 1
            }, (index) => {
                layer.close(index)
                
                that.$emit('clean-cache-account')

                window.location.reload()
            })
        },
         /**
         * 初始化扫码输入框
         */
         initScanCodeInput: function(){
            let that = this

            const inputs = document.querySelectorAll('.tl-rtc-app-left-panel-login-body-scan-code-container-item');
            inputs.forEach((input, index) => {
                input.addEventListener('input', (e) => {
                    // 清除空格或非数字输入
                    input.value = input.value.replace(/\D/g, '');

                    if (input.value.length === 1 && index < inputs.length - 1) {
                        input.disabled = true;
                        inputs[index + 1].disabled = false;
                        inputs[index + 1].focus();
                    }

                    that.scanCode = Array.from(inputs).map(input => input.value).join('');
                });

                input.addEventListener('keydown', (e) => {
                    // 禁止空格键
                    if (e.key === ' ' || e.key === 'Spacebar') {
                        e.preventDefault();
                    }

                    if (e.key === 'Backspace' && index > 0) {
                        input.value = ''; // 清空当前输入框
                        input.disabled = true;
                        inputs[index - 1].disabled = false;
                        inputs[index - 1].focus();
                    }
                });

                input.addEventListener('focus', (e) => {
                    if (input.disabled) {
                        inputs[index].blur();
                    }
                });

                input.addEventListener('paste', (e) => {
                    const pasteData = e.clipboardData.getData('text').replace(/\D/g, ''); // 只保留数字
                    const pasteArray = pasteData.split('').slice(0, inputs.length - index);

                    pasteArray.forEach((char, idx) => {
                        if (inputs[index + idx]) {
                            inputs[index + idx].value = char;
                            if (index + idx < inputs.length - 1) {
                                inputs[index + idx].disabled = true;
                                inputs[index + idx + 1].disabled = false;
                            }
                        }
                    });

                    const lastFilledIndex = index + pasteArray.length - 1;
                    if (inputs[lastFilledIndex]) {
                        inputs[lastFilledIndex].focus();
                    }

                    e.preventDefault();
                });
            });
        },
        /**
         * 初始化二维码
         */
        initQrCode: function(){
            const { skinBodyBackground, skinBodyColor } = window.tl_rtc_app_comm.getPropertyValues([
                { key: "skinBodyBackground", value: "skin-body-background" },
                { key: "skinBodyColor", value: "skin-body-color" },
            ])
            
            const dom = document.getElementById('tl-rtc-app-left-panel-login-body-scan-mobile')
            if(dom){
                window.tl_rtc_app_comm.getQrCode(
                    "tl-rtc-app-left-panel-login-body-scan-mobile", "扫码登录", skinBodyColor, skinBodyBackground
                )
            }
        },
        loginHelp: function(){
            this.popWarningMsg("可加群联系开发人员")
        }
    },
    mounted() {
        this.initQrCode();

        this.initScanCodeInput();
    },
    template: `
        <div class="tl-rtc-app-left-panel-login-mobile">
            <div class="tl-rtc-app-left-panel-login-top-header-mobile">
                <div class="tl-rtc-app-left-panel-login-top-header-title-mobile">
                    欢迎回来
                </div>
            </div>

            <div class="tl-rtc-app-left-panel-login-body-mobile" v-if="propsLoginedCacheList.length">
                <div class="tl-rtc-app-left-panel-login-body-avatar-list-mobile">
                    <div class="tl-rtc-app-left-panel-login-body-avatar-mobile" 
                        v-for="(item, index) in propsLoginedCacheList"
                        @click="chooseLoginedCache(item)"
                    >   
                        <img :src="item.avatarUrl">
                        <div class="tl-rtc-app-left-panel-login-body-username">
                            <div>{{item.username}}</div>
                            <div class="layui-badge-dot layui-bg-orange" v-if='index === 0'>上次登录</div>
                            <svg class="icon" aria-hidden="true" v-show="selectedLoginedCache.userId == item.userId">
                                <use xlink:href="#tl-rtc-app-icon-70chenggong"></use>
                            </svg>
                        </div>
                    </div>
                </div>

                <div class="tl-rtc-app-left-panel-login-body-btns">
                    <button class="layui-btn" @click="quickLogin"> 
                        <b>一键登录</b>
                    </button>

                    <div class="tl-rtc-app-left-panel-login-body-clean" @click="cleanCacheAccount">清理常用帐号</div>
                </div>
            </div>

            <div v-else>
                <div class="tl-rtc-app-left-panel-login-body-mobile">
                    <div id="tl-rtc-app-left-panel-login-body-scan-mobile"></div>
                    <div class="tl-rtc-app-left-panel-login-body-scan-code-title-mobile">
                        <div>扫码输入6位动态码</div>
                    </div>
                    <div class="tl-rtc-app-left-panel-login-body-scan-code-container" v-if="!scanCodeDone">
                        <input type="text" maxlength="1" class="tl-rtc-app-left-panel-login-body-scan-code-container-item" id="mobile-code1" pattern="[0-9]*" inputmode="numeric"/>
                        <input type="text" maxlength="1" class="tl-rtc-app-left-panel-login-body-scan-code-container-item" id="mobile-code2" pattern="[0-9]*" inputmode="numeric" disabled />
                        <input type="text" maxlength="1" class="tl-rtc-app-left-panel-login-body-scan-code-container-item" id="mobile-code3" pattern="[0-9]*" inputmode="numeric" disabled />
                        <input type="text" maxlength="1" class="tl-rtc-app-left-panel-login-body-scan-code-container-item" id="mobile-code4" pattern="[0-9]*" inputmode="numeric" disabled />
                        <input type="text" maxlength="1" class="tl-rtc-app-left-panel-login-body-scan-code-container-item" id="mobile-code5" pattern="[0-9]*" inputmode="numeric" disabled />
                        <input type="text" maxlength="1" class="tl-rtc-app-left-panel-login-body-scan-code-container-item" id="mobile-code6" pattern="[0-9]*" inputmode="numeric" disabled />
                    </div>
                    <div style="padding: 50px 0px 15px;" v-else>
                        <svg class="icon layui-anim layui-anim-rotate layui-anim-loop" aria-hidden="true" style="width: 32px;height: 32px;">
                            <use xlink:href="#tl-rtc-app-icon-chulizhong"></use>
                        </svg>
                    </div>
                </div>
            </div>

            <div class="tl-rtc-app-left-panel-login-footer-mobile">
                <div class="tl-rtc-app-left-panel-login-item-mobile">
                    <div class="tl-rtc-app-left-panel-login-item-icon-mobile"
                        v-for="item in propsLoginList"
                        @click="openLoginItem(item)"
                    >
                        <svg class="icon" aria-hidden="true">
                            <use :xlink:href="item.svg"></use>
                        </svg>
                    </div>
                </div>

                <div class="tl-rtc-app-left-panel-login-help-mobile" @click="loginHelp">
                    登录遇到问题？
                </div>
            </div>
            
        </div>
    `,
}

window.tl_rtc_app_module_login_mobile = tl_rtc_app_module_login_mobile