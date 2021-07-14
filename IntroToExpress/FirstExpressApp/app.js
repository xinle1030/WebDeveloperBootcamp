var express = require("express");
var app = express();

/*
ROUTES
*/

// "/" => "Hi there"
app.get("/", function(request, response){
    response.send("Hi, there!");
})

// "/bye" => "Goodbye!"
app.get("/bye", function(request, response){
    response.send("Goodbye!");
})

// "/dog" => "MEOW!"
app.get("/dog", function(request, response){
    response.send("MEOW");
})

// Route Paramters, use : to match with this pattern /r/??, then it will this function 
app.get("/r/:subredditName", function(request, response){
    var subreddit = request.params.subredditName;   // access to the paramters in the url typed in the browser
    response.send(`Welcome To a ${subreddit} Subreddit`);
})

// Route Paramters, use : to match with this pattern /r/comments/?/?, then it will this function 
app.get("/r/comments/:id/:title", function(request, response){
    // access to the paramters in the url typed in the browser
    var id = request.params.id;  
    var title = request.params.title;  
    response.send(`Welcome To a Comments Page \n id: ${id} \n title: ${title}`);
})


// ORDER MATTERS, so put this line of code at the end after all other routes had been declared
// * makes this line of code to get triggered everytime this app gets any GET request regardless of the route
// aside from the routes that specifically mention which function will run 
app.get("*", function(request, response){
    response.send("YOU ARE A STAR");
})

/*
Tell Express to listen for requests (start server)
*/
/*  listen()
    @param1: port number
    @param2: hostname IP
*/
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started !!!");
});