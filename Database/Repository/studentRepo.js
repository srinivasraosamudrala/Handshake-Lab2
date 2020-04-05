var express = require('express');
var app = express();
var connection = require('../dbConnection');
// const studentDBQueries = require('../Database/studentDBQueries')
const query = require('../Queries/mongooseQueries')
const Student = require('../Models/studentModel')
const Jobs = require('../Models/jobModel')
const Events  = require('../Models/eventModel')
var ObjectId = require('mongodb').ObjectID;

exports.handle_request = (data, callback) => {
    console.log(data)
    if(data.signup == true){
        signUp(data,(error,res)=>{
            if(error){
                res = {'error':error}
                callback(res)
            }else{
                res = {'result':"signup successful"}
                callback(res)
            }
        })
    }else if(data.signup == false){
        signIn(data,(error,result)=>{
            if(error){
                callback({'error':error})
            }else if(result.length === 0){
                callback({'error':"invalid user credentials"})
            }else{
                callback(result[0])
            }
        })
    }else if(data.path == 'getJobdetailsforstudent'){
        getJobdetailsforstudent(data,(error,result)=>{
            if(error){
                callback(error)
            }else{
                callback(result)
            }
        })
    }else if(data.path == 'getEventsdetailsforstudent'){
        getEventsdetailsforstudent(data,(error,result)=>{
            if(error){
                callback(error)
            }else{
                callback(result)
            }
        })
    }else if(data.path == 'eventRegister'){
        eventRegister(data,(error,result)=>{
            callback(error,result)
        })
    }else if(data.path == 'getRegistrationsStudent'){
        getRegistrationsStudent(data,(error,result)=>{
            callback(error,result)
        })
    }else if(data.path == 'applyJob'){
        applyJob(data,(error,result)=>{
            callback(error,result)
        })
    }else if(data.path == 'getApplicationStudent'){
        getApplicationStudent(data,(error,result)=>{
            callback(error,result)
        })
    }else if(data.path == 'getStudentDetails'){
        getStudentDetails(data,(error,result)=>{
            callback(error,result)
        })
    }else if(data.path == 'studentprofilepic'){
        console.log("in path call")
        updateStudentProfilePic(data,(error,result)=>{
            callback(error,result)
        })
    }else if(data.path == 'studentProfileUpdate'){
        console.log("in path call")
        updateStudentProfile(data,(error,result)=>{
            callback(error,result)
        })
    }
}

signUp = (studentDetails,callback) => {
    console.log("student signup")

        try{
            query.saveDocuments(Student.createModel(),studentDetails,{runValidators:false},(err,result)=>{
                callback(err,result)
            });
        }
        catch(error){
            return callback(error,null)
        }
}

signIn = (studentDetails,callback) => {
    try{
        query.findDocumentsByQuery(Student.createModel(),{email:studentDetails.email,password:studentDetails.password},{_id:1,first_name:1,last_name:1,email:1,college:1},{runValidators:false},(err,result)=>{
        console.log(result)
        callback(err,result)
        });
    }
    catch(error){
        return callback(error,null)
    }
}

getJobdetailsforstudent = (studentId,callback) => {
    // connection.query(studentDBQueries.studentGetJobs,
    //     studentId,
    //     (err,result) => {
    //         callback(err,result)
    //     })
    try{
        query.findDocumentsByLookup(Jobs.createModel(),'companies',{},'company_id','_id','Company',(err,result)=>{
            console.log(result)
            callback(err,result)
            });
    }
    catch(err)
    {
        callback(err,null)
    }
}

getEventsdetailsforstudent = (studentId,callback) => {
    // connection.query(studentDBQueries.studentGetEvents,
    //     studentId,
    //     (err,result) => {
    //         connection.query(studentDBQueries.studentEducationSelect,
    //             studentId)
    //         callback(err,result)
    //     })
    try{
        query.findDocumentsByLookup(Events.createModel(),'companies',{},'company_id','_id','Company',(err,result)=>{
            console.log(result)
            callback(err,result)
            });
    }
    catch(err)
    {
        callback(err,null)
    }
}

