// const fs = require("fs");
// const content = fs.readFileSync("/home/ubuntu/data/coauthor_0.json", "utf8");
// const rawData = JSON.parse(content);
// const keys = Object.keys(rawData);
// console.log(keys.slice(0,10));

const mongoose = require('mongoose');

const Scholar = require('../models/Scholar');
const fs = require("fs");

mongoose.connect("mongodb://localhost:27017/scholarly", { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('open', async () => {
    console.log("Connection established.");

    // loading...
    for (let i = 0; i <= 10; ++i) {
        let path = "/home/ubuntu/data/coauthor_" + i + ".json"
        const content = fs.readFileSync(path, "utf8");
        const infos = JSON.parse(content);
        const fromIds = Object.keys(infos);
        for (var fromId of fromIds) {
            // check if the property/key is defined in the object itself, not in parent
            const toIds = Object.keys(infos[fromId]);
            for (var toId of toIds) {
                const scholarFrom = await Scholar.findById(fromId);
                const scholarTo = await Scholar.findById(toId);
                if (scholarFrom && scholarTo) {
                    scholarFrom.coauthors.unshift({
                        scholarId: toId,
                        papers: infos[fromId][toId].pubs // infos[key].papers
                    });
                    await scholarFrom.save();
                    scholarTo.coauthors.unshift({
                        scholarId: fromId,
                        papers: infos[fromId][toId].pubs
                    });
                    await scholarTo.save();
                }
            }
        }
    }
    console.log("All the coauthors have been imported into the database.");

    db.close();
});
