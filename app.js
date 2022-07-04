//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');
const bcrypt = require('bcrypt');
// const encryption = require('mongoose-encryption');
// const md5 = require('md5');


const saltRounds = 10;


const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.set('view engine', 'ejs');


mongoose.connect('mongodb://localhost:27017/userDB');

const userSchema =  new mongoose.Schema({
  email: String,
  password: String
});


// userSchema.plugin(encryption, {secret: process.env.SECRET, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);

// -----------------------routes-------------------------------
app.get("/",function(req, res){
  res.render("home");
});

app.get("/login",function(req, res){
  res.render("login");
});

app.get("/register",function(req, res){
  res.render("register");
});

app.get("/logout",function(req, res){
  res.redirect("/");
});

app.post("/register",function(req, res){

  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    const newUser = new User({
      email: req.body.username,
      password: hash
    });
    newUser.save(function(err){
      if (!err) {
        res.render("secrets");
      } else {
        console.log(err);
      }
    });
  });



});

app.post("/login", function(req,res){
  email = req.body.username;
  password = req.body.password;

  User.findOne({email: email}, function(err, foundddocs){
    if (foundddocs){
      bcrypt.compare(password, foundddocs.password, function(err, result) {
        if (result=== true) {
          res.render("secrets");
        } else {
          res.send("incorrect password");
        }
      });
    } else {
      res.send("email not found");
    }
  })

})

// -----------------------------------------------------------------






app.listen(3000,function(){
  console.log('server started at port 3000');
});
