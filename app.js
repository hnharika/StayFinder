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

const listingSchema = require("./schema");

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


app.get("/", (req, res) => {
    res.send("root workingg");
})

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
app.get("/listings", wrapAsync(async (req, res) => {
    const allListings = await Listing.find();
    res.render("listings/index", { allListings });
}));


//listings new 
app.get("/listings/new", (req, res) => {
    res.render("listings/new");
})

//listings new and create
app.post("/listings", validateListing, wrapAsync(async (req, res, next) => {
    // console.log(req.body.listing); obj
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));


//listings show route
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show", { listing });
}));

//listings edit
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit", { listing });
}));

//listings edit post
app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
}));

//delete route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));


// app.get("/test", async(req, res) => {
//     let sample = new Listing({
//         title:"My house",
//         description:"By the beach",
//         price:120000,
//         image:" ",
//         location:"Bengaluru",
//         country:"India"
//     })
//     await sample.save();
//     console.log("saved")
//     res.send("db workingg");
// })

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