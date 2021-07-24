var Campground = require("../models/campground");
var Comment = require("../models/comment");

// all the middleare goes here
var middlewareObj = {};

middlewareObj.checkUserCampground = function(req, res, next) {
    // first check if current user has logged in 
 if(req.isAuthenticated()){
     // first find the campground
        Campground.findById(req.params.id, function(err, foundCampground){
           if(err){
               res.redirect("back");
           }  else {
               // does user own the campground?
              // check if the user owns the campground, which checks if the currenly logged in user create the campground or not 
              // campground.author.id is an object 
              // req.user._id is a string 
              // so we use .equals() to check if the value is the same
            if(foundCampground.author.id.equals(req.user._id)) {
                next();
            } else {
                res.redirect("back");
            }
           }
        });
    } else {
        res.redirect("back");
    }
}

middlewareObj.checkUserComment = function(req, res, next) {
 if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
           if(err){
               res.redirect("back");
           }  else {
               // does user own the comment?
            if(foundComment.author.id.equals(req.user._id)) {
                next();
            } else {
                res.redirect("back");
            }
           }
        });
    } else {
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    // check if user has logged in 
    if(req.isAuthenticated()){
        // if yes, allows the next function after this current func to be carried out which is referred by next()
        return next();
    }
    res.redirect("/login");
}

module.exports = middlewareObj;