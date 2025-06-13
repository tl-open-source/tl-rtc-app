const uuid = require('uuid')
const {
    tlResponseArgsError, tlResponseForbidden, tlResponseSvrError,
    tlResponseTimeout, tlResponseNotFound, tlResponseSuccess,
    tlConsole,
    setBit,
    checkBit, checkIsId
} = require('../../utils/utils')
const cutPasteService = require('../../service/cut_paste/tl_cut_paste_service')
const cutPasteDetailService = require('../../service/cut_paste/tl_cut_paste_detail_service')
const companyService = require('../../service/company/tl_company_service')
const userService = require('../../service/user/tl_user_service')

const { fields: TlUserFields } = require('../../tables/tl_user')
const { fields: TlCutPasteFields } = require('../../tables/tl_cut_paste')
const { fields: TlCutPasteDetailFields } = require('../../tables/tl_cut_paste_detail')
const { inner: TlRoleInner } = require('../../tables/tl_role')
const { fields: TlCompanyFields } = require('../../tables/tl_company')

const {
    Def: TlCutPasteDef, Status: TlCutPasteStatus, Flag: TlCutPasteFlag
} = TlCutPasteFields
const {
    Def: TlCutPasteDetailDef, Type: TlCutPasteDetailType,
} = TlCutPasteDetailFields
const { Def: TlUserDef, Flag: TlUserFlag } = TlUserFields
const { Def: TlCompanyDef } = TlCompanyFields



/**
 * 创建剪切板
 * @param {*} loginInfo
 * @param {*} title
 * @param {*} password
 */
const createCutPaste = async function ({ loginInfo, title, password }) {
    const {
        loginUserCompanyId, loginUserId
    } = loginInfo

    if (!title) {
        return tlResponseArgsError("标题不能为空")
    }

    if(title.length > 32) {
        return tlResponseArgsError("标题长度不能超过32")
    }

    if(password && password.length > 32) {
        return tlResponseArgsError("密码长度不能超过32")
    }

    const code = uuid.v4().replace(/-/g, '')

    const cutPaste = await cutPasteService.addInfo({
        companyId: loginUserCompanyId,
        userId: loginUserId,
        title,
        code,
        password,
        flag: 0,
        status: TlCutPasteStatus.USEED,
    })

    if(Object.keys(cutPaste).length === 0) {
        return tlResponseSvrError("创建失败")
    }

    return tlResponseSuccess("创建成功", {
        id: cutPaste[TlCutPasteDef.id],
        code: cutPaste[TlCutPasteDef.code],
    })
}


/**
 * 获取剪切板列表
 * @param {*} loginInfo
 */
const getCutPasteList = async function ({ loginInfo }) {
    const {
        loginUserCompanyId, loginUserId
    } = loginInfo

    const cutPasteList = await cutPasteService.getListByUserId({
        companyId: loginUserCompanyId,
        userId: loginUserId,
    })

    const cutPasteIdList = cutPasteList.map(item => item[TlCutPasteDef.id])

    // 统计剪切板详情数量
    const cutPasteDetailCountResult = await cutPasteDetailService.getCountByCutPasteIdList({
        cutPasteIdList,
    })
    const cutPasteDetailCountMap = {}
    for(let i = 0; i < cutPasteDetailCountResult.length; i++) {
        let item = cutPasteDetailCountResult[i]
        cutPasteDetailCountMap[item[TlCutPasteDetailDef.cutPasteId]] = item.count
    }

    let resultList = []
    for(let i = 0; i < cutPasteList.length; i++) {
        let item = cutPasteList[i]

        let status = item[TlCutPasteDef.status]
        let statusStr = ""
        if (status === TlCutPasteStatus.USEED) {
            statusStr = "使用中"
        } else if (status === TlCutPasteStatus.CLOSE) {
            statusStr = "已关闭"
        }

        let cutPasteId = item[TlCutPasteDef.id]
        let detailCount = cutPasteDetailCountMap[cutPasteId] || 0

        resultList.push({
            id: item[TlCutPasteDef.id],
            code: item[TlCutPasteDef.code],
            title: item[TlCutPasteDef.title],
            status: statusStr,
            createdTime: item[TlCutPasteDef.createdAt],
            detailCount,
        })
    }

    return tlResponseSuccess("获取成功", resultList)
}


