const express = require('express')
const router  = express.Router()
const auth    = require("../../middleware/auth");

const customerObj = require('../../controllers/application/application-controller');

// // Country Api
router.post('/addApplication',customerObj.add_application);
router.post('/viewallApplication',auth,customerObj.view_allapplication);

router.post('/getApplicationWithId',auth,customerObj.getApplicationWithId);
router.post('/editApplicationdata',auth,customerObj.editApplicationdata);
router.post('/deleteapplication',auth,customerObj.deleteApplication);
router.post('/addimage',upload.any('file'),customerObj.upload_image);
router.post('/getAllApplication',customerObj.getAllApplication);
router.post('/getAllApplicationById',customerObj.getAllApplicationById);

module.exports = router;