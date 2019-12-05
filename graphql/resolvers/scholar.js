const {
    UserInputError
} = require("apollo-server-express");

const Scholar = require("../../models/Scholar");

module.exports = {
    Query: {
        Scholars: async (_, {params}) => {
            const keywords = params.trim().split(' ').filter(el => el.length > 0);
            const regex = new RegExp(keywords.join("|"));
            const scholars = await Scholar.find({
                $or: [
                    {name: {$regex: regex, $options: "i"}},
                    {"tags.t": {$regex: regex, $options: "i"}},
                    {orgs: {$in: keywords}}
                ]
            });
            return scholars;
        },
    },
    Mutation: {
        createScholar: async (_, {input}, context) => {
            const user = checkAuth(context);
            const newScholar = new Scholar({
                ...input,
                pubs: [],
                userId: user.id,
                createdAt: new Date().toISOString()
            })
            return await newScholar.save();
        },
        deleteScholar: async (_, {scholarId}, context) => {
            const user = checkAuth(context);
            if (user.username === post.username || user.username === 'admin') {
                const scholar = await Scholar.findById(scholarId);
                await scholar.delete();
                return "Scholar deleted successfully";
            } else {
                throw new AuthenticationError("Action not allowed");
            }
        },
        Scholar: async (_, {scholarId, input}, context) => {
            const user = checkAuth(context);
            if (user.username === post.username || user.username === 'admin') {
                const scholar = await Scholar.findById(scholarId);
                Object.assign(scholar, input);
                return await scholar.save();
            } else {
                throw new AuthenticationError("Action not allowed");
            }
        }
    }
}