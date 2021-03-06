const Category = require('../models/Category');
const { errorHandler } = require('../helpers/dbErrorHandler');

// post a category
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
exports.remove = (req,res) => {
  const category = req.category
  category.remove((err, data)=>{
    if(err){
      return res.status(400).json({
        error:errorHandler(err)
      });
    }
    res.json({
      message:"Category removed"
    });
  })
}


//update category
exports.update = (req,res) => {
  const category = req.category
  category.name = req.body.name
  category.save((err, data)=>{
    if(err){
      return res.status(400).json({
        error:errorHandler(err)
      });
    }
    res.json(data);
  })
}
