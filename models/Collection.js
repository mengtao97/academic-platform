const { model, Schema } = require("mongoose");

const collectionSchema = new Schema({
    schId:{type:String,ref:'Scholar'},
    useId:{type:String,ref:'User'},
    date:String,
});

module.exports = model("Collection", collectionSchema);