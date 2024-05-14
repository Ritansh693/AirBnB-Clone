const Review = require("../models/review");
const Listing = require("../models/listing");

module.exports.createReview = async (req,res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let {rating,comment} = req.body.review;
    let review1 = new Review ({
        rating: rating,
        comment: comment
    });
    review1.author = req.user._id;
    await review1.save();
    listing.reviews.push(review1);
    await listing.save();
    req.flash("success","Review Posted!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyReview = async (req,res) =>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!");
    res.redirect(`/listings/${id}`);
};