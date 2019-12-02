const {gql} = require("apollo-server-express");

module.exports = gql`

    type Authentication {
        id: ID!
        createdAt: String
        userId: ID
        managerId: ID
        scholarId: ID
        state: String
        content: String
    }

    input AuthenticationInput {
        userId: ID
        managerId: ID
        scholarId: ID
        state: String
        content: String
    }

    type Collection {
        id: ID!
        createdAt: String
        paperId: ID
        userId: ID
    }

    input CollectionInput {
        paperId: ID
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
        Authentications(authenticationId: ID): [Authentication]
        
        Collections(collectionId: ID, userId: ID, paperId: ID): [Collection]
        
        Comments(commentId: ID, userId: ID, paperId: ID): [Comment]
        
        recentContacts: [User]
        messages(idA: ID, idB: ID): [Message]
        
        Papers(params: String): [Paper]
        getPapers:[Paper]
        getScholars: [Scholar]
        getScholar(scholarId: ID): Scholar

    }

    type Mutation {
        createAuthentication(params: AuthenticationInput): Authentication
        deleteAuthentication(authenticationId: ID!): String

        "创建一个学者主页申请。"
        Authentication(authenticationId: ID!, params: AuthenticationInput): Authentication

        createCollection(params: CollectionInput): Collection
        deleteCollection(id: ID!): String

        createComment(params: CommentInput): Comment
        deleteComment(id: ID!): String
        Comment(id: ID!, params: CommentInput): Comment

        sendMessage(params: MessageInput): Message
        
        createPaper(params: PaperInput): Paper
        deletePaper(id: ID!): String
        updatePaper(id: ID!, params: PaperInput): Paper

        createScholar(params: ScholarInput): Scholar
        deleteScholar(id: ID): String
        updateScholar(id: ID, params: ScholarInput): Scholar
        
        register(registerparams: RegisterInput): User
        login(email: String!, password: String!): User
        updateUserInfo(name: String, password: String, email: String,avatar: String, personalProfile: String, role: Boolean): User
    }
`;