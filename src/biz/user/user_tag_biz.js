const { 
    tlResponseArgsError, tlResponseSvrError, 
    tlResponseSuccess, checkIsId
} = require('../../utils/utils')
const userTagService = require('../../service/user/tl_user_tag_service')
const { fields: userTagDef } = require('../../tables/tl_user_tag')

const { Def: TlUserTagDef, Type: TlUserTagType } = userTagDef


/**
 * 添加用户标签
 * @param {*} loginInfo
 * @param {*} name
 * @param {*} type 
 * @returns 
 */
const addUserTag = async function({
    loginInfo, name, type
}){
    if(!name) {
        return tlResponseArgsError("请求参数错误")
    }

    if(name.length > 255){
        return tlResponseArgsError("请求参数过长")
    }

    if(!type){
        return tlResponseArgsError("请求参数错误")
    }

    const {
        loginUserCompanyId, loginUserId, loginUsername
    } = loginInfo

    const result = await userTagService.addInfo({
        name, type, 
        userId: loginUserId, 
        companyId: loginUserCompanyId
    })

    if(Object.keys(result).length == 0){
        return tlResponseSvrError("添加标签失败")
    }

    return tlResponseSuccess(result)
}

/**
 * 获取用户标签列表
 * @param {*} loginInfo
 * @param {*} type 
 * @returns 
 */
const getUserTagList = async function({
    loginInfo, type
}){
    if(!type){
        return tlResponseArgsError("请求参数错误")
    }

    const {
        loginUserCompanyId, loginUserId, loginUsername
    } = loginInfo

    const result = await userTagService.getListByUserIdAndType({
        companyId: loginUserCompanyId,
        userId: loginUserId,
        type
    })

    let resultList = []
    result.forEach((item) => {
        resultList.push({
            id: item[TlUserTagDef.id],
            name: item[TlUserTagDef.name]
        })
    })

    return tlResponseSuccess("获取成功", resultList)
}

/**
 * 删除用户标签
 * @param {*} loginInfo
 * @param {*} id 
 * @returns 
 */
const delUserTag = async function({
    loginInfo, id
}){
    if(!id){
        return tlResponseArgsError("请求参数错误")
    }

    id = parseInt(id)
    if(!checkIsId(id)){
        return tlResponseArgsError("请求参数错误")
    }

    const {
        loginUserCompanyId, loginUserId, loginUsername
    } = loginInfo

    const result = await userTagService.deleteInfoById({
        companyId: loginUserCompanyId,
        id
    })

    if(result == 0){
        return tlResponseSvrError("删除失败")
    }

    return tlResponseSuccess("删除成功")
}


/**
 * 添加频道标签
 * @param {*} loginInfo
 * @param {*} name
 * @returns
 */
const addChannelTag = async function({
    loginInfo, name
}){
    return await addUserTag({
        loginInfo, name, type: TlUserTagType.CHANNEL
    })
}

/**
 * 添加好友标签
 * @param {*} loginInfo
 * @param {*} name
 * @returns
 */
const addFriendTag = async function({
    loginInfo, name
}){
    return await addUserTag({
        loginInfo, name, type: TlUserTagType.FRIEND
    })
}

/**
 * 获取频道标签列表
 * @param {*} loginInfo
 * @returns 
 */
const getChannelTagList = async function({
    loginInfo
}){
    return await getUserTagList({
        loginInfo, type: TlUserTagType.CHANNEL
    })
}

/**
 * 获取好友标签列表
 * @param {*} loginInfo
 * @returns 
 */
const getFriendTagList = async function({
    loginInfo
}){
    return await getUserTagList({
        loginInfo, type: TlUserTagType.FRIEND
    })
}



module.exports = {
    addUserTag,
    getUserTagList,
    delUserTag,
    addChannelTag,
    addFriendTag,
    getChannelTagList,
    getFriendTagList,
}