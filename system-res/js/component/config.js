Vue.component('config-component', {
    props: {
        isLogin: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            activeConfigTab: 'redis', // 当前激活的配置Tab
            
            // 配置信息
            redisConfig: {},        // Redis配置
            webrtcConfig: {},       // WebRTC配置
            mysqlConfig: {},        // MySQL配置
            emailConfig: {},        // 邮件配置
            
            // 配置项定义 - 从后端获取
            configDefinitions: {}
        };
    },
    computed: {
        /**
         * 获取当前配置Tab的标题
         */
        currentConfigTitle: function() {
            const titles = {
                'redis': 'Redis配置',
                'webrtc': 'WebRTC配置',
                'mysql': 'MySQL配置',
                'email': '邮件配置',
            };
            
            return titles[this.activeConfigTab] || '系统配置';
        },
        
        /**
         * 当前激活的配置定义
         */
        activeConfigDef: function() {
            return this.configDefinitions[this.activeConfigTab] || null;
        },
        
        /**
         * 当前激活的配置数据
         */
        activeConfigData: function() {
            if (!this.activeConfigDef) return null;
            return this[this.activeConfigDef.configKey] || {};
        }
    },
    watch: {
        activeConfigTab: function(newVal) {
            this.$nextTick(() => {
                form.render(); // 重新渲染表单元素，特别是checkbox等需要layui处理的元素
                layui.element.render('tab'); // 重新渲染tab组件
            });
        },
        configDefinitions: {
            handler: function(newVal) {
                this.$nextTick(() => {
                    // 如果没有选中的配置项，默认选中第一个
                    if (!this.activeConfigDef && Object.keys(newVal).length > 0) {
                        this.activeConfigTab = Object.keys(newVal)[0];
                    }
                    
                    layui.element.render('tab'); // 配置数据变更后重新渲染tab
                });
            },
            deep: true
        }
    },
    methods: {
        /**
         * 初始化配置页面
         */
        init: async function() {
            if (!this.isLogin) return;
            
            try {
                // 获取配置信息
                await this.fetchConfigs();
                
                this.$nextTick(() => {
                    form.render();
                });
            } catch (error) {
                console.error('初始化配置页面失败:', error);
                this.popErrorMsg('初始化配置页面失败，请刷新重试');
            }
        },
        
        /**
         * 获取配置信息
         */
        fetchConfigs: async function() {
            try {
                const { data: configRes } = await axios.get('/api/web/system-web-config/get-system-config');
                
                if (!configRes.success) {
                    this.popErrorMsg(configRes.msg || '获取配置失败');
                    return;
                }
                
                // 更新各项配置
                this.redisConfig = configRes.data.redisConfig || {};
                this.webrtcConfig = configRes.data.webrtcConfig || {};
                this.mysqlConfig = configRes.data.mysqlConfig || {};
                this.emailConfig = configRes.data.emailConfig || {};
                
                // 从后端获取配置定义
                this.configDefinitions = configRes.data.configDefinitions || {};
                
                // 数据加载完成后，确保tab正确渲染
                this.$nextTick(() => {
                    layui.element.render('tab');
                });
                
            } catch (error) {
                console.error('获取配置失败:', error);
                this.popErrorMsg('获取配置失败，请重试');
            }
        },
        
        /**
         * 保存当前配置
         * 根据当前激活的配置Tab保存相应配置
         */
        saveCurrentConfig: async function() {
            if (!this.isLogin) {
                this.popWarningMsg('请先登录');
                this.$emit('show-login');
                return;
            }
            
            if (!this.activeConfigDef) {
                this.popWarningMsg('请选择要保存的配置项');
                return;
            }

            let acceptOrReject = await new Promise(resolve => {
                layer.confirm('确认更新' + this.currentConfigTitle, {
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
                const configKey = this.activeConfigDef.configKey;
                const configData = {};
                configData[configKey] = this.activeConfigData;
                
                // 调用保存API
                const { data: saveRes } = await axios.post('/api/web/system-web-config/update-system-config', configData);
                
                if (!saveRes.success) {
                    this.popErrorMsg(saveRes.msg || '保存配置失败');
                    return;
                }
                
                this.popSuccessMsg('保存配置成功');
                
            } catch (error) {
                console.error('保存配置失败:', error);
                this.popErrorMsg('保存配置失败，请重试');
            }
        }
    },
    mounted() {
        this.init();

        form.render();
        
        // 组件挂载后确保tab正确初始化
        this.$nextTick(() => {
            layui.element.render('tab');
        });
    },
    template: `
        <div class="tl-rtc-app-config-area">
            <!-- 配置分类导航 -->
            <div class="layui-card">
                <div class="layui-card-body">
                    <div class="layui-tab" lay-filter="configTab">
                        <ul class="layui-tab-title">
                            <li v-for="(item, key) in configDefinitions" 
                                :key="key" 
                                :class="{'layui-this': activeConfigTab === key}"
                                @click="activeConfigTab = key">
                                {{ item.title }}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- 配置内容 -->
            <div class="layui-card">
                <div class="layui-card-header">
                    <span v-if="activeConfigDef">{{ activeConfigDef.title }}</span>
                    <span v-else>请选择配置项</span>
                    <button class="layui-btn layui-btn-sm layui-btn-normal tl-rtc-app-config-save-btn" @click="saveCurrentConfig">保存配置</button>
                </div>
                <div class="layui-card-body">
                    <!-- 通用配置表格 -->
                    <table class="layui-table" v-if="activeConfigDef && activeConfigData">
                        <colgroup>
                            <col width="150">
                            <col>
                            <col width="200">
                        </colgroup>
                        <thead>
                            <tr>
                                <th>参数名</th>
                                <th>参数值</th>
                                <th>说明</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="field in activeConfigDef.fields" :key="field.key">
                                <td>{{ field.label }}</td>
                                <td>
                                    <!-- 根据字段类型显示不同的输入控件 -->
                                    <template v-if="field.type === 'checkbox'">
                                        <input type="checkbox" v-model="activeConfigData[field.key]" lay-skin="switch" lay-text="开启|关闭">
                                    </template>
                                    <template v-else-if="field.type === 'password'">
                                        <input type="password" v-model="activeConfigData[field.key]" class="layui-input">
                                    </template>
                                    <template v-else>
                                        <input type="text" v-model="activeConfigData[field.key]" class="layui-input">
                                    </template>
                                </td>
                                <td>{{ field.desc }}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="layui-none" v-else>请选择配置项目</div>
                </div>
            </div>
        </div>
    `
});
