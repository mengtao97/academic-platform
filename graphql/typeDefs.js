const { gql } = require("apollo-server-express");

module.exports = gql`
    type Item {
        id: ID
        Sch_name: String
        title: String
        abstract: String
        references: String
        field: String
    }
    type Query {
        items: [Item]
    }
    type Mutation {
        createItem(Sch_name: String, title: String, abstract: String, references: String, field: String): Item
        deleteItem(itemId: ID): String
    }
`;