// var Comment = require("../models/comment");
// var Campground = require("../models/campground");

// // make this file to export multiple middleware functions that are in a form of a big object
// // whereby each key is the function name
// //         each value is the corresponding function body
// module.exports = {
//     isLoggedIn: function(req, res, next){
//         // check if user has logged in 
//         if(req.isAuthenticated()){
//             // if yes allows the next function after this current func to be carried out which is referred by next()
//             return next();
//         }
//         console.log("error", "You must be signed in to do that!");
//         res.redirect("/login");
//     },
//     checkUserCampground: function(req, res, next){
//         // first check if current user has logged in 
//         if(req.isAuthenticated()){
//             // first find the campground
//             Campground.findById(req.params.id, function(err, campground){
//                 // check if the user owns the campground, which checks if the currenly logged in user create the campground or not 
//               // ampground.author.id is an object 
//               // req.user._id is a string 
//               // so we use .equals() to check if the value is the same
//               if(campground.author.id.equals(req.user._id)){
//                   next();
//               } else {
//                   console.log("error", "You don't have permission to do that!");
//                   res.redirect("/campgrounds/" + req.params.id);
//               }
//             });
//         } else {
//             console.log("error", "You need to be signed in to do that!");
//             res.redirect("/login");
//         }
//     },
//     checkUserComment: function(req, res, next){
//         console.log("YOU MADE IT!");
//         if(req.isAuthenticated()){
//             Comment.findById(req.params.commentId, function(err, comment){
//                 if (err){
//                     console.log("cannot find comment");
//                 }else{
//                 console.log(comment);
//                 if(comment.author.id.equals(req.user._id)){
//                   next();
//               } else {
//                   console.log("error", "You don't have permission to do that!");
//                   res.redirect("/campgrounds/" + req.params.id);
//               }
//                 }
//             });
//         } else {
//             console.log("error", "You need to be signed in to do that!");
//             res.redirect("login");
//         }
//     }
// }

var Campground = require("../models/campground");
var Comment = require("../models/comment");

// all the middleare goes here
var middlewareObj = {};

/*
PLACE ALL THE REQ.FLASH() TO SET THE FLASH MESSAGE BEFORE RES.REDIRECT()
- this means that we had set a flash message
- then we will handle to display the flash message in the corresponding html page (which is header.ejs in this case) of the routes specified in res.redirect()
- and because we have the line
    "res.locals.error = req.flash("error");"
    "res.locals.success = req.flash("success");"
    in app.js
    - so the flash message will be passed to the every page's error and success variables
*/

middlewareObj.checkUserCampground = function(req, res, next) {
    // first check if current user has logged in 
 if(req.isAuthenticated()){
     // first find the campground
        Campground.findById(req.params.id, function(err, foundCampground){
           if(err){
               // Set a flash message by passing the key, followed by the value, to req.flash().
               req.flash("error", "Campground not found");
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
                // Set a flash message by passing the key, followed by the value, to req.flash().
                req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
           }
        });
    } else {
        // Set a flash message by passing the key, followed by the value, to req.flash().
        req.flash("error", "You need to be logged in to do that");
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
                // Set a flash message by passing the key, followed by the value, to req.flash().
                req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
           }
        });
    } else {
        // Set a flash message by passing the key, followed by the value, to req.flash().
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    // check if user has logged in 
    if(req.isAuthenticated()){
        // if yes, allows the next function after this current func to be carried out which is referred by next()
        return next();
    }
    // Set a flash message by passing the key, followed by the value, to req.flash().
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

module.exports = middlewareObj;