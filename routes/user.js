const express = require("express");
const router = express.Router();
const User = require("../model/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectedUrl, isLoggedin } = require("../middleware");
const userController = require("../controllers/users");

router.get("/signup", userController.renderSignupForm);

router.post("/signup", userController.signup);

router.get("/login", userController.renderLoginForm);


router.post("/login", saveRedirectedUrl, passport.authenticate("local", {
    failureRedirect: "/login", failureFlash: true
}),
    userController.login);

router.get("/logout", userController.logout);

module.exports = router;