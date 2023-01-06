const mongoose = require('mongoose');
const { Schema } = mongoose;

const NotesSchema = new Schema({
  //the below iss like foreign key in sql mtlb konsa user use krra hai ye notes
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true,
  },

  tag: {
    type: String,
    default: "General"
  },

  date: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model('notes',NotesSchema);