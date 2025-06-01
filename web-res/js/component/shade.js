const tl_rtc_app_shade = new Vue({
    el: '#tl-rtc-app-shade',
    data : function(){
        return {

        }
    },
    methods: {
        /**
         * 显示遮罩层
         * @param {*} data 
         */
        showShadeContent: function({
            id, style, className, text, shadeListener, callback
        }){
            if(!id){
                callback && callback(false)
                return
            }

            const preDom = document.querySelector('#' + id)

            if(preDom){
                preDom.remove()
            }

            const createDom = document.createElement('div')
            createDom.className = 'tl-rtc-app-right-shade-content-body '
            createDom.id = id

            if(style){
                for(let key in style){
                    createDom.style[key] = style[key]
                }
            }

            if(className){
                createDom.className += className
            }

            if(text){
                createDom.innerText = text
            }
            
            if(shadeListener){
                for (let key in shadeListener) {
                    const func = shadeListener[key]
                    if(typeof func !== 'function'){
                        continue
                    }
                    createDom.addEventListener(key, shadeListener[key])
                }
            }
            
            document.querySelector('#tl-rtc-app').appendChild(createDom)

            callback && callback(true)
        },
        /**
         * 销毁遮罩层
         * @param {*} id
         */
        destroyShadeContent: function({ 
            id, callback
        }){
            const createDom = document.querySelector('#' + id)
            if(createDom){
                createDom.style.opacity = 0
                setTimeout(() => {
                    createDom.remove()
                }, 300);
            }

            callback && callback(true)
        }
    },
    mounted() {
       
    },
    created(){
        // 监听遮罩层显示
        window.subModule.$on('component-shade-show', this.showShadeContent)

        // 监听遮罩层销毁
        window.subModule.$on('component-shade-destroy', this.destroyShadeContent)
    }
})

window.tl_rtc_app_shade = tl_rtc_app_shade