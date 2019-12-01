const {
    UserInputError
} = require("apollo-server-express");

const Scholar = require("../../models/Scholar");

const removeEmpty = obj => {
    Object.keys(obj).forEach(key => obj[key] == null && delete obj[key]);
};

module.exports = {
    Query: {
        getScholars: async () => await Scholar.find(),
        getScholar: async (_, {scholarId}) => await Scholar.findById(scholarId)
    },
    Mutation: {
        createScholar: async (_, {input}) => {
            const newScholar = new Scholar({
                ...input,
                pubs: [],
                createdAt: new Date().toISOString()
            })
            return await newScholar.save();
        },
        deleteScholar: async (_, {scholarId}) => {
            const scholar = await Scholar.findById(scholarId);
            await scholar.delete();
            return "Scholar deleted successfully";
        },
        updateScholar: async (_, {scholarId, input}) => {
            const scholar = await Scholar.findById(scholarId);
            Object.assign(scholar, input);
            return await scholar.save();
        }
    }
}