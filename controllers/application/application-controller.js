const { compare }    = require('bcryptjs');
const { response }   = require('express');
const jwt            = require("jsonwebtoken");
const md5            = require("md5");
var randomstring     = require("randomstring");
const { ObjectId }   = require('bson');
const moment         = require('moment');
var ApplicationModal     = require('../../model/application/Application');
var configModal = require("../../model/config/Config");

exports.add_application  = async (req, res) => {
    let postData     = req.body;
    let where_email        = {email:req.body.email}
    let getApplByEmail = await ApplicationModal.findOne(where_email);
    let where_mobile        = {mobile:req.body.mobile}
    let getApplByMobile = await ApplicationModal.findOne(where_mobile); 
    if(getApplByEmail){
        outputJson = {code: 400, status: "Success",message: 'Email is Already Registered'};
        res.json(outputJson);
        return;
    } else if(getApplByMobile){
        outputJson = {code: 400, status: "Success",message: 'Mobile Number is Already Registered'};
        res.json(outputJson);
        return;
    }   
    var application_number = 'DSPGADAG-'+ randomstring.generate({length: 6,charset: 'numeric'});
    const applicationlins = new ApplicationModal({
        name: req.body.name,
        email: req.body.email,
        status: req.body.status,
        mobile : req.body.mobile,
        education: req.body.education,
        dofb: req.body.dofb,
        age : req.body.age,
        occupation: req.body.occupation,
        adharNo: req.body.adharNo,
        address: req.body.address,
        place: req.body.place,
        hobli : req.body.hobli,
        district: req.body.district,
        taluk: req.body.taluk,
        pincode : req.body.pincode,
        image: req.body.image,
        isApproved: req.body.isApproved,
        application_num: application_number
        })
    try
    {   
        const applicationData = await applicationlins.save();
        outputJson = {code: 200, status: "Success",message: 'Add Application Successfully'};
        res.json(outputJson);
    }
    catch(error)
    {
        outputJson     = {code: 400, status: "Faild",message: 'Application Add Faild'};
        res.json(outputJson);
    }
};


exports.editApplicationdata = async (req, res) => {
    let postData     = req.body;

    let where        = {_id:req.query.id,isDeleted:false}
    let getApplication   = await ApplicationModal.findOne(where); 
    let applicationImage;

    if(req.body.image == null)
    {  
        applicationImage = getApplication.image
    }
    else
    { 
        applicationImage = req.body.image
    }
 
    let obj = {
        name: req.body.name,
        email: req.body.email,
        status: req.body.status,
        mobile : req.body.mobile,
        education: req.body.education,
        dofb: req.body.dofb,
        age : req.body.age,
        occupation: req.body.occupation,
        adharNo: req.body.adharNo,
        address: req.body.address,
        place: req.body.place,
        hobli : req.body.hobli,
        district: req.body.district,
        taluk: req.body.taluk,
        pincode : req.body.pincode,
        image: applicationImage,
        isDeleted: req.body.isDeleted,
        isApproved: req.body.isApproved
    }

    try { 
        let result = await ApplicationModal.findOneAndUpdate(
            {_id: ObjectId(req.query.id) },
            obj
        );
        outputJson = { code: 200, status: "Success", message: 'Update Application successfully.', result: result};
        res.json(outputJson);
    } catch (error) {
        res.status(400).json(failAction(error.message));
    }
};

exports.getApplicationWithId  = async (req, res) => {
    var postData = req.body;
	let where    = {_id:postData.id,isDeleted:false}
    let result   = await ApplicationModal.findOne(where); 
    outputJson   = { code: 200, status: "Success", message: 'Application List successfully.', result: result};
    res.json(outputJson);
};

