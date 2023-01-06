// const MONGOURI = "mongodb://localhost:27017/inotebook";
const {MONGOURI} = require('./config/keys');
const mongoose = require('mongoose');


const mongoURI = MONGOURI;

mongoose.set('strictQuery', false);

const connectToMongo =() => {
    mongoose.connect(mongoURI,()=>{
        console.log("connected to MongoDB successfully");
    });
}

module.exports = connectToMongo;