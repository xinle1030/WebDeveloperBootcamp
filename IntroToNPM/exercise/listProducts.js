var faker = require('faker');

console.log("==================");
console.log("WELCOME TO MY SHOP");
console.log("==================");

const COUNTER = 10;

/*
Method 1
Use API methods
*/
for (var i = 0; i < COUNTER; i++){
    var productName = faker.fake("{{commerce.productName}}");
    var price = faker.fake("{{commerce.price}}");
    console.log(productName + " - " + price);
}

console.log();

/*
Method 2
Faker.fake()
faker.js contains a super useful generator method Faker.fake for combining faker API methods using a mustache string format.
*/
for (var i = 0; i < COUNTER; i++){
    var productName = faker.commerce.productName();
    var price = faker.commerce.price();
    console.log(productName + " - " + price);
}