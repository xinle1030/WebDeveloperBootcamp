var express = require("express");
var app = express();

app.get("/", function(req, res){
    res.send("Hi there, welcome to my assignment");
})

app.get("/speak/:animal", function(req, res){
    var animal = req.params.animal.toLowerCase();
    var sound = "";
    var sounds = {
      pig: "Oink",
      cow: "Moo",
      dog: "Woof Woof!"
    };
    // switch (animal) {
    //     case "pig":
    //         sound = "Oink";
    //         break;
    //     case "cow":
    //         sound = "Moo";
    //         break;
    //     case "dog":
    //         sound = "Woof Woof!";
    //         break;
    //     default:
    //         sound = "Unknown";
    // }
    if (sounds[animal]){
        sound = sounds[animal];
    }
    res.send(`The ${animal} says '${sound}'`);
})

app.get("/repeat/:str/:counter", function(req, res){
    var result = "";
    var str = req.params.str;
    var counter = req.params.counter;
    for (var i = 0; i < counter; i++){
        result += `${str} `;
    }
    res.send(result);
})

app.get("*", function(req, res){
    res.send("Sorry, page not found.. What are you doing with your life?");
})

/*
Tell Express to listen for requests (start server)
*/
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started !!!");
});