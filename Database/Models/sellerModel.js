const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sellerSchema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true
    },
    name : { type: String, required: true },
    email : { type: String, required: true },
    password : { type: String, required: true },
    address : { type: String, required: true },
    image : { type: String, required: false }
}, { _id: false }, { collection: 'sellers' });

const createModel = function () {
    return mongoose.model("sellers", sellerSchema)
}

module.exports.createModel = createModel;