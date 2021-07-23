var express = require("express");
var router  = express.Router({mergeParams: true});      // to access :blahblah in the route

// require those models
// go to outer folder (one step outside) using ..
var Campground = require("../models/campground");
var Comment = require("../models/comment");

// ====================
// COMMENTS ROUTES
// ====================

// COMMENTS NEW
// add a middleware isLoggedIn prior to rendering comment form
// only if user has logged in, only then he can give a comment 
// render comment form
router.get("/new", isLoggedIn, function(req, res){
    // find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {campground: campground});
        }
    })
});

// COMMENTS CREATE
// add a middleware isLoggedIn prior to rendering comment form
// only if user has logged in, only then he can give a comment 
// submit the form to this route to add new comment
router.post("/", isLoggedIn, function(req, res){
   //lookup campground using ID
   Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       } else {
         //create new comment
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
               //connect new comment to campground
               campground.comments.push(comment);
               campground.save();   // rememeber to save the newly updated campground
               //redirect campground show page
               res.redirect('/campgrounds/' + campground._id);
           }
        });
       }
   });
});

// MIDDLEWARE
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

// then this file will export the router object on which different methods are invoked on it 
// to direct to different routes
module.exports = router;