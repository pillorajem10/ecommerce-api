const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

let ShipToSchema = new mongoose.Schema (
    {
        name: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32,
            unique: true
        },
        subCities: [{ type: ObjectId, ref: 'SubCity' }],
    },
);

module.exports = mongoose.model("ShipTo", ShipToSchema);
