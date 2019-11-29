// @ts-check

const { ApolloServer, PubSub } = require('apollo-server-express');
const mongoose = require('mongoose');
const express = require('express');

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
require('dotenv').config();

const pubsub = new PubSub();

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req, pubsub })
});

const app = express();

server.applyMiddleware({ app, path: '/' });

const port = process.env.PORT || 5001;

async function establishMongooseConnection() {
    const connection = await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
        console.log('MongoDB connected');
        return app.listen({ port }, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    })
    return connection
}

establishMongooseConnection()
// const userModel = require("./models/User");
// const paperModel = require("./models/Paper");
// const loadExampleData = require('./util/loadData');

// async function _test() {
//     await establishMongooseConnection();
//     const [authors, papers] = loadExampleData();
//     userModel.collection.insertMany(authors).then(() => console.log("Finished!"));
//     paperModel.collection.insertMany(papers);
// }

// _test();