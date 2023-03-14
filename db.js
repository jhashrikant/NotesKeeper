require('dotenv').config();
const mongoose = require('mongoose');
const MONGOURI = process.env.MONGOURL;


mongoose.set('strictQuery', false);

const connectToMongo = async () => {
    try {
        await mongoose.connect(MONGOURI);
        console.log("connected to MongoDB successfully");
    }
    catch (error) {
        console.log(error);
        console.log("database connection failed")
        process.exit(1);
    }
}

module.exports = connectToMongo;