const express = require('express')
const router  = express.Router()
const auth    = require("../../middleware/auth");

const customerObj = require('../../controllers/gallery/gallery-controller');

// // Country Api
router.post('/addGallery',auth,customerObj.add_gallery);
router.post('/viewallGallery',auth,customerObj.view_allgallery);

router.post('/getGalleryWithId',auth,customerObj.getGalleryWithId);
router.post('/editGallerydata',auth,customerObj.editGallerydata);
router.post('/deletegallery',auth,customerObj.deleteGallery);
router.post('/addimage',upload.any('file'),customerObj.upload_image);
router.post('/getAllGallery',customerObj.getAllGallery);
router.post('/getAllGalleryById',customerObj.getAllGalleryById);

module.exports = router;