const crypto = require('crypto')
const { 
    tlResponseArgsError, tlResponseForbidden, tlResponseSvrError, 
    tlResponseNotFound, tlResponseSuccess,
    checkIsEmail, checkIsId, encryptStr,
    tlConsole
} = require('../../utils/utils')
const userService = require('../../service/user/tl_user_service')
const userFriendService = require('../../service/user/tl_user_friend_service')
const userSessionService = require('../../service/user/tl_user_session_service')
const cloudFileService = require('../../service/cloud/tl_cloud_file_service')
const userConfigService = require('../../service/user/tl_user_config_service')
const companyService = require('../../service/company/tl_company_service')

const { getOssUrl, getAvatarOssUrl } = require('../../utils/oss/oss')

const { fields: userFields } = require('../../tables/tl_user')
const { fields: userFriendFields } = require('../../tables/tl_user_friend')
const { fields: cloudFileFields } = require('../../tables/tl_cloud_file')
const { fields: userConfigFields } = require('../../tables/tl_user_config')
const { inner: TlRoleInner } = require('../../tables/tl_role')
const { fields: companyFields } = require('../../tables/tl_company')

const TlUserDef = userFields.Def
const TlUserFriendDef = userFriendFields.Def
const TlUserFriendType = userFriendFields.FriendType
const TlCloudFileDef = cloudFileFields.Def
const TlUserConfingDef = userConfigFields.Def
const TlUserConfingAccount = userConfigFields.Account
const TlCompanyDef = companyFields.Def



/**
 * 搜索用户
 * @param {*} name
 * @param {*} loginInfo
 */
const searchUserByName = async function({ name, loginInfo }){
    if(!name){
        return tlResponseArgsError("请求参数错误")
    }

    if(name.length > 20){
        return tlResponseArgsError("请求参数过长")
    }

    const { 
        loginUserCompanyId, loginUserId, loginUserCompanyName
    } = loginInfo
    
    const info = await userService.getInfoByName({
        companyId: loginUserCompanyId,
        name
    }, [
        TlUserDef.id,
        TlUserDef.name,
        TlUserDef.avatarUrl,
        TlUserDef.wchatName,
    ])

    if(Object.keys(info).length == 0){
        return tlResponseNotFound("用户不存在")
    }

    const userFriendInfo = await userFriendService.getInfoByUserIdAndFriendId({
        companyId: loginUserCompanyId,
        userId: loginUserId,
        friendId: info[TlUserDef.id]
    }, [
        TlUserFriendDef.channelId,
        TlUserFriendDef.remark,
        TlUserFriendDef.friendType
    ])

    let isFriend = true
    if(Object.keys(userFriendInfo).length == 0){
        isFriend = false
    }

    if(info[TlUserDef.id] == loginUserId){
        isFriend = true
    }

    let friendTypeStr = ''
    if(isFriend){
        let friendType = userFriendInfo[TlUserFriendDef.friendType]
        if(friendType === TlUserFriendType.NORMAL){
            friendTypeStr = '普通好友'
        }
    }

    // 非好友, 检查是否允许被搜索
    if(!isFriend){
        // 获取用户配置
        const userConfigInfo = await userConfigService.getInfoByUserId({
            companyId: loginUserCompanyId,
            userId: info[TlUserDef.id]
        }, [
            TlUserConfingDef.account
        ])
        let accountSettingStr = userConfigInfo[TlUserConfingDef.account]
        let accountSetting = {}
        try{
            accountSetting = JSON.parse(accountSettingStr)
        }catch(e){
            accountSetting = {}
        }
        // 不允许被搜索
        let notAllowSearchAccount = accountSetting[TlUserConfingAccount.notAllowSearchAccount] || false
        if(notAllowSearchAccount){
            return tlResponseForbidden("私密用户")
        }
    }

    const result = {
        userId: info[TlUserDef.id],
        username: info[TlUserDef.name],
        userAvatar: await getAvatarOssUrl(info[TlUserDef.avatarUrl]),
        userCompanyName: loginUserCompanyName,
        wechatName: info[TlUserDef.wchatName],
        channelId: userFriendInfo[TlUserFriendDef.channelId],
        isFriend: isFriend,
        isSelf: info[TlUserDef.id] == loginUserId,
        remark: userFriendInfo[TlUserFriendDef.remark],
        friendType: friendTypeStr
    }

    return tlResponseSuccess("搜索成功", result)
}

/**
 * 搜索用户通过id
 * @param {*} id
 * @param {*} loginInfo
 */
