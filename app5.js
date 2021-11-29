require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const port = 3000;
const mongoose = require("mongoose");
const session =require("express-session");
const passport =require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const app = express();
app.use(express.urlencoded({
  extended: true
}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
app.use(session({ //initialize express session
  secret:"our little secret.",
  resave:false,
  saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
mongoose.connect("mongodb://localhost:27017/userDB");
//create schema and model for emails and password to store in our db.
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function(req, res) {
  res.render("home");
});
app.get("/login", function(req, res) {
  res.render("login");
});
app.get("/register", function(req, res) {
  res.render("register");
});
app.get("/secrets",function(req,res){
  if(req.isAuthenticated()){ //user must be logged in to get secrets page
    res.render("secrets");
  }else{
    res.redirect("/login"); //otherwise redirect to login.
  }
});
app.get("/logout",function(req,res){
  req.logout(); //log user out and end session
  res.redirect("/");
});
app.post("/register", function(req, res) { //registering a new user
  User.register({username:req.body.username},req.body.password,function(err,user){
    if(err){
      console.log(err);
      res.redirect("/register");
    }
    else{
      passport.authenticate("local")(req,res,function(){
        res.redirect("/secrets"); //they should be redirected to secrets if they've successfully registered.
      });
    }
  });
});
app.post("/login", function(req, res) { //when a user logs in
  const user = new User({ //create a User based off input
    username:req.body.username,
    password:req.body.password
  });
  //use passport login function to authenticate user.
  req.login(user,function(err){
    if(err) console.log(err);
    else {passport.authenticate("local")(req,res,function(){
      res.redirect("/secrets");
    });
  }
  });
});
app.listen(port, function(req, res) {
  console.log("Server has started on port 3000");
})
