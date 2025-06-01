Vue.component('channel-component', {
    props: {
        isLogin: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            channelTable: null,     // 频道表格实例
            channelDialog: null,    // 频道编辑对话框
            channelForm: {          // 频道表单数据
                id: 0,              // 0表示新增，其他表示编辑
                companyId: 0,
                userId: 0,
                canSearch: false,
                channelName: ''
            },
            channelSearch: {        // 频道搜索条件
                keyword: '',
            },
            // 频道类型选项
            channelTypeOptions: [
                { id: 1, name: '群聊' },
                { id: 2, name: '好友' },
                { id: 3, name: '卡片' },
                { id: 4, name: '客服' },
                { id: 5, name: '匿名' },
                { id: 6, name: 'AI助手' },
            ],
            // 企业列表（用于选择频道所属企业）
            companyOptions: [],
            // 用户列表（用于选择频道所属用户）
            userOptions: []
        };
    },
    methods: {
        /**
         * 初始化频道管理模块
         */
        init: async function() {
            if (!this.isLogin) return;
            
            try {
                // 获取企业列表（用于频道选择企业）
                await this.fetchCompanyOptions();
                // 获取用户列表（用于频道选择用户）
                await this.fetchUserOptions();
                // 初始化频道表格
                await this.initChannelTable();
                
                this.$nextTick(() => {
                    form.render();
                });
            } catch (error) {
                console.error('初始化频道管理失败:', error);
                this.popErrorMsg('初始化频道管理失败，请刷新重试');
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
         * 获取用户列表选项
         * @param {number} companyId 企业ID，如果提供则筛选指定企业下的用户
         */
        fetchUserOptions: async function(companyId) {
            try {
                const params = { page: 1, limit: 100 };
                
                // 如果提供了企业ID，则按企业筛选用户
                if (companyId) {
                    params.companyId = companyId;
                }
                
                const { data: userRes } = await axios.get('/api/web/system-web-user/get-user-list', {
                    params: params
                });
                
                if (!userRes.success) {
                    this.popWarningMsg(userRes.msg || '获取用户列表失败');
                    return;
                }
                
                if (userRes.data && userRes.data.list) {
                    this.userOptions = userRes.data.list.map(user => {
                        return {
                            id: user.id,
                            name: user.name || user.nickname || user.username
                        };
                    });
                }
            } catch (error) {
                console.error('获取用户列表失败:', error);
                this.popErrorMsg('获取用户列表失败，请重试');
            }
        },
        
        /**
         * 初始化频道管理表格
         */
        initChannelTable: function() {
            if (this.channelTable) {
                this.channelTable.reload();
                return;
            }
            
            const that = this;
            this.channelTable = table.render({
                elem: '#channel-table',
                url: '/api/web/system-web-channel/get-channel-list',
                method: 'get',
                where: {
                    keyword: this.channelSearch.keyword
                },
                page: true,
                cols: [[
                    {field: 'id', title: 'ID', width: 80, sort: true, fixed: 'left'},
                    {field: 'channelName', title: '频道名称', width: 150, fixed: 'left'},
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
                        field: 'channelUserCount', title: '用户数量', width: 100,
                        templet: function(d) {
                            // 点击数量打开右侧侧边栏频道用户列表
                            if(d.channelUserCount){
                                return `
                                    <a href="javascript:;" class="tl-rtc-app-user-detail-link" data-id="${d.id}" data-name="${d.channelName}">
                                        ${d.channelUserCount}
                                    </a>
                                `;
                            }else{
                                return d.channelUserCount;
                            }
                        }
                    },
                    {
                        field: 'type', 
                        title: '频道类型', 
                        width: 90,
                        templet: function(d){
                            let domStr = '';
                            return `<span class="layui-badge layui-bg-gray">${d.typeStr}</span>`
                        }
                    },
                    {
                        field: 'canSearch',
                        title: '群聊可搜索',
                        width: 120,
                        templet: function(d) {
                            if(d.type !== 1){
                                return `<span class="layui-badge layui-bg-gray">--</span>`
                            }
                            return `<span class="layui-badge layui-bg-gray">${d.canSearch ? '是': '否'}</span>`
                                
                        }
                    },
                    {
                        field: 'status', 
                        title: '状态', 
                        width: 80,
                        templet: function(d) {
                            return d.status === 1 ? 
                                '<span class="layui-badge layui-bg-green">正常</span>' : 
                                '<span class="layui-badge layui-bg-orange">异常</span>';
                        }
                    },
                    {
                        field: 'createTime', 
                        title: '创建时间', 
                        sort: true,
                        templet: function(d) {
                            return window.util.timeAgo(d.createTime);
                        },
                    },
                    {fixed: 'right', title: '操作', toolbar: '#channel-table-ops', width: 90}
                ]],
                parseData: function(res) {
                    if (!res.success) {
                        this.popErrorMsg(res.msg || '获取频道列表失败');
                        return {
                            "code": 1,
                            "msg": res.msg || '获取频道列表失败',
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
            table.on('tool(channel-table)', function(obj) {
                const data = obj.data;
                const event = obj.event;
                
                if (event === 'edit') {
                    that.showEditChannelDialog(data);
                } else if (event === 'del') {
                    that.deleteChannel(data);
                }
            });

            // 监听企业名称链接点击事件
            $('.tl-rtc-app-channel-area').on('click', '.tl-rtc-app-company-detail-link', function(e) {
                e.preventDefault();
                const companyId = $(this).data('id');
                if (companyId) {
                    window.subModule.$emit('show-company-detail', companyId);
                }
            });
            
            // 监听频道用户列表链接点击事件
            $('.tl-rtc-app-channel-area').on('click', '.tl-rtc-app-user-detail-link', function(e) {
                e.preventDefault();
                const channelId = $(this).data('id');
                const channelName = $(this).data('name');
                if (channelId) {
                    window.subModule.$emit('show-channel-user', channelId, channelName);
                }
            });
        },
        
        /**
         * 搜索频道
         */
        searchChannels: function() {
            if (!this.channelTable) {
                this.initChannelTable();
                return;
            }
            
            this.channelTable.reload({
                where: {
                    keyword: this.channelSearch.keyword
                },
                page: {
                    curr: 1
                }
            });
        },
        
        /**
         * 显示添加频道对话框
         */
        showAddChannelDialog: function() {
            // 重置表单
            this.channelForm = {
                id: 0,
                companyId: 0,   // 默认不指定企业
                userId: 0,      // 默认不指定用户
                canSearch: false,
                channelName: '',
                type: 1, // 默认群聊
                status: 1, // 默认正常
            };
            
            this.showChannelDialog('创建频道');
        },
        
        /**
         * 显示编辑频道对话框
         * @param {Object} channel 频道数据
         */
        showEditChannelDialog: function(channel) {
            // 填充表单
            this.channelForm = {
                id: channel.id,
                companyId: channel.companyId || 0,
                userId: channel.userId || 0,
                canSearch: channel.canSearch || false,
                channelName: channel.channelName || '',
                type: channel.type || 1,
                status: channel.status || 1,
            };
            
            this.showChannelDialog('编辑频道');
        },
        
        /**
         * 显示频道对话框（添加/编辑）
         * @param {string} title 对话框标题
         */
        showChannelDialog: function(title) {
            const that = this;
            // 是否新增
            const isAdd = this.channelForm.id === 0;
            // 是否群组
            const isGroup = this.channelForm.type === 1;
            
            // 构建企业下拉选项
            let companyOptionsHtml = '';
            this.companyOptions.forEach(company => {
                const selected = company.id === this.channelForm.companyId ? 'selected' : '';
                companyOptionsHtml += `<option value="${company.id}" ${selected}>${company.name}</option>`;
            });
            
            // 构建频道类型下拉选项
            let typeOptionsHtml = '';
            this.channelTypeOptions.forEach(type => {
                const selected = type.id === this.channelForm.type ? 'selected' : '';
                typeOptionsHtml += `<option value="${type.id}" ${selected}>${type.name}</option>`;
            });
            
            // 构建用户下拉选项
            let userOptionsHtml = '';
            this.userOptions.forEach(user => {
                const selected = user.id === this.channelForm.userId ? 'selected' : '';
                userOptionsHtml += `<option value="${user.id}" ${selected}>${user.name}</option>`;
            });
            
            // 是否可搜索复选框状态
            const canSearchChecked = (this.channelForm.canSearch) ? 'checked' : '';
            
            this.channelDialog = layer.open({
                type: 1,
                title: title,
                shadeClose: 1,
                area: ['630px', '660px'],
                content: `
                    <div class="layui-form tl-rtc-app-channel-form" lay-filter="channel-form">
                        <div class="layui-form-item">
                            <label class="layui-form-label">频道名称</label>
                            <div class="layui-input-block">
                                <input type="text" name="channelName" value="${this.channelForm.channelName}" required lay-verify="required" placeholder="请输入频道名称（必填）" autocomplete="off" class="layui-input">
                            </div>
                        </div>
                        <div class="layui-form-item" style="${isAdd ? '' : 'display:none;'}">
                            <label class="layui-form-label">所属企业</label>
                            <div class="layui-input-block">
                                <select name="companyId" lay-verify="required" lay-search="" lay-filter="companySelect">
                                    <option value="">请选择企业</option>
                                    ${companyOptionsHtml}
                                </select>
                            </div>
                        </div>
                        <div class="layui-form-item" style="${isAdd ? '' : 'display:none;'}">
                            <label class="layui-form-label">所属用户</label>
                            <div class="layui-input-block">
                                <select name="userId" lay-search="" id="userSelect"> 
                                    <option value="">请选择用户</option>
                                    ${userOptionsHtml}
                                </select>
                            </div>
                        </div>
                        <div class="layui-form-item" style="${isGroup ? '' : 'display:none;'}">
                            <label class="layui-form-label">可被搜索</label>
                            <div class="layui-input-block">
                                <input type="checkbox" name="canSearch" lay-skin="switch" lay-text="是|否" ${canSearchChecked}>
                            </div>
                        </div>
                        <div class="layui-form-item">
                            <label class="layui-form-label">频道状态</label>
                            <div class="layui-input-block">
                                <input type="radio" name="status" value="1" title="正常" ${this.channelForm.status === 1 ? 'checked' : ''}>
                            </div>
                        </div>
                    </div>
                `,
                btn: ['确认', '取消'],
                success: function(layero) {
                    form.render(null, 'channel-form');
                    
                    // 监听企业选择变化事件
                    form.on('select(companySelect)', function(data) {
                        const companyId = parseInt(data.value);
                        if (companyId) {
                            // 根据选择的企业加载用户
                            that.loadUsersByCompany(companyId);
                        } else {
                            // 清空用户选择
                            $('#userSelect').empty().append('<option value="">请选择用户</option>');
                            form.render('select');
                        }
                    });
                    
                    layero.css({
                        'border-radius': '6px',
                    });
                },
                yes: function() {
                    // 获取表单数据
                    const formData = {
                        id: that.channelForm.id,
                        companyId: parseInt($('select[name="companyId"]').val() || 0),
                        userId: parseInt($('select[name="userId"]').val() || 0),
                        channelName: $('input[name="channelName"]').val(),
                    };
                    
                    const canSearch = $('input[name="canSearch"]').prop('checked');
                    formData.canSearch = canSearch
                    
                    // 保存频道信息
                    that.saveChannel(formData);
                }
            });
        },
        
        /**
         * 根据企业ID加载用户列表
         * @param {number} companyId 企业ID
         */
        loadUsersByCompany: async function(companyId) {
            try {
                let loadingIndex = layer.load(2, {
                    shade: [0.3, '#0000001f']
                });
                
                await this.fetchUserOptions(companyId);
                
                layer.close(loadingIndex);
                
                // 更新用户选择下拉框
                let userSelect = $('#userSelect');
                userSelect.empty();
                userSelect.append('<option value="">请选择用户</option>');
                
                this.userOptions.forEach(user => {
                    userSelect.append(`<option value="${user.id}">${user.name}</option>`);
                });
                
                // 重新渲染表单
                form.render('select');
            } catch (error) {
                console.error('加载企业用户失败:', error);
                this.popErrorMsg('加载企业用户失败，请重试');
                layer.closeAll('loading');
            }
        },
        
        /**
         * 保存频道信息
         * @param {Object} formData 表单数据
         */
        saveChannel: async function(formData) {
            try {
                // 表单验证
                if (!formData.channelName) {
                    this.popWarningMsg('频道名称不能为空');
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
                    '/api/web/system-web-channel/update-channel' : 
                    '/api/web/system-web-channel/add-channel';
                
                if(!isEdit){
                    delete formData.id;
                }

                const { data: saveRes } = await axios.post(apiUrl, formData);
                
                layer.close(index);
                
                if (!saveRes.success) {
                    this.popErrorMsg(saveRes.msg || (isEdit ? '更新频道失败' : '创建频道失败'));
                    return;
                }
                
                this.popSuccessMsg(isEdit ? '更新频道成功' : '创建频道成功');
                
                // 关闭对话框
                if (this.channelDialog) {
                    layer.close(this.channelDialog);
                }
                
                // 刷新表格
                this.channelTable.reload();
                
            } catch (error) {
                console.error('保存频道失败:', error);
                this.popErrorMsg('保存频道失败，请重试');
                layer.closeAll('loading');
            }
        },
        
        /**
         * 删除频道
         * @param {number} id 频道ID
         */
        deleteChannel: async function(data) {
            const that = this;
            
            let acceptOrReject = await new Promise(resolve => {
                layer.confirm('确定要删除该频道吗？此操作不可恢复！', {
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
                
                const { data: delRes } = await axios.post('/api/web/system-web-channel/delete-channel', { 
                    id: parseInt(data.id),
                    companyId: parseInt(data.companyId)
                });
                
                layer.close(loadingIndex);
                
                if (!delRes.success) {
                    this.popErrorMsg(delRes.msg || '删除频道失败');
                    return;
                }
                
                this.popSuccessMsg('删除频道成功');
                
                // 刷新表格
                this.channelTable.reload();
                
            } catch (error) {
                console.error('删除频道失败:', error);
                this.popErrorMsg('删除频道失败，请重试');
                layer.closeAll('loading');
            }
        },
    },
    mounted() {
        this.init();
    },
    template: `
        <div class="tl-rtc-app-channel-area">
            <div class="layui-card">
                <div class="layui-card-header">
                    <span>频道管理</span>
                    <div class="tl-rtc-app-channel-actions">
                        <div class="layui-input-inline">
                            <input type="text" v-model="channelSearch.keyword" placeholder="频道名称/ID" class="layui-input">
                        </div>
                        <button class="layui-btn layui-btn-sm" @click="searchChannels">
                            <i class="layui-icon layui-icon-search"></i> 搜索
                        </button>
                        <button class="layui-btn layui-btn-sm layui-btn-normal" @click="showAddChannelDialog">
                            <i class="layui-icon layui-icon-add-1"></i> 创建频道
                        </button>
                    </div>
                </div>
                <div class="layui-card-body">
                    <!-- 频道数据表格 -->
                    <table id="channel-table" lay-filter="channel-table"></table>
                </div>
            </div>
        </div>
    `
});
