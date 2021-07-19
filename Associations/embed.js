// Using Node.js `require()`
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/embed_database', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

// POST - title, content
const postSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Post = mongoose.model('Post', postSchema);

// USER - email, name
const userSchema = new mongoose.Schema({
  email: String,
  name: String,
  // Embedding Data for association (1-many relationship)
  // each user now has an array of posts
  // we define the data type with another model schema - syntax rule
  posts: [postSchema]
});

const User = mongoose.model('User', userSchema);

// create a new user
var newUser = new User({
    email: "hermione@hogwarts.edu",
    name: "Hermione Granger"
});

// then push an object of a Post following postSchema
// into posts attribute of newUser
newUser.posts.push({
    title: "How to bre polyjuice potion",
    content: "Just kidding.  Go to potions class to learn it!"
});

// then save 
newUser.save(function(err, user){
  if(err){
      console.log(err);
  } else {
      console.log(user);
  }
});

// then usefindOne method() to find the first user object 
// with name = "Hermione Granger"
User.findOne({name: "Hermione Granger"}, function(err, user){
    if(err){
        // console.log(err);
    } else {
        // if found, push another new post to the user
        user.posts.push({
            title: "3 Things I really hate",
            content: "Voldemort.  Voldemort. Voldemort"
        });
        // then save the latest updated user into db
        user.save(function(err, user){
            if(err){
                console.log(err);
            } else {
                console.log();
                console.log(user);
            }
        });
    }
});