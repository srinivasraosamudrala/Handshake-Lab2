const findDocumentsByQuery = (modelObject, query, projection, options, callback) => {
    try {
        modelObject.find(query, projection, options,(err,result)=>{
        callback(err,result)
        }).lean();
    } catch (error) {
        callback(err,null)
    }
}
const saveDocuments = (modelObject, result,options,callback) => {
    try {
        let model = new modelObject(result,options);
        console.log(model)
        model.save(options,(err, result)=>{
            if (result){
                console.log(result)
                callback(err,result)
            }
            else if (err){
                console.log(err)
                callback(err,null)
            }
        });
    } catch (error) {
        console.log(`Error while saving data: ${error}`)
        callback(err,null)
    }
}
const updateField = (modelObject, id, update, callback) => {
    console.log("update")
    try {
        modelObject.findOneAndUpdate(id, update, { useFindAndModify: false, new:true},(err,result)=>{
            if (result){
                console.log(result)
                callback(err,result)
            }
            else if (err){
                console.log(err)
                callback(err,null)
            }
        });
    } catch (error) {
        console.log("Error while updating data:" + error)
        callback(err,null)
    }
}
const findDocumentsByLookupAsync = async (modelObject,lookupObject, query, local, foreign, aggName) => {
    try { const agg = [
            { $match: query },
            {
                $lookup:
                {
                    from: lookupObject,
                    localField: local,
                    foreignField: foreign,
                    as: aggName
                },
            },
        ];
        return await modelObject.aggregate(agg).exec();
    } catch (error) {
        console.log("Error while saving data:" + error)
        throw new Error(error);
    }
}
const findDocumentsByLookup = (modelObject,lookupObject, query, local, foreign, aggName, callback) => {
    try {
    

        const agg = [
            { $match: query },
            {
                $lookup:
                {
                    from: lookupObject,
                    localField: local,
                    foreignField: foreign,
                    as: aggName
                },
            },
        ];
        modelObject.aggregate(agg).exec((err, data) => {
            if (data) {
                console.log(data)
                callback(err, data)
            }
            else if (err) {
                callback(err, data)
            }
        });
    } catch (error) {
        console.log("Error while saving data:" + error)
        callback(err, null)
    }
}

const findDocumentsByQueryAsync = async (modelObject, query, projection, options) => {
    try {
        return await modelObject.find(query, projection, options).lean();
    } catch (error) {
        throw new Error(error);
    }
}

module.exports.findDocumentsByQuery = findDocumentsByQuery;
module.exports.saveDocuments = saveDocuments;
module.exports.updateField = updateField;
module.exports.findDocumentsByLookup = findDocumentsByLookup;
module.exports.findDocumentsByLookupAsync = findDocumentsByLookupAsync;
module.exports.findDocumentsByQueryAsync = findDocumentsByQueryAsync;