const { model, Schema } = require("mongoose");

const authenticationSchema = new Schema({
    userId:{type:String,ref:'User'},
    manaId:{type:String,ref:'User'},
    schoId:{type:String,ref:'User'},
    state:Boolean,
    feedBack:String,
});

module.exports = model("Authentication", authenticationSchema);