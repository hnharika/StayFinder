const dataDB = require("./data");
const mongoose = require('mongoose');
const Listing = require("../model/listing");

main().then(() => {
    console.log("DB Connected.");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/stayfinder');
}

const initDB = async () => {
    await Listing.deleteMany({});
    console.log("deleted");
    dataDB.data = dataDB.data.map((obj) => ({ ...obj, owner: "6a6a2d7b100202fd615d598d" }));
    await Listing.insertMany(dataDB.data);
    console.log("inserted");
}

initDB();