eventRegister = (eventdetails,callback) => {
    console.log(eventdetails)
    // connection.query(studentDBQueries.studentApplyEvents,
    //     [eventdetails.studentId,eventdetails.companyId,eventdetails.eventId,"Registered"],
    //     (err,result) => {
    //         callback(err,result)
    //     })
    try{
        let update = {$push: {
            registrations:[
                    {
                        student_id: eventdetails.studentId
                    }
            ]
        }}

        let updateStudent = {$push: {
            registrations:[
                    {
                        event_id: eventdetails.eventId
                    }
            ]
        }}
        query.updateField(Student.createModel(),{_id:ObjectId(eventdetails.studentId)},updateStudent,(err,result)=>{
            console.log(result)
            if(result){
                query.updateField(Events.createModel(),{_id:ObjectId(eventdetails.eventId)},update,(err,result)=>{
                    console.log(result)
                    callback(err,result)
                    });
            }
            callback(err,result)
            });
    }
    catch(err)
    {
        callback(err,null)
    }
}

exports.nameUpdate = (studentDetails,callback) => {
    connection.query(studentDBQueries.studentNameUpdate,
                    [studentDetails.firstname,
                    studentDetails.lastname,
                    studentDetails.studentId],
                    (error,result) => {
                        callback(error,result)
                    })
                  }

exports.careerObjUpdate = (studentDetails,callback) => {
                    console.log("repo")
                    connection.query(studentDBQueries.studentBasicSelectall,
                                    [studentDetails.studentId],
                                    (error,result) => {
                                        console.log(result)
                                        if (result.length !== 0)
                                        {
                                            console.log("update")
                                            console.log(studentDetails.careerobj)
                                            connection.query(studentDBQueries.studentCareerObjUpdate,
                                                            [studentDetails.careerobj,studentDetails.studentId],
                                                            (error,result)=>{
                                                                console.log(result)
                                                                callback(error,result)
                                                            })
                                        }else{
                                            console.log("insert")
                                            connection.query(studentDBQueries.studentBasicInsert,
                                                [studentDetails.studentId,null,null,null,null,null,studentDetails.careerobj,studentDetails.studentId],
                                                (error,result)=>{
                                                    callback(error,result)
                                                })
                                        }
                                    })
                }

exports.basicUpdate = (studentDetails,callback) => {
    connection.query(studentDBQueries.studentBasicSelect,
                    [studentDetails.studentId],
                    (error,result) => {
                        if (result.length != 0)
                        {
                            connection.query(studentDBQueries.studentBasicUpdate,
                                            [studentDetails.name,studentDetails.dob,studentDetails.city,studentDetails.state,studentDetails.country,studentDetails.career_obj,studentDetails.studentId],
                                            (error,result)=>{
                                                callback(error,result)
                                            })
                        }else{
                            connection.query(studentDBQueries.studentBasicInsert,
                                [studentDetails.studentId,studentDetails.name,studentDetails.dob,studentDetails.city,studentDetails.state,studentDetails.country,studentDetails.career_obj,studentDetails.studentId],
                                (error,result)=>{
                                    callback(error,result)
                                })
                        }
                    })
}

exports.educationUpdate = (studentDetails,callback) => {
    connection.query(studentDBQueries.studentEducationSelect,
                    [studentDetails.studentId],
                    (error,result) => {
                        if (result.length != 0)
                        {
                            connection.query(studentDBQueries.studentEducationUpdate,
                                            [studentDetails.college,studentDetails.location,studentDetails.degree,studentDetails.major,studentDetails.year,studentDetails.cgpa,studentDetails.studentId],
                                            (error,result)=>{
                                                callback(error,result)
                                            })
                        }else{
                            connection.query(studentDBQueries.studentEducationInsert,
                                [studentDetails.studentId,studentDetails.college,studentDetails.location,studentDetails.degree,studentDetails.major,studentDetails.year,studentDetails.cgpa,studentDetails.studentId],
                                (error,result)=>{
                                    callback(error,result)
                                })
                        }
                    })
}

exports.contactUpdate = (studentDetails,callback) => {
    connection.query(studentDBQueries.studentContactSelect,
                    [studentDetails.studentId],
                    (error,result) => {
                        if (result.length != 0)
                        {
                            connection.query(studentDBQueries.studentContactUpdate,
                                            [studentDetails.phone,studentDetails.mail,studentDetails.studentId],
                                            (error,result)=>{
                                                callback(error,result)
                                            })
                        }else{
                            connection.query(studentDBQueries.studentContactInsert,
                                            [studentDetails.studentId,studentDetails.phone,studentDetails.mail,studentDetails.studentId],
                                            (error,result)=>{
                                                callback(error,result)
                                            })
                        }
                    })
}

