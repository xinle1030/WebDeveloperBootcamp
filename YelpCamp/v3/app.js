// do in one line
var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"), 
    Campground = require("./models/campground"),
    seedDB     = require("./seeds"),
    Comment = require("./models/comment")
/*
whenever there is a form, install body-parser package using npm install
and require it here
*/
var bodyParser = require("body-parser");

// tell you app to use bodyParser
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

mongoose.connect('mongodb://localhost/yelp_camp_v3', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

// run predefined data 
// refer to seed.js
seedDB();

// create()
// @param1: object to be created
// @param2: callback func
// Campground.create(
//      {
//          name: "Granite Hill", 
//          image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg",
//          description: "This is a huge granite hill, no bathrooms.  No water. Beautiful granite!"
         
//      },
//      function(err, campground){
//       if(err){
//           console.log(err);
//       } else {
//           console.log("NEWLY CREATED CAMPGROUND: ");
//           console.log(campground);
//       }
//     });

// var campgrounds = [
//         {name: "camp1", image: "https://pixabay.com/get/gd13e3addf1e7d8cf3fdd3fab643c78674cb0f5f815ab7d4724e6910760e497d97a2b39e4e4779ec1dad5dbe64c2cf095_340.png"},
//         {name: "camp2", image: "https://pixabay.com/get/gd4c7aa90a3377fd8cc8692c5d72d1d66bf9e651577fe6df1177db42349396ee7ae562183b1fcdd87d988b6d11306f291_340.jpg"},
//         {name: "camp3", image: "https://pixabay.com/get/gd3a9e809dc82f8cc1e65a5136d42888a0c51044165e2d65e2ad8879b1fb440fe11146533c6d9030947f098fdc285299d_340.jpg"}
// ];

app.get("/", (req, res) => {
    res.render("landing");
});

/* show all campgrounds */
//INDEX - show all campgrounds
app.get("/campgrounds", function(req, res){
    // Get all campgrounds from DB using .find()
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
           // allCampgrounds here are the campgrounds retrieved from database using .find()
          res.render("index",{campgrounds:allCampgrounds});
       }
    });
    // res.render("campgrounds", {campgrounds : campgrounds})
});

/* create a new campground*/
// we can have same url but wif different request, they will still be considered as different routes
app.post("/campgrounds", (req, res) => {
    // get data from the form and add to campgrounds array 
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    // var newCampground = {name: name, image: image};
    var newCampground = {name: name, image: image, description: desc}
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
});

/* show the form that will send the data to the post campgrounds route*/
app.get("/campgrounds/new", (req, res) => {
     res.render("new");
});

// must be declared after new
// else browser will treats new as an id
// SHOW - shows more info about one campground
app.get("/campgrounds/:id", function(req, res){
    //find the campground with provided ID
    // req.params.id is the id appended to the end of the url
    // there is data association between campground and comment 
    // so use .populate().exec
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            console.log("display");
            console.log(foundCampground);
            //render show template with that campground
            res.render("show", {campground: foundCampground});
        }
    });
    // Campground.findById(req.params.id, function(err, foundCampground){
    //     if(err){
    //         console.log(err);
    //     } else {
    //         //render show template with that campground
    //         res.render("show", {campground: foundCampground});
    //     }
    // });
})

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The YelpCamp Server has Started!");
});