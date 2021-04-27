const Brand = require('../models/Brand');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.brandById = (req,res,next,id)=>{
  Brand.findById(id).exec((err,brand)=>{
    if(err || !brand){
      return res.status(400).json({
          error: 'Brand does not exist'
      });
    }
    req.brand = brand;
    next();
  })
}

exports.create = (req, res) => {
    const brand = new Brand(req.body);
    brand.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({ data });
    });
};

exports.read = (req,res) =>{
  return res.json(req.brand);
};

exports.update = (req,res) => {
  const brand = req.brand
  brand.name = req.body.name
  brand.save((err, data)=>{
    if(err){
      return res.status(400).json({
        error:errorHandler(err)
      });
    }
    res.json(data);
  })
}

exports.remove = (req,res) => {
  const brand = req.brand
  brand.remove((err, data)=>{
    if(err){
      return res.status(400).json({
        error:errorHandler(err)
      });
    }
    res.json({
      message:"Brand removed"
    });
  })
}

exports.list = (req,res) => {
  Brand.find().exec((err, data)=>{
    if(err){
      return res.status(400).json({
        error:errorHandler(err)
      });
    }
    res.json(data);
  });
};
