/*use axios npm package to make HTTP request*/
const axios = require('axios');
const apiKey = "e1cc8bc848d0e8e0eaf900fff712d073";
const city = 'hawaii';

/*FIRST WAY
 Make a request for a user with a given ID  */
axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`)
  .then(function (response) {
    // handle success
    console.log('here is the response');
    var data = response.data;
    console.log(data);
    // if data sent back is a string, parse it to JSON obj 
    // var parsedData = JSON.parse(data);
    console.log(`Weather in Hawaii today is ${data["weather"][0]["description"]}`);
  })
  .catch(function (error) {
    // handle error
    console.log('there is an error');
    console.log(error);
  })
  .then(function () {
    // always executed
  });
  
  
/*SECOND WAY
use async and await, try and catch block instead
() at the end is to run this function when we run this file */
// (async () => {
//     try{
//         const response = await axios.get('https://jsonplaceholder.typicode.com/todos/1');
//         console.log(response.data);
//     }
//     catch(error){
//         console.log(error);
//     }
// })()

/*THIRD WAY
wrap axios in express to get to a root route, then make http request */
// var app = require("express")();
// app.get('/', async (req, res, next) => {
//     try{
//         const response = await axios.get('https://jsonplaceholder.typicode.com/todos/1');
//         console.log(response.data);
//     }
//     catch(error){
//         console.log(error);
// }})