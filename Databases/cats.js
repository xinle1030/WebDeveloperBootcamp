// Using Node.js `require()`
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/cat_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

// Defining a Model (pattern for the data of a cat)
// Models are defined through the Schema interface.
var catSchema = new mongoose.Schema({
   name: String,
   age: Number,
   temperament: String
});

// compile the cat schema into a model and save to a variable Cat
var Cat = mongoose.model("Cat", catSchema);

//adding a new cat to the DB

// var george = new Cat({
//     name: "Mrs. Norris",
//     age: 7,
//     temperament: "Evil"
// });

// to save the cat into database
// pass a callback to save function to check whether the cat is saved successfully to the database

// george.save(function(err, cat){
//     if(err){
//         console.log("SOMETHING WENT WRONG!")
//     } else {
//         console.log("WE JUST SAVED A CAT TO THE DB:")
//         console.log(cat);
//     }
// });

// combine two function above in one step using create method
// create a new cat and add to database
Cat.create({
  name: "Snow White",
  age: 15,
  temperament: "Bland"
}, function(err, cat){
    if(err){
        console.log(err);
    } else {
        console.log(cat);
    }
});

//retrieve all cats from the DB and console.log each one
// @param1: empty obj
// @param2: pass callback to finf func to check if the method is successfully executed
Cat.find({}, function(err, cats){
    if(err){
        console.log("OH NO, ERROR!");
        console.log(err);
    } else {
        console.log("ALL THE CATS.....");
        console.log(cats);  // result of .find saved inside second parameter of callback which is cats
    }
});