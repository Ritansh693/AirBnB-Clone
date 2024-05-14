const express = require("express");
const app = express();
const path = require("path");
app.set("view engine","ejs");
app.set(path.join(__dirname,"/views"));
const flash = require('connect-flash');


const session = require("express-session");

const sessionOptions = {
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true }
  };

app.use(session(sessionOptions));
app.use(flash());

app.get("/register", (req,res) =>{
    let{name="anonymous"} = req.query;
    req.session.name = name;
    if(req.session.name == "anonymous"){
        req.flash("error", "user not registered");
    }else{
        req.flash("success","you are spiderman");
    }
    
    res.redirect("/hello");
})


  app.get("/hello",(req,res) =>{
    res.locals.errorMsg = req.flash("error");
    res.locals.successMsg = req.flash("success");
    res.render("./page.ejs",{name: req.session.name});
  })
  

  app.listen(3000,(req,res) => {
    console.log("listening to port");
  })