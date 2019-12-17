// const fs = require("fs");
// const content = fs.readFileSync("/home/ubuntu/data/coauthor_0.json", "utf8");
// const rawData = JSON.parse(content);
// const keys = Object.keys(rawData);
// console.log(keys.slice(0,10));

const mongoose = require('mongoose');

const PaperSchema = require('../models/Paper');
const ScholarSchema = require('../models/Scholar');
const fs = require("fs");

mongoose.connect("mongodb://localhost:27017/scholarly", {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('open', async () => {
    console.log("Connection established.");

    // // preparing...
    // try {
    //     await db.collection("paper").drop();
    //     console.log("Dropped `paper` collection.");
    // } catch (err) {
    //     console.error("Failed to drop Paper, but it might not be a problem.");
    // }
    //
    // try {
    //     await db.collection("scholars").drop();
    //     console.log("Dropped `scholars` collection.")
    // } catch (err) {
    //     console.error("Failed to drop Scholars, but it might not be a problem.");
    // }

    // loading...
    for (let i = 10; i <= 10; ++i) {
        let path = "/home/ubuntu/data/coauthor_" + i + ".json"
        const content = fs.readFileSync(path, "utf8");
        const infos = JSON.parse(content);
        const fromIds = Object.keys(infos);
        for (var fromId in fromIds) {
            // check if the property/key is defined in the object itself, not in parent
            const toIds = Object.keys(infos[fromId]);
            for (var toId in toIds) {
                const scholarFrom = await Scholar.findById(fromId);
                if (!scholarFrom)
                    failed.push(fromId);
                const scholarTo = await Scholar.findById(toId);
                if (!scholarTo)
                    failed.push(toId);
                if (scholarFrom && scholarTo) {
                    scholarFrom.coauthors.unshift({
                        scholarId: toId,
                        papers: infos[fromId][toId][pubs] // infos[key].papers
                    });
                    await scholarFrom.save();
                    scholarTo.coauthors.unshift({
                        scholarId: fromId,
                        papers: infos[fromId][toId][pubs]
                    });
                    await scholarTo.save();
                }
            }
        }
    }
    console.log("All the coauthors have been imported into the database.");

    // for (let i = 7; i < 8; ++i) {
    //     let file_path = "/home/ubuntu/data/papers_" + i + ".json"
    //     let data = preloadData(file_path, 'paper')
    //     for (const item of data) {
    //         const newPaper = new PaperSchema(item);
    //         await newPaper.save();
    //     }
    // }
    // console.log("All the papers have been imported into the database.");
    db.close();
});
