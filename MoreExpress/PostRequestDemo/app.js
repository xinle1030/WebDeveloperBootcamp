/*
var app = require("express")();
*/
var express = require("express");
var app = express();

/*
whenever there is a form, install body-parser package using npm install
and require it here
*/
var bodyParser = require("body-parser");

// tell you app to use bodyParser
app.use(bodyParser.urlencoded({extended: true}));

// tell our app to use public directory 
app.use(express.static("public"));
app.set("view engine", "ejs");  // set all the render file names to use ejs extension

var friends = ["P1", "P2", "P3"];

app.get("/", function(req, res){
    res.render("home");   
})

app.get("/friends", function(req, res){
    res.render("friends", {friends : friends});   
})

// post request 
app.post("/addfriend", function(req, res){
    var newFriendName = req.body.newFriendName; // to retrieve the value submitted via the form
    friends.push(newFriendName);
    // redirect to this page and trigger app.get("/friends", ...) to run
    res.redirect("/friends");
})

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started!!!");
})