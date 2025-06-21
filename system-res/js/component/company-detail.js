/**
 * 企业详情组件
 * 提供企业详情查询和侧边栏显示功能
 */
Vue.component('company-detail', {
    data() {
        return {
            // 当前查看的企业详情
            currentCompany: null,
            // 企业详情侧边栏索引
            companySidebarIndex: null,
            // 是否正在加载
            loading: false
        };
    },
    methods: {
        /**
         * 获取企业详情
         * @param {number} companyId 企业ID
         * @returns {Promise<Object|null>} 企业详情对象，获取失败则返回null
         */
        getCompanyDetail: async function(companyId) {
            if (this.loading) return null;
            
            this.loading = true;
            try {
                const loadIndex = layer.load(2, {
                    shade: [0.3, '#0000001f']
                });
                
                const { data: res } = await axios.get('/api/web/system-web-company/get-company-info', {
                    params: { id: companyId }
                });
                
                layer.close(loadIndex);
                
                if (!res.success) {
                    this.popWarningMsg(res.msg || '获取企业详情失败');
                    return null;
                }
                
                return res.data;
            } catch (error) {
                console.error('获取企业详情失败:', error);
                this.popErrorMsg('获取企业详情失败，请重试');
                return null;
            } finally {
                this.loading = false;
            }
        },
        
        /**
         * 显示企业详情侧边栏
         * @param {number} companyId 企业ID
         */
        showCompanyDetail: async function(companyId) {
            // 先获取企业详情
            const companyDetail = await this.getCompanyDetail(companyId);

            if (!companyDetail) return;
            
            this.currentCompany = companyDetail;
            
            // 渲染企业详情到侧边栏
            const that = this;
            
            this.companySidebarIndex = layer.open({
                type: 1,
                title: '企业详情',
                area: ['400px', '100%'],
                offset: 'r',
                move: false,
                anim: 5,
                shadeClose: true,
                content: `
                    <div class="tl-rtc-app-company-detail" id="tl-rtc-app-company-detail">
                        <div class="company-info-card">
                            <div class="company-header">
                                <div class="company-logo">
                                    <img v-if="currentCompany && currentCompany.logoUrl" :src="currentCompany.logoUrl" alt="企业Logo">
                                    <div v-else-if="currentCompany" class="company-logo-placeholder">{{ currentCompany.name.substring(0, 1) }}</div>
                                </div>
                                <h3 class="company-name">{{ currentCompany ? currentCompany.name : '' }}</h3>
                                <p class="company-id">ID: {{ currentCompany ? currentCompany.id : '' }}</p>
                            </div>
                            
                            <div class="company-body" v-if="currentCompany">
                                <div class="info-item">
                                    <span class="info-label">邀请码：</span>
                                    <span class="info-value">{{ currentCompany.code || '未设置' }}</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">联系电话：</span>
                                    <span class="info-value">{{ currentCompany.phone || '未设置' }}</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">联系邮箱：</span>
                                    <span class="info-value">{{ currentCompany.email || '未设置' }}</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">联系地址：</span>
                                    <span class="info-value">{{ currentCompany.address || '未设置' }}</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">官网地址：</span>
                                    <span class="info-value">{{ currentCompany.website || '未设置' }}</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">认证状态：</span>
                                    <span class="info-value">{{ currentCompany.authStatus ? '已认证' : '未认证' }}</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">注册通道：</span>
                                    <span class="info-value">{{ currentCompany.openRegister ? '已开放' : '已关闭' }}</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">创建时间：</span>
                                    <span class="info-value">{{ window.util.timeAgo(currentCompany.createTime) }}</span>
                                </div>
                                <div class="info-item info-description">
                                    <span class="info-label">企业简介：</span>
                                    <div class="info-value description">{{ currentCompany.description || '暂无企业简介' }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                `,
                end: function() {
                    // 重置组件状态
                    that.currentCompany = null;
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
                        'el': '#tl-rtc-app-company-detail',
                        data: that.$data,
                        methods: that.$options.methods,
                    })
                }
            });
        },
    },
    mounted() {
        window.subModule.$on('show-company-detail', this.showCompanyDetail);
    },
    beforeDestroy() {
        window.subModule.$off('show-company-detail', this.showCompanyDetail);
    }
});
