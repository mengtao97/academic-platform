const {model, Schema} = require("mongoose");
const mongoosastic = require('mongoosastic')
const scholarSchema = new Schema({
    name: {type: String, es_indexed: true},
    avatar: String,
    orgs: [String],
    nPubs: Number,
    nCitations: Number,
    hIndex: Number,
    bulletin: String,
    pubs: [{
        r: Number,
        i: {type: Schema.Types.ObjectId, ref: 'Paper'},
    }],
    tags: [{
        t: String,
        w: Number,
    }],
    createdAt: String,
    userId: {type: Schema.Types.ObjectId, ref: 'User'}, // uploader
    coauthors: [{
        scholarId: {type: Schema.Types.ObjectId, ref: 'Scholar'},
        h_index: Number,
        n_citation: Number,
        n_pubs: Number,
        name: String,
        orgs: [String],
        papers: [{paperId: {type: Schema.Types.ObjectId, ref: 'Paper'}, title: String}]
    }]
}).plugin(mongoosastic, {hosts: ['localhost:9200']});

module.exports = new model("Scholar", scholarSchema);
