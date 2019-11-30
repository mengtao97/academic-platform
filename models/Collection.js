const {model, Schema} = require("mongoose");

const collectionSchema = new Schema({
    scholarId: {type: Schema.Types.ObjectId, ref: 'Scholar'},
    userId: {type: Schema.Types.ObjectId, ref: 'User'},
    createdAt: String,
});

module.exports = model("Collection", collectionSchema);