exports.experienceUpdate = (studentDetails,callback) => {
    connection.query(studentDBQueries.studentExperienceSelect,
                    [studentDetails.studentId],
                    (error,result) => {
                        if (result.length != 0)
                        {
                            connection.query(studentDBQueries.studentExperienceUpdate,
                                            [studentDetails.companyName,studentDetails.title,studentDetails.location,studentDetails.startDate,studentDetails.endDate,studentDetails.workDesc,studentDetails.studentId],
                                            (error,result)=>{
                                                callback(error,result)
                                            })
                        }else{
                            connection.query(studentDBQueries.studentExperienceInsert,
                                [studentDetails.studentId,studentDetails.companyName,studentDetails.title,studentDetails.location,studentDetails.startDate,studentDetails.endDate,studentDetails.workDesc,studentDetails.studentId],
                                (error,result)=>{
                                    callback(error,result)
                                })
                        }
                    })
}

exports.skillsetUpdate = (studentDetails,callback) => {
    connection.query(studentDBQueries.studentSkillsetSelect,
                    [studentDetails.studentId],
                    (error,result) => {
                        if (result.length != 0)
                        {
                            connection.query(studentDBQueries.studentSkillsetUpdate,
                                            [studentDetails.skillSet,studentDetails.studentId],
                                            (error,result)=>{
                                                callback(error,result)
                                            })
                        }else{
                            connection.query(studentDBQueries.studentSkillsetInsert,
                                [studentDetails.studentId,studentDetails.skillset,studentDetails.studentId],
                                (error,result)=>{
                                    callback(error,result)
                                })
                        }
                    })
}

getStudentDetails = (studentDetails,callback) => {
    try{
        query.findDocumentsByQuery(Student.createModel(),{_id:studentDetails.studentId},{applications:0,registrations:0},{runValidators:false},(err,result)=>{
        console.log(result)
        callback(err,result)
        });
    }
    catch(error){
        return callback(error,null)
    }
    // let result = {}
    // connection.query(studentDBQueries.StudentProfile,studentId,
    //     (err, education) => {
    //         if (!err){
    //             connection.query(studentDBQueries.StudentWorkProfile,studentId,
    //                 (err, work) => {
    //                     if (!err){
    //                         connection.query(studentDBQueries.studentBasicSelect,studentId,
    //                      (err, basic) => {
    //                          if(!err){
    //                         connection.query(studentDBQueries.studentInfoSelect,studentId,
    //                             (err, info) => {
    //                          if(!err){
    //                             connection.query(studentDBQueries.StudentSkillSet,studentId,
    //                                 (err,skillset) => {
    //                                     result.education = education
    //                                     result.work = work
    //                                     result.basic = basic
    //                                     result.skillset = skillset
    //                                     result.info = info
    //                                     callback(err,result)})
    //                                 }else{
    //                                     callback(err,result)}
    //                          })}
    //                         else{
    //                             callback(err,result)
    //                         }})
    //                     }else{
    //                     callback(err,result)
    //                     }})
    //         }else{
    //         callback(err,result)}
    // });
}

exports.getStudentBasic = (studentId,callback) => {
    console.log(studentId)
    connection.query(studentDBQueries.studentBasicSelect,
        studentId,
        (err, result) => {
            callback(err,result)
    });
}

exports.getStudentEducation = (student,callback) => {
    console.log(student.studentId)
    connection.query(studentDBQueries.studentEducationSelect,
        student.studentId,
        (err, result) => {
            callback(err,result)
    });
}

exports.getStudentExperience = (studentId,callback) => {
    connection.query(studentDBQueries.studentExperienceSelect,
        studentId,
        (err, result) => {
            callback(err,result)
    });
}

exports.getStudentContact = (studentId,callback) => {
    connection.query(studentDBQueries.studentContactSelect,
        studentId,
        (err, result) => {
            callback(err,result)
    });
}

exports.getStudentSkillset = (studentId,callback) => {
    connection.query(studentDBQueries.studentSkillsetSelect,
        studentId,
        (err, result) => {
            callback(err,result)
    });
}

