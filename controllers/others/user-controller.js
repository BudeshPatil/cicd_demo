const { compare }  = require('bcryptjs');
const { response } = require('express');
const jwt          = require("jsonwebtoken");
const md5          = require("md5");
const nodemailer   = require("nodemailer");
var userModel      = require('../../model/others/User');
const { ObjectId } = require('bson');
var generatePassword = require('password-generator');
const emailvalidator = require("email-validator");
var bcrypt = require("bcryptjs");

exports.login = async (req, res) => {
   
    const user = await userModel.findOne({
        email : req.body.email
    });

    if(!user)
    {
        outputJson  = {code: 400, status: "faild", message: 'Email is wrong'};
        return res.json(outputJson);
    }
    var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
    
    if(!passwordIsValid)
    {  
        outputJson  = {code: 400, status: "faild", message: 'Invalid Password'};
        return res.json(outputJson);
    }
    
    if(user.role == 'student')
    {
        outputJson  = {code: 400, status: "faild", message: 'Invalid Role'};
        return res.json(outputJson);  
    }

    // Assign Token 
    const token = jwt.sign({_id: user._id},process.env.TOKEN_SECRET);
    
    // Update Token database
    const data = await userModel.findOneAndUpdate( 
        {_id: user._id}, 
        {
          loginToken: token,
        },
    );
    res.setHeader("Access-Control-Expose-Headers", "token");
    res.setHeader("token",data.loginToken); 
    outputJson  = {_id:data._id,username:data.username,email:data.email,token:token,role:data.role,code: 200, status: "Success", message: 'Login Success'};
    res.json(outputJson);
};

exports.send_sms = async (req, res) => {
    const {
        mobile,
        country_code,
    } = req.body;
};

exports.updateprofile = async (req, res) => {
   
    // Check User
  
    const user = await userModel.findOne({
        _id : req.body.id,
    });

    let obj = {
        username : req.body.username,
        role : req.body.role,
        password : bcrypt.hashSync(req.body.password, 8),
        email : req.body.email
    }

    if(!user)
    {
        outputJson  = {code: 400, status: "faild", message: 'User Not exists'};
        return res.json(outputJson);
    }
    
    // Update Token database
    const data = await userModel.findOneAndUpdate( 
        {_id: ObjectId(req.body.id)}, 
        obj,
    );
    outputJson  = {code: 200, status: "Success", message: 'Password Updated Success'};
    res.json(outputJson);
};

exports.registerUser = async (req, res) => {

    const existeduser = await userModel.findOne({
        email : req.body.email,
    });
    if(existeduser){
        outputJson     = {code: 400, status: "Fail", message: 'User Already exist'};
        return res.json(outputJson);
    }

    const user = new userModel({
        username: req.body.username,
        email : req.body.email,
        password : bcrypt.hashSync(req.body.password, 8),
        role:req.body.role
    }) 
    try
    {
        if (emailvalidator.validate(req.body.email)) {
            const userdata = await user.save();
            //console.log("Return Url=>",arurl);
            outputJson     = {code: 200, status: "Success", message: 'Register Success'};
            res.json(outputJson);
        } else {
            outputJson     = {code: 400, status: "Fail", message: 'Invaid Email'};
            res.json(outputJson);
        }
    }
    catch(error)
    {
        res.status(400).send(error);
    }
};


exports.admin_view_user  = async (req, res) => {
     
    let postData = req.body;
    let limit = postData.limit;
    let page = postData.page || 1;
    let skiprecord = limit * page - limit;
    let where = {};
    where["isDeleted"] = false;
    let Alltagaggregate = [
        {  
            $match:where
        },
        { $sort: { _id: -1 } },
        { $skip: skiprecord },
        { $limit: limit },
        {   
            $project: { 
              _id:1,
              username:1,
              email:1,
              role:1,
              created_at:1
            } 
        },  
    ];
    var all_users = await userModel.aggregate(
        Alltagaggregate
    );
    let totalrecord = await userModel.find({isDeleted: false}).count();

    try
    {
        outputJson   = {
                        code: 200, 
                        status: "Success",
                        message: 'View User Successfully',
                        result:all_users,
                        page: page,
                        limit: limit,
                        count: totalrecord,
                    };
        res.json(outputJson);
    }
    catch(error)
    {
        outputJson   = {code: 400, status: "Faild",message: 'View User Faild'};
        res.json(outputJson);
    }
};

exports.get_user_with_id  = async (req, res) => {
    var postData = req.body;
	let where    = {_id:postData.id,isDeleted:false}
    let result   = await userModel.findOne(where); 
    outputJson   = { code: 200, status: "Success", message: 'View User successfully.', result: result};
    res.json(outputJson);
};

exports.delete_user = async (req, res) => {
    let cid   = ObjectId(req.body.id);
    let where = {};
    where["_id"] = cid;
    where["isDeleted"] = false;
    try { 
        let result = await userModel.findOneAndUpdate(where, {
        isDeleted: true,
        });     
        outputJson = { code: 200, status: "Success", message: 'Update User successfully.', result: result};
        res.json(outputJson);
    }catch (error) {
        res.status(400).json(failAction(error.message));
    }
};


