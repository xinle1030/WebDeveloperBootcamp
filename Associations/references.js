// Using Node.js `require()`
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/references_database', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

// use module exports
// must need ./ so that the root directory is point to Association which is our current directory
const Post = require("./models/post");
const User = require("./models/user");

// create an user independently first 
User.create({
    email: "bob@gmail.com",
    name: "Bob Belcher"
}, function(err, newUser){
    if(err){
        console.log(err);
    } else {
        console.log(newUser);
    }
});

// then create a post 
// to get added to the ady-created user 
Post.create({
  title: "How to cook the best burger pt. 4",
  content: "AKLSJDLAKSJD"
}, function(err, post){
    User.findOne({email: "bob@gmail.com"}, function(err, foundUser){
        if(err){
            console.log("error");
            console.log(err);
        } else {
            console.log(foundUser);
            // add a new post created to the posts attribute of foundUser
            foundUser.posts.push(post);
            foundUser.save(function(err, data){
                if(err){
                    console.log(err);
                } else {
                    console.log();
                    console.log(data);
                }
            });
        }
    });
});

// Find user
// find all posts for that user
// .populate("posts") - populate the field posts looking up all the object ids, then stick its data in the post array
// .exec() - to start the query, then pass callback to .exec() to check that this function works
User.findOne({email: "bob@gmail.com"}).populate("posts").exec(function(err, user){
    if(err){
        console.log(err);
    } else {
        console.log(user);
    }
});