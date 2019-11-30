const Paper = require('../../models/Paper');

function removeUndefinedKeys(obj) {
    const keys = Object.keys(obj);
    const result = {};
    for (const key of keys) {
        if (obj[key] !== undefined && obj[key] !== null)
            result[key] = obj[key];
    }
    return result;
}

function updateFields(oldObj, newObj) {
    const keys = Object.keys(newObj), oldKeys = Object.keys(oldObj.toObject());
    console.log(oldObj.toObject());
    for (const key of keys) {
        oldObj[key] = newObj[key];
    }
}

module.exports = {
    Query: {
        findPapersByAuthor: () => {

        },
        findPapersByTitle: () => {

        },
        findPapersByKeywords: () => {

        }
    },
    Mutation: {
        async addPaper(
            _, {addPaperInput}, context, info
        ) {
            const par = removeUndefinedKeys(addPaperInput);
            const newpaper = new Paper(par);
            const paper = await newpaper.save();
            return {
                ...paper._doc,
                id: paper._id
            };
        },
        deletePaper: () => {

        }
    }
};