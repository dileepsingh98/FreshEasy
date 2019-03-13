var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var promise = mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/Fresheasy', {
  //useMongoClient: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  /* other options */
});


module.exports = {mongoose};
