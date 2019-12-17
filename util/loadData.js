// @ts-check

module.exports = (file_path, mode) => {
    const fs = require("fs");
    if (mode == 'author') {
        let authorJsonString = fs.readFileSync(file_path, "utf8");
        let authorRawObject = JSON.parse(authorJsonString);
        authorJsonString = null; // GC
        let authorKeys = Object.keys(authorRawObject);
        let authors = authorKeys.map(el => authorRawObject[el]);
        authorKeys = null; // GC
        authorRawObject = null; // GC
        const transformedAuthors = authors.map(author => ({
            name: author.name,
            nPubs: author.n_pubs,
            _id: author.id,
            orgs: author.orgs,
            tags: author.tags,
            pubs: author.pubs,
            nCitations: author.n_citation,
            hIndex: author.h_index,
            avatar: "",
        }));
<<<<<<< HEAD
    const papersKeys = Object.keys(rawData.papers);
    const papers = papersKeys.map(el => rawData.papers[el]);
    const transformedPapers = papers.map(paper => {
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
        return obj;
    });
    return [transformedAuthors, transformedPapers];
=======
        authors = null; // GC
        return transformedAuthors;
    } else {

        let Pcontent = fs.readFileSync(file_path, "utf8");
        let prawData = JSON.parse(Pcontent);
        Pcontent = null; // GC
        let papersKeys = Object.keys(prawData);
        let papers = papersKeys.map(el => prawData[el])
        prawData = null;
        papersKeys = null;
        const transformedPapers = papers.map(paper => {
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
        });
        papers = null; // GC
        return transformedPapers;
    }

>>>>>>> 2c56047accb77549b523a1c225088ac2ea4873b2
};
