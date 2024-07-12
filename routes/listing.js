const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapasync.js");
const Listing  = require("../models/listing.js");
const {isLoggedIn} = require("../middlewares.js");

router.get("/",async (req,res)=>{
    const alllistings = await Listing.find({});
    res.render("listings/index.ejs",{alllistings});
});

//New Route 
router.get("/new", isLoggedIn,(req,res)=>{
    res.render("listings/new.ejs");
});
//show route
router.get("/:id", 
    wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing = await Listing.findById(id)
    .populate("reviews")
    .populate("owner");
    if(!listing){
        req.flash("error","Listing does not exist!");
        res.render("/listings");
    }
    res.render("listings/show.ejs",{listing});
}));
//Create route
router.post("/", isLoggedIn, wrapAsync(async (req,res,next)=>{
    const newlisting = new Listing(req.body.listing);
    // let listing = req.body;
    // console.log(listing);
    newlisting.owner = req.user._id;
    await newlisting.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
}));
//update
router.put("/:id",isLoggedIn,async (req,res)=>{
    let { id} = req.params;
     await Listing.findByIdAndUpdate(id , {...req.body.listing});
     req.flash("success","Listing Updated!");
     if(!listing){
        req.flash("error","Listing does not exist!");
        res.render("/listings");
    };
     res.redirect(`/listings/${id}`);
});

router.get("/:id/edit",isLoggedIn,async (req,res)=>{
    let {id}=req.params;
    const listing = await Listing.findById(id);
    // console.log(listing)
    res.render("listings/edit.ejs",{listing});
});

router.delete("/:id", isLoggedIn, async(req,res)=>{
    let {id} = req.params;
    let deleted = await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
    console.log(deleted);
});


module.exports = router;