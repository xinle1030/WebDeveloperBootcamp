// use router to replace app 
var express = require("express");
var router = express.Router();

// require those models 
// go to outer folder (one step outside) using ..
var Campground = require("../models/campground");

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
router.post("/", (req, res) => {
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

/*/NEW - show the form to create new campground, then the form will be sent to the post campgrounds route*/
router.get("/new", (req, res) => {
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

// then this file will export the router object on which different methods are invoked on it 
// to direct to different routes
module.exports = router;