const searchUserById = async function({ id, loginInfo }){
    if(!id){
        return tlResponseArgsError("请求参数错误")
    }

    id = parseInt(id)
    if(!id){
        return tlResponseArgsError("请求参数错误")
    }

    const { 
        loginUserCompanyId, loginUserId, loginUserCompanyName
    } = loginInfo
    
    const info = await userService.getInfoById({
        companyId: loginUserCompanyId,
        id
    }, [
        TlUserDef.id,
        TlUserDef.name,
        TlUserDef.avatarUrl,
        TlUserDef.wchatName
    ])

    if(Object.keys(info).length == 0){
        return tlResponseNotFound("用户不存在")
    }

    const userFriendInfo = await userFriendService.getInfoByUserIdAndFriendId({
        companyId: loginUserCompanyId,
        userId: loginUserId,
        friendId: info[TlUserDef.id]
    }, [
        TlUserFriendDef.channelId,
    ])

    let isFriend = true
    if(Object.keys(userFriendInfo).length == 0){
        isFriend = false
    }

    if(id == loginUserId){
        isFriend = true
    }

    // 非好友, 检查是否允许被搜索
    if(!isFriend){
        // 获取用户配置
        const userConfigInfo = await userConfigService.getInfoByUserId({
            companyId: loginUserCompanyId,
            userId: info[TlUserDef.id]
        }, [
            TlUserConfingDef.account
        ])
        let accountSettingStr = userConfigInfo[TlUserConfingDef.account]
        let accountSetting = {}
        try{
            accountSetting = JSON.parse(accountSettingStr)
        }catch(e){
            accountSetting = {}
        }
        // 不允许被搜索
        let notAllowSearchAccount = accountSetting[TlUserConfingAccount.notAllowSearchAccount] || false
        if(notAllowSearchAccount){
            return tlResponseForbidden("私密用户")
        }
    }

    const result = {
        userId: info[TlUserDef.id],
        username: info[TlUserDef.name],
        userAvatar: await getAvatarOssUrl(info[TlUserDef.avatarUrl]),
        userCompanyName: loginUserCompanyName,
        wechatName: info[TlUserDef.wchatName],
        channelId: userFriendInfo[TlUserFriendDef.channelId],
        isFriend: isFriend
    }

    return tlResponseSuccess("搜索成功", result)
}

/**
 * 更新用户头像
 * @param {*} token
 * @param {*} loginInfo
 * @param {*} cloudFileId 
 * @returns 
 */
const updateUserAvatar = async function({ token, loginInfo, cloudFileId }){
    const { 
        loginUserCompanyId, loginUserId
    } = loginInfo

    if(!cloudFileId){
        return tlResponseArgsError("请求参数错误")
    }

    cloudFileId = parseInt(cloudFileId)
    if(!cloudFileId){
        return tlResponseArgsError("请求参数错误")
    }

    const cloudFileInfo = await cloudFileService.getInfoById({
        companyId: loginUserCompanyId,
        id: cloudFileId
    }, [
        TlCloudFileDef.fileUrl,
        TlCloudFileDef.userId
    ])

    if(Object.keys(cloudFileInfo).length == 0){
        return tlResponseNotFound("更新失败")
    }

    // 如果文件所属人不是自己, 非法操作
    const cloudFileUserId = cloudFileInfo[TlCloudFileDef.userId]
    if(cloudFileUserId != loginUserId){
        return tlResponseForbidden("非法操作")
    }

    const result = await userService.updateInfoById({
        companyId: loginUserCompanyId,
        id: loginUserId,
    }, {
        [TlUserDef.avatarUrl]: cloudFileInfo[TlCloudFileDef.fileUrl]
    })

    if(Object.keys(result).length == 0){
        return tlResponseSvrError("更新头像失败")
    }

    let fileUrl = cloudFileInfo[TlCloudFileDef.fileUrl]
    fileUrl = await getOssUrl(fileUrl)

    // 更新登录态信息
    await userSessionService.setUserInfoByToken({
        token, info: Object.assign(loginInfo, {
            loginUserAvatar: fileUrl
        })
    })

    return tlResponseSuccess("更新头像成功")
}


/**
 * 用户绑定邮箱
 * @param {*} token
 * @param {*} loginInfo
 * @param {*} email
 * @param {*} code
 */
