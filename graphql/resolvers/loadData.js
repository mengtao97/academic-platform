const {ApolloError} = require("apollo-server");

const Scholar = require("../../models/Scholar");
const fs = require("fs");

module.exports = {
    Query: {},
    Mutation: {
        async loadCoAuthors() {
            const content = fs.readFileSync("/Users/chencongyong/Downloads/coauthor_info_sample.json", "utf8");
//const content = fs.readFileSync("C:/Users/mtttt/学习/BUAA/大三上/软件系统分析与设计/大作业/Code/academic-platform/data/data.json", "utf8");
            const rawData = JSON.parse(content);
            const infos = rawData.info;
            for (var key in infos) {
                // check if the property/key is defined in the object itself, not in parent
                if (infos.hasOwnProperty(key)) {
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
                    } else console.log(`${infos[key].from} -> ${infos[key].to} not found.`);
                }
            }
            return "finish";
        }
    }
};