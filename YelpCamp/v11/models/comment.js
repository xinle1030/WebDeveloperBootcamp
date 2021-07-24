const mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
    text: String,
    // author: String
    // make author to be an object
    author: {
        // make author id to reference to the User model id
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model("Comment", commentSchema);