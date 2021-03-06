const { ApolloError } = require("apollo-server-express");

const Comment = require('../../models/Comment');
const checkAuth = require('../../util/check-auth')
const User = require('../../models/User')

module.exports = {
    Query: {
        Comments: async (_, { id, userId, paperId }) => {
            if (!!id)
                return [await Comment.findById(id)];
            if (!!userId) {
                return await Comment.find({ userId: { $eq: userId } });
            }
            if (!!paperId)
                return await Comment.find({ paperId: { $eq: paperId } });
            else
                return null;
        }
    },
    Mutation: {
        createComment: async (_, { params }, context) => {
            const currentId = checkAuth(context).id;
            user = await User.findById(currentId);
            const newComment = new Comment({
                ...params,
                userId: user.id,
                createdAt: new Date().toISOString()
            });
            return await newComment.save();
        },
        deleteComment: async (_, { commentId }, context) => {
            const currentId = checkAuth(context).id;
            const user = await User.findById(currentId);
            const comment = await Comment.findById(commentId);
            if (user.id === comment.userId || user.role === true) {
                await comment.delete();
                return "Comment deleted successfully";
            } else {
                throw new ApolloError("权限不足，不允许进行该操作！");
            }
        },
        updateComment: async (_, { commentId, params }, context) => {
            const currentId = checkAuth(context).id;
            const user = await User.findById(currentId);
            const comment = await Comment.findById(commentId);
            if (user.username === comment.username || user.role === true) {
                Object.assign(comment, params);
                return await comment.save();
            } else {
                throw new ApolloError("权限不足，不允许进行该操作！");
            }
        },
    }
};