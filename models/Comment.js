const {model, Schema} = require("mongoose");

const commentSchema = new Schema({
    userId: {type: Schema.Types.ObjectId, ref: 'User'},
    paperId: {type: Schema.Types.ObjectId, ref: 'Paper'},
    body: String,
    createdAt: String
});

module.exports = model("Comment", commentSchema);