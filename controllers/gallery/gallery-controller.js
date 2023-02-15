const { compare }    = require('bcryptjs');
const { response }   = require('express');
const jwt            = require("jsonwebtoken");
const md5            = require("md5");
var randomstring     = require("randomstring");
const { ObjectId }   = require('bson');
const moment         = require('moment');
var GalleryModal     = require('../../model/gallery/Gallery');
var userModel        = require('../../model/others/User');


exports.add_gallery  = async (req, res) => {
    let postData     = req.body;
    const gallerylins = new GalleryModal({
        name: req.body.name,
        status: req.body.status,
        image: req.body.image
    })
    try
    {   
        const galleryData = await gallerylins.save();
        outputJson = {code: 200, status: "Success",message: 'Add Gallery Successfully'};
        res.json(outputJson);
    }
    catch(error)
    {
        outputJson     = {code: 400, status: "Faild",message: 'Gallery Add Faild'};
        res.json(outputJson);
    }
};


exports.editGallerydata = async (req, res) => {
    let postData     = req.body;

    let where        = {_id:req.query.id,isDeleted:false}
    let getGallery   = await GalleryModal.findOne(where); 
    let galleryImage;

    if(req.body.image == null)
    {  
        galleryImage = getGallery.image
    }
    else
    { 
        galleryImage = req.body.image
    }
 
    let obj = {
        name: req.body.name,
        status: req.body.status,
        image : galleryImage
    }

    try { 
        let result = await GalleryModal.findOneAndUpdate(
            {_id: ObjectId(req.query.id) },
            obj
        );
        outputJson = { code: 200, status: "Success", message: 'Update Gallery successfully.', result: result};
        res.json(outputJson);
    } catch (error) {
        res.status(400).json(failAction(error.message));
    }
};

exports.getGalleryWithId  = async (req, res) => {
    var postData = req.body;
	let where    = {_id:postData.id,isDeleted:false}
    let result   = await GalleryModal.findOne(where); 
    outputJson   = { code: 200, status: "Success", message: 'Gallery List successfully.', result: result};
    res.json(outputJson);
};

// Delete Gallery 
exports.deleteGallery = async (req, res) => {
    let cid   = ObjectId(req.body.id);
    let where = {};
    where["_id"] = cid;
    try { 
        let result = await GalleryModal.deleteOne(where);      
        outputJson = { code: 200, status: "Success", message: 'Update Gallery successfully.', result: result};
        res.json(outputJson);
    }catch (error) {
        res.status(400).json(failAction(error.message));
    }
};

exports.upload_image = async(req, res) => {

    //get post value
    var postData = req.body;
    var d = new Date();
    var n = d.getTime();

    var mv = require('mv');

    //get post value   
    var myfilenme = 'gallery-' + n + '-' + req.files[0].originalname;
    var file      = __dirname + '/../../public/' + myfilenme
    var save_file_name = 'public/' + myfilenme;

    mv(req.files[0].path, file, function (err) {
        if (err){ 
            res.status(400).send({ success: 0, msg: "Error to upload file!", data: { err: err } });
        } else {
            outputJson  = {code: 200, status: "success", result:myfilenme};
            return res.json(outputJson);  
        }
    });
};

exports.view_allgallery  = async (req, res) => { 
    let postData = req.body;

    let where_user   = {loginToken:postData.token,isDeleted: false}
    let result_user  = await userModel.findOne(where_user);

    let limit = postData.limit;
    let page = postData.page || 1;
    let skiprecord = limit * page - limit;
    let where = {};
    where["isDeleted"] = false;
    let AllProductaggregate = [ 
        {  
            $match:where
        },
        { $sort: { _id: -1 } },
        { $skip: skiprecord },
        { $limit: limit },
        {   
            $project: { 
                _id:1,
                name:1,
                status:1,
                updated_at:1,
                created_at:1,
                image:1
            } 
        },  
    ];
    var all_gallery = await GalleryModal.aggregate(
        AllProductaggregate
    );
    let totalrecord = await GalleryModal.find({isDeleted: false}).count();
    try
    {
        outputJson   = {
            code: 200, 
            status: "Success",
            message: 'View Product Successfully',
            result:all_gallery,
            page: page,
            limit: limit,
            count: totalrecord,
        };
        res.json(outputJson);
    }
    catch(error)
    {
        outputJson   = {code: 400, status: "Faild",message: 'View Product Faild'};
        res.json(outputJson);
    }
};

exports.getAllGallery  = async (req, res) => { 
    let postData = req.body;
    let where = {};
    where["isDeleted"] = false;
    let AllGalleryaggregate = [ 
        {  
            $match:where
        },
        { $sort: { _id: -1 } },
        {   
            $project: { 
              _id:1,
              name:1,
              status:1,
              created_at:1,
              updated_at:1,
              image:1
            } 
        },  
    ];
    var all_gallery = await GalleryModal.aggregate(
        AllGalleryaggregate
    );
    try
    {
        outputJson   = {
            code: 200, 
            status: "Success",
            message: 'View Gallery Successfully',
            result:all_gallery,
        };
        res.json(outputJson);
    }
    catch(error)
    {
        outputJson   = {code: 400, status: "Faild",message: 'View Gallery Faild'};
        res.json(outputJson);
    }
};


exports.getAllGalleryById  = async (req, res) => { 
    let postData = req.body;

    let where_user   = {loginToken:postData.token,isDeleted: false}
    let result_user  = await userModel.findOne(where_user);

    let where = {};
    where["isDeleted"] = false;
    if(result_user.role == 'vendor')
    {
        where["user_id"] = ObjectId(result_user._id);
    }
    let AllGalleryaggregate = [ 
        {  
            $match:where
        },
        { $sort: { _id: -1 } },
        {   
            $project: { 
              _id:1,
              name:1,
              status:1,
              created_at:1,
              updated_at:1,
              image:1
            } 
        },  
    ];
    var all_gallery = await GalleryModal.aggregate(
        AllGalleryaggregate
    );
    try
    {
        outputJson   = {
            code: 200, 
            status: "Success",
            message: 'View Gallery Successfully',
            result:all_gallery,
        };
        res.json(outputJson);
    }
    catch(error)
    {
        outputJson   = {code: 400, status: "Faild",message: 'View Gallery Faild'};
        res.json(outputJson);
    }
};
