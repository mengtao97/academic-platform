const {ApolloError} = require("apollo-server");

const Scholar = require("../../models/Scholar");
const fs = require("fs");

module.exports = {
    Query: {},
    Mutation: {
        async loadCoAuthors(_, {path}) {
            const content = fs.readFileSync(path, "utf8");
            const rawData = JSON.parse(content);
            const infos = rawData.info;
            const failed = [];
            for (var key in infos) {
                // check if the property/key is defined in the object itself, not in parent
                if (infos.hasOwnProperty(key)) {
                    const scholarFrom = await Scholar.findById(infos[key].from);
                    if (!scholarFrom)
                        failed.push(infos[key].from);
                    const scholarTo = await Scholar.findById(infos[key].to);
                    if (!scholarTo)
                        failed.push(infos[key].to);
                    if (scholarFrom && scholarTo) {
                        scholarFrom.coauthors.unshift({
                            scholarId: infos[key].to,
                            papers: infos[key].papers
                        });
                        await scholarFrom.save();
                        scholarTo.coauthors.unshift({
                            scholarId: infos[key].from,
                            papers: infos[key].papers
                        });
                        await scholarTo.save();
                    }
                }
            }
            return failed;
        }
    },
    async loadExtractedCoAuthors(_, {path}) {
        const content = fs.readFileSync(path, "utf8");
        const infos = JSON.parse(content);
        // const infos = rawData.info;
        const failed = [];
        for (var fromId in infos) {
            // check if the property/key is defined in the object itself, not in parent
            if (infos.hasOwnProperty(fromId)) {
                for (var toId in infos[fromId]) {
                    if (infos[fromId].hasOwnProperty(toId)) {
                        const scholarFrom = await Scholar.findById(fromId);
                        if (!scholarFrom)
                            failed.push(fromId);
                        const scholarTo = await Scholar.findById(toId);
                        if (!scholarTo)
                            failed.push(toId);
                        if (scholarFrom && scholarTo) {
                            scholarFrom.coauthors.unshift({
                                scholarId: toId,
                                papers: infos[key].papers
                            });
                            await scholarFrom.save();
                            scholarTo.coauthors.unshift({
                                scholarId: fromId,
                                papers: infos[key].papers
                            });
                            await scholarTo.save();
                        }
                    }

                }
            }
            return failed;
        }
    }
};