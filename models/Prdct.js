const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
//const ReviewSchema = require('./Reviews')

const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

let ProductSchema = new mongoose.Schema(
    {
      name: { type: String, trim: true, required: true, maxlength: 32 },
      description: { type: String, required: true, maxlength: 2000 },
      price: { type: Number, trim: true, required: true, maxlength: 32 },
      category: { type: ObjectId, ref: "Category", required: true },
      brand: { type: ObjectId, ref: "Brand", required: true },
      seller: { type: ObjectId, ref: "User", required: true },
      reviews: [{ type: ObjectId, ref: 'Review' }],
      rating: { type: Number, default: 0 },
      finalRating: { type: Number, default: 0 },
      numReviews: { type: Number, default: 0 },
      quantity: { type: Number },
      sold: { type: Number, default: 0 },
      photo: { data: Buffer, contentType: String },
      shipping: { required: false, type: Boolean }
    },
    { timestamps: true }
);

ProductSchema.pre('save', function (next) {
  var product = this;
  const { name } = product;
  product.name = name[0].toUpperCase() + name.slice(1).toLowerCase();
  next();
});

ProductSchema.pre('findOneAndUpdate', function (next) {
  var product = this._update;
  const { name } = product;
  product.name = name[0].toUpperCase() + name.slice(1).toLowerCase();
  next();
});

ProductSchema.plugin(aggregatePaginate);

module.exports = mongoose.model("Product", ProductSchema);
