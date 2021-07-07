const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
//const ReviewSchema = require('./Reviews')

const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

let ProductSchema = new mongoose.Schema(
    {
      name: { type: String, trim: true, required: true, maxlength: 32 },
      description: { type: String, required: true, maxlength: 2000 },
      minPrice: { type: Number, trim: true, },
      maxPrice: { type: Number, default: 0, trim: true, },
      photo: { type: String, required: true },
      shippedFrom: { type: String, required: true },
      variants: [{ type: ObjectId, ref: 'Variant' }],
      category: { type: ObjectId, ref: "Category", required: true },
      brand: { type: ObjectId, ref: "Brand", required: true },
      seller: { type: ObjectId, ref: "User", required: true },
      reviews: [{ type: ObjectId, ref: 'Review' }],
      rating: { type: Number, default: 0 },
      finalRating: { type: Number, default: 0 },
      numReviews: { type: Number, default: 0 },
      quantity: { type: Number },
      sold: { type: Number, default: 0 }
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
