var express = require("express");
var app = express();

/*
whenever there is a form, install body-parser package using npm install
and require it here
*/
var bodyParser = require("body-parser");

// tell you app to use bodyParser
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

var campgrounds = [
        {name: "camp1", image: "https://pixabay.com/get/gd13e3addf1e7d8cf3fdd3fab643c78674cb0f5f815ab7d4724e6910760e497d97a2b39e4e4779ec1dad5dbe64c2cf095_340.png"},
        {name: "camp2", image: "https://pixabay.com/get/gd4c7aa90a3377fd8cc8692c5d72d1d66bf9e651577fe6df1177db42349396ee7ae562183b1fcdd87d988b6d11306f291_340.jpg"},
        {name: "camp3", image: "https://pixabay.com/get/gd3a9e809dc82f8cc1e65a5136d42888a0c51044165e2d65e2ad8879b1fb440fe11146533c6d9030947f098fdc285299d_340.jpg"}
];

app.get("/", (req, res) => {
    res.render("landing");
});

/* show you all campgrounds */
app.get("/campgrounds", (req, res) => {
     res.render("campgrounds", {campgrounds : campgrounds});
});

/* create a new campground*/
// we can have same url but wif different request, they will still be considered as different routes
app.post("/campgrounds", (req, res) => {
    // get data from the form and add to campgrounds array 
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name: name, image: image};
    campgrounds.push(newCampground);
    // redirect back to campgrounds page
    res.redirect("/campgrounds");
});

/* show the form that will send the data to the post campgrounds route*/
app.get("/campgrounds/new", (req, res) => {
     res.render("new");
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The YelpCamp Server has Started!");
});