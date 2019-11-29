const { model, Schema } = require("mongoose");

const userSchema = new Schema({
    name: String,
    password: String,
    email: String,
    avatar: String,
    personalProfile: String,
    paperCollection: [String],
    schCollection:[String],
    role: Boolean,
    createdAt: String
});

module.exports = model('User', userSchema);
