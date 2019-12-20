// @ts-check
const mongoose = require('mongoose');

const coAuthorSchema = require('../models/CoAuthor')

const { chain } = require("stream-chain");
const { parser } = require("stream-json");
const { streamObject } = require('stream-json/streamers/StreamObject');
const fs = require("fs");

mongoose.connect("mongodb://localhost:27017/scholarly", { useNewUrlParser: true, useUnifiedTopology: true });
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
                const newCoScholar = new coAuthorSchema(data);
                await newCoScholar.save();
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
    for (let i = 0; i < 10; ++i) {
        const filePath = `/home/ubuntu/data/coauthor_${i}.json`
        await loadData(filePath)
        console.log(`Loaded; ${filePath}`)
    }
    console.log("All the papers have been imported into the database.");
    db.close();
});
