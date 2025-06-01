Vue.component('service-component', {
    props: {
        isLogin: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            services: []  // 服务列表
        };
    },
    methods: {
        /**
         * 初始化服务管理模块
         */
        init: async function() {
            if (!this.isLogin) return;
            
            try {
                // 获取服务状态
                await this.fetchServiceStatus();
                
            } catch (error) {
                console.error('初始化服务管理失败:', error);
                this.popErrorMsg('初始化服务管理失败，请刷新重试');
            }
        },
        
        /**
         * 获取服务状态
         */
        fetchServiceStatus: async function() {
            let index = layer.load(2, {
                shade: [0.3, '#0000001f']
            });
            
            try {
                const { data: statusRes } = await axios.get('/api/web/system-web-service/get-service-status');
                
                if (!statusRes.success) {
                    this.popWarningMsg(statusRes.msg || '获取服务状态失败');
                    layer.close(index);
                    return;
                }

                if (statusRes.data && statusRes.data.processList) {
                    // 使用API返回的完整进程列表
                    this.services = statusRes.data.processList.map(proc => {
                        // 计算可读的内存大小
                        const memory = this.formatMemorySize(proc.monit.memory);
                        
                        return {
                            ...proc, // 保留原始属性
                            id: proc.name, // 为了兼容旧代码
                            isRunning: proc.status === 'online',
                            displayStatus: proc.status === 'online' ? '运行中' : '已停止',
                            displayMemory: memory,
                            displayCpu: proc.monit.cpu.toFixed(1) + '%'
                        };
                    });

                    layer.close(index);
                } else {
                    this.popWarningMsg('服务状态数据格式不正确');
                    layer.close(index);
                }
            } catch (error) {
                console.error('获取服务状态失败:', error);
                this.popWarningMsg('获取服务状态失败，请重试');
                layer.close(index);
            }
        },
        
        /**
         * 格式化内存大小显示
         * @param {number} bytes - 内存字节数
         * @returns {string} 格式化后的内存大小
         */
        formatMemorySize: function(bytes) {
            if (bytes === 0) return '0 B';
            
            const units = ['B', 'KB', 'MB', 'GB', 'TB'];
            const i = Math.floor(Math.log(bytes) / Math.log(1024));
            
            return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + units[i];
        },
        
        /**
         * 服务操作 - 启动服务
         * @param {Object} service - 服务对象
         */
        startService: async function(service) {
            if (!this.isLogin) {
                this.popWarningMsg('请先登录');
                this.$emit('show-login');
                return;
            }

            let acceptOrReject = await new Promise(resolve => {
                layer.confirm('确认启动' + service.name + '服务', {
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
                let index = layer.load(2, {
                    shade: [0.3, '#0000001f']
                });
                                    
                const { data: startRes } = await axios.post('/api/web/system-web-service/start-service', {
                    serviceName: service.name
                });
                
                layer.close(index);
                
                if (!startRes.success) {
                    this.popErrorMsg(startRes.msg || `启动${service.name}失败`);
                    return;
                }
                
                this.popSuccessMsg(`${service.name}启动成功`);
                
                // 重新获取最新状态
                await this.fetchServiceStatus();
                
            } catch (error) {
                console.error(`启动${service.name}失败:`, error);
                this.popErrorMsg(`启动${service.name}失败，请重试`);
                layer.closeAll('loading');
            }
        },
        
        /**
         * 服务操作 - 停止服务
         * @param {Object} service - 服务对象
         */
        stopService: async function(service) {
            if (!this.isLogin) {
                this.popWarningMsg('请先登录');
                this.$emit('show-login');
                return;
            }

            let acceptOrReject = await new Promise(resolve => {
                layer.confirm('确认停止' + service.name + '服务', {
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
                let index = layer.load(2, {
                    shade: [0.3, '#0000001f']
                });
                                    
                const { data: stopRes } = await axios.post('/api/web/system-web-service/stop-service', {
                    serviceName: service.name
                });
                
                layer.close(index);
                
                if (!stopRes.success) {
                    this.popErrorMsg(stopRes.msg || `停止${service.name}失败`);
                    return;
                }
                
                this.popSuccessMsg(`${service.name}停止成功`);
                
                // 重新获取最新状态
                await this.fetchServiceStatus();
                
            } catch (error) {
                console.error(`停止${service.name}失败:`, error);
                this.popErrorMsg(`停止${service.name}失败，请重试`);
                layer.closeAll('loading');
            }
        },
        
        /**
         * 服务操作 - 重启服务
         * @param {Object} service - 服务对象
         */
        restartService: async function(service) {
            if (!this.isLogin) {
                this.popWarningMsg('请先登录');
                this.$emit('show-login');
                return;
            }

            let acceptOrReject = await new Promise(resolve => {
                layer.confirm('确认重启' + service.name + '服务', {
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
            
            let index = layer.load(2, {
                shade: [0.3, '#0000001f']
            });

            try {                    
                const { data: restartRes } = await axios.post('/api/web/system-web-service/restart-service', {
                    serviceName: service.name
                });
                
                layer.close(index);
                
                if (!restartRes.success) {
                    this.popErrorMsg(restartRes.msg || `重启${service.name}失败`);
                    return;
                }
                
                this.popSuccessMsg(`${service.name}重启成功`);
                
                // 重新获取最新状态
                await this.fetchServiceStatus();
                
            } catch (error) {
                console.error(`重启${service.name}失败:`, error);
                this.popErrorMsg(`重启${service.name}失败，请重试`);
                layer.closeAll('loading');
            }
        },
        
        /**
         * 检查服务状态图标
         * @param {Object} service - 服务对象
         * @returns {string} - 服务状态图标类名
         */
        adminGetServiceStatusIcon: function(service) {
            return service.status === 'online' ? 
                'layui-icon-console tl-rtc-app-service-icon-running' : 
                'layui-icon-close-fill tl-rtc-app-service-icon-stopped';
        },
        
        /**
         * 获取服务状态类名
         * @param {Object} service - 服务对象
         * @returns {string} - 服务状态类名
         */
        adminGetServiceStatusClass: function(service) {
            return service.status === 'online' ? 'tl-rtc-app-status-running' : 'tl-rtc-app-status-stopped';
        }
    },
    mounted() {
        this.init();
    },
    template: `
        <div class="tl-rtc-app-service-area" style="height: 100%;">
            <div class="layui-card" style="height: 100%;">
                <div class="layui-card-header">
                    <span>服务管理</span>
                    <button class="layui-btn layui-btn-sm layui-btn-primary" style="margin-left: 10px;" @click="fetchServiceStatus">
                        <i class="layui-icon layui-icon-refresh"></i> 刷新
                    </button>
                </div>
                <div class="layui-card-body">
                    <!-- 卡片视图 -->
                    <div class="tl-rtc-app-service-cards">
                        <div class="tl-rtc-app-service-card" v-for="service in services" :key="service.name">
                            <div class="tl-rtc-app-service-card-header">
                                <h3 class="tl-rtc-app-service-title">
                                    <i class="layui-icon" :class="adminGetServiceStatusIcon(service)"></i>
                                    {{ service.name }}
                                </h3>
                            </div>
                            <div class="tl-rtc-app-service-card-body">
                                <div class="tl-rtc-app-service-status">
                                    <span class="tl-rtc-app-status-dot" :class="adminGetServiceStatusClass(service)"></span>
                                    <span>当前状态: {{ service.displayStatus }}</span>
                                </div>
                                <div class="tl-rtc-app-service-info">
                                    <p><strong>PID:</strong> {{ service.pid || '-' }}</p>
                                    <p><strong>内存占用:</strong> {{ service.displayMemory }}</p>
                                    <p><strong>CPU占用:</strong> {{ service.displayCpu }}</p>
                                </div>
                                <div class="tl-rtc-app-service-actions">
                                    <button class="layui-btn layui-btn-sm" @click="startService(service)" v-show="service.status !== 'online'">
                                        <i class="layui-icon layui-icon-play"></i> 启动
                                    </button>
                                    <button class="layui-btn layui-btn-sm layui-btn-danger" @click="stopService(service)" v-show="service.status == 'online'">
                                        <i class="layui-icon layui-icon-pause"></i> 停止
                                    </button>
                                    <button class="layui-btn layui-btn-sm layui-btn-warm" @click="restartService(service)" v-show="service.status == 'online'">
                                        <i class="layui-icon layui-icon-refresh-1"></i> 重启
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- 没有服务时显示 -->
                    <div class="layui-none" v-if="services.length === 0">
                        暂无服务数据，请刷新重试
                    </div>
                </div>
            </div>
        </div>
    `
});