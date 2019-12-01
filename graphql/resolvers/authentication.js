const Authentication = require('../../models/Authentication');

module.exports = {
    Query: {
        getAuthentications: async () => await Authentication.find(),
        getAuthentication: async (_, {authenticationId}) => await Authentication.findById(authenticationId),
    },
    Mutation: {
        async createAuthentication(_, {input}) {
            const newAuthentication = new Authentication(input);
            return await newAuthentication.save();
        },
        async deleteAuthentication (_, {authenticationId}) {
            const authentication = await Authentication.findById(authenticationId);
            await authentication.delete();
            return "Authentication deleted successfully";
        },
        async updateAuthentication (_, {authenticationId, input}) {
            const authentication = await Authentication.findById(authenticationId);
            Object.assign(authentication, input);
            return await authentication.save();
        },
    }
};