'use strict'
require('dotenv').config();
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
//server
const assert = require('assert');
const MongoClient = require("mongodb").MongoClient;
const objectID = require("mongodb").ObjectID;
const MONGODB_URI = process.env.MONGODB_URI
console.log(`Connecting to MongoDB running at: ${MONGODB_URI}`);


app.get("/", (req, res) => {
res.redirect(`http://localhost:8080/urls/new`);
});
app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  MongoClient.connect(MONGODB_URI, (err, db) => {
    let collection = db.collection("urls");
    collection.find().toArray((err, result) => {
      let longURL = result;
      let templateVars = {
        shortURL:req.params.shortURL,
        longURL:longURL
      };
      console.log(templateVars)
      res.render("urls_index", templateVars);
    })
    })
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
  MongoClient.connect(MONGODB_URI, (err, db) => {
    let collection = db.collection("urls");
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
    let collection = db.collection("urls");
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
     let collection = db.collection("urls");
  res.redirect(req.body.longURL);
});
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


app.delete("/urls/:shortURL", (req, res)=>{
   MongoClient.connect(MONGODB_URI, (err, db) => {
     let shortURL = req.body.shortURL;
     let collection = db.collection("urls");
     collection.deleteOne({"shortURL": req.params.shortURL},function (err, result) {
       console.log('item deleted');
       res.redirect("/urls");
  })
})
})

app.put("/urls/:shortURL", (req, res)=>{
   MongoClient.connect(MONGODB_URI, (err, db) => {
     let collection = db.collection("urls");
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
 })
function getLongURL(shortURL, cb) {
  MongoClient.connect(MONGODB_URI, (err, db) => {
    let collection = db.collection("urls");
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