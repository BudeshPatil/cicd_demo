const { compare }    = require('bcryptjs');
const { response }   = require('express');
const jwt            = require("jsonwebtoken");
const md5            = require("md5");
var randomstring     = require("randomstring");
const { ObjectId }   = require('bson');
const moment         = require('moment');
var ProductModal     = require('../../model/product/Product');
var userModel        = require('../../model/others/User');

exports.add_product  = async (req, res) => {
    let postData     = req.body;
    let where_user   = {loginToken:postData.token,isDeleted: false}
    let result_user  = await userModel.findOne(where_user);

    let productSlug    = req.body.name.replace(/[^A-Z0-9]/ig,"-").toLowerCase();
    var virtual_result = randomstring.generate({length: 6,charset: 'alphanumeric'});

    const productlins = new ProductModal({
        meta_description : req.body.meta_description,
        meta_title : req.body.meta_title,
        meta_tags : req.body.meta_tags,
        image : req.body.image,
        product_gallery: req.body.image_gallery,
        name : req.body.name,
        slug : productSlug, 
        product_availability: postData.product_availability,
        art_by:result_user._id,
        regular_price : req.body.regular_price,
        sale_price : req.body.sale_price,
        product_discount: postData.product_discount,
        pay_on_delivery: postData.pay_on_delivery,
        replacement_policy: postData.replacement_policy,
        nexait_delivery: postData.nexait_delivery,
        product_description: postData.product_description,
        product_type:postData.product_type,
        virtual_id:virtual_result,
        status:req.body.status,
        is_approved:req.body.is_approved,
        product_count: req.body.product_count,
        category:req.body.category,
        sub_category:req.body.sub_category,
        brand: req.body.brand,
        series: req.body.series,
        model_number: req.body.model_number,
        manufacturer: req.body.manufacturer,
        package: req.body.package,
        dimensions: req.body.dimensions,
        ram_size: req.body.ram_size,
        country_of_origin: req.body.country_of_origin,
        item_weight: req.body.item_weight ,
        memory_technology: req.body.memory_technology,
        clock_speed: req.body.clock_speed,
        screen_display_size: req.body.screen_display_size,
        screen_resolution: req.body.screen_resolution,
        processor: req.body.processor,
        graphics_coprocessor: req.body.graphics_coprocessor,
        hard_drive: req.body.hard_drive,
        chipset_brand: req.body.chipset_brand,
        card_description: req.body.card_description,
        operating_system: req.body.operating_system,
        processor_brand: req.body.processor_brand,
        processor_Count: req.body.processor_Count,
        flash_memory_size: req.body.flash_memory_size,
        memory_speed: req.body.memory_speed,
        wireless_type: req.body.wireless_type,
        batteries: req.body.batteries,
        power_source: req.body.power_source,
        color: req.body.color,
        connection_type: req.body.connection_type ,
        model_name: req.body.model_name,
        part_number: req.body.part_number,
        compatible_devices: req.body.compatible_devices,
        related_products: req.body.related_products
    })
    try
    {   
        const productData = await productlins.save();
        outputJson = {code: 200, status: "Success",message: 'Add Product Successfully'};
        res.json(outputJson);
    }
    catch(error)
    {
        outputJson     = {code: 400, status: "Faild",message: 'Product Add Faild'};
        res.json(outputJson);
    }
};

