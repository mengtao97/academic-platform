module.exports = () => {
    const fs = require("fs");
    const content = fs.readFileSync("data.json", "utf8");
    //const content = fs.readFileSync("C:/Users/mtttt/学习/BUAA/大三上/软件系统分析与设计/大作业/Code/academic-platform/data/data.json", "utf8");
    const rawData = JSON.parse(content);
    const authorKeys = Object.keys(rawData.authors);
    const authors = authorKeys.map(el => rawData.authors[el]);
    const transformedAuthors = authors.map(author => (
        {
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
            obj['nCititation'] = paper.n_citation;
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
        return obj;
    });
    return [transformedAuthors, transformedPapers];
};
