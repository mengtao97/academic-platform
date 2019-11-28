const { model, Schema } = require("mongoose");

const commentSchema = new Schema({
    userId:{type:String,ref:'User'},
    itemId:{type:String,ref:'Paper'},
    content:String,
    date:String
});

module.exports = model("Comment", authenticationSchema);