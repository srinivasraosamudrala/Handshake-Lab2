const findDocumentsByQuery = async (modelObject, query, options, callback) => {
    try {
        modelObject.find(query, options,(err,result)=>{callback(err,result)}).lean();
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
const updateField = async (modelObject, id, update) => {
    try {
        return await modelObject.findOneAndUpdate({ id }, update, { useFindAndModify: false });
    } catch (error) {
        logger.error("Error while updating data:" + error)
        throw new Error(error);
    }
}
module.exports.findDocumentsByQuery = findDocumentsByQuery;
module.exports.saveDocuments = saveDocuments;
module.exports.updateField = updateField;