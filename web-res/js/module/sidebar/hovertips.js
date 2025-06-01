const tl_rtc_app_module_sidebar_hovertips = {
    props: {
        tools: {
            type: Array,
            default: function() {
                return [];
            }
        },
        visible: {
            type: Boolean,
            default: false
        },
        position: {
            type: Object,
            default: function() {
                return {
                    top: 0,
                    left: 0
                }
            }
        },
        targetElement: {
            type: String,
            default: ''
        }
    },
    watch: {
        visible: function(val) {
            if(val) {
                this.$nextTick(() => {
                    this.adjustPosition();
                });
            }
        },
        tools: {
            handler: function() {
                this.$nextTick(() => {
                    if(this.visible) {
                        this.adjustPosition();
                    }
                });
            },
            deep: true
        }
    },
    data: function() {
        return {
            tipStyle: {
                top: '0px',
                left: '0px'
            },
            arrowStyle: {
                top: '50%',
                left: '0px'
            },
            arrowPosition: 'left', // 'left', 'right', 'top', 'bottom'
            maxHeight: '300px' // 默认最大高度
        }
    },
    methods: {
        handleResize: function() {
            if (this.visible) {
                this.adjustPosition();
            }
        },
        adjustPosition: function() {
            if (!this.targetElement) return;
            
            const targetEl = document.querySelector(this.targetElement);
            if (!targetEl) return;
            
            const rect = targetEl.getBoundingClientRect();
            const tipEl = this.$el;
            
            if (!tipEl) return;
            
            // 获取窗口尺寸
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            
            // 获取提示框尺寸（需要先显示才能获取）
            const tipRect = tipEl.getBoundingClientRect();
            const tipWidth = tipRect.width || 150; // 如果获取不到，使用默认值
            const tipHeight = tipRect.height || 300;
            
            // 计算最大可用高度（考虑上下边距）
            const maxAvailableHeight = windowHeight - 40; // 预留上下各20px的边距
            this.maxHeight = Math.min(tipHeight, maxAvailableHeight) + 'px';
            
            // 获取"更多"按钮的位置
            const targetCenterX = rect.left + rect.width / 2;
            
            // 默认在右侧显示，并且菜单底部与"更多"按钮底部对齐
            const menuTopPosition = Math.max(20, rect.bottom - tipHeight);
            this.tipStyle = {
                top: menuTopPosition + 'px',
                left: (rect.right + 10) + 'px'
            };
            this.arrowPosition = 'left';
            
            // 箭头位于菜单底部，与"更多"按钮底部对齐
            const arrowTopPosition = rect.bottom - menuTopPosition - 8; // 8px是箭头高度的一半
            this.arrowStyle = {
                top: Math.min(tipHeight - 20, Math.max(tipHeight - 40, arrowTopPosition)) + 'px',
                transform: 'translateY(-50%)'
            };
            
            // 检查右侧空间
            const rightSpace = windowWidth - rect.right - 10;
            const leftSpace = rect.left - 10;
            
            // 如果右侧空间不足，检查左侧
            if (rightSpace < tipWidth && leftSpace >= tipWidth) {
                this.tipStyle.left = (rect.left - tipWidth - 10) + 'px';
                this.arrowPosition = 'right';
                // 箭头位置保持不变
            } 
            // 如果两侧都不足，检查上下
            else if (rightSpace < tipWidth && leftSpace < tipWidth) {
                // 居中显示，上方或下方
                this.tipStyle.left = Math.max(10, Math.min(windowWidth - tipWidth - 10, rect.left + rect.width/2 - tipWidth/2)) + 'px';
                
                // 如果下方空间足够
                const bottomSpace = windowHeight - rect.bottom - 10;
                if (bottomSpace >= tipHeight) {
                    this.tipStyle.top = (rect.bottom + 10) + 'px';
                    this.arrowPosition = 'top';
                    // 箭头对准"更多"按钮的水平中心
                    this.arrowStyle = {
                        left: (targetCenterX - parseFloat(this.tipStyle.left)) + 'px',
                        transform: 'translateX(-50%)'
                    };
                } 
                // 否则在上方显示
                else {
                    this.tipStyle.top = (rect.top - tipHeight - 10) + 'px';
                    this.arrowPosition = 'bottom';
                    // 箭头对准"更多"按钮的水平中心
                    this.arrowStyle = {
                        left: (targetCenterX - parseFloat(this.tipStyle.left)) + 'px',
                        bottom: '0',
                        transform: 'translateX(-50%)'
                    };
                }
            }
            
            // 检查是否超出屏幕底部
            const tipBottom = parseFloat(this.tipStyle.top) + tipHeight;
            if (tipBottom > windowHeight - 20) {
                // 如果超出底部，调整顶部位置
                this.tipStyle.top = Math.max(20, windowHeight - tipHeight - 20) + 'px';
                
                // 重新计算箭头位置
                if (this.arrowPosition === 'left' || this.arrowPosition === 'right') {
                    const newArrowTop = rect.bottom - parseFloat(this.tipStyle.top) - 8;
                    this.arrowStyle.top = Math.min(tipHeight - 20, Math.max(tipHeight - 40, newArrowTop)) + 'px';
                }
            }
            
            // 检查是否超出屏幕顶部
            if (parseFloat(this.tipStyle.top) < 20) {
                this.tipStyle.top = '20px';
                
                // 重新计算箭头位置
                if (this.arrowPosition === 'left' || this.arrowPosition === 'right') {
                    const newArrowTop = rect.bottom - 20 - 8;
                    this.arrowStyle.top = Math.min(tipHeight - 20, Math.max(tipHeight - 40, newArrowTop)) + 'px';
                }
            }
            
            // 最后检查箭头是否在可见范围内
            if (this.arrowPosition === 'top' || this.arrowPosition === 'bottom') {
                const arrowLeft = parseFloat(this.arrowStyle.left);
                if (arrowLeft < 10) {
                    this.arrowStyle.left = '10px';
                } else if (arrowLeft > tipWidth - 10) {
                    this.arrowStyle.left = (tipWidth - 10) + 'px';
                }
            }
        },
        clickTool: function(tool) {
            tool.handler && tool.handler.call(this);
            this.$emit('hide');
        },
        handleMouseLeave: function() {
            this.$emit('hide');
        }
    },
    mounted: function() {
        // 添加窗口大小变化监听
        window.addEventListener('resize', this.handleResize);
    },
    beforeDestroy: function() {
        // 移除窗口大小变化监听
        window.removeEventListener('resize', this.handleResize);
    },
    template: `
        <div class="tl-rtc-app-hovertips" v-show="visible" 
            :style="tipStyle" 
            @mouseleave="handleMouseLeave">
            <div class="tl-rtc-app-hovertips-arrow" 
                :class="'tl-rtc-app-hovertips-arrow-' + arrowPosition"
                :style="arrowStyle">
            </div>
            <div class="tl-rtc-app-hovertips-content">
                <div class="tl-rtc-app-hovertips-tools-vertical" :style="{ maxHeight: maxHeight, overflowY: 'auto' }">
                    <div class="tl-rtc-app-hovertips-tool-vertical" 
                        v-for="tool in tools" 
                        :key="tool.name"
                        @click="clickTool(tool)">
                        <div class="tl-rtc-app-hovertips-tool-icon">
                            <svg class="icon" aria-hidden="true">
                                <use :xlink:href="tool.svg"></use>
                            </svg>
                            <span class="tl-rtc-app-hovertips-badge" v-if="tool.unread && tool.unread > 0">
                                {{tool.unread > 99 ? '99+' : tool.unread}}
                            </span>
                        </div>
                        <div class="tl-rtc-app-hovertips-tool-title">{{tool.title}}</div>
                    </div>
                </div>
            </div>
        </div>
    `
}

window.tl_rtc_app_module_sidebar_hovertips = tl_rtc_app_module_sidebar_hovertips;
