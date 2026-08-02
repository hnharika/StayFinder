const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync");

const { isLoggedin, isOwner, validateListing } = require("../middleware");
const listingController = require("../controllers/listings");

//listings new 
router.get("/new", isLoggedin, listingController.renderNewForm)

//listings edit
router.get(
    "/:id/edit",
    isLoggedin,
    isOwner,
    wrapAsync(listingController.renderEditForm));

router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedin, validateListing, wrapAsync(listingController.createListing));

router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedin, isOwner, validateListing, wrapAsync(listingController.editListing))
    .delete(isLoggedin, isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;