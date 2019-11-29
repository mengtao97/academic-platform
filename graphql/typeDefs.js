const { gql } = require("apollo-server-express");

module.exports = gql`
    type Paper {
        id: ID
        title: String
        authors: [String]
        keywords: [String]
        lang: String
        nCititation: Int
        pageEnd: Int
        pageStart: Int
        venue: String
        year: Int
        volume: Int
        issue: Int
        doi: String
        abstract: String
    }

    type User {
        id:ID!
        email: String
        token: String
        name: String
        password: String
        avatar: String
        personalProfile: String
        paperCollection: [String]
        schCollection: [String]
        role: Boolean
        createdAt:String
    }
    input RegisterInput {
        name: String!
        password: String!
        confirmPassword: String!
        email: String!
    }
    input AddPaperInput{
        title:String
        authors:[String]
        keywords:[String]
        lang:String
        nCititation:Int
        pageEnd:Int
        pageStart:Int
        venue:Int
        year:Int
        volume:Int
        issue:String
        doi:String
        abstract:String
    }
    type Query{
        findPapersByAuthor:[Paper]
        findPapersByKeywords:[Paper]
        findPapersByTitle:[Paper]
    }
    type Mutation {
        addPaper(addPaperInput:AddPaperInput):Paper
        deletePaper:Boolean
        register(registerInput: RegisterInput): User
        login(email: String!, password: String!): User
        updateUserInfo(name: String,password: String,email: String,avatar: String,personalProfile: String,role: Boolean):User
    }
`;