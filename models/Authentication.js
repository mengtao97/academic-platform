const { model, Schema } = require("mongoose");

const authenticationSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    managerId: { type: Schema.Types.ObjectId, ref: 'User' },
    scholarId: { type: Schema.Types.ObjectId, ref: 'User' },
    state: String,
    content: String,
    createdAt: String,
    code: String,
    isAlive: Boolean,
});

module.exports = model("Authentication", authenticationSchema);