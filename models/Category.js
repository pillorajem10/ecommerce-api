const mongoose = require("mongoose");

let CategorySchema = new mongoose.Schema (
    {
        name: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32,
            unique: true
        },
        photo: { type: String, required: true }
    },
    { timestamps: true }
);

CategorySchema.pre('save', function (next) {
  var categ = this;
  const { name } = categ;
  categ.name = name[0].toUpperCase() + name.slice(1).toLowerCase();
  next();
});

CategorySchema.pre('findOneAndUpdate', function (next) {
  var categ = this._update;
  const { name } = categ;
  categ.name = name[0].toUpperCase() + name.slice(1).toLowerCase();
  next();
});

module.exports = mongoose.model("Category", CategorySchema);
