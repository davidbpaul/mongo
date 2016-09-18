'use strict'

//setting up
const express = require("express");
const app = express();
const methodOverride = require('method-override')
const connect = require('connect');
app.set("view engine", "ejs");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded());
const PORT = process.env.PORT || 8080; // default port 8080


app.use(methodOverride('_method'));
const assert = require('assert');
const MongoClient = require("mongodb").MongoClient;
const objectID = require("mongodb").ObjectID;
const MONGODB_URI = "mongodb://127.0.0.1:27017/url_shortener";

console.log(`Connecting to MongoDB running at: ${MONGODB_URI}`);
let collection = null;

MongoClient.connect(MONGODB_URI, (err, db) => {

  if (err) {
    console.log('Could not connect! Unexpected error. Details below.');
    throw err;
  }

  console.log('Connected to the database!');
  collection = db.collection("urls");

});




app.get("/", (req, res) => {
  res.end("Hello!");
});

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});




app.get("/urls", (req, res) => {
  MongoClient.connect(MONGODB_URI, (err, db) => {
    collection.find( {"shortURL": req.params.shortURL}, (err, result) => {
      let longURL = result;
      let templateVars = {
        shortURL:req.params.shortURL,
        longURL:longURL
      };
      console.log(templateVars)
      res.render("urls_index", templateVars);
    })
      // console.log(result)
  })
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});


app.get("/urls/:shortURL", (req, res) => {
  MongoClient.connect(MONGODB_URI, (err, db) => {
  getLongURL(req.params.shortURL, (err,  longURL)=>{
    let templateVars = {
      shortURL:req.params.shortURL,
      longURL:longURL
    };
    res.render("urls_show", templateVars);
   // console.log(longURL)
  });
});
});



app.post("/urls", (req, res, next) => {
  MongoClient.connect(MONGODB_URI, (err, db) => {
    let random =Math.random().toString(36).substr(2, 6);

    let item ={
      longURL: req.body.longURL,
      shortURL:random
    }

    collection.insertOne(item, function (err, result) {

      res.redirect("/urls");
      //console.log(result)
    })
  })
})


app.get("/u/:shortURL", (req, res) => {
  MongoClient.connect(MONGODB_URI, (err, db) => {
  res.redirect(req.body.longURL);
});
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


app.delete("/urls/:shortURL", (req, res)=>{
  let shortURL = req.body.shortURL;
  collection.deleteOne({"shortURL": req.params.shortURL},function (err, result) {
    console.log('item deleted');
    res.redirect("/urls");
  })

})

app.put("/urls/:shortURL", (req, res)=>{
let random =Math.random().toString(36).substr(2, 6);
  let shortURL = req.body.shortURL
  let item ={
    longURL :req.body.longURL,
    shortURL:random
  };

  collection.updateOne({"shortURL": req.params.shortURL}, {$set: item}, function (err, result) {

    console.log('item updated');
    res.redirect(`http://localhost:8080/urls/`);
  })
})



function getLongURL(shortURL, cb) {
  MongoClient.connect(MONGODB_URI, (err, db) => {

    if (err) {
      console.log('Could not connect! Unexpected error. Details below.');
      throw err;
    }
    let query = { "shortURL": shortURL };
    db.collection("urls").findOne(query, (err, result) => {
      if (err) {
        return cb(err);
      }
      return cb(null, result.longURL);
    });
  });

}

function withdb(cb){
   MongoClient.connect(MONGODB_URI, (err, db) => {

    if (err) {
      console.log('Could not connect! Unexpected error. Details below.');
      throw err;
    }
})
}

