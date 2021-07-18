# Databases 

## Intro to Databases
* What is a database? 
    * A collection of information / data
    * Has an interface (can write code to interact with the data)
* SQL (relational / tabular) vs. NoSQL (non-relational, JSON objects)

## Our First Mongo Commands
* mongod
* mongo
* help
* show dbs
* use 
* insert
* find
* update
* remove

## Mongoose
* What is a Mongoose?
* Why are we using it?
* Interact with a Mongo Database using Mongoose

* SQL: 
USERS TABLE id | name | age | city
1 | Tim | 57 | NYC
2 | Ira | 24 | Missoula 3 | Sue | 40 | Boulder

COMMENTS TABLE id | text
1 | "lol" 2 | "Come visit Montana!"
3 | "I love puppies!!!" 4 | "Seriously Montana is great!"

USER/COMMENTS JOIN TABLE userId | commentId
1 3 2 2 2 4 3 1

* A NON-RELATIONAL DATABASE:
{ name: "Ira", age: 24, city: Missoula, comments: [ {text: "Come visit Montana!"}, {text: "Seriously Montana is great!"}, {text: "Why does no one care about Montana???"} ], favColor: "purple" }

{ name: "Tammy", age: 24, city: Missoula, comments: [ {text: "Come visit Montana!"}, {text: "Seriously Montana is great!"}, {text: "Why does no one care about Montana???"} ], favFood: "Ribeye" }