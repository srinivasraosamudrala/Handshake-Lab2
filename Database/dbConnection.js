const mongoose = require('mongoose');
const mongoDB= 'mongodb+srv://handshakeuser:handshake@cluster0-e4iwa.mongodb.net/test?retryWrites=true&w=majority'

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