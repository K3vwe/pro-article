const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core');
const http = require('http');

require('dotenv').config();

// Read the port from .env file and if unavaliable use 4000
const port = process.env.PORT || 4000;

const typeDefs = gql`
    type Query {
        hello: String!
    }
`;

const resolvers = {
    Query: {
        hello: () => "Hello World!"
    }
}

async function startApolloServer(){

    const app = express();
    const httpServer = http.createServer(app);
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });

    await server.start();

    server.applyMiddleware({ app, path: '/'});
    
    await new Promise(resolve => httpServer.listen({ port }, resolve));

    console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath} ` )

}

startApolloServer()