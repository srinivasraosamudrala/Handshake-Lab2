var express = require('express');
const Company = require('../Models/companyModel')
const Jobs = require('../Models/jobModel')
const Events = require('../Models/eventModel')
const query = require('../Queries/mongooseQueries')
var ObjectId = require('mongodb').ObjectID;

exports.handle_request = (data, callback) => {
    console.log(data)
    if(data.signup == true){
        console.log("company")
        // signUp(data,(error,res)=>{
        //     if(error){
        //         res = {'error':error}
        //         callback(res)
        //     }else{
        //         res = {'result':"signup successful"}
        //         callback(res)
        //     }
        try{
            query.saveDocuments(Company.createModel(),data,{runValidators:false},(err,result)=>{
                callback(err,result)
            });
        }
        catch(error){
            return callback(error,null)
        }
    }else if(data.signup == false){
    // signIn(data,(error,result)=>{
    //     if(error){
    //         callback({'error':error})
    //     }else if(result.length === 0){
    //         callback({'error':"invalid user credentials"})
    //     }else{
    //         callback({'companyId' : result[0]._id})
    //     }
    // })
    try{
        query.findDocumentsByQuery(Company.createModel(),{email:data.email,password:data.password},{_id:1},{runValidators:false},(err,result)=>{
            callback(err,result)
        });
    }
    catch(error){
        return callback(error,null)
    }
    }else if(data.path === 'jobslist'){
        getJoblist(data.company_id,(error,result)=>{
            if(error){
                callback({'error':error})
            }else{
                console.log(result)
                callback({result})
            }
        })
    }else if(data.path === 'eventslist'){
        getEventlist(data.company_id,(error,result)=>{
            if(error){
                callback({'error':error})
            }else{
                console.log(result)
                callback(result)
            }
        })
    }else if(data.path === 'postjob'){
        postJob(data,(error,result)=>{
            if(error){
                callback({'error':error})
            }else{
                callback(result)
            }
        })
    }else if(data.path === 'postevent'){
        postEvent(data,(error,result)=>{
            if(error){
                console.log(error)
                callback({'error':error})
            }else{
                console.log("result")
                callback(result)
            }
        })
    }else if (data.path === 'companyProfile'){
        getCompanyProfile(data.company_id,(error,result)=>{
            if(error){
                console.log(error)
                callback({'error':error})
            }else{
                console.log("result")
                callback(result)
            }
        })
    }else if (data.path === 'listApplicants'){
        listApplicants(data,(error,result)=>{
            if(error){
                console.log(error)
                callback({'error':error})
            }else{
                console.log("result")
                callback(result)
            }
        })
    }else if (data.path === 'listRegistrations'){
        listRegistrations(data,(error,result)=>{
            if(error){
                console.log(error)
                callback({'error':error})
            }else{
                console.log("result")
                callback(result)
            }
        })
    }else if (data.path === 'companyupdateProfile'){
        updateCompanyProfile(data,(error,result)=>{
            if(error){
                console.log(error)
                callback({'error':error})
            }else{
                console.log("result")
                callback(result)
            }
        })
    }else if (data.path === 'companyupdateProfilepic'){
        updateCompanyProfilePic(data,(error,result)=>{
            if(error){
                console.log(error)
                callback({'error':error})
            }else{
                console.log("result")
                callback(result)
            }
        })
    }else if (data.path === 'updateStudentstatus'){
        updateStudentstatus(data,(error,result)=>{
            if(error){
                console.log(error)
                callback({'error':error})
            }else{
                console.log("result")
                callback(result)
            }
        })
    }
}

signUp = (companyDetails,callback) => {
    console.log("company signup")

    try{
        query.saveDocuments(Company.createModel(),companyDetails,{runValidators:false},(err,result)=>{
            callback(err,result)
        });
    }
    catch(error){
        return callback(error,null)
    }
}

signIn = (companyDetails,callback) => {
    try{
        query.findDocumentsByQuery(Company.createModel(),{email:companyDetails.email,password:companyDetails.password},null,{runValidators:false},(err,result)=>{
            callback(err,result)
        });
    }
    catch(error){
        return callback(error,null)
    }
}

