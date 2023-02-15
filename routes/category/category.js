const express = require('express')
const router  = express.Router()
const auth    = require("../../middleware/auth");

const customerObj = require('../../controllers/category/category-controler');

// // Country Api
router.post('/addCategory',auth,customerObj.add_category);
router.post('/viewallCategory',auth,customerObj.view_allcategory);

router.post('/getCategoryWithId',auth,customerObj.getCategoryWithId);
router.post('/editCategorydata',auth,customerObj.editCategorydata);
router.post('/deletecategory',auth,customerObj.deleteCategory);
router.post('/addimage',upload.any('file'),customerObj.upload_image);
router.post('/getAllCategory',customerObj.getAllCategory);
router.post('/getAllCategoryById',customerObj.getAllCategoryById);

module.exports = router;