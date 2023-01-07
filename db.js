// const MONGOURI = "mongodb+srv://shrikantjha:Shri%402611@cluster0.sfjynt8.mongodb.net/NotesKeeper";
// const MONGOURI="mongodb+srv%3A//shrikantjha%3AShri%402611@cluster0.sfjynt8.mongodb.net/test"

const {MONGOURI} = require('./configs/.env')
const mongoose = require('mongoose');


const mongoURI = MONGOURI;

mongoose.set('strictQuery', false);

const connectToMongo =() => {
    mongoose.connect(mongoURI,()=>{
        console.log("connected to MongoDB successfully");
    });
}

module.exports = connectToMongo;