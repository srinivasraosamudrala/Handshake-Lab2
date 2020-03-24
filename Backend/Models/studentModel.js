const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true
    },
    id: { type: String, required: false },
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    college: { type: String, required: true },
    dob: { type: String, required: false },
    city: { type: String, required: false },
    state: { type: String, required: false },
    country: { type: String, required: false },
    career_objective: { type: String, required: false },
    mobile: { type: String, required: false },
    skills: { type: String, required: false },
    image: { type: String, required: false },
    applications: { type: Array, required: false },
    registrations: { type: Array, required: false },
    education: [
        {
            id: String,
            college_name: String,
            location: String,
            degree: String,
            major: String,
            cgpa: String,
            year_of_starting: Number,
            month_of_starting: Number,
            year_of_passing: Number,
            month_of_passing: Number,
        }
    ],
    experience: [
        {
            id: String,
            company: String,
            title: String,
            location: String,
            description: String,
            year_of_starting: Number,
            month_of_starting: Number,
            year_of_ending: Number,
            month_of_ending: Number,
        }
    ]
}, { _id: false }, { collection: 'students' });

const createModel = function () {
    return mongoose.model("students", studentSchema)
}

module.exports.createModel = createModel;