// Delete Application 
exports.deleteApplication = async (req, res) => {
    let cid   = ObjectId(req.body.id);
    let where = {};
    where["_id"] = cid;
    try { 
        let result = await ApplicationModal.deleteOne({ _id: cid });      
        outputJson = { code: 200, status: "Success", message: 'Update Application successfully.', result: result};
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
    var myfilenme = 'application-' + n + '-' + req.files[0].originalname;
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

exports.view_allapplication  = async (req, res) => { 
    let postData = req.body;
    let limit = postData.limit;
    let page = postData.page || 1;
    let skiprecord = limit * page - limit;
    let where = {};
    // where["isDeleted"] = false;
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
                name: 1,
                email: 1,
                status: 1,
                mobile : 1,
                education: 1,
                dofb: 1,
                age : 1,
                occupation: 1,
                adharNo: 1,
                address: 1,
                place: 1,
                hobli : 1,
                district: 1,
                taluk: 1,
                pincode : 1,
                image: 1,
                isDeleted: 1,
                isApproved: 1,
                created_at: 1,
                updated_at: 1,
                sequence_number: 1,
                application_num: 1
            } 
        },  
    ];
    var all_application = await ApplicationModal.aggregate(
        AllProductaggregate
    );
    let totalrecord = await ApplicationModal.find().count();
    try
    {
        outputJson   = {
            code: 200, 
            status: "Success",
            message: 'View Product Successfully',
            result:all_application,
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

exports.getAllApplication  = async (req, res) => { 
    let postData = req.body;
    let where = {};
    where["isDeleted"] = false;
    let AllApplicationaggregate = [ 
        {  
            $match:where
        },
        { $sort: { _id: -1 } },
        {   
            $project: { 
                _id:1,
                name: 1,
                email: 1,
                status: 1,
                mobile : 1,
                education: 1,
                dofb: 1,
                age : 1,
                occupation: 1,
                adharNo: 1,
                address: 1,
                place: 1,
                hobli : 1,
                district: 1,
                taluk: 1,
                pincode : 1,
                image: 1,
                isDeleted: 1,
                isApproved: 1,
                created_at: 1,
                updated_at: 1,
                sequence_number: 1,
                application_num: 1
            } 
        },  
    ];
    var all_application = await ApplicationModal.aggregate(
        AllApplicationaggregate
    );
    try
    {
        outputJson   = {
            code: 200, 
            status: "Success",
            message: 'View Application Successfully',
            result:all_application,
        };
        res.json(outputJson);
    }
    catch(error)
    {
        outputJson   = {code: 400, status: "Faild",message: 'View Application Faild'};
        res.json(outputJson);
    }
};


exports.getAllApplicationById  = async (req, res) => { 
    let postData = req.body;
    let where = {};
    where["isDeleted"] = false;
    let AllApplicationaggregate = [ 
        {  
            $match:where
        },
        { $sort: { _id: -1 } },
        {   
            $project: { 
                _id:1,
                name: 1,
                email: 1,
                status: 1,
                mobile : 1,
                education: 1,
                dofb: 1,
                age : 1,
                occupation: 1,
                adharNo: 1,
                address: 1,
                place: 1,
                hobli : 1,
                district: 1,
                taluk: 1,
                pincode : 1,
                image: 1,
                isDeleted: 1,
                isApproved: 1,
                created_at: 1,
                updated_at: 1,
                sequence_number: 1,
                application_num: 1
            } 
        },  
    ];
    var all_application = await ApplicationModal.aggregate(
        AllApplicationaggregate
    );
    try
    {
        outputJson   = {
            code: 200, 
            status: "Success",
            message: 'View Application Successfully',
            result:all_application,
        };
        res.json(outputJson);
    }
    catch(error)
    {
        outputJson   = {code: 400, status: "Faild",message: 'View Application Faild'};
        res.json(outputJson);
    }
};


exports.sendEmail = async (req, res) => {
    const contact = new ContactModal({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      subject: req.body.subject,
      message: req.body.message,
    });
    try {
      const contactdata = await contact.save();
      outputJson = {
        code: 200,
        status: "Success",
        message: "Message Send Successfully",
      };
  
      // Register Send Mail
  
      const tempConf = await configModal.find();
      const config = tempConf[0];
      
      // Register Send Mail
  
      const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: config.gmail_user,
          pass: config.gmail_password,
        },
      });
  
      // point to the template folder
      const handlebarOptions = {
        viewEngine: {
          partialsDir: path.resolve("./application-email"),
          defaultLayout: false,
        },
        viewPath: path.resolve("./application-email"),
      };
  
      // use a template file with nodemailer
      transporter.use("compile", hbs(handlebarOptions));

      const mailOptions = {
        from: config.gmail_user,
        to: req.body.email,
        subject: "Website Enquiry",
        // html : body
        template: "contact", // the name of the template file i.e email.handlebars
        context: {
          name: req.body.name,
          email: req.body.email,
          message: req.body.message,
          phone: req.body.phone,
          subject: req.body.subject,
        },
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          return res.send("Mail Send Succesfully");
        }
      });
      res.json(outputJson);
    } catch (error) {
      res.status(400).send(error);
    }
  };