exports.editProductdata = async (req, res) => {
    let postData     = req.body;

    let where        = {_id:req.query.id,isDeleted:false}
    let where_user   = {loginToken:postData.token,isDeleted: false}
    let result_user  = await userModel.findOne(where_user);
    let getProduct   = await ProductModal.findOne(where); 
    let productImage;
    let productGallery;
    if(req.body.image == null)
    {  
        productImage = getProduct.image
    }
    else
    { 
        productImage = req.body.image
    }

    if(postData.image_gallery.length != 0)
    {
        productGallery = postData.image_gallery;
    }
    else
    {
        productGallery = getProduct.product_gallery;
    }

    let productSlug    = req.body.name.replace(/[^A-Z0-9]/ig,"-").toLowerCase();
    var virtual_result = randomstring.generate({length: 6,charset: 'alphanumeric'});
    let obj = {
        meta_description : req.body.meta_description,
        meta_title : req.body.meta_title,
        meta_tags : req.body.meta_tags,
        image : productImage,
        product_gallery: productGallery,
        name : req.body.name,
        slug : productSlug, 
        product_availability: postData.product_availability,
        art_by:result_user._id,
        regular_price : req.body.regular_price,
        sale_price : req.body.sale_price,
        product_discount: postData.product_discount,
        pay_on_delivery: postData.pay_on_delivery,
        replacement_policy: postData.replacement_policy,
        nexait_delivery: postData.nexait_delivery,
        product_description: postData.product_description,
        product_type:postData.product_type,
        virtual_id:virtual_result,
        status:req.body.status,
        is_approved:req.body.is_approved,
        product_count: req.body.product_count,
        category:req.body.category,
        sub_category:req.body.sub_category,
        brand: req.body.brand,
        series: req.body.series,
        model_number: req.body.model_number,
        manufacturer: req.body.manufacturer,
        package: req.body.package,
        dimensions: req.body.dimensions,
        ram_size: req.body.ram_size,
        country_of_origin: req.body.country_of_origin,
        item_weight: req.body.item_weight ,
        memory_technology: req.body.memory_technology,
        clock_speed: req.body.clock_speed,
        screen_display_size: req.body.screen_display_size,
        screen_resolution: req.body.screen_resolution,
        processor: req.body.processor,
        graphics_coprocessor: req.body.graphics_coprocessor,
        hard_drive: req.body.hard_drive,
        chipset_brand: req.body.chipset_brand,
        card_description: req.body.card_description,
        operating_system: req.body.operating_system,
        processor_brand: req.body.processor_brand,
        processor_count: req.body.processor_count,
        flash_memory_size: req.body.flash_memory_size,
        memory_speed: req.body.memory_speed,
        wireless_type: req.body.wireless_type,
        batteries: req.body.batteries,
        power_source: req.body.power_source,
        color: req.body.color,
        connection_type: req.body.connection_type ,
        model_name: req.body.model_name,
        part_number: req.body.part_number,
        compatible_devices: req.body.compatible_devices,
        related_products: req.body.related_products
    }

    try { 
        let result = await ProductModal.findOneAndUpdate(
            {_id: ObjectId(req.query.id) },
            obj
        );
        outputJson = { code: 200, status: "Success", message: 'Update Product successfully.', result: result};
        res.json(outputJson);
    } catch (error) {
        res.status(400).json(failAction(error.message));
    }
};


