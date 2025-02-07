// mail.js
const { get_env_config, load_env_config } = require("../../../conf/env_config");
//加载环境变量
load_env_config();
//加载环境变量完毕后，加载配置
const conf = get_env_config()
const nodemailer = require('nodemailer');
const nodemailerSmtpTransport = require('nodemailer-smtp-transport');
const {
    tlConsole
} = require("../utils");


/**
 * 发送邮件
 * @param {string} to - 收件人的邮箱地址
 * @param {string} subject - 邮件主题
 * @param {string} text - 邮件文本内容
 * @param {string} html - 邮件HTML内容（可选）
 * @returns {Promise} - 返回一个Promise对象，表示发送邮件的结果
 */
async function sendEmail({ to, subject, text, html }) {
    try {
        // 创建一个SMTP传输器对象
        let transporter = nodemailer.createTransport({
            host: conf.mail_host, // SMTP服务器地址
            port: conf.mail_port, // SMTP服务端口
            secure: true, // true表示使用SSL，false表示使用TLS
            auth: {
                user: conf.mail_user, // 发件人邮箱
                pass: conf.mail_password // 授权码
            },
        });

        // 发送邮件
        let info = await transporter.sendMail({
            from: conf.mail_user, // 发件人邮箱
            to: to,
            subject: subject,
            text: text,
            html: html
        });

        tlConsole('发送邮件结果: %s', info.messageId);

        return info;
    } catch (error) {
        tlConsole('发送邮件异常:', error);
        return null;
    }
}

/**
 * 验证码邮件模版
 * @param {string} code - 验证码
 * @param {number} expire - 验证码的有效时间（单位：分钟）
 * @param {string} company - 团队名称
 * @param {string} companyUrl - 团队网址
 * @returns {string} - 返回邮件的HTML内容
 */
const emailTemplate = function({
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

/**
 * 发送验证码邮件
 * @param {string} to - 收件人的邮箱地址
 * @param {string} code - 验证码
 * @param {number} expire - 验证码的有效时间（单位：分钟）
 * @param {string} companyName - 团队名称
 * @param {string} companyUrl - 团队网址
 * @returns {Promise} - 返回一个Promise对象，表示发送邮件的结果
 */
async function sendVerificationCodeEmail({ to, code, expire, companyName, companyUrl }) {
    let html = emailTemplate({
        code,
        expire,
        companyName,
        companyUrl
    });

    return await sendEmail({
        to,
        subject: '邮箱验证',
        text: `您的验证码是：${code}，有效时间为 ${expire} 分钟。`,
        html
    });
}


module.exports = {
    sendEmail,
    sendVerificationCodeEmail
};