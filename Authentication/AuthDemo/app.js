var express = require("express"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    User = require("./models/user"), // user model
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose")

mongoose.connect("mongodb://localhost/auth_demo_app", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});
var app = express();
app.set('view engine', 'ejs');

/*
put this line everytime we using a form and posting data to a request 
*/
app.use(bodyParser.urlencoded({ extended: true }));

/*
To use express-session
Combining both require and use statement in one single func
*/
app.use(require("express-session")({
    // options
    secret: "Rusty is the best and cutest dog in the world", // to encode and decode the session information 
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


//============
// ROUTES
//============

app.get("/", function(req, res) {
    res.render("home");
});

// add a middleware function to check if user is logged in or not 
// middleware will run before the final route callback will run 
app.get("/secret", isLoggedIn, function(req, res) {
    res.render("secret");
});

// Auth Routes
//show sign up form using GET
app.get("/register", function(req, res) {
    res.render("register");
});
//handling user sign up using POST
app.post("/register", function(req, res) {
    /* User.register
     @param1: User object (which is created by passing in username only because we would not save password in the database)
     @param2: password that will be hashed and saved to the User object
     @param3: callback
    */
    User.register(new User({ username: req.body.username }), req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            return res.render('register');
        }
        /*
        passport.authenticate("local")
            log user in, store the correct session information
            run serialize user method above
            @param1: stratgey or authentication (can be "local", "twitter")
        */
        passport.authenticate("local")(req, res, function() {
            // once log in, show you the secret page
            res.redirect("/secret");
        });
    });
});

// LOGIN ROUTES
//render login form using GET
app.get("/login", function(req, res) {
    res.render("login");
});
//login logic
//middleware - some code that will run before our final route callback
/*
@param1: path
@param2: authenticate method that will run imeediately as it is a middleware
        (we can have multiple middleware stacked up to run before the final route callback)
@param3: callback
*/
app.post("/login", passport.authenticate("local", {
    successRedirect: "/secret", // if successfully authent8icate, go secret page
    failureRedirect: "/login" // else stay in login page
}), function(req, res) {});

// Logout route
app.get("/logout", function(req, res) {
    req.logout(); // to log user out
    res.redirect("/");
});

// middleware function to check if user is logged in or not 
// this middleware is added to get secret route func above
// takes a third argument next which refers to next middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        // next here refers to the function that is after this middleware
        // in this case, next() refers to the final route callback for secret route
        return next();
    }
    // if the user has not login, eerything will be shortcircuited such that the function next after this middleware cannot run
    // in this case, the final route callback will never run so user cannot reach secret page 
    // instead user will redirect to login page
    res.redirect("/login");
}

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("server started.......");
})