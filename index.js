// @ts-check

const {ApolloServer, PubSub} = require('apollo-server-express');
const mongoose = require('mongoose');
const express = require('express');

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
require('dotenv').config();

const pubsub = new PubSub();

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req}) => ({req, pubsub})
});

const app = express();

server.applyMiddleware({app, path: '/'});

const port = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
    console.log('MongoDB connected');
    return app.listen({port}, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
});
