const express = require("express");
const router = express.Router();
const User = require("../model/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectedUrl, isLoggedin } = require("../middleware");

// router.get("/demouser", async (req, res) => {
//     let fakeUser = new User({
//         email: "hn@gmail.com",
//         username: "hn"
//     });
//     let regUser = await User.register(fakeUser, "123");
//     res.send(regUser);
// })

router.get("/signup", (req, res) => {
    res.render("users/signup")
});

router.post("/signup", async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({
            email, username
        });
        let regUser = await User.register(newUser, password);
        req.login(regUser, (err) => {
            if (err) {
                next(err);
            }
            req.flash("success", "you are logged in also.")
            res.redirect("/listings");
        });
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
});

router.get("/login", (req, res) => {
    res.render("users/login")
});


router.post("/login", saveRedirectedUrl, passport.authenticate("local", {
    failureRedirect: "/login", failureFlash: true
}),
    async (req, res) => {
        req.flash("success", "You are back");
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
    });

router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            next(err);
        }
        req.flash("success", "you are logged out.")
        res.redirect("/listings");
    })
})

module.exports = router;