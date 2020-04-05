var express = require('express');
var studentRepo = require('../Repository/studentRepo');
var router = express.Router();
var app = express();
var path = require('path');
var multer = require('multer');
var connection = require('../dbConnection');
var kafka = require('../kafka/client');
const fs = require('fs');
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
	    accessKeyId:
	        "AKIAIXZQ2BJZTGBO36DQ",
	    secretAccessKey:
	        "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"
    })
    var storage = multer.diskStorage({
        destination: (req, file, cb) => {
            if (file.mimetype === "application/pdf") {
                cb(null, './public/applications')
            } else {
                cb(null, './public/images')
            }
        },
        filename: (req, file, cb) => {
            if (file.mimetype === "application/pdf") {
                cb(null, req.body.jobId + req.body.studentId + path.extname(file.originalname))
            } else {
                cb(null,  req.body.studentId + path.extname(file.originalname))
            }
        }
    });
    const upload = multer({
        storage
    })

router.post('/signup',(req,res) => {
    // let body = req.body
    kafka.make_request('student_signin',req.body, (err,result) => {
        console.log('in result');
        console.log(result);
        if (err){
            console.log("Inside err");
            res.json({'error':err})
        }else if(result.error){
            res.json({'error':result.error})
        }else{
            console.log("Inside result");
                console.log(result)
                res.json(result);
            }
    });
//     if(body.signup == true){
//         studentRepo.signUp(body,(error,result)=>{
//             if(error){
//                 console.log(error)
//                 //res.json(error)
//                 res.json({'error':error})
//             }else{
//                 //res.json(result)
//                 res.json({'result':'Login Successful'})
//             }
//     })
//     }else{
//     studentRepo.signIn(body,(error,result)=>{
//         console.log(result)
//         console.log(result.studentId)
//         if(error){
//             console.log(error)
//             res.json({'error':error})
//         }else if(result.length == 0){
//             res.json({error:"invalid user credentials"})
//         }else{
//             res.cookie('studentcookie',"student",{maxAge: 900000, httpOnly: false, path : '/'});
//             res.json(result)
            
//         }
//     })
// }
})

router.post('/profile/',(req,res) => {

    req.body.path = 'studentProfileUpdate'
    kafka.make_request('student-profile',req.body, (err,result) => {
        console.log('in result');
        console.log(result);
        if (err){
            console.log("Inside err");
            res.json({'error':err})
        }else if(result.error){
            res.json({'error':result.error})
        }else{
            console.log("Inside result");
                console.log(result)
                res.json(result);
            }
    });
    
    // if (req.body.type == "name"){
    //     studentRepo.nameUpdate(body,(error,result) => {
    //         if(error)
    //             //res.json(error)
    //             res.send({'error':error})
    //         else
    //             res.send({'result':'updated successfully'})
    //         })
    // }else if(req.body.type == "careerobj"){
    //     console.log(req.body)
    //     studentRepo.careerObjUpdate(body,(error,result) => {
    //         if(error)
    //             //res.json(error)
    //             res.send({'error':error})
    //         else
    //             res.send({'result':'updated successfully'})
    //         })
    // }else if(req.body.type == "skillSet"){
    //     studentRepo.skillsetUpdate(body,(error,result) => {
    //         if(error)
    //             res.send({'error':error})
    //         else
    //             res.send({'result':'updated successfully'})
    //     })
    // }else if(req.body.type == "education"){
    //     studentRepo.educationUpdate(body,(error,result) => {
    //         if(error)
    //             //res.json(error)
    //             res.send({'error':error})
    //         else
    //             res.send({'result':'student Education Details updated'})
    //         })
    // }else if(req.body.type == "contact"){
    //     studentRepo.contactUpdate(body,(error,result) => {
    //         if(error)
    //             //res.json(error)
    //             res.send(error)
    //         else
    //             res.send('student Contact Details updated')
    //         })
    // }else if(req.body.type == "experience"){
    //     studentRepo.experienceUpdate(body,(error,result) => {
    //         if(error)
    //             //res.json(error)
    //             res.send({'error':error})
    //         else
    //             res.send({'result':'student Experience Details updated'})
    //         })
    // }else if(req.body.type == "skillset"){
    //     studentRepo.skillsetUpdate(body,(error,result) => {
    //         if(error)
    //             //res.json(error)
    //             res.send(error)
    //         else
    //             res.send('student Skillset Details updated')
    //         })
    // }
})

