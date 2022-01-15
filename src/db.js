// Database Connection JS File

const mongoose = require('mongoose');

module.exports = {
    connect: DB_HOST => {

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