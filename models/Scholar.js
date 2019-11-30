const {model, Schema} = require("mongoose");

const scholarSchema = new Schema({
    name: String,
    avatar: String,
    orgs: String,
    nPubs: Number,
    nCitations: Number,
    researchField: [String],
    hIndex: Number,
    pubs: [{
        r: {type: Schema.Types.ObjectId, ref: 'Paper'},
        i: Number,
    }],
    tags: [String],
    createdAt: String
});

module.exports = model("Scholar", scholarSchema);