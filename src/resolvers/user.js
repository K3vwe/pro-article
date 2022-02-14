// Resolver for nested query on User
module.exports = {

    // Resolve for a list of notes owned by the user
    notes: async (user, args, { models }) => {
        return await models.Note.find({ author: user._id }).sort({ _id: -1});
    },

    // Resolve a list of favorites notes by a user
    favorites: async (user, args, { models }) => {
        return await models.Note.find({ favoritedBy: user._id }).sort({_id: -1 });
    }
};
