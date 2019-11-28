const { model, Schema } = require("mongoose");

const messageSchema = new Schema({
    senderId:{type:String,ref:'User'},
    reciverId:{type:String,ref:'User'},
    date:String,
    content:String,
});

module.exports = model("Message", messageSchema);