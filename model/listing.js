const mongoose = require('mongoose');


const listingSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    image: {
        type: String,
        default: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200",
        set: (v) => v === "" ? "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200" : v
    },
    price: {
        type: Number
    },
    location: {
        type: String
    },
    country: {
        type: String
    }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
