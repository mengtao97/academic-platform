const { ApolloError } = require("apollo-server-express");

const Paper = require('../../models/Paper');
const Scholar = require('../../models/Scholar');
const Comment = require('../../models/Comment');
const checkAuth = require('../../util/check-auth');
const User = require('../../models/User');
var log4js = require('log4js');
const Recommendation = require('../../util/recommendation')
const { Client } = require('@elastic/elasticsearch')
const client = new Client({ node: 'http://localhost:9200' })

function promisify(fn) {
  const callback = (resolve, reject, err, result) => {
    if (err)
      reject(err);
    else
      resolve(result);
  };
  return (...args) => {
    return new Promise((resolve, reject) => {
      const boundedCallback = callback.bind(null, resolve, reject);
      fn(...args, boundedCallback);
    });
  };
}

module.exports = {
  Query: {
    Papers: async (_, { params, page, perPage }, context) => {
      if (!page)
        page = 1;
      if (!perPage)
        perPage = 20;
      const { body } = await client.search({
        index: 'papers',
        // type: '_doc', // uncomment this line if you are using Elasticsearch ≤ 6
        body: {
          query: {
            match: { title: params.toString() },
          },
          from: (page - 1) * perPage,
          size: perPage,
        }
      })
      const numOfPages = Math.ceil(body.hits.total.value / perPage)
      const ids = body.hits.hits.map(hit => hit._id)

      papers = await Paper.find().where('_id').in(ids).exec();

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
        throw new ApolloError('未找到该学者！');
      const pubs = scholar.pubs;
      const res = [];
      for (let i = 0, len = pubs.length; i < len; i++) {
        paper = await Paper.findById(pubs[i].i);
        if (paper)
          res.push(paper);
      }
      return res;
    },
    recommendation: async (_, __, context) => {
      let currentId;
      try {
        currentId = checkAuth(context).id;
      } catch (err) {
        currentId = null;
      }
      const recommend = promisify(Recommendation);
      const recommendations = await recommend(currentId);
      let paperId = []
      let papers = [];
      for (item of recommendations) {
        const { body } = await client.search({
          index: 'papers',
          body: {
            query: {
              match: { title: item[0].toString() },
            }
          }
        })
        let ids = body.hits.hits.map(hit => hit._id);
        for (let id of ids) {
          if (!paperId.includes(id))
            paperId.push(id);
        }
        //paperId.push(apply(paperId, body.hits.hits.map(hit => hit._id)));
      }
      if (paperId.length < 4) {
        for (let i = 0; i < paperId.length; i++) {
          papers.push(await Paper.findById(paperId[i]));
        }
      } else {
        for (let i = 0; i < 4; i++) {
          papers.push(await Paper.findById(paperId[Math.floor(Math.random() * (paperId.length + 1))]));
        }
      }
      return papers;
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
    favorite: async (_, { paperId }, context) => {
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