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
        deleteAuthentication: async(_,{authenticationId},context) =>{
            const currentId = checkAuth(context).id;
            const isRoot = !!((await User.findById(currentId)).role);
            const authentication = Authentication.findById(authenticationId);
            if(isRoot && authentication){
                await Authentication.deleteOne(authentication);
                return true
            }else
                throw new ApolloError('权限不足或用户不存在！')
        },
        async updateAuthentication(_, {authenticationId, input}, context) {
            
        },
    }
};