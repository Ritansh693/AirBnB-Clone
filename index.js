if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}

const express = require("express");
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const flash = require('connect-flash');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

app.set("view engine","ejs");
app.set(path.join(__dirname,"/views"));
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,"/public")));

app.engine('ejs', ejsMate);

//express sessions
const sessionOptions = {
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge:  7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
  };

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

main()
.then((res) =>{
    console.log("connection made");
})
.catch((err)=> {
    console.log(err);
});

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

//connect flash middleware
app.use((req,res,next) => {
    res.locals.msg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    res.locals.currUser = req.user;
    next();
})


app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);


//middleware
app.all("*",(req,res,err) => {
    throw  new ExpressError(400,"Page not found!!");
})

//error handeling middleware
app.use((err,req,res,next) => {
    let {status=500,message="error occured"} = err;
    res.status(status).render("./listings/error.ejs",{message});
})

//port is ready
app.listen(8080,() =>{
    console.log("listening to port 8080");
})
