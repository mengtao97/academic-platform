// @ts-check
const mongoose = require('mongoose');

const coAuthorSchema = require('../models/CoAuthor')

const {chain} = require("stream-chain");
const {parser} = require("stream-json");
const {streamObject} = require('stream-json/streamers/StreamObject');
const fs = require("fs");

mongoose.connect("mongodb://localhost:27017/scholarly", {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('open', async () => {
    const loadData = (filePath) => {
        const pipeline = chain([
            fs.createReadStream(filePath),
            parser(),
            streamObject(),
            data => data
        ]);

        pipeline.on('data', async data => {
            const newCoAuthor = new coAuthorSchema(data);
            await newCoAuthor.save();
        });
        return new Promise((resolve, reject) => {
            pipeline.on('end', () => {
                resolve();
            });
            pipeline.on('error', err => {
                reject(err);
            });
        });
    }
    console.log("Connection established.");
    // preparing...
    try {
        await db.collection("coauthors").drop();
        console.log("Dropped `coauthors` collection.");
    } catch (err) {
        console.error("Failed to drop coauthors, but it might not be a problem.");
    }
    for (let i = 0; i < 10; ++i) {
        const filePath = `/home/ubuntu/data/coauthor_${i}.json`
        await loadData(filePath)
        console.log(`Loaded; ${filePath}`)
    }
    console.log("All the coauthors have been imported into the database.");
    db.close();
});
