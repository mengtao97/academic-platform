const Paper = require('../../models/Paper');

module.exports = {
    Query: {
        Papers: async (_, { params }) => {
            const keywords = params.trim().split(' ').filter(el => el.length > 0);
            const regex = new RegExp(keywords.join("|"));
            const papers = await Paper.find({
                $or: [
                    { title: { $regex: regex, $options: "i" } },
                    { venue: { $regex: regex, $options: "i" } },
                    { authors: { $in: keywords } },
                    { keywords: { $in: keywords } }
                ]
            });
            return papers;
        },
        // TODO 精确查找
        getPapers: async () => await Paper.find(),
    },
    Mutation: {
        async createPaper(_, { params }) {
            const newPaper = new Paper(params);
            return await newPaper.save();
        },
        async deletePaper(_, { paperId }) {
            const paper = await Paper.findById(paperId);
            await paper.delete();
            return "Paper deleted successfully";
        },
        async updatePaper(_, { paperId, input }) {
            const paper = await Paper.findById(paperId);
            Object.assign(paper, input);
            return await paper.save();
        },
    }
};