var express = require('express');
var router = express.Router();
const unique= require("mongoose-unique-validator");
const body= require("body-parser");
const mongoose= require('mongoose');
mongoose.connect('mongodb://localhost:27017/Registration');
const schema= new mongoose.Schema({
  username:
  {type:String,
  unique:true
  },
  name:String,
  dob:Date,
  email:String,
  password:String
});

schema.plugin(unique);

const collection= mongoose.model("register", schema);

router.post("/",(req,res)=>{
  const username= req.body.username;
  const name= req.body.name;
  const dob= req.body.dob;
  const email= req.body.email;
  const pass= req.body.pass;
  const dataInput= new collection({
    username:username,
    name:name,
    dob:Date.parse(dob),
    email:email,
    password:pass
  });
  dataInput.save();
  res.redirect("/login")
})

router.post("/login",(req,res)=>{
  const mail=req.body.mail;
  const password= req.body.password;
  collection.findOne({email:mail}).then((got)=>{
    if(got.password===password){
      res.redirect(`/welcome/${mail}`);
    }else{
      res.redirect("/index");
      console.log("First Register Yourself")
    }
  }).catch((err)=>{
    console.log(err);
  })
})


router.get("/welcome/:email",(req,res)=>{
  const email= req.params.email;
  collection.findOne({email:email}).then((got)=>{
    res.render("welcome", {Name:got.name})
  }).catch((err)=>{
    console.log(err);
  })
});



/* GET home page. */
router.get('/', function(req, res,next) {
  res.render('index');
});

router.get('/login', function(req, res) {
  res.render('login');
});

// router.get("/welcome",(req,res)=>{
//   res.render("welcome");
// })

module.exports = router;
