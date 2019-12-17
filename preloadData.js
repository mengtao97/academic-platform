// @ts-check

const preloadData = require('./util/loadData');

const mongoose = require('mongoose');

const PaperSchema = require('./models/Paper');
const ScholarSchema = require('./models/Scholar');

mongoose.connect("mongodb://localhost:27017/scholarly", { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('open', async () => {
    console.log("Connection established.");
    const data = preloadData();
    try {
        await db.collection("paper").drop();
        console.log("Dropped `paper` collection.");
    } catch (err) {
        console.error("Failed to drop Paper, but it might not be a problem.");
    }
    try {
        await db.collection("scholar").drop();
        console.log("Dropped `scholars` collection.")
    } catch (err) {
        console.error("Failed to drop Scholar, but it might not be a problem.");
    }
    try {
        await db.collection("scholars").drop();
        console.log("Dropped `scholars` collection.")
    } catch (err) {
        console.error("Failed to drop Scholars, but it might not be a problem.");
    }
    try {
        await db.collection("papers").drop();
        console.log("Dropped `papers` collection.")
    } catch (err) {
        console.error("Failed to drop Papers, but it might not be a problem.");
    }
    await ScholarSchema.insertMany(data[0]);
    console.log("All the scholars have been imported into the database.");
    await PaperSchema.insertMany(data[1]);
    console.log("All the papers have been imported into the database.");
    db.close();
});
