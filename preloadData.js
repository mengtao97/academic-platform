// @ts-check
const mongoose = require('mongoose');

const PaperSchema = require('./models/Paper');
const ScholarSchema = require('./models/Scholar');

const { chain } = require("stream-chain");
const { parser } = require("stream-json");
const { streamObject } = require('stream-json/streamers/StreamObject');
const fs = require("fs");

mongoose.connect("mongodb://localhost:27017/scholarly", { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('open', async () => {
    const loadData = (filePath, mode) => {
        if (mode === 'author') {
            const pipeline = chain([
                fs.createReadStream(filePath),
                parser(),
                streamObject(),
                data => {
                    const author = data.value;
                    return {
                        name: author.name,
                        nPubs: author.n_pubs,
                        _id: author.id,
                        orgs: author.orgs,
                        tags: author.tags,
                        pubs: author.pubs,
                        nCitations: author.n_citation,
                        hIndex: author.h_index,
                        avatar: "",
                    };
                }
            ]);

            pipeline.on('data', async data => {
                const newScholar = new ScholarSchema(data);
                await newScholar.save();
            });
            return new Promise((resolve, reject) => {
                pipeline.on('end', () => {
                    resolve();
                });
                pipeline.on('error', err => {
                    reject(err);
                });
            });
        } else {
            const pipeline = chain([
                fs.createReadStream(filePath),
                parser(),
                streamObject(),
                data => {
                    const paper = data.value;
                    const obj = {
                        authors: paper.authors,
                        _id: paper.id,
                        title: paper.title,
                    };
                    if (paper.issue)
                        obj['issue'] = paper.issue;
                    if (paper.lang)
                        obj['lang'] = paper.lang;
                    if (paper.year)
                        obj['year'] = paper.year;
                    if (paper.n_citation)
                        obj['nCitation'] = paper.n_citation;
                    if (paper.abstract)
                        obj['abstract'] = paper.abstract;
                    if (paper.keywords)
                        obj['keywords'] = paper.keywords;
                    if (paper.venue)
                        obj['venue'] = paper.venue.raw;
                    if (paper.page_start)
                        obj['pageEnde'] = paper.page_start;
                    if (paper.page_end)
                        obj['pageStart'] = paper.page_end;
                    if (paper.doi)
                        obj['doi'] = paper.doi;
                    if (paper.doi)
                        obj['issn'] = paper.issn;
                    if (paper.volume)
                        obj['volume'] = paper.volume;
                    if (paper.url)
                        obj['url'] = paper.url;
                    if (paper.pdf) {
                        obj['pdf'] = paper.pdf;
                    }
                    return obj;
                }
            ]);

            let counter = 0;

            pipeline.on('data', async data => {
                ++counter;
                const newPaper = new PaperSchema(data);
                await newPaper.save();
            });

            return new Promise((resolve, reject) => {
                pipeline.on('end', () => {
                    console.log(`LOADED ${counter} papers.`)
                    resolve();
                });
                pipeline.on('error', err => {
                    reject(err);
                });
            })
        }
    }
    console.log("Connection established.");

    // preparing...
    // try {
    //     await db.collection("paper").drop();
    //     console.log("Dropped `paper` collection.");
    // } catch (err) {
    //     console.error("Failed to drop Paper, but it might not be a problem.");
    // }

    // try {
    //     await db.collection("scholars").drop();
    //     console.log("Dropped `scholars` collection.")
    // } catch (err) {
    //     console.error("Failed to drop Scholars, but it might not be a problem.");
    // }

    for (let i = 15; i < 20; ++i) {
        const filePath = `/home/ubuntu/data/papers_${i}.json`
        await loadData(filePath, 'paper')
        console.log(`Loaded; ${filePath}`)
    }
    console.log("All the papers have been imported into the database.");

    // loading...
    // for (let i = 0; i <= 10; ++i) {
    //     const filePath = `/home/ubuntu/data/author_${i}.json`;
    //     await loadData(filePath, 'author');
    //     console.log(`Loaded; ${filePath}`)
    // }
    // console.log("All the scholars have been imported into the database.");



    db.close();
});
