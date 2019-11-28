const { model, Schema } = require('mongoose');

const paperSchema = new Schema({
    title: String,
    authors: [{ id: { type: String, ref: 'Scholar' } }],
    keywords: [String],
    lang: String,
    nCititation: Number,
    pageEnd: Number,
    pageStart: Number,
    venue: String,
    year: Number,
    volume: Number,
    issue: Number,
    doi: String,
    abstract: String,
});


module.exports = new model("Paper", paperSchema) 