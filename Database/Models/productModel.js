const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true
    },
    name : { type: String, required: true },
    seller_id : {type:String, required:true},
    price : { type: Number, required: true },
    category : { type: String, required: true },
    description : { type: String, required: false },
    discount : { type: String, required: false },
    views : { type: Number, required: false},
    expired : {type: Boolean, required: false},
    cumulative_rating: {type: Number, required: false},
    cumulative_comment: {type: String, required: false},
    product_reviews: [
        {
            customer_id: String,
            rating: Number,
            comment: String,
            time_stamp: String
        }
    ],
    images: [
        {
            image: String
        }
    ]
}, { _id: false }, { collection: 'products' });

const createModel = function () {
    return mongoose.model("products", productSchema)
}

module.exports.createModel = createModel;