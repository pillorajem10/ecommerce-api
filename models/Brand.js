const mongoose = require("mongoose");

let BrandSchema = new mongoose.Schema (
    {
        name: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32,
            unique: true
        },
    },
    { timestamps: true }
);

BrandSchema.pre('save', function (next) {
  var brand = this;
  const { name } = brand;
  brand.name = name[0].toUpperCase() + name.slice(1).toLowerCase();
  next();
});

BrandSchema.pre('findOneAndUpdate', function (next) {
  var brand = this._update;
  const { name } = brand;
  brand.name = name[0].toUpperCase() + name.slice(1).toLowerCase();
  next();
});

module.exports = mongoose.model("Brand", BrandSchema);
