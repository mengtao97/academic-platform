const Scholar = require("../models/Scholar");
const fs = require("fs");

async function load() {
    const content = fs.readFileSync("/Users/chencongyong/Downloads/coauthor_info_sample.json", "utf8");
//const content = fs.readFileSync("C:/Users/mtttt/学习/BUAA/大三上/软件系统分析与设计/大作业/Code/academic-platform/data/data.json", "utf8");
    const rawData = JSON.parse(content);
    const infos = rawData.info;
    for (var key in infos) {
        // check if the property/key is defined in the object itself, not in parent
        if (infos.hasOwnProperty(key)) {
            console.log(infos[key].papers);
            const scholarFrom = await Scholar.findById(infos[key].from);
            const scholarTo = await Scholar.findById(infos[key].to);
            if (scholarFrom && scholarTo) {
                await scholarFrom.coauthors.unshift({
                    scholarId: infos[key].to,
                    papers: infos[key].papers
                });
                await scholarTo.coauthors.unshift({
                    scholarId: infos[key].from,
                    papers: infos[key].papers
                });
            }
        } else console.log(`${infos[key].from} -> ${infos[key].to} not found.`)
    }
}

/*(async() => {
    console.log('start')
    await load()
    console.log('finish')
})()*/
load().then(() => console.log("finish"))

// infos.forEach(info => {
//     console.log(papers)
// })
// relations.forEach(item => {
//     console.log(item)
// })
// const authors = authorKeys.map(el => rawData.authors[el]);
// const transformedAuthors = authors.map(author => (
//     {
//         name: author.name,
//         nPubs: author.n_pubs,
//         _id: author.id,
//         orgs: author.orgs,
//         tags: author.tags,
//         pubs: author.pubs,
//         nCitations: author.n_citation,
//         hIndex: author.h_index,
//         avatar: "",
//     }));
// const papersKeys = Object.keys(rawData.papers);
// const papers = papersKeys.map(el => rawData.papers[el]);
// const transformedPapers = papers.map(paper => {
//     const obj = {
//         authors: paper.authors,
//         _id: paper.id,
//         title: paper.title,
//     };
//     if (paper.issue)
//         obj['issue'] = paper.issue;
//     if (paper.lang)
//         obj['lang'] = paper.lang;
//     if (paper.year)
//         obj['year'] = paper.year;
//     if (paper.n_citation)
//         obj['nCititation'] = paper.n_citation;
//     if (paper.abstract)
//         obj['abstract'] = paper.abstract;
//     if (paper.keywords)
//         obj['keywords'] = paper.keywords;
//     if (paper.venue)
//         obj['venue'] = paper.venue.raw;
//     if (paper.page_start)
//         obj['pageEnde'] = paper.page_start;
//     if (paper.page_end)
//         obj['pageStart'] = paper.page_end;
//     if (paper.doi)
//         obj['doi'] = paper.doi;
//     if (paper.volume)
//         obj['volume'] = paper.volume;
//     return obj;
// });
// return [transformedAuthors, transformedPapers];