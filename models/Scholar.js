const {model, Schema} = require("mongoose");

const scholarSchema = new Schema({
    name: String,
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
        papers: [{type: Schema.Types.ObjectId, ref: 'Paper'}]
    }]
});

module.exports = new model("scholar", scholarSchema);