router.get('/profile/:studentId',(req,res)=>{
    req.body.studentId = req.params.studentId
    req.body.path = "getStudentDetails"
    kafka.make_request('student-jobs',req.body, (err,result) => {
        console.log('in result');
        console.log(result);
        if (err){
            console.log("Inside err");
            res.json({'error':err})
        }else if(result.error){
            res.json({'error':result.error})
        }else{
            console.log("Inside result");
                console.log(result)
                res.json(result);
            }
    });

    // studentRepo.getStudentDetails(req.params.studentId,(error,result) => {
    //     console.log(req.params.studentId)
    //         if(error){
    //             console.log(error)
    //             return res.json({'error':error})}
    //         else{
    //             console.log(result)
    //             res.json({'result':result})}
    //         })
})

// router.get('/profile/basic/:studentId',(req,res)=>{
//     studentRepo.getStudentBasic(req.params.studentId,(error,result) => {
//             if(error){
//                 console.log(error)
//                 res.json({'error':error})}
//             else{
//                 console.log(result)
//                 res.json({'result':result})}
//             })
// })

// router.get('/profile/education/:studentId',(req,res)=>{
//     studentRepo.getStudentEducation(req.params.studentId,(error,result) => {
//             if(error){
//                 console.log(error)
//                 res.json({'error':error})}
//             else{
//                 console.log(result)
//                 res.json({'result':result})}
//             })
// })

// router.get('/profile/experience/:studentId',(req,res)=>{
//     studentRepo.getStudentExperience(req.params.studentId,(error,result) => {
//             if(error){
//                 console.log(error)
//                 res.json({'error':error})}
//             else{
//                 console.log(result)
//                 res.json({'result':result})}
//             })
// })

router.get('/jobsearch/:studentId',(req,res)=>{
    req.body.studentId = req.params.studentId
    req.body.path = "getJobdetailsforstudent"
    kafka.make_request('student-jobs',req.body, (err,result) => {
        console.log('in result');
        console.log(result);
        if (err){
            console.log("Inside err");
            res.json({'error':err})
        }else if(result.error){
            res.json({'error':result.error})
        }else{
            console.log("Inside result");
                console.log(result)
                res.json(result);
            }
    });
    // studentRepo.getJobdetailsforstudent(req.params.studentId,(error,result)=>{
    //     if(error){
    //         res.json({'error':error})
    //     }else{
    //         console.log(result)
    //         res.json({'result':result})
    //     }   
    // })
})

router.post('/education',(req,res)=>{
    console.log("education")
    console.log(req.body)
    // studentRepo.getStudentEducation(req.body,(error,result)=>{
    //     if(error){
    //         res.json({'error':error})
    //     }else{
    //         console.log(result)
    //         res.json({'education':result})
    //     }   
    // })
    req.body.path = "getStudentEducation"
    kafka.make_request('student-jobs',req.body, (err,result) => {
        console.log('in result');
        console.log(result);
        if (err){
            console.log("Inside err");
            res.json({'error':err})
        }else if(result.error){
            res.json({'error':result.error})
        }else{
            console.log("Inside result");
                console.log(result)
                res.json(result);
            }
    });
})

router.get('/jobapplications/:studentId',(req,res)=>{
    console.log("response")
    req.body.studentId = req.params.studentId
    req.body.path = "getApplicationStudent"
    kafka.make_request('student-jobs',req.body, (err,result) => {
        console.log('in result');
        console.log(result);
        if (err){
            console.log("Inside err");
            res.json({'error':err})
        }else if(result.error){
            res.json({'error':result.error})
        }else{
            console.log("Inside result");
                console.log(result)
                res.json(result);
            }
    });
    // console.log("response")
    // studentRepo.getApplicationStudent(req.params.studentId,(error,result)=>{
    //     if(error){
    //         res.json({'error':error})
    //     }else{
    //         console.log(result)
    //         res.json({'result':result})
    //     }   
    // })
})

router.post('/applyjob', upload.single('file'), (req,res)=>{
    req.body.path = "applyJob"
    if (req.file) {
        const fileContent = fs.readFileSync('./public/applications/' + req.body.jobId + req.body.studentId + path.extname(req.file.originalname));

        
        const params = {
            Bucket: 'handshakesrinivas',
            Key: req.body.jobId + req.body.studentId + path.extname(req.file.originalname),
            Body: fileContent,
            ContentType: req.file.mimetype
        };

        s3.upload(params, function (err, data) {
            if (err) {
                return response.status(500).json({ "error": err.message })
            }
            console.log(data);
            let jobDetails = {
                ...req.body,
                resume: data.Location
            }
    console.log(req.body)
    kafka.make_request('student-jobs',jobDetails, (err,result) => {
        console.log('in result');
        console.log(result);
        if (err){
            console.log("Inside err");
            res.json({'error':err})
        }else if(result.error){
            res.json({'error':result.error})
        }else{
            console.log("Inside result");
                console.log(result)
                res.json(result);
            }
    });
    // studentRepo.applyJob(jobDetails,(error,result)=>{
    //     if(error){
    //         res.json({'error':error})
    //     }else{
    //         console.log(result)
    //         res.json({'result':result})
    //     }   
    // })
})}
});

