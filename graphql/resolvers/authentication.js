const Authentication = require('../../models/Authentication');
const { ApolloError } = require("apollo-server");

module.exports = {
    Query: {
        Authentications: async (_, { authenticationId }) => {
            if (!!authenticationId)
                return [await Authentication.findById(authenticationId)]
            else
                return await Authentication.find()
        }
    },
    Mutation: {
        async createAuthentication(_, { params }) {
            const input = {
                ...params,
                createdAt: new Date().getTime().toString()
            };
            const newAuthentication = new Authentication(input);
            return await newAuthentication.save();
        },
        async deleteAuthentication(_, { authenticationId }) {
            // const authentication = await Authentication.findById(authenticationId);
            // await authentication.delete();
            // return "Authentication deleted successfully";
            throw new ApolloError("Test", "UNDER_DEVELOPMENT", {a: "b"});
        },
        async Authentication(_, { authenticationId, input }) {
            const authentication = await Authentication.findById(authenticationId);
            Object.assign(authentication, input);
            return await authentication.save();
        },
    }
};