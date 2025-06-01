// mail.js
const { get_env_config } = require("../../../conf/env_config");
//加载环境变量完毕后，加载配置
const conf = get_env_config()
const nodemailer = require('nodemailer');
const nodemailerSmtpTransport = require('nodemailer-smtp-transport');
const {
    tlConsole
} = require("../utils");
const {
    emailCodeTemplate
} = require('./code_template');
const {
    resetEmailPasswordTemplate
} = require('./reset_password_template');


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

        tlConsole('发送邮件结果: %s', info.messageId, text);

        return info;
    } catch (error) {
        tlConsole('发送邮件异常:', error);
        return null;
    }
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
    let html = emailCodeTemplate({
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

/**
 * 发送重置密码邮件
 * @param {string} to - 收件人的邮箱地址
 * @param {string} password - 新密码
 * @param {string} companyName - 团队名称
 * @param {string} companyUrl - 团队网址
 * @returns {Promise} - 返回一个Promise对象，表示发送邮件的结果
 */
async function sendResetPasswordEmail({ to, password, expire, companyName, companyUrl }) {
    let html = resetEmailPasswordTemplate({
        password,
        companyName,
        companyUrl
    });

    return await sendEmail({
        to,
        subject: '重置邮箱密码',
        text: `您的新密码是：${password}，请勿泄露给他人，并尽快登陆修改密码。`,
        html
    });
}


module.exports = {
    sendEmail,
    sendVerificationCodeEmail,
    sendResetPasswordEmail
};