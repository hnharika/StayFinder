module.exports.isLoggedin = ((req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "Login to create a listing.")
        return res.redirect("/login");
    }
    next();
})

module.exports.saveRedirectedUrl = ((req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
})