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
        randomIdLen: function (len){
            let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
            let maxPos = chars.length;
            let id = '';
            for (let i = 0; i < len; i++) {
                id += chars.charAt(Math.floor(Math.random() * maxPos));
            }
            return id;
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
            if (!dom) {
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

            if (closeDomIds && closeDomIds.length > 0) {
                closeDomIds.forEach((closeId) => {
                    const closeDom = document.querySelector("#" + closeId)
                    if (closeDom) {
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
        isWssHost: function (wss) {
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
        invertColor: function (hex) {
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
            id, text, time = 1000, color = '#50393d', position = 'top'
        }) {
            if (position === 'top') {
                position = 1;
            } else if (position === 'right') {
                position = 2;
            } else if (position === 'bottom') {
                position = 3;
            } else if (position === 'left') {
                position = 4;
            } else {
                position = 1;
            }
            layer.tips(text, '#' + id, {
                skin: 'tl-rtc-app-layer-tips',
                tips: [position, color],
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
        animateCurveMove: function ({
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
        checkIsMobile: function (mobile) {
            return /^1[3456789]\d{9}$/.test(mobile)
        },
        /**
         * 检测是否是合法的邮箱
         * @param {*} email
         * @returns
         */
        checkIsEmail: function (email) {
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
        checkRequestParams: function (params) {
            const reg = /<|>|&|;|'|"/g;
            for (const key in params) {
                if (reg.test(key)) {
                    return false;
                }
                const value = params[key];
                if (value && value instanceof Object) {
                    return this.checkRequestParams(value);
                }
                if (reg.test(params[key])) {
                    return false;
                }
            }
            return true;
        },
        sanitizeHTML: function (html) {
            // 定义允许的标签及其对应的允许属性，以及属性对应的值的白名单
            const allowedTags = {
                div: [],
                p: [],
                span: ['class'],
                b: [],
                i: [],
                u: [],
                br: [],
                img: ['src', 'alt', 'title', 'class'],
            };

            const allowedTagsValue = {
                span: {
                    class: ['textarea-at-user-text'],
                },
            };

            return html
                // 第一阶段：标签级过滤
                .replace(/<\/?([a-z][a-z0-9]*)(?:[^>]*?)?\/?>/gi, (match, tag) => {
                    tag = tag.toLowerCase();
                    if (allowedTags[tag]) {
                        return match;  // 如果标签是允许的，就保留它
                    }
                    return ''; // 否则删除这个标签
                })
                // 第二阶段：属性过滤
                .replace(/<[^>]+>/g, tag => {
                    return tag
                        // 匹配标签内的所有属性
                        .replace(/(\s+)([a-z][a-z0-9-]*)(\s*=\s*['"][^'"]*['"])?/gi, (match, space, attribute, value) => {
                            const tagName = tag.match(/<\/?([a-z]+)/)[1].toLowerCase();
                            const allowedAttributes = allowedTags[tagName];
                            if (allowedAttributes && allowedAttributes.includes(attribute.toLowerCase())) {
                                // 如果属性是允许的，检查属性值是否在白名单中
                                const allowedValues = allowedTagsValue[tagName] && allowedTagsValue[tagName][attribute];
                                let val = ''
                                if(typeof value === 'string') {
                                    val = value.split('=')[1]
                                    val = val.replace(/['"]/g, '')
                                }
                                if (allowedValues && allowedValues.length) {
                                    for (let i = 0; i < allowedValues.length; i++) {
                                        if (val == allowedValues[i]) {
                                            return match; // 如果属性值在白名单中，保留属性
                                        }
                                    }
                                } else if (!allowedValues) {
                                    return match; // 如果没有设置白名单，保留属性
                                }
                            }

                            return ''; // 否则删除这个属性
                        })
                        // 删除脚本类的标签
                        .replace(/<\/?(script|iframe|object|embed|link|meta).*?>/gi, '');
                })
                // 第三阶段：内容净化
                .replace(/(href|src)=("|')/gi, (match, p1, p2) => {
                    // 仅处理链接和图片等元素的 href 和 src 属性
                    if (p1 === 'href' || p1 === 'src') {
                        // 仅处理恶意的 javascript: 协议
                        return match.replace(/javascript:\s*[^'"]*/gi, '');  // 清除 javascript: 协议
                    }
                    return match;  // 对其他属性不做修改
                })
                .replace(/javascript:\s*[^'"]*/gi, '')  // 移除 javascript: 开头的 URL
                .replace(/&#(\d+);?/g, (m, code) => {
                    const char = String.fromCharCode(code);
                    return char === '>' ? '' : m; // 防止编码绕过
                });
        },
        /**
         * 解密函数
         * @param {*} data 
         * @param {*} value 
         * @returns 
         */
        decryptResData: function ({
            data, value
        }, str) {
            // 使用 str 生成密钥
            const key = CryptoJS.SHA256(str).toString(CryptoJS.enc.Base64);

            // 转换 value 为字节数组
            const ivArray = CryptoJS.enc.Base64.parse(value);

            // 转换 Base64 编码的 key 为 WordArray
            const keyArray = CryptoJS.enc.Base64.parse(key);

            // 解密
            const decrypted = CryptoJS.AES.decrypt(data, keyArray, {
                iv: ivArray,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });

            // 转换为 UTF-8 字符串并解析为 JSON
            const decryptedData = decrypted.toString(CryptoJS.enc.Utf8);

            return JSON.parse(decryptedData);
        },
        /**
         * 替换 HTML 内容中的 <use> 标签为实际的 SVG 内容
         * @param {*} htmlContent 
         * @returns 
         */
        replaceUseWithSymbolInHTML: function () {
            // 获取所有的 <use> 元素
            const useElements = document.querySelectorAll('use');

            useElements.forEach(useElement => {
                // 获取 <use> 元素的 xlink:href 或 href 属性
                const hrefValue = useElement.getAttribute('xlink:href') || useElement.getAttribute('href');

                if (hrefValue) {
                    // 提取符号的 ID，去掉前面的 # 符号
                    const symbolId = hrefValue.startsWith('#') ? hrefValue.substring(1) : hrefValue;

                    // 查找对应的 <symbol> 元素
                    const symbolElement = document.querySelector(`#${symbolId}`);

                    if (symbolElement) {
                        // 克隆 <symbol> 元素的内容
                        const symbolContent = symbolElement.innerHTML;
                        // 找到use元素的父元素
                        const parentElement = useElement.parentElement;
                        parentElement.setAttribute('viewBox', '0 0 1024 1024');
                        parentElement.setAttribute('p-id', symbolId);
                        parentElement.innerHTML = symbolContent;
                    }
                }
            });
        },
        /**
         * 截图
         */
        captureScreenshot: async function () {
            // 直接操作 DOM 中的 <use> 标签，替换为实际的 SVG
            this.replaceUseWithSymbolInHTML();

            return await new Promise((resolve) => {
                // 使用 html2canvas 对临时容器进行截图
                html2canvas(document.body, {
                    allowTaint: true,      // 允许跨域图片
                    useCORS: true,         // 使用 CORS 跨域策略
                    logging: true,         // 开启日志（可选）
                    scale: 2,              // 缩放
                    ignoreElements: (element) => {
                        // style如果有display:none则不截图
                        if (element.style.display === 'none') {
                            return true;
                        }
                    }
                }).then(canvas => {
                    // 获取截图的图片 Data URL
                    const imgData = canvas.toDataURL('image/png');

                    // 创建一个 <a> 元素来触发下载
                    const link = document.createElement('a');
                    link.href = imgData; // 设置下载链接为截图的 Data URL
                    link.download = 'screenshot.png'; // 设置下载的文件名

                    // 触发点击事件来下载图片
                    link.click();

                    resolve(true);
                }).catch(err => {
                    console.error('Error during screenshot capture:', err);
                    resolve(false);
                });
            })
        },
        getQuickMessageList: function () {
            const quickMessageList = [
                "你好",
                "你好呀",
                "你们好呀",
                "大家好",
                "欢迎",
                "在干嘛",
                "最近怎么样？",
                "吃饭了吗？",
                "忙什么呢",
                "有空吗？",
                "好久不见",
                "早上好",
                "下午好",
                "晚上好",
                "今天心情怎么样？",
                "今天有啥计划？",
                "工作顺利吗？",
                "今天过得怎么样？",
                "天气不错吧",
                "天气怎么样？",
                "最近有啥新鲜事？",
                "长时间没联系了",
                "最近好吗？",
                "一切还好吗？",
                "你今天忙什么呢",
                "一切都还顺利吧",
                "你做的怎么样了？",
                "有新进展吗？",
                "请多指教",
                "真高兴见到你",
                "怎么了，发生什么事了？",
                "最近有点忙",
                "今天辛苦了吗",
                "下午有空吗？",
                "一会儿聊吗",
                "你这几天怎么样",
                "好久没见面了",
                "最近有没有什么好玩的",
                "周末有什么安排吗？",
                "祝你今天过得愉快",
                "今天心情不错呢",
                "有机会一起聚聚",
                "我来帮忙",
                "需要我帮忙吗",
                "要一起吃个饭吗？",
                "工作怎么样？",
                "周末愉快",
                "假期过得怎么样？",
                "今天做了什么有趣的事？",
                "最近在忙什么项目？",
                "有什么新动态吗？",
                "今天有没有计划去哪里玩？",
                "你现在有时间吗？",
                "忙完了吗？",
                "最近有啥好看的电影推荐？",
                "想一起出去走走吗？",
                "一切都还好吧",
                "最近在忙什么工作呢？",
                "工作累吗？",
                "听说你最近在做大项目，怎么样了？",
                "大家好久不见了",
                "今天看起来心情不错呢",
                "今天过得挺充实的",
                "看你最近挺忙的啊",
                "加油，你一定能行的",
                "一起喝个咖啡吗？",
                "好久没聊天了",
                "最近工作有没有压力？",
                "这周末有什么安排吗？",
                "来一起聊聊吗？",
                "最近吃得怎么样？",
                "休息一下，别太累",
                "周末要不要一起去爬山？",
                "要不要一起去看电影？",
                "什么时候有空，一起聚聚？",
                "可以借你点时间吗？",
                "今天过得还好吗？",
                "有没有什么新的想法或计划？",
                "我在等你消息呢",
                "你今天有什么开心的事情吗？",
                "最近健身怎么样？",
                "你最近有新的兴趣爱好吗？",
                "你周末都做什么了？",
                "最近是不是特别忙？",
                "听说你最近工作很忙，辛苦了",
                "你最近都做了些什么？",
                "今天有空一起出去走走吗？",
                "今天的工作结束了吗？",
                "工作有点累吧",
                "工作怎么样，忙不忙？",
                "最近有什么新进展吗？",
                "今天好像有点冷呀",
                "今天是什么好日子吗？",
                "最近有哪些有趣的事发生？",
                "最近看了什么好书？",
                "最近常去哪里放松？",
                "想和你聊聊生活琐事",
                "你最近一直在忙什么呢？",
                "天气变冷了，记得保暖",
                "你打算什么时候休假？",
                "你有时间一起吃个饭吗？",
                "周末打算去哪儿玩呢？",
                "你最近有什么困惑吗？",
                "什么时候一起出去走走？",
                "周末去看展览怎么样？",
                "去哪里旅游最放松呢？",
                "听说最近有个很棒的展览",
                "晚上去看个电影如何？",
                "你今天做了什么好玩的事情？",
                "要不要一起去参加聚会？",
                "下午去喝杯咖啡吗？",
                "你最近都忙些什么项目呢？",
                "希望你今天有个愉快的心情",
                "你做的项目进展怎么样了？",
                "最近比较忙，能否稍后联系？",
                "有什么有趣的活动可以推荐吗？",
                "最近压力大吗？",
                "聊聊最近的趣事吧",
                "今天有点小事需要帮忙",
                "工作上遇到什么问题了？",
                "最近有啥好玩的计划吗？",
                "最近工作还顺利吗？",
                "今天挺忙的，不过还好",
                "最近有些新点子吗？",
                "这段时间一直很忙",
                "最近换了新工作吗？",
                "这几天有点累，需要休息一下",
                "来一起聊聊生活吧",
                "最近怎么样，有什么烦恼吗？",
                "工作上的事情是不是有点多？",
                "你最近有什么想法或者计划吗？",
                "最近有没有什么值得分享的事？",
                "今天过得特别充实",
                "你最近有没有去做什么有趣的事情？",
                "周末去徒步怎么样？",
                "最近的电影值得一看吗？",
                "今天心情很好，想和你分享",
                "你最近有时间一起喝杯茶吗？",
                "我也在想周末的活动",
                "今晚一起去逛街怎么样？",
                "今天想和你聊聊工作上的事",
                "想知道最近的行业动态",
                "你最近有做些什么项目？",
                "最近有什么行业新闻值得关注的？",
                "最近这个领域有什么新趋势吗？",
                "今天的工作有什么突破吗？",
                "最近行业里发生了什么重要的变化？",
                "你最近有啥好项目可以分享吗？",
                "这个项目进展如何？",
                "最近在忙什么行业趋势？",
                "工作上有什么新进展吗？",
                "最近有个很棒的项目，想和你分享",
                "你们公司最近在做什么创新的事情？",
                "最近的团队合作顺利吗？",
                "有没有什么好的合作机会？",
                "最近有啥挑战和机会呢？",
                "工作忙碌中，也很充实",
                "你今天心情怎么样？",
                "最近忙什么呢？",
                "这段时间好像挺充实的",
                "有空一起喝个咖啡吗？",
                "最近有什么有趣的活动吗？",
                "工作上有没有什么新进展？",
                "有时间聊聊吗？",
                "最近有没有遇到什么困难？",
                "你最近在忙什么项目？",
                "工作有没有什么挑战？",
                "今天过得如何？",
                "周末安排好了吗？",
                "最近有没有遇到什么麻烦？",
                "你现在在做的项目怎么样？",
                "最近有看什么好书吗？",
                "今天是不是特别忙？",
                "最近工作是不是很紧张？",
                "最近工作顺利吗？",
                "今天完成了哪些任务？",
                "今天的天气真不错",
                "最近都在忙什么？",
                "今天要做什么特别的事情吗？",
                "有时间一起聚一下吗？",
                "晚上去哪里吃饭？",
                "这几天过得怎么样？",
                "工作上遇到什么难题了吗？",
                "今天的工作进展怎么样？",
                "最近有啥新鲜事吗？",
                "今天的心情好像不错",
                "今天忙完了没？",
                "最近有点忙，聊会儿吗？",
                "最近有啥新动态？",
                "一起去喝杯咖啡吧",
                "今天有点累了",
                "今天过得真快",
                "你最近如何？",
                "最近吃得还好吗？",
                "最近过得怎么样？",
                "你最近有遇到什么有趣的事情吗？",
                "今天是个特别的日子吗？",
                "工作上有没有遇到新的挑战？",
                "最近有什么让你开心的事吗？",
                "工作要加油啊",
                "最近有没有什么值得分享的经验？",
                "最近有没有什么新的想法？",
                "今天过得不错吧？",
                "最近你做的事情怎么样？",
                "有没有什么开心的事要分享？",
                "最近如何度过忙碌的日子？",
                "你最近都在做什么呢？",
                "最近身体还好吗？",
                "工作有点辛苦吧",
                "今天感觉时间过得飞快",
                "今天的任务完成了吗？",
                "最近有新的目标或计划吗？",
                "你最近有什么新打算吗？",
                "最近有任何有趣的事发生吗？",
                "今天的工作比较顺利",
                "你最近有看什么有趣的电影吗？",
                "最近有兴趣一起看个电影吗？",
                "今天是不是有点热？",
                "最近有什么新鲜事可以分享吗？",
                "今天过得怎么样，有什么新消息？",
                "最近有没有学到什么新东西？",
                "今天有没有什么特别的事情发生？",
                "你最近都在忙些什么？",
                "这个周末有没有想做的事情？",
                "今天心情不错，聊聊吧",
                "有时间一起去散步吗？",
                "最近你做的项目怎么样？",
                "这个周末要不要一起出去玩？",
                "最近有没有看到什么好玩的节目？",
                "你最近有去哪里旅行吗？",
                "有没有新的趣事可以分享？",
                "今天过得挺轻松的",
                "你今天心情好吗？",
                "这周的工作进展如何？",
                "最近你都在做些什么工作？",
                "你最近打算去哪儿度假？",
                "今天有点冷，记得穿暖和点",
                "你最近有没有什么新计划？",
                "有空一起喝点什么吗？",
                "最近有什么好消息要分享？",
                "今天过得蛮快的",
                "最近有什么事情需要帮忙吗？",
                "你最近忙吗？",
                "最近有没有什么新鲜事发生？",
                "今天有什么特别的安排吗？",
                "今天工作忙吗？",
                "你最近有没有什么好玩的活动？",
                "最近有什么新的挑战要面对吗？",
                "今天的心情真好",
                "你最近忙什么工作呢？",
                "今天很充实，有些小成就",
                "最近有没有学到什么有趣的东西？",
                "你最近有些什么有趣的想法吗？",
                "今天有点挑战，还是挺好",
                "最近工作上有没有新的进展？",
                "你最近有啥特别的计划吗？",
                "最近有时间聚一聚吗？",
                "最近都在忙哪些项目？",
                "今天的工作有没有完成？",
                "最近有新的工作目标吗？",
                "你最近都在处理什么事情？",
                "今天有点忙碌，不过还行",
                "最近有机会休息一下吗？",
                "今天很充实，感觉挺好",
                "你最近有点累吧",
                "今天过得好像特别快",
                "最近遇到什么有意思的事了吗？",
                "今天有点忙，但也很充实",
                "最近怎么样，有没有什么新的收获？",
                "最近一直很忙，有没有时间聚聚？",
                "今天过得特别顺利",
                "你最近都在忙什么呢？",
                "工作上有没有什么突破？",
                "今天有点挑战，但也挺好",
                "最近在忙些什么工作呢？",
                "工作上有没有遇到什么难题？",
                "今天真的挺忙的",
                "最近有新的任务吗？",
                "今天进展很快，挺好的",
                "最近做得还不错吧",
                "你最近还好吗？",
                "今天过得很顺利，算是有小小的成就",
                "最近有没有什么好玩的活动？",
                "有时间一起聊聊吗？",
                "今天工作怎么样？",
                "最近都在忙些什么？",
                "今天有点忙，不过完成得还不错",
                "最近有没有新计划吗？",
                "最近有空一起聚聚吗？",
                "今天过得挺充实",
                "你最近怎么样？",
                "今天心情不错",
                "今天一切顺利吗？",
                "最近有啥新动态啊？",
                "你最近忙什么呢？",
                "今天有点特别，真好",
                "最近忙完了吗？",
                "今天有点忙碌，不过也挺充实的",
                "最近工作有点忙吧",
                "今天工作有些挑战，但也挺好",
                "最近有没有学到什么新的东西？"
            ]

            return quickMessageList;
        },
        /**
         * 获取文件类型
         * @param {*} fileName
         * @returns
         */
        supportedTypes: function(){
            return {
                // excel类型
                excel: [
                    'xlsx', 'xls', 'csv',
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'application/vnd.ms-excel'
                ],
                // word类型
                word: [
                    // 'doc',   // Word 97-2003 文档 - 不支持
                    'docx',  // Word 2007+ 文档
                    'docm',  // 启用宏的 Word 文档
                    'dotx',  // Word 模板
                    'dotm',  // 启用宏的 Word 模板
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'application/vnd.ms-word.document.macroEnabled.12',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
                    'application/vnd.ms-word.template.macroEnabled.12'
                ],
                // pdf类型
                pdf: [
                    'pdf', 'pdx', 'pdn', 'fdf', 'pdp'
                ],
                // 代码类型
                code: [
                    'log', 'txt', 'sh', 'conf', 'env', 'envrc', 'ini', 'properties', 'cfg', 'config',
                    'json', 'xml', 'html', 'htm', 'css', 'scss', 'less', 'styl', 'js', 'ts', 'jsx', 'tsx',
                    'java', 'php', 'py', 'go', 'cpp', 'c', 'h', 'hpp', 'hxx', 'cc', 'hh', 'c++', 'c#',
                    'sql', 'db', 'dbf', 'mdb', 'accdb', 'sqlit', 'db3', 'db2', 'db1', 'md', 'lua'
                ],
                // ppt类型
                ppt: ['pptx', 'pptm', 'potx', 'potm'],
                // 视频类型
                video: [
                    'mp4', 'webm', 'ogg'
                ],
                // 音频类型
                audio: [
                    'mp3', 'wav', 'ogg'
                ],
                // zip类型
                zip: [
                    'zip'
                ],
                // image
                image: [
                    'jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'webp', 'svg'
                ],
            }
        }
    }
    window.tl_rtc_app_comm = tl_rtc_app_comm;
})()

