const query = require('../Queries/mongooseQueries');
const Message = require('../Models/messageModel');
var ObjectId = require('mongodb').ObjectID;

exports.handle_request = async (data) => {
    console.log(data)
    if (data.path == 'fetchMessages') {
        return fetchMessages(data)
    }else if (data.path == 'createConversation') {
        return createConversation(data)
    }
}


createConversation = async (conversationDetails) => {
    try {
        match = {
            $or: [
                { 'id1.sender': ObjectId(conversationDetails.id1), 'id2.receiver': ObjectId(conversationDetails.id2) },
                { 'id1.sender': ObjectId(conversationDetails.id2), 'id2.receiver': ObjectId(conversationDetails.id1) },
            ]
        };
        update = conversationDetails.update;
        options = { upsert: true, new: true, setDefaultsOnInsert: true};
        return await Message.createModel().findOneAndUpdate(match, update, options)
    }
    catch (error) {
        return new Error(error)
    }
}

fetchMessages = async (messageQuery) => {
    try {
        let error = null
        let result = await query.findDocumentsByQueryAsync(Message.createModel(),
            {
                $or: [
                    { 'id1.sender': ObjectId(messageQuery.id) },
                    { 'id2.receiver': ObjectId(messageQuery.id) },
                ]
            },
            { id1: 1, id2: 1 },
            { runValidators: false }
            )
            return await processLookup(result,messageQuery)
    }
    catch (error) {
        return new Error(error)
    }
}

processLookup = async (mess,messageQuery) => {
   let messages = []
   let myid = ""
   for(data of mess){
        if ((data.id1.sender).toString() === (messageQuery.id)) {
            myid = 'id1.sender';
            localid = 'id2.receiver';
            lookup = data.id2.persona;
            id = data.id2.receiver;
        } else {
            myid = 'id2.receiver';
            localid = 'id1.sender';
            lookup = data.id1.persona;
            id = data.id1.sender;
        }
        let matchQuery = {}
        matchQuery[localid] = ObjectId(id)
        matchQuery[myid]    = ObjectId(messageQuery.id)
        let res = await query.findDocumentsByLookupAsync(Message.createModel(), lookup, matchQuery, localid, '_id', 'info');
        console.log(res)
        await  messages.push(res[0])
    }
    await console.log(messages)
    return await (messages)
}