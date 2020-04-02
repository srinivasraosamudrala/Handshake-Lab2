const mongoose = require('mongoose');
const Schema = mongoose.Schema;
autoIncrement = require('mongoose-auto-increment');

const eventSchema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true
    },
    id: { type: mongoose.Schema.Types.ObjectId, required: false },
    company_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    event_name: { type: String, required: true },
    event_description: { type: String, required: false },
    time: { type: String, required: true },
    date: { type: String, required: true },
    location: { type: String, required: false },
    eligibility:{ type: String, required: false },
    registrations: [
        {
            // id: mongoose.Schema.Types.ObjectId,
            student_id: mongoose.Schema.Types.ObjectId,
            status: String,
        }
    ]
}, { _id: false }, { collection: 'events' });
// autoIncrement.initialize(mongoose.connection);
// eventSchema.plugin(autoIncrement.plugin, { model: 'events', field: 'registrations.id' });

const createModel = function () {
    return mongoose.model("events", eventSchema)
}

module.exports.createModel = createModel;