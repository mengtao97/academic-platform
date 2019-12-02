const Comment = require('../../models/Comment');

module.exports = {
    Query: {
        Comments: async (_, { id, userId, paperId }) => {
            if (!!id)
                return [await Comment.findById(id)];
            if (!!userId) {
                return await Comment.find({ userId: { $eq: userId } });
            }
            if (!!paperId)
                return await Comment.find({ paperId });
            else
                return Comment.find();
        }
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
        async Comment (_, {commentId, input}) {
            const comment = await Comment.findById(commentId);
            Object.assign(comment, input);
            return await comment.save();
        },
    }
};