/**
 * 更新剪切板名称
 * @param {*} loginInfo
 * @param {*} cutPasteId
 * @param {*} title
 */
const updateCutPasteTitle = async function ({ loginInfo, cutPasteId, title }) {
    const {
        loginUserCompanyId, loginUserId
    } = loginInfo

    if (!cutPasteId) {
        return tlResponseArgsError("剪切板ID不能为空")
    }

    cutPasteId = parseInt(cutPasteId)
    if (!checkIsId(cutPasteId)) {
        return tlResponseArgsError("剪切板ID格式错误")
    }

    if (!title) {
        return tlResponseArgsError("标题不能为空")
    }

    if(title.length > 32) {
        return tlResponseArgsError("标题长度不能超过32")
    }

    const cutPaste = await cutPasteService.getInfoById({
        companyId: loginUserCompanyId,
        id: cutPasteId,
    })

    if (Object.keys(cutPaste).length === 0) {
        return tlResponseNotFound("剪切板不存在")
    }

    const userId = cutPaste[TlCutPasteDef.userId]
    if (userId !== loginUserId) {
        return tlResponseForbidden("无权限")
    }

    const updateRes = await cutPasteService.updateInfoById({
        companyId: loginUserCompanyId,
        id: cutPasteId,
    }, {
        [TlCutPasteDef.title]: title,
    })

    if(Object.keys(updateRes).length === 0) {
        return tlResponseSvrError("更新失败")
    }

    return tlResponseSuccess("更新成功")
}


/**
 * 关闭剪切板
 * @param {*} loginInfo
 * @param {*} cutPasteId
 */
const closeCutPaste = async function ({ loginInfo, cutPasteId }) {
    const {
        loginUserCompanyId, loginUserId
    } = loginInfo

    if (!cutPasteId) {
        return tlResponseArgsError("剪切板ID不能为空")
    }

    cutPasteId = parseInt(cutPasteId)
    if (!checkIsId(cutPasteId)) {
        return tlResponseArgsError("剪切板ID格式错误")
    }

    const cutPaste = await cutPasteService.getInfoById({
        companyId: loginUserCompanyId,
        id: cutPasteId,
    })

    if (Object.keys(cutPaste).length === 0) {
        return tlResponseNotFound("剪切板不存在")
    }

    const userId = cutPaste[TlCutPasteDef.userId]
    if (userId !== loginUserId) {
        return tlResponseForbidden("无权限")
    }

    const updateRes = await cutPasteService.updateInfoById({
        companyId: loginUserCompanyId,
        id: cutPasteId,
    }, {
        [TlCutPasteDef.status]: TlCutPasteStatus.CLOSE,
    })

    if(Object.keys(updateRes).length === 0) {
        return tlResponseSvrError("关闭失败")
    }

    return tlResponseSuccess("关闭成功")
}


/**
 * 开启剪切板
 * @param {*} loginInfo
 * @param {*} cutPasteId
 */
const openCutPaste = async function ({ loginInfo, cutPasteId }) {
    const {
        loginUserCompanyId, loginUserId
    } = loginInfo

    if (!cutPasteId) {
        return tlResponseArgsError("剪切板ID不能为空")
    }

    cutPasteId = parseInt(cutPasteId)
    if (!checkIsId(cutPasteId)) {
        return tlResponseArgsError("剪切板ID格式错误")
    }

    const cutPaste = await cutPasteService.getInfoById({
        companyId: loginUserCompanyId,
        id: cutPasteId,
    })

    if (Object.keys(cutPaste).length === 0) {
        return tlResponseNotFound("剪切板不存在")
    }

    const userId = cutPaste[TlCutPasteDef.userId]
    if (userId !== loginUserId) {
        return tlResponseForbidden("无权限")
    }

    const updateRes = await cutPasteService.updateInfoById({
        companyId: loginUserCompanyId,
        id: cutPasteId,
    }, {
        [TlCutPasteDef.status]: TlCutPasteStatus.USEED,
    })

    if(Object.keys(updateRes).length === 0) {
        return tlResponseSvrError("开启失败")
    }

    return tlResponseSuccess("开启成功")
}


