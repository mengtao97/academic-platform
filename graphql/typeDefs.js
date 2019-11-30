const {gql} = require("apollo-server-express");

module.exports = gql`
    type Paper {
        id: ID!
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

    input PaperInput{
        title: String
        authors: [String] = []
        keywords: [String] = []
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

    type Pub {
        r: ID
        i: Int
    }

    type Scholar {
        id: ID!
        name: String
        avatar: String
        orgs: String
        nPubs: Int
        nCitations: Int
        researchField: [String]
        hIndex: Int
        pubs: [Pub]
        tags: [String]
        createdAt: String
    }
    
    input ScholarInput {
        name: String
        avatar: String
        orgs: String
        nPubs: Int
        nCitations: Int
        researchField: [String] = []
        hIndex: Int
        tags: [String] = []
        createdAt: String
    }

    input RegisterInput {
        name: String!
        password: String!
        confirmPassword: String!
        email: String!
    }

    type Query{
        getPapers: [Paper]
        getPaper(paperId: ID): Paper
        findPapersByAuthor: [Paper]
        findPapersByKeywords: [Paper]
        findPapersByTitle: [Paper]

        getScholars: [Scholar]
        getScholar(scholarId: ID): Scholar
    }

    type Mutation {
        createPaper(input: PaperInput): Paper
        deletePaper(paperId: ID!): String
        updatePaper(paperId: ID!, input: PaperInput): Paper
        
        register(registerInput: RegisterInput): User
        login(email: String!, password: String!): User
        updateUserInfo(name: String, password: String, email: String,avatar: String, personalProfile: String, role: Boolean): User

        createScholar(input: ScholarInput): Scholar
        deleteScholar(scholarId: ID): String
        updateScholar(scholarId: ID, input: ScholarInput): Scholar
        createScholarPub(scholarId: ID, paperId: ID, i: Int): Scholar
        deleteScholarPub(scholarId: ID, paperId: ID): Scholar
    }
`;