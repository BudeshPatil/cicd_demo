const express = require('express')
const router  = express.Router()
const auth    = require("../../middleware/auth");

const customerObj = require('../../controllers/brand/brand-controler');

// // Country Api
router.post('/addBrand',auth,customerObj.add_brand);
router.post('/viewallBrand',auth,customerObj.view_allbrand);

router.post('/getBrandWithId',auth,customerObj.getBrandWithId);
router.post('/editBranddata',auth,customerObj.editBranddata);
router.post('/deletebrand',auth,customerObj.deleteBrand);
router.post('/addimage',upload.any('file'),customerObj.upload_image);
router.post('/getAllBrand',customerObj.getAllBrand);
router.post('/getAllBrandById',customerObj.getAllBrandById);

module.exports = router;