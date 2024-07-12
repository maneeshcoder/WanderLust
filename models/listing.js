const mongoose =require("mongoose");
const Schema= mongoose.Schema;
const Review = require("./reviews.js");
const Listingschema =new Schema({
    title : {
        type :String,
        required : true
    },
    description :{
        type : String
    },
    image: {
        // filename: {
        //     type: String
        // },
         type: String,
        default: "https://unsplash.com/photos/a-view-of-a-town-with-a-steeple-and-a-body-of-water-HITr3n3VVYY"
    },
    price: Number,
    location:String,
    country : String,
    reviews :[
        {
            type: Schema.Types.ObjectId, 
            ref: "Review",
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
})
Listingschema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id : {$in : listing.reviews}});
    }
})
const Listing = mongoose.model("Listing",Listingschema);
module.exports = Listing;