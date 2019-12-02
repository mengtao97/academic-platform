const authenticationResolvers = require('./authentication');
const collectionResolvers = require('./collection');
const commentResolvers = require('./comment');
const messageResolvers = require('./message');
const paperResolvers = require('./paper');
const scholarResolvers = require('./scholar');
const userResolvers = require('./user');

module.exports = {
    Query: {
        ...authenticationResolvers.Query,
        ...collectionResolvers.Query,
        ...commentResolvers.Query,
        ...messageResolvers.Query,
        ...paperResolvers.Query,
        ...scholarResolvers.Query,
        ...userResolvers.Query,
    },
    Mutation: {
        ...authenticationResolvers.Mutation,
        ...collectionResolvers.Mutation,
        ...commentResolvers.Mutation,
        ...messageResolvers.Mutation,
        ...paperResolvers.Mutation,
        ...scholarResolvers.Mutation,
        ...userResolvers.Mutation
    }
}