const mongoose = require('mongoose');

// POST - title, content
const postSchema = new mongoose.Schema({
  title: String,
  content: String
});

// return value of a model
module.exports = mongoose.model("Post", postSchema);