const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { AuthenticationError, ForbiddenError } = require('apollo-server-express');
require('dotenv').config();

module.exports = {
    // Mutation syntax to create new note
    newNote: async (parent, args, { models }) => {
        return await models.Note.create({
            content: args.content,
            author: 'Markov'
        });
    },

    // Mutation to Update Existing Note
    updateNote: async (parent, {id, content}, { models }) => {
        return await models.Note.findOneAndUpdate(
            {
                _id: id
            },
            {
                $set: {
                    content
                }
            },
            {
                new: true
            }
        );
    },

    // Mutation to delete note
    deleteNote: async (parent, { id }, { models }) => {
        try {
            await models.Note.findOneAndRemove({ _id: id });
            return true;
        } catch (err) {
            return false;
        }
    },

    // Mutation to create a new user
    signUp: async (parent, { email, username, password }, { models }) => {
        // trim all spaces from email
        email = email.trim().toLowerCase();

        // hash the password
        const hashed = await bcrypt.hash(password, 10);

        // Create the Gravatar image
        
        try {
            const user = await models.User.create({
                email,
                username,
                password: hashed
            });

            // Return the JWT
            return await jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        } catch(err) {
            console.log(err);
            // if there is a problem creating an account throw an error
            throw new Error('error creating account');
        }
    },

    // Mutation to process user signin
    signIn: async(parent, {username, email, password}, { models }) => {
        // nomalize email address
        if(email){
            email = email.trim().toLowerCase();
        };

        const user = await models.User.findOne({
            $or: [{email}, { username }]
        });

        // if no user is found throw an Authentication Error
        if(!user){
            throw new AuthenticationError('Error signing in')
        };

        // Verify the user password
        const valid = await bcrypt.compare(password, user.password);
        // if password is invalid, throw authentication error
        if(!valid) {
            throw new AuthenticationError('Error signing in');
        };

        // return the JWT token
        return await jwt.sign({id: user._id}, process.env.JWT_SECRET);

    }
}