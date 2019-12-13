const {model, Schema} = require('mongoose');

const paperSchema = new Schema({
    title: String,
    authors: [{id: {type: Schema.Types.ObjectId, ref: 'Scholar'}, name: String}],
    keywords: [String],
    lang: String,
    nCitation: Number,
    pageEnd: String,
    pageStart: String,
    venue: String,
    year: Number,
    volume: String,
    issue: String,
    doi: String,
    abstract: String,
    createdAt: String,
    userId: {type: Schema.Types.ObjectId, ref: 'User'} // uploader
});

module.exports = new model("paper", paperSchema);