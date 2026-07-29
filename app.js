const express = require("express")
const mongoose = require('mongoose');
const path = require("path");
const Listing = require("./model/listing");
const methodOverride = require("method-override");
const app = express();
const port = 8080;
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);
const Review = require("./model/review")
const listingSchema = require("./schema");
const reviewSchema = require("./schema");
const flash = require("connect-flash");
const session = require("express-session")
const listings = require("./routes/listing")
const reviews = require("./routes/review")

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
main().then(() => {
    console.log("DB Connected.")
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/stayfinder');
}

const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}
app.get("/", (req, res) => {
    res.send("root workingg");
})

app.use(session(sessionOptions));
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews)


app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found."));
})

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong." } = err;
    res.status(statusCode).render("error", { message });
});

app.listen(port, () => {
    console.log(`Listening to port ${port}`);
})