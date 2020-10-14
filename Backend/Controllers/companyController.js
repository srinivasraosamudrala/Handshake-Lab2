var express = require('express');
var companyRepo = require('../Repository/companyRepo');
var router = express.Router();
var app = express();
var path = require('path');
var multer = require('multer');
var connection = require('../dbConnection');
var kafka = require('../kafka/client');
const fs = require('fs');
const Company = require('../Models/companyModel');
const query = require('../Database/mongooseQueries')
const AWS = require('aws-sdk');
const { checkAuth, auth } = require("../utils/passport");
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
            cb(null, req.body.companyId + path.extname(file.originalname))
        }
    }
});
const upload = multer({
    storage
})

router.post('/signup', (req, res) => {
    //     let body = req.body
    //     if(body.signup == true){
    //         companyRepo.signUp(body,(error,result)=>{
    //             if(error){
    //                 console.log(error)
    //                 res.json({'error':error})
    //             }else{
    //                 console.log("successs")
    //                 res.json({'result':"signup successful"})
    //             }
    //     })
    //     }else{
    //     companyRepo.signIn(body,(error,result)=>{
    //         console.log(result)
    //         console.log(result.companyId)
    //         if(error){
    //             res.json({'error':error})
    //         }else if(result.length === 0){
    //             res.json({'error':"invalid user credentials"})
    //         }else{
    //             res.cookie('companycookie',"company",{maxAge: 900000, httpOnly: false, path : '/'});
    //             res.json({'companyId' : result[0]._id})
    //         }
    //     })
    // }
    kafka.make_request('login-signup', req.body, (err, result) => {
        console.log('in result');
        console.log(result);

        if (req.body.signup === false) {
            auth();
        }

        if (err) {
            console.log("Inside err");
            res.json({ 'error': err })
        } else if (result.errors) {
            res.json({ 'error': result.errors })
        } else {
            console.log("Inside result");
            console.log(result)
            if (result.length === 0) {
                console.log("error")
                res.json({ "error": "invalid credentials" })
            } else {
                const payload = { _id: result[0]._id, username: req.body.email };
                console.log(result[0]._id)
                console.log(req.body.email)
                const token = jwt.sign(payload, secret, {
                    expiresIn: 1008000
                });
                console.log("token is")
                console.log(token)
                res.json({ "result": "JWT " + token })
                // res.json(result[0]);
            }
        }
    });
})

router.get('/list-of-jobs-and-events/:company_id/:type', checkAuth, (req, res) => {
    if (req.params.type == 'jobs') {
        // companyRepo.getJoblist(req.params.company_id,(error,result) =>{
        //     if(error)
        //         res.send({'error':error})
        //     else{
        //         res.send({result})}
        // })
        let body = {
            'company_id': req.params.company_id,
            'path': 'jobslist'
        }
        kafka.make_request('company-jobs', body, (err, result) => {
            if (err)
                res.send({ 'error': err })
            else {
                res.send(result)
            }
        })
    } else if (req.params.type == 'events') {
        //     companyRepo.getEventlist(req.params.company_id,(error,result) =>{
        //         if(error)
        //             res.send({'error':error})
        //         else{
        //             console.log(result)
        //             res.send({result})}
        // })
        let body = {
            'company_id': req.params.company_id,
            'path': 'eventslist'
        }
        kafka.make_request('company-events', body, (err, result) => {
            if (err)
                res.send({ 'error': err })
            else {
                console.log(result)
                res.send(result)
            }
        })
    }
})
router.post('/postjob', checkAuth, (req, res) => {
    req.body.path = 'postjob'
    kafka.make_request('company-jobs', req.body, (err, result) => {
        if (err)
            res.send({ 'error': err })
        else {
            res.send({ 'result': result })
        }
    })
    // companyRepo.postJob(req.body,(error,result) =>{
    //     if(error){
    //         console.log(error)
    //         res.send({'error':error})}
    //     else
    //         res.send({'result':result})
    // })
})
router.post('/postevent', checkAuth, (req, res) => {
    req.body.path = 'postevent'
    kafka.make_request('company-events', req.body, (err, result) => {
        if (err)
            res.send({ 'error': err })
        else {
            res.send({ 'result': result })
        }
    })
    // companyRepo.postEvent(req.body,(error,result) =>{
    //     if(error){
    //         console.log(error)
    //         res.send({'error':error})}
    //     else
    //         res.send({'result':result})
    // })
})

