const Product = require('../models/Prdct.js');
const Reviews = require('../models/Reviews.js');
const Variant = require('../models/Variant.js');
const { errorHandler } = require('../helpers/dbErrorHandler');
const mongoose = require('mongoose');

exports.productById = (req,res,next,id)=>{
  Product.findById(id).populate(['brand', 'category', 'seller', 'variants']).exec((err, product)=>{
      if(err || !product){
        return res.status(400).json({
          error:'Product not found'
        });
      }

      //const max = product.variants.reduce((v, b) => Math.max(v, b.variantPrice), product.variants[0].variantPrice);
      //const min = product.variants.reduce((v, b) => Math.min(v, b.variantPrice), product.variants[0].variantPrice);

      //console.log("MAX", max);
      //console.log("MIN", min);

      req.product = product;
      next();
  });
};

exports.reviewById = (req, res, next, id)=>{
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

exports.variantById = (req, res, next, id)=>{
  Variant.findById(id).exec((err, variant)=>{
      if(err || !variant){
        return res.status(400).json({
          error:'Review not found'
        });
      }
      req.variant = variant;
      next();
  });
};

exports.read = (req, res) => {
  return res.json(req.product);
};

exports.readVariant = (req, res) =>{
  return res.json(req.variant);
  console.log("REQUESTED VARIANT", req.variant);
};


exports.create = (req, res) => {
    const product = new Product(req.body);
    const variant = new Variant(req.body);
    product.save((err, data) => {
        if (err) {
            console.log('ERROR', err)
            return res.status(400).json({
                error: errorHandler(err)
            });
        } else {
          variant.save((err, variant) => {
              if (err) {
                  console.log("ERR", err)
                  return res.status(400).json({
                      error: errorHandler(err)
                  });
              } else {
                product.minPrice = variant.variantPrice;
                product.variants.push(variant);
                product.save();
                res.json({
                  product: data,
                });
              }
          });
        }
    });
};

exports.addVariant = (req, res, id) => {
  let product = req.product;
  const variant = new Variant(req.body);

  variant.save((err, data) => {
      if (err) {
          console.log("ERR", err)
          return res.status(400).json({
              error: errorHandler(err)
          });
      } else {
        Product.findOne(product).populate('variants').exec((err, callbackProduct) => {
          if(err || !callbackProduct){
            return res.status(400).json({
              error:'Product not found'
            });
          } else {
            //console.log("[[VARIANTS LOL UPPER]]", callbackProduct.variants);
            callbackProduct.variants.push(variant);
            callbackProduct.maxPrice = callbackProduct.variants.reduce((v, b) => Math.max(v, b.variantPrice), callbackProduct.variants[0].variantPrice);
            callbackProduct.minPrice = callbackProduct.variants.reduce((v, b) => Math.min(v, b.variantPrice), callbackProduct.variants[0].variantPrice);
            callbackProduct.save();
            //console.log("[[VARIANTS LOL]]", callbackProduct.variants);
            console.log("[[MAX PRICE]]", callbackProduct.maxPrice);
            console.log("[[MIN PRICE]]", callbackProduct.minPrice);
            console.log("[[MAX PRICE (1)]]", callbackProduct.variants.reduce((v, b) => Math.max(v, b.variantPrice), callbackProduct.variants[0].variantPrice));
            console.log("[[MIN PRICE (1)]]", callbackProduct.variants.reduce((v, b) => Math.min(v, b.variantPrice), callbackProduct.variants[0].variantPrice));
            res.status(200).send({
              message: 'Variant saved successfully.',
            });
          }
        })
      }
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

exports.getReviews = (req, res) => {

    //for pagination
    const { pageIndex, pageSize } = req.query;
    const page = pageIndex;
    const limit = pageSize;

    const aggre = [
      {$match: {product: new mongoose.Types.ObjectId(req.query.product)}},
      {$lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'userId'
      }}
    ];

    var aggregateQuery = Reviews.aggregate(aggre);
    // execute productList
    Reviews
    .aggregatePaginate(aggregateQuery, { sort: { createdAt: 'desc' }, page, limit },
    (
      err,
      result
    ) => {
      if (err) {
        console.err(err);
      } else {
        res.json(result);
      }
    })
};


exports.reviews = (req, res, id) => {
  const badWords = [
    'tite',
    'puke',
    'tite',
    'pepe',
    'suso',
    'kantot',
    'kantutan',
    'kantotan',
    'puta',
    'gago',
    'eut',
    'iyot',
    'tanginamo',
    'tangina',
    'tarantado',
    'pakyu',
    'fuck',
    'motherfucker',
    'putangina',
    'putanginamo',
    'bobo',
    'tanga',
    'kupal',
    'puke',
    'puki',
    'bilat',
    'kipay',
    'tit3',
    't@nginamo',
    't@ngina',
    'fuckyou',
    'pussy',
    'dickhead',
    'bitch',
    'gagu',
    'ogag',
    'ugag',
    'titi',
    'itit',
    'porn',
    'youjizz',
    'pornhub',
    'g@go',
    'p@kyu',
    'cyka',
    'blyat',
    'kantut',
  ];

  let product = req.product;
  const review = new Reviews(req.body);
  let badComment = false;

  Object.keys(badWords).map(arr => {
    if (review.comment.toLowerCase().includes(badWords[arr]) === true) {
      badComment = true;
    }
  });

  if (badComment === true) {
    return res.status(400).json({
      error:'Your comment is inappropriate'
    });
  } else if(review.comment.length > 300) {
    return res.status(400).json({
      error:'Your comment is too long'
    });
  } else {
    review.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        } else {
          Product.findOne(product).populate('reviews').exec((err, callbackProduct) => {
            if(err || !callbackProduct){
              return res.status(400).json({
                error:'Product not found'
              });
            } else {
              console.log('PUSH', callbackProduct.reviews.push(review));
              callbackProduct.numReviews = callbackProduct.reviews.length;

              //formula for the rating
              callbackProduct.rating = callbackProduct.reviews.reduce((a, c) => c.rating + a, 0) /
              callbackProduct.reviews.length;

              //final rating for most popular product rating
              callbackProduct.finalRating = callbackProduct.rating + callbackProduct.numReviews;

              //save reviews in product model
              callbackProduct.save();

              res.status(200).send({
                message: 'Review saved successfully.',
              });
            }
          })
        }
    });
  }
};

