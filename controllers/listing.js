const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

//index
module.exports.index = async (req,res) =>{
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
}


//new 
module.exports.renderNewForm =  (req,res) =>{
    res.render("./listings/new.ejs");
}

module.exports.createListing = async (req,res,next) =>{
    let response = await geocodingClient
    .forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    })
    .send();

    let {title,description,price,country,location} = req.body.listing;
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing ({
        title: title,
        description: description,
        image: {
            url: url,
            filename: filename
        },
        price: price,
        country: country,
        location: location
    });
    newListing.geometry = response.body.features[0].geometry;
    newListing.owner= req.user._id;
    await newListing.save();
    req.flash("success","New Lisitng Created!");
    res.redirect("/listings");
}

//edit
module.exports.renderEditForm = async (req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(! listing){
        req.flash("error", "Listing not found!");
        res.redirect("/listings");
    }else{
        const originalUrl = listing.image.url;
        res.render("./listings/edit.ejs",{listing, originalUrl });
    }
    
}

module.exports.updateListing = async (req,res) =>{
    let response = await geocodingClient
    .forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    })
    .send();
    let {id} = req.params;   
    let {title,description,image,price,country,location} = req.body.listing;
    const editListing = await Listing.findByIdAndUpdate(id,{
        title: title,
        description: description,
        // image: image,
        price: price,
        country: country,
        location: location
    });
    editListing.geometry = response.body.features[0].geometry;
    await editListing.save();
    if(req.file && req.file.path && req.file.filename){
        let url = req.file.path;
        let filename = req.file.filename;
        editListing.image = {url,filename};
        editListing.save();
    }
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
}


//show
module.exports.showListing = async (req,res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate : {path: "author"}}).populate("owner");
    if(!listing){
        req.flash("error", "Listing not found!");
        res.redirect("/listings");
    }else{
            res.render("./listings/show.ejs",{listing});
    }
}


//delete
module.exports.destroyListing = async (req,res) =>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
}