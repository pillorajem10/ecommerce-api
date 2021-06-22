const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

let SubCitySchema = new mongoose.Schema (
    {
        name: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32,
            unique: true
        },
        mainCity: {type: ObjectId, ref: "ShipTo", required: true}
    },
);

SubCitySchema.plugin(aggregatePaginate);

module.exports = mongoose.model("SubCity", SubCitySchema);
