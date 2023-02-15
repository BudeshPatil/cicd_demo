const { compare }    = require('bcryptjs');
const { response }   = require('express');
const jwt            = require("jsonwebtoken");
const md5            = require("md5");
var randomstring     = require("randomstring");
const { ObjectId }   = require('bson');
const moment         = require('moment');
var ConfigModal     = require('../../model/config/Config');
var userModel        = require('../../model/others/User');


exports.add_config  = async (req, res) => {
    let postData     = req.body;
    let where_user   = {loginToken:postData.token,isDeleted: false}
    let result_user  = await userModel.findOne(where_user);

    const configlins = new ConfigModal({
        name: req.body.name,
        status: req.body.status,
        gmail_user :req.body.gmail_user,
        gmail_password : req.body.gmail_password,
        image: req.body.image,
        qrcode_url: req.body.qrcode_url,
        qrcode_image: req.body.qrcode_image,
        info: req.body.info
    })
    try
    {   
        const configData = await configlins.save();
        outputJson = {code: 200, status: "Success",message: 'Add Config Successfully'};
        res.json(outputJson);
    }
    catch(error)
    {
        outputJson     = {code: 400, status: "Faild",message: 'Config Add Faild'};
        res.json(outputJson);
    }
};


exports.editConfigdata = async (req, res) => {
    let postData     = req.body;

    let where        = {_id:req.query.id,isDeleted:false}
    let getConfig   = await ConfigModal.findOne(where); 
    let configImage;
    let where_user   = {loginToken:postData.token,isDeleted: false}
    let result_user  = await userModel.findOne(where_user);

    if(req.body.image == null)
    {  
        configImage = getConfig.image
    }
    else
    { 
        configImage = req.body.image
    }
 
    let obj = {
        name: req.body.name,
        status: req.body.status,
        gmail_user :req.body.gmail_user,
        gmail_password : req.body.gmail_password,
        image : configImage,
        qrcode_url: req.body.qrcode_url,
        qrcode_image: req.body.qrcode_image,
        info: req.body.info
    }

    try { 
        let result = await ConfigModal.findOneAndUpdate(
            {_id: ObjectId(req.query.id) },
            obj
        );
        outputJson = { code: 200, status: "Success", message: 'Update Config successfully.', result: result};
        res.json(outputJson);
    } catch (error) {
        res.status(400).json(failAction(error.message));
    }
};

exports.getConfigWithId  = async (req, res) => {
    var postData = req.body;
	let where    = {_id:postData.id,isDeleted:false}
    let result   = await ConfigModal.findOne(where); 
    outputJson   = { code: 200, status: "Success", message: 'Config List successfully.', result: result};
    res.json(outputJson);
};

// Delete Config 
exports.deleteConfig = async (req, res) => {
    let cid   = ObjectId(req.body.id);
    let where = {};
    where["_id"] = cid;
    where["isDeleted"] = false;
    try { 
        let result = await ConfigModal.findOneAndUpdate(where, {
        isDeleted: true,
        });      
        outputJson = { code: 200, status: "Success", message: 'Update Config successfully.', result: result};
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
    var myfilenme = 'config-' + n + '-' + req.files[0].originalname;
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

exports.view_allconfig  = async (req, res) => { 
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
        {
            $lookup:{
                    from: 'user',
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'userdata'
            }
        },
        { $skip: skiprecord },
        { $limit: limit },
        {   
            $project: { 
                _id:1,
                name:1,
                status:1,
                updated_at:1,
                created_at:1,
                image:1,
                gmail_user:1,
                gmail_password:1,
                qrcode_url: 1,
                qrcode_image: 1,
                info: 1
            } 
        },  
    ];
    var all_config = await ConfigModal.aggregate(
        AllProductaggregate
    );
    let totalrecord = await ConfigModal.find({isDeleted: false}).count();
    try
    {
        outputJson   = {
            code: 200, 
            status: "Success",
            message: 'View Product Successfully',
            result:all_config,
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

exports.getAllConfig  = async (req, res) => { 
    let postData = req.body;
    let where = {};
    where["isDeleted"] = false;
    let AllConfigaggregate = [ 
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
              gmail_user:1,
              gmail_password:1,
              image:1,
              qrcode_url: 1,
              qrcode_image: 1,
              info: 1
            } 
        },  
    ];
    var all_config = await ConfigModal.aggregate(
        AllConfigaggregate
    );
    try
    {
        outputJson   = {
            code: 200, 
            status: "Success",
            message: 'View Config Successfully',
            result:all_config[0],
        };
        res.json(outputJson);
    }
    catch(error)
    {
        outputJson   = {code: 400, status: "Faild",message: 'View Config Faild'};
        res.json(outputJson);
    }
};


exports.getAllConfigById  = async (req, res) => { 
    let postData = req.body;

    let where_user   = {loginToken:postData.token,isDeleted: false}
    let result_user  = await userModel.findOne(where_user);

    let where = {};
    where["isDeleted"] = false;
    if(result_user.role == 'vendor')
    {
        where["user_id"] = ObjectId(result_user._id);
    }
    let AllConfigaggregate = [ 
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
              image:1,
              gmail_user:1,
              gmail_password:1,
              qrcode_url: 1,
              qrcode_image: 1,
              info: 1
            } 
        },  
    ];
    var all_config = await ConfigModal.aggregate(
        AllConfigaggregate
    );
    try
    {
        outputJson   = {
            code: 200, 
            status: "Success",
            message: 'View Config Successfully',
            result:all_config,
        };
        res.json(outputJson);
    }
    catch(error)
    {
        outputJson   = {code: 400, status: "Faild",message: 'View Config Faild'};
        res.json(outputJson);
    }
};

exports.uploadMultiImage = async(req, res) => {

    //get post value
    var postData = req.body;
    var d = new Date();
    var n = d.getTime();
  
    var mv = require('mv');
  
    //get post value   
    var myfilenme = 'product-' + n + '-' + req.files[0].originalname;
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