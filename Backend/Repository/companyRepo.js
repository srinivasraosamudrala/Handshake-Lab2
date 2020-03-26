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

exports.getJoblist = (company_id,callback) => {
    try{
        query.findDocumentsByQuery(Jobs.createModel(),{company_id:company_id},{runValidators:false},(err,result)=>{
            callback(err,result)
        });
    }
    catch(error){
        return callback(error,null)
    }
}
exports.getEventlist = (company_id,callback) => {
    try{
        query.findDocumentsByQuery(Events.createModel(),{company_id:company_id},{runValidators:false},(err,result)=>{
            callback(err,result)
        });
    }
    catch(error){
        return callback(error,null)
    }
}

exports.postJob = (companyDetails,callback) => {
    try{
        query.saveDocuments(Jobs.createModel(),companyDetails,{runValidators:false},(err,result)=>{
            callback(err,result)
        });
    }
    catch(error){
        return callback(error,null)
    }


}

exports.postEvent = (eventDetails,callback) => {
    try{
        query.saveDocuments(Events.createModel(),eventDetails,{runValidators:false},(err,result)=>{
            callback(err,result)
        });
    }
    catch(error){
        return callback(error,null)
    }
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

exports.getCompanyProfile = (company_id,callback) => {
    try{
        query.findDocumentsByQuery(Company.createModel(),{_id:company_id},{runValidators:false},(err,result)=>{
            callback(err,result)
        });
    }
    catch(err)
    {
        callback(err,null)
    }
}

exports.updateCompanyProfile = (companyDetails,callback) => {
    try{
        let update = {
            name: companyDetails.name,
            email: companyDetails.email,
            location: companyDetails.location,
            phone: companyDetails.phone,
            company_description: companyDetails.company_description
        }
        console.log(update)
        query.updateField(Company.createModel(),companyDetails.company_id,update,(err,result)=>{
            callback(err,result)
        });
    }
    catch(err)
    {
        callback(err,null)
    }
}

exports.updateCompanyProfilePic = (companyDetails,callback) => {
    try{
        image = new companyModel()
        query.updateField(Company.createModel(),companyDetails.company_id,{image:companyDetails.image},(err,result)=>{
            callback(err,result)
        });
    }
    catch(err)
    {
        callback(err,null)
    }
}