router.get('/studentsearch/:studentId',(req,res)=>{
    console.log("response")
    studentRepo.getStudentSearch(req.params.studentId,(error,result)=>{
        if(error){
            res.json({'error':error})
        }else{
            console.log(result)
            res.json({'result':result})
        }   
    })
})

router.get('/events/:studentId',(req,res)=>{
    req.body.studentId = req.params.studentId
    req.body.path = "getEventsdetailsforstudent"
    kafka.make_request('student-events',req.body, (err,result) => {
        console.log('in result');
        console.log(result);
        if (err){
            console.log("Inside err");
            res.json({'error':err})
        }else if(result.error){
            res.json({'error':result.error})
        }else{
            console.log("Inside result");
                console.log(result)
                res.json(result);
            }
    });
    // console.log("response")
    // studentRepo.getEventsdetailsforstudent(req.params.studentId,(error,result)=>{
    //     if(error){
    //         res.json({'error':error})
    //     }else{
    //         console.log(result)
    //         res.json({'result':result})
    //     }   
    // })
})

router.get('/eventregistrations/:studentId',(req,res)=>{
    console.log("response")
    req.body.studentId = req.params.studentId
    req.body.path = "getRegistrationsStudent"
    kafka.make_request('student-events',req.body, (err,result) => {
        console.log('in result');
        console.log(result);
        if (err){
            console.log("Inside err");
            res.json({'error':err})
        }else if(result.error){
            res.json({'error':result.error})
        }else{
            console.log("Inside result");
                console.log(result)
                res.json(result);
            }
    });
    // studentRepo.getRegistrationsStudent(req.params.studentId,(error,result)=>{
    //     if(error){
    //         res.json({'error':error})
    //     }else{
    //         console.log(result)
    //         res.json({'result':result})
    //     }   
    // })
})

router.post('/uploadpic', upload.single('image'), async (req, response) => {
    try {
      if (req.file) {
        const fileContent = fs.readFileSync(`./public/images/${req.body.studentId}${path.extname(req.file.originalname)}`);
        console.log(fileContent)
        console.log(req.body)
        console.log(req.body.studentId);
        const params = {
            Bucket: 'handshakesrinivas',
            Key: req.body.studentId + path.extname(req.file.originalname),
            Body: fileContent,
            ContentType: req.file.mimetype
        };

        s3.upload(params, function (err, data) {
            if (err) {
                console.log(err.message)
                return response.status(500).json({ "error": err.message })
            }
            console.log(data);
            let profilepic = {
                ...req.body,
                image: data.Location
            }
            profilepic.path = 'studentprofilepic'
            console.log(profilepic)
            kafka.make_request('student-profile',profilepic, (err,result) => {
                console.log('in result');
                console.log(result);
                if (err){
                    console.log("Inside err");
                    response.json({'error':err})
                }else if(result.error){
                    response.json({'error':result.error})
                }else{
                    console.log("Inside result");
                        console.log(result)
                        response.json(result);
                    }
            });
        // const query = 'update mydb.student set profilepic=? where studentId=?';
        // console.log('upload pic')
        // const rows = await connection.query(query, [fileContent, request.body.studentId]);
  
        // return response.status(200).json({ "message": "success" });
    });
      }
    } catch (ex) {
      const message = ex.message ? ex.message : 'Error while uploading image';
      console.log(ex)
      const code = ex.statusCode ? ex.statusCode : 500;
      return response.status(code).json({ message });
    }
  });

  router.post('/registerEvent', (req,res)=>{
    console.log(req.body)
    req.body.path = 'eventRegister'
    kafka.make_request('student-events',req.body, (err,result) => {
        console.log('in result');
        console.log(result);
        if (err){
            console.log("Inside err");
            res.json({'error':err})
        }else if(result.error){
            res.json({'error':result.error})
        }else{
            console.log("Inside result");
                console.log(result)
                res.json(result);
            }
    });
    // studentRepo.eventRegister(req.body,(error,result)=>{
    //     if(error){
    //         res.json({'error':error})
    //     }else{
    //         console.log(result)
    //         res.json({'result':result})
    //     }   
    // })
});



module.exports = router;