const bindEmail = async function({ token, loginInfo, email, code }) {
    const { 
        loginUserCompanyId, loginUserId, loginUserEmail
    } = loginInfo
    
    if(!email){
        return tlResponseArgsError("邮箱不能为空")
    }

    if(!code){
        return tlResponseArgsError("验证码不能为空")
    }

    // base64解码
    email = Buffer.from(email, 'base64').toString()
    
    if(!checkIsEmail(email)){
        return tlResponseArgsError("邮箱格式不正确")
    }

    if(email.length > 50){
        return tlResponseArgsError("邮箱长度过长")
    }

    if(email == loginUserEmail){
        return tlResponseForbidden("邮箱未更换")
    }

    // 检查code
    const checkCode = await userSessionService.getEmailCode({
        email
    })

    if (checkCode !== code) {
        return tlResponseArgsError("邮箱验证码错误")
    }

    const emailExist = await userService.getInfoByEmail({
        companyId: loginUserCompanyId,
        email
    }, [
        TlUserDef.id
    ])

    if(emailExist[id] == loginUserId){
        return tlResponseForbidden("邮箱未更换")
    }

    if(Object.keys(emailExist).length > 0){
        return tlResponseForbidden("该邮箱已被其他帐号绑定")
    }

    const result = await userService.updateInfoById({
        companyId: loginUserCompanyId,
        id: loginUserId,
    }, {
        [TlUserDef.email]: email
    })

    if(Object.keys(result).length == 0){
        return tlResponseSvrError("绑定邮箱失败")
    }

    // 更新登录态信息
    await userSessionService.setUserInfoByToken({
        token, info: Object.assign(loginInfo, {
            loginUserEmail: email
        })
    })

    return tlResponseSuccess("绑定邮箱成功")
}


/**
 * 更新用户信息 - 管理员
 * @param {*} id
 * @param {*} companyId
 * @param {*} name
 * @param {*} email
 * @param {*} mobile
 * @param {*} avatarUrl
 * @param {*} roleId
 * @param {*} loginInfo
 * @returns 
 */
const adminUpdateUser = async function({ 
    id, companyId, name, email, mobile, avatarUrl,
    loginInfo
}){
    const {
        loginUserCompanyId, loginUserId, loginUserRoleId
    } = loginInfo

    if(loginUserRoleId !== TlRoleInner.user.admin.id){
        return tlResponseForbidden("非法用户")
    }

    if(!id || !name || !companyId){
        return tlResponseArgsError("请求参数错误")
    }

    if(!checkIsId(id)){
        return tlResponseArgsError("用户id非法")
    }

    if(!checkIsId(companyId)){
        return tlResponseArgsError("企业id非法")
    }

    id = parseInt(id)
    companyId = parseInt(companyId)

    if(name.length > 20){
        return tlResponseArgsError("用户名过长")
    }

    if(email.length > 64){
        return tlResponseArgsError("邮箱过长")
    }

    if(mobile.length > 11){
        return tlResponseArgsError("手机号过长")
    }

    const companyInfo = await companyService.getInfoById({
        id: companyId
    })

    if(Object.keys(companyInfo).length == 0){
        return tlResponseNotFound("企业不存在")
    }

    const info = await userService.getInfoById({
        id: id,
        companyId
    }, [
        TlUserDef.id
    ])

    if(Object.keys(info).length == 0){
        return tlResponseNotFound("用户不存在")
    }

    const result = await userService.updateInfoById({
        id: id,
        companyId
    }, {
        [TlUserDef.name]: name,
        [TlUserDef.email]: email,
        [TlUserDef.mobile]: mobile,
        [TlUserDef.avatarUrl]: avatarUrl,
    })

    if(Object.keys(result).length == 0){
        return tlResponseSvrError("更新失败")
    }

    return tlResponseSuccess("更新成功")
}


/**
 * 删除用户 - 管理员
 * @param {*} companyId
 * @param {*} id
 * @param {*} loginInfo
 * @returns 
 */
const adminDeleteUser = async function({ companyId, id, loginInfo }){
    const {
        loginUserCompanyId, loginUserId, loginUserRoleId
    } = loginInfo

    if(loginUserRoleId !== TlRoleInner.user.admin.id){
        return tlResponseForbidden("非法用户")
    }

    if(!id){
        return tlResponseArgsError("请求参数错误")
    }

    if(!companyId){
        return tlResponseArgsError("请求参数错误")
    }

    if(!checkIsId(companyId)){
        return tlResponseArgsError("企业id非法")
    }

    if(!checkIsId(id)){
        return tlResponseArgsError("用户id非法")
    }

    companyId = parseInt(companyId)
    id = parseInt(id)

    const companyInfo = await companyService.getInfoById({
        id: companyId
    })

    if(Object.keys(companyInfo).length == 0){
        return tlResponseNotFound("企业不存在")
    }

    const info = await userService.getInfoById({
        id,
        companyId
    }, [
        TlUserDef.id,
        TlUserDef.roleId
    ])

    if(Object.keys(info).length == 0){
        return tlResponseNotFound("用户不存在")
    }

    const roleId = info[TlUserDef.roleId]
    if(roleId === TlRoleInner.user.admin.id){
        return tlResponseForbidden("管理员帐号不允许删除")
    }

    const result = await userService.deleteInfoById({
        id,
        companyId
    })

    console.log("result : ", result)

    if(result == 0){
        return tlResponseSvrError("删除失败")
    }

    return tlResponseSuccess("删除成功")
}


