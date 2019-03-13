require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const port = process.env.PORT;


const indexRouter = require('./routes/index');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


/*---------------------------------------
| API VERSIONS CONFIGURATION [START]
|---------------------------------------*/
var vr1 = express.Router();
var vr2 = express.Router();
vr1.use('/', indexRouter);
app.use('/api/v1', vr1);
app.use('/public', express.static(__dirname + '/Public'));


app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

module.exports = {app};
