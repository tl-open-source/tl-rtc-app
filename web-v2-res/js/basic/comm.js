(function () {
    const tl_rtc_app_comm = {
        randomId: function () {
            let s = [];
            let hexDigits = "0123456789abcdef";
            for (let i = 0; i < 36; i++) {
                s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
            }
            s[14] = "4";
            s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
            s[8] = s[13] = s[18] = s[23] = "-";
            return s.join("")
        },
        addUrlHashParams: function (obj) {
            let redirect = window.location.protocol + "//" + window.location.host + "#"
            let oldObj = this.getRequestHashArgsObj();
            obj = Object.assign(oldObj, obj);
            for (let key in obj) {
                redirect += key + "=" + encodeURIComponent(obj[key]) + "&";
            }
            return redirect;
        },
        getRequestHashArgsObj: function () {
            let query = decodeURIComponent(window.location.hash.substring(1));
            let args = query.split("&");
            let obj = {};
            for (let i = 0; i < args.length; i++) {
                let pair = args[i].split("=");
                const key = pair[0];
                const val = pair[1];
                if (key) {
                    obj[key] = decodeURIComponent(val)
                }
            }
            return obj;
        },
        getRequestHashArgs: function (key) {
            let query = decodeURIComponent(window.location.hash.substring(1));
            let args = query.split("&");
            for (let i = 0; i < args.length; i++) {
                let pair = args[i].split("=");
                if (pair[0] === key) {
                    return pair[1];
                }
            }
            return "";
        },
        /**
         * 是否包含中文
         * @param {*} str 
         * @returns 
         */
        containChinese: function (str) {
            return /[\u4E00-\u9FA5\uF900-\uFA2D]/.test(str);
        },
        /**
         * 是否包含数字
         * @param {*} str 
         * @returns 
         */
        containNumber: function (str) {
            return /^[0-9]+.?[0-9]*$/.test(str);
        },
        /**
         * 是否包含字母
         * @param {*} str 
         * @returns 
         */
        containSymbol: function (str) {
            return new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]").test(str)
        },
        /**
         * 是否是邮箱
         * @param {*} str 
         * @returns 
         */
        isEmail: function (str) {
            return /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(str);
        },
        /**
         * 屏幕是否是横向
         * @returns 
         */
        isLandscape: function () {
            return window.innerWidth > window.innerHeight;
        },
        /**
         * 屏幕是否是竖项
         * @returns 
         */
        isPortrait: function () {
            return !this.isLandscape()
        },
        /**
         * 转义
         * @param {*} str 
         * @returns 
         */
        escapeStr: function (str) {
            const entityMap = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;',
                '/': '&#x2F;',
                '`': '&#x60;',
                '=': '&#x3D;'
            };
            const encodedMap = {
                '%': '%25',
                '!': '%21',
                "'": '%27',
                '(': '%28',
                ')': '%29',
                '*': '%2A',
                '-': '%2D',
                '.': '%2E',
                '_': '%5F',
                '~': '%7E'
            };
            return String(str).replace(/[&<>"'`=\/%!'()*\-._~]/g, function (s) {
                return entityMap[s] || encodedMap[s] || '';
            });
        },
        /**
         * 反转义
         * @param {*} str 
         * @returns 
         */
        unescapeStr: function (str) {
            const entityMap = {
                '&amp;': '&',
                '&lt;': '<',
                '&gt;': '>',
                '&quot;': '"',
                '&#39;': "'",
                '&#x2F;': '/',
                '&#x60;': '`',
                '&#x3D;': '='
            };
            const encodedMap = {
                '%25': '%',
                '%21': '!',
                '%27': "'",
                '%28': '(',
                '%29': ')',
                '%2A': '*',
                '%2D': '-',
                '%2E': '.',
                '%5F': '_',
                '%7E': '~'
            };
            return String(str).replace(/&(amp|lt|gt|quot|#39|#x2F|#x60|#x3D);|%(25|21|27|28|29|2A|2D|2E|5F|7E)/g, function (s) {
                return entityMap[s] || encodedMap[s] || '';
            });
        },
        /**
         * 获取网络状态
         * @returns 
         */
        getNetWorkState: function () {
            let ua = navigator.userAgent;
            let networkStr = ua.match(/NetType\/\w+/) ? ua.match(/NetType\/\w+/)[0] : 'NetType/other';
            networkStr = networkStr.toLowerCase().replace('nettype/', '');
            if (!['wifi', '5g', '3g', '4g', '2g', '3gnet', 'slow-2g'].includes(networkStr)) {
                if (navigator.connection) {
                    networkStr = navigator.connection.effectiveType
                }
            }
            switch (networkStr) {
                case 'wifi':
                    return 'wifi';
                case '5g':
                    return '5g';
                case '4g':
                    return '4g';
                case '3g' || '3gnet':
                    return '3g';
                case '2g' || 'slow-2g':
                    return '2g';
                default:
                    return 'unknow';
            }
        },
        /**
         * 震动效果
         * @param {*} id 
         * @param {*} top 
         * @param {*} left 
         */
        shaking: function (id, top, left) {
            let a = ['maringTop', 'marginLeft'], b = 0;
            window.shakingId = setInterval(function () {
                document.getElementById(id).style[a[b % 2]] = (b++) % 4 < 2 ? (top + "px") : (left + "px");
                if (b > 15) { clearInterval(window.shakingId); b = 0 }
            }, 32)
        },
        /**
         * 加载js
         * @param {*} url 
         * @param {*} callback 
         */
        loadJS: function (url, callback) {
            let script = document.createElement('script'),
                fn = callback || function () { };
            script.type = 'text/javascript';
            //IE
            if (script.readyState) {
                script.onreadystatechange = function () {
                    if (script.readyState == 'loaded' || script.readyState == 'complete') {
                        script.onreadystatechange = null;
                        fn();
                    }
                };
            } else {
                //其他浏览器
                script.onload = function () {
                    fn();
                };
            }
            script.src = url;
            document.getElementsByTagName('head')[0].appendChild(script);
        },
        /**
         * 是否是移动端
         * @returns 
         */
        isMobile: function () {
            return window.innerWidth < 840;
        },
        /**
         * 键盘事件
         * @param {*} dom 
         * @param {*} callback 
         */
        keydownCallback: function (dom, callback) {
            if (dom) {
                dom.onkeydown = function (e) {
                    if (e.defaultPrevented) {
                        return;
                    }

                    if (e.shiftKey) {
                        // shift+enter 换行
                        return;
                    } else if (e.key !== undefined) {
                        if (e.key === "Enter") {
                            // enter键执行
                            callback && callback()
                            e.preventDefault();
                        }
                    } else if (e.keyCode !== undefined) {
                        if (e.keyCode === 13) {
                            // enter键执行
                            callback && callback()
                            e.preventDefault();
                        }
                    }
                }
            }
        },
        /**
         * 获取媒体流
         * @param {*} defaultConstraints 
         * @returns 
         */
        getMediaPlay: function (defaultConstraints) {
            let media = null;
            if (window.navigator.mediaDevices && window.navigator.mediaDevices.getUserMedia) {
                media = window.navigator.mediaDevices.getUserMedia(defaultConstraints);
            } else if (window.navigator.mozGetUserMedia) {
                media = navigator.mozGetUserMedia(defaultConstraints);
            } else if (window.navigator.getUserMedia) {
                media = window.navigator.getUserMedia(defaultConstraints)
            } else if (window.navigator.webkitGetUserMedia) {
                media = new Promise((resolve, reject) => {
                    window.navigator.webkitGetUserMedia(defaultConstraints, (res) => {
                        resolve(res)
                    }, (err) => {
                        reject(err)
                    });
                })
            }
            return media
        },
        /**
         * 获取设备列表
         * @returns 
         */
        getDeviceList: async function () {
            const list = await new Promise((resolve, reject) => {
                navigator.mediaDevices && navigator.mediaDevices.enumerateDevices().then((devices) => {
                    const videoDeviceList = devices.filter((device) => device.kind === "videoinput" && device.deviceId !== "default");
                    const audioDeviceList = devices.filter((device) => device.kind === "audioinput" && device.deviceId !== "default");
                    const loudspeakerDeviceList = devices.filter((device) => device.kind === "audiooutput" && device.deviceId !== "default");
                    resolve({
                        videoDeviceList, audioDeviceList, loudspeakerDeviceList
                    })
                }, (err) => {
                    console.error("getDeviceList error !")
                    reject({
                        videoDeviceList: [], audioDeviceList: [], loudspeakerDeviceList: []
                    })
                });
            })

            return list
        },
        /**
         * 是否支持webrtc
         * @param {*} rtcConfig 
         * @returns 
         */
        supposeWebrtc: function (rtcConfig) {
            try {
                let testRTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection ||
                    window.mozRTCPeerConnection || window.RTCIceGatherer;
                if (testRTCPeerConnection) {
                    new RTCPeerConnection(rtcConfig);
                    return true;
                } else {
                    return false;
                }
            } catch (error) {
                console.error("浏览器不支持webrtc")
                return false;
            }
        },
        /**
         * 复制文本
         * @param {*} id 
         * @param {*} content 
         * @param {*} callback 
         * @param {*} closeDomIds 
         * @returns 
         */
        copyTxt: function (id, content, callback, closeDomIds) {
            const dom = document.querySelector("#" + id)
            if(!dom){
                return;
            }
            dom.setAttribute("data-clipboard-text", content);
            let clipboard = new ClipboardJS('#' + id);
            clipboard.on('success', function (e) {
                e.clearSelection();
                callback && callback();
            });

            dom.addEventListener('click', function () {
                setTimeout(() => {
                    clipboard.destroy();
                }, 1000);
            })

            if(closeDomIds && closeDomIds.length > 0){
                closeDomIds.forEach((closeId) => {
                    const closeDom = document.querySelector("#" + closeId)
                    if(closeDom){
                        closeDom.addEventListener('click', function () {
                            clipboard.destroy();
                        })
                    }
                })
            }

            return clipboard;
        },
        /**
         * 是否是wss
         * @param {*} wss 
         * @returns 
         */
        isWssHost: function(wss){
            const websocketRegex = /^(wss?:\/\/)((\d{1,3}(\.\d{1,3}){3})|(([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}))(:(\d+))?(\/[^\s]*)?$/;

            if (typeof wss !== 'string') return false;

            if (!websocketRegex.test(wss)) return false;

            const ipMatch = wss.match(/^(wss?:\/\/)(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/);
            if (ipMatch) {
                const ipSegments = ipMatch[2].split('.').map(Number);
                return ipSegments.every(segment => segment >= 0 && segment <= 255);
            }

            return true;
        },
        /**
         * 生成二维码
         * @param {*} id 
         * @param {*} content 
         * @param {*} colorDark 
         * @param {*} colorLight 
         */
        getQrCode: function (id, content, colorDark = '#000000', colorLight = '#ffffff') {
            const qrcode = new QRCode(id, {
                text: content,   // 二维码内容
                width: 300,
                height: 300,
                colorDark: colorDark,  // 码的颜色
                colorLight: colorLight,  // 码的背景色
                correctLevel: QRCode.CorrectLevel.H  // 高度容错
            });
        },
        /**
         * 保存二维码
         * @param {*} id 
         */
        saveQrCode: function (id) {
            const canvas = document.querySelector('#' + id + ' canvas');
            const image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
            const a = document.createElement('a');
            a.href = image;
            a.download = 'qrcode.png';
            a.click();
        },
        /**
         * 颜色转换
         * @param {*} hex 
         * @returns 
         */
        hexToRgb: function (hex) {
            let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            hex = hex.replace(shorthandRegex, function (m, r, g, b) {
                return r + r + g + g + b + b;
            });

            let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        },
        /**
         * 颜色转换
         * @param {*} r 
         * @param {*} g 
         * @param {*} b 
         * @returns 
         */
        rgbToHex: function (r, g, b) {
            return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
        },
        /**
         * 颜色转换
         * @param {*} hex 
         * @param {*} amount 
         * @returns 
         */
        lightenColor: function (hex, amount) {
            var rgb = this.hexToRgb(hex);
            if (!rgb) {
                return hex
            }
            var lightenedRgb = {
                r: Math.min(255, rgb.r + amount),
                g: Math.min(255, rgb.g + amount),
                b: Math.min(255, rgb.b + amount)
            };
            return this.rgbToHex(lightenedRgb.r, lightenedRgb.g, lightenedRgb.b);
        },
        /**
         * 颜色转换
         * @param {*} hex 
         * @returns 
         */
        invertColor: function(hex) {
            // 去掉前面的 #
            hex = hex.replace(/^#/, '');

            // 如果是3位数，则转为6位数
            if (hex.length === 3) {
                hex = hex.split('').map(function (hex) {
                    return hex + hex;
                }).join('');
            }

            // 将16进制颜色转换为RGB
            let r = parseInt(hex.substring(0, 2), 16);
            let g = parseInt(hex.substring(2, 4), 16);
            let b = parseInt(hex.substring(4, 6), 16);

            // 计算对等的颜色 (255 - 当前颜色值)
            let invertedR = (255 - r).toString(16).padStart(2, '0');
            let invertedG = (255 - g).toString(16).padStart(2, '0');
            let invertedB = (255 - b).toString(16).padStart(2, '0');

            // 返回对等颜色的十六进制值
            return `#${invertedR}${invertedG}${invertedB}`;
        },
        /**
         * 是否是浅色
         * @param {*} hex 
         * @returns 
         */
        isLightColor(hex) {
            // 去掉前面的 #
            hex = hex.replace(/^#/, '');

            // 如果是3位数，则转为6位数
            if (hex.length === 3) {
                hex = hex.split('').map(function (hex) {
                    return hex + hex;
                }).join('');
            }

            // 将16进制颜色转换为RGB
            let r = parseInt(hex.substring(0, 2), 16);
            let g = parseInt(hex.substring(2, 4), 16);
            let b = parseInt(hex.substring(4, 6), 16);

            // 计算相对亮度 (Luminance)，使用加权公式：0.299 * R + 0.587 * G + 0.114 * B
            let luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

            // 根据亮度判断是深色还是浅色
            // 一般来说，亮度 > 0.5 被视为浅色
            return luminance > 0.5;
        },
        /**
         * 鼠标移入提示
         * @param {*} param0 
         */
        mouseEnterTips: function ({
            id, text, time=1000, color='#50393d', position='top'
        }) {
            if(position === 'top'){
                position = 1;
            }else if(position === 'right'){
                position = 2;
            }else if(position === 'bottom'){
                position = 3;
            }else if(position === 'left'){
                position = 4;
            }else{
                position = 1;
            }
            layer.tips(text, '#'+id, {
                skin: 'tl-rtc-app-layer-tips',
                tips: [ position, color ],
                time: time
            });
        },
        /**
         * 鼠标移出提示
         * @param {*} id 
         * @param {*} text 
         */
        mouseLeaveTips: function (id, text) {
            layer.closeAll('tips');
        },
        /**
         * 滚动到底部
         * @param {*} dom 
         * @param {*} duration 
         * @param {*} timeout 
         */
        scrollToBottom: function (dom, duration, timeout) {
            let start = dom.scrollTop;
            let end = dom.scrollHeight - dom.clientHeight;
            let change = end - start;
            let currentTime = 0;
            let increment = 20;

            function easeOutCubic(t) {
                return (t = t / 1 - 1) * t * t + 1;
            }

            function animateScroll() {
                currentTime += increment;
                let val = easeOutCubic(currentTime / duration) * change + start;
                dom.scrollTop = val;
                if (currentTime < duration) {
                    requestAnimationFrame(animateScroll);
                }
            }

            setTimeout(() => {
                animateScroll()
            }, timeout);
        },
        /**
         * margin移动到隐藏
         * @param {*} dom 
         * @param {*} duration 
         * @param {*} timeout 
         * @param {*} callback 
         */
        marginToHidden: function (dom, duration, timeout, callback) {
            let change = 100;
            let currentTime = 0;
            let increment = 20;

            function easeOutCubic(t) {
                return (t = t / 1 - 1) * t * t + 1;
            }

            function animateMargin() {
                currentTime += increment;
                let val = easeOutCubic(currentTime / duration) * change;
                dom.style.marginLeft = val + "%";
                if (val === 100) {
                    callback()
                }
                if (currentTime < duration) {
                    requestAnimationFrame(animateMargin);
                }
            }

            setTimeout(() => {
                animateMargin()
            }, timeout);
        },
        /**
         * 向左移动
         * @param {*} dom 
         * @param {*} change 
         * @param {*} duration 
         * @param {*} timeout 
         */
        translateXToLeft: function (dom, change, duration, timeout) {
            let currentTime = 0;
            let increment = 20;

            function easeOutCubic(t) {
                return (t = t / 1 - 1) * t * t + 1;
            }

            function animateMargin() {
                currentTime += increment;
                let val = easeOutCubic(currentTime / duration) * change;
                dom.style.transform = `translateX(-${val}px)`;
                if (currentTime < duration) {
                    requestAnimationFrame(animateMargin);
                }
            }

            setTimeout(() => {
                animateMargin()
            }, timeout);
        },
        /**
         * 向右移动
         * @param {*} dom 
         * @param {*} duration 
         * @param {*} timeout 
         */
        translateXToRight: function (dom, duration, timeout) {
            let change = 100;
            let currentTime = 0;
            let increment = 20;

            function easeOutCubic(t) {
                return (t = t / 1 - 1) * t * t + 1;
            }

            function animateMargin() {
                currentTime += increment;
                let val = easeOutCubic(currentTime / duration) * change;
                dom.style.transform = `translateX(${val}px)`;
                if (currentTime < duration) {
                    requestAnimationFrame(animateMargin);
                }
            }

            setTimeout(() => {
                animateMargin()
            }, timeout);
        },
        /**
         * 生成随机昵称
         * @param {*} language 
         * @returns 
         */
        genNickName: function (language) {
            let { adjectives, nouns } = language === 'zh' ? this.nameDatabase() : this.nameDatabaseEn()
            let adjectiveIndex = Math.floor(Math.random() * adjectives.length);
            let nounIndex = Math.floor(Math.random() * nouns.length);
            let adjective = adjectives[adjectiveIndex];
            let noun = nouns[nounIndex];
            let randomNum = Math.floor(Math.random() * 1000);
            return adjective + noun + randomNum;
        },
        nameDatabase: function () {
            const adjectives = [
                
            ];
            const nouns = [
                
            ]
            return { adjectives, nouns }
        },
        nameDatabaseEn: function () {
            const adjectives = [
                
            ];

            const nouns = [
                
            ];

            return { adjectives, nouns }
        },
        /**
         * 获取元素的属性值
         * @param {*} propertys 
         * @returns 
         */
        getPropertyValues: function (propertys) {
            result = {}
            propertys.forEach(item => {
                result[item.key] = window.getComputedStyle(document.documentElement).getPropertyValue('--' + item.value);
            })

            return result;
        },
        /**
         * 设置元素的属性值
         * @param {*} fileExt 
         * @returns 
         */
        getFileIcon: function (fileExt) {
            let icon = ''
            if ([
                'jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'ico',
            ].includes(fileExt)) {
                icon = '#tl-rtc-app-icon-tupian'
            } else if ([
                'mp3', 'wav', 'wma', 'ogg', 'ape', 'flac', 'aac', 'amr',
            ].includes(fileExt)) {
                icon = '#tl-rtc-app-icon-music'
            } else if ([
                'mp4', 'avi', 'mov', 'wmv', 'rmvb', 'flv', '3gp', 'mkv',
            ].includes(fileExt)) {
                icon = "#tl-rtc-app-icon-shipin1"
            } else if ([
                'doc', 'docx'
            ].includes(fileExt)) {
                icon = '#tl-rtc-app-icon-Word'
            } else if ([
                'xls', 'xlsx',
            ].includes(fileExt)) {
                icon = '#tl-rtc-app-icon-Excel'
            } else if ([
                'ppt', 'pptx'
            ].includes(fileExt)) {
                icon = '#tl-rtc-app-icon-PPT'
            } else if ([
                'pdf'
            ].includes(fileExt)) {
                icon = '#tl-rtc-app-icon-Pdf'
            } else if ([
                'txt',
            ].includes(fileExt)) {
                icon = '#tl-rtc-app-icon-txt1'
            } else if ([
                'zip', 'rar', '7z', 'tgz', 'gz', 'bz2', 'xz', 'lz',
                'lzma', 'jar', 'war', 'ear', 'tar'
            ].includes(fileExt)) {
                icon = '#tl-rtc-app-icon-yasuobao'
            } else if ([
                'sql', 'db', 'dbf', 'mdb', 'accdb', 'sqlit', 'db3', 'db2', 'db1',
            ].includes(fileExt)) {
                icon = '#tl-rtc-app-icon-shujuku'
            } else if ([
                'exe',
            ].includes(fileExt)) {
                icon = '#tl-rtc-app-icon-exe'
            } else if ([
                'dll'
            ].includes(fileExt)) {
                icon = '#tl-rtc-app-icon-dll'
            } else if ([
                'py',
            ].includes(fileExt)) {
                icon = '#tl-rtc-app-icon-python'
            } else if ([
                'conf', 'ini', 'properties', 'cfg', 'config', 'env', 'envrc',
            ].includes(fileExt)) {
                icon = '#tl-rtc-app-icon-CONF'
            } else if ([
                'js'
            ].includes(fileExt)) {
                icon = '#tl-rtc-app-icon-javascript'
            } else if ([
                'csv'
            ].includes(fileExt)) {
                icon = '#tl-rtc-app-icon-csv'
            } else if ([
                'xml'
            ].includes(fileExt)) {
                icon = '#tl-rtc-app-icon-xmlwenjian'
            } else if ([
                'sh'
            ].includes(fileExt)) {
                icon = '#tl-rtc-app-icon-shell'
            } else if ([
                'php'
            ].includes(fileExt)) {
                icon = '#tl-rtc-app-icon-PHP'
            } else if ([
                'cpp', 'c'
            ].includes(fileExt)) {
                icon = '#tl-rtc-app-icon-cpp'
            } else if ([
                'iso'
            ].includes(fileExt)) {
                icon = '#tl-rtc-app-icon-iso'
            } else if ([
                'html', 'htm', 'html5'
            ].includes(fileExt)) {
                icon = '#tl-rtc-app-icon-HTML'
            } else if ([
                'css', 'scss', 'less', 'styl'
            ].includes(fileExt)) {
                icon = '#tl-rtc-app-icon-css-copy'
            } else if ([
                'c#'
            ].includes(fileExt)) {
                icon = '#tl-rtc-app-icon-Cyuyan'
            } else if ([
                'json'
            ].includes(fileExt)) {
                icon = '#tl-rtc-app-icon-json'
            } else if ([
                'java'
            ].includes(fileExt)) {
                icon = '#tl-rtc-app-icon-java'
            } else if ([
                'apk'
            ].includes(fileExt)) {
                icon = '#tl-rtc-app-icon-APK'
            } else if ([
                'dir'
            ].includes(fileExt)) {
                icon = '#tl-rtc-app-icon-a-wenjianjiawenjian'
            } else {
                icon = '#tl-rtc-app-icon-weizhiwenjian'
            }

            return icon
        },
        /**
         * 获取文件大小
         * @param {*} fileSize 
         * @returns 
         */
        getFileSize: function (fileSize) {
            let size = 0
            let unit = 'B'
            if (fileSize > 1024 * 1024 * 1024) {
                size = (fileSize / 1024 / 1024 / 1024).toFixed(2)
                unit = 'GB'
            } else if (fileSize > 1024 * 1024) {
                size = (fileSize / 1024 / 1024).toFixed(2)
                unit = 'MB'
            } else if (fileSize > 1024) {
                size = (fileSize / 1024).toFixed(2)
                unit = 'KB'
            } else {
                size = fileSize
            }
            return size + unit
        },
        /**
         * 创建一个防抖函数
         * @param {Function} func - 需要防抖处理的函数
         * @param {number} wait - 等待的毫秒数
         * @param {boolean} immediate - 是否立即执行
         * @returns {Function} - 防抖处理后的函数
         */
        debounce: function (func, wait, immediate) {
            let timeout;

            return function () {
                const context = this;
                const args = arguments;

                const later = function () {
                    timeout = null;
                    if (!immediate) func.apply(context, args);
                };

                const callNow = immediate && !timeout;

                clearTimeout(timeout);
                timeout = setTimeout(later, wait);

                if (callNow) func.apply(context, args);
            };
        },
        /**
         * 创建一个节流函数
         * @param {Function} func - 需要节流处理的函数
         * @param {number} limit - 限制的时间，单位为毫秒
         * @returns {Function} - 节流处理后的函数
         */
        throttle: function (func, limit) {
            let lastFunc;
            let lastRan;
            return function () {
                const context = this;
                const args = arguments;
                if (!lastRan) {
                    func.apply(context, args);
                    lastRan = Date.now();
                } else {
                    clearTimeout(lastFunc);
                    lastFunc = setTimeout(function () {
                        if ((Date.now() - lastRan) >= limit) {
                            func.apply(context, args);
                            lastRan = Date.now();
                        }
                    }, limit - (Date.now() - lastRan));
                }
            };
        },
        /**
         * 使用CSS动画实现曲线移动
         * @param {string} sourceId 源元素ID
         * @param {string} targetId 目标元素ID
         */
        animateCurveMove: function({
            sourceId, targetId
        }) {
            // 获取元素
            const source = document.getElementById(sourceId);
            const target = document.getElementById(targetId);

            if (!source || !target) {
                console.error('源或目标元素不存在');
                return;
            }

            // 获取起始元素和目标元素的位置信息
            const sourceRect = source.getBoundingClientRect();
            const targetRect = target.getBoundingClientRect();

            console.log(sourceRect, targetRect);

            // 创建动画元素
            const animationElem = document.createElement('div');
            animationElem.classList.add('tl-rtc-app-p2p-channel-animation');
            animationElem.style.left = sourceRect.left + 'px';
            animationElem.style.top = sourceRect.top + 'px';
            document.body.appendChild(animationElem);

            // 计算X和Y方向的位移
            const deltaX = targetRect.left - sourceRect.left;
            const deltaY = targetRect.top - sourceRect.top;

            // 使用CSS变量来传递位移
            animationElem.style.setProperty('--deltaX', `${deltaX}px`);
            animationElem.style.setProperty('--deltaY', `${deltaY}px`);

            // 应用动画
            animationElem.style.animation = 'curveMove 0.6s ease forwards';

            // 动画结束后移除动画元素
            animationElem.addEventListener('animationend', () => {
                animationElem.remove();
            });
        },
        /**
         * 下载文件并重命名
         * @param {*} url
         * @param {*} fileName 
         */
        downloadUrlFileAndRename: async function (url, fileName) {
            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('GET', url, true);
                xhr.responseType = 'blob';
    
                xhr.onload = function () {
                    if (xhr.status === 200) {
                        const blob = xhr.response;
                        const link = document.createElement('a');
                        const objectUrl = window.URL.createObjectURL(blob);
    
                        link.href = objectUrl;
                        link.download = fileName;
                        document.body.appendChild(link);
                        link.click();
    
                        window.URL.revokeObjectURL(objectUrl);
                        document.body.removeChild(link);

                        resolve('下载成功');
                    } else {
                        reject(xhr.statusText);
                        console.error('Download failed:', xhr.statusText);
                    }
                };
    
                xhr.onerror = function (e) {
                    reject(e);
                };
    
                xhr.send();
            })
        },
        /**
         * 检测是否是合法的手机号/电话号码
         * @param {*} mobile
         * @returns
         */
        checkIsMobile: function(mobile){
            return /^1[3456789]\d{9}$/.test(mobile)
        },
        /**
         * 检测是否是合法的邮箱
         * @param {*} email
         * @returns
         */
        checkIsEmail: function(email){
            return /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(email)
        },
        /**
        * 获取时间范围
        * @returns
        */
        getTimeRanges: function () {
            const now = new Date();

            const formatTime = (date, isStart = true) => {
                const y = date.getFullYear();
                const m = String(date.getMonth() + 1).padStart(2, '0');
                const d = String(date.getDate()).padStart(2, '0');
                return isStart ? `${y}-${m}-${d} 00:00:00` : `${y}-${m}-${d} 23:59:59`;
            };

            // Today
            const todayStart = formatTime(now, true);
            const todayEnd = formatTime(now, false);

            // Yesterday
            const yesterday = new Date(now);
            yesterday.setDate(now.getDate() - 1);
            const yesterdayStart = formatTime(yesterday, true);
            const yesterdayEnd = formatTime(yesterday, false);

            // Last 7 days
            const lastWeek = new Date(now);
            lastWeek.setDate(now.getDate() - 7);
            const lastWeekStart = formatTime(lastWeek, true);
            const lastWeekEnd = formatTime(now, false);

            // Last 30 days
            const lastMonth = new Date(now);
            lastMonth.setDate(now.getDate() - 30);
            const lastMonthStart = formatTime(lastMonth, true);
            const lastMonthEnd = formatTime(now, false);

            return {
                today: { startTime: todayStart, endTime: todayEnd },
                yesterday: { startTime: yesterdayStart, endTime: yesterdayEnd },
                lastWeek: { startTime: lastWeekStart, endTime: lastWeekEnd },
                lastMonth: { startTime: lastMonthStart, endTime: lastMonthEnd }
            };
        },
        /**
         * 检查请求参数内容是否包含攻击或非法字符
         * @param {*} params
         * @returns
         */
        checkRequestParams: function(params){
            const reg = /<|>|&|;|'|"/g;
            for (const key in params) {
                if(reg.test(key)){
                    return false;
                }
                const value = params[key];
                if(value && value instanceof Object){
                    return this.checkRequestParams(value);
                }
                if (reg.test(params[key])) {
                    return false;
                }
            }
            return true;
        },
    }
    window.tl_rtc_app_comm = tl_rtc_app_comm;
})()

