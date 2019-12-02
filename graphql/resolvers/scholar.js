const {
    UserInputError
} = require("apollo-server-express");

const Scholar = require("../../models/Scholar");

module.exports = {
    Query: {
        Scholars: async (_, { params }) => {
            const keywords = params.trim().split(' ').filter(el => el.length > 0);
            const regex = new RegExp(keywords.join("|"));
            const scholars = await Scholar.find({
                $or: [
                    { name: { $regex: regex, $options: "i" } },
                    { "tags.t": { $regex: regex, $options: "i" } },
                    { orgs: { $in: keywords } }
                ]
            });
            return scholars;
        },
    },
    Mutation: {
        createScholar: async (_, { input }) => {
            const newScholar = new Scholar({
                ...input,
                pubs: [],
                createdAt: new Date().toISOString()
            })
            return await newScholar.save();
        },
        deleteScholar: async (_, { scholarId }) => {
            const scholar = await Scholar.findById(scholarId);
            await scholar.delete();
            return "Scholar deleted successfully";
        },
        Scholar: async (_, { scholarId, input }) => {
            const scholar = await Scholar.findById(scholarId);
            Object.assign(scholar, input);
            return await scholar.save();
        }
    }
}