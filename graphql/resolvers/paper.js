const Paper = require('../../models/Paper');

const removeEmpty = obj => {
    Object.keys(obj).forEach(key => obj[key] == null && delete obj[key]);
};

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
            paper.assign(removeEmpty(input));
            return await paper.save();
        },
    }
};