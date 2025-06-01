Vue.component('channel-user-component', {
    props: {
        isLogin: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            channelUserSidebarIndex: null, // 频道用户侧边栏索引
            channelId: null,        // 当前频道ID
            channelName: '',        // 当前频道名称
            userList: [],           // 频道用户列表
            loading: false,         // 加载状态
            pagination: {           // 分页信息
                page: 1,
                limit: 6,
                total: 0
            },
            search: {               // 搜索条件
                keyword: ''
            }
        };
    },
    methods: {
        /**
         * 显示频道用户侧边栏
         * @param {number} channelId 频道ID
         * @param {string} channelName 频道名称（可选）
         */
        showChannelUserList: async function(channelId, channelName = '') {
            if (!this.isLogin) return;

            this.channelId = channelId;
            this.channelName = channelName;
            this.pagination.page = 1;
            this.search.keyword = '';
            
            // 打开侧边栏
            const that = this;
            this.channelUserSidebarIndex = layer.open({
                type: 1,
                title: `频道用户列表${this.channelName ? ' - ' + this.channelName : ''}`,
                area: ['400px', '100%'],
                offset: 'r',
                anim: 5,
                move: false,
                shadeClose: 1,
                content: `
                    <div id="channel-user-panel">
                        <div class="layui-card">
                            <div class="layui-card-body">
                                <!-- 搜索区域 -->
                                <div class="layui-form layui-form-pane" style="margin-bottom: 15px;">
                                    <div class="layui-row layui-col-space10">
                                        <div class="layui-col-md8">
                                            <input type="text" v-model="search.keyword" placeholder="用户名/昵称/ID" class="layui-input" @keyup.enter="searchUsers">
                                        </div>
                                        <div class="layui-col-md4">
                                            <button class="layui-btn layui-btn-sm" @click="searchUsers">
                                                <i class="layui-icon layui-icon-search"></i> 搜索
                                            </button>
                                            <button class="layui-btn layui-btn-sm layui-btn-primary" @click="refreshUsers" style="margin-left: 0;">
                                                <i class="layui-icon layui-icon-refresh"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- 用户列表 -->
                                <div class="layui-row">
                                    <div v-if="loading" style="text-align: center; padding: 30px 0;">
                                        <i class="layui-icon layui-icon-loading layui-anim layui-anim-rotate layui-anim-loop" style="font-size: 24px;"></i>
                                        <p>正在加载...</p>
                                    </div>
                                    <div v-else-if="userList.length === 0" style="text-align: center; padding: 30px 0;">
                                        <i class="layui-icon layui-icon-face-surprised" style="font-size: 24px;"></i>
                                        <p>暂无用户数据</p>
                                    </div>
                                    <div v-else class="layui-col-md12 channel-user-list-container">
                                        <ul class="channel-user-list">
                                            <li v-for="(user, index) in userList" :key="user.userId" class="channel-user-item">
                                                <div class="user-avatar">
                                                    <img :src="user.userAvatar || '/image/default-avatar.png'" :alt="user.username">
                                                </div>
                                                <div class="user-info">
                                                    <div class="user-name-row">
                                                        <h4 class="user-name">{{ user.username || '未命名用户' }}</h4>
                                                        <div class="user-tags">
                                                            <span class="user-role-tag">{{ user.roleIdStr || '成员' }}</span>
                                                            <span class="user-status-tag" :class="'status-' + (user.statusStr || 'NORMAL').toLowerCase()">
                                                                {{ user.statusZnStr }}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div class="user-meta">
                                                        <div class="user-id">类型: <b>{{ user.typeZnStr }}</b> <b style="margin-left:5px; margin-right:5px;">|</b> ID: <b>{{ user.userId }}</b></div>
                                                        <div class="user-join-time">加入时间: {{ formatTime(user.createTime) }}</div>
                                                    </div>
                                                </div>
                                                <div class="user-actions">
                                                    <button class="layui-btn layui-btn-xs layui-btn-primary user-detail-btn" @click="viewUserDetail(user)">
                                                        <i class="layui-icon layui-icon-user"></i>
                                                    </button>
                                                </div>
                                            </li>
                                        </ul>
                                        
                                        <!-- 分页 -->
                                        <div id="channel-user-pagination" style="text-align: center; margin-top: 20px;"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `,
                success: async function(layero, index) {                    
                    // 设置初始样式
                    layero.css({
                        'border-radius': '0',
                        'overflow': 'hidden',
                    });

                    $(layero).find('.layui-layer-content').css({
                        'overflow': 'hidden',
                    });
                    
                    layero.find('.layui-layer-title').css({
                        'background': '#ffffff',
                        'border-bottom': '1px solid #f0f0f0'
                    });

                    new Vue({
                        'el': '#channel-user-panel',
                        data: that.$data,
                        methods: that.$options.methods,
                    })

                    // 加载频道用户列表
                    await that.loadChannelUsers();
                },
                end: function() {
                    // 重置数据
                    that.userList = [];
                    that.channelUserSidebarIndex = null;
                }
            });
        },
        
        /**
         * 加载频道用户列表
         */
        loadChannelUsers: async function() {
            if (!this.channelId) return;
            
            try {
                this.loading = true;
                
                const params = {
                    channelId: this.channelId,
                    page: this.pagination.page,
                    limit: this.pagination.limit
                };
                
                if (this.search.keyword) {
                    params.keyword = this.search.keyword;
                }
                
                const { data: response } = await axios.get('/api/web/system-web-channel/get-channel-user-list', {
                    params: params
                });
                
                this.loading = false;
                
                if (!response.success) {
                    this.popWarningMsg(response.msg || '获取频道用户列表失败');
                    return;
                }
                
                this.userList = response.data.list || [];
                this.pagination.total = response.data.count || 0;

                // 延迟渲染分页
                this.$nextTick(() => {
                    this.renderPagination();
                });
                
            } catch (error) {
                console.error('加载频道用户列表失败:', error);
                this.popErrorMsg('加载频道用户列表失败，请重试');
                this.loading = false;
            }
        },
        
        /**
         * 渲染分页组件
         */
        renderPagination: function() {
            const that = this;
            
            laypage.render({
                elem: 'channel-user-pagination',
                count: this.pagination.total,
                limit: this.pagination.limit,
                curr: this.pagination.page,
                layout: ['count', 'prev', 'page', 'next'],
                jump: function(obj, first) {
                    // 首次不执行
                    if (!first) {
                        that.pagination.page = obj.curr;
                        that.loadChannelUsers();
                    }
                }
            });
        },
        
        /**
         * 搜索用户
         */
        searchUsers: function() {
            this.pagination.page = 1;
            this.loadChannelUsers();
        },
        
        /**
         * 刷新用户列表
         */
        refreshUsers: function() {
            this.loadChannelUsers();
        },
        
        /**
         * 查看用户详情
         * @param {Object} user 用户信息
         */
        viewUserDetail: function(user) {
            const companyId = user.companyId;
            const userId = user.userId;

            if (companyId && userId) {
                window.subModule.$emit('show-user-detail', companyId, userId);
            }
        },

        /**
         * 格式化时间显示
         * @param {string} timestamp 时间戳
         * @returns {string} 格式化后的时间
         */
        formatTime: function(timestamp) {
            return window.util.timeAgo(timestamp);
        }
    },
    mounted() {
        window.subModule.$on('show-channel-user', this.showChannelUserList);
    },
    beforeDestroy() {
        window.subModule.$off('show-channel-user', this.showChannelUserList);
    },
});