/**
 * 更新剪切板密码
 * @param {*} loginInfo
 * @param {*} cutPasteId
 * @param {*} password
 */
const updateCutPastePassword = async function ({ loginInfo, cutPasteId, password }) {
    const {
        loginUserCompanyId, loginUserId
    } = loginInfo

    if (!cutPasteId) {
        return tlResponseArgsError("剪切板ID不能为空")
    }

    cutPasteId = parseInt(cutPasteId)
    if (!checkIsId(cutPasteId)) {
        return tlResponseArgsError("剪切板ID格式错误")
    }

    if(password && password.length > 32) {
        return tlResponseArgsError("密码长度不能超过32")
    }

    const cutPaste = await cutPasteService.getInfoById({
        companyId: loginUserCompanyId,
        id: cutPasteId,
    })

    if (Object.keys(cutPaste).length === 0) {
        return tlResponseNotFound("剪切板不存在")
    }

    const userId = cutPaste[TlCutPasteDef.userId]
    if (userId !== loginUserId) {
        return tlResponseForbidden("无权限")
    }

    const updateRes = await cutPasteService.updateInfoById({
        companyId: loginUserCompanyId,
        id: cutPasteId,
    }, {
        [TlCutPasteDef.password]: password,
    })

    if(Object.keys(updateRes).length === 0) {
        return tlResponseSvrError("更新失败")
    }

    return tlResponseSuccess("更新成功")
}


/**
 * 删除剪切板
 * @param {*} loginInfo
 * @param {*} cutPasteId
 */
const deleteCutPaste = async function ({ loginInfo, cutPasteId }) {
    const {
        loginUserCompanyId, loginUserId
    } = loginInfo

    if (!cutPasteId) {
        return tlResponseArgsError("剪切板ID不能为空")
    }

    cutPasteId = parseInt(cutPasteId)
    if (!checkIsId(cutPasteId)) {
        return tlResponseArgsError("剪切板ID格式错误")
    }

    const cutPaste = await cutPasteService.getInfoById({
        companyId: loginUserCompanyId,
        id: cutPasteId,
    })

    if (Object.keys(cutPaste).length === 0) {
        return tlResponseNotFound("剪切板不存在")
    }

    const userId = cutPaste[TlCutPasteDef.userId]
    if (userId !== loginUserId) {
        return tlResponseForbidden("无权限")
    }

    const deleteRes = await cutPasteService.deleteInfoById({
        companyId: loginUserCompanyId,
        id: cutPasteId,
    })

    if(deleteRes === 0) {
        return tlResponseSvrError("删除失败")
    }

    return tlResponseSuccess("删除成功")
}


/**
 * 删除剪切板详情
 * @param {*} loginInfo
 * @param {*} cutPasteDetailId
 */
const deleteCutPasteDetail = async function ({ loginInfo, cutPasteDetailId }) {
    const {
        loginUserCompanyId, loginUserId
    } = loginInfo

    if (!cutPasteDetailId) {
        return tlResponseArgsError("剪切板内容id不能为空")
    }

    cutPasteDetailId = parseInt(cutPasteDetailId)
    if (!checkIsId(cutPasteDetailId)) {
        return tlResponseArgsError("剪切板内容id格式错误")
    }

    const cutPasteDetail = await cutPasteDetailService.getInfoById({
        id: cutPasteDetailId,
    }, [
        TlCutPasteDetailDef.id
    ])

    if (Object.keys(cutPasteDetail).length === 0) {
        return tlResponseNotFound("剪切板内容不存在")
    }

    const result = await cutPasteDetailService.deleteInfoById({
        id: cutPasteDetailId,
    })

    if(result === 0) {
        return tlResponseSvrError("删除失败")
    }

    return tlResponseSuccess("删除成功")
}


/**
 * 添加剪切板详情记录
 * @param {*} loginInfo
 * @param {*} cutPasteId
 * @param {*} content
 */
