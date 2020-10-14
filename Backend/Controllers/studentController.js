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
const { checkAuth,studauth } = require("../utils/passport");
const jwt = require('jsonwebtoken');
var { secret } = require("../utils/config");

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
        if (req.body.signup === false){
            studauth();
        }
        console.log('in result');
        console.log(result);
        if (err){
            console.log("Inside err");
            res.json({'error':err})
        }else if(result.error){
            res.json({'error':result.error})
        }else{
            // console.log("Inside result");
            //     console.log(result)
            //     res.json(result);
            const payload = { _id: result._id, username: req.body.email};
            console.log(result._id)
            console.log(req.body.email)
            const token = jwt.sign(payload, secret, {
                expiresIn: 1008000
            });
                console.log("token is")
                console.log(token)
                res.json({"result":"JWT " +token})
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

router.post('/profile/',checkAuth,(req,res) => {

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
    
})

router.get('/profile/:studentId',checkAuth,(req,res)=>{
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

router.get('/jobsearch/:studentId',checkAuth,(req,res)=>{
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

router.post('/education',checkAuth,(req,res)=>{
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

router.get('/jobapplications/:studentId',checkAuth,(req,res)=>{
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

router.post('/applyjob',checkAuth, upload.single('file'), (req,res)=>{
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

router.get('/studentsearch/:studentId',checkAuth,(req,res)=>{

    req.body.studentId = req.params.studentId
    req.body.path = "studentsearch"

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
})

router.get('/events/:studentId',checkAuth,(req,res)=>{
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

router.get('/eventregistrations/:studentId',checkAuth,(req,res)=>{
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

router.post('/uploadpic',checkAuth, upload.single('image'), async (req, response) => {
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

  router.post('/registerEvent',checkAuth, (req,res)=>{
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