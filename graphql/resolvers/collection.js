const Collection = require('../../models/Collection');

module.exports = {
    Query: {
        getCollections: async () => await Collection.find(),
        getCollection: async (_, {collectionId}) => await Collection.findById(collectionId),
    },
    Mutation: {
        async createCollection(_, {input}) {
            const newCollection = new Collection(input);
            return await newCollection.save();
        },
        async deleteCollection (_, {collectionId}) {
            const collection = await Collection.findById(collectionId);
            await collection.delete();
            return "Collection deleted successfully";
        },
        async updateCollection (_, {collectionId, input}) {
            const collection = await Collection.findById(collectionId);
            Object.assign(collection, input);
            return await collection.save();
        },
    }
};