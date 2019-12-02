const {model, Schema} = require("mongoose");

const collectionSchema = new Schema({
    paperId: {type: Schema.Types.ObjectId, ref: 'Paper'},
    userId: {type: Schema.Types.ObjectId, ref: 'User'},
    createdAt: String,
});

module.exports = model("Collection", collectionSchema);