const { model, Schema } = require('mongoose');

const paperSchema = new Schema({
    title: String,
    authors: [{ id: { type: Schema.Types.ObjectId, ref: 'Scholar' }, name: String }],
    keywords: [String],
    lang: String,
    nCititation: Number,
    pageEnd: String,
    pageStart: String,
    venue: String,
    year: Number,
    volume: String,
    issue: String,
    doi: String,
    abstract: String,
    createdAt: String
});

module.exports = new model("paper", paperSchema);