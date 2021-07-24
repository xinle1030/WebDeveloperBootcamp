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
    User                    = require("./models/user"), // user model
    methodOverride          = require("method-override")    // to allow you to use HTTP verbs such as PUT or DELETE in places where the client doesn't support it.


// Refactor our routes into separate files
//requring routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index")

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

mongoose.connect('mongodb://localhost/yelp_camp_v10', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

// run predefined data to seed the data
// refer to seed.js
// seedDB();

// configure the app to use method-override
// override with the "_method" header in the request
app.use(methodOverride("_method"));

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

/*
Tell our apps to use all these routes which locate in different files

.use()
@param1: wil be automatically add to the header of the routes in differrent routes , so we can shorten the routes in each file
*/

//  ===========
//  INDEX ROUTES (containing AUTH ROUTES) - all index routes start with /
//  ===========
app.use("/", indexRoutes);

//============
// CAMPGROUNDS ROUTES - all campgrounds routes start with /campgrounds
//============
app.use("/campgrounds", campgroundRoutes);

// ====================
// COMMENTS ROUTES - all comments routes start with /campgrounds/:id/comments
// ====================
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The YelpCamp Server has Started!");
});