/**
 * 获取用户列表 - 管理员
 * @param {*} keyword
 * @param {*} companyId
 * @param {*} page
 * @param {*} limit
 * @param {*} loginInfo
 * @returns
 **/
const adminGetUserList = async function({ keyword = '', companyId = undefined, page, limit, loginInfo }){
    const {
        loginUserCompanyId, loginUserId, loginUserRoleId
    } = loginInfo

    if(loginUserRoleId !== TlRoleInner.user.admin.id){
        return tlResponseForbidden("非法用户")
    }

    if(!page || !limit){
        return tlResponseArgsError("请求参数错误")
    }

    if(!checkIsId(page)){
        return tlResponseArgsError("请求参数错误")
    }

    if(!checkIsId(limit)){
        return tlResponseArgsError("请求参数错误")
    }

    page = parseInt(page)
    limit = parseInt(limit)

    if(keyword.length > 20){
        return tlResponseArgsError("用户名过长")
    }

    let list = []
    let total = 0

    if(keyword === '' || keyword === undefined || keyword === null){
        list = await userService.getListForPage({
            companyId
        }, [
            TlUserDef.id,
            TlUserDef.companyId,
            TlUserDef.name,
            TlUserDef.email,
            TlUserDef.mobile,
            TlUserDef.avatarUrl,
            TlUserDef.roleId,
            TlUserDef.createdAt
        ], page, limit)

        total = await userService.getCount({
            
        })
    }else{
        list = await userService.getListByKeywordForPage({
            keyword, companyId
        }, [
            TlUserDef.id,
            TlUserDef.companyId,
            TlUserDef.name,
            TlUserDef.email,
            TlUserDef.mobile,
            TlUserDef.avatarUrl,
            TlUserDef.roleId,
            TlUserDef.createdAt
        ], page, limit)

        total = await userService.getCountByKeyword({
            keyword
        })
    }

    if(list.length == 0){
        return tlResponseSuccess("获取成功", {
            list: [],
            count: 0
        })
    }

    const companyIdList = list.map(item => item[TlUserDef.companyId])

    let companyInfoMap = {}
    if(companyIdList.length > 0){
        const companyList = await companyService.getListByIdList({
            idList: companyIdList
        }, [
            TlCompanyDef.id,
            TlCompanyDef.name
        ])

        companyInfoMap = companyList.reduce((acc, cur) => {
            acc[cur[TlCompanyDef.id]] = cur
            return acc
        }, {})
    }

    let resultList = []

    for(let i = 0; i < list.length; i++){
        let item = list[i]
        let roleId = item[TlUserDef.roleId]
        let roleName = ''
        if(roleId === TlRoleInner.user.admin.id){
            roleName = TlRoleInner.user.admin.name
        }else if(roleId === TlRoleInner.user.normal.id){
            roleName = TlRoleInner.user.normal.name
        }else{
            roleName = "未知"
        }

        let companyId = item[TlUserDef.companyId]
        const companyInfo = companyInfoMap[companyId] || {}
        let companyName = companyInfo[TlCompanyDef.name] || ''

        resultList.push({
            companyId: companyId,
            companyName: companyName,
            id: item[TlUserDef.id],
            name: item[TlUserDef.name],
            email: item[TlUserDef.email],
            mobile: item[TlUserDef.mobile],
            avatarUrl: await getAvatarOssUrl(item[TlUserDef.avatarUrl]),
            roleName,
            roleId,
            createTime: item[TlUserDef.createdAt],
        })
    }

    return tlResponseSuccess("获取成功", {
        list: resultList,
        count: total
    })
}

/**
 * 获取用户信息 - 管理员
 * @param {*} id
 * @param {*} companyId
 * @param {*} loginInfo 
 * @returns 
 */
