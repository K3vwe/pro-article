const { model } = require("mongoose");

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
    }
}