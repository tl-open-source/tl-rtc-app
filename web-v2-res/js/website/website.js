const TlRtcAppWebsite = {
    globals: {
        $: null,
        form: null,
        layer: null,
        captchaGenerator: null  // 添加验证码生成器到全局
    },

    init() {
        layui.use(['jquery', 'form', 'layer'], () => {
            this.globals.$ = layui.jquery;
            this.globals.form = layui.form;
            this.globals.layer = layui.layer;
            this.globals.captchaGenerator = new this.CaptchaGenerator();

            const $ = this.globals.$;

            $(document).ready(() => {
                this.checkLoginStatus();
                this.initCaptcha();
                this.initLoginPopup();
                this.initCarousel();
                this.initTheme();
                this.initPricing();
                this.initMobileNav();
                this.initHelp();
                
                // 绑定退出登录事件
                $(document).on('click', '.logout-btn', () => {
                    this.logout();
                });

                // 绑定个人中心点击事件
                $(document).on('click', 'a[href="/user/center"]', (e) => {
                    e.preventDefault();
                    this.showUserCenter();
                });

                // 绑定订单管理点击事件
                $(document).on('click', 'a[href="/user/orders"]', (e) => {
                    e.preventDefault();
                    this.showOrderManagement();
                });
            });
        });
    },

    /**
     * 验证码生成器类
     */
    CaptchaGenerator: class {
        constructor(options = {}) {
            this.options = {
                width: 120,
                height: 40,
                length: 4,
                chars: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
                colors: ['#4A90E2', '#27AE60', '#8E44AD', '#F39C12', '#C0392B'],
                fontSize: 28,
                ...options
            };

            this.canvas = document.createElement('canvas');
            this.canvas.width = this.options.width;
            this.canvas.height = this.options.height;
            this.ctx = this.canvas.getContext('2d');
            this.captchaText = '';
        }

        generateText() {
            let text = '';
            for (let i = 0; i < this.options.length; i++) {
                text += this.options.chars[Math.floor(Math.random() * this.options.chars.length)];
            }
            this.captchaText = text;
            return text;
        }

        drawInterferenceLines() {
            for (let i = 0; i < 3; i++) {
                this.ctx.strokeStyle = this.options.colors[Math.floor(Math.random() * this.options.colors.length)];
                this.ctx.beginPath();
                this.ctx.moveTo(Math.random() * this.options.width, Math.random() * this.options.height);
                this.ctx.lineTo(Math.random() * this.options.width, Math.random() * this.options.height);
                this.ctx.stroke();
            }
        }

        drawInterferenceDots() {
            for (let i = 0; i < 30; i++) {
                this.ctx.fillStyle = this.options.colors[Math.floor(Math.random() * this.options.colors.length)];
                this.ctx.beginPath();
                this.ctx.arc(Math.random() * this.options.width, Math.random() * this.options.height, 1, 0, 2 * Math.PI);
                this.ctx.fill();
            }
        }

        draw() {
            this.ctx.fillStyle = '#fff';
            this.ctx.fillRect(0, 0, this.options.width, this.options.height);
            const text = this.generateText();
            this.drawInterferenceLines();
            this.drawInterferenceDots();
            this.ctx.font = `bold ${this.options.fontSize}px Arial`;
            this.ctx.textBaseline = 'middle';
            const totalWidth = this.ctx.measureText(text).width;
            const startX = (this.options.width - totalWidth) / 2;

            for (let i = 0; i < text.length; i++) {
                const char = text[i];
                const charWidth = this.ctx.measureText(char).width;
                const x = startX + i * (totalWidth / text.length);
                const y = this.options.height / 2;
                const rotation = (Math.random() - 0.5) * 0.4;

                this.ctx.save();
                this.ctx.translate(x, y);
                this.ctx.rotate(rotation);
                this.ctx.fillStyle = this.options.colors[Math.floor(Math.random() * this.options.colors.length)];
                this.ctx.fillText(char, 0, 0);
                this.ctx.restore();
            }

            return {
                text: this.captchaText,
                canvas: this.canvas
            };
        }

        validate(userInput, caseSensitive = false) {
            if (!userInput || !this.captchaText) return false;
            return caseSensitive ?
                userInput === this.captchaText :
                userInput.toLowerCase() === this.captchaText.toLowerCase();
        }

        refresh() {
            return this.draw();
        }
    },

    /**
     * 轮播图
     */
    Carousel: class {
        constructor(element, $) {
            this.$ = $;
            this.wrapper = element;
            this.items = this.wrapper.find('.tl-rtc-app-website-carousel-items');
            this.itemsArray = this.items.find('.tl-rtc-app-website-carousel-item');
            this.currentIndex = 0;
            this.totalItems = this.itemsArray.length;
            this.autoPlayInterval = null;
            this.isAnimating = false;
            this.animationDuration = 500;

            if (this.totalItems > 0) {
                this.init();
            }
        }

        init() {
            this.cloneItems();
            this.createIndicators();
            this.bindEvents();
            this.updateIndicators();
            this.startAutoPlay();
            this.goToSlide(0);
        }

        cloneItems() {
            const $ = this.$;
            // 克隆第一个和最后一个项目
            const $firstItem = this.itemsArray.first().clone();
            const $lastItem = this.itemsArray.last().clone();

            // 添加到轮播的首尾
            this.items.append($firstItem);
            this.items.prepend($lastItem);

            // 设置初始位置
            this.items.css('transform', 'translateX(-100%)');
        }

        createIndicators() {
            const $ = this.$;
            const indicators = $('<div class="tl-rtc-app-website-carousel-indicators"></div>');

            for (let i = 0; i < this.totalItems; i++) {
                indicators.append($('<div class="indicator"></div>'));
            }

            this.wrapper.append(indicators);
            this.indicators = indicators.find('.indicator');
        }

        bindEvents() {
            const self = this;
            const $ = this.$;

            // 指示器点击事件
            this.wrapper.find('.indicator').off('click').on('click', function () {
                if (!self.isAnimating) {
                    const index = $(this).index();
                    self.goToSlide(index);
                }
            });

            // 上一张按钮
            this.wrapper.find('.tl-rtc-app-website-carousel-btn.prev').off('click').on('click', function () {
                if (!self.isAnimating) {
                    self.prevSlide();
                }
            });

            // 下一张按钮
            this.wrapper.find('.tl-rtc-app-website-carousel-btn.next').off('click').on('click', function () {
                if (!self.isAnimating) {
                    self.nextSlide();
                }
            });

            // 鼠标悬停暂停自动播放
            this.wrapper.off('mouseenter mouseleave').on({
                mouseenter: () => this.stopAutoPlay(),
                mouseleave: () => this.startAutoPlay()
            });
        }

        updateIndicators() {
            this.indicators.removeClass('active');
            this.indicators.eq(this.currentIndex).addClass('active');
        }

        goToSlide(index, isAuto = false) {
            if (this.isAnimating) return;

            this.isAnimating = true;
            this.currentIndex = index;

            const translateX = -(index + 1) * 100;
            this.items.css({
                'transition': `transform ${this.animationDuration}ms ease`,
                'transform': `translateX(${translateX}%)`
            });

            this.updateIndicators();

            setTimeout(() => {
                this.isAnimating = false;

                // 处理边界情况
                if (index === -1) {
                    this.items.css({
                        'transition': 'none',
                        'transform': `translateX(${-this.totalItems * 100}%)`
                    });
                    this.currentIndex = this.totalItems - 1;
                    this.updateIndicators();
                } else if (index === this.totalItems) {
                    this.items.css({
                        'transition': 'none',
                        'transform': 'translateX(-100%)'
                    });
                    this.currentIndex = 0;
                    this.updateIndicators();
                }
            }, this.animationDuration);
        }

        prevSlide() {
            this.goToSlide(this.currentIndex - 1);
        }

        nextSlide() {
            this.goToSlide(this.currentIndex + 1);
        }

        startAutoPlay() {
            this.stopAutoPlay();
            this.autoPlayInterval = setInterval(() => {
                this.nextSlide();
            }, 5000);
        }

        stopAutoPlay() {
            if (this.autoPlayInterval) {
                clearInterval(this.autoPlayInterval);
                this.autoPlayInterval = null;
            }
        }
    },

    /**
     * 初始化验证码
     */
    initCaptcha() {
        const $ = this.globals.$;
        const self = this;

        // 使用事件委托绑定点事件
        $(document).on('click', '.tl-rtc-app-website-captcha-canvas', function () {
            self.refreshCaptcha(this);
        });
    },

    // 添加刷新验证码的方法
    refreshCaptcha(canvas) {
        if (!canvas || !this.globals.captchaGenerator) return;

        try {
            const { canvas: newCanvas, text } = this.globals.captchaGenerator.draw();
            const ctx = canvas.getContext('2d');
            canvas.width = newCanvas.width;
            canvas.height = newCanvas.height;
            ctx.drawImage(newCanvas, 0, 0);
            console.log('新验证码:', text); // 用于测试
        } catch (error) {
            console.error('刷新验证码失败:', error);
        }
    },

    /**
     * 初始化登录弹窗
     */
    initLoginPopup() {
        const $ = this.globals.$;
        const self = this;

        // 登录按钮点击事件
        $(document).off('click', '.tl-rtc-app-website-login-btn').on('click', '.tl-rtc-app-website-login-btn', function () {
            $('.tl-rtc-app-website-login-popup, .tl-rtc-app-website-popup-overlay').fadeIn(300);

            // 重置表单状态
            $('#registerForm').hide();
            $('#loginForm').show();
            $('.tl-rtc-app-website-third-party-login').show();
            $('.tl-rtc-app-website-login-header h2').text('欢迎回来');

            // 初始化验证码
            const captchaCanvas = $('#loginForm .tl-rtc-app-website-captcha-canvas')[0];
            if (captchaCanvas) {
                self.refreshCaptcha(captchaCanvas);
            }
        });

        // 切换到注册表单
        $(document).off('click', '.tl-rtc-app-website-to-register').on('click', '.tl-rtc-app-website-to-register', function (e) {
            e.preventDefault();
            e.stopPropagation();

            $('.tl-rtc-app-website-login-header h2').text('创建账号');
            $('#loginForm').hide();
            $('.tl-rtc-app-website-third-party-login').hide();
            $('#registerForm').show();

            // 初始化注册表单的验证码
            const captchaCanvas = $('#registerForm .tl-rtc-app-website-captcha-canvas')[0];
            if (captchaCanvas) {
                self.refreshCaptcha(captchaCanvas);
            }
        });

        // 切换到登录表单
        $(document).off('click', '.tl-rtc-app-website-to-login').on('click', '.tl-rtc-app-website-to-login', function (e) {
            e.preventDefault();
            e.stopPropagation();

            $('.tl-rtc-app-website-login-header h2').text('欢迎回来');
            $('#registerForm').hide();
            $('#loginForm').show();
            $('.tl-rtc-app-website-third-party-login').show();

            // 初始化登录表单的验证码
            const captchaCanvas = $('#loginForm .tl-rtc-app-website-captcha-canvas')[0];
            if (captchaCanvas) {
                self.refreshCaptcha(captchaCanvas);
            }
        });

        // 验证码点击刷新
        $(document).off('click', '.tl-rtc-app-website-captcha-canvas, .tl-rtc-app-website-captcha-refresh')
            .on('click', '.tl-rtc-app-website-captcha-canvas, .tl-rtc-app-website-captcha-refresh', function (e) {
                e.preventDefault();
                e.stopPropagation();
                const canvas = $(this).closest('.tl-rtc-app-website-form-group').find('.tl-rtc-app-website-captcha-canvas')[0];
                if (canvas) {
                    self.refreshCaptcha(canvas);
                }
            });

        // 关闭按钮和遮罩层点击事件
        $(document).off('click', '.tl-rtc-app-website-popup-close, .tl-rtc-app-website-popup-overlay')
            .on('click', '.tl-rtc-app-website-popup-close, .tl-rtc-app-website-popup-overlay', function (e) {
                if ($(e.target).is('.tl-rtc-app-website-popup-overlay') || $(e.target).closest('.tl-rtc-app-website-popup-close').length) {
                    $('.tl-rtc-app-website-login-popup, .tl-rtc-app-website-forgot-popup, .tl-rtc-app-website-popup-overlay').fadeOut(300);
                }
            });

        // ESC键关闭弹窗
        $(document).off('keyup').on('keyup', function (e) {
            if (e.key === 'Escape') {
                $('.tl-rtc-app-website-login-popup, .tl-rtc-app-website-popup-overlay').fadeOut(300);
            }
        });

        // 表单提交事件
        $('#loginForm').off('submit').on('submit', async function (e) {
            e.preventDefault();
            const captcha = $(this).find('input[name="captcha"]').val()
            if(!captcha){
                layer.msg('验证码不能为空')
                return
            }

            if(!$(this).find('input[name="username"]').val() && !$(this).find('input[name="email"]').val()){
                layer.msg('用户名和邮箱不能为空')
                return
            }

            if(!$(this).find('input[name="password"]').val()){
                layer.msg('密码不能为空')
                return
            }

            // 判断验证码
            if(!self.globals.captchaGenerator.validate(captcha)){
                layer.msg('验证码错误')
                return
            }

            let formData = {
                email: $(this).find('input[name="username"]').val(),
                password: $(this).find('input[name="password"]').val(),
            };

            formData.password = Base64.encode(formData.password)
            formData.email = Base64.encode(formData.email)

            const { data: result } = await axios.post('/api/web/user-login/login-by-website', formData)
            console.log('登录结果:', result);
            if(result.success){
                // 保存用户信息到 localStorage
                localStorage.setItem('tl_rtc_app_website_user_info', JSON.stringify({
                    userId: result.data.loginUserId,
                    email: result.data.loginUserEmail,
                    username: result.data.loginUsername,
                    avatar: result.data.loginUserAvatar,
                    lastLoginTime: result.data.loginTime
                }));
                
                layer.msg('登录成功')
                setTimeout(() => {
                    window.location.reload()
                }, 1000)
            }else{
                layer.msg(result.msg)
            }
        });

        $('#registerForm').off('submit').on('submit', async function (e) {
            e.preventDefault();
            if(!$(this).find('input[name="email"]').val()){
                layer.msg('邮箱不能为空')
                return
            }

            if(!$(this).find('input[name="password"]').val()){
                layer.msg('密码不能为空')
                return
            }

            if(!$(this).find('input[name="confirmPassword"]').val()){
                layer.msg('确认密码不能为空')
                return
            }

            if($(this).find('input[name="password"]').val() !== $(this).find('input[name="confirmPassword"]').val()){
                layer.msg('密码和确认密码不一致')
                return
            }   

            const emailCode = $(this).find('input[name="emailCode"]').val();
            if (!emailCode) {
                layer.msg('请输入邮箱验证码');
                return;
            }

            const formData = {
                email: $(this).find('input[name="email"]').val(),
                password: $(this).find('input[name="password"]').val(),
                code: emailCode
            };

            formData.email = Base64.encode(formData.email);
            formData.password = Base64.encode(formData.password);

            const { data: result } = await axios.post('/api/web/user-register/register-website-user', formData);

            if(result.success){
                layer.msg('注册成功，请登录')
                setTimeout(() => {
                    window.location.reload()
                }, 1000)
            }else{
                layer.msg(result.msg)
            }
        });

        // 发送验证码按钮点击事件
        $(document).off('click', '.tl-rtc-app-website-send-code-btn')
            .on('click', '.tl-rtc-app-website-send-code-btn', async function(e) {
                e.preventDefault();
                const $btn = $(this);
                const email = $btn.closest('form').find('input[name="email"]').val();
                
                if (!email) {
                    layer.msg('请输入邮箱');
                    return;
                }

                // 禁用按钮并开始倒计时
                let countdown = 60;
                $btn.prop('disabled', true);
                const timer = setInterval(() => {
                    if (countdown > 0) {
                        $btn.text(`${countdown}秒后重试`);
                        countdown--;
                    } else {
                        clearInterval(timer);
                        $btn.prop('disabled', false).text('发送验证码');
                    }
                }, 1000);

                try {
                    // 发送验证码请求
                    const { data: result } = await axios.post('/api/web/user-register/get-email-code', {
                        email: email
                    });
                    console.log('发送验证码结果:', result);
                    if(result.success){
                        layer.msg('验证码已发送，请查收邮件');
                    }else{
                        layer.msg(result.msg);
                    }
                } catch (error) {
                    clearInterval(timer);
                    $btn.prop('disabled', false).text('发送验证码');
                    layer.msg('验证码发送失败，请重试');
                }
            });

        // 修改登录表单中的忘记密码链接事件绑定
        $(document).off('click', '.tl-rtc-app-website-form-footer a:contains("忘记密码")')
            .on('click', '.tl-rtc-app-website-form-footer a:contains("忘记密码")', function (e) {
            e.preventDefault();
            e.stopPropagation();

            // 先隐藏登录弹窗
            $('.tl-rtc-app-website-login-popup').hide();
            
            // 确保遮罩层保持显示
            $('.tl-rtc-app-website-popup-overlay').show();
            
            // 显示忘记密码弹窗
            $('.tl-rtc-app-website-forgot-popup').fadeIn(300);
        });

        // 从忘记密码返回登录
        $(document).off('click', '.tl-rtc-app-website-forgot-popup .tl-rtc-app-website-to-login')
            .on('click', '.tl-rtc-app-website-forgot-popup .tl-rtc-app-website-to-login', function (e) {
            e.preventDefault();
            e.stopPropagation();

            $('.tl-rtc-app-website-forgot-popup').hide();
            $('.tl-rtc-app-website-login-popup').fadeIn(300);
        });

        // 关闭按钮事件
        $(document).off('click', '.tl-rtc-app-website-forgot-popup .tl-rtc-app-website-popup-close')
            .on('click', '.tl-rtc-app-website-forgot-popup .tl-rtc-app-website-popup-close', function() {
            $('.tl-rtc-app-website-popup-overlay').hide();
            $('.tl-rtc-app-website-forgot-popup').hide();
        });

        // 忘记密码表单提交
        $('#forgotForm').off('submit').on('submit', async function (e) {
            e.preventDefault();
            
            const emailCode = $(this).find('input[name="emailCode"]').val();
            if (!emailCode) {
                layer.msg('请输入邮箱验证码');
                return;
            }

            const newPassword = $(this).find('input[name="newPassword"]').val();
            const confirmPassword = $(this).find('input[name="confirmPassword"]').val();

            if (!newPassword) {
                layer.msg('请输入新密码');
                return;
            }

            if (!confirmPassword) {
                layer.msg('请确认新密码');
                return;
            }

            if (newPassword !== confirmPassword) {
                layer.msg('两次输入的密码不一致');
                return;
            }

            const formData = {
                email: $(this).find('input[name="email"]').val(),
                code: emailCode,
                password: Base64.encode(newPassword)
            };

            try {
                const { data: result } = await axios.post('/api/web/user-password/reset', formData);
                if (result.success) {
                    layer.msg('密码重置成功，请登录');
                    setTimeout(() => {
                        $('.tl-rtc-app-website-forgot-popup').hide();
                        $('.tl-rtc-app-website-login-popup').fadeIn(300);
                    }, 1000);
                } else {
                    layer.msg(result.msg);
                }
            } catch (error) {
                layer.msg('密码重置失败，请重试');
            }
        });

        // 忘记密码弹窗的发送验证码按钮
        $('.tl-rtc-app-website-forgot-popup .tl-rtc-app-website-send-code-btn').off('click')
            .on('click', async function(e) {
            e.preventDefault();
            const $btn = $(this);
            const email = $btn.closest('form').find('input[name="email"]').val();
            
            if (!email) {
                layer.msg('请输入邮箱');
                return;
            }

            // 禁用按钮并开始倒计时
            let countdown = 60;
            $btn.prop('disabled', true);
            const timer = setInterval(() => {
                if (countdown > 0) {
                    $btn.text(`${countdown}秒后重试`);
                    countdown--;
                } else {
                    clearInterval(timer);
                    $btn.prop('disabled', false).text('发送验证码');
                }
            }, 1000);

            try {
                const { data: result } = await axios.post('/api/web/user-password/get-reset-code', {
                    email: email
                });
                if (result.success) {
                    layer.msg('验证码已发送，请查收邮件');
                } else {
                    layer.msg(result.msg);
                    clearInterval(timer);
                    $btn.prop('disabled', false).text('发送验证码');
                }
            } catch (error) {
                clearInterval(timer);
                $btn.prop('disabled', false).text('发送验证码');
                layer.msg('验证码发送失败，请重试');
            }
        });
    },

    /**
     * 初始化轮播图
     */
    initCarousel() {
        const $ = this.globals.$;
        const $carouselWrapper = $('.tl-rtc-app-website-carousel-wrapper');

        if ($carouselWrapper.length) {
            new this.Carousel($carouselWrapper, $);
        } else {
            console.error('Carousel wrapper not found');
        }
    },

    /**
     * 初始化主题
     */
    initTheme() {
        const $ = this.globals.$;

        // 主题切换按钮点击事件
        $(document).on('click', '.tl-rtc-app-website-theme-toggle', function () {
            const $icon = $(this).find('i');
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            // 设置主题
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);

            // 更新图标
            if (newTheme === 'dark') {
                $icon.removeClass('layui-icon-moon').addClass('layui-icon-sun');
                $icon.css('color', '#fff'); // 暗色主题下图标使用白色
            } else {
                $icon.removeClass('layui-icon-sun').addClass('layui-icon-moon');
                $icon.css('color', '#333'); // 亮色主题下图标使用色
            }
        });

        // 初始化主题
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        const $icon = $('.tl-rtc-app-website-theme-toggle i');

        // 初始化图标状态
        if (savedTheme === 'dark') {
            $icon.removeClass('layui-icon-moon').addClass('layui-icon-sun');
            $icon.css('color', '#fff');
        } else {
            $icon.removeClass('layui-icon-sun').addClass('layui-icon-moon');
            $icon.css('color', '#333');
        }
    },

    /**
     * 初始化价格模块
     */
    initPricing() {
        const $ = this.globals.$;
        const layer = this.globals.layer;
        const self = this;

        // 获取产品列表
        const fetchProducts = async () => {
            try {
                const { data: result } = await axios.post('/api/web/website-product/get-product-list');
                if (result.success) {
                    return result.data || [];
                }
                return [];
            } catch (error) {
                console.error('Fetch products error:', error);
                return [];
            }
        };

        // 格式化时间，转为剩余时间
        const formatRemainingTime = (endTime) => {
            const now = new Date();
            const end = new Date(endTime);
            const diff = end - now;

            if (diff <= 0) {
                return '已结束';
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor(diff / (1000 * 60 * 60) % 24);
            const minutes = Math.floor(diff / (1000 * 60) % 60);
            const seconds = Math.floor(diff / 1000 % 60);

            return `${days}天 ${hours}小时 ${minutes}分 ${seconds}秒`;
        };

        // 渲染产品列表
        const renderProducts = (products) => {
            // 按type排序
            products.sort((a, b) => a.type - b.type);

            return products.map(product => `
                <div class="tl-rtc-app-website-pricing-card ${product.type === 3 ? 'popular' : ''} ${product.status === 2 ? 'disabled' : ''}">
                    <div class="tl-rtc-app-website-pricing-header">
                        <h3 class="tl-rtc-app-website-pricing-title">${product.typeName}</h3>
                        ${product.status === 2 ? '<span class="tl-rtc-app-website-pricing-status">暂未上架</span>' : ''}
                        <div class="tl-rtc-app-website-pricing-price">
                            ${product.type === 1 ? '免费<small>/永久</small>' : `￥${(product.price / 100).toFixed(0)}<small>/永久</small>`}
                        </div>
                        ${product.prePrice ? `
                            <div class="tl-rtc-app-website-pricing-price-original">原价: ￥${(product.prePrice / 100).toFixed(0)}</div>
                        ` : ''}
                        ${product.status !== 2 && product.type !== 1 && product.discountEndTime ? `
                            <div class="tl-rtc-app-website-pricing-discount">
                                <i class="layui-icon layui-icon-time" style="font-size: 12px;"></i>
                                <span class="discountInterval">优惠即将在 <b style="font-size: 15px;"> ${formatRemainingTime(product.discountEndTime)} </b></span>
                            </div>
                        `: ''}
                        <p class="tl-rtc-app-website-pricing-description">${product.desc}</p>
                    </div>
                    <ul class="tl-rtc-app-website-features">
                        ${product.features.split(',').map(feature => `
                            <li>
                                <i class="layui-icon layui-icon-ok"></i>
                                ${feature}
                            </li>
                        `).join('')}
                    </ul>
                    <a href="javascript:;" class="tl-rtc-app-website-pricing-btn ${product.status === 2 ? 'disabled' : ''}" 
                       data-product-id="${product.id}" ${product.status === 2 ? 'disabled' : ''}>
                        ${product.type === 1 ? '立即使用' : '立即购买'}
                    </a>
                </div>
            `).join('');
        };

        // 初始化产品列表
        const initProducts = async () => {
            const $container = $('.tl-rtc-app-website-pricing-container');
            
            // 显示加载状态
            $container.html(`
                <div class="tl-rtc-app-website-pricing-loading">
                    <i class="layui-icon layui-icon-loading layui-anim layui-anim-rotate layui-anim-loop"></i>
                    <p>加载中...</p>
                </div>
            `);

            // 获取产品列表
            const products = await fetchProducts();
            
            if (products.length === 0) {
                $container.html(`
                    <div class="tl-rtc-app-website-pricing-empty">
                        <i class="layui-icon layui-icon-close"></i>
                        <p>暂无定价产品</p>
                    </div>
                `);
                return;
            }

            // 渲染产品列表
            $container.html(renderProducts(products));

            // 更新每一个产品的优惠倒计时
            const discountInterval = document.getElementsByClassName('discountInterval');
            if (discountInterval) {
                for (let i = 0; i < discountInterval.length; i++) {
                    // 定时器更新倒计时
                    setInterval(() => {
                        discountInterval[i].innerHTML = `优惠即将在 <b style="font-size: 15px;"> ${formatRemainingTime(products[i].discountEndTime)} </b>`;
                    }, 1000);
                }
            }
        };

        // 初始化产品列表
        initProducts();

        // 添加购买按钮点击事件
        $(document).off('click', '.tl-rtc-app-website-pricing-btn').on('click', '.tl-rtc-app-website-pricing-btn', async function(e) {
            e.preventDefault();
            
            const productId = $(this).data('product-id');
            const card = $(this).closest('.tl-rtc-app-website-pricing-card');
            const version = card.find('.tl-rtc-app-website-pricing-title').text();
            
            // 跳过基础版和团队版
            if (version === '基础版' || version === '团队版') {
                return;
            }

            // 检查登录状态
            const userInfo = localStorage.getItem('tl_rtc_app_website_user_info');
            if (!userInfo) {
                layer.msg('请先登录');
                // 显示登录弹窗
                $('.tl-rtc-app-website-login-btn').click();
                return;
            }

            // 显示确认弹窗
            layer.confirm(`创建${version}订单`, {
                btn: ['确认', '取消'],
                title: '订单创建',
                shadeClose: 1,
                skin: 'tl-rtc-app-website-layer',
            }, async function(index) {
                try {
                    // 创建订单
                    const { data: result } = await axios.post('/api/web/website-product-order/create-order', {
                        productId: productId
                    });

                    if (result.success) {
                        // 打开订单管理页面并定位到新创建的订单
                        self.showOrderManagement(result.data.id);
                    } else {
                        layer.msg(result.msg || '创建订单失败');
                    }
                } catch (error) {
                    layer.msg('创建订单失败，请重试');
                    console.error('Create order error:', error);
                }

                layer.close(index);
            });

            
        });
    },

    initMobileNav() {
        const $ = this.globals.$;
        let isOpen = false;

        // 移动端菜单切换
        $('.tl-rtc-app-website-mobile-nav-toggle').on('click', function () {
            const $nav = $('.tl-rtc-app-website-nav-mobile');
            const $icon = $(this).find('i');

            if (isOpen) {
                $nav.removeClass('active');
                $icon.removeClass('layui-icon-close').addClass('layui-icon-shrink-right');
            } else {
                $nav.addClass('active');
                $icon.removeClass('layui-icon-shrink-right').addClass('layui-icon-close');
            }

            isOpen = !isOpen;
        });

        // 导航点击处理函数
        const handleNavClick = (e) => {
            e.preventDefault();
            const target = $(e.currentTarget).attr('href');

            // 如果是锚点链接
            if (target && target.startsWith('#')) {
                const $targetSection = $(target);
                if ($targetSection.length) {
                    const headerHeight = $('.tl-rtc-app-website-header').outerHeight();
                    const targetOffset = $targetSection.offset().top - headerHeight;

                    // 关闭移动端菜单
                    if ($(window).width() <= 768) {
                        $('.tl-rtc-app-website-nav-mobile').removeClass('active');
                        $('.tl-rtc-app-website-mobile-nav-toggle i')
                            .removeClass('layui-icon-close')
                            .addClass('layui-icon-shrink-right');
                        isOpen = false;
                    }

                    // 平滑滚动到目标位置
                    $('html, body').animate({
                        scrollTop: targetOffset
                    }, 800);
                }
            }
        };

        // 为桌面端和移动端导航添加点击事件
        $(document).off('click', '.tl-rtc-app-website-nav a:not(.tl-rtc-app-website-login-btn), .tl-rtc-app-website-nav-mobile a:not(.tl-rtc-app-website-login-btn)')
            .on('click', '.tl-rtc-app-website-nav a:not(.tl-rtc-app-website-login-btn), .tl-rtc-app-website-nav-mobile a:not(.tl-rtc-app-website-login-btn)', handleNavClick);
    },

    // 在 TlRtcAppWebsite 对象中添加初始化帮助文档的方法
    initHelp() {
        const $ = this.globals.$;

        // 文档导航切换
        $('.tl-rtc-app-website-help-nav button').on('click', function () {
            const target = $(this).data('target');

            // 更新按钮状态
            $('.tl-rtc-app-website-help-nav button').removeClass('active');
            $(this).addClass('active');

            // 更新内容显示
            $('.tl-rtc-app-website-help-section').removeClass('active');
            $(`#${target}`).addClass('active');
        });

        // FAQ折叠面板
        $('.faq-question').on('click', function () {
            const $item = $(this).parent();
            const $answer = $item.find('.faq-answer');

            if ($item.hasClass('active')) {
                $item.removeClass('active');
                $answer.slideUp(300);
            } else {
                $('.faq-item').removeClass('active');
                $('.faq-answer').slideUp(300);
                $item.addClass('active');
                $answer.slideDown(300);
            }
        });

        // 代码复制功能
        $('.copy-btn').on('click', function () {
            const code = $(this).prev('pre').text();
            navigator.clipboard.writeText(code).then(() => {
                const $btn = $(this);
                const originalText = $btn.text();

                $btn.text('已复制！');
                setTimeout(() => {
                    $btn.html('<i class="layui-icon layui-icon-file"></i>复制');
                }, 2000);
            });
        });
    },

    /**
     * 检查登录状态
     */
    checkLoginStatus() {
        const $ = this.globals.$;
        
        axios.get('/api/web/user-login/website-login-state').then(({data: result}) => {
            if (result.success && result.data) {
                // 使用新的前缀存储用户信息
                localStorage.setItem('tl_rtc_app_website_user_info', JSON.stringify({
                    userId: result.data.loginUserId,
                    email: result.data.loginUserEmail,
                    username: result.data.loginUsername,
                    avatar: result.data.loginUserAvatar,
                    lastLoginTime: result.data.loginTime
                }));

                // 隐藏登录按钮，显示头像
                $('.tl-rtc-app-website-login-btn').hide();
                $('.tl-rtc-app-website-user-avatar').show();
                
                // 设置用户头像
                if(result.data.loginUserAvatar) {
                    $('.tl-rtc-app-website-user-avatar img').attr('src', result.data.loginUserAvatar);
                }
            } else {
                // 清除本地存储时也使用新的 key
                localStorage.removeItem('tl_rtc_app_website_user_info');
                // 显示登录按钮，隐藏头像
                $('.tl-rtc-app-website-login-btn').show();
                $('.tl-rtc-app-website-user-avatar').hide();
            }
        });
    },

    logout() {
        const $ = this.globals.$;
        const layer = this.globals.layer;
        
        axios.get('/api/web/user-logout/website-logout').then(({data: result}) => {
            if(result.success) {
                // 清除本地存储的用户信息
                localStorage.removeItem('tl_rtc_app_website_user_info');
                
                layer.msg('退出成功');
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                layer.msg(result.msg);
            }
        });
    },

    /**
     * 显示个人中心弹窗
     */
    showUserCenter() {
        const $ = this.globals.$;
        const layer = this.globals.layer;

        // 使用新的 key 获取用户信息
        const userInfo = JSON.parse(localStorage.getItem('tl_rtc_app_website_user_info') || '{}');

        // 格式化时间
        const formatTime = (timestamp) => {
            if (!timestamp) return '暂无记录';
            return new Date(Number(timestamp)).toLocaleString();
        };

        layer.open({
            type: 1,
            title: '个人信息',
            shadeClose: 1,
            area: ['400px', '430px'],
            skin: 'tl-rtc-app-website-layer', // 添加自定义皮肤类
            content: `
                <div class="tl-rtc-app-website-user-center">
                    <div class="user-info-header">
                        <div class="avatar-wrapper">
                            <img src="${userInfo.avatar || '/image/default-avatar.png'}" alt="用户头像">
                        </div>
                        <div class="user-basic-info">
                            <h3>${userInfo.username || '用户'}</h3>
                            <div class="user-email">
                                <i class="layui-icon layui-icon-email"></i>
                                <span>${userInfo.email || ''}</span>
                            </div>
                        </div>
                    </div>
                    <div class="user-info-details">
                        <div class="info-item">
                            <label>用户 ID</label>
                            <span>${userInfo.userId || ''}</span>
                        </div>
                        <div class="info-item">
                            <label>最近登录</label>
                            <span>${formatTime(userInfo.lastLoginTime)}</span>
                        </div>
                    </div>
                </div>
            `,
            success: (layero) => {
                // 设置弹窗的宽度
                layero.css({
                    'border-radius': '6px',
                })
            }
        });
    },

    /**
     * 显示订单管理弹窗
     */
    showOrderManagement(targetOrderId = null) {
        const $ = this.globals.$;
        const layer = this.globals.layer;
        const self = this;

        // 分页配置
        const pageSize = 5;
        let currentPage = 1;
        let currentStatus = 'all';

        // 格式化时间
        const formatTime = (timestamp) => {
            return date = new Date(timestamp).toLocaleString();
        };

        // 获取订单列表
        const fetchOrders = async () => {
            try {
                const { data: result } = await axios.post('/api/web/website-product-order/get-order-list', {
                    page: currentPage,
                    pageSize: pageSize,
                    status: currentStatus,
                });
                if (result.success) {
                    return result.data || [];
                }
                return [];
            } catch (error) {
                console.error('Fetch orders error:', error);
                return [];
            }
        };

        // 支付订单
        const payOrder = async (orderId) => {
            try {
                const { data: result } = await axios.post('/api/web/website-product-order/offline-pay-order', {
                    orderId: orderId
                });
                if (result.success) {
                    layer.msg(result.msg);
                    await refreshOrders(); // 刷新订单列表
                } else {
                    layer.msg(result.msg || '支付失败');
                }
            } catch (error) {
                layer.msg('支付失败，请重试');
                console.error('Pay order error:', error);
            }
        };

        // 取消订单
        const cancelOrder = async (orderId) => {
            try {
                const { data: result } = await axios.post('/api/web/website-product-order/cancel-order', {
                    orderId: orderId
                });
                if (result.success) {
                    layer.msg('订单已取消');
                    await refreshOrders(); // 刷新订单列表
                } else {
                    layer.msg(result.msg || '取消订单失败');
                }
            } catch (error) {
                layer.msg('取消订单失败，请重试');
                console.error('Cancel order error:', error);
            }
        };

        // 刷新订单列表
        const refreshOrders = async () => {
            const orders = await fetchOrders();
            const filteredOrders = currentStatus === 'all' 
                ? orders 
                : orders.filter(order => order.status === currentStatus);
            const totalPages = Math.ceil(filteredOrders.length / pageSize);
            const startIndex = (currentPage - 1) * pageSize;
            const endIndex = startIndex + pageSize;
            const pageOrders = filteredOrders.slice(startIndex, endIndex);

            // 渲染订单列表
            $('.order-container').html(renderOrders(pageOrders, currentPage, totalPages));

            // 如果有目标订单号，高亮显示
            if (targetOrderId) {
                const targetElement = $(`.order-item[data-order-id="${targetOrderId}"]`);
                if (targetElement.length > 0) {
                    targetElement.addClass('highlight-order');
                    targetElement[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        };

        // 渲染订单列表
        const renderOrders = (orders, page, totalPages) => {
            let classMap = {
                "1": "unpaid",
                "2": "paid",
                "3": "cancel",
                "4": "finish",
            }
            if (orders.length === 0) {
                return `
                    <div class="order-empty">
                        <i class="layui-icon layui-icon-form"></i>
                        <p>暂无订单</p>
                    </div>
                `;
            }

            return `
                <div class="order-list">
                    ${orders.map(order => `
                        <div class="order-item" data-status="${order.status}" data-order-id="${order.id}">
                            <div class="order-header">
                                <div class="order-no">
                                    订单号：<span class="copyable-text">${order.code}</span>
                                    <svg class="copy-icon" data-clipboard-text="${order.code}">
                                        <use xlink:href="#tl-rtc-app-icon-fuzhi"></use>
                                    </svg>
                                </div>
                                <span class="order-time">下单时间：${formatTime(order.createdAt)}</span>
                                <span class="order-status ${classMap[order.status]}">${order.statusText}</span>
                            </div>
                            <div class="order-content">
                                <div class="product-info">
                                    <h4>${order.productName}</h4>
                                    <p>${order.productDesc}</p>
                                </div>
                                <div class="order-price">
                                    <div class="price">￥${(order.productPrice / 100).toFixed(2)}</div>
                                    ${order.status === 1 ? `
                                        <button type="button" class="pay-btn" data-order-id="${order.id}">立即支付</button>
                                        <button type="button" class="cancel-btn" data-order-id="${order.id}">取消订单</button>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                ${totalPages > 0 ? `
                    <div class="order-pagination">
                        <button class="prev-page" ${page <= 1 ? 'disabled' : ''}>上一页</button>
                        <span class="page-info">${page} / ${totalPages}</span>
                        <button class="next-page" ${page >= totalPages ? 'disabled' : ''}>下一页</button>
                    </div>
                ` : ''}
            `;
        };

        // 打开订单管理弹窗
        layer.open({
            type: 1,
            title: '订单管理',
            area: ['800px', '635px'],
            scrollbar: false,
            shadeClose: 1,
            skin: 'tl-rtc-app-website-layer',
            content: `
                <div class="tl-rtc-app-website-order-management">
                    <div class="order-tabs">
                        <a href="javascript:;" class="active" data-status="all">全部订单</a>
                        <a href="javascript:;" data-status="1">待支付</a>
                        <a href="javascript:;" data-status="2">已支付</a>
                        <a href="javascript:;" data-status="3">已取消</a>
                    </div>
                    <div class="order-container">
                        <div class="order-loading">
                            <i class="layui-icon layui-icon-loading layui-anim layui-anim-rotate layui-anim-loop"></i>
                            <p>加载中...</p>
                        </div>
                    </div>
                </div>
            `,
            success: async function(layero) {
                layero.css({
                    'border-radius': '6px'
                })
                // 初始化订单列表
                await refreshOrders();

                // 绑定标签切换
                $(layero).find('.order-tabs a').on('click', async function() {
                    currentStatus = $(this).data('status');
                    currentPage = 1;
                    $(this).addClass('active').siblings().removeClass('active');
                    await refreshOrders();
                });

                // 绑定分页事件
                $(layero).on('click', '.prev-page:not(:disabled)', async function() {
                    currentPage--;
                    await refreshOrders();
                });

                $(layero).on('click', '.next-page:not(:disabled)', async function() {
                    currentPage++;
                    await refreshOrders();
                });

                // 绑定支付和取消按钮事件
                $(layero).on('click', '.pay-btn', function() {
                    const orderId = $(this).data('order-id');
                    layer.confirm('确定要支付该订单吗？', {
                        btn: ['确定', '取消'],
                        shadeClose: 1,
                        skin: 'tl-rtc-app-website-layer',
                    }, function(index) {
                        payOrder(orderId);
                        layer.close(index);
                    });
                });

                $(layero).on('click', '.cancel-btn', function() {
                    const orderId = $(this).data('order-id');
                    layer.confirm('确定要取消该订单吗？', {
                        btn: ['确定', '取消'],
                        shadeClose: 1,
                        skin: 'tl-rtc-app-website-layer',
                    }, function(index) {
                        cancelOrder(orderId);
                        layer.close(index);
                    });
                });

                // 初始化复制功能
                const clipboard = new ClipboardJS('.copy-icon');
                
                clipboard.on('success', function(e) {
                    layer.msg('复制成功');
                    e.clearSelection();
                });

                clipboard.on('error', function(e) {
                    layer.msg('复制失败，请手动复制');
                });
            }
        });
    }
};

// 初始化网站
TlRtcAppWebsite.init();