const addCutPasteDetail = async function ({ loginInfo, cutPasteId, content }) {
    const {
        loginUserCompanyId, loginUserId
    } = loginInfo

    if (!cutPasteId) {
        return tlResponseArgsError("剪切板ID不能为空")
    }

    cutPasteId = parseInt(cutPasteId)
    if (!checkIsId(cutPasteId)) {
        return tlResponseArgsError("剪切板ID格式错误")
    }

    if (!content) {
        return tlResponseArgsError("内容不能为空")
    }

    if(content.length > 8096) {
        return tlResponseArgsError("内容长度不能超过1024")
    }

    const cutPaste = await cutPasteService.getInfoById({
        companyId: loginUserCompanyId,
        id: cutPasteId,
    })

    if (Object.keys(cutPaste).length === 0) {
        return tlResponseNotFound("剪切板不存在")
    }

    const userId = cutPaste[TlCutPasteDef.userId]
    if (userId !== loginUserId) {
        return tlResponseForbidden("无权限")
    }

    const code = cutPaste[TlCutPasteDef.code]

    // 识别内容类型
    let type = TlCutPasteDetailType.OTHER

    const cutPasteDetail = await cutPasteDetailService.addInfo({
        cutPasteId,
        code,
        flag: 0,
        content,
        type
    })

    if(Object.keys(cutPasteDetail).length === 0) {
        return tlResponseSvrError("添加失败")
    }

    return tlResponseSuccess("添加成功", {
        id: cutPasteDetail[TlCutPasteDetailDef.id],
        content: cutPasteDetail[TlCutPasteDetailDef.content],
        type: TlCutPasteDetailType.toStr[cutPasteDetail[TlCutPasteDetailDef.type]],
        createdTime: cutPasteDetail[TlCutPasteDetailDef.createdAt],
    })
}


/**
 * 获取剪切板详情列表
 * @param {*} loginInfo
 * @param {*} cutPasteId
 * @param {*} typeList
 */
const getCutPasteDetailList = async function ({ loginInfo, cutPasteId, typeList }) {
    const {
        loginUserCompanyId, loginUserId
    } = loginInfo

    if(!cutPasteId) {
        return tlResponseArgsError("剪切板ID不能为空")
    }

    cutPasteId = parseInt(cutPasteId)
    if (!checkIsId(cutPasteId)) {
        return tlResponseArgsError("剪切板ID格式错误")
    }

    const cutPaste = await cutPasteService.getInfoById({
        companyId: loginUserCompanyId,
        id: cutPasteId,
    })

    if (Object.keys(cutPaste).length === 0) {
        return tlResponseNotFound("剪切板不存在")
    }

    const cutPasteDetailList = await cutPasteDetailService.getListByCutPasteIdAndTypeList({
        cutPasteId,
        typeList,
    })

    let resultList = []
    for(let i = 0; i < cutPasteDetailList.length; i++) {
        let item = cutPasteDetailList[i]

        resultList.push({
            id: item[TlCutPasteDetailDef.id],
            content: item[TlCutPasteDetailDef.content],
            type: TlCutPasteDetailType.toStr[item[TlCutPasteDetailDef.type]],
            createdTime: item[TlCutPasteDetailDef.createdAt],
        })
    }

    return tlResponseSuccess("获取成功", resultList)
}


/**
 * 获取剪切板详情 - code: 分享场景，不需要登录
 * @param {*} loginInfo
 * @param {*} typeList
 * @param {*} inputPassword
 */
