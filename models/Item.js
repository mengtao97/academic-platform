const { model, Schema } = require("mongoose");

const itemSchema = new Schema({
    Sch_name: String,
    title: String,
    abstract: String,
    references: String,
    field: String
});

module.exports = model("Item", itemSchema);
