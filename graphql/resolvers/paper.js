const { ApolloError } = require("apollo-server-express");

const Paper = require('../../models/Paper');
const Scholar = require('../../models/Scholar');
const Comment = require('../../models/Comment');
const checkAuth = require('../../util/check-auth')
const User = require('../../models/User')
var log4js = require('log4js');
/*log4js.configure({
    appenders: {
        out: {type: 'stdout'},
        app: {
            type: 'dateFile',
            filename: 'log/paper/paper',
            pattern: 'yyyy-MM-dd.log',
            alwaysIncludePattern: true
        }
    },
    categories: {
        default: {appenders: ['out', 'app'], level: 'trace'}
    }
});
var logger = log4js.getLogger('PAPER');
logger.level = 'trace';*/

module.exports = {
    Query: {
        Papers: async (_, { params, page, perPage }, context) => {
            if (!page)
                page = 1;
            if (!perPage)
                perPage = 20;
            const keywords = params.trim().split(' ').filter(el => el.length > 0);
            const regex = new RegExp(keywords.join("|"));
            const query = await Paper.find({ title: { $regex: regex, $options: "i" } });
            const numOfPages = Math.ceil(query.length / perPage);
            //console.log(Math.ceil(query.length / perPage))
            const papers = await Paper.find({
                title: {
                    $regex: regex,
                    $options: "i"
                }
            }).skip((page - 1) * perPage).limit(perPage);

            var token = null;
            if (context.req.headers.authorization != null) {
                const val = checkAuth(context);
                token = val.id;
            }
            log4js.configure({
                appenders: {
                    out: { type: 'stdout' },
                    app: {
                        type: 'dateFile',
                        filename: "log/paper/" + token,
                        pattern: 'yyyy-MM.log',
                        alwaysIncludePattern: true
                    }
                },
                categories: {
                    default: { appenders: ['out', 'app'], level: 'trace' }
                }
            });
            var logger = log4js.getLogger('PAPER');
            logger.level = 'trace';
            logger.trace("Query on paper with: \"" + params + "\" by: " + token);
            return { papers, numOfPages };
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
            }
            ;
            //logger.trace("Query on paper with ScholarID:" + scholarId + " by: (need token).");
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
        isFavorite: async (_, { paperId }, context) => {

        },
        getPaperById: async (_, { paperId }) => {
            const paper = await Paper.findById(paperId);
            if (paper) {
                const comments = await Comment.find({ paperId: paperId });
                const patchedComments = [];
                for (const item of comments) {
                    const user = await User.findById(item.userId);
                    patchedComments.push({
                        ...item._doc,
                        author: {
                            id: user.id,
                            avatar: user.avatar,
                            name: user.name
                        }
                    })
                }
                return {
                    currentPaper: paper,
                    comments: patchedComments,
                    relatedWorks: []
                }
            } else throw new Error("Paper not found.");
        }
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
<<<<<<< HEAD
        favorite: async (_, {paperId}, context) => {
=======
        async deletePaper(_, { paperId }, context) {
            const user = checkAuth(context);
            if (user.username === post.username || user.username === 'admin') {
                const paper = await Paper.findById(paperId);
                await paper.delete();
                return "Paper deleted successfully";
            } else {
                throw new ApolloError("权限不足，不允许进行该操作！");
            }
        },
        async updatePaper(_, { paperId, input }, context) {
            const user = checkAuth(context);
            if (user.username === post.username || user.username === 'admin') {
                const paper = await Paper.findById(paperId);
                Object.assign(paper, input);
                return await paper.save();
            } else {
                throw new ApolloError("权限不足，不允许进行该操作！");
            }
        },
        favorite: async (_, { paperId }, context) => {
>>>>>>> 49083916999ed1b2420c323efad3bda506338ec4
            const currentId = checkAuth(context).id;
            const user = await User.findById(currentId);
            const paper = await Paper.findById(paperId);
            if (user.paperCollection.find(item => {
                return item.paperId == paperId
            })) {
                user.paperCollection = user.paperCollection.filter(item => item.paperId != paperId);
            } else {
                user.paperCollection.push({
                    paperId,
                    createdAt: new Date().toISOString()
                });
            }
            await user.save();
            return user;
        }

    }
};