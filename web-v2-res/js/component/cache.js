const tl_rtc_app_cache = new Vue({
    el: '#tl-rtc-app-cache',
    data : function(){
        return {
            defaultOpenCache : true,
            detaultCacheTime : 2 * 1000
        }
    },
    methods: {
        /**
         * 是否支持localStorage/IndexedDB/WebSQL
         */
        isSupported: function(){
            const localforage = window.localforage;

            return localforage.supports(localforage.INDEXEDDB) || 
            localforage.supports(localforage.LOCALSTORAGE) || 
            localforage.supports(localforage.WEBSQL);
        },
        /**
         * 设置缓存数据
         * @param {*} key 
         * @param {*} value 
         * @param {*} callback
         */
        setData: async function({
            key, value, callback
        }){
            if(!this.isSupported()){
                callback && callback(false);
                return null;
            }            
            return await new Promise((resolve, reject) => {
                window.localforage.setItem(key, value).then(function(){
                    callback && callback(true);
                }).catch(function(err){
                    callback && callback(false);
                    reject(err);
                });
            })
        },
        /**
         * 获取缓存数据
         * @param {*} key
         * @param {*} callback
         */
        getData: async function({
            key, callback
        }){
            if(!this.isSupported()){
                callback && callback();
                return null;
            }            
            return await new Promise((resolve, reject) => {
                window.localforage.getItem(key).then(function(value){
                    callback && callback(value);
                }).catch(function(err){
                    callback && callback(err);
                    reject(err);
                });
            })
        },
        /**
         * 检查删除过期缓存数据
         */
        expireData: async function(){
            let that = this;

            if(this.defaultOpenCache == false){
                return null;
            }

            if(!this.isSupported()){
                return null;
            }

            let isLogin = await this.emitSubModuleEvent({
                event: 'sub-module-core-is-login'
            })

            if(!isLogin){
                return null;
            }

            // console.log('exec expireData...')

            return await new Promise((resolve, reject) => {
                window.localforage.iterate(function(value, key, iterationNumber) {
                    if(value && !value.expireTime){
                        return
                    }
                    if(Date.now() > value.expireTime){
                        window.localforage.removeItem(key)
                    }
                })
            })
        },
        /**
         * 批量删除缓存数据
         * @param {*} subKey 
         * @param {*} callback
         * @returns 
         */
        delData: async function({
            subKeys, callback
        }){
            if(!this.isSupported()){
                callback && callback(false);
                return null;
            }

            await new Promise((resolve, reject) => {
                window.localforage.iterate(function(value, key, iterationNumber) {
                    for (let i = 0; i < subKeys.length; i++) {
                        if(!key.toString().includes(subKeys[i])){
                            return
                        }
                        window.localforage.removeItem(key)
                    }
                })
            })

            callback && callback(true);

            return true;
        },
    },
    mounted: async function() {
        let that = this
        // 清理缓存
        setInterval(async () => {
            if(window.location.href.includes('.html')){
                return
            }
            await that.expireData()
        }, 1000 * 5);
    },
    created(){
        // 设置缓存
        window.subModule.$on('component-cache-set', this.setData);

        // 获取缓存
        window.subModule.$on('component-cache-get', this.getData);

        // 删除缓存
        window.subModule.$on('component-cache-del', this.delData);
    }
})

window.tl_rtc_app_api = tl_rtc_app_api;