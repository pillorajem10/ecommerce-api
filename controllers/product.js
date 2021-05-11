const Product = require('../models/Prdct.js');
const Reviews = require('../models/Reviews.js');
const formidable = require ('formidable');
const { errorHandler } = require('../helpers/dbErrorHandler');
const _ = require ('lodash');
const fs = require ('fs');
const mongoose = require('mongoose');


exports.productById = (req,res,next,id)=>{
  Product.findById(id).populate(['reviews', 'category']).exec((err, product)=>{
      if(err || !product){
        return res.status(400).json({
          error:'Product not found'
        });
      }
      req.product = product;
      next();
  });
};

exports.reviewById = (req,res,next,id)=>{
  Reviews.findById(id).exec((err, review)=>{
      if(err || !review){
        return res.status(400).json({
          error:'Review not found'
        });
      }
      req.review = review;
      next();
  });
};

exports.read = (req, res) =>{
  req.product.photo = undefined
  return res.json(req.product);
};

exports.create = (req, res) => {
   let form = new formidable.IncomingForm()
   form.keepExtensions = true
   form.parse(req, (err, fields, files)=>{
     if(err){
       return res.status(400).json({
         error:'Image could not be uploaded'
       });
     }

     //check for fields
     const { name, description, price, category, brand, quantity, shipping } = fields
     if(!name || !description || !price || !category || !brand || !quantity || !shipping){
       return res.status(400).json({
         error:'All fields are required'
       });
     }

     let product = new Product(fields)

     //1kb is = 1000
     //1mb is = 1000000

     if(files.photo){
       //console.log("FILES PHOTO: ", files.photo);
       if(files.photo.size > 1000000){
         return res.status(400).json({
           error:'Image should be less than 1MB size'
         });
       }
       product.photo.data = fs.readFileSync(files.photo.path)
       product.photo.contentType = files.photo.type
     }

     product.save((err, result)=>{
       if(err){
         return res.status(400).json({
           error: errorHandler(err)
         })
       } else {
         return res.json(result);
       }
     })
   });
};

exports.remove = (req,res) => {
  let product = req.product;
  Product.findByIdAndRemove(product, function(err, deletedProduct){
    if(err){
      return res.status(400).json({
        error: errorHandler(err)
      });
    }
    res.json({
      message:"product deleted"
    });
  });
};

exports.reviews = (req, res, id) => {
  let product = req.product;
  const review = new Reviews(req.body)
  review.save((err, data) => {
      if (err) {
          return res.status(400).json({
              error: errorHandler(err)
          });
      } else {
          Product.findById(product).populate('reviews').exec((err, callbackProduct) => {
            if(err || !callbackProduct){
              return res.status(400).json({
                error:'Product not found'
              });
            } else {
              callbackProduct.reviews.push(review);
              callbackProduct.numReviews = callbackProduct.reviews.length;

              //formula for the rating
              callbackProduct.rating = callbackProduct.reviews.reduce((a, c) => c.rating + a, 0) /
              callbackProduct.reviews.length;

              //final rating for most popular product rating
              callbackProduct.finalRating = callbackProduct.rating + callbackProduct.numReviews;

              console.log('RATING', callbackProduct.rating);
              console.log('BEM BEM', callbackProduct.reviews.reduce((a, c) => c.rating + a, 0) /
              callbackProduct.reviews.length)

              //save reviews in product model
              console.log('[[REVIEWWW]]', callbackProduct.reviews);
              callbackProduct.save();

              res.status(200).send({
                message: 'Review saved successfully.',
              });
            }
          })
      }
  });
}

exports.reviewUpdate = (req, res, id) => {
  let product = req.product;
  const review = req.review
  review.name = req.body.name
  review.comment = req.body.comment
  review.rating = req.body.rating
  review.userRole = req.body.userRole
  review.userId = req.body.userId
  review.save((err, data) => {
      if (err) {
          return res.status(400).json({
              error: errorHandler(err)
          });
      } else {
          Product.findById(product).populate('reviews').exec((err, callbackProduct) => {
            if(err || !callbackProduct){
              return res.status(400).json({
                error:'Product not found'
              });
            } else {
              callbackProduct.reviews.set(review);
              callbackProduct.numReviews = callbackProduct.reviews.length;

              //formula for the rating
              callbackProduct.rating = callbackProduct.reviews.reduce((a, c) => c.rating + a, 0) /
              callbackProduct.reviews.length;

              //final rating for most popular product rating
              callbackProduct.finalRating = callbackProduct.rating + callbackProduct.numReviews;

              console.log('REBYUUUU', callbackProduct.reviews);
              console.log('BEM BEM', callbackProduct.reviews.reduce((a, c) => c.rating + a, 0) /
              callbackProduct.reviews.length)

              //save reviews in product model
              console.log('[[REVIEWWW]]', callbackProduct.reviews);
              console.log('[[LENGTH PRE]]', callbackProduct.reviews.length);
              console.log('[[PRODUCT RATING SHIT]]', callbackProduct.rating);
              callbackProduct.save();

              res.status(200).send({
                message: 'Review updated successfully.',
              });
            }
          })
      }
  });
}

