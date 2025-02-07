const tl_rtc_app_bfp = new Vue({
	el: '#tl-rtc-app-bfp',
	data: function () {
		return {
			data: {},
			userFingerprintGenerateCount: 2,
			bfpKey: 'tl_bfp',
		}
	},
	methods: {
	    /**
        * 生成用户确定唯一指纹
        * @param {Function} callback
        * @returns {Promise<string>}
        */
        generateUserFingerprint: async function (callback) {
            let that = this;
            let resultList = [];
            for (let i = 0; i < this.userFingerprintGenerateCount; i++) {
                await that.generateFingerprint(function (fingerprint) {
                    resultList.push(fingerprint);
                });
            }
            // 获取出现次数最多的指纹
            let maxCount = 0;
            let maxCountFingerprint = '';
            let countMap = {};
            resultList.forEach((fingerprint) => {
                if (countMap[fingerprint]) {
                    countMap[fingerprint]++;
                } else {
                    countMap[fingerprint] = 1;
                }
                if (countMap[fingerprint] > maxCount) {
                    maxCount = countMap[fingerprint];
                    maxCountFingerprint = fingerprint;
                }
            });

            return callback && callback({
                // 出现次数最多的指纹
                maxCountFingerprint,
                //所有指纹
                resultList,
                // 所有指纹去重
                fingerprintSetList: Array.from(new Set(resultList))
            });
        },
	    /**
        * 生成指纹
        * @param {Function} callback
        * @returns {Promise<string>}
        */
		generateFingerprint: async function (callback) {
			await this.addCanvasFingerprint();
			this.addWebGLFingerprint();
			await this.addAudioFingerprint();
			this.addFontsFingerprint();
			this.addPluginsFingerprint();
			// await this.addWebRTCFingerprint(); // 添加WebRTC指纹
			this.addBrowserInfo(); // 添加浏览器信息
			this.addDeviceInfo(); // 添加设备信息
			this.addScreenInfo(); // 添加屏幕信息
			const fingerprint = this.hashData(JSON.stringify(this.data));
			this.data = {}
			return callback && callback(fingerprint);
		},
		/**
        * 添加Canvas指纹
        */
		addCanvasFingerprint: async function () {
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d');
			ctx.textBaseline = 'top';
			ctx.font = '16px Arial';
			ctx.textBaseline = 'alphabetic';
			ctx.fillStyle = '#f60';
			ctx.fillRect(125, 1, 62, 20);
			ctx.fillStyle = '#069';
			ctx.fillText('BrowserFingerprint', 2, 15);
			ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
			ctx.fillText('BrowserFingerprint', 4, 17);
			this.data.canvas = canvas.toDataURL();
		},
		/**
        * 添加WebGL指纹
        */
		addWebGLFingerprint: function () {
			try {
				const canvas = document.createElement('canvas');
				const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
				const ext = gl.getExtension('WEBGL_debug_renderer_info');
				const vendor = gl.getParameter(ext.UNMASKED_VENDOR_WEBGL);
				const renderer = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL);
				this.data.webgl = { vendor, renderer };
			} catch (e) {
				this.data.webgl = 'Not Supported';
			}
		},
		/**
        * 添加音频指纹
        */
		addAudioFingerprint: async function () {
			try {
				const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
				const oscillator = audioCtx.createOscillator();
				const analyser = audioCtx.createAnalyser();
				const gain = audioCtx.createGain();
				const scriptProcessor = audioCtx.createScriptProcessor(4096, 1, 1);

				oscillator.type = 'triangle';
				oscillator.frequency.setValueAtTime(10000, audioCtx.currentTime);
				gain.gain.setValueAtTime(0, audioCtx.currentTime);

				oscillator.connect(analyser);
				analyser.connect(scriptProcessor);
				scriptProcessor.connect(gain);
				gain.connect(audioCtx.destination);

				oscillator.start(0);
				scriptProcessor.onaudioprocess = (event) => {
					const output = event.outputBuffer.getChannelData(0);
					const hash = output.reduce((acc, val) => acc + Math.abs(val), 0);
					this.data.audio = hash.toString();
					oscillator.stop();
				};
			} catch (e) {
				this.data.audio = 'Not Supported';
			}
		},
		/**
        * 添加字体指纹
        */
		addFontsFingerprint: function () {
			const fonts = ['Arial', 'Verdana', 'Times New Roman', 'Courier New', 'Georgia'];
			const detectedFonts = [];
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d');
			ctx.font = '72px monospace';
			const baselineSize = ctx.measureText('abcdefghijklmnopqrstuvwxyz0123456789').width;

			fonts.forEach((font) => {
				ctx.font = `72px ${font}, monospace`;
				const width = ctx.measureText('abcdefghijklmnopqrstuvwxyz0123456789').width;
				if (width !== baselineSize) detectedFonts.push(font);
			});

			this.data.fonts = detectedFonts;
		},
		/**
        * 添加插件指纹
        */
		addPluginsFingerprint: function () {
			const plugins = [];
			for (let i = 0; i < navigator.plugins.length; i++) {
				plugins.push(navigator.plugins[i].name);
			}
			this.data.plugins = plugins;
		},
		/**
        * 添加WebRTC指纹
        */
		addWebRTCFingerprint: async function () {
			return new Promise((resolve) => {
				const peerConnection = new RTCPeerConnection({
					iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
				});
				peerConnection.createDataChannel('');
				peerConnection.createOffer().then((offer) => peerConnection.setLocalDescription(offer));

				peerConnection.onicecandidate = (event) => {
					if (event && event.candidate && event.candidate.candidate) {
						const candidate = event.candidate.candidate;
						const ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3})/;
						const ipMatch = candidate.match(ipRegex);
						if (ipMatch) {
							this.data.webrtc = ipMatch[1];
							peerConnection.close();
							resolve();
						}
					}
				};
			});
		},
		/**
        * 添加浏览器信息
        */
		addBrowserInfo: function () {
			const userAgent = navigator.userAgent;
			const platform = navigator.platform;
			const languages = navigator.languages.join(',');
			this.data.browserInfo = { userAgent, platform, languages };
		},
		/**
        * 添加设备信息
        */
		addDeviceInfo: function () {
			const deviceMemory = navigator.deviceMemory || 'Unknown';
			const hardwareConcurrency = navigator.hardwareConcurrency || 'Unknown';
			this.data.deviceInfo = { deviceMemory, hardwareConcurrency };
		},
		/**
        * 添加屏幕信息
        */
		addScreenInfo: function () {
			const screenWidth = window.screen.width;
			const screenHeight = window.screen.height;
			const colorDepth = window.screen.colorDepth;
			this.data.screenInfo = { screenWidth, screenHeight, colorDepth };
		},
		/**
        * 哈希数据
        * @param {string} data
        * @returns {string}
        */
		hashData: function (data) {
			let hash = 0;
			for (let i = 0; i < data.length; i++) {
				const char = data.charCodeAt(i);
				hash = (hash << 5) - hash + char;
				hash |= 0;
			}
			return hash.toString();
		},
		DAS: function (arr) {
		    let dArr = [3,5,10,13,16,17,21]
		    let aArr = [2,4,7,9,15,19,20]
		    let sArr = [1,6,8,11,12,14,18]

		    let dScore = 0
		    let aScore = 0
		    let sScore = 0
		    dArr.forEach(index => {
		          dScore += parseInt(arr[index-1])
		    })
		    aArr.forEach(index => {
		        aScore += parseInt(arr[index-1])
		    })
		    sArr.forEach(index => {
		          sScore += parseInt(arr[index-1])
		    })

		    let dRes = [[0, 9], [10, 13], [14, 20], [21, 27, [28, 100]]]
		    let aRes = [[0, 7], [8, 9], [10, 14], [15, 19], [20, 100]]
		    let sRes = [[0, 14], [15, 18], [19, 25], [26, 33], [34, 100]]

		    dScore *= 2
		    aScore *= 2
		    sScore *= 2

		    let dLevel = 0
		    let aLevel = 0
		    let sLevel = 0

		    for(let i = 0; i < dRes.length; i++){
		        let item = dRes[i]
		        if(dScore <= item[1]){
		            dLevel = i;
		            break
		        }
		    }

		    for(let i = 0; i < aRes.length; i++){
		        let item = aRes[i]
		        if(aScore <= item[1]){
		            aLevel = i;
		            break
		        }
		    }

		    for(let i = 0; i < sRes.length; i++){
		        let item = sRes[i]
		        if(sScore <= item[1]){
		            sLevel = i;
		            break
		        }
		    }

		    let levelRes = {0: '正常', 1: '轻度', 2: '中度', 3: '重度', 4: '特重度'}

		    console.log("抑郁评估分数: ", dScore, ", 抑郁等级: ", levelRes[dLevel])
		    console.log("焦虑评估分数: ", aScore, ", 焦虑等级: ", levelRes[aLevel])
		    console.log("压力评估分数: ", sScore, ", 压力等级: ", levelRes[sLevel])
		},
		init: async function () {
			let that = this;
			// 生成用户bfp
			await this.generateUserFingerprint(
				(
					{maxCountFingerprint, resultList, fingerprintSetList}
				) => {
					window.localStorage.setItem(that.bfpKey, JSON.stringify({
						mc: maxCountFingerprint,
						arl: resultList,
						fps: fingerprintSetList
					}));
				}
			)
		},
		/**
		 * 获取用户bfp
		 * @param {Function} callback
		 */
		getUserFingerprint: function ({
			callback
		}) {
			const bfpData = window.localStorage.getItem(this.bfpKey) || '{}';
			callback && callback(JSON.parse(bfpData));
		}
	},
	mounted: async function() {
	    await this.init()
	},
	created(){
		// 获取用户bfp
		window.subModule.$on('component-bfp-info', this.getUserFingerprint)
	}
})

window.tl_rtc_app_bfp = tl_rtc_app_bfp