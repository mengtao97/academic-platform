const {model, Schema} = require("mongoose");
const mongoosastic = require('mongoosastic')
const userSchema = new Schema({
    name: {type:String,es_indexed:true},
    password: String,
    email: String,
    avatar: String,
    personalProfile: String,
    paperCollection: [{
        paperId: {type: Schema.Types.ObjectId, ref: 'Paper'},
        createdAt: String
    }],
    schCollection: [{
        scholarId: {type: Schema.Types.ObjectId, ref: 'Scholar'},
        createdAt: String
    }],
    role: Boolean,
    createdAt: String
}).plugin(mongoosastic,{hosts: ['localhost:9200']});

module.exports = model('User', userSchema);