exports.reviewDel = (req, res, id) => {
  let product = req.product;
  const review = req.review
  review.remove((err, data) => {
      if (err) {
          return res.status(400).json({
              error: errorHandler(err)
          });
      } else {
          Product.findById(product).populate('reviews').exec((err, callbackProduct) => {
            if(err || !callbackProduct){
              return res.status(400).json({
                error:'Product not found'
              });
            } else {
              if (err || !review) {
                return res.status(400).json({
                  error:'Something went wrong, review not found'
                });
              } else {
                if(callbackProduct.reviews.length === 0) {
                  callbackProduct.rating = 0
                } else {
                  //formula for the rating
                  callbackProduct.rating = callbackProduct.reviews.reduce((a, c) => c.rating + a, 0) /
                  callbackProduct.reviews.length;
                }
                callbackProduct.numReviews = callbackProduct.reviews.length;

                //final rating for most popular product rating
                callbackProduct.finalRating = callbackProduct.rating + callbackProduct.numReviews;
                callbackProduct.reviews.length

                //remove the into the review document
                callbackProduct.reviews.pull(review);

                //save reviews in product model
                callbackProduct.save();
                res.status(200).send({
                  message: 'Review deleted successfully.',
                });
              }
            }
          })
      }
  });
}

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
     const { name, description, price, category, brand, quantity, shipping } = fields
     if(!name || !description || !price || !category || !brand || !quantity || !shipping){
       return res.status(400).json({
         error:'All fields are required'
       });
     }

     let product = req.product
     product =_.extend(product, fields)

     //1kb is = 1000
     //1mb is = 1000000

     if(files.photo){
       //console.log("FILES PHOTO: ", files.photo);
       if(files.photo.size > 1000000){
         return res.status(400).json({
           error:'Image should be less than 1MB size'
         });
       }
       product.photo.data = fs.readFileSync(files.photo.path)
       product.photo.contentType = files.photo.type
     }

     product.save((err, result)=>{
       if(err){
         return res.status(400).json({
           error: "Photo is required"
         })
       }

       res.json(result);

     })
   });
};

exports.photo = (req, res, next) => {
  if(req.product.photo.data){
    res.set('Content-Type', req.product.photo.contentType)
    return res.send(req.product.photo.data)
  }
  next();
};


exports.list = (req, res) => {
  //for pagination
  const { pageIndex, pageSize } = req.query;
  const page = pageIndex;
  const limit = pageSize;

  let filterSearchOptions = [];

  if (req.query.category && req.query.name && req.query.brand) {
    filterSearchOptions = [{
      $match: {
        $text: { $search: req.query.name },
        category: new mongoose.Types.ObjectId(req.query.category),
        brand: new mongoose.Types.ObjectId(req.query.brand),
      }
    }];
  }

  if (!req.query.category && req.query.name && req.query.brand) {
    filterSearchOptions = [{
      $match: {
        $text: { $search: req.query.name },
        brand: new mongoose.Types.ObjectId(req.query.brand),
      }
    }];
  }

  if (req.query.category && !req.query.name && req.query.brand) {
    filterSearchOptions = [{
      $match: {
        category: new mongoose.Types.ObjectId(req.query.category),
        brand: new mongoose.Types.ObjectId(req.query.brand),
      }
    }];
  }

  if (req.query.category && req.query.name && !req.query.brand) {
    filterSearchOptions = [{
      $match: {
        category: new mongoose.Types.ObjectId(req.query.category),
        $text: { $search: req.query.name },
      }
    }];
  }

  if (!req.query.category && !req.query.name && req.query.brand) {
    filterSearchOptions = [{
      $match: {
        brand: new mongoose.Types.ObjectId(req.query.brand),
      }
    }];
  }

  if (req.query.category && !req.query.name && !req.query.brand) {
    filterSearchOptions = [{
      $match: {
        category: new mongoose.Types.ObjectId(req.query.category),
      }
    }];
  }

  if (!req.query.category && req.query.name && !req.query.brand) {
    filterSearchOptions = [{
      $match: {
        $text: { $search: req.query.name },
      }
    }];
  }

/*
  if (!req.query.category && req.query.name) {
    filterSearchOptions = [{
      $match: {
        $text: { $search: req.query.name },
      }
    }];
  }

  if (req.query.category && !req.query.name) {
    filterSearchOptions = [{
      $match: {
        category: new mongoose.Types.ObjectId(req.query.category),
      }
    }];
  }
*/

  var aggregateQuery = Product.aggregate(filterSearchOptions);
  // execute productList
  Product
  .aggregatePaginate(aggregateQuery,  { page, limit },
  (
    err,
    result
  ) => {
    if (err) {
      console.err(err);
    } else {
      res.json(result)
    }
  });
};

//for New products and Most popular products
exports.nopaginatelist = (req, res) => {
  let order = req.query.order ? req.query.order : 'asc';
  let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
  let limit = req.query.limit ? parseInt(req.query.limit) : 0;

  Product.find()
      .select('-photo')
      .populate('category')
      .sort([[sortBy, order]])
      .limit(limit)
      .exec((err, products) => {
          if (err) {
              return res.status(400).json({
                  error: 'No products found'
              });
          }
          res.json(products);
      });
};
