const Category = require('../models/Category');
const Product = require('../models/Prdct');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.create = (req, res) => {
  const category = new Category(req.body);
  category.save((err, data) => {
      if (err) {
          return res.status(400).json({
              error: errorHandler(err)
          });
      }
      res.json({ data });
  });
};

/*exports.photo = (req, res, next) => {
  if(req.category.photo.data){
    res.set('Content-Type', req.category.photo.contentType)
    return res.send(req.category.photo.data)
  }
  next();
};*/


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
  const category = req.category
  category.name = req.body.name
  category.photo = req.body.photo
  category.save((err, data)=>{
    if(err){
      return res.status(400).json({
        error:errorHandler(err)
      });
    }
    res.json(data);
  })
};