getJoblist = (company_id,callback) => {
    try{
        query.findDocumentsByQuery(Jobs.createModel(),{company_id:company_id},{},{runValidators:false},(err,result)=>{
            console.log(result)
            callback(err,result)
        });
    }
    catch(error){
        return callback(error,null)
    }
}
getEventlist = (company_id,callback) => {
    try{
        query.findDocumentsByQuery(Events.createModel(),{company_id:company_id},{},{runValidators:false},(err,result)=>{
            callback(err,result)
        });
    }
    catch(error){
        return callback(error,null)
    }
}

postJob = (companyDetails,callback) => {
    try{
        query.saveDocuments(Jobs.createModel(),companyDetails,{runValidators:false},(err,result)=>{
            callback(err,result)
        });
    }
    catch(error){
        return callback(error,null)
    }


}

postEvent = (eventDetails,callback) => {
    try{
        query.saveDocuments(Events.createModel(),eventDetails,{runValidators:false},(err,result)=>{
            callback(err,result)
        });
    }
    catch(error){
        return callback(error,null)
    }
}

listApplicants = (data,callback)=>{
    try{
        query.findDocumentsByLookup(Jobs.createModel(),'students', {_id:ObjectId(data.job_id)},'applications.student_id','_id','studentDetails',(err,result)=>{
            console.log(result)
            callback(err,result)
            });
    }
    catch(err)
    {
        callback(err,null)
    }
};

listRegistrations = (data,callback)=>{
    try{
        query.findDocumentsByLookup(Events.createModel(),'students',{_id:ObjectId(data.event_id)},'registrations.student_id','_id','studentDetails',(err,result)=>{
            console.log(result)
            callback(err,result)
            });
    }
    catch(err)
    {
        callback(err,null)
    }
};



updateStudentstatus = (data,callback)=>{
    console.log(data)
    try{
        let match = null
            match = {_id:ObjectId(data.jobId),
                    'applications._id':ObjectId(data.applicationId)}

        query.updateField(Jobs.createModel(),match,data.update,(err,result)=>{
            console.log("post insert")
            console.log(result)
            callback(err,result)
        });
        // connection.query(companyDBQueries.updateStudentstatus,
        //                 [data.status,data.companyId,data.jobId,data.studentId],
        //                 (err,rows) => {
        //     callback(err,rows)
        // });
    }
    catch(err)
    {
       callback(err,null)
    }
};

getCompanyProfile = (company_id,callback) => {
    try{
        console.log("profile")
        query.findDocumentsByQuery(Company.createModel(),{_id:company_id},{},{runValidators:false},(err,result)=>{
            callback(err,result)
        });
    }
    catch(err)
    {
        callback(err,null)
    }
}

updateCompanyProfile = (companyDetails,callback) => {
    try{
        let update = {
            name: companyDetails.name,
            email: companyDetails.email,
            location: companyDetails.location,
            phone: companyDetails.phone,
            company_description: companyDetails.company_description
        }
        console.log(update)
        query.updateField(Company.createModel(),{_id:ObjectId(companyDetails.company_id)},update,(err,result)=>{
            callback(err,result)
        });
    }
    catch(err)
    {
        callback(err,null)
    }
}

updateCompanyProfilePic = (companyDetails,callback) => {
    // try{
    //     image = new companyModel()
    //     query.updateField(Company.createModel(),companyDetails.company_id,{image:companyDetails.image},(err,result)=>{
    //         callback(err,result)
    //     });
    // }
    // catch(err)
    // {
    //     callback(err,null)
    // }

    try{
        // let update = {
        //     image: companyDetails.update.image
        // }
        console.log(companyDetails)
        console.log(companyDetails.update)

        query.updateField(Company.createModel(),{_id:ObjectId(companyDetails.company_id)},companyDetails.update,(err,result)=>{
            callback(err,result)
        });
    }
    catch(err)
    {
        callback(err,null)
    }
}

