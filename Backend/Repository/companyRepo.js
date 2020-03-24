var express = require('express');
const companyDBQueries = require('../Database/companyDBQueries');
const Company = require('../Models/companyModel')
const Jobs = require('../Models/jobModel')
const Events = require('../Models/eventModel')
const query = require('../Database/mongooseQueries')

exports.signUp = (companyDetails,callback) => {
    try{
        query.saveDocuments(Company.createModel(),companyDetails,{runValidators:false},(err,result)=>{
            callback(err,result)
        });
    }
    catch(error){
        return callback(error,null)
    }
}

exports.signIn = (companyDetails,callback) => {
    try{
        query.findDocumentsByQuery(Company.createModel(),{email:companyDetails.email,password:companyDetails.password},{runValidators:false},(err,result)=>{
            callback(err,result)
        });
    }
    catch(error){
        return callback(error,null)
    }
}

exports.getJoblist = (companyId,callback) => {
    // connection.query(companyDBQueries.getJobList,
    //                     [companyId],
    //                     (error,result)=>{
    //                         console.log(result)
    //                         callback(error,result)
    //                     })
    try{
        query.findDocumentsByQuery(Jobs.createModel(),{email:companyDetails.email,password:companyDetails.password},{runValidators:false},(err,result)=>{
            callback(err,result)
        });
    }
    catch(error){
        return callback(error,null)
    }
}
exports.getEventlist = (companyId,callback) => {
    connection.query(companyDBQueries.getEventList,
                        [companyId],
                        (error,result)=>{
                            console.log(result)
                            callback(error,result)
                        })
}

exports.postJob = (companyDetails,callback) => {

    // connection.query(companyDBQueries.postjob,
    //                     [companyDetails.companyId,companyDetails.title,companyDetails.postingDate,companyDetails.deadline,companyDetails.location,companyDetails.salary,companyDetails.jobdescription,companyDetails.category],
    //                     (error,result) => {
    //                         callback(error,result)
    //                     })

    try{
        query.saveDocuments(Jobs.createModel(),companyDetails,{runValidators:false},(err,result)=>{
            callback(err,result)
        });
    }
    catch(error){
        return callback(error,null)
    }


}

exports.postEvent = (companyDetails,callback) => {
    console.log(companyDetails)
    connection.query(companyDBQueries.postevent,
                        [companyDetails.companyId,companyDetails.eventname,companyDetails.description,companyDetails.time,companyDetails.date,companyDetails.location,companyDetails.eligibility],
                        (error,result) => {
                            callback(error,result)
                        })
}

exports.listApplicants = (data,callback)=>{
    console.log(data)
    try{
        connection.query(companyDBQueries.listApplicants,[data.id,data.job_id], (err,rows) => {
            callback(err,rows)
        });
    }
    catch(e)
    {
       callback(e,null)
    }
};

exports.listRegistrations = (data,callback)=>{
    console.log(data)
    try{
        connection.query(companyDBQueries.listRegistrations,[data.id,data.event_id], (err,rows) => {
            callback(err,rows)
        });
    }
    catch(e)
    {
       callback(e,null)
    }
};



exports.updateStudentstatus = (data,callback)=>{
    console.log(data)
    try{
        connection.query(companyDBQueries.updateStudentstatus,
                        [data.status,data.companyId,data.jobId,data.studentId],
                        (err,rows) => {
            callback(err,rows)
        });
    }
    catch(err)
    {
       callback(err,null)
    }
};

exports.getCompanyProfile = (companyId,callback) => {
    try{
        connection.query(companyDBQueries.getCompanyProfile,
            [companyId],
            (err,result) => {
                callback(err,result)
            });
    }
    catch(e)
    {
        callback()
    }
}

exports.updateCompanyProfile = (companyDetails,callback) => {
    try{
        connection.query(companyDBQueries.updateCompanyProfile,
            [companyDetails.companyname,companyDetails.location,companyDetails.email,companyDetails.phone,companyDetails.companyId],
            (err,result) => {
                callback(err,result)
            });
    }
    catch(e)
    {
        callback()
    }
}

