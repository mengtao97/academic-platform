const Message = require('../../models/Message');

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
            Object.assign(message, input);
            return await message.save();
        },
    }
};