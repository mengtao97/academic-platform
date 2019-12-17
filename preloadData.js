// @ts-check
const preloadData = require('./util/loadData');
const mongoose = require('mongoose');

const PaperSchema = require('./models/Paper');
const ScholarSchema = require('./models/Scholar');

mongoose.connect("mongodb://localhost:27017/scholarly", { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('open', async () => {
    console.log("Connection established.");

    // preparing...
    try {
        await db.collection("paper").drop();
        console.log("Dropped `paper` collection.");
    } catch (err) {
        console.error("Failed to drop Paper, but it might not be a problem.");
    }

    try {
        await db.collection("scholars").drop();
        console.log("Dropped `scholars` collection.")
    } catch (err) {
        console.error("Failed to drop Scholars, but it might not be a problem.");
    }

    // loading...
    for (let i = 10; i <= 10; ++i) {
        let file_path = "/home/ubuntu/data/author_" + i + ".json"
        let data = preloadData(file_path, 'author')
        for (const item of data) {
            const newScholar = new ScholarSchema(item);
            await newScholar.save();
        }
    }
    console.log("All the scholars have been imported into the database.");

    for (let i = 7; i < 8; ++i) {
        let file_path = "/home/ubuntu/data/papers_" + i + ".json"
        let data = preloadData(file_path, 'paper')
        for (const item of data) {
            const newPaper = new PaperSchema(item);
            await newPaper.save();
        }
    }
    console.log("All the papers have been imported into the database.");
    db.close();
});
