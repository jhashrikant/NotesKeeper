require('dotenv').config();
const connectToMongo = require('./db');
const express = require('express');
var cors = require('cors');
const path = require('path');


connectToMongo();

const app = express();
app.use(cors())

const PORT = process.env.PORT || 5000;

app.use(express.json());
//app.use ek middleware hai

//Available routes
//app.use krke routes ko link kreg abb
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));


// app.use("/", (req, res) => {
//   res.json({ message: "hello from server" });
// });

//serving frontend 
app.use(express.static(path.join(__dirname, "./client/build")))

app.get("*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "./client/build/index.html"),
    function (err) {
      res.status(500).send(err);
    }
  )
})


app.listen(PORT, () => {
  console.log(`NotesKeeper backend listening on port ${PORT}`);
})