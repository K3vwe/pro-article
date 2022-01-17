
module.exports = {
    notes: async (parent, args, { models }) => {
        return await models.Note.find();
    },
    note: async (parent, args, { models }) => {
        return await models.Note.findById(args.id)
    },
    users: async (parent, args, { models }) => {
        return await models.User.find({});
    },
    user: async (parent, { username }, { models }) => {
        return await models.User.findOne({ username });
    },
    me: async (parent, args, { models, user }) => {
        return await models.User.findById(user.id);
    },
    noteFeed: async (parent, { cursor }, { models }) => {
        // hardcode the note limit
        const limit = 10;
        // Set the default hasNextValue to false
        let hasNextPage = false;
        // Default cursor query, holds the newest note in the database
        let cursorQuery = {};

        // if cursor, the query will look for note with an ObjectId less than cursor
        if(cursor) {
            cursorQuery = { _id: { $lt: cursor } };
        };

        let notes = await models.Note.find(cursorQuery)
        .sort({ _id: -1})
        .limit(limit + 1 );

        // if the number of notes found exceeds the limit, trim to limit
        // set hasNextPage to true

        if(notes.length > limit){
            hasNextPage = true;
            notes = notes.slice(0, -1);
        }

        // The cursor will have the ObjectId of the last item in the feed array
        let newCursor = notes[notes.length - 1]._id;

        return {
            notes,
            cursor: newCursor,
            hasNextPage,
        }
    }
}