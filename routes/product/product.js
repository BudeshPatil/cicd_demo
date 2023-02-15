const express = require('express')
const router  = express.Router()
const auth    = require("../../middleware/auth");

const customerObj = require('../../controllers/product/product-controller');

// Country Api
router.post('/addproduct',auth,customerObj.add_product);
router.post('/viewallproduct',auth,customerObj.view_allproduct);
router.post('/getfrountproduct',customerObj.getfrountproduct);
router.post('/getfrounthomepageproduct',customerObj.getfrounthomepageproduct);

router.post('/getProductWithId',auth,customerObj.getProductWithId);
router.post('/editProductdata',auth,customerObj.editProductdata);
router.post('/deleteproduct',auth,customerObj.deleteproduct);

// Single product Api
router.post('/getsingleproduct',customerObj.get_singleproduct);
router.post('/getProductByartCreated',customerObj.get_ProductByartCreated);

router.post('/updateProductCount',customerObj.updateProductCount);
router.post('/getProductsbyFilter',customerObj.getAllProductByFilter);

router.post('/getallProducts',customerObj.get_all_product);


module.exports = router;