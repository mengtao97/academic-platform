const authenticationResolvers = require('./authentication');
const commentResolvers = require('./comment');
const messageResolvers = require('./message');
const paperResolvers = require('./paper');
const scholarResolvers = require('./scholar');
const userResolvers = require('./user');

module.exports = {
    Query: {
        ...authenticationResolvers.Query,
        ...commentResolvers.Query,
        ...messageResolvers.Query,
        ...paperResolvers.Query,
        ...scholarResolvers.Query,
        ...userResolvers.Query,
    },
    Mutation: {
        ...authenticationResolvers.Mutation,
        ...commentResolvers.Mutation,
        ...messageResolvers.Mutation,
        ...paperResolvers.Mutation,
        ...scholarResolvers.Mutation,
        ...userResolvers.Mutation,
    }
}