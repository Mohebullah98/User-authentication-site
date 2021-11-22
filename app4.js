require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const port = 3000;
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds =10;
const app = express();
app.use(express.urlencoded({
  extended: true
}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
mongoose.connect("mongodb://localhost:27017/userDB");
//create schema and model for emails and password to store in our db.
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

 //only want to encrypt password
const User = mongoose.model("User", userSchema);
app.get("/", function(req, res) {
  res.render("home");
});
app.get("/login", function(req, res) {
  res.render("login");
});
app.get("/register", function(req, res) {
  res.render("register");
});
app.post("/register", function(req, res) { //registering a new user
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) { //salting with 10 rounds and hashing
    // Store hash in your password DB.
    const user = new User({
      email: req.body.username,
      password: hash //hash the users password
    });
    user.save(function(err) {
      if (err) console.log(err);
      else res.render("secrets"); //only render secrets when user has logged in!
    });
});

});
app.post("/login", function(req, res) { //when a user logs in
  User.findOne({
    email: req.body.username
  }, function(err, doc) { //check if username exists
    if (!err) {
      if (doc) { //if username exists, match plain text password to hashed salted password in db.
        bcrypt.compare(req.body.password,doc.password,function(err,result){
          if(!err){
            if(result) res.render("secrets"); //passwords match, then render secrets page
            else res.send("Your email and password did not match");
          }
        });
      }
    } else console.log(err);
  });
});
app.listen(port, function(req, res) {
  console.log("Server has started on port 3000");
})
