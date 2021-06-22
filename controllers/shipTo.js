const ShipTo = require('../models/ShipTo');
const SubCity = require('../models/SubCity.js');
const mongoose = require('mongoose');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.shipToById = (req,res,next,id)=>{
  ShipTo.findById(id).populate('subCities').exec((err, shipTo)=>{
    if(err || !shipTo){
      return res.status(400).json({
          error: 'Place does not exist'
      });
    }
    console.log('SHIP TO SUBCITIES', shipTo.subCities.name)
    req.shipTo = shipTo;
    next();
  })
}

exports.create = (req, res) => {
    const shipTo = new ShipTo(req.body);
    shipTo.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({ data });
    });
};

exports.read = (req,res) =>{
  return res.json(req.shipTo);
};

exports.update = (req,res) => {
  const shipTo = req.shipTo
  shipTo.name = req.body.name
  shipTo.save((err, data)=>{
    if(err){
      return res.status(400).json({
        error:errorHandler(err)
      });
    }
    res.json(data);
  })
}

exports.remove = (req,res) => {
  const shipTo = req.shipTo
  shipTo.remove((err, data)=>{
    if(err){
      return res.status(400).json({
        error:errorHandler(err)
      });
    }
    res.json({
      message:"Place removed"
    });
  })
}

exports.listSubCities = (req, res) => {
  let filterSearchOptions = [];

  if (req.query.shipTo) {
    filterSearchOptions = [{
      $match: {mainCity: new mongoose.Types.ObjectId(req.query.shipTo)},
    }];
  }

  var aggregateQuery = SubCity.aggregate(filterSearchOptions);
  // execute productList
  SubCity
  .aggregatePaginate(aggregateQuery, { page: 1, limit: 100 },
  (
    err,
    result
  ) => {
    if (err) {
      console.log(err);
    } else {
      res.json(result);
    }
  })


};

exports.list = (req,res) => {
  ShipTo.find().exec((err, data)=>{
    if(err){
      return res.status(400).json({
        error:errorHandler(err)
      });
    }
    res.json(data);
  });
};

exports.addSubCity = (req, res, id) => {
  let shipTo = req.shipTo;
  const subCity = new SubCity(req.body);

  subCity.save((err, data) => {
      if (err) {
          return res.status(400).json({
              error: errorHandler(err)
          });
      } else {
        ShipTo.findOne(shipTo).populate('subCities').exec((err, callbackShipTo) => {
          console.log('shipTo', shipTo)
          if(err || !callbackShipTo){
            console.log('ERROR', err)
            return res.status(400).json({
              error:'Place not found'
            });
          } else {
            console.log('PUSH', callbackShipTo.subCities.push(subCity));

            /*
            callbackShipTo.numReviews = callbackShipTo.reviews.length;

            //formula for the rating
            callbackShipTo.rating = callbackShipTo.reviews.reduce((a, c) => c.rating + a, 0) /
            callbackShipTo.reviews.length;

            //final rating for most popular product rating
            callbackShipTo.finalRating = callbackShipTo.rating + callbackShipTo.numReviews;
            */
            //save reviews in product model
            callbackShipTo.save();

            res.status(200).send({
              message: 'Subcity saved successfully.',
            });
          }
        })
      }
  });

}
