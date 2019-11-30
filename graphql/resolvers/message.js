const Message = require('../../models/Message');

const removeEmpty = obj => {
    Object.keys(obj).forEach(key => obj[key] == null && delete obj[key]);
};

module.exports = {
    Query: {
        getMessages: async () => await Message.find(),
        getMessage: async (_, {messageId}) => await Message.findById(messageId),
    },
    Mutation: {
        async createMessage(_, {input}) {
            const newMessage = new Message(input);
            return await newMessage.save();
        },
        async deleteMessage (_, {messageId}) {
            const message = await Message.findById(messageId);
            await message.delete();
            return "Message deleted successfully";
        },
        async updateMessage (_, {messageId, input}) {
            const message = await Message.findById(messageId);
            message.assign(removeEmpty(input));
            return await message.save();
        },
    }
};