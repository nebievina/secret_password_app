//jshint esversion:6

require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require('mongoose-encryption');

const app = express();

// console.log(process.env.SECRET);


app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));


const uri = "mongodb://localhost:27017/userDB"
// const uri = "mongodb+srv://admin-nebi:papson92@cluster0.hzzpi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority/todolistDB"
try {
  // Connect to the MongoDB cluster
  mongoose.connect(
    uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    },
    () => console.log("Mongoose is connected")
  );

} catch (e) {
  console.log("could not connect");
  console.log(e);
}


const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const secret = process.env.SECRET;
userSchema.plugin(encrypt, {secret: secret, encryptedFields: ['password']});


const User = mongoose.model("User", userSchema);


app.get("/", (rep, res)=>{
  res.render("home");
});

app.get("/login", (rep, res)=>{
  res.render("login");
});

app.get("/register", (rep, res)=>{
  res.render("register");
});

app.post("/register", (req, res)=>{

  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });

  newUser.save(function(err){
    if(err){
      console.log(err);
    }else{
        // console.log(req.body);
        res.render("secrets");
    }
  })


});


app.post("/login", (req, res)=>{
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, function(err, foundUser){
    if (err){
      console.log(err);
    }else{
      if (foundUser.password === password){
        res.render("secrets");
      }
    }
  })

});




app.listen(3000, function(){
  console.log("Server started on port 3000.");
})