router.post('/listApplicants', checkAuth, (req, res) => {
    req.body.path = 'listApplicants'
    kafka.make_request('company-jobs', req.body, (err, result) => {
        if (err)
            res.send({ 'error': err })
        else {
            res.send({ "result": result })
        }
    })

    // companyRepo.listApplicants(req.body,(err,result)=>{
    //     if (err){
    //         console.log(err)
    //         res.json({"error":err})
    //     }
    //     else{
    //         console.log(result)
    //         res.json({"result":result})}
    // }) 
})

router.post('/listRegistrations', checkAuth, (req, res) => {
    req.body.path = 'listRegistrations'
    kafka.make_request('company-events', req.body, (err, result) => {
        if (err)
            res.send({ 'error': err })
        else {
            res.send({ "result": result })
        }
    })
    // companyRepo.listRegistrations(req.body,(err,result)=>{
    //     if (err){
    //         console.log(err)
    //         res.json({"error":err})
    //     }
    //     else{
    //     console.log(result)
    //     res.json({'result':result})}
    // }) 
})



router.put('/updateStudentstatus', checkAuth, (req, res) => {
    req.body.path = 'updateStudentstatus'
    kafka.make_request('company-jobs', req.body, (err, result) => {
        if (err)
            res.send({ 'error': err })
        else {
            res.send({ "result": result })
        }
    })
    // companyRepo.updateStudentstatus(req.body,(err,result)=>{
    //     console.log(req.body)
    //     if (err){
    //         res.json({"error":err})
    //     }
    //     else{
    //         res.json({'result':result})}
    // })
})

router.get('/profile/:companyId', checkAuth, (req, res) => {
    let body = {
        'company_id': req.params.companyId,
        'path': 'companyProfile'
    }
    kafka.make_request('company-profile', body, (err, result) => {
        if (err)
            res.send({ 'error': err })
        else {
            res.send({ "result": result })
        }
    })

    // companyRepo.getCompanyProfile(req.params.companyId,(err,result)=>{
    //     if(err){
    //         res.json({"error":err})
    //     }   
    //     else{
    //         res.json({"result":result})
    //     }
    // })
})

router.put('/updateprofile', checkAuth, (req, res) => {

    req.body.path = 'companyupdateProfile'
    kafka.make_request('company-profile', req.body, (err, result) => {
        if (err)
            res.send({ 'error': err })
        else {
            res.send({ "result": result })
        }
    })
    // companyRepo.updateCompanyProfile(req.body,(err,result)=>{
    //     if(err){
    //         res.json({"error":err})
    //     }   
    //     else{
    //         res.json({"result":result})
    //     }
    // })
})

router.post('/uploadpic', checkAuth, upload.single('profilepic'), async (request, response) => {
    try {
        if (request.file) {
            const fileContent = fs.readFileSync(`./public/images/${request.body.companyId}${path.extname(request.file.originalname)}`);
            console.log(fileContent)
            console.log(request.body)
            console.log(request.body.companyId);
            const params = {
                Bucket: 'handshakesrinivas',
                Key: request.body.companyId + path.extname(request.file.originalname),
                Body: fileContent,
                ContentType: request.file.mimetype
            };

            console.log(params)

            s3.upload(params, function (err, data) {
                if (err) {
                    console.log(err.message)
                    return response.status(500).json({ "error": err.message })
                }
                // console.log(data);
                console.log('imageid')
                console.log(data.Location)
                let companyDetails = {
                    company_id: request.body.companyId,
                    update: {
                        image: data.Location
                    },
                    path: 'companyupdateProfilepic'
                }

                console.log(companyDetails)

                kafka.make_request('company-profile', companyDetails, (err, result) => {
                    if (err)
                        response.send({ 'error': err })
                    else {
                        response.send({ "result": result })
                    }
                })

                // companyRepo.updateCompanyProfilePic(companyDetails,(err,result)=>{
                //     if(err){
                //         console.log(err)
                //         response.json({"error":err})
                //     }   
                //     else{
                //         response.json({"result":result})
                //     }
                // });
            })
        }
    } catch (ex) {
        const message = ex.message ? ex.message : 'Error while uploading image';
        const code = ex.statusCode ? ex.statusCode : 500;
        return response.status(code).json({ message });
    }
});

router.get('/studentsearch/:studentId', checkAuth, (req, res) => {

    req.body.studentId = req.params.studentId
    req.body.path = "studentsearch"

    kafka.make_request('student-profile', req.body, (err, result) => {
        console.log('in result');
        console.log(result);
        if (err) {
            console.log("Inside err");
            res.json({ 'error': err })
        } else if (result.error) {
            res.json({ 'error': result.error })
        } else {
            console.log("Inside result");
            console.log(result)
            res.json(result);
        }
    });
})

module.exports = router;