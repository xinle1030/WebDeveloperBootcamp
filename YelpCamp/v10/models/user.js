var mongoose = require("mongoose");

// add in passport local mongoose to our user model 
var passportLocalMongoose = require("passport-local-mongoose");


const UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

// add in passport local mongoose to our user model 
// add passport local mongoose package containing diff. methods to our user schema 
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);