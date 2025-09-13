// server/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://kavindu24:24112000Kk@cluster0.wy5ilgb.mongodb.net/', {
    
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        });
        console.log('✅ Successfully connected to the database');
    } catch (error) {
        console.error('Could not connect to the database', error);
        process.exit(1);
    }
};

module.exports = connectDB;
