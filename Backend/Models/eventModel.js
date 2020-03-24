const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true
    },
    id: { type: String, required: false },
    company_id: { type: String, required: true },
    event_name: { type: String, required: true },
    event_description: { type: String, required: false },
    time: { type: String, required: true },
    date: { type: String, required: true },
    location: { type: String, required: false },
    eligibility:{ type: String, required: false },
    registrations: [
        {
            id: String,
            student_id: String,
            status: String,
        }
    ]
}, { _id: false }, { collection: 'events' });

const createModel = function () {
    return mongoose.model("events", eventSchema)
}

module.exports.createModel = createModel;