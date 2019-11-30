const Collection = require('../../models/Collection');

const removeEmpty = obj => {
    Object.keys(obj).forEach(key => obj[key] == null && delete obj[key]);
};

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
            collection.assign(removeEmpty(input));
            return await collection.save();
        },
    }
};