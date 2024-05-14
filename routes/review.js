const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing");
const Review = require("../models/review");
const { reviewSchemaValidation, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");


//review post route
router.post("/",isLoggedIn, reviewSchemaValidation, reviewController.createReview)


//review delete route
router.post("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview)
);


module.exports = router;