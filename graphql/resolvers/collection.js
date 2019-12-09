const Collection = require('../../models/Collection');
var log4js = require('log4js');
log4js.configure({
    appenders: {
      out: { type: 'stdout' },
      app: { type: 'dateFile',
             filename: 'log/collection/collection',
             pattern: 'yyyy-MM-dd.log',
             alwaysIncludePattern: true }
    },
    categories: {
      default: { appenders: [ 'out', 'app' ], level: 'trace' }
    }
  });
var logger = log4js.getLogger('COLLECT');
logger.level = 'trace';
module.exports = {
    Query: {
        Collections: async (_, { id, userId, paperId }) => {
            if (!!id)
                return [await Collection.findById(id)];
            if (!!userId) {
                return await Collection.find({ userId: { $eq: userId } });
            }
            if (!!paperId)
                return await Collection.find({ paperId });
            else
                return Collection.find();
        }
    },
    Mutation: {
        async createCollection(_, { params }) {
            const input = {
                ...params,
                createdAt: new Date().toISOString()
            };
            const newCollection = new Collection(input);
            logger.trace("Created Collection: " + input + " by: (need token).");
            return await newCollection.save();
        },
        async deleteCollection(_, { id }) {
            const collection = await Collection.findById(id);
            await collection.delete();
            return "Collection deleted successfully";
        },
    }
};