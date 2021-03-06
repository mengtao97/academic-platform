const {model, Schema} = require("mongoose");

const messageSchema = new Schema({
    senderId: {type: Schema.Types.ObjectId, ref: 'User'},
    receiverId: {type: Schema.Types.ObjectId, ref: 'User'},
    type:String,
    content: String,
    createdAt: String
});

module.exports = model("Message", messageSchema);