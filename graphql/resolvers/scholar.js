const {
    AuthenticationError,
    UserInputError
} = require("apollo-server-express");

const Scholar = require("../../models/Scholar");

module.exports = {
    Query: {
        getScholars: async () => await Scholar.find(),
        getScholar: async (_, {scholarId}) => await Scholar.findById(scholarId)
    },
    Mutation: {
        createScholar: async (_, {name, avatar, orgs, nPubs, nCitations, researchField, hIndex, tags}) => {
            const newScholar = new Scholar({
                name: name,
                avatar: avatar,
                orgs: orgs,
                nPubs: nPubs,
                nCitations: nCitations,
                researchField: researchField,
                hIndex: hIndex,
                pubs: [],
                tags: tags,
                createdAt: new Date().toISOString()
            });
            return await newScholar.save();
        },
        deleteScholar: async (_, {scholarId}) => {
            const scholar = await Scholar.findById(scholarId);
            await scholar.delete();
            return "Scholar deleted successfully";
        },
        updateScholar: async (_, { scholarId, name, avatar, orgs, nPubs, nCitations, researchField, hIndex, tags}) => {
            const scholar = await Scholar.findById(scholarId);
            scholar.name = name;
            scholar.avatar = avatar;
            scholar.orgs = orgs;
            scholar.nPubs = nPubs;
            scholar.nCitations = nCitations;
            scholar.researchField = researchField;
            scholar.hIndex = hIndex;
            scholar.tags = tags;
            return await scholar.save();
        },
        createScholarPub: async (_, { scholarId, paperId, i }) => {
            const scholar = await Scholar.findById(scholarId);
            if (scholar) {
                const pubIndex = scholar.pubs.findIndex(p => p.r === paperId);
                pub = scholar.pubs[pubIndex];
                if (pub) return scholar;
                scholar.pubs.unshift({
                    r: paperId,
                    i: i
                });
                return await scholar.save();
            } else throw new UserInputError("Scholar not found");
        },
        deleteScholarPub: async (_, { scholarId, paperId }) => {
            const scholar = await Scholar.findById(scholarId);
            if (scholar) {
                const pubIndex = scholar.pubs.findIndex(p => p.r === paperId);
                pub = scholar.pubs[pubIndex];
                if (pub) {
                    scholar.pubs.splice(pubIndex, 1);
                    return await scholar.save();
                } else throw new UserInputError("Pub not found");
            } else throw new UserInputError("Scholar not found");
        }
    }
}