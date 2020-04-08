var express = require('express');
var router = express.Router();
var path = require('path');
var bodyParser = require('body-parser');
const mongoose = require('mongoose');
var cors = require('cors');
var student = require('./Controllers/studentController');
var company = require('./Controllers/companyController');
var message = require('./Controllers/messageController');
var connection = require('./dbConnection');

var port = 3001;
var app = express();
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.use("/student",student)
app.use("/company",company)
app.use("/message",message)

app.listen(port,()=>{
  console.log(`listening to port ${port}`)
})

module.exports = app;
