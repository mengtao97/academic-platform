const {
    AuthenticationError,
    UserInputError
} = require("apollo-server-express");

const Paper = require('../../models/Paper');
const Scholar = require('../../models/Scholar');

var log4js = require('log4js');
log4js.configure({
    appenders: {
      out: { type: 'stdout' },
      app: { type: 'dateFile',
             filename: 'log/paper/paper',
             pattern: 'yyyy-MM-dd.log',
             alwaysIncludePattern: true }
    },
    categories: {
      default: { appenders: [ 'out', 'app' ], level: 'trace' }
    }
  });
var logger = log4js.getLogger('PAPER');
logger.level = 'trace';

module.exports = {
    Query: {
        Papers: async (_, { params, offset, limit }) => {
            const keywords = params.trim().split(' ').filter(el => el.length > 0);
            const regex = new RegExp(keywords.join("|"));
            const papers = await Paper.find({
                $or: [
                    { title: { $regex: regex, $options: "i" } },
                    { venue: { $regex: regex, $options: "i" } },
                    { "authors.name": { $in: keywords } },
                    { keywords: { $in: keywords } }
                ]
            }).skip(offset).limit(limit);
            logger.trace("Query on paper with: \"" + keywords + "\" by: (need token).");
            return papers;
        },
        searchPapersByScholarId: async (_, { scholarId }) => {
            const scholar = await Scholar.findById(scholarId);
            if (!scholar)
                return null;//need error : can't find the scholar
            const pubs = scholar.pubs;
            const res = [];
            for (let i = 0, len = pubs.length; i < len; i++) {
                paper = await Paper.findById(pubs[i].i);
                if (paper)
                    res.push(paper);
            };
            logger.trace("Query on paper with ScholarID:" + scholarId + " by: (need token).");
            return res;
        },
        // TODO 精确查找
        filterPapers: async (_, { title, vuenue, author, keyword }, ) => {
            const papers = await Paper.find({
                $where: function () {
                    return (this.title === "2011年欧洲器官移植年会肾移植研究热点荟萃")
                }
            });
            return papers;
        },
    },
    Mutation: {
        async createPaper(_, { params }, context) {
            const user = checkAuth(context);
            const newPaper = new Paper({
                ...params,
                userId: user.id,
                createdAt: new Date().toISOString()
            });
            return await newPaper.save();
        },
        async deletePaper(_, { paperId }, context) {
            const user = checkAuth(context);
            if (user.username === post.username || user.username === 'admin') {
                const paper = await Paper.findById(paperId);
                await paper.delete();
                return "Paper deleted successfully";
            } else {
                throw new AuthenticationError("Action not allowed");
            }
        },
        async updatePaper(_, { paperId, input }, context) {
            const user = checkAuth(context);
            if (user.username === post.username || user.username === 'admin') {
                const paper = await Paper.findById(paperId);
                Object.assign(paper, input);
                return await paper.save();
            } else {
                throw new AuthenticationError("Action not allowed");
            }
        },
    }
};