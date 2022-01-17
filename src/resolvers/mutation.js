const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { AuthenticationError, ForbiddenError } = require('apollo-server-express');
const mongoose = require('mongoose');
require('dotenv').config();

module.exports = {
    // Mutation syntax to create new note
    newNote: async (parent, { content }, { models, user }) => {
        // Check if a user exists
        if(!user){
            throw new AuthenticationError('You must be signed in to create a note');
        }

        return await models.Note.create({
            content: content,
            // reference the authors mongoose id
            author: mongoose.Types.ObjectId(user.id)
        });
    },

    // Mutation to Update Existing Note
    updateNote: async (parent, {id, content}, { models }) => {
        // Check if a user exists
        if(!user){
            throw new AuthenticationError('You must be signed in to update a note');
        }
        
        // Find the requested note to be deleted
        const note = await models.Note.findById(id);
        // if the note owner and the current owner doesn't match, throw a forbidden error
        if(note && String(note.author) !== user.id){
            throw new ForbiddenError("You don't have permission to update the note")
        }

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
    deleteNote: async (parent, { id }, { models, user }) => {
        // Check if a user exists
        if(!user){
            throw new AuthenticationError('You must be signed in to delete a note');
        }

        // Find the requested note to be deleted
        const note = await models.Note.findById(id);
        // if the note owner and the current owner doesn't match, throw a forbidden error
        if(note && String(note.author) !== user.id){
            throw new ForbiddenError("You don't have permission to delete this note")
        }

        try {
            await note.remove();
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

    },

    toggleFavorite: async (parent, { id }, { models, user }) => {
        // if no active user, throw in an error
        if(!user){
            throw new AuthenticationError();
        };

        // check to see if the user has already favorited the note
        const noteCheck = await models.User.findById(id);
        const hasUser = noteCheck.favoritedBy.indexOf(noteCheck);

        // if the user exists in the list, pull them out and decrement favoriteCount
        if(hasUser >= 0){
            await models.Note.findByIdAndUpdate(
                id,
                {
                    $pull: {
                        favoritedBy: mongoose.Types.ObjectId(id)
                    },
                    $inc: {
                        favoriteCount: -1
                    }
                },
                {
                    // set new to true to return the update doc
                    new: true
                }
            );
        } else {
            // if user doesnt exist in the list, add them to the list and increment favoriteCount
            return await models.Note.findByIdAndUpdate(
                id,
                {
                    $push: {
                        favoritedBy: mongoose.Types.ObjectId(user.id)
                    },
                    $inc: {
                        favoriteCount: 1
                    }
                },
                {
                    // set new to rtrue to return the updated doc
                    new: true
                }
            )
        }
    }
}