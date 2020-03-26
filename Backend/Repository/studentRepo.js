var express = require('express');
var app = express();
var connection = require('../dbConnection');
const studentDBQueries = require('../Database/studentDBQueries')
const query = require('../Database/mongooseQueries')
const Student = require('../Models/studentModel')

exports.signUp = (studentDetails,callback) => {
        try{
            query.saveDocuments(Student.createModel(),studentDetails,{runValidators:false},(err,result)=>{
                callback(err,result)
            });
        }
        catch(error){
            return callback(error,null)
        }
}

exports.signIn = (studentDetails,callback) => {
    try{
        query.findDocumentsByQuery(Student.createModel(),{email:studentDetails.email,password:studentDetails.password},{runValidators:false},(err,result)=>{
        callback(err,result)
        });
    }
    catch(error){
        return callback(error,null)
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

exports.getStudentDetails = (studentId,callback) => {
    let result = {}
    connection.query(studentDBQueries.StudentProfile,studentId,
        (err, education) => {
            if (!err){
                connection.query(studentDBQueries.StudentWorkProfile,studentId,
                    (err, work) => {
                        if (!err){
                            connection.query(studentDBQueries.studentBasicSelect,studentId,
                         (err, basic) => {
                             if(!err){
                            connection.query(studentDBQueries.studentInfoSelect,studentId,
                                (err, info) => {
                             if(!err){
                                connection.query(studentDBQueries.StudentSkillSet,studentId,
                                    (err,skillset) => {
                                        result.education = education
                                        result.work = work
                                        result.basic = basic
                                        result.skillset = skillset
                                        result.info = info
                                        callback(err,result)})
                                    }else{
                                        callback(err,result)}
                             })}
                            else{
                                callback(err,result)
                            }})
                        }else{
                        callback(err,result)
                        }})
            }else{
            callback(err,result)}
    });
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

exports.getApplicationStudent = (studentId,callback) => {
    connection.query(studentDBQueries.studentGetApplications,
        studentId,
        (err,result) => {
            callback(err,result)
        })
}




exports.getJobdetailsforstudent = (studentId,callback) => {
    connection.query(studentDBQueries.studentGetJobs,
        studentId,
        (err,result) => {
            callback(err,result)
        })
}

exports.applyJob = (jobdetails,callback) => {
    console.log(jobdetails)
    connection.query(studentDBQueries.studentApplyJobs,
        [jobdetails.studentId,jobdetails.companyId,jobdetails.jobId,"Pending",jobdetails.appliedDate,jobdetails.resume],
        (err,result) => {
            callback(err,result)
        })
}

exports.eventRegister = (eventdetails,callback) => {
    console.log(eventdetails)
    connection.query(studentDBQueries.studentApplyEvents,
        [eventdetails.studentId,eventdetails.companyId,eventdetails.eventId,"Registered"],
        (err,result) => {
            callback(err,result)
        })
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

exports.getEventsdetailsforstudent = (studentId,callback) => {
    connection.query(studentDBQueries.studentGetEvents,
        studentId,
        (err,result) => {
            connection.query(studentDBQueries.studentEducationSelect,
                studentId)
            callback(err,result)
        })
}

exports.getRegistrationsStudent = (studentId,callback) => {
    connection.query(studentDBQueries.studentGetRegistrations,
        studentId,
        (err,result) => {
            callback(err,result)
        })
}

