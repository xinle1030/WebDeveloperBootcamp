var express = require("express");
var router  = express.Router({mergeParams: true});      // to access :blahblah in the route

// require those models
// go to outer folder (one step outside) using ..
var Campground = require("../models/campground");
var Comment = require("../models/comment");

// to use the middleware funcs
var middleware = require("../middleware");

// ====================
// COMMENTS ROUTES
// ====================

// COMMENTS NEW
// add a middleware isLoggedIn prior to rendering comment form
// only if user has logged in, only then he can give a comment 
// render comment form
router.get("/new", middleware.isLoggedIn, function(req, res){
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
router.post("/", middleware.isLoggedIn, function(req, res){
   //lookup campground using ID
   Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       } else {
         //create new comment
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               req.flash("error", "Something went wrong");
               console.log(err);
           } else {
               // add username and id to a newly created Comment
               // req.user refers to the currently signed in user 
               comment.author.id = req.user._id;    // currently signed in user has a default id by means of mongoDB
               comment.author.username = req.user.username
               comment.save();
               // save comment 
               //connect new comment to campground
               campground.comments.push(comment);
               campground.save();   // rememeber to save the newly updated campground
               req.flash("success", "Successfully added comment");
               //redirect campground show page
               res.redirect('/campgrounds/' + campground._id);
           }
        });
       }
   });
});

// COMMENT EDIT ROUTE - render a form to edit the comment 
router.get("/:comment_id/edit", middleware.checkUserComment, function(req, res){
   Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){
          // res.redirect("back");
      } else {
          // render the edit.ejs in views/comments folder
          
          // refer to app.js, we have a line called "app.use("/campgrounds/:id/comments", commentRoutes);"
          // so the :id in the route above actually is req.params.id, which is campground id
          
          // plug in the campground_id an and comment in the comments/edit.ejs
        res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
      }
   });
});

// COMMENT UPDATE
router.put("/:comment_id", middleware.checkUserComment, function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
      if(err){
          res.redirect("back");
      } else {
          res.redirect("/campgrounds/" + req.params.id);
      }
   });
});

// COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleware.checkUserComment, function(req, res){
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
       } else {
           req.flash("success", "Comment deleted");
           // req.params.id refers to campground id 
           res.redirect("/campgrounds/" + req.params.id);
       }
    });
});

// then this file will export the router object on which different methods are invoked on it 
// to direct to different routes
module.exports = router;