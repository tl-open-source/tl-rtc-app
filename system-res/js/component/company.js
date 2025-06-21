Vue.component('company-component', {
    props: {
        isLogin: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            companyTable: null,     // 企业表格实例
            companyDialog: null,    // 企业编辑对话框
            companyForm: {          // 企业表单数据
                id: 0,              // 0表示新增，其他表示编辑
                code: '',
                name: '',
                address: '',
                phone: '',
                email: '',
                website: '',
                logo: '',
                description: '',
                expiredStatus: false,
                authStatus: false,
                openRegister: false,
                createTime: ''
            },
            companySearch: {        // 企业搜索条件
                keyword: '',
            }
        };
    },
    methods: {
        /**
         * 初始化企业管理模块
         */
        init: async function() {
            if (!this.isLogin) return;
            
            try {
                await this.initCompanyTable();
                
                this.$nextTick(() => {
                    form.render();
                });
            } catch (error) {
                console.error('初始化企业管理失败:', error);
                this.popErrorMsg('初始化企业管理失败，请刷新重试');
            }
        },
        
        /**
         * 初始化企业管理表格
         */
        initCompanyTable: function() {
            if (this.companyTable) {
                this.companyTable.reload();
                return;
            }
            
            const that = this;
            this.companyTable = table.render({
                elem: '#company-table',
                url: '/api/web/system-web-company/get-company-list',
                method: 'get',
                where: {
                    keyword: this.companySearch.keyword
                },
                page: true,
                cols: [[
                    {field: 'id', title: 'ID', width: 60, sort: true, fixed: 'left'},
                    {field: 'code', title: '邀请码', width: 120, fixed: 'left'},
                    {field: 'name', title: '企业名称', width: 250},
                    {field: 'phone', title: '联系电话', width: 150},
                    {field: 'email', title: '企业邮箱', width: 150},
                    {field: 'website', title: '企业网站', width: 150},
                    {field: 'description', title: '企业描述', width: 180},
                    // {
                    //     field: 'authStatus', 
                    //     title: '认证状态', 
                    //     width: 100,
                    //     templet: function(d){
                    //         return `
                    //             <input disabled
                    //                 type="checkbox" 
                    //                 name="authStatus" 
                    //                 lay-skin="switch" 
                    //                 lay-text="已认证|未认证" 
                    //                 lay-filter="company-auth-filter" 
                    //                 ${d.authStatus ? 'checked' : ''} 
                    //                 value="${d.id}" 
                    //             >
                    //         `;
                    //     }
                    // },
                    {
                        field: 'createTime', 
                        title: '创建时间',
                        sort: true,
                        templet: function(d) {
                            return window.util.timeAgo(d.createTime);
                        }
                    },
                    {fixed: 'right', title: '操作', toolbar: '#company-table-ops', width: 90}
                ]],
                parseData: function(res) {
                    if (!res.success) {
                        this.popErrorMsg(res.msg || '获取企业列表失败');
                        return {
                            "code": 1,
                            "msg": res.msg || '获取企业列表失败',
                            "count": 0,
                            "data": []
                        };
                    }
                    return {
                        "code": 0,
                        "msg": "",
                        "count": res.data.count,
                        "data": res.data.list
                    };
                },
            });
            
            // 监听表格工具条
            table.on('tool(company-table)', function(obj) {
                const data = obj.data;
                const event = obj.event;
                
                if (event === 'edit') {
                    that.showEditCompanyDialog(data);
                } else if (event === 'del') {
                    that.deleteCompany(data.id);
                }
            });
            
            // 监听认证状态切换
            form.on('switch(company-auth-filter)', function(data) {
                const companyId = parseInt(data.value);
                const checked = data.elem.checked;
                that.updateCompanyAuthStatus(companyId, checked);
            });
        },
        
        /**
         * 搜索企业
         */
        searchCompanies: function() {
            if (!this.companyTable) {
                this.initCompanyTable();
                return;
            }
            
            this.companyTable.reload({
                where: {
                    keyword: this.companySearch.keyword
                },
                page: {
                    curr: 1
                }
            });
        },
        
        /**
         * 显示添加企业对话框
         */
        showAddCompanyDialog: function() {
            // 重置表单
            this.companyForm = {
                id: 0,
                code: '',
                name: '',
                address: '',
                phone: '',
                email: '',
                website: '',
                logo: '',
                description: '',
                expiredStatus: false,
                authStatus: false,
                openRegister: false
            };
            
            this.showCompanyDialog('添加企业');
        },
        
        /**
         * 显示编辑企业对话框
         * @param {Object} company 企业数据
         */
        showEditCompanyDialog: function(company) {
            // 填充表单
            this.companyForm = {
                id: company.id,
                code: company.code,
                name: company.name,
                address: company.address || '',
                phone: company.phone || '',
                email: company.email || '',
                website: company.website || '',
                logo: company.logo || '',
                description: company.description || '',
                authStatus: company.authStatus || false,
                expiredStatus: company.expiredStatus || false,
                openRegister: company.openRegister || false
            };
            
            this.showCompanyDialog('编辑企业');
        },
        
        /**
         * 显示企业对话框（添加/编辑）
         * @param {string} title 对话框标题
         */
        showCompanyDialog: function(title) {
            const that = this;

            let isAdd = this.companyForm.id === 0;
            
            this.companyDialog = layer.open({
                type: 1,
                title: title,
                shadeClose: 1,
                area: ['630px', '660px'],
                content: `
                    <div class="layui-form tl-rtc-app-company-form" lay-filter="company-form">
                        <div class="layui-form-item">
                            <label class="layui-form-label">企业名称</label>
                            <div class="layui-input-block">
                                <input type="text" name="name" value="${this.companyForm.name}" required lay-verify="required" placeholder="请输入企业名称（必填）" autocomplete="off" class="layui-input">
                            </div>
                        </div>
                        <div class="layui-form-item" style="${isAdd ? 'display:none;' : ''}">
                            <label class="layui-form-label">邀请码</label>
                            <div class="layui-input-block">
                                <input type="text" name="code" value="${this.companyForm.code}" placeholder="请输入企业邀请码（必填）" autocomplete="off" class="layui-input">
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <label class="layui-form-label">联系电话</label>
                            <div class="layui-input-block">
                                <input type="text" name="phone" value="${this.companyForm.phone}" placeholder="请输入联系电话（必填）" autocomplete="off" class="layui-input">
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <label class="layui-form-label">企业邮箱</label>
                            <div class="layui-input-block">
                                <input type="text" name="email" value="${this.companyForm.email}" placeholder="请输入企业邮箱（必填）" autocomplete="off" class="layui-input">
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <label class="layui-form-label">企业网站</label>
                            <div class="layui-input-block">
                                <input type="text" name="website" value="${this.companyForm.website}" placeholder="请输入企业网站（必填）" autocomplete="off" class="layui-input">
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <label class="layui-form-label">企业地址</label>
                            <div class="layui-input-block">
                                <input type="text" name="address" value="${this.companyForm.address}" placeholder="请输入企业地址（必填）" autocomplete="off" class="layui-input">
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <label class="layui-form-label">Logo链接</label>
                            <div class="layui-input-block">
                                <input type="text" name="logo" value="${this.companyForm.logo}" placeholder="请输入企业Logo链接（必填）" autocomplete="off" class="layui-input">
                            </div>
                        </div>
                        <div class="layui-form-item" style="${isAdd ? 'display:none;' : ''}">
                            <label class="layui-form-label">企业认证</label>
                            <div class="layui-input-block">
                                <input type="checkbox" name="authStatus" lay-skin="switch" lay-text="已认证|未认证" ${this.companyForm.authStatus ? 'checked' : ''}>
                            </div>
                        </div>
                        <div class="layui-form-item" style="${isAdd ? 'display:none;' : ''}">
                            <label class="layui-form-label">账户状态</label>
                            <div class="layui-input-block">
                                <input type="checkbox" name="expiredStatus" lay-skin="switch" lay-text="已过期|未过期" ${this.companyForm.expiredStatus ? 'checked' : ''}>
                            </div>
                        </div>
                        <div class="layui-form-item" style="${isAdd ? 'display:none;' : ''}">
                            <label class="layui-form-label">注册通道</label>
                            <div class="layui-input-block">
                                <input type="checkbox" name="openRegister" lay-skin="switch" lay-text="关闭|开放" ${this.companyForm.openRegister ? 'checked' : ''}>
                            </div>
                        </div>
                        <div class="layui-form-item layui-form-text">
                            <label class="layui-form-label">企业描述</label>
                            <div class="layui-input-block">
                                <textarea name="description" placeholder="请输入企业描述（必填）" class="layui-textarea">${this.companyForm.description}</textarea>
                            </div>
                        </div>
                    </div>
                `,
                btn: ['确认', '取消'],
                success: function(layero) {
                    form.render(null, 'company-form');
                    
                    layero.css({
                        'border-radius': '6px',
                    });

                    form.on('switch', function(data){
                        if(data.elem.name === 'authStatus'){
                            that.companyForm.authStatus = data.elem.checked;
                        }else if(data.elem.name === 'expiredStatus'){
                            that.companyForm.expiredStatus = data.elem.checked;
                        }else if(data.elem.name === 'openRegister'){
                            that.companyForm.openRegister = data.elem.checked;
                        }
                    });
                },
                yes: function() {
                    // 获取表单数据
                    const formData = {
                        id: that.companyForm.id,
                        code: $('input[name="code"]').val(),
                        name: $('input[name="name"]').val(),
                        address: $('input[name="address"]').val(),
                        phone: $('input[name="phone"]').val(),
                        email: $('input[name="email"]').val(),
                        website: $('input[name="website"]').val(),
                        logo: $('input[name="logo"]').val(),
                        description: $('textarea[name="description"]').val(),
                        authStatus: that.companyForm.authStatus,
                        expiredStatus: that.companyForm.expiredStatus,
                        openRegister: that.companyForm.openRegister
                    };
                    
                    // 保存企业信息
                    that.saveCompany(formData);
                }
            });
        },
        
        /**
         * 保存企业信息
         * @param {Object} formData 表单数据
         */
        saveCompany: async function(formData) {
            try {
                if (!formData.name) {
                    this.popWarningMsg('企业名称不能为空');
                    return;
                }
                
                let index = layer.load(2, {
                    shade: [0.3, '#0000001f']
                });
                
                const isEdit = formData.id > 0;
                const apiUrl = isEdit ? 
                    '/api/web/system-web-company/update-company' : 
                    '/api/web/system-web-company/add-company';
                
                const { data: saveRes } = await axios.post(apiUrl, formData);
                
                layer.close(index);
                
                if (!saveRes.success) {
                    this.popErrorMsg(saveRes.msg || (isEdit ? '更新企业失败' : '创建企业失败'));
                    return;
                }
                
                this.popSuccessMsg(isEdit ? '更新企业成功' : '创建企业成功');
                
                // 关闭对话框
                if (this.companyDialog) {
                    layer.close(this.companyDialog);
                }
                
                // 刷新表格
                this.companyTable.reload();
                
            } catch (error) {
                console.error('保存企业失败:', error);
                this.popErrorMsg('保存企业失败，请重试');
                layer.closeAll('loading');
            }
        },
        
        /**
         * 删除企业
         * @param {number} id 企业ID
         */
        deleteCompany: async function(id) {
            const that = this;

            let acceptOrReject = await new Promise(resolve => {
                layer.confirm('确定要删除该企业吗？此操作不可恢复！', {
                    shadeClose: 1,
                    success: function(layero, index){
                        layero.css({
                            'border-radius': '6px',
                        });
                    }
                }, function (index) {
                    layer.close(index);
                    resolve(true);
                }, function (index) {
                    resolve(false);
                });
            });
    
            if(!acceptOrReject){
                return;
            }
            
            try {
                let loadingIndex = layer.load(2, {
                    shade: [0.3, '#0000001f']
                });
                
                const { data: delRes } = await axios.post('/api/web/system-web-company/delete-company', { id });
                
                layer.close(loadingIndex);
                
                if (!delRes.success) {
                    this.popErrorMsg(delRes.msg || '删除企业失败');
                    return;
                }
                
                this.popSuccessMsg('删除企业成功');
                
                // 刷新表格
                this.companyTable.reload();
                
            } catch (error) {
                console.error('删除企业失败:', error);
                this.popErrorMsg('删除企业失败，请重试');
                layer.closeAll('loading');
            }
        },
        
        /**
         * 更新企业认证状态
         * @param {number} id 企业ID
         * @param {boolean} status 认证状态
         */
        updateCompanyAuthStatus: async function(id, status) {
            try {
                let index = layer.load(2, {
                    shade: [0.3, '#0000001f']
                });
                
                const { data: updateRes } = await axios.post('/api/web/system-web-company/update-auth-status', { 
                    id, 
                    status 
                });
                
                layer.close(index);
                
                if (!updateRes.success) {
                    this.popErrorMsg(updateRes.msg || '更新认证状态失败');
                    // 更新失败时，重新加载表格以恢复原状态
                    this.companyTable.reload();
                    return;
                }
                
                this.popSuccessMsg('更新认证状态成功');
                
            } catch (error) {
                console.error('更新认证状态失败:', error);
                this.popErrorMsg('更新认证状态失败，请重试');
                layer.closeAll('loading');
                // 错误时重新加载表格以恢复原状态
                this.companyTable.reload();
            }
        }
    },
    mounted() {
        this.init();
    },
    template: `
        <div class="tl-rtc-app-company-area">
            <div class="layui-card">
                <div class="layui-card-header">
                    <span>企业管理</span>
                    <div class="tl-rtc-app-company-actions">
                        <div class="layui-input-inline">
                            <input type="text" v-model="companySearch.keyword" placeholder="企业名称/邮箱/电话" class="layui-input">
                        </div>
                        <button class="layui-btn layui-btn-sm" @click="searchCompanies">
                            <i class="layui-icon layui-icon-search"></i> 搜索
                        </button>
                        <button class="layui-btn layui-btn-sm layui-btn-normal" @click="showAddCompanyDialog">
                            <i class="layui-icon layui-icon-add-1"></i> 添加企业
                        </button>
                    </div>
                </div>
                <div class="layui-card-body">
                    <!-- 企业数据表格 -->
                    <table id="company-table" lay-filter="company-table"></table>
                </div>
            </div>
        </div>
    `
});
