'use strict'

//setting up
var express = require("express");
var app = express();
var methodOverride = require('method-override')
var connect = require('connect');
app.set("view engine", "ejs");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded());
var PORT = process.env.PORT || 8080; // default port 8080

app.use(methodOverride('_method'))


let urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


app.get("/", (req, res) => {
  res.end("Hello!");


});
// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});



app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});


app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id };
  res.render("urls_show", templateVars);
});


app.post("/urls", (req, res) => {
  let longURL = req.body.longURL

  const shortURL = generateRandomString();

  urlDatabase[shortURL] = longURL



  console.log();  // debug statement to see POST parameters
  res.redirect(`http://localhost:8080/urls/${shortURL}`);         // Respond with 'Ok' (we will replace this)
});

app.get("/u/:shortURL", (req, res) => {
  res.redirect(req.body.longURL);
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


app.delete("/urls/:id", (req, res)=>{
// var a =
  delete urlDatabase[req.params.id]
  res.redirect("/urls");
})

app.put("/urls/:id", (req, res)=>{

var update = new urlDatabase[req.params.id]
res.redirect("/urls")
})


function generateRandomString() {
let short ="";
let a = function(){
const possible = "abcdefghijklmnopqrstuvwxyz";

    for( let i=0; i < 6; i++ )
      short += possible.charAt(Math.floor(Math.random() * possible.length));

    }
  return short;
  console.log(short);
}


// function printLinks(){


// }

