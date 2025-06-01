const tl_rtc_app_api = new Vue({
    el: '#tl-rtc-app-api',
    data : function(){
        return {
            defaultOpenCache : false,
            detaultCacheTime : 2 * 1000
        }
    },
    methods: {
        /**
         * 设置缓存数据
         * @param {*} key 
         * @param {*} value 
         */
        setData: async function({
            key, value
        }){
            await this.emitSubModuleEvent({
                event: 'component-cache-set',
                data: {
                    key,
                    value,
                }
            })
        },
        /**
         * 获取缓存数据
         * @param {*} key
         */
        getData: async function({
            key
        }){
            return await this.emitSubModuleEvent({
                event: 'component-cache-get',
                data: {
                    key,
                }
            })
        },
        /**
         * 批量删除缓存数据
         * @param {*} subKey 
         * @returns 
         */
        delData: async function({
            subKeys
        }){
            return await this.emitSubModuleEvent({
                event: 'component-cache-del',
                data: {
                    subKeys,
                }
            })
        },
        /**
        * 发送请求
        * @param {String} url 请求地址
        * @param {String} method 请求方法
        * @param {Object} params get请求参数
        * @param {Boolean} useCache 是否使用缓存
        * @param {int} cacheTime 缓存时间
        * @param {Function} callback 回调函数
        * @param {Object} data post/put请求数据
        * @param {Object} headers 请求头
        * @param {Array} delCaches 需要删除的缓存
        * @param {String} responseType 响应类型
        * @returns
        */
        tlRequest: async function({
            url, 
            method, 
            params = {}, 
            data = {}, 
            headers = {},
            useCache = false, 
            cacheTime = this.detaultCacheTime,
            callback, 
            delCaches = [],
            responseType
        }){            
            const token = window.localStorage.getItem('token');

            let cacheKey = token + ":" + window.location.origin + ":" + url;
            if(params){
                cacheKey = cacheKey + ":" + JSON.stringify(params);
            }

            if(data){
                cacheKey = cacheKey + ":" + JSON.stringify(data);
            }

            if(delCaches.length > 0){
                await this.delData({
                    subKeys : delCaches
                });
            }

            if(useCache && this.defaultOpenCache){
                const cacheData = await this.getData({
                    key : cacheKey
                });

                if(cacheData && Date.now() < cacheData.expireTime){
                    const resHeaders = cacheData.headers;
                    const resultData = cacheData.data;
                    const tlStr = resHeaders['tl-str'];
                    // 解密数据
                    if(resultData.success && resHeaders['tl-encypt'] === 'true' && tlStr){
                        resultData.data = window.tl_rtc_app_comm.decryptResData(resultData.data, tlStr);
                    }
                    
                    console.info(url + ':cached')
                    callback && callback(cacheData)
                    return cacheData
                }

            }

            let options = {
                url,
                method,
                params,
                data,
                headers
            }

            if(responseType){
                options.responseType = responseType;
            }

            let response = await axios(options)

            if(useCache && this.defaultOpenCache){
                await this.setData({
                    key : cacheKey,
                    value : {
                        data: response.data,
                        headers: response.headers,
                        expireTime: Date.now() + cacheTime,
                        timestamp : Date.now()
                    }
                });
            }
            const resHeaders = response.headers;
            const resultData = response.data;
            const tlStr = resHeaders['tl-str'];

            // 解密数据
            if(resultData.success && resHeaders['tl-encypt'] === 'true' && tlStr){
                resultData.data = window.tl_rtc_app_comm.decryptResData(resultData.data, tlStr);
            }

            callback && callback(response)

            return resultData
        }
    },
    mounted: async function() {
        // 是否启用请求缓存
        let useApiCache = window.localStorage.getItem("tl-rtc-app-api-cache") === 'true';
        this.defaultOpenCache = useApiCache;
    },
    created(){
        // 请求封装
        window.subModule.$on('component-api-request', this.tlRequest)
    }
})

window.tl_rtc_app_api = tl_rtc_app_api;