const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

let ReviewSchema = new mongoose.Schema (
  {
    userId: { type: ObjectId, ref: "User", required: true },
    product: { type: ObjectId, ref: "Product", required: true },
    comment: { type: String, required: true },
    rating: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

ReviewSchema.plugin(aggregatePaginate);

module.exports = mongoose.model("Review", ReviewSchema);
