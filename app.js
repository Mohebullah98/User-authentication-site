require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const port = 3000;
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
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


userSchema.plugin(encrypt, {
  secret: process.env.SECRET,
  encryptedFields: ["password"]
}); //only want to encrypt password
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
  const user = new User({
    email: req.body.username,
    password: req.body.password
  });
  user.save(function(err) {
    if (err) console.log(err);
    else res.render("secrets"); //only render secrets when user has logged in!
  });
});
app.post("/login", function(req, res) { //when a user logs in
  User.findOne({
    email: req.body.username
  }, function(err, doc) { //check if username exists
    if (!err) {
      if (doc) { //if username exists, match typed password to password in db.
        if (doc.password === req.body.password) res.render("secrets");
        else res.send("Your email and password did not match.")
      }
    } else console.log(err);
  })
})
app.listen(port, function(req, res) {
  console.log("Server has started on port 3000");
})
