const Item = require("../models/Item");
const User = require("../models/User");
module.exports = {
    Query: {
        items: async () => await Item.find(),
        // find_a_user: async(_, { userID }) => await User.findById(userID),
    },
    Mutation: {
        createItem: async (_, {Sch_name, title, abstract, references, field}, context) => {
            const newItem = new Item({
                Sch_name, title, abstract, references, field,
                createdAt: new Date().toISOString()
            });
            return await newItem.save();
        },
        deleteItem: async (_, { itemId }, context) => {
            const item = await Item.findById(itemId);
            await item.delete();
            return "Deleted successfully";
        }
    }
};
