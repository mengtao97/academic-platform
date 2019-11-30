const {model, Schema} = require("mongoose");

const itemSchema = new Schema({
    userId: {type: Schema.Types.ObjectId, ref: 'User'},
    title: String,
    abstract: String,
    references: String,
    field: String,
    createdAt: String
});

module.exports = model("Item", itemSchema);
