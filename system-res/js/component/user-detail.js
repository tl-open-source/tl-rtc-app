/**
 * 用户详情组件
 * 提供用户详情查询和侧边栏显示功能
 */
Vue.component('user-detail', {
    data() {
        return {
            // 当前查看的用户详情
            currentUser: null,
            // 用户详情侧边栏索引
            userSidebarIndex: null,
            // 是否正在加载
            loading: false
        };
    },
    methods: {
        /**
         * 获取用户详情
         * @param {number} userId 用户ID
         * @param {number} companyId 企业ID
         * @returns {Promise<Object|null>} 用户详情对象，获取失败则返回null
         */
        getUserDetail: async function(companyId, userId) {
            if (this.loading) return null;
            
            this.loading = true;
            try {
                const loadIndex = layer.load(2, {
                    shade: [0.3, '#0000001f']
                });
                
                const { data: res } = await axios.get('/api/web/system-web-user/get-user-info', {
                    params: { 
                        companyId: companyId,
                        id: userId 
                    }
                });
                
                layer.close(loadIndex);
                
                if (!res.success) {
                    this.popWarningMsg(res.msg || '获取用户详情失败');
                    return null;
                }
                
                return res.data;
            } catch (error) {
                console.error('获取用户详情失败:', error);
                this.popErrorMsg('获取用户详情失败，请重试');
                return null;
            } finally {
                this.loading = false;
            }
        },
        
        /**
         * 显示用户详情侧边栏
         * @param {number} companyId 企业ID
         * @param {number} userId 用户ID
         */
        showUserDetail: async function(companyId, userId) {
            // 先获取用户详情
            const userDetail = await this.getUserDetail(companyId, userId);

            if (!userDetail) return;
            
            this.currentUser = userDetail;
            
            // 渲染用户详情到侧边栏
            const that = this;
            this.userSidebarIndex = layer.open({
                type: 1,
                title: '用户详情',
                area: ['400px', '100%'],
                offset: 'r',
                move: false,
                anim: 5,
                shadeClose: true,
                content: `
                    <div class="tl-rtc-app-user-detail" id="tl-rtc-app-user-detail">
                        <div class="user-info-card">
                            <div class="user-header">
                                <div class="user-avatar">
                                    <img v-if="currentUser && currentUser.avatarUrl" :src="currentUser.avatarUrl" alt="用户头像">
                                    <div v-else-if="currentUser" class="user-avatar-placeholder">{{ currentUser.name.substring(0, 1) }}</div>
                                </div>
                                <h3 class="user-name">{{ currentUser ? currentUser.name : '' }}</h3>
                                <p class="user-id">ID: {{ currentUser ? currentUser.id : '' }}</p>
                            </div>
                            
                            <div class="user-body" v-if="currentUser">
                                <div class="info-item">
                                    <span class="info-label">所属企业：</span>
                                    <span class="info-value">
                                        <a v-if="currentUser.companyId" href="javascript:;" @click="showCompanyDetail(currentUser.companyId)">
                                            {{ currentUser.companyName || '未知企业' }}
                                        </a>
                                        <span v-else>{{ currentUser.companyName || '企业已删除' }}</span>
                                    </span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">用户角色：</span>
                                    <span class="info-value">
                                        <span class="tl-rtc-app-user-role-badge">{{ currentUser.roleName || '未知角色' }}</span>
                                    </span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">邮箱地址：</span>
                                    <span class="info-value">{{ currentUser.email || '未设置' }}</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">手机号码：</span>
                                    <span class="info-value">{{ currentUser.mobile || '未设置' }}</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">注册时间：</span>
                                    <span class="info-value">{{ formatDateTime(currentUser.createTime) }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `,
                end: function() {
                    // 重置组件状态
                    that.currentUser = null;
                },
                success: function(layero, index) {
                    // 设置初始样式
                    layero.css({
                        'border-radius': '0',
                        'overflow': 'hidden',
                    });

                    $(layero).find('.layui-layer-content').css({
                        'overflow': 'hidden',
                    });
                    
                    $(layero).find('.layui-layer-title').css({
                        'background-color': '#f8f8f8',
                        'border-bottom': '1px solid #eee'
                    });

                    new Vue({
                        'el': '#tl-rtc-app-user-detail',
                        data: that.$data,
                        methods: that.$options.methods,
                    })
                }
            });
        },
        /**
         * 格式化日期时间
         * @param {string} dateString 日期字符串
         * @returns {string} 格式化后的日期时间
         */
        formatDateTime: function(dateString) {
            if (!dateString) return '未知';
            return window.util.timeAgo(dateString);
        },
        /**
         * 显示企业详情
         * @param {number} companyId 企业ID
         * @returns {void}
         * */
        showCompanyDetail(companyId) {
            window.subModule.$emit('show-company-detail', companyId);
        }
    },
    mounted() {
        window.subModule.$on('show-user-detail', this.showUserDetail);
    },
    beforeDestroy() {
        window.subModule.$off('show-user-detail', this.showUserDetail);
    },
});