getApplicationStudent = (studentDetails,callback) => {
    try{
        query.findDocumentsByLookup(Jobs.createModel(),'companies',{'applications.student_id':ObjectId(studentDetails.studentId)},'company_id','_id','Company',(err,result)=>{
            console.log(result)
            callback(err,result)
            });
    }
    catch(err)
    {
        callback(err,null)
    }
    // connection.query(studentDBQueries.studentGetApplications,
    //     studentId,
    //     (err,result) => {
    //         callback(err,result)
    //     })
}

applyJob = (jobdetails,callback) => {
    console.log(jobdetails)
    // connection.query(studentDBQueries.studentApplyJobs,
    //     [jobdetails.studentId,jobdetails.companyId,jobdetails.jobId,"Pending",jobdetails.appliedDate,jobdetails.resume],
    //     (err,result) => {
    //         callback(err,result)
    //     })
    try{
        let update = {$push: {
            applications:[
                    {
                        student_id: jobdetails.studentId,
                        status: 'Pending',
                        applied_date:jobdetails.appliedDate,
                        resume:jobdetails.resume
                    }
            ]
        }}

        let updateStudent = {$push: {
            applications:[
                    {
                        job_id: jobdetails.jobId
                    }
            ]
        }}
        query.updateField(Student.createModel(),{_id:ObjectId(jobdetails.studentId)},updateStudent,(err,result)=>{
            console.log(result)
            if(result){
                query.updateField(Jobs.createModel(),{_id:ObjectId(jobdetails.jobId)},update,(err,result)=>{
                    console.log(result)
                    callback(err,result)
                    });
            }
            callback(err,result)
            });
    }
    catch(err)
    {
        callback(err,null)
    }
}





// exports.getStudentSearch = (studentId,callback) => {
//     connection.query(studentDBQueries.studentSearch,
//         studentId,
//         (err,result) => {
//             callback(err,result)
//         })
// }

exports.getStudentSearch = (studentId,callback) => {
    let result = []

    connection.query(studentDBQueries.getStudentId,studentId,
        (err, student) => {
            if (!err){
                student.forEach(stu => {
                    console.log(stu.studentId)
                connection.query(studentDBQueries.StudentProfile,stu.studentId,
                    (err, education) => {
                        if (!err){
                            connection.query(studentDBQueries.StudentWorkProfile,stu.studentId,
                                (err, work) => {
                                         if(!err){
                                                    result.push({'studentId':stu.studentId,
                                                                        'firstName':education[0].firstName,
                                                                        'lastName':education[0].lastName,
                                                                        'college':education[0].college,
                                                                        'major':education[0].major,
                                                                        'degree':education[0].degree,
                                                                        'jobtitle':work[0].Title,
                                                                    'companyName':work[0].companyName,
                                                                    'profilepic':stu.profilepic,
                                                                    'skillset':education[0].skillSet
                                                                })
                                                    console.log(result)
                                                }
                                    else{
                                    callback(err,result)
                                    }})
                        }else{
                        callback(err,result)}
                });
            })
            setTimeout(()=>callback(err,result),150)
    }else{
        callback(err,result)}
    })
}



getRegistrationsStudent = (studentDetails   ,callback) => {
    // connection.query(studentDBQueries.studentGetRegistrations,
    //     studentId,
    //     (err,result) => {
    //         callback(err,result)
    //     })
    try{
        query.findDocumentsByLookup(Events.createModel(),'companies',{'registrations.student_id':ObjectId(studentDetails.studentId)},'company_id','_id','Company',(err,result)=>{
            console.log(result)
            callback(err,result)
            });
    }
    catch(err)
    {
        callback(err,null)
    }
}
updateStudentProfilePic = (studentDetails,callback) => {
    updateStudent = {
        image:studentDetails.image
    }

    try{
        query.updateField(Student.createModel(),{_id:ObjectId(studentDetails.studentId)},updateStudent,(err,result)=>{
            console.log("post insert")
            console.log(result)
            callback(err,result)
        });
    }
    catch(err)
    {
        callback(err,null)
    }
}

updateStudentProfile = (studentDetails,callback) => {
    try{
        let match = null
        if(!studentDetails.educationId){
            match = {_id:ObjectId(studentDetails.studentId)}
        }else{
            match = {_id:ObjectId(studentDetails.studentId),
                    'education._id':ObjectId(studentDetails.educationId)}
        }
        query.updateField(Student.createModel(),match,studentDetails.update,(err,result)=>{
            console.log("post insert")
            console.log(result)
            callback(err,result)
        });
    }
    catch(err)
    {
        callback(err,null)
    }
}

