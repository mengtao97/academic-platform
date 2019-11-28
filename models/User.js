const { model, Schema } = require("mongoose");

const userSchema = new Schema({
    name: String,
    password: String,
    email: String,
    avatar: String,
    personal_profile: String,
    favorites: [String],  
    role: Boolean
});

module.exports = model("User", userSchema);
