const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing  = require("./models/listing.js");
const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({ extended: true }));
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapasync.js");
// const { reviewSchema} = require("./schema.js");
const Review = require("./models/reviews.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
app.use(express.static(path.join(__dirname,"/public")));
const session = require("express-session");
const flash = require("connect-flash"); 
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const user = require("./routes/user.js");
 

app.engine('ejs',ejsMate);

const MONGO_URL ="mongodb://127.0.0.1:27017/wanderlust"

// const validateReview = (req,res,next)=>{
//     let {error} = reviewSchema.validate(req.body);
//     if(error){
//         let errMsg = error.details.map((el)=> el.message).join(".");
//         throw new ExpressError(400,errMsg);
//     }else{
//         next();
//     }
// }

const sessionOptions = {
    secret: "mysupersecretcode",
    resave :true,
    saveUninitialized : true,
    cookie:{
       expires: Date.now()+7*24*60*60*1000,
       maxAge:7*24*60*60*1000,
       httpOnly:true,
    }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


main()
.then(()=>{
    console.log("connected to mongodb");
})
 .catch((err)=>{
    console.log(err);
 })
async function main(){
    await mongoose.connect(MONGO_URL);
};


app.get("/",(req,res)=>{
    res.send("Hi, I am root");
});

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser = req.user; 
    next(); 
})

 
app.listen(8080,() =>{
    console.log("server is listeneing to port 8080");
})

app.use("/listings",listings);

app.use("/listings/:id/reviews",reviews);
app.use("/",user);

app.use((err,req,res,next)=>{
    console.log("Something went wrong");
})

//reveiews

