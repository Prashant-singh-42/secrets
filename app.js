//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');
const encryption = require('mongoose-encryption');


const app = express();
// console.log(process.env.API_KEY);


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.set('view engine', 'ejs');


mongoose.connect('mongodb://localhost:27017/userDB');

const userSchema =  new mongoose.Schema({
  email: String,
  password: String
});


userSchema.plugin(encryption, {secret: process.env.SECRET, encryptedFields: ["password"]});

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

app.post("/register",function(req, res){
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save(function(err){
    if (!err) {
      res.render("secrets");
    } else {
      console.log(err);
    }
  });
});

app.post("/login", function(req,res){
  email = req.body.username;
  password = req.body.password;

  User.findOne({email: email}, function(err, foundddocs){
    if (foundddocs){
      if (password === foundddocs.password){
        res.render("secrets");
      } else {
        res.send("wrong password");
      }
    } else {
      res.send("email not found");
    }
  })

})

// -----------------------------------------------------------------






app.listen(3000,function(){
  console.log('server started at port 3000');
});
