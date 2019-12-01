const Comment = require('../../models/Comment');

module.exports = {
    Query: {
        getComments: async () => await Comment.find(),
        getComment: async (_, {commentId}) => await Comment.findById(commentId),
    },
    Mutation: {
        async createComment(_, {input}) {
            const newComment = new Comment(input);
            return await newComment.save();
        },
        async deleteComment (_, {commentId}) {
            const comment = await Comment.findById(commentId);
            await comment.delete();
            return "Comment deleted successfully";
        },
        async updateComment (_, {commentId, input}) {
            const comment = await Comment.findById(commentId);
            Object.assign(comment, input);
            return await comment.save();
        },
    }
};