var express = require('express');
var kafka = require('../kafka/client');
var router = express.Router();
const { checkAuth } = require("../utils/passport");

router.post('/sendmessage',checkAuth,(req,res) => {
    req.body.path = 'createConversation'
    kafka.make_request('chat',req.body, (err,result) => {
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

router.get('/fetchmessages/:id',(req,res) => {
    console.log(req.params.id)
    req.body.id = req.params.id
    req.body.path = "fetchMessages"
    kafka.make_request('chat',req.body, (err,result) => {
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

module.exports = router;