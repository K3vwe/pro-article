// Database Connection JS File

const mongoose = require('mongoose');

module.exports = {
    connect: DB_HOST => {
        // // use the Mongo Driver's updated URL string parser
        // mongoose.set('useNewUrlParser', true);
        // // use findOneandUpdate() in place of findAndModify()
        // mongoose.set('useFindAndModify', false);
        // // Use createIndex in place of ensureIndex()
        // mongoose.set('useCreateIndex', true);
        // // Use the new server discovery and mointoring Engine
        // mongoose.set('useUnifiedTopology', true);

        // Connect to the DB
        mongoose.connect(DB_HOST);

        // Log an error if connection failed
        mongoose.connection.on('error', err => {
            console.log('MongoDB Connection error. Please make sure MongoDB is running');
            process.exit();
        });
    },

    close: () => {
        mongoose.connection.close();
    }
};