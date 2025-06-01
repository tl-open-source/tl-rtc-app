const tl_user_config_fields = {
    Name: 'tl_user_config',
    Description: '用户配置表',
    Def: {
        id : 'id',
        companyId : 'company_id',
        userId : 'user_id',
        normal: 'normal',
        account: 'account',
        message: 'message',
        skin: 'skin',
        authority: 'authority',
        other: 'other',
        createdAt : 'createdAt',
        updatedAt : 'updatedAt',
        deletedAt : 'deletedAt',
    },
    Account: {
        // 不接受好友申请
        notAcceptFriendApply: 'notAcceptFriendApply',
        // 不允许被他人搜索
        notAllowSearchAccount: 'notAllowSearchAccount',
        // 资源保存到服务器磁盘
        fileSaveToServer: 'fileSaveToServer',
    },
    Normal: {
        // 侧边栏-频道
        sidebarChannelOpen: 'sidebarChannelOpen',
        // 侧边栏-联系人
        sidebarContactOpen: 'sidebarContactOpen',
        // 侧边栏-设置
        sidebarSettingOpen: 'sidebarSettingOpen',
        // 首页
        homePage: 'homePage',
    },
    Message: {  // 消息设置
        // 网页通知
        webNotify: 'webNotify',
        // 消息红点
        messageDot: 'messageDot',
    },
    Authority: { // 权限设置
        
    },
    Skin: {
        global: 'global',
        skinTopHeaderTitleColor: "skinTopHeaderTitleColor",
        skinTopHeaderToolBackground: "skinTopHeaderToolBackground",
        skinTopHeaderToolFillColor: "skinTopHeaderToolFillColor",
        skinTopHeaderToolHoverFillColor: "skinTopHeaderToolHoverFillColor",
        skinTopHeaderToolHoverShadow: "skinTopHeaderToolHoverShadow",
        skinBodyColor: "skinBodyColor",
        skinBodyBackground: "skinBodyBackground",
        skinBodyShadow: "skinBodyShadow",
        skinBodyBorderColor: "skinBodyBorderColor",
        skinLayerMsgSuccessColor: "skinLayerMsgSuccessColor",
        skinLayerMsgErrorColor: "skinLayerMsgErrorColor",
        skinLayerMsgWarningColor: "skinLayerMsgWarningColor",
        skinSidebarToolBackground: "skinSidebarToolBackground",
        skinSidebarToolHoverBackground: "skinSidebarToolHoverBackground",
        skinSidebarToolFillColor: "skinSidebarToolFillColor",
        skinSidebarToolHoverFillColor: "skinSidebarToolHoverFillColor",
        skinSidebarToolMoreBorderColor: "skinSidebarToolMoreBorderColor",
        skinSidebarToolColor: "skinSidebarToolColor",
        skinSidebarToolHoverColor: "skinSidebarToolHoverColor",
        skinQuickOperPanelBackground: "skinQuickOperPanelBackground",
        skinQuickOperPanelItemColor: "skinQuickOperPanelItemColor",
        skinQuickOperPanelItemHoverBackground: "skinQuickOperPanelItemHoverBackground",
        skinQuickOperPanelItemHoverColor: "skinQuickOperPanelItemHoverColor",
        skinChannelListNoChannelColor: "skinChannelListNoChannelColor",
        skinChannelListItemHoverBackground: "skinChannelListItemHoverBackground",
        skinChannelListItemTopBackground: "skinChannelListItemTopBackground",
        skinChannelListItemMessageColor: "skinChannelListItemMessageColor",
        skinChannelListItemMessageAtUserTextColor: "skinChannelListItemMessageAtUserTextColor",
        skinChannelListItemMessageAtMeTextColor: "skinChannelListItemMessageAtMeTextColor",
        skinChannelListItemTimeColor: "skinChannelListItemTimeColor",
        skinChannelListItemQuickMarkUnreadBackground: "skinChannelListItemQuickMarkUnreadBackground",
        skinChannelListItemQuickMarkUnreadColor: "skinChannelListItemQuickMarkUnreadColor",
        skinChannelListItemQuickTopBackground: "skinChannelListItemQuickTopBackground",
        skinChannelListItemQuickTopColor: "skinChannelListItemQuickTopColor",
        skinChannelListItemQuickDeleteBackground: "skinChannelListItemQuickDeleteBackground",
        skinChannelListItemQuickDeleteColor: "skinChannelListItemQuickDeleteColor",
        skinChannelListItemQuickHiddenBackground: "skinChannelListItemQuickHiddenBackground",
        skinChannelListItemQuickHiddenColor: "skinChannelListItemQuickHiddenColor",
        skinChannelListItemQuickUnNotifyBackground: "skinChannelListItemQuickUnNotifyBackground",
        skinChannelListItemQuickUnNotifyColor: "skinChannelListItemQuickUnNotifyColor",
        skinChannelTopSearchIColor: "skinChannelTopSearchIColor",
        skinChannelTopSearchInputBackground: "skinChannelTopSearchInputBackground",
        skinChannelTopSearchInputColor: "skinChannelTopSearchInputColor",
        skinChannelContentTopMoreFillColor: "skinChannelContentTopMoreFillColor",
        skinChannelContentBodyMessageBackground: "skinChannelContentBodyMessageBackground",
        skinChannelContentBodyMessageColor: "skinChannelContentBodyMessageColor",
        skinChannelContentBodyMessageSystemColor: "skinChannelContentBodyMessageSystemColor",
        skinChannelContentBodyMessageTimeColor: "skinChannelContentBodyMessageTimeColor",
        skinChannelContentBodyMessageLoadMoreColor: "skinChannelContentBodyMessageLoadMoreColor",
        skinChannelContentBodyMessageLoadMoreHoverColor: "skinChannelContentBodyMessageLoadMoreHoverColor",
        skinChannelContentBodyMessageNameColor: "skinChannelContentBodyMessageNameColor",
        skinChannelContentMoreBackground: "skinChannelContentMoreBackground",
        skinChannelContentMoreShadow: "skinChannelContentMoreShadow",
        skinChannelContentMoreListItemHoverColor: "skinChannelContentMoreListItemHoverColor",
        skinChannelContentMoreListItemOperChannelNameColor: "skinChannelContentMoreListItemOperChannelNameColor",
        skinChannelContentMoreListItemBorderColor: "skinChannelContentMoreListItemBorderColor",
        skinChannelContentMoreListUserItemOperHoverBackground: "skinChannelContentMoreListUserItemOperHoverBackground",
        skinChannelContentMoreListUserItemOperHoverFillColor: "skinChannelContentMoreListUserItemOperHoverFillColor",
        skinChannelContentBodyMessageNameHoverColor: "skinChannelContentBodyMessageNameHoverColor",
        skinChannelContentBodyItemMessageAtUserTextColor: "skinChannelContentBodyItemMessageAtUserTextColor",
        skinChannelContentMoreShareToolItemHoverBackground: "skinChannelContentMoreShareToolItemHoverBackground",
        skinChannelContentInviteSearchIColor: "skinChannelContentInviteSearchIColor",
        skinChannelContentInviteSearchInputBackground: "skinChannelContentInviteSearchInputBackground",
        skinChannelContentInviteSearchInputColor: "skinChannelContentInviteSearchInputColor",
        skinChannelContentInviteChooseListItemHoverBackground: "skinChannelContentInviteChooseListItemHoverBackground",
        skinChannelContentInviteChooseListEmptyColor: "skinChannelContentInviteChooseListEmptyColor",
        skinChannelContentNoticeEmptyColor: "skinChannelContentNoticeEmptyColor",
        skinChannelContentNoticeItemHoverBackground: "skinChannelContentNoticeItemHoverBackground",
        skinChannelContentNoticeItemTimeColor: "skinChannelContentNoticeItemTimeColor",
        skinChannelContentNoticeItemTitleColor: "skinChannelContentNoticeItemTitleColor",
        skinChannelContentBodyMessageMenuIconBackground: "skinChannelContentBodyMessageMenuIconBackground",
        skinChannelContentBodyMessageMenuIconColor: "skinChannelContentBodyMessageMenuIconColor",
        skinChannelContentBodyMessageMenuIconHoverBackground: "skinChannelContentBodyMessageMenuIconHoverBackground",
        skinChannelContentBodyMessageMenuIconHoverColor: "skinChannelContentBodyMessageMenuIconHoverColor",
        skinChannelContentBodyReplyContentBlockColor: "skinChannelContentBodyReplyContentBlockColor",
        skinChannelContentBodyReplyContentBlockBackground: "skinChannelContentBodyReplyContentBlockBackground",
        skinMediaVideoOtherItemShadow: "skinMediaVideoOtherItemShadow",
        skinMediaVideoToolListSvgFillColor: "skinMediaVideoToolListSvgFillColor",
        skinMediaVideoToolListSvgBackground: "skinMediaVideoToolListSvgBackground",
        skinMediaVideoToolListSvgHoverBackground: "skinMediaVideoToolListSvgHoverBackground",
        skinMediaVideoToolListSvgHoverFillColor: "skinMediaVideoToolListSvgHoverFillColor",
        skinMediaVideoToolListYsqCloseBackground: "skinMediaVideoToolListYsqCloseBackground",
        skinContactHeaderToolHoverShadow: "skinContactHeaderToolHoverShadow",
        skinContactHeaderToolSvgFillColor: "skinContactHeaderToolSvgFillColor",
        skinContactHeaderToolSvgHoverFillColor: "skinContactHeaderToolSvgHoverFillColor",
        skinContactTopSearchIColor: "skinContactTopSearchIColor",
        skinContactTopSearchInputBackground: "skinContactTopSearchInputBackground",
        skinContactTopSearchInputColor: "skinContactTopSearchInputColor",
        skinContactListItemHoverBackground: "skinContactListItemHoverBackground",
        skinContactContentToolItemHoverBackground: "skinContactContentToolItemHoverBackground",
        skinContactContentOtherItemBadgeBackground: "skinContactContentOtherItemBadgeBackground",
        skinContactContentItemMessageColor: "skinContactContentItemMessageColor",
        skinContactContentItemOtherStatusColor: "skinContactContentItemOtherStatusColor",
        skinLoginButtonBackground: "skinLoginButtonBackground",
        skinLoginListItemHoverBackground: "skinLoginListItemHoverBackground",
        skinLoginListItemHoverColor: "skinLoginListItemHoverColor",
        skinLoginContentFormInputColor: "skinLoginContentFormInputColor",
        skinLoginContentBodyBottomColor: "skinLoginContentBodyBottomColor",
        skinLoginContentBodyBottomHoverColor: "skinLoginContentBodyBottomHoverColor",
        skinLoginContentBodyScanTitleColor: "skinLoginContentBodyScanTitleColor",
        skinLoginContentBodyScanTitleBackground: "skinLoginContentBodyScanTitleBackground",
        skinLoginContentBodyScanCodeItemDisabledBackground: "skinLoginContentBodyScanCodeItemDisabledBackground",
        skinLoginContentBodyScanCodeItemFocusBorderColor: "skinLoginContentBodyScanCodeItemFocusBorderColor",
        skinLoginEmailCodeBtnColor: "skinLoginEmailCodeBtnColor",
        skinLoginEmailCodeBtnDisabledBackground: "skinLoginEmailCodeBtnDisabledBackground",
        skinLoginHelpMobileColor: "skinLoginHelpMobileColor",
        skinLoginHelpMobileHoverColor: "skinLoginHelpMobileHoverColor",
        skinLoginBodyCleanColor: "skinLoginBodyCleanColor",
        skinLoginBodyCleanHoverColor: "skinLoginBodyCleanHoverColor",
        skinLoginItemMobileIconBackground: "skinLoginItemMobileIconBackground",
        skinSettingListItemHoverBackground: "skinSettingListItemHoverBackground",
        skinSettingListItemActiveBackground: "skinSettingListItemActiveBackground",
        skinSettingTopSearchIColor: "skinSettingTopSearchIColor",
        skinSettingTopSearchInputBackground: "skinSettingTopSearchInputBackground",
        skinSettingTopSearchInputColor: "skinSettingTopSearchInputColor",
        skinSettingContentTopExportBackground: "skinSettingContentTopExportBackground",
        skinSettingContentTopExportFillColor: "skinSettingContentTopExportFillColor",
        skinSettingContentBlockBackground: "skinSettingContentBlockBackground",
        skinSettingContentBlockBadgeBackground: "skinSettingContentBlockBadgeBackground",
        skinSettingContentBlockBadgeColor: "skinSettingContentBlockBadgeColor",
        skinSettingContentBlockBadgeHoverBackground: "skinSettingContentBlockBadgeHoverBackground",
        skinSettingContentBlockBadgeHoverColor: "skinSettingContentBlockBadgeHoverColor",
        skinSettingContentBlockItemHoverBackground: "skinSettingContentBlockItemHoverBackground",
        skinSettingContentBindIconHoverColor: "skinSettingContentBindIconHoverColor",
        skinSettingContentBindIconTipFillColor: "skinSettingContentBindIconTipFillColor",
        skinSettingContentPreviewItemSvgBackground: "skinSettingContentPreviewItemSvgBackground",
        skinSettingContentPreviewItemSvgHoverBackground: "skinSettingContentPreviewItemSvgHoverBackground",
        skinSettingContentAccountBindEmailBtnBackground: "skinSettingContentAccountBindEmailBtnBackground",
        skinSettingContentAccountBindEmailBtnColor: "skinSettingContentAccountBindEmailBtnColor",
        skinSettingContentAccountBindEmailInputBackground: "skinSettingContentAccountBindEmailInputBackground",
        skinSettingContentAccountBindEmailInputColor: "skinSettingContentAccountBindEmailInputColor",
        skinSettingContentAccountBindEmailBtnDisabledBackground: "skinSettingContentAccountBindEmailBtnDisabledBackground",
        skinSettingContentAccountBindEmailBtnDisabledColor: "skinSettingContentAccountBindEmailBtnDisabledColor",
        skinChannelHistoryMessageTopSearchIColor: "skinChannelHistoryMessageTopSearchIColor",
        skinChannelHistoryMessageTopSearchInputBackground: "skinChannelHistoryMessageTopSearchInputBackground",
        skinChannelHistoryMessageTopSearchInputColor: "skinChannelHistoryMessageTopSearchInputColor",
        skinChannelHistoryMessageHeaderToolItemTitleColor: "skinChannelHistoryMessageHeaderToolItemTitleColor",
        skinChannelHistoryMessageSearchParamBadgeColor: "skinChannelHistoryMessageSearchParamBadgeColor",
        skinChannelHistoryMessageSearchParamBadgeHoverBackground: "skinChannelHistoryMessageSearchParamBadgeHoverBackground",
        skinChannelHistoryMessageSearchParamBadgeHoverColor: "skinChannelHistoryMessageSearchParamBadgeHoverColor",
        skinChannelHistoryMessageSearchParamBadgeActiveBackground: "skinChannelHistoryMessageSearchParamBadgeActiveBackground",
        skinChannelHistoryMessageSearchParamBadgeActiveColor: "skinChannelHistoryMessageSearchParamBadgeActiveColor",
        skinChannelHistoryMessageListItemTimeColor: "skinChannelHistoryMessageListItemTimeColor",
        skinChannelHistoryMessageContentBodyMessageBackground: "skinChannelHistoryMessageContentBodyMessageBackground",
        skinChannelHistoryMessageContentBodyMessageColor: "skinChannelHistoryMessageContentBodyMessageColor",
        skinChannelHistoryMessageFooterTotalColor: "skinChannelHistoryMessageFooterTotalColor",
        skinChannelHistoryMessageFooterLoadMoreColor: "skinChannelHistoryMessageFooterLoadMoreColor",
        skinChannelHistoryMessageFooterLoadMoreHoverColor: "skinChannelHistoryMessageFooterLoadMoreHoverColor",
        skinFaceItemHoverBackground: "skinFaceItemHoverBackground",
        skinFaceItemHoverColor: "skinFaceItemHoverColor",
        skinFaceTabBackground: "skinFaceTabBackground",
        skinFaceTabColor: "skinFaceTabColor",
        skinFaceTabHoverBackground: "skinFaceTabHoverBackground",
        skinFaceTabHoverColor: "skinFaceTabHoverColor",
        skinFaceSearchInputBackground: "skinFaceSearchInputBackground",
        skinFaceSearchInputColor: "skinFaceSearchInputColor",
        skinFaceContentTitleColor: "skinFaceContentTitleColor",
    },
    Other: {
        // 我的文件视图模式
        cloudSelfViewMode: 'cloudSelfViewMode',
        // 我的收藏视图模式
        cloudCollectionViewMode: 'cloudCollectionViewMode',
        // 我的回收小站视图模式
        cloudRecycleViewMode: 'cloudRecycleViewMode',
        // 群聊文件视图模式
        cloudGroupViewMode: 'cloudGroupViewMode',
        // 自定义wss服务地址
        customWss: 'customWss',
    }
}

