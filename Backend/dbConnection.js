// let mysql = require('mysql');
const mongoose = require('mongoose');
import {mongoDB} from './DBconnection/config';

// let connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'Srinisamudrala@24',
//     database: 'mydb'
// });

// let connection = mysql.createConnection({
//   host: 'mydb.cpeud8wxavo2.us-east-2.rds.amazonaws.com',
//   user: 'root',
//   port: '3306',
//   password: 'Srinisamudrala24',
//   database: 'mydb'
// });

// connection.connect(function(err) {
//   if (err) {
//     return console.error('error: ' + err.message);
//   }
 
//   console.log('Connected to the MySQL server.');
// });

var options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  poolSize: 500,
  bufferMaxEntries: 0
};

let connection = mongoose.connect(mongoDB, options, (err, res) => {
  if (err) {
      console.log(err);
      console.log(`MongoDB Connection Failed`);
  } else {
      console.log(`MongoDB Connected`);
  }
});

module.exports=connection