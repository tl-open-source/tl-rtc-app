const tl_rtc_app_module_contact_top = {
    props : {
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
    watch: {
        searchKey : {
            deep: true,
            immediate: true,
            handler: function(cur, pre){
                this.emitSubModuleEvent({
                    event: 'sub-module-contact-search-key-update',
                    data: {
                        key: cur
                    }
                })
            }
        },
        leftModule: function (val) {
            
        },
        rightModule: function (val) {
            
        }
    },
    data : function(){
        return {
            searchKey : ''
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
         * 搜索用户
         * @param {*} callback  
         * */
        searchUser: async function({
            callback
        }){
            let that = this

            layer.prompt({
                formType: 0,
                title: "搜索用户",
                btn : ['确定', '取消'],
                value: "",
                shadeClose : true,
                maxlength : 15,
            }, async function (value, index, elem) {
                value = value.trim()
                if(value.length === 0){
                    that.popErrorMsg("请输入用户名称")
                    return false;
                }

                const params = {
                    name: value
                }
                if(!window.tl_rtc_app_comm.checkRequestParams(params)){
                    that.popErrorMsg("请求参数非法")
                    return
                }
                const { data: userRes } = await that.tlRequest({
                    url: '/api/web/user/search-user-by-name',
                    method: 'get',
                    useCache: false,
                    params: params,
                    
                })
                if(!userRes.success){
                    that.popErrorMsg(userRes.msg)
                    return false;
                }

                that.popSuccessMsg(userRes.msg)

                that.emitSubModuleEvent({
                    event: 'sub-module-contact-content-user-search-data-change',
                    data: userRes.data
                })

                layer.close(index)

                // 打开右侧模块 - 处理移动端情况
                that.emitSubModuleEvent({
                    event: 'sub-module-core-change-module-show',
                    data: {
                        showRightModule: true,
                    }
                })

                that.$emit('left-module-change', 'contact')
                that.$emit('right-module-change', 'content')

                return false
            });

            callback && callback()
        },
        /**
         * 打开快速操作面板
         */
        openQuickOperPanel: function(){
            this.emitSubModuleEvent({
                event: 'component-popup-add-quick-oper-panel',
            })
        }
    },
    mounted: function(){
        
    },
    created(){
        // 监听搜索用户事件
        window.subModule.$on('sub-module-contact-top-search-user', this.searchUser)
    },
    template: `
        <div class="tl-rtc-app-left-panel-contact-top">
            <div class="tl-rtc-app-left-panel-contact-top-header">
                <div class="tl-rtc-app-left-panel-contact-top-header-title">通讯好友</div>
                <div class="tl-rtc-app-left-panel-contact-top-header-tool">
                    <svg class="icon" aria-hidden="true" @click="openQuickOperPanel">
                        <use xlink:href="#tl-rtc-app-icon-tianjia"></use>
                    </svg>
                </div>
            </div>
            <div class="tl-rtc-app-left-panel-contact-top-search">
                <i class="layui-icon layui-icon-search"></i>
                <input type="text" autocomplete="off" placeholder="搜索好友" class="layui-input" maxlength="30"
                    v-model="searchKey"
                >
                <svg class="icon" aria-hidden="true" @click="searchKey = ''" v-show="searchKey.length > 0"> 
                    <use xlink:href="#tl-rtc-app-icon-cuowu"></use>
                </svg>
            </div>
        </div>
    `,
}

window.tl_rtc_app_module_contact_top = tl_rtc_app_module_contact_top