const tl_user_config_model = function(DataTypes){
    return {
        model : {
            id: {
                type: DataTypes.INTEGER,
                comment: '用户配置id',
                primaryKey: true,
                autoIncrement: true
            },
            company_id: {
                type: DataTypes.INTEGER,
                comment: '企业id'
            },
            user_id:{
                type: DataTypes.INTEGER,
                comment: '用户id',
                defaultValue: 0
            },
            account: {
                type: DataTypes.TEXT,
                comment: '账户设置',
                defaultValue: ''
            },
            message: {
                type: DataTypes.TEXT,
                comment: '消息设置',
                defaultValue: ''
            },
            skin: {
                type: DataTypes.TEXT,
                comment: '皮肤设置',
                defaultValue: ''
            },
            authority: {
                type: DataTypes.TEXT,
                comment: '权限设置',
                defaultValue: ''
            },
            normal: {
                type: DataTypes.TEXT,
                comment: '通用设置',
                defaultValue: ''
            },
            other: {
                type: DataTypes.TEXT,
                comment: '其他设置',
                defaultValue: ''
            },
        },
        options : {
			timestamps: true,
			comment: '用户配置表',
			indexes: [{
				name: 'created_at_index',
				method: 'BTREE',
				fields: ['created_at']
			}]
		}
    }
}

module.exports = {
    model: function(sequelize, DataTypes){
        return {
            TlUserConfig: sequelize.define(
                'tl_user_config', 
                tl_user_config_model(DataTypes).model, 
                tl_user_config_model(DataTypes).options
            )
        }
    },
    fields: tl_user_config_fields
}