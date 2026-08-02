const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const Listing = require("../model/listing");
const Review = require("../model/review");
const { reviewSchema } = require("../schema");
const { validateReview, isLoggedin, isReviewAuthor } = require("../middleware")
const reviewController = require("../controllers/reviews");

router.post("/", isLoggedin, validateReview, wrapAsync(reviewController.createReview));

router.delete("/:reviewId",isLoggedin, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;