
/**
 * 验证码邮件模版
 * @param {string} code - 验证码
 * @param {number} expire - 验证码的有效时间（单位：分钟）
 * @param {string} company - 团队名称
 * @param {string} companyUrl - 团队网址
 * @returns {string} - 返回邮件的HTML内容
 */
const emailCodeTemplate = function({
    code, expire, companyName, companyUrl
}) {
    return `
        <!DOCTYPE html>
        <html lang="zh-CN">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>验证码</title>
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
                                        <p>感谢您使用我们的服务。为了验证您的邮箱地址，请在页面中输入以下验证码：</p>
                                        <p style="font-size: 24px; font-weight: bold; color: #000;background: white;text-align: center;">${code}</p>
                                        <p>请注意：该验证码将在 <strong>${expire}分钟</strong> 内有效。</p>
                                        <br>
                                        <p>请勿将此验证码透露给他人。</p>
                                        <p>如果您未请求此验证码，请忽略此邮件。</p>
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
    emailCodeTemplate
};