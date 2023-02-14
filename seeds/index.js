if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const mongoose = require ("mongoose");
const Campground = require ("../models/campground");
const cities = require("./cities");
const {places, descriptors} = require("./seedHelpers");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken })

mongoose.connect("mongodb://localhost:27017/yelp-camp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const location = `${cities[random1000].city}, ${cities[random1000].state}`;
        const geoData = await geocoder.forwardGeocode({
            query: location,
            limit: 1
        }).send()
        const camp = new Campground ({
            author: "6398967f1d25967a05732e28",
            location: location,
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry: geoData.body.features[0].geometry,
            images: [
                {
                    url: 'https://res.cloudinary.com/dw5hexub0/image/upload/v1675713786/YelpCamp/tkscpnvnvcg9zapcokxz.jpg',
                    filename: 'YelpCamp/tnjeypdpkbtyjkxs4cof'
                },
                {
                    url: 'https://res.cloudinary.com/dw5hexub0/image/upload/v1675280427/YelpCamp/txcdrvwipuhxc2h8ypeu.jpg',
                    filename: 'YelpCamp/txcdrvwipuhxc2h8ypeu'
                }
            ],
            description: "Memento mori (Latin for 'remember that you [have to] die'[2]) is an artistic or symbolic trope acting as a reminder of the inevitability of death",
            price
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});