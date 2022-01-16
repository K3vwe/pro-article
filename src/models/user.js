// Define how users information will be represented in the database
// Create a schema then a user model which will be exported

// mongoose library
const mongoose = require('mongoose');
const { DateTime } = require('../resolvers');

// Define the userSchema
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        index: { unique: true }
    },
    username: {
        type: String,
        required: true,
        index: { unique: true }
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    }
}, {
    timestamps: true
});

// Define the user model 
const User = new mongoose.model('User', userSchema);

// Export User model
module.exports = User;