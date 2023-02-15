const { compare }    = require('bcryptjs');
const { response }   = require('express');
const jwt            = require("jsonwebtoken");
const md5            = require("md5");
var randomstring     = require("randomstring");
const { ObjectId }   = require('bson');
const moment         = require('moment');
var BrandModal     = require('../../model/brand/Brand');
var userModel        = require('../../model/others/User');


exports.add_brand  = async (req, res) => {
    let postData     = req.body;
    const brandlins = new BrandModal({
        name: req.body.name,
        status: req.body.status,
        image: req.body.image
    })
    try
    {   
        const brandData = await brandlins.save();
        outputJson = {code: 200, status: "Success",message: 'Add Brand Successfully'};
        res.json(outputJson);
    }
    catch(error)
    {
        outputJson     = {code: 400, status: "Faild",message: 'Brand Add Faild'};
        res.json(outputJson);
    }
};


exports.editBranddata = async (req, res) => {
    let postData     = req.body;

    let where        = {_id:req.query.id,isDeleted:false}
    let getBrand   = await BrandModal.findOne(where); 
    let brandImage;

    if(req.body.image == null)
    {  
        brandImage = getBrand.image
    }
    else
    { 
        brandImage = req.body.image
    }
 
    let obj = {
        name: req.body.name,
        status: req.body.status,
        image : brandImage
    }

    try { 
        let result = await BrandModal.findOneAndUpdate(
            {_id: ObjectId(req.query.id) },
            obj
        );
        outputJson = { code: 200, status: "Success", message: 'Update Brand successfully.', result: result};
        res.json(outputJson);
    } catch (error) {
        res.status(400).json(failAction(error.message));
    }
};

exports.getBrandWithId  = async (req, res) => {
    var postData = req.body;
	let where    = {_id:postData.id,isDeleted:false}
    let result   = await BrandModal.findOne(where); 
    outputJson   = { code: 200, status: "Success", message: 'Brand List successfully.', result: result};
    res.json(outputJson);
};

// Delete Brand 
exports.deleteBrand = async (req, res) => {
    let cid   = ObjectId(req.body.id);
    let where = {};
    where["_id"] = cid;
    where["isDeleted"] = false;
    try { 
        let result = await BrandModal.findOneAndUpdate(where, {
        isDeleted: true,
        });      
        outputJson = { code: 200, status: "Success", message: 'Update Brand successfully.', result: result};
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
    var myfilenme = 'brand-' + n + '-' + req.files[0].originalname;
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

exports.view_allbrand  = async (req, res) => { 
    let postData = req.body;

    let where_user   = {loginToken:postData.token,isDeleted: false}
    let result_user  = await userModel.findOne(where_user);

    let limit = 9;
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
    var all_brand = await BrandModal.aggregate(
        AllProductaggregate
    );
    let totalrecord = await BrandModal.find({isDeleted: false}).count();
    try
    {
        outputJson   = {
            code: 200, 
            status: "Success",
            message: 'View Product Successfully',
            result:all_brand,
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

exports.getAllBrand  = async (req, res) => { 
    let postData = req.body;
    let where = {};
    where["isDeleted"] = false;
    let AllBrandaggregate = [ 
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
    var all_brand = await BrandModal.aggregate(
        AllBrandaggregate
    );
    try
    {
        outputJson   = {
            code: 200, 
            status: "Success",
            message: 'View Brand Successfully',
            result:all_brand,
        };
        res.json(outputJson);
    }
    catch(error)
    {
        outputJson   = {code: 400, status: "Faild",message: 'View Brand Faild'};
        res.json(outputJson);
    }
};


exports.getAllBrandById  = async (req, res) => { 
    let postData = req.body;

    let where_user   = {loginToken:postData.token,isDeleted: false}
    let result_user  = await userModel.findOne(where_user);

    let where = {};
    where["isDeleted"] = false;
    if(result_user.role == 'vendor')
    {
        where["user_id"] = ObjectId(result_user._id);
    }
    let AllBrandaggregate = [ 
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
    var all_brand = await BrandModal.aggregate(
        AllBrandaggregate
    );
    try
    {
        outputJson   = {
            code: 200, 
            status: "Success",
            message: 'View Brand Successfully',
            result:all_brand,
        };
        res.json(outputJson);
    }
    catch(error)
    {
        outputJson   = {code: 400, status: "Faild",message: 'View Brand Faild'};
        res.json(outputJson);
    }
};
