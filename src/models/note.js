// Define how Note Data will be stored on the database as a JavaScript Object
// (The Boject is referred to as a Mongoose Schema)
// Define the Model of Note Data

// require mongoose library
const mongoose = require('mongoose');

// Define the Note schema
const noteSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    }
},{
    // Assign createdAt and updatedAt fields with a Date type
    timestamps: true
});

// Define the Note model with the Schema
const Note = mongoose.model('Note', noteSchema);

// Export the module

module.exports =  Note;