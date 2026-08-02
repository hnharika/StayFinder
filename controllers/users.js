const User = require("../model/user");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup")
}

module.exports.signup = async (req, res) => {
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
}

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login")
}

module.exports.login = async (req, res) => {
    req.flash("success", "You are back");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            next(err);
        }
        req.flash("success", "you are logged out.")
        res.redirect("/listings");
    })
}