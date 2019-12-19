const { ApolloError } = require("apollo-server-express");

const Scholar = require("../../models/Scholar");
const User = require('../../models/User')


var log4js = require('log4js');
const checkAuth = require('../../util/check-auth')
const { Client } = require('@elastic/elasticsearch')
const client = new Client({ node: 'http://localhost:9200' })

module.exports = {
    Query: {
        Scholars: async (_, { params, page, perPage }, context) => {
            if (!page)
                page = 1
            if (!perPage)
                perPage = 20

            const { body } = await client.search({
                index: 'scholars',
                // type: '_doc', // uncomment this line if you are using Elasticsearch ≤ 6
                body: {
                    query: {
                        match: { name: params.toString() },
                    }
                }
            })
            const numOfPages = Math.ceil(body.hits.hits.length / perPage)
            const slicedHits = body.hits.hits.slice((page - 1) * perPage, page * perPage);
            const ids = slicedHits.map(hit => hit._id)

            scholars = await Scholar.find().where('_id').in(ids).exec();

            var token = null;
            if (context.req.headers.authorization != null) {
                const val = checkAuth(context);
                token = val.id;
            }
            log4js.configure({
                appenders: {
                    out: { type: 'stdout' },
                    app: {
                        type: 'dateFile',
                        filename: "log/scholar/" + token,
                        pattern: 'yyyy-MM.log',
                        alwaysIncludePattern: true
                    }
                },
                categories: {
                    default: { appenders: ['out', 'app'], level: 'trace' }
                }
            });
            var logger = log4js.getLogger('SCHOLAR');
            logger.level = 'trace';
            logger.trace("Query on scholar with: \"" + params + "\" by: " + token);
            return { scholars, numOfPages };
        },
        findScholarById: async (_, { scholarId }, context) => {
            const scholar = await Scholar.findById(scholarId);
            try {
                const currentId = checkAuth(context).id;
                const user = await User.findById(currentId);
                isFollowing = !!user.schCollection.find(item => {
                    return item.scholarId == scholarId
                });
            } catch (el) {
                isFollowing = false;
            }
            return { scholar, isFollowing };
        },
    },
    Mutation: {
        createScholar: async (_, { params }, context) => {
            const user = checkAuth(context);
            const newScholar = new Scholar({
                ...params,
                pubs: [],
                userId: user.id,
                createdAt: new Date().toISOString()
            })
            return await newScholar.save();
        },
        deleteScholar: async (_, { scholarId }, context) => {
            const currentId = checkAuth(context).id;
            const user = await User.findById(currentId);
            const scholar = await Scholar.findById(scholarId);
            if (user.id === scholar.userId || user.role === true) {
                await scholar.delete();
                return "Scholar deleted successfully";
            } else
                throw new ApolloError("权限不足，不允许进行该操作！")
        },
        Scholar: async (_, { scholarId, params }, context) => {
            const currentId = checkAuth(context).id;
            const user = await User.findById(currentId);
            const scholar = await Scholar.findById(scholarId);
            if (user.id === scholar.userId || user.role === true) {
                Object.assign(scholar, params);
                return await scholar.save();
            } else {
                throw new ApolloError("权限不足，不允许进行该操作！");
            }
        },
        follow: async (_, { scholarId }, context) => {
            const currentId = checkAuth(context).id;
            const user = await User.findById(currentId);
            const scholar = await Scholar.findById(scholarId);//not need the value of scholar,but need to assure the scholar is exists
            if (user.schCollection.find(item => {
                return item.scholarId == scholarId
            })) {
                user.schCollection = user.schCollection.filter(item => item.scholarId != scholarId);
            } else {
                user.schCollection.push({
                    scholarId,
                    createdAt: new Date().toISOString()
                });
            }
            await user.save();
            return user;
        },
        addTags: async (_, { params }, context) => {
            const { scholarId, tags } = params;
            const currentId = checkAuth(context).id;
            const user = User.findById(currentId);
            const scholar = await Scholar.findById(scholarId);
            if (currentId == scholar.userId || user.role == true) {
                for (tag of tags) {
                    //update or add
                    scholar.tags = scholar.tags.filter(item => item.t != tag.t)
                    scholar.tags.push(tag);
                }
                await scholar.save();
                return scholar;
            } else
                throw new ApolloError('权限不足，不允许进行该操作！');

        },
        removeTags: async (_, { params }, context) => {
            const { scholarId, tags } = params;
            const currentId = checkAuth(context).id;
            const user = await User.findById(currentId);
            const scholar = await Scholar.findById(scholarId);
            if (currentId == scholar.userId || user.role == true) {
                for (tag of tags) {
                    //delete
                    scholar.tags = scholar.tags.filter(item => item.t != tag)
                }
                await scholar.save();
                return scholar;
            } else
                throw new ApolloError('权限不足，不允许进行该操作！');
        },
        updateBulletin: async (_, { scholarId, bulletin }, context) => {
            const currentId = checkAuth(context).id;
            const user = User.findById(currentId);
            const scholar = await Scholar.findById(scholarId);
            if (currentId == scholar.userId || user.role == true) {
                scholar.bulletin = bulletin;
                await scholar.save();
                return scholar;
            } else
                throw new ApolloError('权限不足，不允许进行该操作！');

        }
    }
}