exports.view_allproduct  = async (req, res) => { 
    let postData = req.body;

    let where_user   = {loginToken:postData.token,isDeleted: false}
    let result_user  = await userModel.findOne(where_user);

    let limit = postData.limit;
    let page = postData.page || 1;
    let skiprecord = limit * page - limit;
    let where = {};
    where["isDeleted"] = false;
    if(result_user.role == 'vendor')
    {
        where["art_by"] = ObjectId(result_user._id);
    }
    if(postData.vendor_id != '')
    {
        where["art_by"] = ObjectId(postData.vendor_id);
    }
    let AllProductaggregate = [ 
        {  
            $match:where
        },
        { $sort: { _id: -1 } },
        {
            $lookup:{
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'categorydata'
            }
        },
        {
            $lookup:{
                    from: 'subcategories',
                    localField: 'sub_category',
                    foreignField: '_id',
                    as: 'subcategorydata'
            }
        },
        {
            $lookup:{
                    from: 'users',
                    localField: 'art_by',
                    foreignField: '_id',
                    as: 'userdata'
            }
        },
        {
            $lookup:{
                    from: 'brands',
                    localField: 'brand',
                    foreignField: '_id',
                    as: 'branddata'
            }
        },
        { $skip: skiprecord },
        { $limit: limit },
        {   
            $project: { 
                _id:1,
                name:1,
                created_at: 1,
                meta_description : 1,
                meta_title : 1,
                meta_tags : 1,
                image : 1,
                product_gallery: 1,
                slug : 1, 
                product_availability: 1,
                regular_price : 1,
                sale_price : 1,
                product_discount: 1,
                pay_on_delivery: 1,
                replacement_policy: 1,
                nexait_delivery: 1,
                product_description: 1,
                product_type:1,
                virtual_id:1,
                status:1,
                is_approved:1,
                product_count: 1,
                category:1,
                sub_category:1,
                brand: 1,
                series: 1,
                model_number: 1,
                manufacturer: 1,
                package: 1,
                dimensions: 1,
                ram_size: 1,
                country_of_origin: 1,
                item_weight: 1,
                memory_technology: 1,
                clock_speed: 1,
                screen_display_size: 1,
                screen_resolution: 1,
                processor: 1,
                graphics_coprocessor: 1,
                hard_drive: 1,
                chipset_brand: 1,
                card_description: 1,
                operating_system: 1,
                processor_brand: 1,
                processor_count: 1,
                flash_memory_size: 1,
                memory_speed: 1,
                wireless_type: 1,
                batteries: 1,
                power_source: 1,
                color: 1,
                connection_type: 1,
                model_name: 1,
                part_number: 1,
                compatible_devices: 1,
                artby_name: "$userdata.name",
                category_id: "$categorydata._id",
                category_name: "$categorydata.name",
                subcategory_id: "$subcategorydata._id",
                subcategory_name: "$subcategorydata.name", 
                brand_id: "$branddata._id",
                brand_name: "$branddata.name",
                related_products: 1 
            } 
        },  
    ];
    var all_product = await ProductModal.aggregate(
        AllProductaggregate
    );
    let totalrecord = await ProductModal.find({isDeleted: false}).count();
    try
    {
        outputJson   = {
            code: 200, 
            status: "Success",
            message: 'View Product Successfully',
            result:all_product,
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

exports.getfrountproduct  = async (req, res) => { 
    let postData = req.body;
    let limit = postData.limit;
    let page = postData.page || 1;
    let skiprecord = limit * page - limit;
    let filterQuery = {
        isDeleted: false,
    };
    let searchCondition = {};

    if(postData.searchText != null && postData.searchText != '')
    {
        let regex = new RegExp(postData.searchText, "i");
        searchCondition["$or"] = [
            {"name": regex },
        ];
    }

    if(postData.avilablility.length != 0)
    {
        let avilableProduct = postData.avilablility.map((item) => (item));
        filterQuery["product_availability"] = { $in: avilableProduct };
    }
    
    if(postData.price != null && postData.price != '')
    {
        let price_value = postData.price.split("-");
        var maxi_price  = Number(parseInt(price_value[1])) + 1;
        filterQuery["sale_price"] = { "$gte": Number(parseInt(price_value[0])),"$lt": maxi_price};
    }
    
    if(postData.discount != null && postData.discount != '')
    {
        let discount_value = postData.discount.split("-");
        var maxi_discount  = Number(parseInt(discount_value[1])) + 1;
        filterQuery["product_discount"] = { "$gte": Number(parseInt(discount_value[0])),"$lt": maxi_discount};
    }

    if(postData.category.length != 0)
    {
        let categoryid = postData.category.map((item) => ObjectId(item));
        filterQuery["category"] = { $in: categoryid };
    }

    let AllProductaggregate = [ 
        {  
            $match: filterQuery,
        },
        { $sort: { _id: -1 } },,
        {
            $lookup:{
                    from: 'wishlists',
                    localField: '_id',
                    foreignField: 'product',
                    as: 'wishlistdata'
            }
        },
        {
            $lookup:{
                    from: 'users',
                    localField: 'art_by',
                    foreignField: '_id',
                    as: 'userdata'
            }
        },
        {
            $lookup:{
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'categorydata'
            }
        },
        {
            $lookup:{
                    from: 'subcategories',
                    localField: 'sub_category',
                    foreignField: '_id',
                    as: 'subcategorydata'
            }
        },
        {
            $lookup:{
                    from: 'brands',
                    localField: 'brand',
                    foreignField: '_id',
                    as: 'branddata'
            }
        },
        { $skip: skiprecord },
        { $limit: limit },
        { $match: searchCondition },
        {   
            $project: { 
                _id:1,
                name:1,
                created_at: 1,
                meta_description : 1,
                meta_title : 1,
                meta_tags : 1,
                image : 1,
                product_gallery: 1,
                slug : 1, 
                product_availability: 1,
                regular_price : 1,
                sale_price : 1,
                product_discount: 1,
                pay_on_delivery: 1,
                replacement_policy: 1,
                nexait_delivery: 1,
                product_description: 1,
                product_type:1,
                virtual_id:1,
                status:1,
                is_approved:1,
                product_count: 1,
                category:1,
                sub_category:1,
                brand: 1,
                series: 1,
                model_number: 1,
                manufacturer: 1,
                package: 1,
                dimensions: 1,
                ram_size: 1,
                country_of_origin: 1,
                item_weight: 1,
                memory_technology: 1,
                clock_speed: 1,
                screen_display_size: 1,
                screen_resolution: 1,
                processor: 1,
                graphics_coprocessor: 1,
                hard_drive: 1,
                chipset_brand: 1,
                card_description: 1,
                operating_system: 1,
                processor_brand: 1,
                processor_count: 1,
                flash_memory_size: 1,
                memory_speed: 1,
                wireless_type: 1,
                batteries: 1,
                power_source: 1,
                color: 1,
                connection_type: 1,
                model_name: 1,
                part_number: 1,
                compatible_devices: 1,
                artby_name: "$userdata.name",
                category_id: "$categorydata._id",
                category_name: "$categorydata.name",
                subcategory_id: "$subcategorydata._id",
                subcategory_name: "$subcategorydata.name", 
                brand_id: "$branddata._id",
                brand_name: "$branddata.name",
                related_products: 1  
            } 
        },  
    ];
    var all_product = await ProductModal.aggregate(
        AllProductaggregate
    );
    let totalrecord = await ProductModal.find({isDeleted: false}).count();
    try
    {
        outputJson   = {
            code: 200, 
            status: "Success",
            message: 'View Product Successfully',
            result:all_product,
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

exports.getfrounthomepageproduct  = async (req, res) => { 
    let postData = req.body;
    let filterQuery = {
        isDeleted: false,
    };

    let AllProductaggregate = [ 
        {  
            $match: filterQuery,
        },
        { $sort: { _id: -1 } },
        {   
            $project: { 
                _id:1,
                name:1,
                created_at: 1,
                image:1,
            } 
        },  
    ];
    var all_product = await ProductModal.aggregate(
        AllProductaggregate
    );
    try
    {
        outputJson   = {
            code: 200, 
            status: "Success",
            message: 'View Product Successfully',
            result:all_product,
        };
        res.json(outputJson);
    }
    catch(error)
    {
        outputJson   = {code: 400, status: "Faild",message: 'View Product Faild'};
        res.json(outputJson);
    }
};

exports.get_singleproduct  = async (req, res) => { 
    let postData = req.body;
    let where = {};
    where["_id"] = ObjectId(postData.id);
    let AllProductaggregate = [ 
        {  
            $match: where  
        },
        {
            $lookup:{
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'categorydata'
            }
        },
        {
            $lookup:{
                    from: 'subcategories',
                    localField: 'sub_category',
                    foreignField: '_id',
                    as: 'subcategorydata'
            }
        },
        {
            $lookup:{
                    from: 'brands',
                    localField: 'brand',
                    foreignField: '_id',
                    as: 'branddata'
            }
        },
        {   
            $project: { 
                _id:1,
                name:1,
                created_at: 1,
                meta_description : 1,
                meta_title : 1,
                meta_tags : 1,
                image : 1,
                product_gallery: 1,
                slug : 1, 
                product_availability: 1,
                regular_price : 1,
                sale_price : 1,
                product_discount: 1,
                pay_on_delivery: 1,
                replacement_policy: 1,
                nexait_delivery: 1,
                product_description: 1,
                product_type:1,
                virtual_id:1,
                status:1,
                is_approved:1,
                product_count: 1,
                category:1,
                sub_category:1,
                brand: 1,
                series: 1,
                model_number: 1,
                manufacturer: 1,
                package: 1,
                dimensions: 1,
                ram_size: 1,
                country_of_origin: 1,
                item_weight: 1,
                memory_technology: 1,
                clock_speed: 1,
                screen_display_size: 1,
                screen_resolution: 1,
                processor: 1,
                graphics_coprocessor: 1,
                hard_drive: 1,
                chipset_brand: 1,
                card_description: 1,
                operating_system: 1,
                processor_brand: 1,
                processor_count: 1,
                flash_memory_size: 1,
                memory_speed: 1,
                wireless_type: 1,
                batteries: 1,
                power_source: 1,
                color: 1,
                connection_type: 1,
                model_name: 1,
                part_number: 1,
                compatible_devices: 1,
                artby_name: "$userdata.name",
                category_id: "$categorydata._id",
                category_name: "$categorydata.name",
                subcategory_id: "$subcategorydata._id",
                subcategory_name: "$subcategorydata.name",
                brand_id: "$branddata._id",
                brand_name: "$branddata.name",
                related_products: 1  
                  
            } 
        },  
    ];
    var all_product = await ProductModal.aggregate(
        AllProductaggregate
    );
    try
    {
        outputJson   = {
            code: 200, 
            status: "Success",
            message: 'View Product Successfully',
            result:all_product[0],
        };
        res.json(outputJson);
    }
    catch(error)
    {
        outputJson   = {code: 400, status: "Faild",message: 'View Product Faild'};
        res.json(outputJson);
    }
};

exports.get_ProductByartCreated  = async (req, res) => { 
    let postData = req.body;
  	let where    = {virtual_id:postData.id,slug:postData.productslug,isDeleted:false}   
    let result   = await ProductModal.findOne(where); 
    let AllProductaggregate = [  
        {   
            $match:{art_by:result.art_by,isDeleted:false}  
        },
        {   
            $project: { 
                _id:1,
                name:1,
                image:1,
                slug:1,
                virtual_id:1
            } 
        },  
    ];
    var all_product = await ProductModal.aggregate(
        AllProductaggregate
    );
    try
    {
        outputJson   = {
            code: 200, 
            status: "Success",
            message: 'View Product Successfully',
            result:all_product,
        };
        res.json(outputJson);
    }
    catch(error)
    {
        outputJson   = {code: 400, status: "Faild",message: 'View Product Faild'};
        res.json(outputJson);
    }
};

exports.getAllProductByFilter  = async (req, res) => { 
    let postData = req.body;
    let where = {};
    if(postData.type == 'category'){
        where["category"] = ObjectId(postData._id);
    } else if(postData.type == 'sub-category'){
        where["sub_category"] = ObjectId(postData._id);
    } if(postData.type == 'brand'){
        where["brand"] = ObjectId(postData._id);
    } if(postData.type == 'availability'){
        where["product_availability"] = postData.availability;
    }
    where["isDeleted"] = false;
    let AllProductaggregate = [ 
        {  
            $match:where  
        },
        {
            $lookup:{
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'categorydata'
            }
        },
        {
            $lookup:{
                    from: 'subcategories',
                    localField: 'sub_category',
                    foreignField: '_id',
                    as: 'subcategorydata'
            }
        },
        {
            $lookup:{
                    from: 'brands',
                    localField: 'brand',
                    foreignField: '_id',
                    as: 'branddata'
            }
        },
        {   
            $project: { 
                _id:1,
                name:1,
                created_at: 1,
                meta_description : 1,
                meta_title : 1,
                meta_tags : 1,
                image : 1,
                product_gallery: 1,
                slug : 1, 
                product_availability: 1,
                regular_price : 1,
                sale_price : 1,
                product_discount: 1,
                pay_on_delivery: 1,
                replacement_policy: 1,
                nexait_delivery: 1,
                product_description: 1,
                product_type:1,
                virtual_id:1,
                status:1,
                is_approved:1,
                product_count: 1,
                category:1,
                sub_category:1,
                brand: 1,
                series: 1,
                model_number: 1,
                manufacturer: 1,
                package: 1,
                dimensions: 1,
                ram_size: 1,
                country_of_origin: 1,
                item_weight: 1,
                memory_technology: 1,
                clock_speed: 1,
                screen_display_size: 1,
                screen_resolution: 1,
                processor: 1,
                graphics_coprocessor: 1,
                hard_drive: 1,
                chipset_brand: 1,
                card_description: 1,
                operating_system: 1,
                processor_brand: 1,
                processor_count: 1,
                flash_memory_size: 1,
                memory_speed: 1,
                wireless_type: 1,
                batteries: 1,
                power_source: 1,
                color: 1,
                connection_type: 1,
                model_name: 1,
                part_number: 1,
                compatible_devices: 1,
                artby_name: "$userdata.name",
                category_id: "$categorydata._id",
                category_name: "$categorydata.name",
                subcategory_id: "$subcategorydata._id",
                subcategory_name: "$subcategorydata.name",
                brand_id: "$branddata._id",
                brand_name: "$branddata.name",
                related_products: 1  
                  
            } 
        },  
    ];
    var all_product = await ProductModal.aggregate(
        AllProductaggregate
    );
    try
    {
        outputJson   = {
            code: 200, 
            status: "Success",
            message: 'View Product Successfully',
            result: all_product,
        };
        res.json(outputJson);
    }
    catch(error)
    {
        outputJson   = {code: 400, status: "Faild",message: 'View Country Faild'};
        res.json(outputJson);
    }
};

exports.getProductWithId  = async (req, res) => {
    var postData = req.body;
	let where    = {_id:postData.id,isDeleted:false}
    let result   = await ProductModal.findOne(where); 
    outputJson   = { code: 200, status: "Success", message: 'Product List successfully.', result: result};
    res.json(outputJson);
};

// Delete Country 
exports.deleteproduct = async (req, res) => {
    let cid   = ObjectId(req.body.id);
    let where = {};
    where["_id"] = cid;
    where["isDeleted"] = false;
    try { 
        let result = await ProductModal.findOneAndUpdate(where, {
        isDeleted: true,
        });      
        outputJson = { code: 200, status: "Success", message: 'Update Product successfully.', result: result};
        res.json(outputJson);
    }catch (error) {
        res.status(400).json(failAction(error.message));
    }
};

exports.updateProductCount = async (req, res) => {

    let product = req.body.product;
    let where        = {_id:product.product_id,isDeleted:false}
    let getProduct   = await ProductModal.findOne(where); 
    
    let obj = {
        product_count: getProduct.product_count - product.qty,
    }

    try { 
        let result = await ProductModal.findOneAndUpdate(
            {_id: ObjectId(product.product_id) },
            obj
        );
        
        outputJson = { code: 200, status: "Success", message: 'Update Product successfully.'};
        res.json(outputJson);
    } catch (error) {
        res.status(400).json(failAction(error.message));
    }
};


exports.get_all_product  = async (req, res) => { 
    let postData = req.body;
    let AllProductaggregate = [ 
        {
            $lookup:{
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'categorydata'
            }
        },
        {
            $lookup:{
                    from: 'subcategories',
                    localField: 'sub_category',
                    foreignField: '_id',
                    as: 'subcategorydata'
            }
        },
        {
            $lookup:{
                    from: 'brands',
                    localField: 'brand',
                    foreignField: '_id',
                    as: 'branddata'
            }
        },
        {   
            $project: { 
                _id:1,
                name:1,
                created_at: 1,
                meta_description : 1,
                meta_title : 1,
                meta_tags : 1,
                image : 1,
                product_gallery: 1,
                slug : 1, 
                product_availability: 1,
                regular_price : 1,
                sale_price : 1,
                product_discount: 1,
                pay_on_delivery: 1,
                replacement_policy: 1,
                nexait_delivery: 1,
                product_description: 1,
                product_type:1,
                virtual_id:1,
                status:1,
                is_approved:1,
                product_count: 1,
                category:1,
                sub_category:1,
                brand: 1,
                series: 1,
                model_number: 1,
                manufacturer: 1,
                package: 1,
                dimensions: 1,
                ram_size: 1,
                country_of_origin: 1,
                item_weight: 1,
                memory_technology: 1,
                clock_speed: 1,
                screen_display_size: 1,
                screen_resolution: 1,
                processor: 1,
                graphics_coprocessor: 1,
                hard_drive: 1,
                chipset_brand: 1,
                card_description: 1,
                operating_system: 1,
                processor_brand: 1,
                processor_count: 1,
                flash_memory_size: 1,
                memory_speed: 1,
                wireless_type: 1,
                batteries: 1,
                power_source: 1,
                color: 1,
                connection_type: 1,
                model_name: 1,
                part_number: 1,
                compatible_devices: 1,
                artby_name: "$userdata.name",
                category_id: "$categorydata._id",
                category_name: "$categorydata.name",
                subcategory_id: "$subcategorydata._id",
                subcategory_name: "$subcategorydata.name",
                brand_id: "$branddata._id",
                brand_name: "$branddata.name",
                related_products: 1 
                  
            } 
        },  
    ];
    var all_product = await ProductModal.aggregate(
        AllProductaggregate
    );
    try
    {
        outputJson   = {
            code: 200, 
            status: "Success",
            message: 'View Products Successfully',
            result:all_product,
        };
        res.json(outputJson);
    }
    catch(error)
    {
        outputJson   = {code: 400, status: "Faild",message: 'View Product Faild'};
        res.json(outputJson);
    }
};