const getCutPasteDetailListByCode = async function ({ code, typeList, inputPassword }) {
    if(!code) {
        return tlResponseArgsError("剪切板码为空")
    }

    const cutPaste = await cutPasteService.getInfoByCode({
        code,
    })

    if (Object.keys(cutPaste).length === 0) {
        return tlResponseNotFound("剪切板不存在")
    }

    const status = cutPaste[TlCutPasteDef.status]
    if (status === TlCutPasteStatus.CLOSE) {
        return tlResponseForbidden("剪切板已关闭")
    }

    const password = cutPaste[TlCutPasteDef.password]
    if (password && password !== inputPassword) {
        return tlResponseForbidden("密码错误")
    }

    const cutPasteId = cutPaste[TlCutPasteDef.id]
    const cutPasteDetailList = await cutPasteDetailService.getListByCutPasteIdAndTypeList({
        cutPasteId,
        typeList,
    })

    let resultList = []
    for(let i = 0; i < cutPasteDetailList.length; i++) {
        let item = cutPasteDetailList[i]

        resultList.push({
            id: item[TlCutPasteDetailDef.id],
            content: item[TlCutPasteDetailDef.content],
            type: item[TlCutPasteDetailDef.type],
            createdTime: item[TlCutPasteDetailDef.createdAt],
        })
    }

    return tlResponseSuccess("获取成功", resultList)
}


/**
 * 添加剪切板详情记录 - code: 分享场景，不需要登录
 * @param {*} code
 * @param {*} content
 * @param {*} inputPassword
 */
const addCutPasteDetailByCode = async function ({ code, content, inputPassword }) {
    if(!code) {
        return tlResponseArgsError("剪切板码为空")
    }

    if (!content) {
        return tlResponseArgsError("内容不能为空")
    }

    const cutPaste = await cutPasteService.getInfoByCode({
        code,
    })

    if (Object.keys(cutPaste).length === 0) {
        return tlResponseNotFound("剪切板不存在")
    }

    const status = cutPaste[TlCutPasteDef.status]
    if (status === TlCutPasteStatus.CLOSE) {
        return tlResponseForbidden("剪切板已关闭")
    }

    const password = cutPaste[TlCutPasteDef.password]
    if (password && password !== inputPassword) {
        return tlResponseForbidden("密码错误")
    }

    const cutPasteId = cutPaste[TlCutPasteDef.id]

    // 识别内容类型
    let type = TlCutPasteDetailType.OTHER

    const cutPasteDetail = await cutPasteDetailService.addInfo({
        cutPasteId,
        code,
        flag: 0,
        content,
        type
    })

    if(Object.keys(cutPasteDetail).length === 0) {
        return tlResponseSvrError("添加失败")
    }

    return tlResponseSuccess("添加成功", {
        id: cutPasteDetail[TlCutPasteDetailDef.id],
        content: cutPasteDetail[TlCutPasteDetailDef.content],
        type: TlCutPasteDetailType.toStr[cutPasteDetail[TlCutPasteDetailDef.type]],
        createdTime: cutPasteDetail[TlCutPasteDetailDef.createdAt],
    })
}


/**
 * 创建剪切板 - 管理员
 * @param {*} loginInfo
 * @param {*} title
 * @param {*} password
 * @param {*} companyId
 * @param {*} userId
 */
const adminAddCutPaste = async function ({ 
    loginInfo, companyId, userId, title, password
 }) {
    const {
        loginUserCompanyId, loginUserId, loginUserRoleId
    } = loginInfo

    if(loginUserRoleId !== TlRoleInner.user.admin.id){
        return tlResponseForbidden("非法用户")
    }

    if (!title) {
        return tlResponseArgsError("标题不能为空")
    }

    if(title.length > 32) {
        return tlResponseArgsError("标题长度不能超过32")
    }

    if(password && password.length > 32) {
        return tlResponseArgsError("密码长度不能超过32")
    }

    if(!companyId) {
        return tlResponseArgsError("企业id不能为空")
    }

    if(!userId) {
        return tlResponseArgsError("用户id不能为空")
    }

    if(!checkIsId(companyId)) {
        return tlResponseArgsError("企业id格式错误")
    }

    if(!checkIsId(userId)) {
        return tlResponseArgsError("用户id格式错误")
    }

    companyId = parseInt(companyId)
    userId = parseInt(userId)

    const company = await companyService.getInfoById({
        id: companyId,
    })

    if (Object.keys(company).length === 0) {
        return tlResponseNotFound("企业不存在")
    }

    const user = await userService.getInfoById({
        companyId,
        id: userId,
    })

    if (Object.keys(user).length === 0) {
        return tlResponseNotFound("用户不存在")
    }

    const code = uuid.v4().replace(/-/g, '')

    let flag = 0
    if(password) {
        flag = setBit(flag, TlCutPasteFlag.HAS_PASSWORD, true)
    }

    const cutPaste = await cutPasteService.addInfo({
        companyId,
        userId,
        title,
        code,
        password,
        flag: flag,
        status: TlCutPasteStatus.USEED,
    })

    if(Object.keys(cutPaste).length === 0) {
        return tlResponseSvrError("创建失败")
    }

    return tlResponseSuccess("创建成功")
}


