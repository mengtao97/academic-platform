
const Authentication = require('../../models/Authentication');
const { ApolloError } = require("apollo-server");
const checkAuth = require('../../util/check-auth')
const User = require('../../models/User')
const Scholar = require('../../models/Scholar')

const nodemailer = require('nodemailer')

const config = {
    host: 'smtp.qq.com',
    secure: false,
    host: 'smtp.qq.com',
    port: 587,
    auth: {
        user: '962217260@qq.com',
        pass: 'hwwbuebetrozbbec'
    }
};

const transporter = nodemailer.createTransport(config);

module.exports = {
    Query: {
        Authentications: async (_, { authenticationId }) => {
            if (!!authenticationId)
                return [await Authentication.findById(authenticationId).sort({ createdAt: -1 })]
            else
                return await Authentication.find()
        }
    },
    Mutation: {
        async createAuthentication(_, { scholarId, content }, context) {
            const currentId = checkAuth(context).id;
            const user = await User.findById(currentId);
            if (!user)
                throw new ApolloError("你必须登录才能申请！");
            const input = {
                scholarId: scholarId,
                content: content,
                state: 0,
                userId: user.id,
                createdAt: new Date().toISOString(),
                isAlive: false
            };
            const newAuthentication = new Authentication(input);
            await newAuthentication.save();
            return newAuthentication;
        },
        deleteAuthentication: async (_, { authenticationId }, context) => {
            const currentId = checkAuth(context).id;
            const isRoot = !!((await User.findById(currentId)).role);
            const authentication = Authentication.findById(authenticationId);
            if (isRoot && authentication) {
                await Authentication.deleteOne(authentication);
                return true
            } else
                throw new ApolloError('权限不足或用户不存在！')
        },
        async updateAuthentication(_, { authenticationId, decision }, context) {
            const currentId = checkAuth(context).id;
            const isRoot = !!((await User.findById(currentId)).role);
            const authentication = await Authentication.findById(authenticationId);
            const user = await User.findById(authentication.userId);
            if (isRoot && authentication && authentication.state === 0) {
                if (decision === true) {
                    const scholar = await Scholar.findById(authentication.scholarId);
                    if (scholar) {
                        scholar.userId = authentication.userId;
                        authentication.state = 1;
                        authentication.managerId = currentId;
                        await authentication.save();
                        await scholar.save();
                        const email = {
                            from: '962217260@qq.com',
                            subject: '认领通知',
                            to: user.email,
                            text: "您已通过验证，请查看个人主页！"
                        };
                        transporter.sendMail(email);
                        return authentication;
                    } else
                        throw new ApolloError("学者主页不存在！")
                } else {
                    authentication.managerId = currentId;
                    authentication.state = -1;
                    await authentication.save();
                    const email = {
                        from: '962217260@qq.com',
                        subject: '认领通知',
                        to: user.email,
                        text: "您未通过验证！"
                    };
                    transporter.sendMail(email);
                    return authentication;
                }
            } else
                throw new ApolloError('更新失败，可能是审核或申请不存在！')
        },
    }
}