// const fs = require("fs");
// const content = fs.readFileSync("/home/ubuntu/data/coauthor_0.json", "utf8");
// const rawData = JSON.parse(content);
// const keys = Object.keys(rawData);
// console.log(keys.slice(0,10));

const mongoose = require('mongoose');

const coAuthorSchema = require('../models/CoAuthor')
const fs = require("fs");

function removeDuplicates(array, key) {
    let lookup = new Set();
    return array.filter(obj => !lookup.has(obj[key]) && lookup.add(obj[key]));
}

mongoose.connect("mongodb://localhost:27017/scholarly", {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('open', async () => {
    console.log("Connection established.");

    // loading...
    for (let i = 0; i < 10; ++i) {
        console.log(`start working on coauthor_${i}`);
        let counter = 0;

        let path = "/home/ubuntu/tmp/coauthor_" + i + ".json";
        const content = fs.readFileSync(path, "utf8");
        const infos = JSON.parse(content);
        for (var item of infos) {
            item.coauthors["papers"] = item.coauthors.pubs;
            for (var pap of item.coauthors.papers) {
                pap.paperId = pap.id;
            }
            const newCoScholar = new coAuthorSchema(item);
            await newCoScholar.save();
        }
        // infos.forEach(item => {
        //     const newCoScholar = new coScholarSchema(data);
        //     await newCoScholar.save();
        // })
        // const fromIds = Object.keys(infos);
        /*for (var fromId of fromIds) {
            // check if the property/key is defined in the object itself, not in parent
            const scholarFrom = await Scholar.findById(fromId);
            if (scholarFrom) {
                const toIds = Object.keys(infos[fromId]);

                for (var toId of toIds) {
                    //const scholarFrom = await Scholar.findById(fromId);
                    const scholarTo = await Scholar.findById(toId);
                    if (scholarTo) {

                        let oldPubs = infos[fromId][toId].pubs; // [{id: ..., title: ...}]
                        let patchedPubs = [];
                        for (var pub of oldPubs) {
                            patchedPubs.push({
                                paperId: pub.id,
                                title: pub.title
                            })
                        }
                        counter = counter + 1;
                        if (counter % 100 === 0)
                            console.log(`${counter} pairs of scholars are added`)
                        scholarFrom.coauthors.unshift({
                            scholarId: toId,
                            h_index: infos[fromId][toId].h_index,
                            n_citation: infos[fromId][toId].n_citation,
                            n_pubs: infos[fromId][toId].n_pubs,
                            name: infos[fromId][toId].name,
                            orgs: infos[fromId][toId].orgs,
                            papers: patchedPubs // TODO patch the pub infos[key].papers
                        });
                        scholarFrom.coauthors = removeDuplicates(scholarFrom.coauthors, 'scholarId');
                        await scholarFrom.save();
                        scholarTo.coauthors.unshift({
                            scholarId: fromId,
                            h_index: infos[fromId][toId].h_index,
                            n_citation: infos[fromId][toId].n_citation,
                            n_pubs: infos[fromId][toId].n_pubs,
                            name: infos[fromId][toId].name,
                            orgs: infos[fromId][toId].orgs,
                            papers: patchedPubs
                        });
                        scholarTo.coauthors = removeDuplicates(scholarTo.coauthors, 'scholarId');
                        await scholarTo.save();




                    }
                }
            }
        }*/
    }
    console.log("All the coauthors have been imported into the database.");

    db.close();
});
