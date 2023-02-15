const { compare }    = require('bcryptjs');
const { response }   = require('express');
const jwt            = require("jsonwebtoken");
const md5            = require("md5");
var randomstring     = require("randomstring");
const { ObjectId }   = require('bson');
const moment         = require('moment');
var SubCategoryModal     = require('../../model/category/SubCategory');
var userModel        = require('../../model/others/User');


exports.add_subCategory  = async (req, res) => {
    let postData     = req.body;
    let where_user   = {loginToken:postData.token,isDeleted: false}
    let result_user  = await userModel.findOne(where_user);

    const subCategorylins = new SubCategoryModal({
        name: req.body.name,
        status: req.body.status,
        description :req.body.description,
        meta_description : req.body.meta_description,
        meta_title: req.body.meta_title,
        meta_keywords : req.body.meta_keywords,
        user_id: result_user._id,
        image: req.body.image,
        cat_id:req.body.cat_id
    })
    try
    {   
        const subCategoryData = await subCategorylins.save();
        outputJson = {code: 200, status: "Success",message: 'Add Sub Category Successfully'};
        res.json(outputJson);
    }
    catch(error)
    {
        outputJson     = {code: 400, status: "Faild",message: 'Sub Category Add Faild'};
        res.json(outputJson);
    }
};


exports.editsubCategorydata = async (req, res) => {
    let postData     = req.body;

    let where        = {_id:req.query.id,isDeleted:false}
    let getCategory   = await SubCategoryModal.findOne(where); 
    let subCategoryImage;
    let where_user   = {loginToken:postData.token,isDeleted: false}
    let result_user  = await userModel.findOne(where_user);

    if(req.body.image == null)
    {  
        subCategoryImage = getCategory.image
    }
    else
    { 
        subCategoryImage = req.body.image
    }
 
    let obj = {
        name: req.body.name,
        status: req.body.status,
        description :req.body.description, 
        type: req.body.type,
        meta_description : req.body.meta_description,
        meta_title: req.body.meta_title,
        meta_keywords : req.body.meta_keywords,
        user_id: result_user._id,
        image : subCategoryImage,
        cat_id:req.body.cat_id
    }

    try { 
        let result = await SubCategoryModal.findOneAndUpdate(
            {_id: ObjectId(req.query.id) },
            obj
        );
        outputJson = { code: 200, status: "Success", message: 'Update Sub Category successfully.', result: result};
        res.json(outputJson);
    } catch (error) {
        res.status(400).json(failAction(error.message));
    }
};

exports.getsubCategoryWithId  = async (req, res) => {
    var postData = req.body;
	let where    = {_id:postData.id,isDeleted:false}
    let result   = await SubCategoryModal.findOne(where); 
    outputJson   = { code: 200, status: "Success", message: 'Sub Category List successfully.', result: result};
    res.json(outputJson);
};

// Delete Category 
exports.deletesubcategory = async (req, res) => {
    let cid   = ObjectId(req.body.id);
    let where = {};
    where["_id"] = cid;
    where["isDeleted"] = false;
    try { 
        let result = await SubCategoryModal.findOneAndUpdate(where, {
        isDeleted: true,
        });      
        outputJson = { code: 200, status: "Success", message: 'Update Sub Category successfully.', result: result};
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
    var myfilenme = 'subCategory-' + n + '-' + req.files[0].originalname;
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

exports.view_allsubCategory  = async (req, res) => { 
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
                    from: 'users',
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'userdata'
            }
        },
        {
            $lookup:{
                    from: 'categories',
                    localField: 'cat_id',
                    foreignField: '_id',
                    as: 'categorydata'
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
                parent_category: "$categorydata.name",
                parent_categoryId: "$categorydata._id",
            } 
        },  
    ];
    var all_subCategory = await SubCategoryModal.aggregate(
        AllProductaggregate
    );
    let totalrecord = await SubCategoryModal.find({isDeleted: false}).count();
    try
    {
        outputJson   = {
            code: 200, 
            status: "Success",
            message: 'View Product Successfully',
            result:all_subCategory,
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

exports.getAllSubCategory  = async (req, res) => { 
    let postData = req.body;
    let where = {};
    where["isDeleted"] = false;
    let AllSubCategoryaggregate = [ 
        {  
            $match:where
        },
        {
            $lookup:{
                    from: 'users',
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'userdata'
            }
        },
        {
            $lookup:{
                    from: 'categories',
                    localField: 'cat_id',
                    foreignField: '_id',
                    as: 'categorydata'
            }
        },
        { $sort: { _id: -1 } },
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
                user_id: "$userdata._id",
                user_name: "$userdata.name",
                parent_category: "$categorydata.name",
                parent_categoryId: "$categorydata._id",
            } 
        },  
    ];
    var all_subcategory = await SubCategoryModal.aggregate(
        AllSubCategoryaggregate
    );
    try
    {
        outputJson   = {
            code: 200, 
            status: "Success",
            message: 'View SubCategory Successfully',
            result:all_subcategory,
        };
        res.json(outputJson);
    }
    catch(error)
    {
        outputJson   = {code: 400, status: "Faild",message: 'View SubCategory Faild'};
        res.json(outputJson);
    }
};

exports.getAllSubCategoryById  = async (req, res) => { 
    let postData = req.body;
    let where = {};
    where["isDeleted"] = false;
    let AllSubCategoryaggregate = [ 
        {  
            $match:where
        },
        {
            $lookup:{
                    from: 'users',
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'userdata'
            }
        },
        {
            $lookup:{
                    from: 'categories',
                    localField: 'cat_id',
                    foreignField: '_id',
                    as: 'categorydata'
            }
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
              image:1,
              user_id: "$userdata._id",
              user_name: "$userdata.name",
              parent_category: "$categorydata.name",
              parent_categoryId: "$categorydata._id",
            } 
        },  
    ];
    var all_category = await SubCategoryModal.aggregate(
        AllSubCategoryaggregate
    );
    try
    {
        outputJson   = {
            code: 200, 
            status: "Success",
            message: 'View SubCategory Successfully',
            result:all_category,
        };
        res.json(outputJson);
    }
    catch(error)
    {
        outputJson   = {code: 400, status: "Faild",message: 'View SubCategory Faild'};
        res.json(outputJson);
    }
};

exports.getSubcategoriesByCatId  = async (req, res) => { 
    let postData = req.body;
    let where = {};
    where["cat_id"] = ObjectId(postData.cat_id);
    let AllSubCategoryaggregate = [ 
        {  
            $match:where
        },
        {
            $lookup:{
                    from: 'users',
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'userdata'
            }
        },
        {
            $lookup:{
                    from: 'categories',
                    localField: 'cat_id',
                    foreignField: '_id',
                    as: 'categorydata'
            }
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
              image:1,
              user_id: "$userdata._id",
              user_name: "$userdata.name",
              parent_category: "$categorydata.name",
              parent_categoryId: "$categorydata._id",
            } 
        },  
    ];
    var all_category = await SubCategoryModal.aggregate(
        AllSubCategoryaggregate
    );
    try
    {
        outputJson   = {
            code: 200, 
            status: "Success",
            message: 'View SubCategory Successfully',
            result:all_category,
        };
        res.json(outputJson);
    }
    catch(error)
    {
        outputJson   = {code: 400, status: "Faild",message: 'View SubCategory Faild'};
        res.json(outputJson);
    }
};

