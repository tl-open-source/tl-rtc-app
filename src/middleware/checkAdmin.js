const crypto = require('crypto');
const { get_env_config } = require("./../../conf/env_config");
const { 
    tlConsoleWarn, encryptStr, verifyEncryptStr,
} = require("./../../src/utils/utils");
//获取环境变量
const conf = get_env_config();
const userService = require('../service/user/tl_user_service')
const companyService = require('../service/company/tl_company_service')

const { fields: userFields } = require('../tables/tl_user')
const { inner: TlRoleInner } = require('../tables/tl_role')
const { fields: companyFields } = require('../tables/tl_company')

const TlUserDef = userFields.Def
const TlCompanyDef = companyFields.Def


/**
 * 检查默认数据是否已经初始化，默认企业、默认管理员
 */
const checkDefaultBeforStartServer = async function(){
    const adminUserEmail = conf.admin_user_email;
    const adminPassword = conf.admin_password;

    if(!adminUserEmail || !adminPassword){
        tlConsoleWarn('please set admin_user_email and admin_password in tlrtcapp.env file');
        process.exit(1);
    }

    // 检查公司是否已经初始化
    const companyInfo = await companyService.getInfoByCode({
        code: 'tl-rtc-app'
    })

    let companyId = 0;

    // 默认创建一个公司
    if(Object.keys(companyInfo).length === 0){
        const result = await companyService.addInfo({
            name: 'TL-RTC-APP默认企业',
            address: '广州市海珠区',
            phone: '1234567890',
            email: adminUserEmail,
            website: 'https://github.com/tl-open-source/tl-rtc-app',
            description: 'TL-RTC-APP默认企业',
            logo: '/image/tlrtcapp-logo.svg',
            code: 'tl-rtc-app'
        })

        if(Object.keys(result).length === 0){
            tlConsoleWarn('auto init default company failed');
            process.exit(1);
        }

        companyId = result[TlCompanyDef.id];

        tlConsoleWarn('auto init default company success...', companyId);
    }else{
        companyId = companyInfo[TlCompanyDef.id];
    }

    tlConsoleWarn("auto check company done...", companyId);

    // 检查管理员是否已经初始化
    const adminUserInfo = await userService.getAdminUser({
        email: adminUserEmail
    })

    if(Object.keys(adminUserInfo).length === 0){
        const salt = crypto.randomBytes(16).toString('hex')
        const saltPassword = encryptStr({
            str: adminPassword,
            salt: salt
        })

        const result = await userService.addInfo({
            companyId,
            email: adminUserEmail,
            password: saltPassword,
            salt,
            name: '管理员',
            roleId: TlRoleInner.user.admin.id,
        })

        if(Object.keys(result).length === 0){
            tlConsoleWarn('auto init admin failed');
            process.exit(1);
        }

        tlConsoleWarn('auto init admin success...', result[TlUserDef.id]);
    }else{
        // 检查是否需要更新管理员密码
        if(!verifyEncryptStr({
            inputStr: adminPassword,
            hashedStr: adminUserInfo[TlUserDef.password],
            salt: adminUserInfo[TlUserDef.salt]
        })){

            const salt = crypto.randomBytes(16).toString('hex')
            const saltPassword = encryptStr({
                str: adminPassword,
                salt: salt
            })

            const result = await userService.updateInfoById({
                companyId: adminUserInfo[TlUserDef.companyId],
                id: adminUserInfo[TlUserDef.id],
            }, {
                [TlUserDef.password]: saltPassword,
                [TlUserDef.salt]: salt
            })

            if(Object.keys(result).length === 0){
                tlConsoleWarn('auto update admin password failed');
                process.exit(1);
            }

            tlConsoleWarn('auto update admin password success...');
        }
    }

    tlConsoleWarn("auto check admin done...", adminUserEmail);

    return true;
}


module.exports = {
    checkDefaultBeforStartServer
}