exports.reviewUpdate = (req, res, id) => {
  const badWords = [
    'tite',
    'puke',
    'tite',
    'pepe',
    'suso',
    'kantot',
    'kantutan',
    'kantotan',
    'puta',
    'gago',
    'eut',
    'iyot',
    'tanginamo',
    'tangina',
    'tarantado',
    'pakyu',
    'fuck',
    'motherfucker',
    'putangina',
    'putanginamo',
    'bobo',
    'tanga',
    'kupal',
    'puke',
    'puki',
    'bilat',
    'kipay',
    'tit3',
    't@nginamo',
    't@ngina',
    'fuckyou',
    'pussy',
    'dickhead',
    'bitch',
    'gagu',
    'ogag',
    'ugag',
    'titi',
    'itit',
    'porn',
    'youjizz',
    'pornhub',
    'g@go',
    'p@kyu',
    'cyka',
    'blyat',
    'kantut',
  ];

  let product = req.product;
  const review = req.review;
  review.comment = req.body.comment;
  review.rating = req.body.rating;
  let badComment = false;

  Object.keys(badWords).map(arr => {
    if (review.comment.toLowerCase().includes(badWords[arr]) === true) {
      badComment = true;
    }
  });

  if (badComment === true) {
    return res.status(400).json({
      error:'Your comment is inappropriate'
    });
  } else if(review.comment.length > 300) {
    return res.status(400).json({
      error:'Your comment is too long'
    });
  } else {
    review.save((err, data) => {
        if (err) {
            console.log('ERROR', err)
            return res.status(400).json({
                error: errorHandler(err)
            });
        } else {
            Product.findOneAndUpdate(product).populate('reviews').exec((err, callbackProduct) => {
              if(err || !callbackProduct){
                return res.status(400).json({
                  error:'Product not found'
                });
                console.log('ERROR', err)
              } else {
                callbackProduct.numReviews = callbackProduct.reviews.length;

                //formula for the rating
                callbackProduct.rating = callbackProduct.reviews.reduce((a, c) => c.rating + a, 0) /
                callbackProduct.reviews.length;

                //final rating for most popular product rating
                callbackProduct.finalRating = callbackProduct.rating + callbackProduct.numReviews;

                //delete the previous review by id
                callbackProduct.reviews.pull(review);

                //saving new comment by id
                callbackProduct.reviews.push(review);
                callbackProduct.save();

                res.status(200).send({
                  message: 'Review updated successfully.',
                });
              }
            })
        }
    });
  }
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

exports.update = (req,res) => {
  const product = req.product;

  product.name = req.body.name;
  product.description = req.body.description;
  product.price = req.body.price;
  product.category = req.body.category;
  product.brand = req.body.brand;
  product.seller = req.body.seller;
  product.quantity = req.body.quantity;

  product.save((err, data)=>{
    if(err){
      return res.status(400).json({
        error:errorHandler(err)
      });
    }
    res.json(data);
  })
}

/*exports.photo = (req, res, next) => {
  if(req.product.photo.data){
    res.set('Content-Type', req.product.photo.contentType)
    return res.send(req.product.photo.data)
  }
  next();
};*/


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
  .aggregatePaginate(aggregateQuery, { page, limit },
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
      .populate(['category', 'brand', 'variants'])
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
