const Paper = require('../../models/Paper');

const removeEmpty = obj => {
    Object.keys(obj).forEach(key => obj[key] == null && delete obj[key]);
};

module.exports = {
    Query: {
        getPapers: async () => await Paper.find(),
        getPaper: async (_, {paperId}) => await Paper.findById(paperId),
        findPapersByAuthor: () => {

        },
        findPapersByTitle: () => {

        },
        findPapersByKeywords: () => {

        }
    },
    Mutation: {
        async createPaper(_, {input}) {
            const newPaper = new Paper(input);
            return await newPaper.save();
        },
        deletePaper: async (_, {paperId}) => {
            const paper = await Paper.findById(paperId);
            await paper.delete();
            return "Paper deleted successfully";
        },
        updatePaper: async (_, {paperId, input}) => {
            const paper = await Paper.findById(paperId);
            paper.assign(input);
            return await paper.save();
        },
    }
};