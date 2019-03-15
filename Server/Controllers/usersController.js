const _ = require('lodash');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const multer = require('multer');
var {mongoose} = require('../db/mongoose');
var {User} = require('../models/user');




var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './Public/avatar');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now()+'.jpg');
  }
});

 var upload = multer({storage: storage},{fileFilter:function(req, file, callback){
    var ext = path.extname(file.originalname);
    if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            return callback(new Error('Only images are allowed'));
    }
    callback(null, true);
 }}).single('avatar');

/********User Register API******************/
module.exports.addUser = function(req,res){
   
    var body = _.pick(req.body, ['mobile_no', 'country_code','email','name','password']);
    var user = new User(body);
    user.save().then(() => {

      return user.generateAuthToken();

    }).then((token) => {
      user.saveOtp();
      res.header('x-auth', token).send({Status:200,message:'User added successfully',data:user});
    }).catch((e) => {
      
      if(e.code == '11000'){
        res.status(200).send({Status:0,message:'Email or mobile number already in used',data:{}});
      }else{
        res.status(400).send(e);
      }

    })
}

/********Login API***********/
module.exports.loginUser = (req,res)=>{
  var body = _.pick(req.body, ['mobile_no', 'password']);
  //console.log(body);
  User.findByCredentials(body.mobile_no, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
        res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(200).send({Status:0,message:'Please enter valid credentials',data:{}});
  });
}

/**********Verify OTP API******************/
module.exports.verifyotp = (req,res) =>{

  var body = _.pick(req.body, ['otp']);

  userOtp = body.otp;

  systemOtp = req.user.otp;

  if(userOtp != systemOtp){

    res.status(200).send({Status:200,message:'Otp does not match',data:{}});

  }else{

    body.is_mobile_verify = 1;

    id = req.user._id;

    User.findOneAndUpdate({_id:id}, {$set: body}, {new: true,fields:{}}).then((user) => {

      if (!user) {
        return res.status(404).send();
      }
     var token = req.headers['x-auth'];

     res.header('x-auth', token).send({Status:200,message:'Otp match successfully',data:user});

    }).catch((e) => {

      res.status(400).send();
      
    });
  }
}

/**
 * @auther Dileep Singh
 * @desc method for user information
 * @date 17-12-2018
 * @type {[type]}
 */
module.exports.getUserInformation = (req,res) =>{
    res.send(req.user);

}

/***************Update password***************/
module.exports.updatePassword = (req,res) =>{
  var body = _.pick(req.body, ['password']);
  var token = req.headers['x-auth'];
      password = body.password;
      if(password == ''){
        res.header('x-auth', token).send({Status:200,message:'Please enter the password',data:{}});
      }else{
        passwordHash = req.user.updatePasswordHash(password);
        res.header('x-auth', token).send({Status:200,message:'Password updated successfully',data:{}});
      }
}
/**********Logout user***********/
module.exports.logoutUser = (req,res) =>{
  req.user.removeToken(req.token).then(() => {
        res.send({Status:200,message:'User logout successfully',data:{}});
    }, () => {
      res.status(400).send('test');
    });
}


module.exports.updateUserInformation = (req,res) =>{

  var body = _.pick(req.body, ['name', 'email','homeaddress','workaddress']);
  var token = req.headers['x-auth'];
  
  User.findById(req.user.id, function (err, user) {
    if (!user) {
        return res.send({Status:0,message:'User not found',data:{}});
    }

     var name = body.name.trim();
     var homeaddress = body.homeaddress;
     var workaddress = body.workaddress;
     if(!name){
       return res.send({Status:0,message:'User name is missing',data:{}});
     }
  
     user.name = name;
     user.address.Home = homeaddress;
     user.address.Work = workaddress;
     user.save().then(()=>{
       return res.send({Status:200,message:'Profile updated successfully',data:user})
     }).catch((e) => {
       res.status(400).send(e);
     });

  });
}


/**
 * [Method for uplaoad user profile pic]
 * @param  {[type]} req [avatr file]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 * @auther Dileep Singh
 * @date 10-12-2018
 */
module.exports.uploadProfile = (req,res)=>{
  upload(req,res,function(err) {
    if(err) {

     return res.send({Status:0,message:'Invalid file',data:{}})
   }

   user = req.user;
   user.avatar = req.file.filename;
   user.save();
   return res.send({Status:200,message:'Profile pic upload successfully',data:{}});
});
}

/**
 * @auther Dileep Singh
 * @date 10-12-2018
 * @desc method for check Register mobile number
 */
module.exports.checkmobile = (req,res)=>{
  var body = _.pick(req.body, ['mobile_no']);

  if(body.mobile_no == undefined || body.mobile_no == ''){
    return res.send({Status:200,message:'Mobile number is missing',data:{}});
  }

  User.find({
    mobile_no: body.mobile_no
  }).then((user)=>{
     if(user.length > 0){
           return res.send({Status:200,message:'Valid mobile number',data:{}});
     }else{
         return res.send({Status:0,message:'Invalid mobile number',data:{}});
     }


  }).catch((e) => {
    console.log('fail');
    res.status(400).send();
  });
}
