// use router to replace app 
var express = require("express");
var router = express.Router();

// require those models 
// go to outer folder (one step outside) using ..
var Campground = require("../models/campground");

// to use middleware functions that locate in middleware folder
var middleware = require("../middleware");

//============
// ROUTES
//============

//INDEX - show all campgrounds
router.get("/", function(req, res){
    // Get all campgrounds from DB using .find()
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
           // allCampgrounds here are the campgrounds retrieved from database using .find()
          res.render("campgrounds/index",{campgrounds:allCampgrounds});
       }
    });
    // res.render("campgrounds", {campgrounds : campgrounds})
});

/* CREATE - create a new campground to be added to DB*/
// we can have same url but wif different request, they will still be considered as different routes
router.post("/", middleware.isLoggedIn, (req, res) => {
    // get data from the form and add to campgrounds array 
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    // save an author as an object using currently log in user
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    // var newCampground = {name: name, image: image};
    var newCampground = {name: name, image: image, description: desc, author: author};
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

/*/NEW - show the form to create new campground, then the form will be sent to the post campgrounds route*/
router.get("/new", middleware.isLoggedIn, (req, res) => {
     res.render("campgrounds/new");
});

// must be declared after new
// else browser will treats new as an id
// SHOW - shows more info about one campground
router.get("/:id", function(req, res){
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
            res.render("campgrounds/show", {campground: foundCampground});
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
});


// EDIT CAMPGROUND ROUTE - render a form for editing campground information
// use middleware to check if the user creates the campground
router.get("/:id/edit", middleware.checkUserCampground, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if (err){
            // do smt 
        }
        else{
         res.render("campgrounds/edit", {campground: foundCampground});   
        }
    });
});

// UPDATE CAMPGROUND ROUTE
// use middleware to check if the user creates the campground
router.put("/:id", middleware.checkUserCampground, function(req, res){
    // find and update the correct campground
    /*
    @param1: id of the campground to look for 
    @param2: information that we wish to update to
    @param3: callback
    */
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
       if(err){
           res.redirect("/campgrounds");
       } else {
           //redirect somewhere(show page)
           res.redirect("/campgrounds/" + req.params.id);
       }
    });
});

// DESTROY CAMPGROUND ROUTE
// use middleware to check if the user creates the campground
router.delete("/:id", middleware.checkUserCampground, function(req, res){
   Campground.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/campgrounds");
      } else {
          res.redirect("/campgrounds");
      }
   });
});


// then this file will export the router object on which different methods are invoked on it 
// to direct to different routes
module.exports = router;