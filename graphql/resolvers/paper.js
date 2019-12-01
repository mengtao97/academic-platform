const Paper = require('../../models/Paper');

module.exports = {
    Query: {
        getPapers: async () => await Paper.find(),
        getPaper: async (_, {paperId}) => await Paper.findById(paperId),
    },
    Mutation: {
        async createPaper(_, {input}) {
            const newPaper = new Paper(input);
            return await newPaper.save();
        },
        async deletePaper (_, {paperId}) {
            const paper = await Paper.findById(paperId);
            await paper.delete();
            return "Paper deleted successfully";
        },
        async updatePaper (_, {paperId, input}) {
            const paper = await Paper.findById(paperId);
            Object.assign(paper, input);
            return await paper.save();
        },
    }
};