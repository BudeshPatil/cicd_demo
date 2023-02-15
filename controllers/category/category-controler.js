const { compare }    = require('bcryptjs');
const { response }   = require('express');
const jwt            = require("jsonwebtoken");
const md5            = require("md5");
var randomstring     = require("randomstring");
const { ObjectId }   = require('bson');
const moment         = require('moment');
var CategoryModal     = require('../../model/category/Category');
var userModel        = require('../../model/others/User');


exports.add_category  = async (req, res) => {
    let postData     = req.body;
    let where_user   = {loginToken:postData.token,isDeleted: false}
    let result_user  = await userModel.findOne(where_user);

    const categorylins = new CategoryModal({
        name: req.body.name,
        status: req.body.status,
        description :req.body.description,
        meta_description : req.body.meta_description,
        meta_title: req.body.meta_title,
        meta_keywords : req.body.meta_keywords,
        user_id: result_user._id,
        image: req.body.image
    })
    try
    {   
        const categoryData = await categorylins.save();
        outputJson = {code: 200, status: "Success",message: 'Add Category Successfully'};
        res.json(outputJson);
    }
    catch(error)
    {
        outputJson     = {code: 400, status: "Faild",message: 'Category Add Faild'};
        res.json(outputJson);
    }
};


exports.editCategorydata = async (req, res) => {
    let postData     = req.body;

    let where        = {_id:req.query.id,isDeleted:false}
    let getCategory   = await CategoryModal.findOne(where); 
    let categoryImage;
    let where_user   = {loginToken:postData.token,isDeleted: false}
    let result_user  = await userModel.findOne(where_user);

    if(req.body.image == null)
    {  
        categoryImage = getCategory.image
    }
    else
    { 
        categoryImage = req.body.image
    }
 
    let obj = {
        name: req.body.name,
        status: req.body.status,
        description :req.body.description, 
        type: req.body.type,
        meta_description : req.body.meta_description,
        meta_title: req.body.meta_title,
        meta_keywords : req.body.meta_keywords,
        image : categoryImage
    }

    try { 
        let result = await CategoryModal.findOneAndUpdate(
            {_id: ObjectId(req.query.id) },
            obj
        );
        outputJson = { code: 200, status: "Success", message: 'Update Category successfully.', result: result};
        res.json(outputJson);
    } catch (error) {
        res.status(400).json(failAction(error.message));
    }
};

exports.getCategoryWithId  = async (req, res) => {
    var postData = req.body;
	let where    = {_id:postData.id,isDeleted:false}
    let result   = await CategoryModal.findOne(where); 
    outputJson   = { code: 200, status: "Success", message: 'Category List successfully.', result: result};
    res.json(outputJson);
};

// Delete Category 
exports.deleteCategory = async (req, res) => {
    let cid   = ObjectId(req.body.id);
    let where = {};
    where["_id"] = cid;
    where["isDeleted"] = false;
    try { 
        let result = await CategoryModal.findOneAndUpdate(where, {
        isDeleted: true,
        });      
        outputJson = { code: 200, status: "Success", message: 'Update Category successfully.', result: result};
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
    var myfilenme = 'category-' + n + '-' + req.files[0].originalname;
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

exports.view_allcategory  = async (req, res) => { 
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
                description:1,
                updated_at:1,
                created_at:1,
                image:1,
                meta_title:1,
                meta_description:1,
                meta_tags:1,
                user_id: "$artdata._id",
                user_name: "$artdata.name", 
            } 
        },  
    ];
    var all_category = await CategoryModal.aggregate(
        AllProductaggregate
    );
    let totalrecord = await CategoryModal.find({isDeleted: false}).count();
    try
    {
        outputJson   = {
            code: 200, 
            status: "Success",
            message: 'View Product Successfully',
            result:all_category,
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

exports.getAllCategory  = async (req, res) => { 
    let postData = req.body;
    let where = {};
    where["isDeleted"] = false;
    let AllCategoryaggregate = [ 
        {  
            $match:where
        },
        { $sort: { _id: -1 } },
        {   
            $project: { 
              _id:1,
              name:1,
              status:1,
              description:1,
              created_at:1,
              updated_at:1,
              meta_title:1,
              meta_description:1,
              meta_keywords:1,
              user_id:1,
              image:1
            } 
        },  
    ];
    var all_category = await CategoryModal.aggregate(
        AllCategoryaggregate
    );
    try
    {
        outputJson   = {
            code: 200, 
            status: "Success",
            message: 'View Category Successfully',
            result:all_category,
        };
        res.json(outputJson);
    }
    catch(error)
    {
        outputJson   = {code: 400, status: "Faild",message: 'View Category Faild'};
        res.json(outputJson);
    }
};


exports.getAllCategoryById  = async (req, res) => { 
    let postData = req.body;

    let where_user   = {loginToken:postData.token,isDeleted: false}
    let result_user  = await userModel.findOne(where_user);

    let where = {};
    where["isDeleted"] = false;
    if(result_user.role == 'vendor')
    {
        where["user_id"] = ObjectId(result_user._id);
    }
    let AllCategoryaggregate = [ 
        {  
            $match:where
        },
        { $sort: { _id: -1 } },
        {   
            $project: { 
              _id:1,
              name:1,
              status:1,
              description:1,
              created_at:1,
              updated_at:1,
              meta_title:1,
              meta_description:1,
              meta_keywords:1,
              user_id:1,
              image:1
            } 
        },  
    ];
    var all_category = await CategoryModal.aggregate(
        AllCategoryaggregate
    );
    try
    {
        outputJson   = {
            code: 200, 
            status: "Success",
            message: 'View Category Successfully',
            result:all_category,
        };
        res.json(outputJson);
    }
    catch(error)
    {
        outputJson   = {code: 400, status: "Faild",message: 'View Category Faild'};
        res.json(outputJson);
    }
};
