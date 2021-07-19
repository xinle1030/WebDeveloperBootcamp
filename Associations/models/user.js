const mongoose = require('mongoose');

// USER - email, name
const userSchema = new mongoose.Schema({
  email: String,
  name: String,
  // Using References for association (1-many relationship)
  // each user now has an array of posts
  // array here store multiple posts object ids which reference to its post objects 
  posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }
    ]
});

// return value of a model
module.exports = mongoose.model("User", userSchema);