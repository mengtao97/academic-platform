const {
    UserInputError,
    ApolloError
} = require("apollo-server-express");

const Scholar = require("../../models/Scholar");

module.exports = {
    Query: {
        Scholars: async (_, {params,page,perPage}) => {
            if(!page)
                page = 1
            if(!perPage)
                perPage = 20
            const keywords = params.trim().split(' ').filter(el => el.length > 0);
            const regex = new RegExp(keywords.join("|"));
            const scholars = await Scholar.find({name: {$regex: regex, $options: "i"}},).skip((page-1)*perPage).limit(perPage);
            return scholars;
        },
        findScholarById: async (_,{scholarId}) =>{
            const scholar = await Scholar.findById(scholarId);
            return scholar;
        }
    },
    Mutation: {
        createScholar: async (_, {input}, context) => {
            const user = checkAuth(context);
            const newScholar = new Scholar({
                ...input,
                pubs: [],
                userId: user.id,
                createdAt: new Date().toISOString()
            })
            return await newScholar.save();
        },
        deleteScholar: async (_, {scholarId}, context) => {
            const currentId = checkAuth(context).id;
            const user = await User.findById(currentId);
            const scholar = await Scholar.findById(scholarId);
            if(user.id === scholar.userId || user.role === true){
                await scholar.delete();
                return "Scholar deleted successfully";
            }else
                throw new ApolloError("Action not allowed",401)
        },
        Scholar: async (_, {scholarId, input}, context) => {
            const currentId = checkAuth(context).id;
            const user = await User.findById(currentId);
            const scholar = await Scholar.findById(scholarId);
            if (user.id === post.scholarId || user.role === true ) {
                Object.assign(scholar, input);
                return await scholar.save();
            } else {
                throw new ApolloError("Action not allowed",401);
            }
        },
        follow: async (_,{scholarId},context)=>{
            const currentId = checkAuth(context).id;
            const user = await User.findById(currentId);
            const scholar = await Scholar.findById(scholarId);
            if(!scholar)
                throw new UserInputError('Can\'t find the Scholar');
            if(!user)
                throw new AuthenticationError('Permission denied');
            if(!user.schCollection.includes(scholarId)) 
                user.schCollection.push(scholarId);
            await user.save();
            return user;
        },
        unfollow:async (_,{scholarId},context)=>{
            const currentId = checkAuth(context).id;
            const user = await User.findById(currentId);
            const scholar = await Scholar.findById(scholarId);
            if(!scholar)
                throw new UserInputError('Can\'t find the Scholar');
            if(!user)
                throw new AuthenticationError('Permission denied');
            if(user.schCollection.includes(scholarId)){
                user.schCollection.remove(scholarId);
                await user.save();
            }
            return user;
               
        },
        addTags:async (_,{scholarId,tags},context)=>{
            const currentId = checkAuth(context);
            const user = User.findById(currentId);
            const scholar = await Scholar.findById(scholarId);
            if(!scholar)
                throw new UserInputError('Can\'t find the Scholar');
            if(!user)
                throw new AuthenticationError('Permission denied');
            scholar.tags = Array.from(new Set([...scholar.tags,...tags]));//union
            await scholar.save();
            return scholar;
        },
        removeTags: async (_,{scholarId,tags},context)=>{
            const currentId = checkAuth(context);
            const user = User.findById(currentId);
            const scholar = await Scholar.findById(scholarId);
            if(!scholar)
                throw new UserInputError('Can\'t find the Scholar');
            if(!user)
                throw new AuthenticationError('Permission denied');
            const st = new Set(tags);
            scholar.tags = scholar.tags.filter(x => !st.has(x));// minus
            await scholar.save();
            return scholar;
        },
        updateBulletin: async (_,{scholarId,bulletin},context)=>{
            const currentId = checkAuth(context);
            const user = User.findById(currentId);
            const scholar = await Scholar.findById(scholarId);
            if(!scholar)
                throw new UserInputError('Can\'t find the Scholar');
            if(!user)
                throw new AuthenticationError('Permission denied');
            scholar.bulletin = bulletin;
            await scholar.save();
            return scholar;
        }
    }
}