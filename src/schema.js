const { gql } = require('apollo-server-express');

module.exports=gql`
    scalar DateTime

    type Note {
        id: ID!
        content: String!
        author: User!
        createdAt: DateTime!
        updatedAt: DateTime!
        favoriteCount: Int!
        favoritedBy: [User!]
    }
    
    type User {
        id: ID!
        email: String!
        username: String!
        avatar: String!
        notes: [Note!]!
        favorites: [Note!]!
    }

    type NoteFeed {
        notes: [Note!]!
        cursor: String!
        hasNextPage: Boolean!
    }

    type Query {
        notes: [Note!]!
        note(id: ID!): Note!
        noteFeed(cursor: String): NoteFeed
        user(username: String!): User
        users: [User!]!
        me: User!

    }

    type Mutation {
        newNote(content: String!): Note!
        updateNote(id: ID!, content: String!): Note!
        deleteNote(id: ID!): Boolean!
        signUp(email: String!, username: String!, password: String!): String! 
        signIn(email: String, username: String, password: String!): String!
        toggleFavorite(id: ID!): Note! 
    }
`;