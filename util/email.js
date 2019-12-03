const nodemailer = require('nodemailer')

const config = {
    host:'smtp.qq.com',
    port:25,
    auth: {
        user: '962217260@qq.com',
        pass: 'hwwbuebetrozbbec'
     }
};

const transporter = nodemailer.createTransport(config);

module.exports = function (mail) {
    transporter.sendMail(mail,function(error,info){
    });
};

var mail = {
    // 发件人
    from: '962217260@qq.com',
    // 主题
    subject: '测试',
    // 收件人
    to: '1781440864@qq.com',
    // 邮件内容，HTML格式
    text: '点击激活：xxx' //接收激活请求的链接
};
transporter.sendMail(mail);