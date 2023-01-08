// const MONGOURI = "mongodb+srv://shrikantjha:Shri%402611@cluster0.sfjynt8.mongodb.net/NotesKeeper";
// const MONGOURI="mongodb+srv://shrikantjha:Shri%402611@cluster0.sfjynt8.mongodb.net/test"
// require('dotenv').config({path:'../Backend/.env'})
require('dotenv').config();
const MONGOURI = process.env.MONGOURI || 'mongodb://localhost:27017'
const mongoose = require('mongoose');


mongoose.set('strictQuery', false);

const connectToMongo =() => {
    mongoose.connect(MONGOURI,()=>{
        console.log("connected to MongoDB successfully");
    });
}

module.exports = connectToMongo;