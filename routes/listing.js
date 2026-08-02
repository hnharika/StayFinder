const express = require("express");
const router = express.Router();
const ExpressError = require("../utils/ExpressError");
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../model/listing");
const { listingSchema } = require("../schema");
const { isLoggedin, isOwner, validateListing } = require("../middleware");
const { renderNewForm, createListing } = require("../controllers/listings");
const { create } = require("../model/user");
const listingController = require("../controllers/listings");

//listings index route
router.get("/", wrapAsync(listingController.index));

//listings new 
router.get("/new", isLoggedin, listingController.renderNewForm)

//listings new and create
router.post("/", isLoggedin, validateListing, wrapAsync(listingController.createListing));

//listings show route
router.get("/:id", wrapAsync(listingController.showListing));

//listings edit
router.get("/:id/edit", isLoggedin, isOwner, wrapAsync(listingController.renderEditForm));

//listings edit post
router.put("/:id", isLoggedin, isOwner, validateListing, wrapAsync(listingController.editListing));

//delete route
router.delete("/:id", isLoggedin, isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;