const express = require("express");
const router = express.Router({mergeParams:true} );
const wrapAsync = require("../utils/wrapasync.js");
const Review = require("../models/reviews.js");
const Listing  = require("../models/listing.js");
const { isLoggedIn } = require("../middlewares.js");


router.post("/",isLoggedIn, wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        return res.status(404).send("Listing not found");
    }
    let newReview = new Review(req.body.review);
    // newReview.author=req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","New Review Created!");
    console.log("new Review save");
    res.redirect(`/listings/${id}`);
}));

router.delete("/:reviewId", wrapAsync(async(req,res)=>{
    let { id,reviewId } = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted");
    res.redirect(`/listings/${id}`);
 }));

 module.exports = router;