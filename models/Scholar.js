const { model, Schema } = require("mongoose");

const scholarSchema = new Schema({
    name: String,
    avatar: String,
    orgs: [String],
    nPubs: Number,
    nCitations: Number,
    researchField: [String],
    hIndex: Number,
    pubs: [{
        r: Number,
        i: { type: Schema.Types.ObjectId, ref: 'Paper' },
    }],
    tags: [{
        t: String,
        w: Number,
    }],
    createdAt: String,
    userId: {type: Schema.Types.ObjectId, ref: 'User'} // uploader
});

module.exports = new model("scholar", scholarSchema);
