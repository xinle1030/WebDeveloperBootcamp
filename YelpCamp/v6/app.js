// do in one line
var express                 = require("express"),
    app                     = express(),
    bodyParser              = require("body-parser"),
    mongoose                = require("mongoose"), 
    Campground              = require("./models/campground"),
    seedDB                  = require("./seeds"),
    Comment                 = require("./models/comment"),
    passport                = require("passport"),
    LocalStrategy           = require("passport-local"),
    passportLocalMongoose   = require("passport-local-mongoose"),
    User                    = require("./models/user") // user model
/*
whenever there is a form, install body-parser package using npm install
and require it here
*/
var bodyParser = require("body-parser");

// tell you app to use bodyParser
app.use(bodyParser.urlencoded({extended: true}));

// tell my app to use public directory 
// __dirname : directory that this script was running 
app.use(express.static(__dirname + "/public"));

app.set("view engine", "ejs");

mongoose.connect('mongodb://localhost/yelp_camp_v6', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

// run predefined data 
// refer to seed.js
seedDB();

/*PASSPORT CONFIGURATION*/

/*
To use express-session
Combining both require and use statement in one single func
*/
app.use(require("express-session")({
    // options
    secret: "Once again Rusty win cutest Dog!", // to encode and decode the session information 
    resave: false,
    saveUninitialized: false
}));

// tell this app to use our passport 
/*
To use Passport in an Express or Connect-based application, configure it with the required passport.initialize() middleware. 
If your application uses persistent login sessions (recommended, but not required), passport.session() middleware must also be used.
*/
app.use(passport.initialize());
app.use(passport.session());

/*
create a LocatStrategy object using User.authenticate() method that comes from passportLocalMongoose
as we have this line "UserSchema.plugin(passportLocalMongoose);" in user.js
then tell our passport to use the LocalStrategy object
*/
passport.use(new LocalStrategy(User.authenticate()));
/*
We dh to define method body for passport.serializeUser() and passport.deserializeUser()
and just nid to provide User.serializeUser() and User.deserializeUser()
because in models/user.js, we had added UserSchema.plugin(passportLocalMongoose);
so we had added those methods automatically and we dh to define those methods on our own
*/
/*
passport.serializeUser():
encoding the session data, then serializing it and putting it back to the session
*/

passport.serializeUser(User.serializeUser());

/*
passport.deserializeUser():
read the session, taking the encoded data from the session and decoding them
*/
passport.deserializeUser(User.deserializeUser());

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

// pass current user to every files by making the app to use the user itself
/* req.user contains all information about an user
    - req.user will be either empty if there is no current user log i 
    - else it will contain information about the currently signed in user
*/
app.use(function(req, res, next){
    // res.locals - whatever is available inside our templates
    // this is a middleware that will run for every route
   res.locals.currentUser = req.user;
   // then move to the actual next code
   next();
});

//============
// ROUTES
//============

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
          res.render("campgrounds/index",{campgrounds:allCampgrounds});
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
     res.render("campgrounds/new");
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

// ====================
// COMMENTS ROUTES
// ====================

// add a middleware isLoggedIn prior to rendering comment form
// only if user has logged in, only then he can give a comment 
// render comment form
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
    // find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {campground: campground});
        }
    })
});

// add a middleware isLoggedIn prior to rendering comment form
// only if user has logged in, only then he can give a comment 
// submit the form to this route to add new comment
app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
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

//  ===========
//  AUTH ROUTES
//  ===========

// show register form
app.get("/register", function(req, res){
   res.render("register"); 
});
//handle sign up logic
app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/campgrounds"); 
        });
    });
});

// show login form
app.get("/login", function(req, res){
   res.render("login"); 
});
// handling login logic
app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
});

// logout route
app.get("/logout", function(req, res){
   req.logout();
   res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}



app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The YelpCamp Server has Started!");
});