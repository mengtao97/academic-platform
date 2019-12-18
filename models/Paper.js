const { model, Schema } = require('mongoose');
const mongoosastic = require('mongoosastic')
const paperSchema = new Schema({
    title: { type: String, es_indexed: true },
    authors: [{ id: { type: Schema.Types.ObjectId, ref: 'Scholar' }, name: String, active: Boolean }],
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
    url: [String],
    userId: { type: Schema.Types.ObjectId, ref: 'User' },// uploader
    pdf: String
}).plugin(mongoosastic, { hosts: ['localhost:9200'] });

module.exports = new model("Paper", paperSchema);