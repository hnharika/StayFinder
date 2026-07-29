module.exports.isLoggedin=((req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "Login to create a listing.")
        return res.redirect("/login");
    }
    next();
})