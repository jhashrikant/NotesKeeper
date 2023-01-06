const connectToMongo = require('./db');
const express = require('express');
var cors = require('cors');

// console.log(process.env.JWT_SECRET);

connectToMongo();

const app = express();
app.use(cors())
const {PORT} = require('./config/keys');

app.use(express.json());
//app.use ek middleware hai

//Available routes
//app.use krke routes ko link kreg abb
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));


// app.get('/', (req, res) => {
//   res.send('Hello World! ima express');
// })


// if (process.env.NODE_ENV == 'production') {
//   const path = require('path');

//   app.get('/', (req, res) => {
//     app.use(express.static(path.resolve(__dirname,'build')))
//     res.sendFile(path.resolve(__dirname,'build','index.html'))
//   })
// }

app.listen(PORT, () => {
  console.log(`INotebook backend listening on port ${PORT}`);
})