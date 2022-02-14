const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core');
const http = require('http');
const jwt = require('jsonwebtoken');

const helmet = require('helmet');
const cors = require('cors');

const depthLimit = require('graphql-depth-limit');
const { createComplexityLimitRule } = require('graphql-validation-complexity');

require('dotenv').config();
// Database Connection File
const db = require('./db');

// Read the port from .env file and if unavaliable use 4000
const port = process.env.PORT || 4000;
const DB_HOST = process.env.DB_HOST;

// Get the user info using the JWT
const getUser = token => {
    if(token) {
        try {
            // Return user information from the JWT
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch(err) {
            // throw error if jwt is not valid
            throw new Error('Session invalid'); 
        }
    }
}

async function startApolloServer(){

    const models = require('./models');
    const typeDefs = require('./schema');
    const resolvers = require('./resolvers')

    const app = express();
    // add web and GraphQL appllication security
    // app.use(helmet());
    app.use(cors());

    db.connect(DB_HOST);

    const httpServer = http.createServer(app);
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        validationRules: [depthLimit(5), createComplexityLimitRule(1000)],
        context: ({ req }) =>  {
            // get th euser token from the request
            const token = req.headers.authorization;
            // retrieve a user information from the token
            const user = getUser(token);
            if(user) {
                // log the user info to the console
                console.log(user);
            }

            // Add database model and the user to the context
            return { models, user }
        },
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });

    await server.start();

    server.applyMiddleware({ app, path: '/'});
    
    await new Promise(resolve => httpServer.listen({ port }, resolve));

    console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath} ` )

}

startApolloServer()