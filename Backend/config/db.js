const mongoose = require('mongoose');
const colors = require('colors');

const ConnectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`Mongoose Connected: ${conn.connection.host}`.blue.bold);
    } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit();
    }
};

module.exports = ConnectDB;
