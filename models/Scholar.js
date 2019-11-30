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
        r: {type: String, ref: 'Paper'},
        i: Number,
    }],
    tags: [String]
});

module.exports = model("Scholar", scholarSchema);