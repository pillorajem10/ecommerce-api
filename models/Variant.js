const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

let VariantSchema = new mongoose.Schema (
  {
    mainProduct: { type: ObjectId, ref: "Product", required: true },
    variantName: { type: String, required: true },
    photo: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Variant", VariantSchema);
