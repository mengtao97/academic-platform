const {ApolloError} = require("apollo-server-express");

const Comment = require('../../models/Comment');

var log4js = require('log4js');
log4js.configure({
    appenders: {
      out: { type: 'stdout' },
      app: { type: 'dateFile',
             filename: 'log/comment/comment',
             pattern: 'yyyy-MM-dd.log',
             alwaysIncludePattern: true }
    },
    categories: {
      default: { appenders: [ 'out', 'app' ], level: 'trace' }
    }
  });
var logger = log4js.getLogger('COMMENT');
logger.level = 'trace';

module.exports = {
    Query: {
        Comments: async (_, { id, userId, paperId }) => {
            if (!!id)
                return [await Comment.findById(id)];
            if (!!userId) {
                return await Comment.find({ userId: { $eq: userId } });
            }
            if (!!paperId)
                return await Comment.find({ paperId:{ $eq: paperId} });
            else
                return null;
        }
    },
    Mutation: {
        async createComment(_, {input}, context) {
            const currentId = checkAuth(context).id;
            user = await User.findById(currentId); 
            const newComment = new Comment({
                ...input,
                userId: user.id,
                createdAt: new Date().toISOString()
            });
            return await newComment.save();
        },
        async deleteComment (_, {commentId}, context) {
            const currentId = checkAuth(context).id;
            const user = await User.findById(currentId); 
            if (user.username === post.username || user.role === true) {
                const comment = await Comment.findById(commentId);
                await comment.delete();
                return "Comment deleted successfully";
            } else {
                throw new ApolloError("权限不足，不允许进行该操作！");
            }
        },
        async updateComment (_, {commentId, input}, context) {
            const currentId = checkAuth(context).id;
            const user = await User.findById(currentId);
            if (user.username === post.username || user.role === true) {
                const comment = await Comment.findById(commentId);
                Object.assign(comment, input);
                return await comment.save();
            } else {
                throw new ApolloError("权限不足，不允许进行该操作！");
            }
        },
    }
};