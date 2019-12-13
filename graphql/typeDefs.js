const {gql} = require("apollo-server-express");

module.exports = gql`

    input AuthenticationInput {
        managerId: ID
        scholarId: ID
        state: String
        content: String
    }

    input CommentInput {
        paperId: ID
        body: String
    }

    input MessageInput {
        receiverId: ID
        content: String
    }

    input PaperInput {
        title: String
        authors: [String]
        keywords: [String]
        lang: String
        nCitation: Int
        pageEnd: Int
        pageStart: Int
        venue: String
        year: Int
        volume: Int
        issue: Int
        doi: String
        abstract: String
    }

    input ScholarInput {
        name: String
        avatar: String
        orgs: String
        nPubs: Int
        nCitations: Int
        hIndex: Int
        pubs: [ID]
        tags: [String]
    }

    input RegisterInput {
        name: String
        password: String
        email: String
    }

    input TagInput {
        t: String
        w: Float
    }


    input updateTagsInput{
        scholarId:ID
        tags: [TagInput]
    }

    type Authentication {
        id: ID!
        createdAt: String
        userId: ID
        managerId: ID
        scholarId: ID
        state: String
        content: String
    }

    type Comment {
        id: ID!
        createdAt: String
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

    type Author {
        id: ID,
        name: String
    }

    type Paper {
        id: ID!
        createdAt: String
        title: String
        authors: [Author]
        keywords: [String]
        lang: String
        nCitation: Int
        pageEnd: String
        pageStart: String
        venue: String
        year: Int
        volume: String
        issue: String
        doi: String
        abstract: String
        username: String
    }

    type Pub {
        i: ID!
        r: Int
    }

    type Tag {
        id:ID!
        t: String,
        w: Float
    }

    type CoAuthor {
        scholarId: ID
        papers: [ID]
    }

    type Scholar {
        id: ID!
        createdAt: String
        name: String
        avatar: String
        orgs: [String]
        nPubs: Int
        nCitations: Int
        hIndex: Int
        pubs: [Pub]
        tags: [Tag]
        userId:ID
        bulletin:String
        coauthors: [CoAuthor]
    }

    type Favorite {
        paperId: ID
        createdAt: String
    }

    type Follow {
        scholarId: ID
        createdAt: String
    }

    type User {
        id:ID!
        email: String
        token: String
        name: String
        password: String
        avatar: String
        personalProfile: String
        paperCollection: [Favorite]
        schCollection: [Follow]
        role: Boolean
        createdAt: String
    }

    type UserInfo{
        name:String
        id:ID
        avatar:String
        email:String
    }

    type ScholarAndFollowing{
        scholar:Scholar
        isFollowing:Boolean
    }

    type ScholarsAndPageNum{
        scholars:[Scholar]
        numOfPages:Int
    }

    type PapersAndPageNum{
        papers:[Paper]
        numOfPages:Int
    }

    type UsersAndPageNum{
        users:[User]
        numOfPages:Int
    }

    type Contact{
        id:ID
        name:String
        avatar:String
    }
    type PaperWithCommentsRelatedWorks {currentPaper: Paper, comments: [Comment], relatedWorks: [Paper]}

    type Query{
        "登录账号"
        login(email: String!, password: String!): User
        Users(params: String, page:Int, perPage:Int): UsersAndPageNum
        "用于获取当前用户的所有收藏论文"
        allFavorites: [Paper]
        "用于获取当前用户的所有关注学者"
        following: [Scholar]

        Authentications(authenticationId: ID): [Authentication]
        Comments(commentId: ID, userId: ID, paperId: ID): [Comment]
        recentContacts: [Contact]
        messages(idA: ID, idB: ID, page: Int, perPage: Int): [Message]


        Papers(params: String, page:Int, perPage:Int): PapersAndPageNum
        searchPapersByScholarId(scholarId:ID):[Paper]
        getPaperById(paperId: ID): PaperWithCommentsRelatedWorks
        filterPapers(title:String,venue:String,author:String,keyword:String): [Paper]

        Scholars(params: String,page:Int, perPage:Int): ScholarsAndPageNum
        findScholarById(scholarId:ID):ScholarAndFollowing
        "获取当前用户是否已经收藏该论文"
        isFavorite(paperId:ID):Boolean

        currentUser:UserInfo
    }

    type Mutation {
        loadCoAuthors(path: String = "/Users/chencongyong/Downloads/coauthor_info_sample.json"): [ID]
        createAuthentication(params: AuthenticationInput): Authentication
        deleteAuthentication(authenticationId: ID!): String

        "创建一个学者主页申请。"
        updateAuthentication(authenticationId: ID!, params: AuthenticationInput): Authentication


        createComment(params: CommentInput): Comment
        deleteComment(commentId: ID!): String
        updateComment(commentId: ID!, params: CommentInput): Comment

        sendAMessage(params: MessageInput): Message

        createPaper(params: PaperInput): Paper
        deletePaper(id: ID!): String
        updatePaper(id: ID!, params: PaperInput): Paper
        favorite(paperId:ID):User

        createScholar(params: ScholarInput): Scholar
        deleteScholar(id: ID): String
        Scholar(id: ID, params: ScholarInput): Scholar
        follow(scholarId:ID):User
        addTags(params:updateTagsInput):Scholar
        removeTags(params:updateTagsInput):Scholar
        updateBulletin(scholarId:ID,bulletin:String):Scholar

        register(params: RegisterInput): User
        registerAdmin(params: RegisterInput): User
        updateUserInfo(name: String, password: String, email: String,avatar: String, personalProfile: String, role: Boolean): User
    }
`;