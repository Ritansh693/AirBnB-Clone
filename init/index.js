// const mongoose = require('mongoose');
// const Listing = require("../models/listing.js");
// const initData = require("../init/data.js");

// main()
// .then((res) =>{
//     console.log("connection made");
// })
// .catch((err)=> {
//     console.log(err);
// });

// async function main() {
//   await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
// }

// let initDB = async () => {
//     await Listing.deleteMany({});
//     initData.data = initData.data.map((obj) => ({ ...obj,owner: '65d70f8eeff8f74f334f56a7'}));
//     await Listing.insertMany(initData.data);
//     console.log("inserted the data");
// }

// initDB();

const mongoose = require('mongoose');
const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = "pk.eyJ1IjoiZGVsdGEtc3R1ZHVlbnQiLCJhIjoiY2xvMDk0MTVhMTJ3ZDJrcGR5ZDFkaHl4ciJ9.Gj2VU1wvxc7rFVt5E4KLOQ";
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
const initData = require("../init/data");


main()
.then((res) =>{
    console.log("connection made");
})
.catch((err)=> {
    console.log(err);
});

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

let initDB = async () => {
    try {
        // Loop through each listing data
        for (const listingData of initData.data) {
            // Geocode location
            const response = await geocodingClient
                .forwardGeocode({
                    query: `${listingData.location}, ${listingData.country}`,
                    limit: 1
                })
                .send();

            // If coordinates found, add them to the listing data
            if (response && response.body && response.body.features && response.body.features.length > 0) {
                const coordinates = response.body.features[0].geometry.coordinates;
                listingData.geometry = {
                    type: "Point",
                    coordinates: coordinates
                };
            } else {
                console.log(`Coordinates not found for ${listingData.location}, ${listingData.country}`);
            }

            // Assign owner ID
            listingData.owner = '65d70f8eeff8f74f334f56a7';

           
        }

         // Create a new Listing document and save it
       
         await Listing.insertMany(initData.data);

        console.log("Data insertion complete");
    } catch (error) {
        console.error("Error inserting data:", error);
    }
}

initDB();