/**
 * 更新剪切板 - 管理员
 * @param {*} loginInfo
 * @param {*} companyId
 * @param {*} id
 * @param {*} title
 * @param {*} password
 * @param {*} status
 */
const adminUpdateCutPaste = async function ({ 
    loginInfo, companyId, id, title, password, status
 }) {
    const {
        loginUserCompanyId, loginUserId, loginUserRoleId
    } = loginInfo

    if(loginUserRoleId !== TlRoleInner.user.admin.id){
        return tlResponseForbidden("非法用户")
    }

    if (!id) {
        return tlResponseArgsError("请求参数错误")
    }

    if(!companyId) {
        return tlResponseArgsError("请求参数错误")
    }

    if(!status) {
        return tlResponseArgsError("请求参数错误")
    }

    if (!checkIsId(id)) {
        return tlResponseArgsError("请求参数错误")
    }

    if(!checkIsId(companyId)) {
        return tlResponseArgsError("请求参数错误")
    }

    if(!checkIsId(status)) {
        return tlResponseArgsError("请求参数错误")
    }

    id = parseInt(id)
    companyId = parseInt(companyId)
    status = parseInt(status)

    if (!title) {
        return tlResponseArgsError("标题不能为空")
    }

    if(title.length > 32) {
        return tlResponseArgsError("标题长度不能超过32")
    }

    if(password && password.length > 32) {
        return tlResponseArgsError("密码长度不能超过32")
    }

    if(Object.values(TlCutPasteStatus).indexOf(status) === -1) {
        return tlResponseArgsError("请求参数错误")
    }

    const cutPaste = await cutPasteService.getInfoById({
        companyId,
        id
    })

    if (Object.keys(cutPaste).length === 0) {
        return tlResponseNotFound("剪切板不存在")
    }

    let flag = cutPaste[TlCutPasteDef.flag]
    if(password) {
        flag = setBit(flag, TlCutPasteFlag.HAS_PASSWORD, true)
    } else {
        flag = setBit(flag, TlCutPasteFlag.HAS_PASSWORD, false)
    }

    const updateRes = await cutPasteService.updateInfoById({
        companyId,
        id,
    }, {
        [TlCutPasteDef.title]: title,
        [TlCutPasteDef.password]: password,
        [TlCutPasteDef.flag]: flag,
        [TlCutPasteDef.status]: status
    })

    if(Object.keys(updateRes).length === 0) {
        return tlResponseSvrError("更新失败")
    }

    return tlResponseSuccess("更新成功")
}


/**
 * 删除剪切板 - 管理员
 * @param {*} loginInfo
 * @param {*} companyId
 * @param {*} id
 */
const adminDeleteCutPaste = async function ({ loginInfo, companyId, id }) {
    const {
        loginUserCompanyId, loginUserId, loginUserRoleId
    } = loginInfo

    if(loginUserRoleId !== TlRoleInner.user.admin.id){
        return tlResponseForbidden("非法用户")
    }

    if (!id) {
        return tlResponseArgsError("剪切板ID不能为空")
    }

    if(!companyId) {
        return tlResponseArgsError("企业id不能为空")
    }

    if (!checkIsId(id)) {
        return tlResponseArgsError("剪切板ID格式错误")
    }

    id = parseInt(id)
    companyId = parseInt(companyId)

    const cutPaste = await cutPasteService.getInfoById({
        companyId,
        id
    })

    if (Object.keys(cutPaste).length === 0) {
        return tlResponseNotFound("剪切板不存在")
    }

    const deleteRes = await cutPasteService.deleteInfoById({
        companyId,
        id,
    })

    if(deleteRes === 0) {
        return tlResponseSvrError("删除失败")
    }

    return tlResponseSuccess("删除成功")
}


