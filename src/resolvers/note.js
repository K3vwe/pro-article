// Resolver for nested queries on note
module.exports = {

    // Resolve author info for a note when requested
    author: async (note, args, { models }) => {
        return await models.User.findById(note.author)
    },

    // Resolve the favoritedBy info for a note when requested
    favoritedBy: async(note, args, { models }) => {
        return await models.Note.find({ _id: {$in: note.favoritedBy}})
    }
};