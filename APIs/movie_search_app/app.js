var express = require("express");
var app = express();

app.set("view engine", "ejs");

/*use axios npm package to make HTTP request*/
const axios = require('axios');
const apiKey = 'fe947b6a';


app.get('/', async (req, res) => {
    res.render("search");
});

app.get('/results', async (req, res) => {
    var searchStr = req.query.movieTitle;
    try{
        const response = await axios.get(`https://www.omdbapi.com/?s=${searchStr}&apikey=${apiKey}`);
        var data = response.data;
        res.render("results", {data : data});
    }
    catch(error){
        console.log(error);
}});

// Server at AWS C9
/*
Tell Express to listen for requests (start server)
*/
// app.listen(process.env.PORT, process.env.IP, function(){
//     console.log("Server has started !!!");
// });

// Server at local host
app.listen(5000, function(){
    console.log("Server has started !!!");
});