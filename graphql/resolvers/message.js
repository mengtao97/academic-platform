const Message = require('../../models/Message');
const User = require('../../models/User');
const checkAuth = require("../../util/check-auth");

module.exports = {
    Query: {
        recentContacts: async (_, __, context) => {
            const currentId = checkAuth(context).id;
            const messages = await Message.find({
                $or: [{ senderId: currentId }, { receiverId: currentId }]
            }).sort({ createdAt: -1 });
            const results = [];
            const addedContacts = new Set();
            for (const each of messages) {
                const contact = await User.findById(each.sendId !== currentId ? each.receiverId : each.senderId);
                if (addedContacts.has(contact.id))
                    continue;
                results.push(contact);
                addedContacts.add(contact.id);
            }
            return results;
        },
        messages: async (_, { idA, idB }) => {
            return await Message.find({
                $or: [
                    { $and: [{ senderId: idA }, { receiverId: idB }] },
                    { $and: [{ senderId: idB }, { receiverId: idA }] }
                ]
            }).sort({ createdAt: 1 });
        },
    },
    Mutation: {
        async sendMessage(_, { params }) {
            const input = {
                ...params,
                createdAt: new Date().getTime().toString()
            }
            const newMessage = new Message(input);
            return await newMessage.save();
        }
    }
};