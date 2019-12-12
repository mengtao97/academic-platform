const Message = require('../../models/Message');
const User = require('../../models/User');
const checkAuth = require("../../util/check-auth");

module.exports = {
    Query: {
        recentContacts: async (_, __, context) => {
            const currentId = checkAuth(context).id;
            const messages = await Message.find({
                $or: [{senderId: currentId}, {receiverId: currentId}]
            }).sort({createdAt: -1}); // get all related messages
            const results = [];
            const addedContacts = new Set();
            for (const each of messages) {
                const contact = await User.findById(each.sendId !== currentId ? each.receiverId : each.senderId); // not me
                if (addedContacts.has(contact.id))
                    continue;
                results.push(contact);
                addedContacts.add(contact.id);
            }
            return {id,name,avatar} = results;
        },
        messages: async (_, {idA, idB, page, perPage}) => {
            if (!page)
                page = 1;
            if (!perPage)
                perPage = 20;
            return Message.find({
                $or: [
                    {$and: [{senderId: idA}, {receiverId: idB}]},
                    {$and: [{senderId: idB}, {receiverId: idA}]}
                ]
            }).sort({createdAt: 1}).skip((page - 1) * perPage).limit(perPage);
        }
    },
    Mutation: {
        async sendAMessage(_, {params}, context) {
            const user = checkAuth(context);
            const input = {
                ...params,
                senderId: user.id,
                createdAt: new Date().toISOString()
            }
            const newMessage = new Message(input);
            return await newMessage.save();
        }
    }
};