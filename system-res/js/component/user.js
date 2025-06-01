Vue.component('user-component', {
    props: {
        isLogin: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            userTable: null,      // 用户表格实例
            userDialog: null,     // 用户编辑对话框
            userForm: {           // 用户表单数据
                id: 0,            // 0表示新增，其他表示编辑
                companyId: 0,
                name: '',
                password: '',
                email: '',
                mobile: '',
                avatarUrl: '',
                roleId: 0,
            },
            userSearch: {         // 用户搜索条件
                keyword: '',
            },
            // 角色选项
            roleOptions: [
                { id: 1, name: '普通用户' },
                { id: 3, name: '演示用户' },
                { id: 20000, name: '官网用户' },
            ],
            // 企业列表（用于选择用户所属企业）
            companyOptions: []
        };
    },
    methods: {
        /**
         * 初始化用户管理模块
         */
        init: async function() {
            if (!this.isLogin) return;
            
            try {
                // 获取企业列表（用于用户选择企业）
                await this.fetchCompanyOptions();
                // 初始化用户表格
                await this.initUserTable();
                
                this.$nextTick(() => {
                    form.render();
                });
            } catch (error) {
                console.error('初始化用户管理失败:', error);
                this.popErrorMsg('初始化用户管理失败，请刷新重试');
            }
        },
        
        /**
         * 获取企业列表选项
         */
        fetchCompanyOptions: async function() {
            try {
                const { data: companyRes } = await axios.get('/api/web/system-web-company/get-company-list', {
                    params: { page: 1, limit: 100 }
                });
                                
                if (!companyRes.success) {
                    this.popWarningMsg(companyRes.msg || '获取企业列表失败');
                    return;
                }
                
                if (companyRes.data && companyRes.data.list) {
                    this.companyOptions = companyRes.data.list.map(company => {
                        return {
                            id: company.id,
                            name: company.name
                        };
                    });
                }
            } catch (error) {
                console.error('获取企业列表失败:', error);
                this.popErrorMsg('获取企业列表失败，请重试');
            }
        },
        
        /**
         * 初始化用户管理表格
         */
        initUserTable: function() {
            if (this.userTable) {
                this.userTable.reload();
                return;
            }
            
            const that = this;
            this.userTable = table.render({
                elem: '#user-table',
                url: '/api/web/system-web-user/get-user-list',
                method: 'get',
                where: {
                    keyword: this.userSearch.keyword
                },
                page: true,
                cols: [[
                    {field: 'id', title: 'ID', width: 60, sort: true, fixed: 'left'},
                    {
                        field: 'avatarUrl',
                        title: '头像',
                        width: 60,
                        fixed: 'left',
                        templet: function(d) {
                            return d.avatarUrl ?
                                `<img src="${d.avatarUrl}" alt="头像" class="tl-rtc-app-user-avatar-sm">` :
                                `<img src="/static/images/avatar-default.png" alt="头像" class="tl-rtc-app-user-avatar-sm">`;
                        }
                    },
                    {
                        field: 'name', 
                        title: '用户名', 
                        width: 150, 
                        fixed: 'left',
                        templet: function(d) {
                            // 添加用户名点击事件，显示用户详情
                            return `
                                <a href="javascript:;" class="tl-rtc-app-user-detail-link" data-id="${d.id}" data-company-id="${d.companyId}">
                                    ${d.name}
                                </a>
                            `;
                        }
                    },
                    {
                        field: 'companyName', title: '所属企业', width: 250,
                        templet: function(d) {
                            // 点击企业名称打开右侧侧边栏企业详情
                            if(d.companyId && d.companyName.length > 0){
                                return `<a href="javascript:;" class="tl-rtc-app-company-detail-link" data-id="${d.companyId}">${d.companyName}</a>`;
                            }else{
                                return `
                                    <span style="color: #f00; text-decoration: line-through;">
                                        企业已删除
                                    </span>
                                `
                            }
                        }
                    },
                    {
                        field: 'roleName',
                        title: '角色',
                        width: 100,
                        templet: function(d) {
                            return `<span class="tl-rtc-app-user-role-badge">${d.roleName}</span>`;
                        }
                    },
                    {field: 'email', title: '邮箱', width: 150},
                    {field: 'mobile', title: '手机', width: 150},
                    {
                        field: 'createTime', 
                        title: '注册时间',
                        sort: true,
                        templet: function(d) {
                            return window.util.timeAgo(d.createTime);
                        }
                    },
                    {fixed: 'right', title: '操作', toolbar: '#user-table-ops', width: 90}
                ]],
                parseData: function(res) {
                    if (!res.success) {
                        this.popErrorMsg(res.msg || '获取用户列表失败');
                        return {
                            "code": 1,
                            "msg": res.msg || '获取用户列表失败',
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
            table.on('tool(user-table)', function(obj) {
                const data = obj.data;
                const event = obj.event;

                if (event === 'edit') {
                    that.showEditUserDialog(data);
                } else if (event === 'del') {
                    that.deleteUser(data);
                }
            });
            
            // 监听企业名称链接点击事件
            $('.tl-rtc-app-user-area').on('click', '.tl-rtc-app-company-detail-link', function(e) {
                e.preventDefault();
                const companyId = $(this).data('id');
                if (companyId) {
                    window.subModule.$emit('show-company-detail', companyId);
                }
            });
            
            // 监听用户名称链接点击事件
            $('.tl-rtc-app-user-area').on('click', '.tl-rtc-app-user-detail-link', function(e) {
                e.preventDefault();
                const userId = $(this).data('id');
                const companyId = $(this).data('company-id');
                if (userId && companyId) {
                    window.subModule.$emit('show-user-detail', companyId, userId);
                }
            });
        },
        
        /**
         * 搜索用户
         */
        searchUsers: function() {
            if (!this.userTable) {
                this.initUserTable();
                return;
            }
            
            this.userTable.reload({
                where: {
                    keyword: this.userSearch.keyword
                },
                page: {
                    curr: 1
                }
            });
        },
        
        /**
         * 显示添加用户对话框
         */
        showAddUserDialog: function() {
            // 重置表单
            this.userForm = {
                id: 0,
                companyId: this.companyOptions.length > 0 ? this.companyOptions[0].id : 0,
                name: '',
                password: '',
                email: '',
                mobile: '',
                avatarUrl: '',
                roleId: 1, // 默认为普通用户
            };
            
            this.showUserDialog('添加用户');
        },
        
        /**
         * 显示编辑用户对话框
         * @param {Object} user 用户数据
         */
        showEditUserDialog: function(user) {
            // 填充表单
            this.userForm = {
                id: user.id,
                companyId: user.companyId || 0,
                name: user.name || '',
                password: '', // 编辑时不显示密码
                email: user.email || '',
                mobile: user.mobile || '',
                avatarUrl: user.avatarUrl || '',
                roleId: user.roleId || 1,
            };
            
            this.showUserDialog('编辑用户');
        },
        
        /**
         * 显示用户对话框（添加/编辑）
         * @param {string} title 对话框标题
         */
        showUserDialog: function(title) {
            const that = this;
            const isAdd = this.userForm.id === 0;
            
            // 构建企业下拉选项
            let companyOptionsHtml = '';
            this.companyOptions.forEach(company => {
                const selected = company.id === this.userForm.companyId ? 'selected' : '';
                companyOptionsHtml += `<option value="${company.id}" ${selected}>${company.name}</option>`;
            });
            
            // 构建角色下拉选项
            let roleOptionsHtml = '';
            this.roleOptions.forEach(role => {
                const selected = role.id === this.userForm.roleId ? 'selected' : '';
                roleOptionsHtml += `<option value="${role.id}" ${selected}>${role.name}</option>`;
            });
            
            this.userDialog = layer.open({
                type: 1,
                title: title,
                shadeClose: 1,
                area: ['630px', '660px'],
                content: `
                    <div class="layui-form tl-rtc-app-user-form" lay-filter="user-form">
                        <div class="layui-form-item">
                            <label class="layui-form-label">用户名</label>
                            <div class="layui-input-block">
                                <input type="text" name="name" value="${this.userForm.name}" required lay-verify="required" placeholder="请输入用户名（必填）" autocomplete="off" class="layui-input">
                            </div>
                        </div>
                        <div class="layui-form-item" style="${isAdd ? '' : 'display:none;'}">
                            <label class="layui-form-label">密码</label>
                            <div class="layui-input-block">
                                <input type="password" name="password" value="" placeholder="${isAdd ? '请输入密码（必填）' : '不填则不修改密码'}" autocomplete="off" class="layui-input">
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <label class="layui-form-label">邮箱</label>
                            <div class="layui-input-block">
                                <input type="text" name="email" value="${this.userForm.email}" placeholder="请输入邮箱" autocomplete="off" class="layui-input">
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <label class="layui-form-label">手机</label>
                            <div class="layui-input-block">
                                <input type="text" name="mobile" value="${this.userForm.mobile}" placeholder="请输入手机号" autocomplete="off" class="layui-input">
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <label class="layui-form-label">头像URL</label>
                            <div class="layui-input-block">
                                <input type="text" name="avatarUrl" value="${this.userForm.avatarUrl}" placeholder="请输入头像URL" autocomplete="off" class="layui-input">
                                ${this.userForm.avatarUrl ? `<img src="${this.userForm.avatarUrl}" class="tl-rtc-app-avatar-preview" alt="头像预览">` : ''}
                            </div>
                        </div>
                        <div class="layui-form-item" style="${isAdd ? '' : 'display:none;'}">
                            <label class="layui-form-label">所属企业</label>
                            <div class="layui-input-block">
                                <select name="companyId" lay-verify="required">
                                    <option value="">请选择企业</option>
                                    ${companyOptionsHtml}
                                </select>
                            </div>
                        </div>
                        <div class="layui-form-item" style="${isAdd ? '' : 'display:none;'}">
                            <label class="layui-form-label">角色</label>
                            <div class="layui-input-block">
                                <select name="roleId" lay-verify="required">
                                    ${roleOptionsHtml}
                                </select>
                            </div>
                        </div>
                    </div>
                `,
                btn: ['确认', '取消'],
                success: function(layero) {
                    form.render(null, 'user-form');
                    
                    layero.css({
                        'border-radius': '6px',
                    });
                },
                yes: function() {
                    // 获取表单数据
                    const formData = {
                        id: that.userForm.id,
                        companyId: parseInt($('select[name="companyId"]').val() || 0),
                        name: $('input[name="name"]').val(),
                        password: $('input[name="password"]').val(),
                        email: $('input[name="email"]').val(),
                        mobile: $('input[name="mobile"]').val(),
                        avatarUrl: $('input[name="avatarUrl"]').val(),
                        roleId: parseInt($('select[name="roleId"]').val() || 1),
                    };
                    
                    // 保存用户信息
                    that.saveUser(formData);
                }
            });
        },
        
        /**
         * 保存用户信息
         * @param {Object} formData 表单数据
         */
        saveUser: async function(formData) {
            try {
                // 表单验证
                if (!formData.name) {
                    this.popWarningMsg('用户名不能为空');
                    return;
                }
                
                if (formData.id === 0 && !formData.password) {
                    this.popWarningMsg('新增用户时密码不能为空');
                    return;
                }
                
                if (!formData.companyId) {
                    this.popWarningMsg('请选择所属企业');
                    return;
                }
                
                let index = layer.load(2, {
                    shade: [0.3, '#0000001f']
                });
                
                const isEdit = formData.id > 0;
                const apiUrl = isEdit ? 
                    '/api/web/system-web-user/update-user' : 
                    '/api/web/system-web-user/add-user';
                
                const { data: saveRes } = await axios.post(apiUrl, formData);
                
                layer.close(index);
                
                if (!saveRes.success) {
                    this.popErrorMsg(saveRes.msg || (isEdit ? '更新用户失败' : '创建用户失败'));
                    return;
                }
                
                this.popSuccessMsg(isEdit ? '更新用户成功' : '创建用户成功');
                
                // 关闭对话框
                if (this.userDialog) {
                    layer.close(this.userDialog);
                }
                
                // 刷新表格
                this.userTable.reload();
                
            } catch (error) {
                console.error('保存用户失败:', error);
                this.popErrorMsg('保存用户失败，请重试');
                layer.closeAll('loading');
            }
        },
        
        /**
         * 删除用户
         * @param {object} userInfo 用户信息
         */
        deleteUser: async function(userInfo) {
            const that = this;

            let acceptOrReject = await new Promise(resolve => {
                layer.confirm('确定要删除该用户吗？此操作不可恢复！', {
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
                
                const { data: delRes } = await axios.post('/api/web/system-web-user/delete-user', { 
                    id: userInfo.id,
                    companyId: userInfo.companyId
                });
                
                layer.close(loadingIndex);
                
                if (!delRes.success) {
                    this.popErrorMsg(delRes.msg || '删除用户失败');
                    return;
                }
                
                this.popSuccessMsg('删除用户成功');
                
                // 刷新表格
                this.userTable.reload();
                
            } catch (error) {
                console.error('删除用户失败:', error);
                this.popErrorMsg('删除用户失败，请重试');
                layer.closeAll('loading');
            }
        }
    },
    mounted() {
        this.init();
    },
    template: `
        <div class="tl-rtc-app-user-area">
            <div class="layui-card">
                <div class="layui-card-header">
                    <span>用户管理</span>
                    <div class="tl-rtc-app-user-actions">
                        <div class="layui-input-inline">
                            <input type="text" v-model="userSearch.keyword" placeholder="用户名/邮箱/手机" class="layui-input">
                        </div>
                        <button class="layui-btn layui-btn-sm" @click="searchUsers">
                            <i class="layui-icon layui-icon-search"></i> 搜索
                        </button>
                        <button class="layui-btn layui-btn-sm layui-btn-normal" @click="showAddUserDialog">
                            <i class="layui-icon layui-icon-add-1"></i> 添加用户
                        </button>
                    </div>
                </div>
                <div class="layui-card-body">
                    <!-- 用户数据表格 -->
                    <table id="user-table" lay-filter="user-table"></table>
                </div>
            </div>
        </div>
    `
});
