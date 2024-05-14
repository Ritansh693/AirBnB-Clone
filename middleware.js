const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError");
const {listingSchema,reviewSchema} = require("./schema.js");


module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in!!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveredirectUrl = (req,res,next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req,res,next) => {
    let {id} = req.params;   
    const listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the owner of the listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.schemaValidation = ((req,res,next) => {
    const result = listingSchema.validate(req.body);
    if(result.error){
        throw new ExpressError(404,result.error.message);
    }else{
        next();
    }
})

module.exports.reviewSchemaValidation = ((req,res,next) => {
    const result = reviewSchema.validate(req.body);
    if(result.error){
        throw new ExpressError(404,result.error.message);
    }else{
        next();
    }
})


module.exports.isReviewAuthor = async (req,res,next) => {
    let {id,reviewId} = req.params;  
    const review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the author of the review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
