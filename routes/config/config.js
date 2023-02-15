const express = require('express')
const router  = express.Router()
const auth    = require("../../middleware/auth");

const customerObj = require('../../controllers/config/config-controller');

// // Country Api
router.post('/addConfig',auth,customerObj.add_config);
router.post('/viewallConfig',auth,customerObj.view_allconfig);

router.post('/getConfigWithId',auth,customerObj.getConfigWithId);
router.post('/editConfigdata',auth,customerObj.editConfigdata);
router.post('/deleteconfig',auth,customerObj.deleteConfig);
router.post('/addimage',upload.any('file'),customerObj.upload_image);
router.post('/addMultiImage', upload.any(), customerObj.uploadMultiImage);
router.post('/getAllConfig',customerObj.getAllConfig);
router.post('/getAllConfigById',customerObj.getAllConfigById);

module.exports = router;