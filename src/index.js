const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core');
const http = require('http');

require('dotenv').config();
// Database Connection File
const db = require('./db');

// Read the port from .env file and if unavaliable use 4000
const port = process.env.PORT || 4000;
const DB_HOST = process.env.DB_HOST;

async function startApolloServer(){

    const models = require('./models');
    const typeDefs = require('./schema');
    const resolvers = require('./resolvers')

    const app = express();
    db.connect(DB_HOST);

    const httpServer = http.createServer(app);
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: () =>  {
            // Add database model to the context
            return { models }
        },
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });

    await server.start();

    server.applyMiddleware({ app, path: '/'});
    
    await new Promise(resolve => httpServer.listen({ port }, resolve));

    console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath} ` )

}

startApolloServer()