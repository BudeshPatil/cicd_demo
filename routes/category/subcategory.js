const express = require('express')
const router  = express.Router()
const auth    = require("../../middleware/auth");

const customerObj = require('../../controllers/category/subCategory-controler');

// // Country Api
router.post('/addsubcategory',auth,customerObj.add_subCategory);
router.post('/viewallsubcategory',auth,customerObj.view_allsubCategory);

router.post('/getSubCategoryWithId',auth,customerObj.getsubCategoryWithId);
router.post('/editSubCategorydata',auth,customerObj.editsubCategorydata);
router.post('/deletesubCategory',auth,customerObj.deletesubcategory);
router.post('/addimage',upload.any('file'),customerObj.upload_image);
router.post('/getAllSubCategory',customerObj.getAllSubCategory);
router.post('/getAllSubCategoryById',customerObj.getAllSubCategoryById);
router.post('/getSubcategoriesByCatId',customerObj.getSubcategoriesByCatId);
module.exports = router;