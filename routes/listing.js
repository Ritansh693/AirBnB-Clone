const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn, isOwner,schemaValidation } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});


//create route
router.route("/new")
.get( isLoggedIn,listingController.renderNewForm)
.post( isLoggedIn,upload.single('listing[image][url]'),schemaValidation,wrapAsync(listingController.createListing))


//index route
router.get("/",wrapAsync(listingController.index));


//edit route
router.get("/:id/edit", isLoggedIn, isOwner,  wrapAsync(listingController.renderEditForm))

router.post("/update/:id", isLoggedIn, isOwner, upload.single('listing[image][url]'), schemaValidation ,wrapAsync(listingController.updateListing))


//delete route
router.get("/:id/delete", isLoggedIn,isOwner, wrapAsync(listingController.destroyListing))


//show route
router.get("/:id",wrapAsync(listingController.showListing));

module.exports = router;
