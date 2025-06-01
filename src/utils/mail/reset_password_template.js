
/**
 * 重置邮件密码模版
 * @param {string} password - 新密码
 * @param {string} company - 团队名称
 * @param {string} companyUrl - 团队网址
 * @returns {string} - 返回邮件的HTML内容
 */
const resetEmailPasswordTemplate = function({
    password, companyName, companyUrl
}) {
    return `
        <!DOCTYPE html>
        <html lang="zh-CN">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>重置密码</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;" width="90%;margin-left:5%;">
                <table width="100%;" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                        <td align="center">
                            <table width="350" cellpadding="20" cellspacing="0" border="0"
                                style="border: 1px solid #ddd; background-color: #f9f9f9;margin-top: 20px;">
                                <tr>
                                    <td align="left">
                                        <h2 style="color: #555;">尊敬的用户，您好！</h2>
                                        <p>感谢您使用我们的服务。您的密码已重置为：</p>
                                        <p style="font-size: 24px; font-weight: bold; color: #000;background: white;text-align: center;">${password}</p>
                                        <br>
                                        <p>请勿将透露给他人，，并尽快登陆修改密码。</p>
                                        <p>如果您未请求此重置操作，请忽略此邮件。</p>
                                        <p>如有任何问题，请随时联系我们的客服团队。</p>
                                        <br>
                                        <p>祝您愉快！</p>
                                        <p>此致<br><br>
                                        <a href="${companyUrl}" style="color: #2b7ae2; text-decoration: none; font-size: 18px;">${companyName}</a></p>
                                        <p style="font-size: 12px; color: #777;">此邮件由系统自动发出，请勿直接回复。</p>
                                        <footer style="text-align: center;margin-top: 60px;margin-bottom: -10px;">
                                            <p style="font-size: 12px; color: #777;">© ${new Date().getFullYear()} ${companyName}. All rights reserved.</p>
                                        </footer>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
        </html>
    `;
}



module.exports = {
    resetEmailPasswordTemplate
};