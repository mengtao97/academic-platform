const {model, Schema} = require("mongoose");

const userSchema = new Schema({
    name: String,
    password: String,
    email: String,
    avatar: String,
    personalProfile: String,
    paperCollection: [{
        paperId: {type: Schema.Types.ObjectId, ref: 'Paper'},
        createdAt: String
    }],
    schCollection: [{
        scholarId: {type: Schema.Types.ObjectId, ref: 'Scholar'},
        createdAt: String
    }],
    role: Boolean,
    createdAt: String
});

module.exports = model('User', userSchema);