/**
 * 获取剪切板列表 - 管理员
 * @param {*} loginInfo
 * @param {*} keyword
 * @param {*} page
 * @param {*} limit
 */
const adminGetCutPasteList = async function ({ loginInfo, keyword, page, limit }) {
    const {
        loginUserCompanyId, loginUserId, loginUserRoleId
    } = loginInfo

    if(loginUserRoleId !== TlRoleInner.user.admin.id){
        return tlResponseForbidden("非法用户")
    }

    if(!checkIsId(page)){
        return tlResponseArgsError("请求参数错误")
    }

    if(!checkIsId(limit)){
        return tlResponseArgsError("请求参数错误")
    }

    page = parseInt(page)
    limit = parseInt(limit)

    let total = 0
    let list = []

    if(keyword === '' || keyword === null || keyword === undefined){
        list = await cutPasteService.getListForPage({}, [
            TlCutPasteDef.id,
            TlCutPasteDef.companyId,
            TlCutPasteDef.userId,
            TlCutPasteDef.code,
            TlCutPasteDef.password,
            TlCutPasteDef.title,
            TlCutPasteDef.status,
            TlCutPasteDef.createdAt,
        ], page, limit)

        total = await cutPasteService.getCount({})
    }else{
        list = await cutPasteService.getListByKeywordForPage({
            keyword
        }, [
            TlCutPasteDef.id,
            TlCutPasteDef.companyId,
            TlCutPasteDef.userId,
            TlCutPasteDef.code,
            TlCutPasteDef.password,
            TlCutPasteDef.title,
            TlCutPasteDef.status,
            TlCutPasteDef.createdAt,
        ], page, limit)

        total = await cutPasteService.getCountByKeyword({
            keyword
        })
    }

    // 获取用户信息
    const userMap = {}
    const userIdList = list.map(item => item[TlCutPasteDef.userId])
    const userList = await userService.getListByIdListNoCompanyId({
        idList: userIdList
    }, [
        TlUserDef.id,
        TlUserDef.name
    ])
    userList.forEach(item => {
        userMap[item[TlUserDef.id]] = item
    })

    // 获取企业信息
    const companyMap = {}
    const companyIdList = list.map(item => item[TlCutPasteDef.companyId])
    const companyList = await companyService.getListByIdList({
        idList: companyIdList
    }, [
        TlCompanyDef.id,
        TlCompanyDef.name
    ])
    companyList.forEach(item => {
        companyMap[item[TlCompanyDef.id]] = item
    })

    let resultList = []

    for(let i = 0; i < list.length; i++) {
        let item = list[i]

        let status = item[TlCutPasteDef.status]
        let statusStr = TlCutPasteStatus.toStr(status)

        let userId = item[TlCutPasteDef.userId]
        let user = userMap[userId] || {}

        let companyId = item[TlCutPasteDef.companyId]
        let company = companyMap[companyId] || {}

        resultList.push({
            id: item[TlCutPasteDef.id],
            companyId,
            companyName: company[TlCompanyDef.name],
            userId,
            username: user[TlUserDef.name],
            code: item[TlCutPasteDef.code],
            title: item[TlCutPasteDef.title],
            password: item[TlCutPasteDef.password],
            statusStr,
            status,
            createTime: item[TlCutPasteDef.createdAt],
        })
    }

    return tlResponseSuccess("获取成功", {
        count: total,
        list: resultList
    })
}


module.exports = {
    createCutPaste,
    getCutPasteList,
    updateCutPasteTitle,
    closeCutPaste,
    openCutPaste,
    updateCutPastePassword,
    deleteCutPaste,

    deleteCutPasteDetail,
    addCutPasteDetail,
    getCutPasteDetailList,
    getCutPasteDetailListByCode,
    addCutPasteDetailByCode,

    adminAddCutPaste,
    adminUpdateCutPaste,
    adminDeleteCutPaste,
    adminGetCutPasteList
}