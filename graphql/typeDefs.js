const {gql} = require("apollo-server-express");

module.exports = gql`
    type Authentication {
        id: ID!
        createdAt: String
        userId: ID
        managerId: ID
        scholarId: ID
        state: String
        feedback: String

    }
    input AuthenticationInput {
        userId: ID
        managerId: ID
        scholarId: ID
        state: String
        feedback: String
    }

    type Collection {
        id: ID!
        createdAt: String
        scholarId: ID
        userId: ID
    }
    input CollectionInput {
        scholarId: ID
        userId: ID
    }

    type Comment {
        id: ID!
        createdAt: String
        userId: ID
        paperId: ID
        body: String
    }
    input CommentInput {
        userId: ID
        paperId: ID
        body: String
    }
    
    type Message {
        id: ID!
        createdAt: String
        senderId: ID
        receiverId: ID
        content: String
    }
    input MessageInput {
        senderId: ID
        receiverId: ID
        content: String
    }
    
    type Paper {
        id: ID!
        createdAt: String
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

    type Pub {
        r: ID!
        i: Int
    }
    input PubInput {
        r: ID!
        i: Int
    }
    
    type Scholar {
        id: ID!
        createdAt: String
        name: String
        avatar: String
        orgs: String
        nPubs: Int
        nCitations: Int
        researchField: [String]
        hIndex: Int
        pubs: [Pub]
        tags: [String]
    }
    input ScholarInput {
        name: String
        avatar: String
        orgs: String
        nPubs: Int
        nCitations: Int
        researchField: [String]
        hIndex: Int
        pubs: [PubInput]
        tags: [String]
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
        createdAt: String
    }

    input RegisterInput {
        name: String!
        password: String!
        confirmPassword: String!
        email: String!
    }

    type Query{
        getAuthentications: [Authentication]
        getAuthentication(authenticationId: ID): Authentication
        
        getCollections: [Collection]
        getCollection(collectionId: ID): Collection
        
        getComments: [Comment]
        getComment(commentId: ID): Comment
        
        getMessages: [Message]
        getMessage(messageId: ID): Message
        
        getPapers: [Paper]
        getPaper(paperId: ID): Paper

        getScholars: [Scholar]
        getScholar(scholarId: ID): Scholar
    }

    type Mutation {
        createAuthentication(input: AuthenticationInput): Authentication
        deleteAuthentication(authenticationId: ID!): String
        updateAuthentication(authenticationId: ID!, input: AuthenticationInput): Authentication

        createCollection(input: CollectionInput): Collection
        deleteCollection(collectionId: ID!): String
        updateCollection(collectionId: ID!, input: CollectionInput): Collection

        createComment(input: CommentInput): Comment
        deleteComment(commentId: ID!): String
        updateComment(commentId: ID!, input: CommentInput): Comment

        createMessage(input: MessageInput): Message
        deleteMessage(messageId: ID!): String
        updateMessage(messageId: ID!, input: MessageInput): Message
        
        createPaper(input: PaperInput): Paper
        deletePaper(paperId: ID!): String
        updatePaper(paperId: ID!, input: PaperInput): Paper

        createScholar(input: ScholarInput): Scholar
        deleteScholar(scholarId: ID): String
        updateScholar(scholarId: ID, input: ScholarInput): Scholar
        
        register(registerInput: RegisterInput): User
        login(email: String!, password: String!): User
        updateUserInfo(name: String, password: String, email: String,avatar: String, personalProfile: String, role: Boolean): User
    }
`;