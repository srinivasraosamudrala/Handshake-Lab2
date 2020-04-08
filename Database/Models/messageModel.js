const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const messageSchema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        auto: true
    },
    id1:{
        sender : { type: mongoose.Schema.Types.ObjectId, required: true },
        persona: String
    },
    id2:{
        receiver: { type: mongoose.Schema.Types.ObjectId, required: true },
        persona: String
    },
    messages: [
        {
            fromId:mongoose.Schema.Types.ObjectId,
            message:String,
            dateTime:String
        }
    ]
}, { collection: 'messages' });
const createModel = function () {
    return mongoose.model("messages", messageSchema)
}
module.exports.createModel = createModel;