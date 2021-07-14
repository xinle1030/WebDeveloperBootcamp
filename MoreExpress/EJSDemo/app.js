/*
var app = require("express")();
*/
var express = require("express");
var app = express();

// tell our app to use public directory 
app.use(express.static("public"));
app.set("view engine", "ejs");  // set all the render file names to use ejs extension

app.get("/", function(req, res){
    res.render("home");     // res.render("home.ejs");
    // res.send("<h1>Welcome to the home page<h1>");
})

app.get("/fallinlovewith/:thing", function(req, res){
    var thing = req.params.thing;
    // pass the variable from url to the page in second paramter of .render() in {}
    res.render("love", {thingVar: thing});      // res.render("love.ejs", {thingVar: thing});
})

app.get("/posts", function(req, res){
    var posts = [
        {title: "Post 1", author: "P1"}, 
        {title: "Post 2", author: "P2"}, 
        {title: "Post 3", author: "P3"}, 
        ];
    // pass the variable here into ejs file
    res.render("posts", {postVar: posts});      // res.render("posts.ejs", {postVar: posts});
})

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started!!!");
})