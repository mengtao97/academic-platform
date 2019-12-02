const Collection = require('../../models/Collection');

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
                createdAt: new Date().getTime().toString()
            };
            const newCollection = new Collection(input);
            return await newCollection.save();
        },
        async deleteCollection(_, { id }) {
            const collection = await Collection.findById(id);
            await collection.delete();
            return "Collection deleted successfully";
        },
    }
};