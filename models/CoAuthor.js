const {model, Schema} = require("mongoose");
const coAuthorSchema = new Schema({
    // _id = fromId
    coauthors: [{
        scholarId: {type: Schema.Types.ObjectId, ref: 'Scholar'}, // toId
        h_index: Number,
        n_citation: Number,
        n_pubs: Number,
        name: String,
        orgs: [String],
        papers: [{paperId: {type: Schema.Types.ObjectId, ref: 'Paper'}, title: String}]
    }]
});

module.exports = new model("CoAuthor", coAuthorSchema);