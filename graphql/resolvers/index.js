const userResolvers = require('./user');
const paperResolvers = require('./paper');
const scholarResolvers = require('./scholar');

module.exports = {
    Query: {
        ...paperResolvers.Query,
        ...scholarResolvers.Query
    },
    Mutation: {
        ...userResolvers.Mutation,
        ...paperResolvers.Mutation,
        ...scholarResolvers.Mutation
    }
}