// @ts-check

const { chain } = require("stream-chain");
const { parser } = require("stream-json");
const { streamValues } = require('stream-json/streamers/StreamValues');
const fs = require("fs");

module.exports = (filePath, mode) => {
    if (mode == 'author') {
        const transformedAuthors = [];
        const pipeline = chain([
            fs.createReadStream(filePath),
            parser(),
            streamValues(),
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

        pipeline.on('data', data => transformedAuthors.push(data));
        return transformedAuthors;
    } else {
        const transformedPapers = [];
        const pipeline = chain([
            fs.createReadStream(filePath),
            parser(),
            streamValues(),
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

        pipeline.on('data', data => transformedPapers.push(data));
        return transformedPapers;
    }

};
