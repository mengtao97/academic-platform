const userResolvers = require('./user')
const paperResolvers = require('./paper')
module.exports = {
    Query:{
        ...paperResolvers.Query,
    },
    Mutation: {
        ...userResolvers.Mutation,
        ...paperResolvers.Mutation
    }
}