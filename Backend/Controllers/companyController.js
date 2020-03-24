var express = require('express');
var companyRepo = require('../Repository/companyRepo');
var router = express.Router();
var app = express();
var path = require('path');
var multer = require('multer');
var connection = require('../dbConnection');
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
                cb(null,  req.body.companyId + path.extname(file.originalname))
            }
        }
    });
    const upload = multer({
        storage
    })

router.post('/signup',(req,res) => {
    let body = req.body
    if(body.signup == true){
        companyRepo.signUp(body,(error,result)=>{
            if(error){
                console.log(error)
                res.json({'error':error})
            }else{
                console.log("successs")
                res.json({'result':"signup successful"})
            }
    })
    }else{
    companyRepo.signIn(body,(error,result)=>{
        console.log(result)
        console.log(result.companyId)
        if(error){
            res.json({'error':error})
        }else if(result.length === 0){
            res.json({'error':"invalid user credentials"})
        }else{
            res.cookie('companycookie',"company",{maxAge: 900000, httpOnly: false, path : '/'});
            res.json({'companyId' : result[0]._id})
        }
    })
}
})

router.get('/list-of-jobs-and-events/:companyId/:type',(req,res)=>{
    if(req.params.type == 'jobs'){
        companyRepo.getJoblist(req.params.companyId,(error,result) =>{
            if(error)
                res.send({'error':error})
            else{
                res.send({result})}
        })}else if(req.params.type == 'events'){
            companyRepo.getEventlist(req.params.companyId,(error,result) =>{
                if(error)
                    res.send({'error':error})
                else{
                    console.log(result)
                    res.send({result})}
        })}
})
router.post('/postjob',(req,res)=>{
    companyRepo.postJob(req.body,(error,result) =>{
        if(error){
            console.log(error)
            res.send({'error':error})}
        else
            res.send({'result':result})
    })
})
router.post('/postevent',(req,res)=>{
    companyRepo.postEvent(req.body,(error,result) =>{
        if(error){
            console.log(error)
            res.send({'error':error})}
        else
            res.send({'result':result})
    })
})

router.post('/listApplicants',(req,res)=>{
    console.log("In list applicants from company post request");
    console.log(req.body);
    companyRepo.listApplicants(req.body,(err,result)=>{
        if (err){
            console.log(err)
            res.json({"error":err})
        }
        else{
        console.log(result)
        res.json({'result':result})}
        
    }) 
})

router.post('/listRegistrations',(req,res)=>{
    console.log("In list applicants from company post request");
    companyRepo.listRegistrations(req.body,(err,result)=>{
        if (err){
            console.log(err)
            res.json({"error":err})
        }
        else{
        console.log(result)
        res.json({'result':result})}
        
    }) 
})



router.put('/updateStudentstatus', (req,res)=>{
    companyRepo.updateStudentstatus(req.body,(err,result)=>{
        console.log(req.body)
        if (err){
            res.json({"error":err})
        }
        else{
            res.json({'result':result})}
    })
})

router.get('/profile/:companyId',(req,res)=>{
    console.log(req.params.companyId)
    companyRepo.getCompanyProfile(req.params.companyId,(err,result)=>{
        if(err){
            res.json({"error":err})
        }   
        else{
            res.json({"result":result})
        }
    })
})

router.put('/updateprofile',(req,res)=>{
    console.log(req.body)
    companyRepo.updateCompanyProfile(req.body,(err,result)=>{
        if(err){
            res.json({"error":err})
        }   
        else{
            res.json({"result":result})
        }
    })
})

router.post('/uploadpic', upload.single('profilepic'), async (request, response) => {
    try {
      if (request.file) {
        const fileContent = fs.readFileSync(`./public/images/${request.body.companyId}${path.extname(request.file.originalname)}`);
        console.log(fileContent)
        console.log(request.body)
        console.log(request.body.companyId);
        const query = 'update mydb.company set profilepic=? where companyId=?';
        console.log('upload pic')
        const rows = await connection.query(query, [fileContent, request.body.companyId]);
  
        return response.status(200).json({ "message": "success" });
      }
    } catch (ex) {
      const message = ex.message ? ex.message : 'Error while uploading image';
      const code = ex.statusCode ? ex.statusCode : 500;
      return response.status(code).json({ message });
    }
  });

module.exports = router;