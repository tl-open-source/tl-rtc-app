const tl_rtc_app_module_blank_content = {
    props : {
        socketId : {
            type : String,
            default : ''
        },
        isMobile:{
            type: Boolean,
            default: false
        },
        company: {
            type: Object,
            default: function(){
                return {
                    name: ''
                }
            }
        },
        user: {
            type: Object,
            default: function(){
                return {
                    username: '',
                    userAvatar: ''
                }
            }
        }
    },
    computed: {
        propsSocketId(){
            return this.socketId;
        },
        propsIsMobile(){
            return this.isMobile;
        },
        propsCompany(){
            return this.company;
        },
        propsUser(){
            return this.user;
        }
    },
    data : function(){
        return {
            
        }
    },
    template: `
        <div class="tl-rtc-app-right-blank-content-body">
            <div class="tl-rtc-app-right-blank-content-body-tips">
                {{company.name}}
            </div>
        </div>
    `,
}

window.tl_rtc_app_module_blank_content = tl_rtc_app_module_blank_content