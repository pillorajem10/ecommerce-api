const Category = require('../models/Category');
const Product = require('../models/Prdct');
const { errorHandler } = require('../helpers/dbErrorHandler');
const formidable = require ('formidable');
const _ = require ('lodash');
const fs = require ('fs');

exports.create = (req, res) => {
   let form = new formidable.IncomingForm()
   form.keepExtensions = true
   form.parse(req, (err, fields, files) => {
     if(err){
       return res.status(400).json({
         error:'Image could not be uploaded'
       });
     }

     //check for fields
     const { name } = fields
     if(!name){
       return res.status(400).json({
         error:'Name field is required'
       });
     }

     let category = new Category(fields)

     //1kb is = 1000
     //1mb is = 1000000

     if(files.photo){
       //console.log("FILES PHOTO: ", files.photo);
       if(files.photo.size > 1000000){
         return res.status(400).json({
           error:'Image should be less than 1MB size'
         });
       }
       category.photo.data = fs.readFileSync(files.photo.path)
       category.photo.contentType = files.photo.type
     }


     category.save((err, result)=>{
       if(err){
         console.log('ERROR', err)
         return res.status(400).json({
           error: errorHandler(err)
         })
       }

       res.json(result);

     })
   });
};

exports.photo = (req, res, next) => {
  if(req.category.photo.data){
    res.set('Content-Type', req.category.photo.contentType)
    return res.send(req.category.photo.data)
  }
  next();
};


// get category by ID
exports.categoryById = (req, res, next, id) => {
    Category.findById(id).exec((err, category) => {
        if (err || !category) {
            return res.status(400).json({
                error: 'Category does not exist'
            });
        }
        req.category = category;
        next();
    });
};


// read category
exports.read = (req,res) =>{
  return res.json(req.category);
};


// list all category
exports.list = (req,res) => {
  Category.find().exec((err, data)=>{
    if(err){
      return res.status(400).json({
        error:errorHandler(err)
      });
    }
    res.json(data);
  });
};


//delete category
exports.remove = (req, res) => {
    const category = req.category;
    Product.find({ category }).exec((err, data) => {
        if (data.length >= 1) {
            return res.status(400).json({
                message: `Sorry. You cant delete ${category.name}. It has ${data.length} associated products.`
            });
        } else {
            category.remove((err, data) => {
                if (err) {
                    return res.status(400).json({
                        error: errorHandler(err)
                    });
                }
                res.json({
                    message: 'Category deleted'
                });
            });
        }
    });
};


//update category
exports.update = (req, res) => {
   let form = new formidable.IncomingForm()
   form.keepExtensions = true
   form.parse(req, (err, fields, files)=>{
     if(err){
       return res.status(400).json({
         error:'Image could not be uploaded'
       });
     }

     //check for fields
     const { name } = fields
     if(!name){
       return res.status(400).json({
         error:'Name field is required'
       });
     }

     let category = req.category
     category =_.extend(category,fields)

     //1kb is = 1000
     //1mb is = 1000000

     if(files.photo){
       //console.log("FILES PHOTO: ", files.photo);
       if(files.photo.size > 1000000){
         return res.status(400).json({
           error:'Image should be less than 1MB size'
         });
       }
       category.photo.data = fs.readFileSync(files.photo.path)
       category.photo.contentType = files.photo.type
     }

     category.save((err, result)=>{
       if(err){
         console.log('ERROR', err)
         return res.status(400).json({
           error: errorHandler(err)
         })
       }

       res.json(result);

     })
   });
};
