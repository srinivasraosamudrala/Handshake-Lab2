const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator')

const companySchema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true
    },
    id: { type: String, required: false },
    name: { type: String, required: true },
    email: { type: String, required: true, unique:true },
    password: { type: String, required: true },
    location: { type: String, required: true },
    phone: { type: String, required: false },
    company_description: { type: String, required: false },
    image: { type: Buffer, required: false }
    }, { _id: false }, { collection: 'companies' });

// companySchema.index({email:1}, {unique: true});
companySchema.plugin(uniqueValidator)

const createModel = function () {
    return mongoose.model("companies", companySchema)
}

module.exports.createModel = createModel;