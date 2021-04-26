const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema (
    {
        name: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32,
            unique: true
        },
        photo: {
          type: String, required: true
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Category", CategorySchema);
