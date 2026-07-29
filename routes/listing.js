const express = require("express");
const router = express.Router();
const ExpressError = require("../utils/ExpressError");
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../model/listing");
const { listingSchema } = require("../schema");
const {isLoggedin}=require("../middleware");

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    //console.log(result);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

//listings index route
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find();
    res.render("listings/index", { allListings });
}));

//listings new 
router.get("/new", isLoggedin,(req, res) => {
    res.render("listings/new");
})

//listings new and create
router.post("/", isLoggedin, validateListing, wrapAsync(async (req, res, next) => {
    // console.log(req.body.listing); obj
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "New Listing Created.")
    res.redirect("/listings");
}));

//listings show route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
        req.flash("error", "Listing does not exist.")
        return res.redirect("/listings");
    }
    res.render("listings/show", { listing });
}));

//listings edit
router.get("/:id/edit", isLoggedin, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing does not exist.")
        return res.redirect("/listings");
    }
    res.render("listings/edit", { listing });
}));

//listings edit post
router.put("/:id",isLoggedin, validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated.")
    res.redirect(`/listings/${id}`);
}));

//delete route
router.delete("/:id", isLoggedin, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted.")
    res.redirect("/listings");
}));

module.exports = router;