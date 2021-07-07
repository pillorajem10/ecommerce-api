const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

let VariantSchema = new mongoose.Schema (
  {
    variantName: { type: String, required: true },
    variantPrice: { type: Number, required: true },
    variantPhoto: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Variant", VariantSchema);