const adminGetUserInfo = async function({ id, companyId, loginInfo }){
    const {
        loginUserCompanyId, loginUserId, loginUserRoleId
    } = loginInfo

    if(loginUserRoleId !== TlRoleInner.user.admin.id){
        return tlResponseForbidden("非法用户")
    }

    if(!id || !companyId){
        return tlResponseArgsError("请求参数错误")
    }

    if(!checkIsId(id)){
        return tlResponseArgsError("用户id非法")
    }

    if(!checkIsId(companyId)){
        return tlResponseArgsError("企业id非法")
    }

    id = parseInt(id)
    companyId = parseInt(companyId)

    const companyInfo = await companyService.getInfoById({
        id: companyId
    }, [
        TlCompanyDef.id,
        TlCompanyDef.name
    ])

    if(Object.keys(companyInfo).length == 0){
        return tlResponseNotFound("企业不存在")
    }

    const info = await userService.getInfoById({
        id,
        companyId
    }, [
        TlUserDef.id,
        TlUserDef.companyId,
        TlUserDef.name,
        TlUserDef.email,
        TlUserDef.mobile,
        TlUserDef.avatarUrl,
        TlUserDef.roleId,
        TlUserDef.createdAt
    ])

    if(Object.keys(info).length == 0){
        return tlResponseNotFound("用户不存在")
    }

    let roleId = info[TlUserDef.roleId]

    let roleName = ''
    if(roleId === TlRoleInner.user.admin.id){
        roleName = TlRoleInner.user.admin.name
    }else if(roleId === TlRoleInner.user.normal.id){
        roleName = TlRoleInner.user.normal.name
    }else {
        roleName = "未知"
    }

    const result = {
        companyId: info[TlUserDef.companyId],
        companyName: companyInfo[TlCompanyDef.name],
        id: info[TlUserDef.id],
        name: info[TlUserDef.name],
        email: info[TlUserDef.email],
        mobile: info[TlUserDef.mobile],
        avatarUrl: await getAvatarOssUrl(info[TlUserDef.avatarUrl]),
        roleName,
        roleId,
        createTime: info[TlUserDef.createdAt],
    }

    return tlResponseSuccess("获取成功", result)
}


/**
 * 添加用户 - 管理员
 * @param {*} companyId 
 * @param {*} name
 * @param {*} password
 * @param {*} email
 * @param {*} mobile
 * @param {*} avatarUrl
 * @param {*} roleId
 * @param {*} loginInfo
 * @returns 
 */
const adminAddUser = async function({ 
    companyId, name, password, email, mobile, avatarUrl, roleId,
    loginInfo
}){
    const {
        loginUserCompanyId, loginUserId, loginUserRoleId
    } = loginInfo

    if(loginUserRoleId !== TlRoleInner.user.admin.id){
        return tlResponseForbidden("非法用户")
    }

    if(!companyId || !name || !password || !roleId){
        return tlResponseArgsError("请求参数错误")
    }

    if(!checkIsId(companyId)){
        return tlResponseArgsError("企业id非法")
    }

    if(!checkIsId(roleId)){
        return tlResponseArgsError("角色id非法")
    }

    companyId = parseInt(companyId)
    roleId = parseInt(roleId)

    if(name.length > 20){
        return tlResponseArgsError("用户名过长")
    }

    if(password.length > 64){
        return tlResponseArgsError("密码过长")
    }

    if(email && email.length > 64){
        return tlResponseArgsError("邮箱过长")
    }

    if(mobile && mobile.length > 11){
        return tlResponseArgsError("手机号过长")
    }

    if(avatarUrl && avatarUrl.length > 255){
        return tlResponseArgsError("头像url过长")
    }

    const companyInfo = await companyService.getInfoById({
        id: companyId
    })

    if(Object.keys(companyInfo).length == 0){
        return tlResponseNotFound("企业不存在")
    }

    if([
        TlRoleInner.user.normal.id,
    ].indexOf(roleId) === -1){
        return tlResponseArgsError("角色id非法")
    }

    const salt = crypto.randomBytes(16).toString('hex')
    const saltPassword = encryptStr({
        str: password,
        salt: salt
    })

    tlConsole(name, password, salt, saltPassword)

    const result = await userService.addInfo({
        companyId, 
        name, 
        password, 
        salt, 
        roleId,
        email: email || '', 
        mobile: mobile || '', 
        avatarUrl: avatarUrl || '', 
    })

    if(Object.keys(result).length == 0){
        return tlResponseSvrError("添加失败")
    }

    return tlResponseSuccess("添加用成功")
}


module.exports = {
    searchUserByName,
    updateUserAvatar,
    searchUserById,
    bindEmail,

    adminUpdateUser,
    adminAddUser,
    adminDeleteUser,
    adminGetUserList,
    adminGetUserInfo
}