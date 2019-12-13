const Authentication = require('../../models/Authentication');
const {ApolloError} = require("apollo-server");

module.exports = {
    Query: {
        Authentications: async (_, {authenticationId}) => {
            if (!!authenticationId)
                return [await Authentication.findById(authenticationId)]
            else
                return await Authentication.find()
        }
    },
    Mutation: {
        async createAuthentication(_, {params}, context) {
            const user = checkAuth(context);
            const input = {
                ...params,
                userId: user.id,
                createdAt: new Date().toISOString()
            };
            const newAuthentication = new Authentication(input);
            return await newAuthentication.save();
        },
        async deleteAuthentication(_, {authenticationId}, context) {
            const user = checkAuth(context);
            // const authentication = await Authentication.findById(authenticationId);
            // await authentication.delete();
            // return "Authentication deleted successfully";
            throw new ApolloError("Test", "UNDER_DEVELOPMENT", {a: "b"});
        },
        async updateAuthentication(_, {authenticationId, input}, context) {
            const user = checkAuth(context);
            if (user.username == post.username || user.role == true) {
                const authentication = await Authentication.findById(authenticationId);
                Object.assign(authentication, input);
                return await authentication.save();
            } else {
                throw new ApolloError("权限不足，不允许进行该操作！");
            }
        },
    }
};