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

    type User{
        id:ID!
        email:String
        token: String
        name: String
        password: String
        avatar: String
        personalProfile: String
        paperCollection: [String]
        schCollection:[String]
        role: Boolean
        createdAt:String
    }
    input RegisterInput {
        name: String!
        password: String!
        confirmPassword: String!
        email: String!
    }
    type Query {
        items: [Item]
    }
    type Mutation {
        createItem(Sch_name: String, title: String, abstract: String, references: String, field: String): Item
        deleteItem(itemId: ID): String
        register(registerInput: RegisterInput): User
        login(email: String!, password: String!): User

    }
`;