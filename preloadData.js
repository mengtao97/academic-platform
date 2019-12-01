// @ts-check

const preloadData = require('./util/loadData');

const mongoose = require('mongoose');

const PaperSchema = require('./models/Paper');
const ScholarSchema = require('./models/Scholar');

mongoose.connect("mongodb://localhost:27017/scholar", { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('open', async () => {
    console.log("Connection established.");
    const data = preloadData();
    db.dropCollection("paper");
    db.dropCollection("scholars");
    await PaperSchema.insertMany(data[0]);
    await ScholarSchema.insertMany(data[1]);
    db.close();
});
